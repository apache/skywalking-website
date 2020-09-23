---
title: "MOSN v0.12.0 发布"
linkTitle: "MOSN v0.12.0 发布"
date: 2020-04-28
author: "MOSN 团队"
aliases: "/zh/blog/releases/v0.12.0"
description: >
  MOSN v0.12.0 变更日志。
---

我们很高兴的宣布 [MOSN v0.12.0](https://github.com/mosn/mosn/releases/tag/v0.12.0) 发布，感谢[孙福泽（@peacocktrain）](https://github.com/peacocktrain)对该版本做出的巨大贡献，经 MOSN 社区 Lead 们认证为 [commiter](https://github.com/mosn/community/issues/6) 🎉。

以下是该版本的变更日志。

### 新功能

- [支持 Skywalking](blog/posts/skywalking-support) [@arugal](https://github.com/arugal)
- Stream Filter 新增了一个 Receive Filter 执行的阶段，可在 MOSN 路由选择完 Host 以后，再次执行 Receive Filter [@wangfakang](https://github.com/wangfakang)
- HTTP2 支持流式 [@peacocktrain](https://github.com/peacocktrain) [@taoyuanyuan](https://github.com/taoyuanyuan)
- FeatureGate 新增接口 KnownFeatures，可输出当前 FeatureGate 状态 [@nejisama](https://github.com/nejisama)
- 提供一种协议透明的方式获取请求资源（PATH、URI、ARG），对于资源的定义由各个协议自身定义 [@wangfakang](https://github.com/wangfakang)
- 新增负载均衡算法
  - 支持 ActiveRequest LB [@CodingSinger](https://github.com/CodingSinger)
  - 支持 WRR LB [@nejisama](https://github.com/nejisama)

### 优化

- XProtocol 协议引擎优化 [@neverhook](https://github.com/neverhook)
  - 修改 XProtocol 心跳响应接口，支持协议的心跳响应可返回更多的信息
  - 优化 connpool 的心跳触发，只有实现了心跳的协议才会发心跳
- Dubbo 库依赖版本从 v1.5.0-rc1 更新到 v1.5.0 [@cch123](https://github.com/cch123)
- API 调整，HostInfo 新增健康检查相关的接口 [@wangfakang](https://github.com/wangfakang)
- 熔断功能实现优化 [@wangfakang](https://github.com/wangfakang)
- 负责均衡选择逻辑简化，同样地址的 Host 复用相同的健康检查标记 [@nejisama](https://github.com/nejisama) [@cch123](https://github.com/cch123)
- 优化 HTTP 建连逻辑，提升 HTTP 建立性能 [@wangfakang](https://github.com/wangfakang)
- 日志轮转逻辑从写日志触发，调整为定时触发 [@nejisama](https://github.com/nejisama)
- typo 调整 [@xujianhai666](https://github.com/xujianhai666) [@candyleer](https://github.com/candyleer)

### Bug 修复

- 修复 xDS 解析故障注入配置的错误 [@champly](https://github.com/champly)
- 修复 MOSN HTTP HEAD 方法导致的请求 Hold 问题 [@wangfakang](https://github.com/wangfakang)
- 修复 XProtocol 引擎对于 StatusCode 映射缺失的问题 [@neverhook](https://github.com/neverhook)
- 修复 DirectReponse 触发重试的 BUG [@taoyuanyuan](https://github.com/taoyuanyuan)
