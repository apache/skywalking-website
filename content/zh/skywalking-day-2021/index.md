---
title: "[视频] SkyWalking Day 2021 演讲视频"
date: 2021-07-06
author: "SKyWalking"
description: "SkyWalking Day 2021 讲师视频，请到 B 站观看。"
zh_tags:
- Video
- Conference
---

时间：2021 年 6 月 26 日

地点：北京市海淀区西格玛大厦 B1 多功能厅

视频回放：见 [Bilibili](https://space.bilibili.com/390683219/channel/detail?cid=190669)

#### [Apache SkyWalking Landscape](https://www.bilibili.com/video/BV1HV411W7sr)

- 吴晟 Sheng Wu. Tetrate Founding Engineer, Apache Software Foundation board director. SkyWalking founder.

SkyWalking 2020-2021 年发展和后续计划

#### [微服务可观测性分析平台的探索与实践](https://www.bilibili.com/video/BV15g411u7nh)

- 凌若川 腾讯高级工程师

可观测性分析平台作为云原生时代微服务系统基础组件，开放性与性能是决定平台价值的核心要素。 复杂微服务应用场景与海量多维链路数据，对可观测性分析平台在开放性设计和各环节高性能实现带来诸多挑战。 本次分享中将重点梳理腾讯云微服务团队在构建云原生可观测性分析平台过程中遇到的挑战，介绍我们在架构设计与实现方面的探索与实践。

1. 云原生时代微服务可观测性平台面临的性能与可用性挑战
2. 腾讯云在构建高性能微服务可观测性分析平台的探索与实践
3. 微服务可观测性分析平台架构的下一阶段演进方向展望

#### [BanyanDB 数据模型背后的逻辑](https://www.bilibili.com/video/BV1Eo4y1C7KJ)

- 高洪涛 Hongtao Gao. Tetrate SRE, SkyWalking PMC, Apache ShardingSphere PMC.

BanyanDB 作为为处理 Apache SkyWalking 产生的 trace，log 和 metric 的数据而特别设计的数据库，其背后数据模型的抉择是非常与众不同的。 在本次分享中，我将根据 RUM 猜想来讨论为什么 BanyanDB 使用的数据模型对于 APM 数据而言是更加高效和可靠的。

通过本次分享，观众可以：

1. 理解数据库设计的取舍
2. 了解 BanyanDB 的数据模型
3. 认识到该模型对于 APM 类数据有特定的优势

#### [Apache SkyWalking 如何做前端监控](https://www.bilibili.com/video/BV1FL411W7XE)

- 范秋霞 Qiuxia Fan，Tetrate FE SRE，SkyWalking PMC.

Apache SkyWalking 对前端进行了监控与跟踪，分别有 Metric, Log, Trace 三部分。本次分享我会介绍页面性能指标的收集与计算，同时用案列进行分析，也会讲解 Log 的采集方法以及 Source Map 错误定位的实施。最后介绍浏览器端 Requets 的跟踪方法。

通过本次分享，观众可以：

1. 了解页面的性能指标以及收集计算方法
2. 了解前端如何做错误日志收集
3. 如何对页面请求进行跟踪以及跟踪的好处

#### [一名普通工程师，该如何正确的理解开源精神？](https://www.bilibili.com/video/BV1Bh411h7RE)

- 王晔倞 Yeliang Wang. API7 Partner / Product VP.

开源精神，那也许是一种给于和获取的平衡，有给于才能有获取，有获取才会有给于的动力。无需指责别人只会获取，我们应该懂得开源是一种创造方式，一个没有创造欲和创造力的人加入开源也是无用的。

通过本次分享，观众可以：

1. 为什么国内一些程序员会对开源产生误解？
2. 了解 “开源≠自由≠非商业” 的来龙去脉。
3. 一名普通工程师，如何高效地向开源社区做贡献？

#### [可观测性技术生态和 OpenTelemetry 原理及实践](https://www.bilibili.com/video/BV1NU4y1V7LX)

- 陈一枭 腾讯. OpenTelemetry docs-cn maintainer、Tencent OpenTelemetry OTeam 创始人

综述云原生可观测性技术生态，介绍 OpenTracing，OpenMetrics，OpenTelemetry 等标准演进。介绍 OpenTelemetry 存在价值意义，介绍 OpenTelemetry 原理及其整体生态规划。介绍腾讯在 OpenTelemetry 方面的实践。

本次分享内容如下：

1. 云原生可观测性技术简介
2. OpenTelemetry 及其它规范简介
3. OpenTelemetry 原理
4. OpenTelemetry 在腾讯的应用及实践

#### [Apache SkyWalking 事件采集系统更快定位故障](https://www.bilibili.com/video/BV1NU4y1V7LX)

- 柯振旭 Zhenxu Ke，Tetrate SRE, Apache SkyWalking PMC. Apache Incubator PMC. Apache Dubbo committer.

通过本次分享，听众可以：

1. 了解 SkyWalking 的事件采集系统；
2. 了解上报事件至 SkyWalking 的多种方式；
3. 学习如何利用 SkyWalking 采集的事件结合 metrics，分析目标系统的性能问题；

#### [可观测性自动注入技术原理探索与实践](https://www.bilibili.com/video/BV13B4y1T78H)

- 詹启新 Tencnet OpenTelemetry Oteam PMC

在可观测领域中自动注入已经成为重要的组成部分之一，其优异简便的使用方式并且可同时覆盖到链路、指标、日志，大大降低了接入成本及运维成本，属于友好的一种接入方式； 本次分享将介绍 Java 中的字节码注入技术原理，及在可观测领域的应用实践

1. 常用的自动注入技术原理简介
2. 介绍可观测性在 Java 落地的要点
3. opentelemetry-java-instrumentation 的核心原理及实现
4. opentelemetry 自动注入的应用实践

#### [如何利用 Apache APISIX 提升 Nginx 的可观测性](https://www.bilibili.com/video/BV1864y1Q71f)

- 金卫 Wei Jin, API7 Engineer Apache SkyWalking committer. Apache apisix-ingress-controller Founder. Apache APISIX PMC.

在云原生时代，动态和可观测性是 API 网关的标准特性。Apache APISIX 不仅覆盖了 Nginx 的传统功能，在可观测性上也和 SkyWalking 深度合作，大大提升了服务治理能力。本次分享会介绍如何无痛的提升 Nginx 的可观测性和 APISIX 在未来可观测性方面的规划。

通过本次分享，观众可以：

1. 通过 Apache APISIX 实现观测性的几种手段.
2. 了解 Apache APISIX 高效且易用的秘诀.
3. 结合 Apache skywalking 进一步提升可观测性.