---
title: "Release Apache SkyWalking for NodeJS 0.5.1"
date: 2022-07-18
author: SkyWalking Team
description: "Release Apache SkyWalking NodeJS 0.5.1."
---

SkyWalking NodeJS 0.5.1 is released. Go to [downloads](/downloads) page to find release tars.

SkyWalking NodeJS 0.5.1 is a patch release that fixed a vulnerability in all previous
versions <=0.5.0, we recommend all users who are using versions <=0.5.0 should upgrade to this version.

The vulnerability will cause NodeJS services that has this agent installed to be unavailable
if the header includes an illegal SkyWalking header, such as 
(1) OAP is unhealthy and the downstream service's agent can't establish the connection.
(2) Some sampling mechanism is activated in downstream agents.
