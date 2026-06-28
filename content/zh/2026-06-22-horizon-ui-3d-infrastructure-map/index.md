---
title: "认识 Horizon UI · 5/17：3D 基础设施地图"
date: 2026-06-22
author: 吴晟
description: "Horizon UI 系列第五篇：用一个 WebGL 场景把整个部署放到同一张 3D 地图里，把各个 Layer 的服务渲染成立方体，并同时展示实时流量、告警和调用关系。"
tags:
  - Cloud Native
  - Engineering
---

*本文翻译自英文原文：[Meet Horizon UI · 5/17: The 3D Infrastructure Map](/blog/2026-06-22-horizon-ui-3d-infrastructure-map/)，发布日期沿用原文日期。*

这是 [Meet Horizon UI](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列的第五篇。[第三篇](/zh/2026-06-21-horizon-ui-topology-and-dependency/)画的是服务 *之间* 的地图，[第四篇](/zh/2026-06-21-horizon-ui-deployment-and-banyandb/)画的是单个服务 *内部* 的地图。这一篇把视角拉到最远：用一个 **WebGL** 视图一次看完整个部署。每个 SkyWalking Layer 的服务都会渲染成立方体，堆叠到 3D 空间里，并显示实时流量、告警和它们之间的调用关系。它补上了按 Layer 仪表盘之外的全局视角：退后一步，看整个系统。

它也确实可以交互。所以这里直接放出来：下面就是运行在 demo 示例数据上的真实地图。拖动旋转，滚轮缩放，点击立方体：

{{< map3d poster="/images/home/horizon-3d-map.png" badge="交互演示 · 示例数据" >}}

## 一个场景看全局

3D 地图是 `/3d/map` 里的独立全屏页面，从顶栏里的 **3D Infra** 入口打开。它刻意拿掉控制台其余部分：没有侧边栏，没有顶栏，没有全局时间选择器。整个 viewport 都交给场景。SkyWalking 标识放在左下角，右上角的 `×` 返回 Horizon。里面所有数据都来自 Horizon 其他页面访问的同一个 OAP：服务清单、每个 Layer 的拓扑、每个服务的流量，以及活跃告警。

![图 1：3D Infrastructure Map。每个 Layer 的服务渲染成立方体，按品牌色分组为每个 Layer 的 zone，并堆叠到横向 tier 上，右侧是 tier/layer 面板。](/screenshots/horizon-0.7.0/p05-3dmap-01-overview.webp)
图 1：一个场景看整个部署：服务是立方体，Layer 是带颜色的 zone，角色按 tier 堆叠。</br>

## Tier 是骨架

**Tier** 是一层横向平面，用来把系统中职责相近的 Layer 放在一起。Tier 从上到下的阅读顺序，就是请求流动的大致方向：从用户触达的应用，一路到底层平台。Horizon 内置四个 tier：

- **Apps**（顶部）：应用界面和应用视角看到的依赖，包括 General agent services、Browser/RUM、mobile，以及 `Virtual*` targets（database、cache、MQ、gateway、GenAI）。
- **Middleware**：数据和消息服务、网关，以及自观测组件，包括 MySQL、PostgreSQL、Redis、Kafka、RocketMQ、APISIX、Nginx、SkyWalking SO11Y components 和云托管数据服务。
- **Service Mesh**：承载应用流量的 mesh，包括 Istio control/data plane、Cilium、Envoy AI Gateway。
- **Infra**（底部）：其余内容运行在其上的平台，包括 Kubernetes、hosts、VMs。

OAP 上报的每个 Layer 都会归入一个 tier。Horizon 还没分类的新 Layer，比如 OAP 新增的 Layer，会归入 **failover tier**（默认 Middleware）并带 "unclassified" 标记。这样它会出现，运维人员也可以重新分配，而不是静默从地图上消失。右侧面板映射了整个堆栈：点击 tier 行可以把镜头移到对应位置，用眼睛开关一次显示或隐藏整个 tier（或单个 Layer），并查看当前可见服务数量。

## 怎么读地图：立方体、zone、流量

每个服务对应一个 **立方体**。立方体会在 tier 上按所属 Layer 聚成一个 **zone**：半透明矩形使用该 Layer 的品牌色，并盖上项目 logo（Istio 的帆、Kubernetes 舵轮、数据库圆柱、队列图标），所以从任何视角都能辨认出 zone。带拓扑的 Layer（General、Service Mesh、Kubernetes Service、Cilium）会按 **调用依赖** 摆放立方体：上游 caller 在一侧，下游服务在另一侧，对应 2D 服务地图的 3D 版本。没有拓扑的 Layer 则把立方体排成整齐网格。

立方体下方的小 **traffic** 标签显示该服务的实时主吞吐：应用和 mesh 服务是 requests per minute，数据服务是 queries 或 operations per second，并保留各自单位。只有足够近、可读时标签才出现；缩远后会淡出，保持场景干净；选中的立方体总会显示它的数字。

## 告警，以及 incident 用的 Beacon mode

当一个服务有 **当前正在触发的告警** 时（Horizon 轮询最近 20 分钟，并只统计 service 作用域下仍在触发的告警），它的立方体会 **红色脉冲**。这就是一个信标，即使隔着整个场景也能看到，而告警列表会独立刷新。

在繁忙地图里，几百个立方体中的一个红点仍然可能难找，所以有 **Beacon mode**。从工具栏打开后，所有 *健康* 立方体都会变成深色 wireframe，只留下正在告警的服务发光。部署结构仍然清楚，但真正出问题的服务才有颜色。这个模式可以把鸟瞰图快速切成 incident triage 界面。

![图 2：Beacon mode。所有健康立方体变成 wireframe 幽影，只有正在触发告警的服务保持红色发光。](/screenshots/horizon-0.7.0/p05-3dmap-02-beacon-mode.webp)
图 2：Beacon mode 会把健康对象变暗成幽影，所以你只会看到正在触发的服务。</br>

## 对象之间的线

地图不只画节点，也画调用图：

- **In-layer calls**：同一个 Layer 内两个服务之间的浅青色管线，并带沿线运动的数据包动画。这是每个 Layer 自己的内部调用图，始终开启。
- **Cross-layer calls**：同一个 tier 上不同 Layer 服务之间的柔和琥珀色箭头，比如 Browser app 调用 Frontend、Frontend 调用 Virtual Database，方向从 caller 指向 callee。
- **Hierarchy links**：这是让 3D 布局真正发挥价值的一类线。选中一个立方体后，粗灰色管线会连接 **同一个逻辑服务在不同 tier 上的多张面孔**：agent 看到的服务、mesh 看到的服务、Kubernetes service 看到的服务。它们表示 *身份*，不是流量，所以默认隐藏；选中立方体后只显示与它相关的对象，并沿着 tier 一层层爬上去。这就是[第三篇](/zh/2026-06-21-horizon-ui-topology-and-dependency/)里的 Smartscape，用它本来就该拥有的维度画出来。

![图 3：选中一个服务后，详情卡片出现在立方体旁边，跨 tier hierarchy links 亮起，把 Apps、Service Mesh 和 Infra tier 中的同一个逻辑服务连起来。](/screenshots/horizon-0.7.0/p05-3dmap-03-selected-hierarchy.webp)
图 3：选中立方体后，身份链接沿 tier 爬升：同一个服务，被 agent、mesh 和 Kubernetes 分别看到。</br>

## 怎么移动

拖动旋转，滚轮缩放，**方向键** 或 **WASD** 平移视角（按住 **Shift** 步长更大）；左上角工具栏也为触控板提供同样动作的按钮。有一条刻意设计的规则值得知道：**3D 场景里的点击永远不会移动视角**，只负责选择。点击一个立方体，它会高亮，旁边出现详情卡片（服务名称、tier、Layer，以及会在新标签页打开该服务 Layer 仪表盘的 **Open dashboard** 按钮），它的 hierarchy links 也会亮起。移动视角的交互入口是 *侧边面板* 和 *工具栏*；点击 Layer 行，镜头会滑到它的 zone。把“选择”和“移动视角”分开，点击小立方体才会可靠，不会刚点中它就让它从光标下滑走。

## 它如何构建场景

整个部署的数据太大，不适合一次请求拉完，所以地图分阶段加载，底部细长的 **timeline strip** 会实时展示进度：**Services**（服务清单和所属 Layer）→ **Templates**（哪些 Layer 带拓扑）→ **Topologies**（每个有拓扑 Layer 的调用图）→ **Hierarchy**（跨 tier 身份链接）→ **Layout**（摆放立方体）→ **Metrics**（按批次获取每个服务的流量，让立方体逐步亮起来）。点击任意阶段可以打开抽屉查看详情，也可以点击 refresh 重新跑完整流程。

两个设计让刷新变便宜。**Hierarchy** 阶段是增量的：只有上次之后新增的服务需要探测，其余从缓存复用，所以稳定部署在这一步没有额外代价。场景还会按每个 Layer 的结构 hash 更新 key；结构没变时刷新会保留你的视角位置，只有服务清单或边真的变化时才重建布局。底层使用 [Three.js](https://threejs.org/) 加一层很薄的 Vue wrapper，同类立方体共享 geometry 和 material。正是这些细节，让几百个服务也能在浏览器标签页里平滑渲染。

## 配置出来的，不是写死的

上面这些不是一张写死的 "3D screen"。地图展示什么，由管理员在 `/admin/3d-map` 的 **结构化表单编辑器** 里编辑：tier、Layer、颜色和指标都通过表单控制，而不是直接写 JSON。你可以在里面：

- **用一个全局正则过滤 Layer**：匹配排除的内容会完全从地图上消失。
- **安排 tier**：重命名、从上到下重排，并把每个 Layer 固定到某个 tier 上，同时指定 failover tier，避免内容静默丢失。
- **对 Layer 分组**：把多个相关 Layer，比如 SkyWalking 自观测组件，聚成一个带标签的 block，每个成员仍然保留自己的颜色。
- **为每个 Layer 配色并选择流量指标**：配置 MQE 表达式、label 和单位；默认值会从该 Layer 的仪表盘模板里初始化，所以大多数 Layer 一开始就能显示合理数字。

Horizon 自带一份默认配置，所以地图开箱就有用。你的修改会以本地 draft 保存，直到点击 **Check diff & push** 发布到 OAP。它使用和仪表盘相同的 draft → preview → publish 模型，也支持同样的 Export/Import，用于备份或在部署之间迁移配置。地图本身是只读 **observe** 界面，可以直接运行在当前 OAP 上；发布用于控制地图形态的配置，则属于后续文章会完整介绍的配置化定制。

![图 4：3D-map 配置。`/admin/3d-map` 提供结构化编辑器，用于配置 tier、每个 Layer 的颜色和流量指标、Layer group 和全局过滤器，并使用常规 draft → Check diff & push 发布流程。](/screenshots/horizon-0.7.0/p05-3dmap-04-config-editor.webp)
图 4：地图是配置，不是代码。tier、颜色和每个 Layer 的流量指标都以表单方式编辑，然后发布到 OAP。</br>

## 下一步去哪里

3D 地图是全局入口；2D 的按 Layer 页面仍然是最完整的服务地图。查看它只需要读权限（`infra-3d:read`，内置 viewer 角色及以上持有）；调整它需要和仪表盘相同的写权限。字段参考，包括 tier、配置结构和加载阶段，可以看 [3D Infrastructure Map 文档](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/operate/infra-3d-map/)。

下一篇：**Trace Explorer**。从整个部署的鸟瞰图，回到单个请求，并用三种方式画出来。
