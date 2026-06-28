---
title: "认识 Horizon UI · 3/17：拓扑与服务依赖"
date: 2026-06-21
author: 吴晟
description: "Horizon UI 系列第三篇：一套由模板驱动、可为每个 Layer 重绘的拓扑引擎，降噪过滤器，从调用下钻到实例，endpoint 依赖图，以及跨 Layer 的 Smartscape 叠加视图。"
tags:
  - Cloud Native
  - Tracing
---

*本文翻译自英文原文：[Meet Horizon UI · 3/17: Topology & Service Dependency](/blog/2026-06-21-horizon-ui-topology-and-dependency/)，发布日期沿用原文日期。*

这是 [Meet Horizon UI](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列的第三篇。[第二篇](/zh/2026-06-21-horizon-ui-dashboards-and-mqe/)讲的是如何把服务读成仪表盘上的数字；这一篇讲如何把服务读成一张 **地图**：谁调用谁，调用有多重，以及同一个逻辑服务在不同上报 Layer 中是什么样子。

SkyWalking 拓扑背后的调用数据是一份，但 Horizon 从中画出的 *视图* 不止一种。它有每个 Layer 自己的服务地图，可以从单条调用下钻到背后的实例，可以看 endpoint 级依赖图，也可以用跨 Layer 叠加视图把一个服务的多张面孔连起来。它们共用同一套引擎，只是回答的问题不同。（Deployment 标签页，也就是单个集群服务 *内部* 实例的地图，以及 WebGL 3D 地图，都足够大，会在接下来的文章里单独讲。）

## 一套拓扑引擎，按 Layer 重绘

打开任意 Layer 的 **Topology** 标签页，你会看到一张从左到右排列的层次化服务地图：`User` 存在时位于最左侧，每个服务按调用深度落在不同列里；同一列内部则保留图遍历到它们时的顺序，所以主调用链可以自上而下读。每个服务都是一个 **六边形节点**，节点上展示的所有东西都来自这个 Layer 的配置，没有写死逻辑：

- 六边形 **边框** 承载节点的 **ring** 指标，用类似 SLA 的健康色带展示（绿色 → 红色）；
- 组件 **图标** 放在六边形内部，和 Trace 瀑布图使用同一套图标，所以 PostgreSQL 节点像 PostgreSQL，Kafka 节点像 Kafka；
- 节点头部数字，也就是 **center** 指标，带单位显示在六边形 **上方**；
- 服务 **名称** 显示在节点 **下方**，**secondary** 指标（默认是时延）显示在名称下面；
- 每条 **边** 都带调用吞吐的 **RPM chip**，使用服务端指标，缺失时回退到客户端指标。

这里需要强调一点：上面这些都只是 **General Layer 的内置默认配置**。节点的 center / ring / secondary 指标，以及边指标，都位于 **Layer dashboards admin → Topology scope**，本质上是带单位和角色的 MQE 表达式。所以你可以把任意槽位指向另一条指标，同一套引擎就会为另一个 Layer 画出不同地图，或者按你的方式重画当前 Layer。（这些选择会像其他模板内容一样，跟着 Layer template 的 export/import 走。）

![图 1：单个 Layer 的服务地图。六边形节点用边框表示 SLA 健康色带，节点上方显示主指标，内部显示组件图标，下方显示名称，每条边带 RPM chip。](/screenshots/horizon-0.7.0/p03-topology-01-service-map.webp)
图 1：一套由模板驱动的拓扑引擎：带健康色带的六边形节点、带 RPM chip 的边、真实组件图标；图上的每个指标都按 Layer 配置。</br>

## 削掉噪声

真实拓扑通常很吵。一张密集地图里会混入 OAP 没法完整识别的推测节点，比如裸露的 `rcmd:80`、未接入探针的地址。Horizon 的 **Filter** 控件可以关掉这些噪声，同时保留真实依赖。它会自动推导一个 facet：**按 Layer 分组**，展示方式和侧边栏一致。每一行都有 Layer 自己的图标和本地化名称，比如 *Virtual Database*、*Java Agent*，还会有一个 **Others** 桶，用来收纳 OAP 无法分类的节点，以及一个独立的 **User** 开关。取消勾选 *Others* 后，未接入探针的杂点和悬空边会消失，而数据库、缓存和队列（各自的 `VIRTUAL_*` 行）仍然留在图上。过滤在客户端执行，行会在每次刷新时重新推导，所以不会陈旧。

![图 2：拓扑 Filter。一个自动推导出的按 Layer facet（每行带 Layer 图标和名称）、一个 Others 桶，以及 User 开关，用来从密集地图里去掉推测节点。](/screenshots/horizon-0.7.0/p03-topology-02-filter-denoise.webp)
图 2：一键降噪，去掉无法解析的 "Others" 节点，同时保留真实依赖。</br>

当某个 Layer 的服务落在 OAP service group 里，地图上的 service-focus 选择器也会按这些 group 分组。点击 group header 可以 **批量选中或清空该组里的所有服务**，所以你能一次聚焦一张繁忙地图中某个团队负责的那一片。

![图 3：感知 group 的服务选择器。服务按 OAP `Service.group` 分组，点击 group header 可一键聚焦或清空整个 group。](/screenshots/horizon-0.7.0/p03-topology-03-group-selector.webp)
图 3：从地图选择器里一次聚焦整个 service group。</br>

## 从一条调用下钻到实例

服务到服务的边是一条聚合调用；它背后是真实实例在和真实实例通信。点击地图上的一条调用并选择 **Instance map →**，Horizon 会画出这层关系：客户端服务的实例在左列，服务端服务的实例在右列，中间是实例级调用，并带有客户端→服务端方向动画。它复用服务地图上的所有能力：健康 ring 节点、每条调用的 client/server 指标侧栏、带 **Open instance dashboard** 的节点 popover，并且按 Layer 自己的词汇标注列名，比如 Kubernetes 上叫 *Pods*，data plane 上叫 *Sidecars*。两个服务选择器是 **感知关系** 的：server 列表来自当前 client 的 callees，client 列表来自当前 server 的 callers；每次改动其中一个，另一个都会重新推导。

![图 4：Instance map。客户端服务实例在左，服务端服务实例在右，中间是实例级调用，并带每条调用的指标侧栏。](/screenshots/horizon-0.7.0/p03-topology-04-instance-map.webp)
图 4：从一条聚合调用下钻到背后的实例到实例流量。</br>

## 按 endpoint 走完整请求链

服务拓扑回答“哪些服务调用了这个服务”。**API dependency** 标签页回答更尖锐的问题：“哪些 *endpoint* 调用了这个 endpoint，它又调用了哪些 endpoint”。选择一个 endpoint 后，图会按方向分列：callers 在左，焦点 endpoint 在中间，callees 在右。它同样用 SLA 色边框、每条边上的 RPM 和时延，以及最重边标签。选中节点后会出现一个 **+** handle，一键拉入 *它自己* 的 callers 和 callees，所以你可以一跳一跳走完整链路，而不是一次淹没在整张图里。拖开节点后，外跳链接（**Open endpoint**、**Service →**）会在新标签页打开，保留你正在探索的图。

![图 5：API dependency 图。callers 在左，焦点 endpoint 在中间，callees 在右，通过 + handle 扩展一跳，每条边带时延和 SLA 着色 RPM。](/screenshots/horizon-0.7.0/p03-topology-05-api-dependency.webp)
图 5：按 endpoint 一跳一跳走请求链，每条边都有时延。</br>

## 一个服务在所有 Layer 里的样子

一个逻辑服务经常会同时通过多个 Layer 上报：General agent、Service Mesh sidecar、mesh data plane、Kubernetes pod。SkyWalking 从 OAP 10 开始就建模了这种跨 Layer 层级关系；Horizon 做的事情，是让它从地图上任何位置都能 **一键打开**。选中一个节点后，Horizon 会惰性探测它的 hierarchy。如果这个服务有跨 Layer peers，节点上会贴一个小的 **chevron-stack chip**。

![图 6：选中的服务节点上带 chevron-stack chip，这是该服务还通过其他 Layer 上报的提示。](/screenshots/horizon-0.7.0/p03-topology-06-smartscape.webp)
图 6：选中节点上的 chevron-stack chip。它在选择时惰性探测，只在服务存在跨 Layer peers 时显示。</br>

点击这个 chip，拓扑会在 **Smartscape** 叠加视图下变暗：焦点节点在原位高亮重绘，它的 peers 按 OAP 的 Layer 顺序纵向展开，请求近端 Layer 在上，基础设施近端 Layer 在下。之后两步点击就能在对应 Layer 中打开任意 peer，并完成预选。（叠加视图打开时自动刷新会暂停，避免内容在你眼前移动。）

![图 7：Smartscape 叠加视图。一个逻辑服务投射到多个 Layer（General agent、Service Mesh、mesh data plane、Kubernetes），按 Layer 顺序展开，每个 peer 可一键进入自己的 Layer。](/screenshots/horizon-0.7.0/p03-topology-06-smartscape-expand.webp)
图 7：一个服务在所有上报 Layer 中的样子，以一键叠加视图展示跨 Layer hierarchy。</br>

## 下一步去哪里

这些地图上的每个指标、阈值和边权重，都位于 Layer template 的 `topology` 块里。换句话说，你会用和仪表盘一样的配置驱动方式调整它们，这也是后续文章的主题。字段参考可以看 [layer-template](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/customization/layer-templates/) 里的 topology 文档。

下一篇：**Deployment 标签页和 BanyanDB 自观测**。同样的地图技术会转向 *内部*，展示一个集群服务自身实例是如何部署、如何相互通信的。
