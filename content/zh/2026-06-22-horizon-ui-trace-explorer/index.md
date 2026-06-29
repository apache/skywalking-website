---
title: "认识 Horizon UI · 6/17：Trace 探索器"
date: 2026-06-22
author: 吴晟
description: "Horizon UI 系列第六篇：按 Layer 使用的分布式 Trace 探索器：先配置条件再查询，在时延分布图上框选异常 Trace，并用瀑布图、调用树和统计表阅读同一条 Trace。"
tags:
  - Tracing
  - Cloud Native
---

*译自英文原文：[Meet Horizon UI · 6/17: The Trace Explorer](/blog/2026-06-22-horizon-ui-trace-explorer/)。*

这是 [Meet Horizon UI](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列的第六篇。前几篇都在讲地图：服务之间的[拓扑](/zh/2026-06-21-horizon-ui-topology-and-dependency/)、单个服务内部的 [deployment](/zh/2026-06-21-horizon-ui-deployment-and-banyandb/)，以及整个系统全貌的 [3D view](/zh/2026-06-22-horizon-ui-3d-infrastructure-map/)。它们回答“我的系统长什么样”。这一篇把视角缩到 *一个请求*，看它的 spans、时序，以及到底是哪一跳变慢了。这就是 **Traces** 标签页。

## 面向排查，不做实时滚动刷新

Traces 标签页是一个位于 **Layer 内部** 的分布式 Trace 探索器：选择服务，设置条件，然后阅读单条 Trace 的 span 时间线。它有意和控制台其他部分不一样，因为 Trace 是排查数据，不是实时流。

它使用 **独立的时间范围和条件**。它不跟随全局顶栏时间选择器，也不会自动刷新。你先配置要找的条件，再按 **Run query**；按之前不会取任何数据。第一次运行前，列表只显示 *"Pick your conditions, then click Run query."*。当你在追二十分钟前的一条坏 Trace 时，最不需要的就是窗口每几秒自动往前滚，所以它不会这么做。

## 用表单配置条件，不写查询语言

过滤条件全部通过结构化表单配置：select、数字范围、tag 标签。条件会暂存在工具栏里，只在点击 **Run query** 后生效：

- **Instance** 和 **Endpoint**：在服务内部收窄范围，endpoint 下拉框只列出这个服务自己的 endpoints。
- **Status**：`ALL` / `SUCCESS` / `ERROR`。
- **Order**：Newest（按开始时间）或 Slowest（按耗时）。
- **Limit**：拉取多少行，默认 30；BFF 会在服务端限制 page size，避免客户端向 OAP 请求过量数据。
- **Time range**：滚动预设（最近 15 分钟到 24 小时）或自定义绝对窗口，按 **秒级精度** 计算，所以刚结束的 Trace 不会因为分钟取整而掉出窗口。
- **Trace ID**：粘贴一个 id 直接查。
- **Duration range**：毫秒级 min-max。
- **Tag**：自由输入 span tags，格式为 `key=value`（比如 `http.status_code=500`），按 Enter 添加为可删除标签，多个 tag 按 AND 连接；key 和 value 都从后端获得 typeahead。

它不是查询语言。Horizon 里没有 TraceQL 输入框。上面的结构化条件就是完整界面。（TraceQL 是另一条路径：SkyWalking 后端可以通过 TraceQL 向 Grafana 提供 Trace，这件事在[另一篇文章](/zh/2026-04-08-traceql/)里讲。Horizon 的探索器是表单，不是 DSL。）

## 可框选的时延分布图

结果返回后，工具栏下会出现一张 **Distribution** 图：每个点代表一条 Trace，X 轴是开始时间，高度是 duration，越慢的 Trace 越高。点按 **status** 着色：错误为红色，成功为强调色。所以左上角、右上角那类高处红点，就是你要找的“又慢又失败”的区域。

这张图本身也是过滤器。点击一个点可以选中它，或者 **拖一个矩形框选一片点**，结果列表会收窄到这批选择；标题区切换成 *"N picked"* 计数，并提供 Reset。这是基于已加载结果的客户端过滤，不会发起新查询。直接框住慢且失败的角落，只读那几行，是从“200 条 Trace”缩到“这 6 条值得打开”的最快路径。

![图 1：Traces 探索器。分阶段条件工具栏、Distribution 图（每点一条 Trace，高度表示 duration，红色表示 error）和被框选的区域（8 picked），下方是结果列表。](/screenshots/horizon-0.7.0/p06-traces-01-explorer.webp)
图 1：先配置条件、执行查询，再在分布图上框选一片区域，把列表缩到真正值得打开的 Trace。</br>

每条结果行会显示 Trace 的 root endpoint、OK/ERR 标记、duration，以及按当前结果中最慢 Trace 归一化后的长度条。每一行 *代表什么* 取决于存储后端，Horizon 会自动检测：横幅会显示 *"Full traces are returned inline"*，表示后端返回的是带 spans 的完整 Trace，点击即可打开；或者显示 *"Each row is a trace segment — click one to fetch its full trace."*。你不需要配置这个，横幅只是告诉你当前看到的是什么。

## 三种方式阅读同一条 Trace

点击一行后，Trace 会打开，并在同一组 spans 上提供三种视图切换：**Default**、**Tree** 和 **Statistics**。

- **Default** 是 span 瀑布图：每个 span 一行缩进展示，带一个按服务着色的条形，条形在共享时间线上按 span 起始偏移和耗时定位；同时显示 span-kind glyph、组件图标（和拓扑地图共用同一套图标）、endpoint 或 peer 名称，以及 span 自身耗时。错误 span 会高亮，带 attached events 的 span 会有标记。关键点在于，瀑布图会用 parent references **把跨 segment 的 spans 串起来**，所以一个跨过五个服务的请求会渲染成一条连贯时间线，而不是五段互不相干的内容。
- **Tree** 把同一批 spans 画成可缩放、可平移的节点图：root 在左，callees 向右流动。适合你更关心调用树形状，而不是精确时序的时候。
- **Statistics** 按 **name** 聚合 spans：一张可排序表，展示每个 operation 的 count、total / average / maximum duration。所以“这条 Trace 里到底哪个 span 名称累计耗时最多”只需要点一次排序。

![图 2：Default 视图。span 瀑布图，每个 span 是共享时间线上的服务色条，带 kind glyph、组件图标和 duration；错误 span 高亮，跨服务 spans 被缝成一条时间线。](/screenshots/horizon-0.7.0/p06-traces-02-waterfall.webp)
图 2：瀑布图（Default），一条请求触达的所有服务被画成同一条连贯时间线。</br>

![图 3：Tree 视图。同一条 Trace 被画成可缩放的节点图，root 在左，callees 向右流动。](/screenshots/horizon-0.7.0/p06-traces-03-tree.webp)
图 3：Tree 视图，把同一批 spans 画成调用树形状，可以缩放和平移。</br>

## 查看 span 详情

点击任意 span，旁边会打开详情面板。**Meta** 展示核心信息：service、instance、endpoint、kind（entry / exit / local / producer / consumer）、component、peer、layer、start time、duration 和 error 标记。适用时，下面还会出现：

- **Cross-trace refs**：当一个 span 的 parent 位于 *另一条* Trace（异步跳转、稍后消费的消息）中时，这里会列出 parent 的 trace id、segment 和 span；trace id 是一个 **链接**，点击可以直接切换到那条 Trace。
- **Tags**、**Logs**（每个 span 的带时间戳日志项）和 **Attached Events**（带 start/end time 和 summary key/values 的命名事件）。

详情标题区会显示 Trace 开始时间、总耗时、span 数量，以及触达了多少个不同服务；从这里可以复制 trace id 或可分享链接。打开一个带 `?traceId=...` 的分享 URL，会直接打开这条 Trace 的 overlay。这让 Trace 成为可以粘贴到 incident channel 里、让同事打开同一视图的对象。

## Native 与 Zipkin 并列支持

并不是每个 Layer 的 Trace 都来自 SkyWalking 自己的 agent。Layer 模板带一个 `traces.source` 设置，可以是 `native`、`zipkin` 或 `both`，Horizon 据此路由。由 agent 接入的 Layer（比如 General Service）使用上面讲的 **native** 探索器；service-mesh 和 Kubernetes 风格的 Layer 中，spans 以 Zipkin/OpenTelemetry 数据进入，则使用 **Zipkin** 探索器；设置为 `both` 的 Layer 会得到 **两个标签页**，因为 native 和 Zipkin spans 的形状和条件确实不同。

Zipkin 标签页通过 **OAP 的 Zipkin query API** 查询上游 Zipkin store。这是 OAP 向任何 Zipkin client 暴露的兼容接口，不是 GraphQL，也不是 TraceQL。Zipkin 按自己的服务集合组织数据（每个 span 上的 `serviceName`，可能和 SkyWalking 的服务列表不同），所以这个标签页有自己的服务控件，不绑定页面上的 service picker；它也带 Zipkin 原生条件，比如 *Remote service*、*Span name* 和 *Annotations* 查询（`error` 或 `key=value`）。两个存储路径独立失败：Zipkin 不可达时，native traces 不受影响，反之亦然。

![图 4：mesh Layer 上的 Zipkin trace 标签页。它有自己的 service / remote-service / span-name / annotations 条件，并通过 OAP 查询上游 Zipkin store，打开了一条 Zipkin trace waterfall。](/screenshots/horizon-0.7.0/p06-traces-04-zipkin.webp)
图 4：设置为 Zipkin 的 Layer 会得到自己的标签页和自己的服务集合，并通过 OAP 查询上游 Zipkin store。</br>

打开一个 Zipkin span 后，详情会保留 Zipkin 的形状：`CLIENT` / `SERVER` kind、本地和远端 endpoint，以及原始 Zipkin/OpenTelemetry tags（`istio.*`、`http.status_code`、sidecar `node_id`）都会按 Zipkin 记录的方式展示，不翻译成 SkyWalking span 模型。

![图 5：Zipkin span 详情面板。Meta（Kind CLIENT、peer、duration）和原始 Zipkin/OTel tags，包括 Istio sidecar 相关字段，都保留原生形状。](/screenshots/horizon-0.7.0/p06-traces-04-zipkin-span.webp)
图 5：Zipkin span 保留自己的字段：kind、endpoints，以及原始 `istio.*` / HTTP tags。</br>

## 从慢记录定位到对应 Trace

还有一种进入 Trace 的方式，不需要经过探索器。整个应用只挂载一个 Trace overlay，多个入口都能按 **trace id** 打开它：`?traceId=` 链接、cross-trace ref、日志行，以及[第二篇](/zh/2026-06-21-horizon-ui-dashboards-and-mqe/)里提到的 record 组件慢语句行上的 **jump-to-trace** 图标。因为它按 id 解析，而不是按 Layer 解析，所以即使 Trace 属于你当前看到的 *另一个* Layer 也能工作：Virtual Database、Cache 或 MQ 服务没有自己的 traces 标签页，但它的慢语句仍然能带你到发起方 Trace。跳转如果带 timestamp（日志行知道自己写入时间），查找会围绕那个时间放宽窗口，所以即便 Trace 已经进入冷存储，也不会悄悄找不到。

## 后续阅读

Traces 标签页把一个请求完整展开；前面几篇的仪表盘和地图，是你最初发现异常的地方。字段参考，包括每个条件、native-vs-Zipkin 拆分和 span 详情面板，可以看 [Traces 文档](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/operate/traces/)。

下一篇：**Log Explorer**。同样的排查思路，应用到日志流而不是 spans。
