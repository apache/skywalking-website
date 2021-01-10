---
title: "SkyWalking 的最新动向？8.0 版本的 MeterSystem 和网格监控"
date: 2020-06-15
author: "吴晟, 高洪涛, Tevah Platt（tetrate.io）"
description: "可观察性平台和开源应用程序性能监控（APM）项目 Apache SkyWalking，今天刚宣布 8.0 的发布版本。素以强劲指标、追踪与服务网格能力见称的 SkyWalking ，在最新版本中的功能性延展到用户渴求已久的功能 —— 将指标功能和包括 Prometheus 的其他指标收集系统进行了融合。"
zh_tags:
- Release Blog
---

可观察性平台和开源应用程序性能监控（APM）项目 Apache SkyWalking，今天刚宣布 8.0 的发布版本。素以强劲指标、追踪与服务网格能力见称的 SkyWalking ，在最新版本中的功能性延展到用户渴求已久的功能 —— 将指标功能和包括 Prometheus 的其他指标收集系统进行了融合。

### 什么是 Apache SkyWalking？

SkyWalking 是可观察性平台和 APM 工具，可以选择是否搭载服务网格的使用，为微服务、云原生和容器化应用提供自动度量功能。顶尖的 Apache 项目由来自世界各地的社区人员支持，应用在阿里巴巴、华为、腾讯、百度和大量其他企业。SkyWalking 提供记录、监控和追踪功能，同时也得力于其架构而拥有数据收集终端、分析平台，还有用户界面。

### 值得关注的优化包括：

- 用户界面 Dashboard 上提供百分百的自由度，用户可以任意进行配置，采用后台新定义的指标。
- 支持 Prometheus 导出格式。Prometheus 格式的指标可以转换至 SkyWalking。
- SkyWalking 现已可以自主监控服务网格，为 Istio 和 Envoy 提供指标。
- 服务、实例、终端地址的注册机制，和库存存储实体已经被移除了。

### 无须修改原始码的前提下，为用户界面加入新的指标

对于 SkyWalking 的用户，8.0 版本的亮点将会是数据模型的更新，而且传播格式也针对更多语言进行优化。再加上引进了新的 MeterSystem ，除了可以同步运行传统追踪模式，用户还可自定义需要收集的指标。追踪和服务网格专注在拓扑和服务流量的指标上，而 MeterSystem 则汇报用户感兴趣的业务指标，例如是数据库存取性能、圣诞节期间的下单率，或者用户注册或下单的百分比。这些指标数据会在 SkyWalking 的用户界面 Dashboard 上以图像显示。指标的面板数据和拓扑图可以通过 Envoy 的指标绘制，而追踪分析也可以支持 Istio 的遥测。Dashboard 还支持以 JSON 格式导入、导出，而 Dashboard 上的自定义指标也支持设定指标名称、实体种类（服务、实例、终端地址或全部）、标记值等。[用户界面模板](https://ibaotu.com/tupian/yonghujiemian.html)上已详细描述了用户界面的逻辑和原型配置，以及它的 Dashboard、tab 和组件。

### 观察任何配备了 Prometheus 的应用

在这次最新的社区发布中，SkyWalking 可以观察任何配备了 Prometheus 或者提供了 Prometheus 终端地址的应用。这项更新为很多想采用 SkyWalking 指标和追踪的用户节省了不少时间，现在你不再需要重新设置指标工具，就可以获得 Prometheus 数据。因为 Prometheus 更简单、更为人熟悉，是不少用户的不二选择。有了 8.0 版本，Prometheus 网络协议就能够读取所有已设定在 API 上的数据，另外 Prometheus 格式的指标也可转换至 SkyWalking 上。如此一来，通过图像方式展示，所有的指标和拓扑都能一目了然。同时，也支持 Prometheus 的 [fetcher](https://github.com/apache/skywalking/blob/master/docs/en/setup/backend/backend-fetcher.md)。

### 监控你的网格

SkyWalking 现在不再只是监控服务或平台，而是监控整个网格。有了 8.0 版本，你除了能获取关于你的网格的指标（包括 Istio 和 Envoy 在内），同时也能通过 SkyWalking 监控自身的性能。因为当监控服务在观察业务集群的同时，它也能实现自我观察，确保运维团队拥有稳定可靠的平台。

### 性能优化

最后，8.0 发布移除了注册机制，也不再需要使用独一无二的整数来代表实体。这项改变将大幅优化性能。想了解完整的更新功能列表，可以阅读在 SkyWalking 社区发布的公告[页面](https://baike.baidu.com/item/页面)。

### 额外资源

- 追踪 [Twitter](https://twitter.com/ASFSkyWalking) 获取更多 SkyWalking 最新资讯
- SkyWalking 未来的发布会加入原生指标 API 和融合 Micrometer (Sleuth) 指标集合。
