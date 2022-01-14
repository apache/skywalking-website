---
title: Release Apache SkyWalking Cloud on Kubernetes 0.6.0
date: 2022-01-14
author: SkyWalking Team
---

SkyWalking Cloud on Kubernetes 0.6.0 is released. Go to [downloads](/downloads) page to find release tars.

- Features
  - Add the Satellite CRD, webhooks and controller
- Bugs
  - Update release images to set numeric user id
  - Fix the satellite config not support number error
  - Use env JAVA_TOOL_OPTIONS to replace AGENT_OPTS
- Chores
  - Add stabilization windows feature in satellite HPA documentation