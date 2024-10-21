---
title: Release Apache SkyWalking Rover 0.7.0
date: 2024-10-21
author: SkyWalking Team
description: "Release Apache SkyWalking Rover 0.7.0"
---

SkyWalking Rover 0.7.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

#### Features
* Upgrade LLVM to `18`.
* Support propagation the excluding namespaces in the access log to the backend.
* Add `pprof` module for observe self.
* Add detect process from `CRI-O` container in Kubernetes.
* Introduce `MonitorFilter` into access log module.
* Support monitoring ztunnel to adapt istio ambient mode.
* Enhance get connection address strategy in access log module.
* Reduce file mount needs when deploy in the Kubernetes, split env name `ROVER_HOST_MAPPING` to `ROVER_HOST_PROC_MAPPING` and `ROVER_HOST_ETC_MAPPING`.

#### Bug Fixes
* Fixed the issue where `conntrack` could not find the Reply IP in the access log module.
* Fix errors when compiling C source files into eBPF bytecode on a system with Linux headers version 6.2 or higher.
* Fixed `ip_list_rcv` probe is not exist in older linux kernel.
* Fix concurrent map operation in the access log module.
* Fix the profiling cannot found process issue.
* Fix cannot translate peer address in some UDP scenarios.
* Fix the protocol logs may be missing if the process is short-lived.
* Fix some connections not called close syscall, causing unnecessary memory usage.

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/209?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-rover/milestone/7?closed=1)
