---
title: Release Apache SkyWalking Satellite 0.3.0
date: 2021-11-05
author: SkyWalking Team
description: "Release Apache SkyWalking Satellite 0.3.0"
---

SkyWalking Satellite 0.3.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

#### Features
* Support load-balance GRPC client with the static server list.
* Support load-balance GRPC client with the Kubernetes selector.
* Support transmit Envoy ALS v2/v3 protocol.
* Support transmit Envoy Metrics v2/v3 protocol.

#### Bug Fixes
* Fix errors when converting meter data from histogram and summary.[#75](https://github.com/apache/skywalking-satellite/pull/75)

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/93?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-satellite/pulls?q=is%3Apr+is%3Aclosed+milestone%3A0.3.0)