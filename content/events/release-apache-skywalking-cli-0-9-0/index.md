---
title: "Release Apache SkyWalking CLI 0.9.0"
date: 2021-10-19
author: SkyWalking Team
description: "Release Apache SkyWalking CLI 0.9.0"
---

SkyWalking CLI 0.9.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

### Features

- Add the sub-command `dependency instance` to query instance relationships (#117)

### Bug Fixes

- fix: `multiple-linear` command's `labels` type can be string type (#122)
- Add missing `dest-service-id` `dest-service-name` to `metrics linear` command (#121)
- Fix the wrong name when getting `destInstance` flag (#118)

### Chores

- Upgrade Go version to 1.16 (#120)
- Migrate tests to infra-e2e, overhaul the flags names (#119)
- Publish Docker snapshot images to ghcr (#116)
- Remove dist directory when build release source tar (#115)
