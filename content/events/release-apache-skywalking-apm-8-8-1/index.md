---
title: Release Apache SkyWalking APM 8.8.1
date: 2021-10-02
author: SkyWalking Team
description: "Release Apache SkyWalking 8.8.1."
endTime: 2021-10-02T23:00:00Z
---

SkyWalking 8.8.1 is released. Go to [downloads](/downloads) page to find release tars.

**This is a bugfix version that fixes several important bugs in [previous version 8.8.0](/events/release-apache-skywalking-apm-8-8-0/).**

## Changes

#### OAP Server
* Fix wrong (de)serializer of ElasticSearch client for OpenSearch storage.
* Fix that traces query with tags will report error.
* Replace e2e simple cases to e2e-v2.
* Fix endpoint dependency breaking.

#### UI
* Delete duplicate calls for endpoint dependency.

All issues and pull requests are [here](https://github.com/apache/skywalking/milestone/104?closed=1)
