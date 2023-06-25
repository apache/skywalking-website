---
title: Release Apache SkyWalking Rover 0.5.0
date: 2023-06-25
author: SkyWalking Team
description: "Release Apache SkyWalking Rover 0.5.0"
---

SkyWalking Rover 0.5.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

#### Features
* Enhance the protocol reader for support long socket data.
* Add the syscall level event to the trace.
* Support OpenSSL 3.0.x.
* Optimized the data structure in BPF.
* Support continuous profiling.
* Improve the performance when getting `goid` in eBPF.
* Support build multiple architecture docker image: `x86_64`, `arm64`.

#### Bug Fixes
* Fix HTTP method name in protocol analyzer.
* Fixed submitting multiple network profiling tasks with the same uri causing the rover to restart.

#### Documentation

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/167?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-rover/milestone/5?closed=1)