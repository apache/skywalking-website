---
title: "认识 Horizon UI · 7/17：日志探索器"
date: 2026-06-23
author: 吴晟
description: "Horizon UI 系列第七篇：两类日志视图，一种查看已采集、已索引、可关联 Trace 的存储日志流，并提供按级别堆叠的直方图；另一种按需实时查看 Kubernetes pod 的容器输出。"
tags:
  - Logging
  - Cloud Native
---

*译自英文原文：[Meet Horizon UI · 7/17: The Log Explorer](/blog/2026-06-23-horizon-ui-log-explorer/)。*

这是 [Meet Horizon UI](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列的第七篇。[第六篇](/zh/2026-06-22-horizon-ui-trace-explorer/)讲的是一个请求的 spans；这一篇讲它周围的日志行。Horizon 用 **两个标签页** 展示日志，对应两类排查问题：*“这个服务过去半小时打了什么日志？”* 以及 *“这个 pod 现在正在向 stdout 打什么？”*

- **Logs** 标签页查询 SkyWalking 已经 **采集并存储** 的日志：已索引、可过滤、可与 Trace 关联。
- **Pod Logs** 标签页按需 **实时 tail** Kubernetes pod 的容器日志。这类日志不走 SkyWalking 的日志存储：OAP 直接从 **Kubernetes API server** 读取它们（也就是 `kubectl logs` 那条路径），Horizon 只展示当前窗口，然后丢弃，不会持久化。

某个 Layer 展示哪些标签页由模板决定：启用日志的 Layer（General、Mesh、Nginx、Envoy AI Gateway、mobile 和 mini-program Layer）会显示 **Logs** 标签页；只有感知 Kubernetes 的 Layer（Kubernetes Service、Mesh、Mesh data plane）会显示 **Pod Logs** 标签页。Browser JavaScript 错误又是另一类数据：它不是服务日志，而是浏览器端 agent 上报的客户端错误事件，有自己的分类，也可以借助 **source map** 把压缩后的 `app.min.js:1:...` frame 还原到原始 `file:line`。这是 Browser Layer 上的独立标签页，会在这个系列的另一篇文章里讲。

## 查询已存储日志

打开一个有 **Logs** 标签页的 Layer，先在顶部选择服务，日志流会按新到旧加载。和 Trace 探索器一样，这个标签页使用 **独立的时间范围**。当你在这里排查时，全局顶栏时间选择器会暂停，自动刷新不会把你正在看的窗口不断往前推。可以选择滚动预设（最近 15 分钟到 24 小时，默认 30 分钟），也可以选择自定义绝对窗口；查询按 **秒级精度** 执行，所以最新日志不会被分钟取整吞掉。

条件栏用来收窄日志流，每个过滤条件都是可选的，多个条件按 AND 连接：

- **Instance**：限制到某个服务实例。在 sidecar Layer 上标签显示为 **Sidecar**。
- **Endpoint**：输入搜索服务 endpoints，点击固定，按 **×** 清除。
- **Trace ID**：只显示和某条 Trace 关联的日志行。从 Trace 跳转过来时，也会预填这个字段并直接限定日志流。
- **Tags**：单个 `key=value` 字段，带 autocomplete；输入 key 可看建议，输入 `=` 后切换到已知 value，按 Enter 提交。提交后的 tags 以可删除标签形式保留。
- **Level**：日志流上方的 **Levels** 条也可以当过滤器用。点击 `error`、`warn`、`info` 或 `debug` 只保留该级别，再点一次清除。

这里不提供单独的日志查询语言，也不需要学习 LogQL。上面的条件就是完整界面，并且 **编辑时会立即刷新日志流**；**Run query** 只是显式告诉系统“我改完了，现在刷新”，同时回到第一页。

## 用直方图和级别计数定位日志

日志视图的目标不只是 *列出* 行，还要帮你看出分布和异常，所以日志流上方有两类辅助信息。

**Density histogram** 按时间展示日志量，每个柱按 legend 颜色 **堆叠 level**；hover 柱子可以看到该 bucket 的时间范围和每个 level 的计数。它基于当前页面上可见数据绘制，所以展示的是你正在看的日志分布。**Levels** 条则保留每个 level 在窗口内的累计计数。这个计数跨整个查询窗口采样，而不只是当前可见页，所以 error/warn/info 比例反映的是整个窗口。

日志行会展示 timestamp、level（行颜色跟随 level）、service、存在 Trace 关联时的 **↗ trace** 链接、**`JSON` / `YAML` / `TEXT` 格式标记**，以及内容的一行预览。Horizon 按日志内容本身决定这个标记：OAP 会标注日志 body 是 JSON 还是 plain text，在此基础上 Horizon 还会识别 JSON 和 YAML 结构，所以即使一行没有被标注但内容是结构化的，也会得到正确处理。JSON 在预览里压平成一行，YAML 保留 key，plain text 会折叠空白。

![图 1：存储 Logs 流。条件栏、按 level 堆叠的 density histogram 和 Levels 条在上方，下面是日志行，每行带 level 颜色、service、格式标记和 ↗ trace 链接。](/screenshots/horizon-0.7.0/p07-logs-01-stream.webp)
图 1：某个服务的存储日志流：窗口上的 level histogram 和 level 计数，下面是每行日志，带 JSON / YAML / TEXT 标记并可跳到 Trace。</br>

## 查看单行日志详情

点击一行后，完整日志内容会在弹层里打开：内容会按格式排版，JSON 和 YAML 正常缩进，plain text 则展开成完整内容，而不是被挤在一条窄条里。面板还提供 **Copy** 按钮、service / instance / endpoint / trace 上下文，以及该行所有 tag 的表格。日志行与 Trace 关联时，**↗ trace** 按钮会在 overlay 中打开相关 [Trace 瀑布图](/zh/2026-06-22-horizon-ui-trace-explorer/)，不离开日志流；它还会把这行日志的 timestamp 传过去，所以 Trace 即使已经进入更冷的存储 tier，也仍然能找到。按 Escape 或点击背景遮罩即可关闭。

![图 2：日志行详情弹层。完整内容按格式 pretty-print（这里是 JSON access log），带 Copy 按钮、service 和 instance 上下文，以及该行 tag 表（这里是 `status.code`）。](/screenshots/horizon-0.7.0/p07-logs-02-payload.webp)
图 2：完整查看一行日志：内容按格式排版，旁边展示上下文和所有 tags。</br>

## Pod Logs：实时查看容器输出

**Pod Logs** 标签页回答另一个问题，它的数据源也完全不同：不是 SkyWalking 存储的日志，而是通过 OAP 从 **Kubernetes API server** 实时读取 pod 的容器输出，也就是 `kubectl logs -f` 读取的同一类内容。这里没有可翻页的存储历史；每次刷新拉取尾部窗口，展示出来，然后丢弃。

开始 tail 只需要几个选择：选一个 **Pod**（固定的服务实例）、一个 **Container**（Horizon 会列出 pod 的容器并默认选第一个）、一个回看 **Window**（last 30s、1m、5m、15m 或 30m，决定每次轮询向前取多远），以及轮询 **Interval**（2s、5s、10s 或 30s，决定多久重新取一次）。按 **Start** 后，日志会流入只读查看器，保持最新行可见，并持续轮询直到你按 **Pause**。顶部状态条显示 container、行数、live 状态，以及上次更新距今多久。两行 **Include** / **Exclude** 过滤器用来收窄可见内容；每个标签都是一个 **整行正则表达式**（`.*error.*`），由 OAP 执行，所以它匹配整行而不是子串，并且可以叠加。

使用前需要知道一点：按需读取 pod logs 在 OAP 上 **默认关闭**，因为容器输出可能包含敏感信息。功能关闭时，或者你选择的 pod 已经滚动或缩容消失时，OAP 会返回一个 *原因*，Horizon 会把它显示成横幅，而不是给你一个空面板。这样你能区分“需要打开这个功能”和“那个 pod 已经不存在”。

![图 3：Pod Logs 标签页。pod 和 container 选择器、回看窗口和轮询间隔、live-indicator 状态条、Include/Exclude 正则标签，以及流式展示容器最近输出的只读日志窗口。](/screenshots/horizon-0.7.0/p07-logs-03-pod-logs.webp)
图 3：一个 pod 容器的实时 tail：窗口化、按间隔轮询、可用正则过滤、永不持久化。</br>

## 后续阅读

两个标签页，包括存储查询、tag/container 自动补全和 live tail，都由同一个 `logs:read` 权限控制。所以授予“可以读日志”就是一个开关。字段参考，包括每个条件、histogram、Pod Logs 的窗口和过滤器，可以看 [Logs 文档](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/operate/logs/)。

下一篇看 Browser/RUM：浏览器端错误如何上报，又如何用 source map 把压缩后的 stack 还原到源码位置。
