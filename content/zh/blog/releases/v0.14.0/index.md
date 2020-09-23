---
title: "MOSN v0.14.0 发布"
linkTitle: "MOSN v0.14.0 发布"
date: 2020-07-01
author: "MOSN 团队"
aliases: "/zh/blog/releases/v0.14.0"
description: "MOSN v0.14.0 变更日志。"
---

我们很高兴的宣布 [MOSN v0.14.0](https://github.com/mosn/mosn/releases/tag/v0.14.0) 发布，恭喜[姚昌宇（@trainyao）](https://github.com/trainyao)成为 MOSN Committer，感谢他为 MOSN 社区所做的贡献。

以下是该版本的变更日志。

### 新功能

- 支持 Istio 1.5.X [@wangfakang](https://github.com/wangfakang) [@trainyao](https://github.com/trainyao) [@champly](https://github.com/champly)
  - go-control-plane 升级到 0.9.4 版本
  - xDS 支持 ACK，新增 xDS 的 Metrics
  - 支持 Istio sourceLabels 过滤功能
  - 支持 pilot-agent 的探测接口
  - 支持更多的启动参数，适配 Istio agent 启动场景
  - gzip、strict-dns、original-dst 支持 xDS 更新
  - 移除 Xproxy 逻辑
- Maglev 负载均衡算法支持 [@trainyao](https://github.com/trainyao)
- 新增连接池实现，用于支持消息类请求 [@cch123](https://github.com/cch123)
- 新增 TLS 连接切换的 Metrics [@nejisama](https://github.com/nejisama)
- 新增 HTTP StatusCode 的 Metrics [@dengqian](https://github.com/dengqian)
- 新增 Metrics Admin API 输出 [@dengqian](https://github.com/dengqian)
- proxy 新增查询当前请求数的接口 [@zonghaishang](https://github.com/zonghaishang)
- 支持 HostRewrite Header [@liangyuanpeng](https://github.com/liangyuanpeng)

### 优化

- 升级 tars 依赖，修复在高版本 Golang 下的编译问题 [@wangfakang](https://github.com/wangfakang)
- xDS 配置解析升级适配 Istio 1.5.x [@wangfakang](https://github.com/wangfakang)
- 优化 proxy 的日志输出 [@wenxuwan](https://github.com/wenxuwan)
- DNS Cache 默认时间修改为 15s [@wangfakang](https://github.com/wangfakang)
- HTTP 参数路由匹配优化 [@wangfakang](https://github.com/wangfakang)
- 升级 fasthttp 库 [@wangfakang](https://github.com/wangfakang)
- 优化 Dubbo 请求转发编码 [@zonghaishang](https://github.com/zonghaishang)
- 支持 HTTP 的请求最大 body 可配置 [@wangfakang](https://github.com/wangfakang)

### Bug 修复

- 修复 Dubbo Decode 无法解析 attachment 的 bug [@champly](https://github.com/champly)
- 修复 HTTP2 连接建立之前就可能创建 stream 的 bug [@dunjut](https://github.com/dunjut)
- 修复处理 HTTP2 处理 Trailer 空指针异常 [@taoyuanyuan](https://github.com/taoyuanyuan)
- 修复 HTTP 请求头默认不标准化处理的 bug [@nejisama](https://github.com/nejisama)
- 修复 HTTP 请求处理时连接断开导致的 panic 异常 [@wangfakang](https://github.com/wangfakang)
- 修复 dubbo registry 的读写锁拷贝问题 [@champly](https://github.com/champly)
