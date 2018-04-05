---
layout: post
title:  "Dowload the SkyWalking releases"
date:   2018-04-03
desc: ""
keywords: "release, source codes"
categories: [HTML]
tags: [release, source codes]
icon: icon-html
---

Use the links below to download the Apache SkyWalking (incubating) from one of our mirrors.

# Stable Release - Latest Version

## 5.0.0-alpha
Released at April 3rd, 2018
  - Source codes: [[src]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha-src.tgz) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha-src.tgz.asc)
  [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha-src.tgz.sha512)
  - [Documents](https://github.com/apache/incubator-skywalking/blob/v5.0.0-alpha/docs/README.md) for this release.
  - Windows: [[zip]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.zip)
  [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.tar.gz.asc)
  [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.tar.gz.sha512)
  - Linux: [[tar]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.tar.gz)
  [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.zip.asc)
  [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.zip.sha512)

[PGP signatures KEYS](https://www.apache.org/dist/incubator/skywalking/KEYS)

<br/>
# Changes in lastest Version

#### Agent -> Collector protocol
 - Remove C++ keywords
 - Move **Ref** into Span from Segment
 - Add span type, when register an operation

#### UI -> Collector GraphQL query protocol
 - First version protocol

#### Agent Changes
 - Support gRPC 1.x plugin
 - Support kafka 0.11 and 1.x plugin
 - Support ServiceComb 0.x plugin
 - Support optional plugin mechanism.
 - Support Spring 3.x and 4.x bean annotation optional plugin
 - Support Apache httpcomponent AsyncClient 4.x plugin
 - Provide automatic agent daily tests, and release reports [here](https://github.com/SkywalkingTest/agent-integration-test-report).
 - Refactor Postgresql, Oracle, MySQL plugin for compatible.
 - Fix jetty client 9 plugin error
 - Fix async APIs of okhttp plugin error
 - Fix log config didn't work
 - Fix a class loader error in okhttp plugin

#### Collector Changes
 - Support metrics analysis and aggregation for application, application instance and service in minute, hour, day and month.
 - Support new GraphQL query protocol
 - Support alarm
 - Provide a prototype instrument for collector.
 - Support node speculate in cluster and application topology. (Provider Node -> Consumer Node) -> (Provider Node -> MQ Server -> Consumer Node)

#### UI Changes
 - New 5.0.0 UI!!!

 [Issues and Pull requests](https://github.com/apache/incubator-skywalking/milestone/17)
<br/>
# Old releases
<br/>
# All Changes
[Changes](https://github.com/apache/incubator-skywalking/blob/master/CHANGES.md) document.
