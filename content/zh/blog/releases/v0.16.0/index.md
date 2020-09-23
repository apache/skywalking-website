---
title: "MOSN v0.16.0 发布"
linkTitle: "MOSN v0.16.0 发布"
date: 2020-09-01
author: "MOSN 团队"
aliases: "/zh/blog/releases/v0.16.0"
description: "MOSN v0.16.0 变更日志。"
---

我们很高兴的宣布 [MOSN v0.16.0](https://github.com/mosn/mosn/releases/tag/v0.16.0) 发布。

以下是该版本的变更日志。

## v0.16.0

### 优化

+ Logger Roller 支持自定义 Roller 的实现 [@wenxuwan](https://github.com/wenxuwan)
+ StreamFilter 新增接口 SendHijackReplyWithBody [@wenxuwan](https://github.com/wenxuwan)
+ 配置项新增关闭热升级选项，关闭热升级以后一个机器上可以同时存在多个不同的 MOSN 进程 [@cch123](https://github.com/cch123)
+ 优化 MOSN 集成测试框架，补充单元测试 [@nejisama](https://github.com/nejisama) [@wangfakang](https://github.com/wangfakang) [@taoyuanyuan](https://github.com/taoyuanyuan)
+ xDS 配置解析支持 DirectResponse 的路由配置 [@wangfakang](https://github.com/wangfakang)
+ ClusterManager 配置新增 TLSContext [@nejisama](https://github.com/nejisama)

### Bug 修复

+ 修复在热升级时 UDP 连接超时会导致死循环的 BUG [@dengqian](https://github.com/dengqian)
+ 修复在 SendFilter 中执行 DirectResponse 会触发死循环的 BUG [@taoyuanyuan](https://github.com/taoyuanyuan)
+ 修复 HTTP2 的 Stream 计数并发统计冲突的 BUG [@wenxuwan](https://github.com/wenxuwan)
+ 修复 UDP 连接因读超时导致的数据丢失问题 [@dengqian](https://github.com/dengqian)
+ 修复触发重试时因为协议标识丢失导致无法正确记录响应 StatusCode 的 BUG [@dengqian](https://github.com/dengqian)
+ 修复 BoltV2 协议解析错误的 BUG [@nejisama](https://github.com/nejisama)
+ 修复 Listener Panic 后无法自动 Restart 的 BUG [@alpha-baby](https://github.com/alpha-baby)
+ 修复变量机制中 NoCache 标签无效的 BUG [@wangfakang](https://github.com/wangfakang)
+ 修复 SDS 重连时可能存在并发冲突的 BUG [@nejisama](https://github.com/nejisama)

