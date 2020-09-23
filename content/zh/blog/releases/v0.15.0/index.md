---
title: "MOSN v0.15.0 发布"
linkTitle: "MOSN v0.15.0 发布"
date: 2020-08-05
author: "MOSN 团队"
aliases: "/zh/blog/releases/v0.15.0"
description: "MOSN v0.15.0 变更日志。"
---

我们很高兴的宣布 [MOSN v0.15.0](https://github.com/mosn/mosn/releases/tag/v0.15.0) 发布，恭喜邓茜（[@dengqian](https://github.com/dengqian)）成为 MOSN Committer，感谢她为 MOSN 社区所做的贡献。

以下是该版本的变更日志。

### 新功能

+ 路由 Path Rewrite 支持按照正则表达式的方式配置 Rewrite 的内容 [@liangyuanpeng](https://github.com/liangyuanpeng)
+ 配置新增字段： 扩展配置字段，可通过扩展配置字段自定义启动配置；Dubbo 服务发现配置通过扩展的配置字段实现 [@cch123](https://github.com/cch123)
+ 支持 DSL 新特性，可以方便的对请求的处理行为进行控制 [@wangfakang](https://github.com/wangfakang)
+ StreamFilter 新增流量镜像功能的扩展实现 [@champly](https://github.com/champly)
+ Listener 配置新增对 UDP 的支持 [@dengqian](https://github.com/dengqian)
+ 配置格式支持 Yaml 格式解析 [@GLYASAI](https://github.com/GLYASAI)
+ 路由支持 HTTP 重定向配置 [@knight42](https://github.com/knight42)

### 优化

+ 支持 istio 的 stats filter，可以根据匹配条件进行 metrics 的个性化记录 [@wzshiming](https://github.com/wzshiming)
+ Metrics 配置支持配置 Histogram 的输出百分比 [@champly](https://github.com/champly)
+ StreamFilter 新增状态用于直接中止请求，并且不响应客户端 [@taoyuanyuan](https://github.com/taoyuanyuan)
+ XProtocol Hijack 响应支持携带 Body [@champly](https://github.com/champly)
+ Skywalking 升级到 0.5.0 版本 [arugal](https://github.com/arugal)
+ Upstream 连接 TLS 状态判断修改，支持通过 TLS 配置的 Hash 判断是否需要重新建立连接 [@nejisama](https://github.com/nejisama)
+ 优化 DNS cache 逻辑，防止在 DNS 失效时可能引起的 DNS flood 问题 [@wangfakang](https://github.com/wangfakang)

### Bug 修复

+ 修复开启 TLS 加密场景下，XProtocol 协议在有多个协议的场景下判断协议错误的 BUG [@nejisama](https://github.com/nejisama)
+ 修复 AccessLog 中前缀匹配类型的变量不生效的 BUG [@dengqian](https://github.com/dengqian)
+ 修复 Listener 配置解析处理不正确的 BUG [@nejisama](https://github.com/nejisama)
+ 修复 Router/Cluster 在文件持久化配置类型中，Name 字段包含路径分隔符时会保存失败的 BUG [@nejisama](https://github.com/nejisama)
