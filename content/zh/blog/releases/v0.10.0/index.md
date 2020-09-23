---
title: "MOSN v0.10.0 发布"
linkTitle: "MOSN v0.10.0 发布"
date: 2020-02-28
author: "MOSN 团队"
aliases: "/zh/blog/releases/v0.10.0"
description: >
  MOSN v0.10.0 变更日志。
---

我们很高兴的宣布 [MOSN v0.10.0](https://github.com/mosn/mosn/releases/tag/v0.10.0) 发布。以下是该版本的变更日志。

### 新功能

- 支持多进程插件模式（[#979](https://github.com/mosn/mosn/pull/979)，[@taoyuanyuan](https://github.com/taoyuanyuan)）
- 启动参数支持 service-meta参数（[#952](https://github.com/mosn/mosn/pull/952)，[@trainyao](https://github.com/trainyao)）
- 支持 abstract uds 模式挂载 sds socket

### 重构

- 分离部分 MOSN 基础库代码到 [mosn.io/pkg](https://github.com/mosn/pkg)
- 分离部分 MOSN 接口定义到 [mosn.io/api](https://github.com/mosn/api)

### 优化

- 日志基础模块分离到 `mosn.io/pkg`，MOSN 的日志实现优化
- 优化 FeatureGate（[#927](https://github.com/mosn/mosn/pull/927)，[@nejisama](https://github.com/nejisama)）
- 新增处理获取 SDS 配置失败时的处理
- CDS 动态删除 Cluster时，会同步停止对应 Cluster 的健康检查
- SDS 触发证书更新时的回调函数新增证书配置作为参数

### Bug 修复

- 修复在 SOFARPC Oneway 请求失败时，导致的内存泄漏问题
- 修复在收到非标准的 HTTP 响应时，返回 502 错误的问题
- 修复 DUMP 配置时可能存在的并发冲突
- 修复 TraceLog 统计的 Request 和 Response Size 错误问题
- 修复因为并发写连接导致写超时失效的问题
- 修复 serialize 序列化的 bug
- 修复连接读取时内存复用保留 buffer 过大导致内存占用过高的问题
- 优化 XProtocol 中 Dubbo 相关实现

