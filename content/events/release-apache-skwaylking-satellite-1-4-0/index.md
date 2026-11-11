---
title: Release Apache SkyWalking Satellite 1.4.0
date: 2026-11-12
author: SkyWalking Team
description: "Release Apache SkyWalking Satellite 1.4.0"
---

SkyWalking Satellite 1.4.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

#### Features
* Support pprof protocol.
* Update Go to `1.26`.

#### Bug Fixes
* Upgrade the base image to `alpine:3.23` and pin openssl/musl packages to fix CVEs.
* Bump Go toolchain, gRPC, `golang.org/x/*` and Prometheus libraries to fix CVEs.
* Fix routing key order in OTLP metrics v1 forwarder to follow the configured metadataKeys order.
* Bump Go toolchain to `1.26.10` and `golang.org/x/net` to `v0.62.0` to fix CVEs.

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/268?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-satellite/pulls?q=is%3Apr+milestone%3A1.4.0+is%3Aclosed)
