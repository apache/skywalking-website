---
title: "认识 Horizon UI · 11/17：运行时规则与实时调试"
date: 2026-06-29
author: 吴晟
description: "Horizon UI 系列第十一篇：在浏览器里编辑 SkyWalking 的 OAL/MAL/LAL 分析规则，通过可恢复的集群确认流程让变更在运行中的 OAP 上生效；再用三个标签页的 Live Debugger 让同一条规则跑在真实数据上，看清它到底算出了什么。"
tags:
  - Engineering
  - Metrics
---

*译自英文原文：[Meet Horizon UI · 11/17: Runtime Rules & Live Debugging](/blog/2026-06-29-horizon-ui-runtime-rules-and-live-debugging/)。*

这是 [Meet Horizon UI](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列的第十一篇，仍然属于第三幕 **operate it**。[上一篇](/zh/2026-06-29-horizon-ui-alarms-and-incident-triage/) 讲的是如何读取后端已经判断出的告警；这一篇更进一步，讲如何改变后端的判断逻辑，并验证这次修改确实按预期生效。

OAP 里的大多数分析都经过一组小型 DSL：**OAL** 把 trace 转成 service 和 endpoint 指标，**MAL** 把 meter（OpenTelemetry、Telegraf）转成指标，**LAL** 把 log 转成 tag 和指标。过去，这些规则通常要在服务器上改 YAML，再重启服务。Horizon 把两件事都放进控制台：**编辑规则并在线生效**，以及**用实时数据调试规则**。这两项都是 SkyWalking UI 新增的能力，底层走 OAP 的 admin host。

## 规则直接在控制台里看

**Operate → DSL management** 会列出集群当前正在运行的分析规则，并按来源分组。四类目录可编辑：**MAL · OTel**、**MAL · Telegraf**、**LAL** 和 **LAL → MAL**（log-to-metric）；另外还有只读的 **OAL** 浏览器。规则会按前缀归组，比如 ActiveMQ、BanyanDB、Elasticsearch、Flink 等。每条规则都有状态标记，也可以按 **active / inactive / bundled / modified** 过滤，这样可以很快看出哪些是随版本发布的规则，哪些被 operator 改过。

![图 1：DSL management 目录：分析规则按来源分组，每条规则带状态标记，顶部提供状态过滤。](/screenshots/horizon-0.7.0/p11-runtime-01-rule-catalog.webp)
图 1：DSL management：集群运行的 OAL/MAL/LAL 规则按来源分组，并可按 active / inactive / bundled / modified 过滤。这里展示的是 OpenTelemetry MAL 目录，包含 37 条 bundled 规则。</br>

## 编辑，并安全地在线生效

打开一条规则后，界面是一个 Monaco YAML 编辑器，带语法高亮和两种 diff：**vs. server** 看当前线上版本，**vs. bundled** 看随版本发布的默认版本。这样你在保存前就能确认自己改了什么。每个 `- name:` 旁边还有绿色 ▶，点击后会把这条规则直接带到 Live Debugger。

![图 2：Monaco YAML 编辑器中的一条 MAL 规则，带 edit / diff-vs-server / diff-vs-bundled 标签页，以及代码左侧的绿色播放按钮。](/screenshots/horizon-0.7.0/p11-runtime-02-rule-editor.webp)
图 2：用 Monaco YAML 编辑规则：语法高亮、对比线上版本和 bundled 版本，并可通过代码左侧的绿色 ▶ 直接进入 Live Debugger。</br>

保存时，Horizon 会区分修改的风险。只改规则主体或 filter，可以立即生效。但如果是**结构性变更**，比如改了指标的 scope、downsampling 或存储形态，就会影响集群存储结构。Horizon 会按带集群确认的流程执行，并在界面上展示进度：**Compiled → Confirming across the cluster → Committing → Done**；只有变更在集群里确认持久化后才算成功。

如果某个节点没有及时通过确认，应用结果会变成 **DEGRADED**。界面会列出落后的节点，这些节点会在下次扫描时自行追上，而不是让整次应用直接失败。如果 commit 前出错，变更会 **rolled back**，原因显示在界面里，你的编辑内容仍保留在 buffer 中。编译错误则会作为 inline diagnostic 展示。对于卡住的发布，可以点一次 **Force re-apply**，用完全相同的内容重新跑一遍应用流程，让落后的节点恢复同步；这会短暂暂停那条规则的采集。把规则恢复到 bundled 默认版本也走同一套确认流程；此外也可以 inactivate、delete，或者把整个目录导出成 tarball。

## Live Debugger：看清规则实际算出了什么

编辑规则只是第一步。更难的是确认它跑在真实数据上到底会算出什么。过去通常要读代码、对输出、靠经验判断。**Operate → Live debugger** 直接把这件事放到界面里：选择一条规则，点击 **start sampling**，Horizon 会在**每个可达的 OAP 节点**上安装一个受限采集任务，抓取少量真实记录，然后逐条展示这些记录如何经过规则处理。

![图 3：Live Debugger 的 MAL 采集中页面：规则和指标选择器、record cap、retention 控制，以及显示 installed 2 of 2 的节点覆盖条。](/screenshots/horizon-0.7.0/p11-runtime-03-livedebug-session.webp)
图 3：启动采集后，任务会安装到每个可达的 OAP 节点上（这里是 2/2），抓取真实记录，并用 record cap 和 retention window 控制边界。三种分析语言共用这套会话框架。</br>

Live Debugger 按分析语言分成三个标签页，因为三种规则处理的数据不同。

**OAL → traces。** 捕获到的一行 source 是真实的 trace segment。它会按 clause 展开：`from(Service.*)` 读取 segment（可以看到 latency、status、endpoint），`build_metrics` 组织指标结构，`cpm()` 做聚合。你可以直接看到一条 trace 如何变成指标。

![图 4：OAL 标签页展示一个 trace segment 如何经过 input、function 和 aggregation 阶段，并显示完整 payload。](/screenshots/horizon-0.7.0/p11-runtime-04-oal-trace.webp)
图 4：OAL → traces：来自 `agent::gateway` 的真实 segment（latency 38，status 200，`/rcmd`）逐步经过 `from(Service.*)` → `build_metrics` → `cpm()`，最终进入 service-CPM 指标。</br>

**MAL → metrics。** 一个 meter sample 会按 input → filter → function → output 流动。因为同一个指标往往会展开成多组 label，样本会按 metric 分组；**diff** 会淡化所有样本共有的 label，只高亮不同的部分。

![图 5：一组 MAL sample 展开后的 diff 视图：COMMON 区块里的共享 label 被淡化，每个 sample 只高亮两个不同 label。](/screenshots/horizon-0.7.0/p11-runtime-05-mal-diff.webp)
图 5：MAL → metrics：sample 按 metric 分组，diff 会淡化 16 个所有样本共有的 label，只高亮不同的两个 label（`group`、`pod_name`）。四条非常相似的时序因此能一眼区分。</br>

**LAL → logs。** 每条捕获到的 log record 是一列，每个 DSL block（或 statement）是一行，所以整个采集结果会变成一个矩阵。你可以看到哪些记录被 `filter` **aborted**，也能看到通过 filter 的记录被 `extractor` 提取出了什么。

![图 6：LAL 标签页左侧是捕获规则，右侧是按 record 和 block 组成的矩阵；被 filter 丢弃的记录显示为 aborted cell。](/screenshots/horizon-0.7.0/p11-runtime-06-lal-matrix.webp)
图 6：LAL → logs：每条捕获记录是一列，每个 DSL block 是一行。这个 filter 会丢弃正常日志，只让异常日志继续往下走，再由 extractor 提取 `status.code` 和 `response.flag`。</br>

## 它在哪里运行

这两个界面都属于 **operate** 功能：它们访问的是 OAP 的 **admin host**，不是 query port。DSL management 走 `receiver-runtime-rule` 模块，Live Debugger 走 `dsl-debugging`。admin host 随 OAP 11 提供；在当前后端上，这两个页面会明确提示“需要 admin host / module”，并保持只读。与此同时，所有 observe 界面不受影响：dashboard、trace、log、alarm、profiling 都照常工作。

权限也按角色拆开：浏览规则、查看采集结果是读权限；编辑规则、执行结构性应用、启动采集分别需要对应的写权限或执行权限。因此，只读 operator 可以一直查看采集样本，但不能改规则，也不能启动新的调试会话。这正是开源后端最近才补上的那块 operate 能力。

## 后续阅读

字段参考，包括每个 apply state、dump 格式和各标签页的采集控制，可以看 [Runtime Rules](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/operate/runtime-rules/) 和 [Live Debugger](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/operate/live-debugger/) 文档。

下一篇：[Inspect，跨 layer 查询工具](/zh/2026-06-29-horizon-ui-inspect-cross-layer-query/)：在 Operate 界面里跨 layer 直接运行 metric、trace 和 log 查询。
