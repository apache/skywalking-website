---
title: MOSN 源码解析 -  reconfig 机制
linkTitle: MOSN 源码解析 - reconfig 机制
date: 2019-11-24
aliases: "blog/posts/mosn-reconfig-mechanism"
author: "[姚昌宇（有米科技）](https://trainyao.github.io)"
description: >
  MOSN 源码解析之 reconfig 机制。
---

本文记录了对 MOSN 的源码研究，研究 MOSN 是如何做到平滑重启的。

本文的内容基于 MOSN v0.8.1。

我们先将被重启的 MOSN 进程称为 `旧 MOSN`，将重启并接管流量的进程成为 `新 MOSN`。

## 机制

MOSN 没有使用重新读取 config 文件的方法来实现 reconfig，而是通过 `unix socket` 作为进程间通信，并将旧进程的监听 fd 通过 socket 传过去，新 MOSN 接管 fd 并且重新读取 config，旧 MOSN 进行 gracefully shutdown，以达到 reconfig 和平滑重启的功能。

## 旧 MOSN

我们先从一个启动着的 MOSN 进程看起，看看它是如何被重启的。

MOSN 的 reconfig 逻辑在 `server` 包的 `reconfigure.go` 内。 

MOSN 进程启动后，会创建一个叫 `reconfig.sock` 的 unix socket，创建一个协程，开始监听并往里面写入一个字节的内容，这时会出现写阻塞。一旦有另一个进程从 reconfig.sock 读取到这一个字节，旧 MOSN 便开始 `reconfig 逻辑`。

## reconfig 逻辑: 

- 当写阻塞结束，协程会尝试链接另一个 unix socket ：`listen.sock`
- 一旦链接上，负责 reconfig 的协程会将已经存在的 fd 从 `listen.sock` 发送，发送是通过 `out-of-band` 数据进行的。 很显然，这个 `listen.sock` 是新的 MOSN 进程创建的，用来接收正在服务的 fd，接管并用以继续服务。

	这里的 `已经存在的 fd` 包括两种:
	- `server listener fd`， 负责监听业务的 tcp 连接，对应 `config.json` 里的 `servers` 数组里的 `listeners` 数组里的 ip +端口
	- `service listener fd`，控制相关的端口，比如 pprof、prometheus metrics export、admin 端口
- 发送完fd之后，旧 MOSN 会接收 listen.sock 的数据（由新 mosn 写入的数据，代表 fd 已接管完毕），并进入 gracefully shutdown 状态，不再接收新的链接，等已有请求处理完再关闭
- 旧 MOSN 有30秒时间处理完现存请求
- 30秒后，旧 mosn 关闭，链接由新 mosn 接管

## 新 MOSN

接下来是新 MOSN 的启动。有两个问题: 

1. 新 MOSN 是如何将旧 MOSN 的fd据为己有，并且接受数据的呢？

	- 新 MOSN 通过 `net.FileListener` 方法对接受到的 fd 进行处理，该函数会返回 fd 的一个 network listener 副本，改副本可以用来接收数据，新 MOSN 就是通过这个操作来从旧 MOSN 做 fd 的接管
	- 新 MOSN 会重新解析一遍 config.json 进行解析，而在上一部处理过的 network listener 副本也能查找到对应的地址和端口。通过比对两者相同之处，就能在创建新的 server listener 和 service listener 时，接管旧 MOSN 的 fd，用来初始化新的 listener。

2. 新 MOSN 接收到 fd 信息后，会做些什么呢？

	- 接管 server listener fd
	- 接管 service listener fd
	- 给 listen.sock 发送一个字节数据，通知旧 MOSN：可以关闭了
	- 至此，MOSN reconfig 结束

## 后续疑问

新 MOSN 通过 `net.FileListener` 方法处理完 fd 并初始化了 listener，由于处理后的 fd 是一个副本，如果这个时候来了一个连接，那这个连接是会被旧 MOSN 处理到，还是新 MOSN，还是两者都会通知到呢? 关于这方面，可以做一个实验验证一下。
