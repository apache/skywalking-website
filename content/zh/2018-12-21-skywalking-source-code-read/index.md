---
title: "SkyWalking 源码解析合集"
date: 2018-12-21
author: 谭建
description: 源码解析的博客，可以帮助你更好的读懂 SkyWalking 的源码。
zh_tags:
- User Manual
- Source Code
---

## 搭建调试环境

阅读 SkyWalking 源码，从配置调试环境开始。

一定一定一定不要干读代码，而是通过调试的方式。

- [01 通过 Skywalking-5.x 版本的源码构建并运行](https://github.com/JaredTan95/skywalking-tutorials/blob/master/01-%E9%80%9A%E8%BF%87Skywalking-5.x%E7%89%88%E6%9C%AC%E7%9A%84%E6%BA%90%E7%A0%81%E6%9E%84%E5%BB%BA%E5%B9%B6%E8%BF%90%E8%A1%8C/Note.md) 👉：[哔哩哔哩](https://www.bilibili.com/video/av35806851/) | [腾讯视频](https://v.qq.com/x/page/d07924w6u13.html)
- [02 通过 Skywalking-6.x 版本的源码构建并运行](https://github.com/JaredTan95/skywalking-tutorials/blob/master/02-%E9%80%9A%E8%BF%87Skywalking-6.x%E7%89%88%E6%9C%AC%E7%9A%84%E6%BA%90%E7%A0%81%E6%9E%84%E5%BB%BA%E5%B9%B6%E8%BF%90%E8%A1%8C/Note.md) 👉：[哔哩哔哩](https://www.bilibili.com/video/av35990012/) | [腾讯视频](https://v.qq.com/x/page/s0793890ce6.html)
- [03 Java 应用（探针）接入 Skywalking[6.x]](https://github.com/JaredTan95/skywalking-tutorials/blob/master/03-Java%E5%BA%94%E7%94%A8%EF%BC%88%E6%8E%A2%E9%92%88%EF%BC%89%E6%8E%A5%E5%85%A5Skywalking/Note.md) 👉：[哔哩哔哩](https://www.bilibili.com/video/av36172319/) | [腾讯视频](https://v.qq.com/x/page/w0795uri7jy.html)

## SkyWalking 3.X 源码解析合集

虽然是基于 3.X 版本的源码解析，但是对于阅读 SkyWalking Java Agent 和插件部分，同样适用。

对于 SkyWalking Collector 部分，可以作为一定的参考。

- [《SkyWalking 源码分析 —— 调试环境搭建》](http://www.iocoder.cn/SkyWalking/build-debugging-environment?vip&guanfang)
- [《SkyWalking 源码分析 —— Agent 初始化》](http://www.iocoder.cn/SkyWalking/agent-init?vip&guanfang)
- [《SkyWalking 源码分析 —— Agent 插件体系》](http://www.iocoder.cn/SkyWalking/agent-plugin-system?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector 初始化》](http://www.iocoder.cn/SkyWalking/collector-init?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector Cluster 集群管理》](http://www.iocoder.cn/SkyWalking/collector-cluster-module?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector Client Component 客户端组件》](http://www.iocoder.cn/SkyWalking/collector-client-component?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector Server Component 服务器组件》](http://www.iocoder.cn/SkyWalking/collector-server-component?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector Jetty Server Manager》](http://www.iocoder.cn/SkyWalking/collector-jetty-server-module?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector gRPC Server Manager》](http://www.iocoder.cn/SkyWalking/collector-grpc-server-module?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector Naming Server 命名服务》](http://www.iocoder.cn/SkyWalking/collector-naming-server?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector Queue 队列组件》](http://www.iocoder.cn/SkyWalking/collector-queue-module?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector Storage 存储组件》](http://www.iocoder.cn/SkyWalking/collector-storage-module?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector Streaming Computing 流式处理（一）》](http://www.iocoder.cn/SkyWalking/collector-streaming-first?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector Streaming Computing 流式处理（二）》](http://www.iocoder.cn/SkyWalking/collector-streaming-second?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector Cache 缓存组件》](http://www.iocoder.cn/SkyWalking/collector-cache-module?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector Remote 远程通信服务》](http://www.iocoder.cn/SkyWalking/collector-remote-module?vip&guanfang)
- [《SkyWalking 源码分析 —— DataCarrier 异步处理库》](http://www.iocoder.cn/SkyWalking/data-carrier?vip&guanfang)
- [《SkyWalking 源码分析 —— Agent Remote 远程通信服务》](http://www.iocoder.cn/SkyWalking/agent-remote-manager?vip&guanfang)
- [《SkyWalking 源码分析 —— 应用于应用实例的注册》](http://www.iocoder.cn/SkyWalking/register?vip&guanfang)
- [《SkyWalking 源码分析 —— Agent DictionaryManager 字典管理》](http://www.iocoder.cn/SkyWalking/agent-dictionary?vip&guanfang)
- [《SkyWalking 源码分析 —— Agent 收集 Trace 数据》](http://www.iocoder.cn/SkyWalking/agent-collect-trace?vip&guanfang)
- [《SkyWalking 源码分析 —— Agent 发送 Trace 数据》](http://www.iocoder.cn/SkyWalking/agent-send-trace?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector 接收 Trace 数据》](http://www.iocoder.cn/SkyWalking/collector-receive-trace?vip&guanfang)
- [《SkyWalking 源码分析 —— Collector 存储 Trace 数据》](http://www.iocoder.cn/SkyWalking/collector-store-trace?vip&guanfang)
- [《SkyWalking 源码分析 —— JVM 指标的收集与存储》](http://www.iocoder.cn/SkyWalking/jvm-collect?vip&guanfang)
- [《SkyWalking 源码分析 —— 运维界面（一）之应用视角》](http://www.iocoder.cn/SkyWalking/ui-1-application?vip&guanfang)
- [《SkyWalking 源码分析 —— 运维界面（二）之应用实例视角》](http://www.iocoder.cn/SkyWalking/ui-2-instance?vip&guanfang)
- [《SkyWalking 源码分析 —— 运维界面（三）之链路追踪视角》](http://www.iocoder.cn/SkyWalking/ui-3-trace?vip&guanfang)
- [《SkyWalking 源码分析 —— 运维界面（四）之操作视角》](http://www.iocoder.cn/SkyWalking/ui-4-operation?vip&guanfang)
- [《SkyWalking 源码分析 —— @Trace 注解想要追踪的任何方法》](http://www.iocoder.cn/SkyWalking/@trace-for-any-methods?vip&guanfang)
- [《SkyWalking 源码分析 —— traceId 集成到日志组件》](http://www.iocoder.cn/SkyWalking/trace-id-integrate-into-logs?vip&guanfang)
- [《SkyWalking 源码分析 —— Agent 插件（一）之 Tomcat》](http://www.iocoder.cn/SkyWalking/agent-plugin-tomcat?vip&guanfang)
- [《SkyWalking 源码分析 —— Agent 插件（二）之 Dubbo》](http://www.iocoder.cn/SkyWalking/agent-plugin-dubbo?vip&guanfang)
- [《SkyWalking 源码分析 —— Agent 插件（三）之 SpringMVC》](http://www.iocoder.cn/SkyWalking/agent-plugin-spring-mvc?vip&guanfang)
- [《SkyWalking 源码分析 —— Agent 插件（四）之 MongoDB》](http://www.iocoder.cn/SkyWalking/agent-plugin-mongodb?vip&guanfang)

## SkyWalking 6.X 源码解析合集

- [《SkyWalking 6.x 源码分析 —— 调试环境搭建》](http://www.iocoder.cn/SkyWalking/6/build-debugging-environment/?vip&guanfang)
