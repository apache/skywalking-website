---
title: Release Apache SkyWalking Go 0.2.0
date: 2023-07-31
author: SkyWalking Team
description: "Release Apache SkyWalking Go 0.2.0"
---

SkyWalking Go 0.2.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

#### Features
* Enhance the plugin rewrite ability to support `switch` and `if/else` in the plugin codes.
* Support inject the skywalking-go into project through agent.
* Support add configuration for plugin.
* Support metrics report API for plugin.
* Support report Golang runtime metrics.
* Support log reporter.
* Enhance the `logrus` logger plugin to support adapt without any settings method invoke.
* Disable sending observing data if the gRPC connection is not established for reducing the connection error log.
* Support enhance vendor management project.
* Support using base docker image to building the application.

#### Plugins
* Support [go-redis](https://github.com/redis/go-redis) v9 redis client framework.
* Support collecting [Native HTTP](https://pkg.go.dev/net/http) URI parameter on server side.
* Support [Mongo](https://github.com/mongodb/mongo-go-driver) database client framework.
* Support [Native SQL](https://pkg.go.dev/net/http) database client framework with [MySQL Driver](github.com/go-sql-driver/mysql).
* Support [Logrus](https://github.com/sirupsen/logrus) log report to the backend.
* Support [Zap](https://github.com/uber-go/zap) log report to the backend.

#### Documentation
* Combine `Supported Libraries` and `Performance Test` into `Plugins` section.
* Add `Tracing, Metrics and Logging` document into `Plugins` section.

#### Bug Fixes
* Fix throw panic when log the tracing context before agent core initialized.
* Fix plugin version matcher `tryToFindThePluginVersion` to support capital letters in module paths and versions.

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/180?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-go/milestone/2?closed=1)