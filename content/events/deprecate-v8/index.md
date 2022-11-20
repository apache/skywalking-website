---
title: Plan to End-of-life(EOL) all v8 releases in Nov. 2022
date: 2022-09-02
author: SkyWalking Team
description: "The SkyWalking community plans to deprecate all v8 releases from the docs and download pages"
---

This is an official annoucement from SkyWalking team.

SkyWalking backend server and UI released significant [9.2.0](../release-apache-skywalking-apm-9.2.0/index.md) at Sep. 2nd, 2022. 
With the new added Layer concept, the [ebpf agent](https://github.com/apache/skywalking-rover), wider middleware server monitoring(Such as MySQL and PostgreSQL servers) powered 
by OpenTelemetry ecosystem, SkyWalking v9 has been much more powerful than the last v8 version(8.9.1). 

From now, we have resolved all found critical bugs since 9.0.0 release which could block the v8 users to upgrade. v9 releases also provide the as same compatibility
as the 8.9.1 release. So, end users would not have a block when they apply to upgrade. (We don't provide storage structure compatibility as usually, users should use an empty database to initialize for a new version.)

**And more importantly, we are confident that, v9 could provide a stable and higher performance APM in the product environment.**

The 8.9.1 release was released at Dec., 2021. Since then, there is no one contributed any code, 
and there is no committer requested to begin a new iteration or plan to run a patch release. 
From the project management committee perspective, the 8.x had became inactive.

We are going to wait for another 3 month to official end 8.x series' life.

Notice, this could be changed if there are at least 3 committers supporting to work on further 8.x releases officially, and provide a release plan.