---
title: Release Apache SkyWalking Java Agent 9.3.0
date: 2024-07-27
author: SkyWalking Team
description: "Release Apache SkyWalking Java Agent 9.3.0."
---

SkyWalking Java Agent 9.3.0 is released. Go to [downloads](/downloads) page to find release tars.
Changes by Version

9.3.0
------------------

* Remove `idleCount` tag in Alibaba Druid meter plugin.
* Fix NPE in handleMethodException method of apm-jdk-threadpool-plugin.
* Support for C3P0 connection pool tracing.
* Use a daemon thread to flush logs.
* Fix typos in `URLParser`.
* Add support for `Derby`/`Sybase`/`SQLite`/`DB2`/`OceanBase` jdbc url format in `URLParser`.
* Optimize spring-plugins:scheduled-annotation-plugin compatibility about Spring 6.1.x support.
* Add a forceIgnoring mechanism in a CROSS_THREAD scenario.
* Fix NPE in Redisson plugin since Redisson 3.20.0.
* Support for showing batch command details and ignoring PING commands in Redisson plugin.
* Fix peer value of Master-Slave mode in Redisson plugin.
* Support for tracing the callbacks of asynchronous methods in elasticsearch-6.x-plugin/elasticsearch-7.x-plugin.
* Fixed the invalid issue in the isInterface method in PluginFinder.
* Fix the opentracing toolkit SPI config
* Improve 4x performance of ContextManagerExtendService.createTraceContext()
* Add a plugin that supports the Solon framework.
* Fixed issues in the MySQL component where the executeBatch method could result in empty SQL statements.
* Support kafka-clients-3.7.x.

#### Documentation
* Update docs to describe `expired-plugins`.

All issues and pull requests are [here](https://github.com/apache/skywalking/milestone/213?closed=1)