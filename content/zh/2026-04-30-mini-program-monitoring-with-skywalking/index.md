---
title: "用 SkyWalking 监控微信和支付宝小程序"
author: "吴晟"
date: 2026-04-30
description: "SkyAPM/mini-program-monitor 与 SkyWalking OAP 配合，把微信和支付宝小程序纳入 SkyWalking 的端用户体验监控。本文聚焦数据通路、双平台抽象与 OAP 端集成。"
tags:
  - Agents
  - Community
  - Tracing
---

小程序是国内移动端体验里绕不过去的一块，但开源监控生态长期偏向 Web 浏览器和原生 App。SkyWalking 自身已经覆盖了浏览器（client-js）、iOS、服务端，缺口主要在小程序和 Android。[SkyAPM/mini-program-monitor](https://github.com/SkyAPM/mini-program-monitor) 加入 SkyWalking 生态后，把这块缺口的小程序部分补上了 —— 一份 SDK 同时支持微信和支付宝，OAP 端的 component、MAL 规则、UI 模板已经合进 main 分支，会随 10.5.0 一起发布。

这篇博客面向已经跑着 SkyWalking 后端、希望把小程序也接进来的团队。重点不是"项目存在"这件事，而是数据从小程序到 SkyWalking dashboard 走的是哪条路、双平台是怎么共存的、以及上线之前需要知道哪些设计取舍。

## 数据通路

SDK 走两条腿：

- **OTLP HTTP**（错误日志、性能指标、请求指标）→ OAP 的 `/v1/logs`、`/v1/metrics`
- **SkyWalking 原生协议**（链路追踪 segment，可选）→ OAP 的 `/v3/segments`

为什么不是单协议？OTLP 已经覆盖了 logs 和 metrics 两类信号，没必要再造一份原生 endpoint；但分布式追踪上 OAP 的原生 `SegmentObject` 比 OTLP traces 表达力更贴 SkyWalking 自己的 trace 模型，且与服务端通过 `sw8` header 透传时无需任何转换。所以追踪走原生，其它走 OTLP，两边都不绕路。

OTLP 默认用 protobuf，调试时可切成 JSON。SDK 没有任何运行时依赖。

## 双平台对应两个独立的 Layer 与监控面板

很多团队会同时维护一个微信小程序和一个支付宝小程序，业务逻辑共享一个后端。这套设计没有把它们塞进同一个 service 用 tag 区分，而是直接做成两个独立的 Layer：`WECHAT_MINI_PROGRAM` 和 `ALIPAY_MINI_PROGRAM`，对应两套独立的监控面板。SDK 在每个信号上打 resource 属性 `miniprogram.platform = wechat | alipay`，并给两端各分配独立的 component ID（微信 10002、支付宝 10003）。

OAP 这一头是用 MAL 规则的 `filter` 把数据在 ingest 阶段就分流到对应 Layer 的：

```yaml
metricPrefix: meter_wechat_mp
filter: "{ tags -> tags.miniprogram_platform == 'wechat' }"
```

支付宝那份规则同理过滤 `alipay`。两份规则互斥，不会重复计数；输出的 metric 前缀也不一样（`meter_wechat_mp_*` vs `meter_alipay_mp_*`），各自落在对应 Layer 的 dashboard 上。即使两端用同一个 `service.name`（比如都叫 `mini-program-demo`），UI 里也是两套完全独立的入口。

## 不对等的指标语义

这是这套设计里我特别想强调的一处诚实选择。微信的基础库提供 `PerformanceObserver`，能拿到来自渲染层的权威时序：app launch、first render、route navigation、script execution、sub-package load 都是真实指标。支付宝的基础库不提供等价 API，SDK 只能用生命周期回退做近似：`App.onLaunch → App.onShow` 的 delta 当作启动时间，渲染相关的拿不到。

所以两份 OAP 规则里的 metric 集合不对等：

- 微信：`app_launch_duration`、`first_render_duration`、`route_duration`、`script_duration`、`package_load_duration`、`request_duration_percentile`、`request_cpm`
- 支付宝：`app_launch_duration`、`first_render_duration`、`request_duration_percentile`、`request_cpm`

支付宝侧的 `app_launch_duration` 是生命周期近似值，与微信的渲染层数值不可直接对比，这一点在 dashboard 的字段提示里也写明了。把两个数字放一起做横评等于在比较两种不同测量定义。

## SDK 端做了什么

四类信号：

- **错误**：JS 异常 / unhandled promise rejection / pageNotFound 走 OTLP logs，按 OTel `exception.*` 语义约定（`exception.type`、`exception.stacktrace`），下游不光 SkyWalking，OTel Collector / Grafana 也都认。
- **性能**：上面那张表里那些。OTLP gauge。
- **请求**：`wx.request` / `my.request` / `downloadFile` / `uploadFile` 都走 OTLP delta histogram，每个 flush 间隔（默认 5s）发一次增量。`le` 桶标签直接用 ms，OAP MAL 里显式声明 `MILLISECONDS` 阻止默认的 SECONDS→MS 缩放。失败请求（4xx/5xx/超时）额外发一条错误日志，方便从 dashboard 跳到具体错误。
- **追踪（可选）**：开启后给出站请求注入 `sw8` 头，落到 OAP 后能与服务端 trace 拼成一条完整链路。trace 段以 SkyWalking `SegmentObject` 形式发出，不走 OTLP traces。

可靠性和基数控制的两个细节值得一提：

**App hide 时落本地存储**。小程序后台一段时间会被框架杀掉，弱网时也容易丢包。SDK 在 `onAppHide` 时把未发送的事件写到 `wx.setStorage` / `my.setStorage`，下次启动恢复并继续上报。

**反基数膨胀**。强烈建议把 `serviceInstance` 设成应用版本号（如 `1.4.2`），不要用设备 ID —— 小程序日活百万级时设备 ID 维度直接把 OAP 的 instance 索引打爆。请求路径方面 SDK 提供 `urlGroupRules` 正则把 `/api/user/12345` 这类参数化路径归并到 `/api/user/{id}`，避免 endpoint 维度也膨胀。

## OAP 端要做什么

如果你用的是 main 分支或者 10.5.0 之后的发布版，下面这些已经内置：

- `config/component-libraries.yml`：注册了 `WeChat-MiniProgram: 10002` 和 `AliPay-MiniProgram: 10003`
- `config/otel-rules/miniprogram/`：四份 MAL 规则，按 service / instance 维度分别定义
- `config/ui-initialized-templates/wechat_mini_program/` 和 `alipay_mini_program/`：root / service / instance / endpoint 四张 dashboard
- `config/ui-initialized-templates/menu.yaml`：把两个 layer 注册到 Mobile 菜单组下

唯一需要做的就是确认 OTel receiver 启用、给 OTLP HTTP 一个 SDK 能直连的端口。SkyWalking OAP 的 OTLP HTTP handler 默认绑在 receiver-sharing-server 的端口上，而该端口默认值是 0（即复用 core REST 端口 12800）。如果想让 SDK 用标准 OTLP HTTP 端口 4318，把 sharing 端口设到 4318：

```bash
docker run -d --name sw-oap \
  -p 11800:11800 -p 12800:12800 -p 4318:4318 \
  -e SW_STORAGE=banyandb \
  -e SW_STORAGE_BANYANDB_TARGETS=banyandb:17912 \
  -e SW_OTEL_RECEIVER=default \
  -e SW_RECEIVER_SHARING_REST_PORT=4318 \
  apache/skywalking-oap-server:latest
```

这样所有 receiver（OTLP + native segment + browser perf + log report）一起搬到 4318，GraphQL 仍在 12800 给 UI 用。

SDK 端配置最小集：

```js
import MiniProgramMonitor from 'mini-program-monitor';

MiniProgramMonitor.init({
  service: 'mini-program-demo',
  serviceInstance: '1.4.2',          // 推荐：应用版本号
  collector: 'http://your-oap:4318',
  enable: {
    error: true,
    perf: true,
    request: true,
    tracing: false,                  // 默认关，按需开
  },
});
```

微信和支付宝两端配置一模一样，平台标签由 SDK 在运行时自动判定。

## 兼容性

- 微信基础库 ≥ 2.11
- 支付宝基础库 ≥ 2.0
- Apache SkyWalking OAP main 分支或 ≥ 10.5.0；OTLP HTTP receiver 启用即可
- 也可对接任意 OTLP 后端（OpenTelemetry Collector、Grafana 等），但那条路上拿不到 SkyWalking 专属的双平台 dashboard

## 后续

参与方式直接去 [SkyAPM/mini-program-monitor](https://github.com/SkyAPM/mini-program-monitor) 提 issue / PR。仓库里有一个 `make preview` 一键拉起 OAP、UI、两端模拟器的本地 demo 环境，想看效果可以直接跑。

Android 端的端用户体验监控目前还是 SkyWalking 生态的空白，欢迎对这块感兴趣的同学一起补齐。
