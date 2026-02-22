---
title: Release Apache SkyWalking Java Agent 9.6.0
date: 2026-02-16
author: SkyWalking Team
description: "Release Apache SkyWalking Java Agent 9.6.0."
---

SkyWalking Java Agent 9.6.0 is released. Go to [downloads](/downloads) page to find release tars.
Changes by Version

9.6.0
------------------

* Fix OOM due to too many span logs.
* Fix ClassLoader cache OOM issue with WeakHashMap.
* Fix Jetty client cannot receive the HTTP response body.
* Eliminate repeated code with HttpServletRequestWrapper in mvc-annotation-commons.
* Add the jdk httpclient plugin.
* Fix Gateway 2.0.x plugin not activated for spring-cloud-starter-gateway 2.0.0.RELEASE.
* Support kafka-clients-3.9.x intercept.
* Upgrade kafka-clients version in optional-reporter-plugins to 3.9.1.
* Fix AbstractLogger replaceParam when the replaced string contains a replacement marker.
* Fix `JDBCPluginConfig.Plugin.JDBC.SQL_BODY_MAX_LENGTH` was not working in some plugins.
* Bump up Lombok to v1.18.42 to adopt JDK25 compiling.
* Add `eclipse-temurin:25-jre` as another base image.
* Add JDK25 plugin tests for Spring 6.
* Ignore classes starting with "sun.nio.cs" in bytebuddy due to potential class loading deadlock.

All issues and pull requests are [here](https://github.com/apache/skywalking-java/milestone/10?closed=1)
