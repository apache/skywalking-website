---
title: "Release Apache SkyWalking CLI 0.5.0"
date: 2020-11-29
author: SkyWalking Team
description: "Release Apache SkyWalking CLI 0.5.0."
---

SkyWalking CLI 0.5.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

- Features
  - Use template files in yaml format instead
  - Refactor `metrics` command to adopt metrics-v2 protocol
  - Use goroutine to speed up `dashboard global` command
  - Add `metrics list` command

- Bug Fixes
  - Add flags of instance, endpoint and normal for `metrics` command
  - Fix the problem of unable to query database metrics

- Chores
  - Update release guide doc
  - Add screenshots for use cases in `README.md`
  - Introduce generated codes into codebase
