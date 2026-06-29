---
title: "认识 Horizon UI · 12/17：Inspect，跨 layer 查询工具"
date: 2026-06-29
author: 吴晟
description: "Horizon UI 系列第十二篇：Operate 下的 Inspect 家族，包括能看到每个指标由哪条规则定义的指标目录和 MQE 看板，以及不必先选择 layer 就能在全局范围查询的 trace 和 log 入口。"
tags:
  - Engineering
  - Metrics
---

*译自英文原文：[Meet Horizon UI · 12/17: Inspect — Cross-Layer Query Power-Tools](/blog/2026-06-29-horizon-ui-inspect-cross-layer-query/)。*

这是 [Meet Horizon UI](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列的第十二篇，仍然属于第三幕 **operate it**。[Trace Explorer](/zh/2026-06-22-horizon-ui-trace-explorer/) 和 [Log Explorer](/zh/2026-06-23-horizon-ui-log-explorer/) 的入口方式很一致：先选 layer，再选 service，然后搜索。如果你已经知道要看哪个服务，这个流程很顺。但有些时候，你并不知道入口在哪：手里只有一个 trace id，却不知道它属于哪个 layer；告警里只有一个出问题的 service name；或者你只是想把某个指标拿出来，在所有实体上画一遍。**Operate** 下的 **Inspect** 家族就是为这些场景准备的：三个跨 layer 查询入口，去掉“先选 layer”这一步；其中一个甚至没有对应的单 layer 版本。

## Metrics inspect：指标目录，以及每个指标背后的规则

SkyWalking 会计算大量指标，但过去没有一个地方能把它们完整列出来。**Metrics inspect** 补上了这个视图。它的 catalog drawer 会列出当前连接的 OAP 计算出的所有指标，并按**定义这些指标的规则**分组：也就是上一篇里讲过的 OAL 文件和 MAL 规则集。你可以按来源过滤（OAL、MAL·OTel、MAL·Telegraf、LAL→MAL），也可以按名称搜索，并直接看到每个指标的 value type 和 scope。

![图 1：Metrics inspect 的 catalog drawer：指标按定义它们的 OAL 文件或 MAL 规则集分组，支持 source 过滤、搜索，并展示每个指标的 type 和 scope。](/screenshots/horizon-0.7.0/p12-inspect-01-metrics-catalog.webp)
图 1：Metrics inspect 的指标目录：OAP 计算的所有指标按定义规则分组，也就是 DSL management 里的 OAL 文件和 MAL 规则集；可以按 source 和 scope 过滤，再把指标选到看板上。</br>

从目录里选中指标后，它们会进入一个图表 **board**。你可以选择要画哪些实体：从 OAP 返回的分页 top-N 里选，或者手动输入实体名；图表可以用 line、bar 或 area 展示。每个 widget 都会带上规则来源和 scope，所以你始终能从“这个数”追溯到“是哪条规则算出了这个数”。它也可以当作一个 MQE 临时看板：时间范围保存在浏览器本地，但发送给 OAP 时会转成服务端时间；board 本身也保存在浏览器里；那些只存在于共享存储、但不由当前连接的 OAP 定义的指标，也可以作为 *foreign* metrics 加进来。

![图 2：Inspect board 上的一张指标图，带 OAL 来源和 Service scope 标签；每个 widget 有自己的 entity 分页器，并用多实体折线图展示数值。](/screenshots/horizon-0.7.0/p12-inspect-02-metrics-board.webp)
图 2：Inspect board：任选一个指标，在多个实体上画图；每个 widget 保留规则来源（OAL）、scope（Service）、独立的 entity 分页器，以及一个浏览器本地保存、提交给 OAP 时转换成服务端时间的时间范围。</br>

## Trace inspect：不用先选 layer，也能找 trace

**Trace inspect** 可以理解成拿掉 layer 限制的 [Trace Explorer](/zh/2026-06-22-horizon-ui-trace-explorer/)。**Target** 是可选的：你可以通过 layer → service → instance → endpoint 级联选择服务，也可以直接输入一个名字（并标记它是真实存在还是推测出来的），还可以**留空 Target，一次查询所有 service**。之后照常设置查询条件：trace id、status、排序、duration 范围、tags 和时间窗口，然后点击 **Run query**。界面会显示一行解析后的查询，写清楚实际发给 OAP 的调用；结果仍然是你熟悉的分布散点图、trace 列表和三视角 waterfall，只是不再绑在某个 layer 上。

![图 3：Trace inspect 留空 target 后的查询结果：分布散点图、trace 列表，以及一条跨五个服务的 trace waterfall。](/screenshots/horizon-0.7.0/p12-inspect-03-trace.webp)
图 3：Trace inspect 不需要先选 layer：Target 留空即可查询所有 service，也可以选择或输入某个 service。这里一条 trace 跨过五个服务（`agent::ui` → `frontend` → `app` → `gateway` → `songs`）；解析后的查询行展示了实际 OAP 调用（`native · queryTraces`）。</br>

## Log inspect：一次入口，三类日志

**Log inspect** 对 log 做同样的事：可以跨 layer 查询任意 service，选择它、输入它的名字，或者直接留空。它还通过 **Source** 切换，把三类日志放到同一个入口里：

- **Raw**：存储下来的 service logs，可以跨 service 流式查询，支持 tag 和 trace id 条件；每一行都能打开和单 layer [Log Explorer](/zh/2026-06-23-horizon-ui-log-explorer/) 相同的 payload 弹窗；
- **Browser**：来自 BROWSER layer 的 JS errors，按 category 查询，并使用 Browser Errors 那篇里讲过的 source map 反混淆；
- **Kubernetes Pod logs**：按需 live tail 某个 pod 的 container logs，支持 Start / Pause 和 Include/Exclude 正则过滤，不会持久化。

![图 4：Log inspect 的 Raw source：Raw / Browser / Kubernetes Pod logs 三种来源切换、留空 target，以及跨 service 的日志流。](/screenshots/horizon-0.7.0/p12-inspect-04-log-sources.webp)
图 4：Log inspect 可以跨 layer 查询任意 service，也可以留空 target；三种 source 分别对应 Raw 存储日志、Browser JS errors 和 Kubernetes Pod logs。这里展示的是多个 service 同时输出的 raw logs。</br>

## 它在哪里运行

这三个入口都在 **Operate** 下，共用一个权限：`inspect:read`。但它们访问后端的方式不同。**Trace inspect** 和 **Log inspect** 走 OAP 标准 query protocol，也就是 dashboard 和单 layer explorer 使用的同一套接口；所以它们始终可用，也兼容 10.x OAP。**Metrics inspect** 是例外：它通过 **admin host** 的 `inspect` 模块读取 OAP 的指标目录和实体枚举，因此需要 OAP 11。如果模块不存在，页面会给出明确的 *"set `SW_INSPECT=default`"* 提示，而不是只显示一个不可用的页面；另外两个入口仍然可以正常使用。可以把这组三个入口看成 Trace 和 Log explorer 在 Operate 侧的跨 layer 版本，再加上一个终于能回答“这个后端到底在算哪些指标、这些指标由哪条规则定义”的指标目录。

## 后续阅读

字段参考，包括指标目录、实体枚举、foreign metrics 和 MQE 执行，可以看 [Inspect 文档](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/operate/inspect/)。

下一篇是 **Platform & Cluster Introspection**：Cluster Status、OAP configuration 和 data-retention。它是第三幕的最后一站，之后这个系列会转向控制台的治理和安全。
