---
title: Release Apache SkyWalking Satellite 1.2.0
date: 2023-06-25
author: SkyWalking Team
description: "Release Apache SkyWalking Satellite 1.2.0"
---

SkyWalking Satellite 1.2.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

#### Features
* Introduce `pprof` module.
* Support export multiple `telemetry` service.
* Update the base docker image.
* Add timeout configuration for gRPC client.
* Reduce log print when the enqueue data to the pipeline error.
* Support transmit the Continuous Profiling protocol.

#### Bug Fixes
* Fix [CVE-2022-41721](https://avd.aquasec.com/nvd/cve-2022-41721).
* Use Go 19 to build the Docker image to fix CVEs.

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/170?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-satellite/pulls?q=is%3Apr+milestone%3A1.2.0+is%3Aclosed)