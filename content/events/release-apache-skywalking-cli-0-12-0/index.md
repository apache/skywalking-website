---
title: "Release Apache SkyWalking CLI 0.12.0"
date: 2023-06-25
author: SkyWalking Team
description: "Release Apache SkyWalking CLI 0.12.0"
---

SkyWalking CLI 0.12.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

* Add the sub-command `records list` for adapt the new record query API by @mrproliu in https://github.com/apache/skywalking-cli/pull/167
* Add the attached events fields into the `trace` sub-command by @mrproliu in https://github.com/apache/skywalking-cli/pull/169
* Add the sampling config file into the `profiling ebpf create network` sub-command by @mrproliu in https://github.com/apache/skywalking-cli/pull/171
* Add the sub-command `profiling continuous` for adapt the new continuous profiling API by @mrproliu in https://github.com/apache/skywalking-cli/pull/173
* Adapt the sub-command `metrics` for deprecate scope fron entity by @mrproliu in https://github.com/apache/skywalking-cli/pull/173
* Add components in topology related sub-commands. @mrproliu in https://github.com/apache/skywalking-cli/pull/175
* Add the sub-command `metrics nullable` for query the nullable metrics value. @mrproliu in https://github.com/apache/skywalking-cli/pull/176
* Adapt the sub-command `profiling trace` for adapt the new trace profiling protocol. @mrproliu in https://github.com/apache/skywalking-cli/pull/177
* Add `isEmptyValue` field in metrics related sub-commands. @mrproliu in https://github.com/apache/skywalking-cli/pull/180
* Add the sub-command `metrics execute` for execute the metrics query. @mrproliu in https://github.com/apache/skywalking-cli/pull/182
* Add the sub-command `profiling continuous monitoring` for query all continuous profiling monitoring instances. @mrproliu in https://github.com/apache/skywalking-cli/pull/182
* Add `continuousProfilingCauses.message` field in the `profiling ebpf list` comamnds by @mrproliu in https://github.com/apache/skywalking-cli/pull/184