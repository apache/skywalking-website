---
title: "直播预告：MOSN 的多协议机制解析"
linkTitle: "直播预告：MOSN 的多协议机制解析"
date: 2020-03-03
author: "MOSN 团队"
aliases: "/zh/blog/news/mosn-channel-1"
description: >
  本次直播活动的演讲者无钩，将向大家介绍 MOSN 实现多协议低成本接入的设计思路，以及相应的快速接入实践案例。
---

作为云原生网络代理，Service Mesh 是 MOSN 的重要应用场景。随着 Service Mesh 概念的日益推广，大家对这套体系都已经不再陌生，有了较为深入的认知。但是与理论传播相对应的是，生产级别的大规模落地实践案例却并不多见。这其中有多方面的原因，包括社区方案饱受诟病的“大规模场景性能问题”、“配套的运维监控基础设施演进速度跟不上”、“存量服务化体系的兼容方案”等等。

现实场景中，大部分中国厂商都有一套自研 RPC 的服务化体系，属于「存量服务化体系的兼容方案」中的协议适配问题。为此，MOSN 设计了一套多协议框架，用于降低自研体系的协议适配及接入成本，加速 Service Mesh 的落地普及。本次演讲将向大家介绍 MOSN 实现多协议低成本接入的设计思路，以及相应的快速接入实践案例。

讲师：无钩（[@neverhook](https://github.com/neverhook)）

![无钩](https://gw.alipayobjects.com/mdn/rms_91f3e6/afts/img/A*CfJuT7aNWgoAAAAAAAAAAABkARQnAQ)

## 本期大纲

- 一个请求的 MOSN 之旅
- 如何在 MOSN 中接入新的协议
- [SOFABolt](https://github.com/sofastack/sofa-bolt) 协议接入实践
- 未来发展：统一路由框架

直播报名：https://tech.antfin.com/community/live/1131

扫描[社区](community/)页面的二维码加入钉钉群参与互动。
