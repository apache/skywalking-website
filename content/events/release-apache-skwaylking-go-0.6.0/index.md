---
title: Release Apache SkyWalking Go 0.6.0
date: 2025-04-28
author: SkyWalking Team
description: "Release Apache SkyWalking Go 0.6.0"
---

SkyWalking Go 0.6.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

#### Features
* support attaching events to span in the toolkit.
* support record log in the toolkit.
* support manually report metrics in the toolkit.
* support manually set span error in the toolkit.

#### Plugins
* Support [goframev2](https://github.com/gogf/gf) goframev2.

#### Documentation
* Add docs for `AddEvent` in `Tracing APIs`
* Add `Logging APIs` document into Manual APIs.
* Add `Metric APIs` document into Manual APIs.

#### Bug Fixes
* Fix wrong docker image name and `-version` command.
* Fix redis plugin cannot work in cluster mode.
* Fix cannot find file when exec build in test/plugins.
* Fix not set span error when http status code >= 400
* Fix http plugin cannot provide peer name when optional Host is empty.

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/219?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-go/milestone/7?closed=1)
