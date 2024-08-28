---
title: Release Apache SkyWalking Go 0.5.0
date: 2024-08-28
author: SkyWalking Team
description: "Release Apache SkyWalking Go 0.5.0"
---

SkyWalking Go 0.5.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

* **Add go `1.23` support**.
* **Remove go `1.16`, `1.17`, and `1.18` support**.

#### Features
* Add support trace ignore.
* Enhance the observability of makefile execution.
* Update the error message if the peer address is empty when creating an exit span.
* Support enhancement go `1.23`.

#### Plugins
* Support [Pulsar](https://github.com/apache/pulsar-client-go) MQ.
* Support [Segmentio-Kafka](https://github.com/segmentio/kafka-go) MQ.
* Support http headers collection for Gin.
* Support higher versions of grpc.
* Support [go-elasticsearchv8](https://github.com/elastic/go-elasticsearch) database client framework.
* Support `http.Hijacker` interface for mux plugin.
* Support collect statements and parameters in the Gorm plugin.

### Bug Fixes
* Fix panic error when root span finished.
* Fix when not route is found, the gin operation name is "http.Method:", example: "GET:".
* Fix got `span type is wrong` error when creating exit span with trace sampling.

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/210?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-go/milestone/5?closed=1)
