---
title: "MOSN v0.11.0 发布"
linkTitle: "MOSN v0.11.0 发布"
date: 2020-04-03
author: "MOSN 团队"
aliases: "zh/blog/releases/v0.11.0"
description: >
  MOSN v0.11.0 变更日志。
---

我们很高兴的宣布 [MOSN v0.11.0](https://github.com/mosn/mosn/releases/tag/v0.11.0) 发布。以下是该版本的变更日志。

### 新功能

- 支持 Listener Filter 的扩展，透明劫持能力基于 Listener Filter 实现 [@wangfakang](https://github.com/wangfakang)
- 变量机制新增 Set 方法 [@neverhook](https://github.com/neverhook)
- 新增 SDS Client 失败时自动重试和异常处理 [@pxzero](https://github.com/pxzero)
- 完善 TraceLog，支持注入 context [@taoyuanyuan](https://github.com/taoyuanyuan)
- 新增 FeatureGate `auto_config`，当开启该Feature以后动态更新的配置会保存到启动配置中 [@nejisama](https://github.com/nejisama)

### 重构

- 重构 XProtocol Engine，并且重新实现了 SofaRPC 协议 [@neverhook](https://github.com/neverhook)
  - 移除了 SofaRpc Healthcheck filter，改为 xprotocol 内建的 heartbeat 实现
  - 移除了 SofaRpc 协议原本的协议转换 (protocol conv) 支持，新增了基于 stream filter 的的协议转换扩展实现能力
  - xprotocol 新增 idle free 和 keepalive
  - 协议解析优化
- 修改 HTTP2 协议的 Encode 方法参数 [@taoyuanyuan](https://github.com/taoyuanyuan)
- 精简了 LDS 接口参数 [@nejisama](https://github.com/nejisama)
- 修改了路由配置模型，废弃了`connection_manager`[@nejisama](https://github.com/nejisama)

### 优化

- 优化 Upstream 动态解析域名机制 [@wangfakang](https://github.com/wangfakang)
- 优化 TLS 封装，新增了错误日志，修改了兼容模式下的超时时间 [@nejisama](https://github.com/nejisama)
- 优化超时时间设置，使用变量机制设置超时时间 [@neverhook](https://github.com/neverhook)
- Dubbo 解析库依赖升级到 1.5.0 [@cch123](https://github.com/cch123)
- 引用路径迁移脚本新增 OS 自适应 [@taomaree](https://github.com/taomaree)

### Bug 修复

- 修复 HTTP2 协议转发时丢失 query string 的问题 [@champly](https://github.com/champly)