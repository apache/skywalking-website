---
title: MOSN 源码解析 - 总览
linkTitle: MOSN 源码解析 - 总览
date: 2020-05-08
author: "[烈元（蚂蚁集团）](https://github.com/taoyuanyuan)"
description: MOSN 源码解析文章总览。
aliases: "/zh/blog/posts/mosn-overview"
---

## 起因

在2020年伊始，MOSN 团队在社区发起了 MOSN 源码解析系列活动，本次活动旨在增强社区对 MOSN 的认知，促进开源社区的交流，是大家学习和使用 MOSN，与 MOSN 的核心开发者直接交流的一个良好契机。

经过十几位社区同学的参与，目前十四篇文章都已经完成，本文将做一个整体介绍，方便大家更好的了解 MOSN。查看原文解析系列文章请访问： <https://mosn.io/blog/code/>。

## 模块能力

首先是 MOSN 的 [启动流程](blog/code/mosn-startup/)，通过这篇文章，你可以了解 MOSN 的启动过程，包括配置解析，日志初始化，Xds 初始化，各子模块启动，AdminApi 初始化等能力，也介绍了普通启动和热升级启动的区别，对 MOSN 的平滑升级能力有一个初步的了解。

[路由](blog/code/mosn-router/) 这个章节，你可以了解路由的配置解析，运行方式和动态路由等能力。

在 [TLS](blog/code/mosn-tls/) 你可以了解 MOSN 怎样集成 Go Runtime 的 TLS 能力，并在此基础上我们进行了那些能力的加强，比如明文密文自动识别能力，SDS 能力支持，对 TLS 握手进行自定义校验的扩展能力等。

[多协议机制](docs/concept/multi-protocol/) 是 MOSN 比较重要的一部分，你可以了解多协议机制产生的背景与实践痛点，一些常见的协议扩展思路初探，SOFABolt 协议接入实践，以及 MOSN 多协议机制设计解读。通过阅读本文，你可以很容易的实现一个自己的协议了。

[变量机制](blog/code/mosn-variable/) 是 MOSN 的一个核心能力，通过该机制，MOSN 可以方便的获取和设置一些自定义的值，来满足打印日志，路由规则，请求自定变量等能力。

[共享内存模型](blog/code/mosn-shm/) 讲解了 MOSN 的共享内存框架，MOSN 通过这个框架实现了共享内存 metrics 实现，用于平滑升级时保证 metric 数据的准确性。

为了支持 MOSN 跨语言的扩展机制能力，我们开发了 [plugin机制](blog/code/mosn-plugin/)，通过独立进程进行GRPC交互，让用户可以用任何语言来开发插件。

[连接池](blog/code/mosn-connection-pool/) 介绍了 MOSN 针对连接池的管理和使用。连接池是上下游 MOSN 之间进行长连接复用以提高转发效率与降低时延的关键，MOSN 连接池提供基于 HTTP1, HTTP2, SOFARPC, XProtocol 协议的连接池。

[协程模型](blog/code/mosn-eventloop/) 讲解了MOSN的整个转发流程，包括读写IO流程，proxy状态机，协程池等核心能力，可以让读者更加清晰的了解 MOSN 的处理流程。

Go 语言的 GC 对程序的性能有很大的影响，针对于此我们开发了 [内存复用机制](blog/code/mosn-buffer/)，减少 GC 来提升 MOSN 性能，本文分析了 MOSN 对内存复用的设计和用法，其基于 sync.Pool 之上封装了一层自己的注册管理逻辑，增强了管理能力、易用性和复用性。

[log系统](blog/code/mosn-log/) 介绍了 log 日志和 metric 两部分内容，log 也作为一个单独的库，读者可以单独使用。

[xds](blog/code/mosn-xds/) 介绍了 MOSN 对齐 xds 能力的细节。

[HTTP能力](blog/code/mosn-http/) 介绍 MOSN 对 HTTP 的处理流程，包括适配 fasthttp，内存复用，连接池等能力。

[filter扩展机制](blog/code/mosn-filters/) 分析了 filter 扩展机制的实现，并简述了实现自己的 filter 需要做的东西。大家可以通过该机制，使用 MOSN 来处理自己的业务场景。

## 最后

感谢社区同学的热情参与，MOSN 源码解析活动圆满收尾，也敬请关注我们后续的其他活动。
