---
title: Release Apache SkyWalking Java Agent 9.5.0
date: 2025-08-18
author: SkyWalking Team
description: "Release Apache SkyWalking Java Agent 9.5.0."
---

SkyWalking Java Agent 9.5.0 is released. Go to [downloads](/downloads) page to find release tars.
Changes by Version

9.5.0
------------------

* Add the virtual thread executor plugin
* Fix Conflicts apm-jdk-threadpool-plugin conflicts with apm-jdk-forkjoinpool-plugin
* Fix NPE in hikaricp-plugin if JDBC URL is not set
* Agent kernel services could be not-booted-yet as ServiceManager#INSTANCE#boot executed after agent transfer initialization. Delay so11y metrics#build when the services are not ready to avoid MeterService status is not initialized.
* Fix retransform failure when enhancing both parent and child classes.
* Add support for `dameng(DM)` JDBC url format in `URLParser`.
* Fix RabbitMQ Consumer could not receive handleCancelOk callback.
* Support for tracking in lettuce versions 6.5.x and above.
* Upgrade byte-buddy version to 1.17.6.
* Support gRPC 1.59.x and 1.70.x server interceptor trace
* Fix the `CreateAopProxyInterceptor` in the Spring core-patch changes the AOP proxy type when a class is enhanced by both SkyWalking and Spring AOP.
* Build: Centralized plugin version management in the root POM and remove redundant declarations.

All issues and pull requests are [here](https://github.com/apache/skywalking/milestone/236?closed=1)