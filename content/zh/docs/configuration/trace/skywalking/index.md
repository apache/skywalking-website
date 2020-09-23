---
title: "SkyWalking 配置"
linkTitle: "SkyWalking 配置"
date: 2020-04-08
weight: 1
aliases: "/zh/docs/configuration/trace/skywalking"
description: 
  MOSN SkyWalking trace 配置说明。
---

本文描述的是 SkyWalking Trace  配置。

目前支持 `HTTP1` 协议追踪。

SkyWalking 描述的 MOSN 的基本全局参数如下所示。

```json
{
  "tracing": {
    "enable": true,
    "driver": "SkyWalking",
    "config": {
      "reporter": "gRPC",
      "backend_service": "127.0.0.1:11800",
      "service_name": "mosn",
      "max_send_queue_size": 30000,
      "authentication": "mosn",
      "tls": {
        "cert_file": "cert.crt",
        "server_name_override": "mosn.io"
      }
    }
  }
}
```

## reporter

trace 数据上报模式， 支持 `log`（仅用于测试） 和 `gRPC` 两种模式 。

- 如果配置为空，则默认为 `log`。

## backend_service

SkyWalking 后端服务地址，仅在上报模式为 `gRPC` 模式时使用 。

- 示例：`127.0.0.1:11800`。

## service_name

注册到 SkyWalking 的服务名称，仅在上报模式为 `gRPC` 模式时使用 。

- 如果配置为空，则默认为 `mosn`。

## max_send_queue_size

trace 数据缓冲队列大小，仅在上报模式为 `gRPC` 模式时使用 。

- 如果配置为空，则默认为 `30000`。

## authentication

`gRPC` 身份认证参数，仅在上报模式为 `gRPC` 模式时使用 。

- 如果配置不为空，在与 SkyWalking 后端服务建立连接时会使用此参数进行身份认证。 

## tls

仅在上报模式为 `gRPC` 模式时使用 。

- 如果配置不为空，将使用 TLS 连接 SkyWalking 后端服务。

### cert_file

TLS 客户端证书。

### server_name_override

服务名称。