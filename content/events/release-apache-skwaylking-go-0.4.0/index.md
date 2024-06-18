---
title: Release Apache SkyWalking Go 0.4.0
date: 2024-02-27
author: SkyWalking Team
description: "Release Apache SkyWalking Go 0.4.0"
---

SkyWalking Go 0.4.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

#### Features
* Add support ignore suffix for span name.
* Adding go `1.21` and `1.22` in docker image.

#### Plugins
* Support setting a discard type of reporter.
* Add `redis.max_args_bytes` parameter for redis plugin.
* Changing intercept point for gin, make sure interfaces could be grouped when params defined in relativePath.
* Support [RocketMQ](https://github.com/apache/rocketmq-client-go) MQ.
* Support [AMQP](https://github.com/rabbitmq/amqp091-go) MQ.
* support [Echov4](https://github.com/labstack/echo) framework.

#### Documentation

#### Bug Fixes
* Fix users can not use async api in toolkit-trace.
* Fix cannot enhance the vendor management project.
* Fix SW_AGENT_REPORTER_GRPC_MAX_SEND_QUEUE not working on metricsSendCh & logSendCh chans of gRPC reporter.
* Fix ParseVendorModule error for special case in vendor/modules.txt.
* Fix enhance method error when unknown parameter type.
* Fix wrong tracing context when trace have been sampled.
* Fix enhance param error when there are multiple params.
* Fix lost trace when multi middleware `handlerFunc` in `gin` plugin.
* Fix DBQueryContext execute error in `sql` plugin.
* Fix stack overflow as endless logs triggered.

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/197?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-go/milestone/4?closed=1)
