---
title: Release Apache SkyWalking Java Agent 8.16.0
date: 2023-06-02
author: SkyWalking Team
description: "Release Apache SkyWalking Java Agent 8.16.0."
---

SkyWalking Java Agent 8.16.0 is released. Go to [downloads](/downloads) page to find release tars.
Changes by Version

8.16.0
------------------

* Exclude `synthetic` methods for the WitnessMethod mechanism
* Support ForkJoinPool trace
* Support clickhouse-jdbc-plugin trace sql parameters
* Support monitor jetty server work thread pool metric
* Support Jersey REST framework
* Fix ClassCastException when SQLServer inserts data 
* [Chore] Exclude org.checkerframework:checker-qual and com.google.j2objc:j2objc-annotations
* [Chore] Exclude proto files in the generated jar
* Fix Jedis-2.x plugin can not get host info in jedis 3.3.x+
* Change the classloader to locate the agent path in AgentPackagePath, from `SystemClassLoader` to AgentPackagePath's loader.
* Support Grizzly Trace
* Fix possible IllegalStateException when using Micrometer.
* Support Grizzly Work ThreadPool Metric Monitor
* Fix the gson dependency in the kafka-reporter-plugin.
* Fix deserialization of kafka producer json config in the kafka-reporter-plugin.
* Support to config custom decode methods for kafka configurations

All issues and pull requests are [here](https://github.com/apache/skywalking/milestone/175?closed=1)
