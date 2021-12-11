---
title: Release Apache SkyWalking APM 8.9.1
date: 2021-12-11
author: SkyWalking Team
description: "Release Apache SkyWalking 8.9.1."
endTime: 2021-12-21T23:00:00Z
---

SkyWalking 8.9.1 is released. Go to [downloads](/downloads) page to find release tars.

Changes by Version

#### Project
* Upgrade log4j2 to 2.15.0 for CVE-2021-44228. This CVE only effects on JDK versions below 6u211, 7u201, 8u191 and 11.0.1  according to [the post](https://securityboulevard.com/2021/12/critical-new-0-day-vulnerability-in-popular-log4j-library-discovered-with-evidence-of-mass-scanning-for-affected-applications/amp/). Notice, using JVM option `-Dlog4j2.formatMsgNoLookups=true` also avoids CVE if your JRE opened JNDI in default.
