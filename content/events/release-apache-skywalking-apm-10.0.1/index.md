---
title: Release Apache SkyWalking APM 10.0.1
date: 2024-05-30
author: SkyWalking Team
description: "Release Apache SkyWalking 10.0.1 - A patch release for BanyanDB 0.6.1"
endTime: 2024-05-30T00:00:00Z
---

SkyWalking 10.0.1 is released. Go to [downloads](/downloads) page to find release tars.
This release targets to collebarate with BanyanDB 0.6.1. 


#### Project

* Add SBOM (Software Bill of Materials) to the project.

#### OAP Server

* Fix LAL test query api.
* Add component libraries of `Derby`/`Sybase`/`SQLite`/`DB2`/`OceanBase` jdbc driver.
* Fix setting the wrong interval to day level measure schema in BanyanDB installation process.

#### UI

* Fix widget title and tips.
* Fix statistics span data.
* Fix browser log display.
* Fix the topology layout for there are multiple independent network relationships.


All issues and pull requests are [here](https://github.com/apache/skywalking/milestone/218?closed=1)
