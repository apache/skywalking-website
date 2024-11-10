---
title: "Release Apache SkyWalking CLI 0.14.0"
date: 2024-10-21
author: SkyWalking Team
description: "Release Apache SkyWalking CLI 0.14.0"
---

SkyWalking CLI 0.14.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

### Features

* Add the sub-command `dependency global` for adapt the global dependency query API by @mrproliu in https://github.com/apache/skywalking-cli/pull/198
* Upgrade crypto lib to fix cve by @mrproliu in https://github.com/apache/skywalking-cli/pull/199
* Add the **hierarchy** related commands `hierarchy service`, `hierarchy instance` and `hierarchy layer-levels` by @mrproliu in https://github.com/apache/skywalking-cli/pull/200
* Add the `layers` field to `nodes` in the `dependency service` command by @mrproliu in https://github.com/apache/skywalking-cli/pull/200
* Add the duration related flags in the `endpoint list` command by @mrproliu in https://github.com/apache/skywalking-cli/pull/201
