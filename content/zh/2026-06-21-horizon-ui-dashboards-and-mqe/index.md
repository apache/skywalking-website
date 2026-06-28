---
title: "认识 Horizon UI · 2/17：会适配实体的仪表盘"
date: 2026-06-21
author: 吴晟
description: "Horizon UI 系列第二篇：它的仪表盘如何由 MQE 表达式驱动，如何隐藏不适用于当前实体的组件并在服务端跳过查询，以及如何把 1 显示成 OK、把 4.51e4 显示成 45.1k。"
tags:
  - Metrics
  - Cloud Native
---

*本文翻译自英文原文：[Meet Horizon UI · 2/17: Dashboards That Adapt — MQE, Smart Widgets, and Numbers Humans Can Read](/blog/2026-06-21-horizon-ui-dashboards-and-mqe/)，发布日期沿用原文日期。*

这是 [Apache SkyWalking Horizon UI](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列的第二篇。第一篇介绍了控制台和按 Layer 组织的导航；这一篇讲你每天最常停留的界面：**仪表盘**。

Horizon 里的每个仪表盘，本质上都是同一台机器：一个组件网格，每个组件都是一条由 BFF 解析并发往 OAP 的 **MQE 表达式**。它值得单独写一篇，不只是因为能展示数字，而是因为它围绕数字做了很多实际工作：不适用于当前实体的组件会被隐藏，相关查询也完全不会发出；编码值和原始字节数会被渲染成人能读懂的形式；页面上所有图表都绑定到同一个游标；你还可以从一条慢 SQL 记录直接跳到产生它的 Trace。下面逐项看。

## 每个组件都是一条 MQE 表达式

Layer 仪表盘是一个紧凑的 **12 列网格**：行高 120px，空隙会自动回填，避免墙一样的组件块出现洞；宽度低于约 1100px 时会折叠成单列。每个格子是五类组件之一，而组件类型取决于 MQE 表达式返回数据的 *形状*：

- **`card`**：表达式收敛为单个标量，比如 `latest(...)`、`avg(...)`、`service_sla/100`。显示一个大数字。
- **`line`**：时间序列；每个表达式一条线，混合单位时可以使用双 Y 轴，比如左侧吞吐、右侧时延。
- **`top`**：来自 `top_n(endpoint_cpm, 20, des)` 的排行列表，带一个小标签切换器，可以在 Traffic / Slow / Successful Rate 之间切换排序。
- **`record`**：记录型输出，比如慢数据库语句或慢缓存命令：文本行加数值。
- **`table`**：带标签的 `latest(...)` 指标，每组 label 一个表格行，比如每个服务的 pod phase、node condition、deployment replicas。

你不需要手工选择图表类型；写好 MQE，合适的组件会自己渲染。而且每个层级都使用同一套网格系统。Layer 模板里的 `dashboards.<scope>` map 会为 **service**、**instance** 和 **endpoint** 页面携带不同的组件集合，所以向下钻取时，整个仪表盘会换成正确的 scope。（这些都运行在[第一篇](/zh/2026-06-21-skywalking-horizon-ui-introduction/)介绍的 BFF 层；浏览器不直接访问 OAP。）

## 会适配当前实体的仪表盘

这里有一个会改变仪表盘使用感受的能力。组件可以带一个 **`visibleWhen`** 条件。如果条件不成立，组件不渲染；更关键的是，**它的查询也不会执行**。

条件有两类：

- **MQE metric**：只有表达式 *有值* 时展示组件（`op: exists`），或者只有值超过阈值时展示（`gt` / `lt`）。组件可以拿自己的指标做自我开关：JVM 组件带 `"visibleWhen": { "kind": "mqe", "expression": "instance_jvm_cpu", "op": "exists" }`，所以它们会出现在 Java 实例上，在 Go 实例上消失。
- **Entity attribute**：在 Instance scope 上，根据选中实例的属性开关，比如 `language eq JAVA`，或者某个属性是否存在。

因为条件在 **服务端** 计算，非 JVM 实例不只是把 JVM 格子藏起来；BFF 根本不会把这些查询发给 OAP。用同一个 Instance 仪表盘打开一个 JVM 服务和一个非 JVM 服务，你看到的是一个模板在适配当前实体，而不是两套手工维护的页面。

![图 1：Java 服务的 Instance 仪表盘，因为 `instance_jvm_cpu` 有数据，JVM 组件组（CPU、heap、GC、threads、classes）会展示。](/screenshots/horizon-0.7.0/p02-dashboards-01-instance-jvm.webp)
图 1：JVM 实例上会渲染 JVM 组件，因为它们的 `visibleWhen` 条件成立。</br>

![图 2：同一个 Instance 仪表盘打开在 Go 的 rating 服务上，JVM 组件组不存在，网格已经重排；这些组件的查询没有发往 OAP。](/screenshots/horizon-0.7.0/p02-dashboards-02-instance-go.webp)
图 2：同一个仪表盘打开在 Go 实例上，JVM 组件不存在，查询也没有执行。一个模板，按实体适配。</br>

## 数字要让人看得懂

原始指标不一定是可读指标。Horizon 的组件会处理三类过去常让运维人员在脑子里换算的值：

- **`enum`**：用 value→label map 把编码型 gauge 变成文字。`1/0` 成功指标会显示成 **`OK`** / **`Failed`**，而不是裸数字。label 可以按 locale 翻译。
- **`duration`**：以秒为单位的指标会显示成人能理解的时间差，比如 **`5m 20s ago`**；在坐标轴上会压缩成 `5m` / `2h`。
- **SI suffixes**：图表坐标轴和 tooltip 上的大数会显示成 **`45.1k`**、**`1.34M`**、**`2.5G`**，而不是 `4.51e4`。坐标轴刻度和 hover 值使用同一套写法。

![图 3：折线图的 Y 轴和十字线 tooltip 都使用紧凑 SI 后缀（45.1k、1.34M），刻度和 hover 值保持同一写法。](/screenshots/horizon-0.7.0/p02-dashboards-03-si-suffix-axis.webp)
图 3：高密度字节数和计数序列使用紧凑 SI 后缀，坐标轴和 tooltip 保持一致。</br>

![图 4：两个 BanyanDB 卡片："Last Sync" 通过 enum map 把编码 1 显示成 OK，"Time Since Last Sync" 通过 duration 格式把秒数显示成 "5m 20s ago"。](/screenshots/horizon-0.7.0/p02-dashboards-04-enum-duration-cards.webp)
图 4：`enum` 和 `duration` 格式在 BanyanDB 生命周期卡片上的效果：`OK` 代替 `1`，"5m 20s ago" 代替秒数。</br>

## 把整个网格当成同一条时间线读

页面上所有 `line` 图共享 **同一个 hover 游标**。指向吞吐图上的第 32 分钟，时延图、错误率图和每个 sparkline 格子上的第 32 分钟也会一起亮起。这个契约在图表 wrapper 层强制执行，任何组件都不能退出，所以页面读起来是一组围绕同一时刻协同的视图，而不是十几个互不相关的图。多序列 tooltip 是固定对齐的表格，展示每条序列的 **title**（不会显示原始 MQE），所有值在同一列右对齐。

![图 5：同步十字线扫过吞吐、错误率和时延面板，一个游标、同一个时刻，所有图表对齐。](/screenshots/horizon-0.7.0/p02-dashboards-05-synced-crosshair.webp)
图 5：一个游标跨过页面上所有折线图，所以你可以在所有图上同时读同一瞬间。</br>

## 从慢记录一键跳到 Trace

`record` 组件，比如 Slow Statements、Slow Commands、Slow Database Statements，是采样记录列表。每一行如果带 trace id，行首会出现一个 **jump-to-trace** 图标，点击即可打开对应 Trace 的瀑布图。它按 **trace id** 解析，而不是按 Layer 解析，这点很重要：Virtual Database / Cache / MQ 服务上的 Slow Statements 属于另一个 Layer 上的 *caller*，虚拟目标 Layer 自己没有 traces 标签页，但跳转仍然能落到正确 Trace。语句文本本身也支持 **点击复制**。

![图 6：Slow Statements record 组件。每条带 trace id 的采样行都有 jump-to-trace 图标，语句文本可点击复制，其中一行显示 copied 闪烁状态。](/screenshots/horizon-0.7.0/p02-dashboards-06-record-jump-to-trace.webp)
图 6：从慢语句跳到执行它的 Trace。按 trace id 解析，所以即使虚拟 Layer 自己没有 traces 标签页也能工作。</br>

## 固定并对比多个实体

有时只看一个实体不够。Horizon 允许你 **锁定多个服务、实例或 endpoint，甚至来自不同服务的实体，并在当前页面内直接比较**。可以从选择器或 instance/endpoint 列表固定实体；当前正在查看的实体始终属于对比组，会标记为 `CURRENT`，并继续驱动顶部 header。每个固定实体都有自己的颜色。之后每个组件都会内联对比：line 组件为每个实体叠加一条序列，card 为每个实体显示一行，`top` 和 `record` 组件增加按实体切换的标签页，table 增加 Entity 列。持久的对比栏会保持这个实体组，不受底层列表分页或当前查看实体变化影响；每个实体单独发起请求，所以一个实体慢，不会把其他实体拖成空白。

![图 7：对比来自不同服务的两个实例：app（标记 CURRENT）和 rating。在 Load、Latency、Success Rate 折线组件中按颜色叠加显示，上方有对比栏。](/screenshots/horizon-0.7.0/p02-dashboards-07-pinned-entities.webp)
图 7：锁定实体，甚至跨服务锁定，所有折线组件都会按颜色叠加；对比栏保持实体组，CURRENT 实体仍然驱动 header。</br>

## 时间选择器驱动整个仪表盘

顶部时间范围会驱动页面上的所有内容：header KPI 条、组件主体，以及 BanyanDB 分层 hot/warm/cold 存储里的 **Cold** pill 完整流程。过去落地页和拓扑路由固定在最近 60 分钟，所以选择 "12 days ago" 后仍然会悄悄展示近期数字；现在时间选择器在所有地方都生效。上游控制变化时，每个依赖它的格子会明确重置并显示 "Reading data..." 提示，而不是在 spinner 下面留着旧值。

## 下一步去哪里

需要强调的是，这是一套系统。同样的五类组件、同样的 MQE、同样的条件开关，会渲染每个 Layer 的仪表盘：上面的 JVM 面板、BanyanDB 生命周期卡片、mesh 服务上的百分位时延，以及专门为 Envoy AI Gateway（token throughput、time-to-first-token）或 GenAI virtual layer（per-model estimated cost）设计的面板。不同 Layer 之间变化的是 MQE，不是机制。

上面讲的是 *阅读* 体验。每个组件的 MQE、`visibleWhen` 条件、格式，以及每个 scope 的网格，都可以从 **Layer dashboards** 管理界面编辑。但这个创作流程（draft → preview → publish，以及可内联/展开的 MQE 编辑器）会在后续文章里单独展开。字段级参考可以看文档里的 [dashboard widgets](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/components/dashboard-widgets/) 和 [charts](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/components/charts/)。

下一篇：**topology and service dependency**，把 Horizon 在这里用图表展示的同一批数据，画成一张可以走进去看的地图。
