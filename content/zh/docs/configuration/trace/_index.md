---
title: "Trace 配置"
linkTitle: "Trace 配置"
date: 2020-04-08
weight: 3
aliases: "/zh/docs/configuration/trace"
description: 
  MOSN trace 配置说明。
---

本文是关于 MOSN trace 配置的说明。

`trace` 描述的 MOSN 的基本全局参数如下所示。

```json
{
  "tracing": {
    "enable": true,
    "driver": "",
    "config": {
      
    }
  }
}
```

## enable

bool类型，表示启用或禁用trace。

## driver

目前支持 `SOFATracer` 和 `SkyWalking`。
