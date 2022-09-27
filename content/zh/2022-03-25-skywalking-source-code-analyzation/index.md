---
title: "[视频] SkyWalking 8.7.0 源码分析"
date: 2022-03-25
author: "干鹏宇"
description: "SkyWalking 的美妙不仅在于其强大的功能，还在于其优秀的代码实现。"
zh_tags:
  - Video
  - Course
---

如果要讨论提高自己系统设计能力的方式，我想大多数人都会选择去阅读优秀开源项目的源代码。近年来我参与了多个监控服务的开发工作，并在工作中大量地使用了 SkyWalking 并对其进行二次开发。在这个过程中，我发现 SkyWalking 天然的因其国产的身份，整套源代码地组织和设计非常符合国人的编程思维。由此我录制了本套课程，旨在和大家分享我的一些浅薄的心得和体会。

本套课程分为两个阶段，分别讲解 Agent 端和 OAP 端地设计和实现。每个阶段的内容都是以启动流程作为讲解主线，逐步展开相关的功能模块。除了对 SKyWalking 本身内容进行讲解，课程还针对 SKyWalking 使用到的一些较为生僻的知识点进行了补充讲解（如 synthetic、NBAC 机制、自定义类加载器等），以便于大家更清晰地掌握课程内容。

[SkyWalking8.7.0 源码分析 - 视频课程直达链接](https://www.bilibili.com/video/BV1dy4y1V7ck/)

目前课程已更新完 Agent 端的讲解，目录如下：

- 01-开篇和源码环境准备
- 02-Agent 启动流程
- 03-Agent 配置加载流程
- 04-自定义类加载器 AgentClassLoader
- 05-插件定义体系
- 07-插件加载
- 06-定制 Agent
- 08-什么是 synthetic
- 09-NBAC 机制
- 10-服务加载
- 11-witness 组件版本识别
- 12-Transform 工作流程
- 13-静态方法插桩
- 14-构造器和实例方法插桩
- 15-插件拦截器加载流程(非常重要)
- 16-运行时插件效果的字节码讲解
- 17-JDK 类库插件工作原理
- 18-服务-GRPCChanelService
- 19-服务-ServiceManagementClient
- 20-服务-CommandService
- 21-服务-SamplingService
- 22-服务-JVMService
- 23-服务-KafkaXxxService
- 24-服务-StatusCheckService
- 25-链路基础知识
- 26-链路 ID 生成
- 27-TraceSegment
- 28-Span 基本概念
- 29-Span 完整模型
- 30-StackBasedTracingSpan
- 31-ExitSpan 和 LocalSpan
- 32-链路追踪上下文 TracerContext
- 33-上下文适配器 ContextManager
- 34-DataCarrier-Buffer
- 35-DataCarrier-全解
- 36-链路数据发送到 OAP

{{< bilibili BV1dy4y1V7ck >}}
