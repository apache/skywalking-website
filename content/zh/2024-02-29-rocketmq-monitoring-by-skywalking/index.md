---
title: "使用 SkyWalking 监控 RocketMQ"
author: "邵一鸣"
date: 2024-02-29
description: "SkyWalking 10.0 引入了新的 RocketMQ 监控面板，本文将演示该监控面板的使用。"
tags:
- RocketMQ
---

# 背景介绍
Apache RocketMQ 是一个开源的低延迟、高并发、高可用、高可靠的分布式消息中间件, 从SkyWalking OAP 10.0 版本开始， 新增了 对 RocketMQ的监控面板。本文将展示并介绍如何使用 Skywalking来监控RocketMQ

# 部署

## 流程
通过`RocketMQ`官方提供的`RocketMQ exporter`来采集`RocketMQ`数据,再通过`opentelmetry-collector`来拉取`RocketMQ exporter`并传输到`skywalking oap`服务来处理
DataFlow:


## 准备

1. skywalking oap服务，v10.0 + https://github.com/apache/skywalking
2. RocketMQ v4.3.2 +
3. RocketMQ exporter v0.0.2+
4. opentelmetry-collector v0.87+

## 启动顺序
1. 启动 RocketMQ namesrv 和 broker
2. 启动 skywalking oap 和 ui
3. 启动RocketMQ exporter
4. 启动 opentelmetry-collector
   
具体如何启动和配置请参考以上链接中官方教程

需要注意下的是 `opentelmetry-collector` 的配置文件
`job_name: "rocketmq-monitoring"` 请不要修改,否则 skywalking 不会处理这部分数据.
`rocketmq-exporter` 可以替换成RocketMQ exporter 的地址，因为是此处实例是`docker compose`文件中配置，如果你是 dns  name 或者是 ip 请自行更换。
`replacement: rocketmq-cluster`为了可以与下文介绍的服务分层功能结合，请自行定义。
`oap` 为 `skywalking oap` 地址，请自行替换

```
receivers:
  prometheus:
    config:
      scrape_configs:
        - job_name: "rocketmq-monitoring"
          scrape_interval: 30s
          static_configs:
            - targets: ['rocketmq-exporter:5557']
          relabel_configs:
            - source_labels: [ ]
              target_label: cluster
              replacement: rocketmq-cluster

exporters:
  otlp:
    endpoint: oap:11800
    tls:
      insecure: true

processors:
  batch:
service:
  pipelines:
    metrics:
      receivers:
        - prometheus
      processors:
        - batch
      exporters:
        - otlp

```


# 监控指标
指标分为 三个维度, cluster,broker,topic
## cluster监控

cluster 主要是站在集群的角度来统计展示,

## broker 监控

## topic 监控


注意 topic 维度是整个 topic 来聚合，并不是在一个 broker 上的 topic 聚合，在 dashboard 上你也可以看到 broker 跟 topic 是平级的。
比如 ` Backlogged Messages `可能会比较受到关注，它是不同消费者组消费堆积体现，如果某个消费组消息曲线特别高，用户就需要注意这个消费者组了。

各个指标的含义可以在图标的 tip 上找到解释


demo 已经在 [skywalking showcase](http://demo.skywalking.apache.org/dashboard/ROCKETMQ/Service/cm9ja2V0bXE6OnJvY2tldG1xLnNreXdhbGtpbmctc2hvd2Nhc2U=.1/RocketMQ-Cluster) 上线，可以在上面看到展示效果

# 服务层级
skywalking 10
