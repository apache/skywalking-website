---
title: Release Apache SkyWalking Satellite 0.5.0
date: 2021-12-27
author: SkyWalking Team
description: "Release Apache SkyWalking Satellite 0.5.0"
---

SkyWalking Satellite 0.5.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

#### Features
* Make the gRPC client `client_pem_path` and `client_key_path` as an optional config.
* Remove `prometheus-server` sharing server plugin.
* Support let the telemetry metrics export to `prometheus` or `metricsService`.
* Add the resource limit when gRPC server accept connection.

#### Bug Fixes
* Fix the gRPC server enable TLS failure.
* Fix the native meter protocol message load balance bug.

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/113?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-satellite/pulls?q=is%3Apr+milestone%3A0.5.0+is%3Aclosed)