---
title: BanyanDB is up and running on SkyWalking demo
date: 2024-05-31
author: SkyWalking Team
description: "SkyWalking team announced, BanyanDB has replaced Elasticsearch and is up and running on SkyWalking official demo site."
endTime: 2024-06-30T00:00:00Z
---

Within 3 years (as of April 2021) of incubation, BanyanDB has progressed beyond the alpha stage and officially become the first-class database option for Apache SkyWalking.

Here is [the official statement](https://skywalking.apache.org/docs/main/latest/en/setup/backend/backend-storage/#banyandb---native-apm-database) from the Apache SkyWalking committee about this new option:

**This is recommended for medium-scale deployments from version 0.6 to 1.0. BanyanDB is set to be our next-generation storage solution. It has demonstrated significant potential in performance improvement. As of version 0.6.1, it achieves 5x less memory usage, 1/5 disk IOPS, 1/4 disk throughput, and 30% less disk space, albeit with a slightly higher CPU trade-off.**

Today, on May 31st, 2024, the [SkyWalking demo](https://skywalking.apache.org/#demo) hosted on our website has officially switched to BanyanDB. Both the native UI and Grafana UI of the site are now reading telemetry data from BanyanDB version 0.6.1.

