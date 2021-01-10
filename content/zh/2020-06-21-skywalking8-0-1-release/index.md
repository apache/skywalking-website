---
title: "Apache SkyWalking 8.0.1 发布"
date: 2020-06-21
author: 吴晟
description: "与 8.0.0 相比，此版本包含一个热修复程序。"
zh_tags:
- Release Blog
---

[Apache SkyWalking 8.0.1 已发布](https://github.com/apache/skywalking/releases/tag/v8.0.1)。SkyWalking 是观察性分析平台和应用性能管理系统，提供分布式追踪、服务网格遥测分析、度量聚合和可视化一体化解决方案，支持 Java, .Net Core, PHP, NodeJS, Golang, LUA 语言探针，支持 Envoy + Istio 构建的 Service Mesh。

与 8.0.0 相比，此版本包含一个热修复程序。

OAP-Backend

- 修复 `no-init` 模式在 Elasticsearch 存储中无法运行的错误

[8.0.0](https://github.com/apache/skywalking/releases/tag/v8.0.0) 值得关注的变化：

- 添加并实现了 v3 协议，旧版本与 8.x 不兼容
- 移除服务、实例、端点注册机制和 inventory 存储实体 (inventory storage entities)
- 提供新的 GraphQL 查询协议，同时支持旧协议（计划在今年年底移除）
- 支持 Prometheus 网络协议，可将 Prometheus 格式的指标传输到 SkyWalking 中
- 提供 Python agent
- 移除所有 inventory 缓存
- 提供 Apache ShardingSphere (4.0.0, 4.1.1) agent 插件
- UI dashboard 100% 可配置，可采用后台定义的新指标
- 修复 H2/MySQL 实现中的 SQL 注入漏洞
- Upgrade Nacos to avoid the FastJson CVE in high frequency.
- 升级 Nacos 以避免 FastJson CVE
- 升级 jasckson-databind 至 2.9.10

下载地址：<http://skywalking.apache.org/downloads/>



