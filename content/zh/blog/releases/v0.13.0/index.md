---
title: "MOSN v0.13.0 发布"
linkTitle: "MOSN v0.13.0 发布"
date: 2020-06-01
author: "MOSN 团队"
aliases: "/zh/blog/releases/v0.13.0"
description: >
  MOSN v0.13.0 变更日志。
---

我们很高兴的宣布 [MOSN v0.13.0](https://github.com/mosn/mosn/releases/tag/v0.13.0) 发布。

以下是该版本的变更日志。

### 新功能

- 支持 Strict DNS Cluster [@dengqian](https://github.com/dengqian)
- 支持 GZip 处理的 Stream Filter [@wangfakang](https://github.com/wangfakang)
- Dubbo 服务发现完成 Beta 版本 [@cch123](https://github.com/cch123)
- 支持单机故障隔离的 Stream Filter [@NeGnail](https://github.com/NeGnail)
- 集成 Sentinel 限流能力 [@ansiz](https://github.com/ansiz)

### 优化

- 优化 EDF LB 的实现，使用 EDF 重新实现 WRR LB [@CodingSinger](https://github.com/CodingSinger)
- 配置获取 ADMIN API 优化，新增 Features 和环境变量相关 ADMIN API [@nejisama](https://github.com/nejisama)
- 更新 Host 时触发健康检查的更新从异步模式修改为同步模式 [@nejisama](https://github.com/nejisama)
- 更新了 Dubbo 库，优化了 Dubbo Decode 的性能 [@zonghaishang](https://github.com/zonghaishang)
- 优化 Metrics 在 Prometheus 中的输出，使用正则过滤非法的 Key [@nejisama](https://github.com/nejisama)
- 优化 MOSN 的返回状态码 [@wangfakang](https://github.com/wangfakang)

### Bug 修复

- 修复健康检查注册回调函数时的并发冲突问题 [@nejisama](https://github.com/nejisama)
- 修复配置持久化函数没有正确处理空配置的错误 [@nejisama](https://github.com/nejisama)
- 修复 ClusterName/RouterName 过长时，以文件形式 DUMP 会失败的问题 [@nejisama](https://github.com/nejisama)
- 修复获取 XProtocol 协议时，无法正确获取协议的问题 [@wangfakang](https://github.com/wangfakang)
- 修复创建 StreamFilter 时，获取的 context 错误的问题 [@wangfakang](https://github.com/wangfakang)