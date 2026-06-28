---
title: "认识 Horizon UI · 1/17：SkyWalking 新一代可观测性控制台"
date: 2026-06-21
author: 吴晟
description: "介绍 Apache SkyWalking Horizon UI：它沿用现有 OAP 后端协议，重新设计前端控制台，让观测、运维、治理和定制回到同一个入口。"
tags:
  - Release
  - Cloud Native
---

*本文翻译自英文原文：[Meet Horizon UI · 1/17: SkyWalking's New Observability Console](/blog/2026-06-21-skywalking-horizon-ui-introduction/)，发布日期沿用原文日期。*

Apache SkyWalking Horizon UI 是 SkyWalking 的新一代 Web 控制台。它仍然连接你已经在运行的 OAP 后端：同样的 GraphQL 查询协议，同样的 admin REST 接口，同样的 MQE 语言，同样的 `Layer` 概念。换句话说，你可以直接把 Horizon 指向正在运行的 OAP，然后登录使用，不需要改后端。变化集中在这些后端协议之上的整套交互体验。

这是这个系列的第一篇。后续文章会依次介绍仪表盘和指标查询语言、拓扑视图、整个部署的 WebGL 3D 地图、链路和日志探索器、性能剖析、运维界面、访问控制，以及把这些模块串起来的配置化定制。本篇先交代背景：Horizon 是什么，整个 UI 围绕哪一个核心想法构建，以及今天如何把它接到你的 OAP 前面。

Horizon 的主线可以概括为四件事：先 **observe**，看拓扑、链路、日志、五类性能剖析、只读告警，以及每个 Layer 的仪表盘；再 **operate** 这些被观测对象；然后 **govern** 谁可以操作它们；最后在不写 UI 代码的情况下 **customize** 整个控制台。Observe、operate、govern、customize，就是这个系列的主线。我们从每次会话都会看到的地方开始：侧边栏。

## 侧边栏就是你的系统全貌

打开 Horizon，左侧边栏不是手工写死的菜单，而是 OAP 当前上报内容的实时映射。Horizon 会向 OAP 查询有哪些 Layer、哪些 Layer 里有服务，然后只渲染这些内容，并每 60 秒刷新一次。某个 Layer 开始上报，它就出现；安静下来，它就消失。菜单不会和真实状态脱节，因为它直接来自 OAP 当前状态。

![图 1：Horizon 首页，左侧是系统全貌（Layer 分组为 Virtual Targets、Istio、Kubernetes 和 MQ，并显示实时的 "13 with services" 计数），右侧是跨 Layer 的 Services 概览。](/screenshots/horizon-0.7.0/p01-intro-01-sidebar-is-the-estate.webp)
图 1：Horizon 首页，左侧是实时系统全貌，右侧是跨 Layer 的 Services 概览。</br>

这个侧边栏有几个关键点：

- **实时服务计数。** **Layers** 标题显示当前有多少个 Layer 包含服务，图 1 中是 *13 with services*。展开每个 Layer 后，也能看到它自己的服务数量。这些计数来自同一个服务端目录，整个 UI 共用，并且每分钟刷新一次，所以侧边栏、告警 Layer 标记器和落地页不会因为各自轮询而出现不一致。
- **按组组织，而不是平铺列表。** Layer 会放在自己的分组下，比如 *Virtual Targets*、*Istio*、*Kubernetes*、*MQ*。顶部是 **Overviews** 和 **Alarms**，运维和管理区域（Cluster Status、Alerting rules、DSL Management、Users、Roles & permissions）放在更靠下的位置，并且只对有权限的角色展示。访问控制直接进入菜单生成逻辑，而不是事后再补一层。
- **不会静默隐藏内容。** OAP 上报的每个 Layer 现在都会出现。即使没有内置模板，也会回退到一个普通的 Service 页面。过去有一份写死的 "hidden layers" 列表，会悄悄隐藏 `BanyanDB` 这样的 Layer；现在这件事被移除了。想隐藏某个 Layer，需要在 `horizon.yaml` 里通过 `layers.excluded` 明确配置。默认值是 `FAAS` 和 `VIRTUAL_GATEWAY`；清空列表就可以展示所有 Layer。

点击任意 Layer，Horizon 会打开它的第一个可用标签页。所有 Layer 都沿用同一条固定路径：

```text
service → instance → endpoint → topology → trace → logs → profiling
```

槽位名称会跟随 Layer 的语义变化。图 2 中的 General Service Layer 会把 endpoint 槽位命名为 **API**，增加一个 **API dependency** 视图，并把 **Profiling** 展开成它实际拥有的引擎：Trace、eBPF、pprof（Go）和 Async。某个 Layer 不支持的标签页会在模板里直接关掉，所以你不会打开一个空页面。选中一个服务后，右侧画布就是这个服务的仪表盘：上方是一排 KPI（RPM、Apdex、错误率，每个都有自己的 sparkline），下方的组件网格只查询当前服务相关数据。

![图 2：展开一个 Layer 后，它会展开成完整操作路径。这里 General Service 显示 Service、Instances、API、Topology、API dependency、Traces、Logs 和四个 profiling 引擎，右侧画布显示选中服务的仪表盘。](/screenshots/horizon-0.7.0/p01-intro-02-layer-drilldown.webp)
图 2：展开一个 Layer 后进入完整流程，左侧是标签路径，右侧是选中服务的仪表盘。</br>

## 不再给你一个空白页

一个跟随实时数据变化的控制台，必须能处理“没有数据”的时刻：全新安装、配置不完整的部署，或者刚刚重启的 OAP。Horizon 把这些情况都作为明确状态处理，而不是留给用户一个死胡同。

打开 `/` 时，Horizon 会按顺序跳到一个真实可用的页面：第一个可用的公共 overview 仪表盘；如果没有，就进入第一个有服务的 Layer；只有两者都不存在时，才展示空落地页。真的进入空页面时，它会用明确语言告诉你问题在哪里：**"No data is flowing yet"** 表示还没有任何内容上报，**"No dashboard configured yet"** 表示已经有服务，但没有配置 overview。它会把问题指向数据接入或运维配置，而不是把你丢在一个空网格上。只要有服务开始上报，或者运维人员发布了仪表盘，下一次 60 秒刷新就会把空页面替换成真实页面。

![图 3：空落地页明确说明当前状态。这里是 "No dashboard configured yet"（服务已经上报，但没有配置 overview），而不是显示空仪表盘。](/screenshots/horizon-0.7.0/p01-intro-03-empty-no-dashboard-configured.webp)
图 3：空落地页说明真实原因。这里是服务已经上报，但没有配置 overview，而不是给出一个空仪表盘。</br>

OAP 短暂不可达时，Horizon 也遵循同样思路。如果后端短时间连不上，Horizon 会保留最后一次已知的侧边栏结构，并显示 "OAP unreachable" 横幅，服务计数标记为未知，直到恢复为止。短暂故障不会看起来像配置突然消失。

当数据正常流入时，落地页就是图 1 里看到的总览页：跨 Layer 概览、按类型拆分的服务卡片（General services、Virtual databases、caches、MQs、GenAI）、实时拓扑和活跃告警栏。每个 Layer 自己的落地页会按你选择的列真正计算 top-N 服务，不再先截取任意前 25 个再排序；页面还会告诉你 "top N of M"，所以截断不会悄悄发生。

长 Layer 名称和深命名空间很常见，所以页面框架需要给内容让出空间：拖动分隔线可以调整侧边栏宽度，双击重置；也可以折叠成一条窄图标栏，把水平空间尽量交给画布。宽度会按浏览器记住。

![图 4：拖动分隔线加宽侧边栏，长 Layer 名称和命名空间不再被截断。](/screenshots/horizon-0.7.0/p01-intro-04-resize.webp)
图 4：拖动分隔线加宽侧边栏，长名称不再被截断，宽度会按浏览器记住。</br>

![图 5：把侧边栏折叠成窄图标栏，把每一个水平像素都留给画布。](/screenshots/horizon-0.7.0/p01-intro-04-fold-rail.webp)
图 5：需要最大画布空间时，可以把侧边栏折叠成窄图标栏。</br>

## 新增一层，后续功能才有基础

过去，SkyWalking Web UI 是浏览器直接访问 OAP。Horizon 在中间加了一小层基础设施：**Backend-for-Frontend (BFF)**，一个运行在 Node.js 上的 Fastify 服务。它负责提供 UI，并代理所有到 OAP 的调用。

![架构图：浏览器只访问 Horizon BFF（运行在 Node.js 上的 Fastify 服务）。BFF 处理认证和会话、RBAC 校验、审计日志、能力探测和缓存、服务端 i18n 与组件开关，然后代理到 OAP 的 GraphQL query host（端口 12800）和 admin host（端口 17128）。](/screenshots/horizon-0.7.0/p01-intro-architecture.svg)
*浏览器只访问 BFF；BFF 负责 auth、RBAC、audit、capability probing，以及服务端 i18n / widget gating，然后代理到 OAP 的 query host（`:12800`）和 admin host（`:17128`）。*

后续文章里很多能力都依赖这一层。认证、基于角色的访问控制和审计都在服务端执行，伪造请求绕不过去。BFF 启动时会探测一次 OAP 的 GraphQL schema，某个能力不存在时就优雅降级；Horizon 能用同一个构建支持两代 OAP，靠的就是这个机制。它还会每分钟缓存一次服务目录，让整个 UI 对系统全貌持有同一份视图。运维、安全和定制相关的文章会分别展开这些内容；这里先记住一点：现在这里有一个服务端，它承担了实实在在的工作。

## 用 3D 看整个部署

有一个界面值得先提前看，因为它最能表达“后退一步，一次看清全局”的想法：**3D Infrastructure Map**。每个 Layer 的服务都会变成立方体，堆叠到按请求流向排列的层级上，实时流量、告警和调用关系都画在它们之间。拖动即可旋转：

{{< map3d poster="/images/home/horizon-3d-map.png" badge="交互演示 · 示例数据" >}}

后续有一篇专门拆解 3D 地图：层级、告警信标、让健康对象变暗、只突出告警对象的 "Beacon mode"，以及配置它的结构化编辑器。现在先把它当成 Horizon 目标的一个缩影：整个部署放在一个视图里，而且是活的。

## 这个系列会讲什么

本篇之后，后续文章会分别介绍 Horizon 的不同模块。可以按任意顺序阅读，每篇也都会链接回这里。它们分成四条主线。

**看见你的数据**

1. **Dashboards & MQE**：只查询当前对象相关数据的组件、指标格式化、同步十字线和多对象对比。
2. **Topology & service dependency**：一套可为每个 Layer 重绘的拓扑引擎、降噪过滤器和多跳 API dependency 图。
3. **The Deployment tab & BanyanDB self-observability**：深入单个集群服务内部的视图，以及 SkyWalking 终于像观测其他对象一样观测自己的数据库。
4. **The 3D Infrastructure Map**：详细展开上面这个 3D 视图。
5. **Trace explorer**：在时延散点图上框选慢 Trace，然后用三种方式阅读同一条 Trace。
6. **Log explorer**：类似 Loki 的日志流，带 facets、top patterns 和结构化内容。
7. **Browser & RUM monitoring**：前端错误日志，以及把混淆后的栈恢复到原始源码行。
8. **Five profilers, one flame graph**：trace、async-profiler、eBPF、Go pprof 和 network profiling，统一到同一套工作方式里。

**运维**

9. **Alarms & incident triage**：以 incident 为中心的活跃告警，并带上触发它的图表。
10. **Runtime rules, live debugging & inspect**：可热加载规则，以及用实时样本逐步调试 OAL（traces）、MAL（metrics）和 LAL（logs）的 Live Debugger。
11. **Platform & cluster introspection**：在 UI 里查看 OAP 集群健康、最终解析后的配置和数据保留策略。

**治理与安全**

12. **Access control & security**：服务端强制执行的 RBAC、LDAP/AD、审计轨迹和 break-glass，让 UI 可以进入企业部署。

**定制与接入**

13. **Customization: config-driven layer templates**：从 draft 到 publish，不写 UI 代码也能增加一个全新的被监控 Layer。
14. **Localization**：八种语言的仪表盘，并且可以在实时预览里点击组件完成翻译。
15. **Getting started & migration**：安装、OAP 版本矩阵，以及如何用 Horizon 替换现有 UI。

## 今天就接到你的 OAP 上试试

Horizon 可以运行在你已有的 OAP 之上。在今天的 **OAP 10.x** 上，绝大多数功能已经可用：所有仪表盘、拓扑、Trace（原生和 **Zipkin**）、日志、告警，以及五类性能剖析，都通过 OAP 的 query host（`:12800`）渲染。Horizon 的访问控制、审计和主题运行在 BFF 里，不依赖 OAP 版本。需要等待 **OAP 11.0** 的是 *operate* 层：runtime-rule（DSL）管理、Live Debugger、Metrics Inspect、告警规则编辑器、Cluster Status 管理面板，以及把模板编辑发布回 OAP。这些依赖 admin host（`:17128`），即将随 OAP 11.0 发布。Horizon 会按 admin module 是否存在来探测能力，10.x 不能提供的页面会直接隐藏；完整观测控制台今天就能跑在 10.x 上，迁移到 11.0 后运维工具会自动亮起来。

把 Horizon 指向已有集群即可启动，不需要改后端。仍然是你的部署已经在使用的那个 OAP：

```sh
docker run -d --name horizon \
  -p 8081:8081 \
  -v "$PWD/horizon.yaml:/app/horizon.yaml:ro" \
  -v horizon-state:/data \
  ghcr.io/apache/skywalking-horizon-ui:<version>
```

最小化的 `horizon.yaml` 只需要说明 OAP 在哪里，以及一个可登录的本地用户：

```yaml
oap:
  queryUrl: http://<oap-host>:12800
  adminUrl: http://<oap-host>:17128
auth:
  backend: local
  local:
    users:
      - username: admin
        passwordHash: "$argon2id$v=19$..."   # generated, never plaintext
        roles: [admin]
```

打开 `http://<host>:8081/`，登录后第一站是 **Cluster Status**，确认 Horizon 和 OAP 能正常通信。之后侧边栏就会填入你的系统全貌。

完整安装路径，包括 binary tarball、Kubernetes、LDAP、TLS 和生产检查清单，请看 [Horizon UI 文档](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/readme/)。左侧菜单里覆盖了安装、兼容性、访问控制、定制、组件和运维。

## 其他值得注意的点

- **可以直接接入现有 OAP。** Horizon 是一次从零开始的重写，但保留了所有后端契约：同样的 GraphQL 查询协议、admin REST 接口、MQE 语言和 `Layer` 概念。所以你可以把它指向一个正在运行的集群，不改后端。今天的 **OAP 10.x** 已经能运行完整观测控制台（仪表盘、拓扑、包括 **Zipkin** 在内的 Trace、日志、告警、性能剖析），以及 Horizon BFF 侧的访问控制、审计和主题。只有 *operate* 工具链需要等待 OAP 的 **admin host**（`:17128`），也就是随 **OAP 11.0，即将发布** 的 runtime rules、Live Debugger、Inspect、Cluster Status admin pane 和模板编辑发布。
- **暗色优先，高密度。** 12 列网格面向 incident 扫描设计，首屏承载更多信号，减少不必要留白。
- **基于现代技术栈。** 前端是 Vue 3 + TypeScript on Vite、Pinia、Apache ECharts、D3 和 Monaco；BFF 使用 Node.js 上的 Fastify。
- **Apache 许可证，社区共建。** Horizon UI 位于 [apache/skywalking-horizon-ui](https://github.com/apache/skywalking-horizon-ui)。欢迎接到你的集群上试用，也欢迎告诉我们缺什么，issue 和 pull request 都可以。

下一篇：仪表盘，以及为什么一个组件可以在服务端判断自己不适用于当前对象，并且连查询都不发。
