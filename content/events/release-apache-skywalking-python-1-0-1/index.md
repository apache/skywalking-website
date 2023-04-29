---
title: "Release Apache SkyWalking Python 1.0.1"
date: 2023-04-29
author: SkyWalking Team
description: "Release Apache SkyWalking Python 1.0.1."
---

SkyWalking Python 1.0.1 is released! Go to [downloads](/downloads) page to find release tars.

**PyPI Wheel**: https://pypi.org/project/apache-skywalking/1.0.1/

**DockerHub Image**: https://hub.docker.com/r/apache/skywalking-python

- **Upgrading from v1.0.0 to v1.0.1 is strongly encouraged**
    - **This is a critical performance-oriented patch to address a CPU surge reported in https://github.com/apache/skywalking/issues/10672**

- Feature:
  - Add a new workflow to push docker images for arm64 and amd64 (#297)

- Plugins:
  - Optimize loguru reporter plugin.(#302)

- Fixes:
  - Fix sw8 loss when use aiohttp (#299, issue#10669)
  - **Critical**: Fix a bug that leads to high cpu usage (#300, issue#10672)

- Others:
  - Use Kraft mode in E2E Kafka reporter tests (#303)

## New Contributors
* @Forstwith made their first contribution in https://github.com/apache/skywalking-python/pull/299
* @FAWC438 made their first contribution in https://github.com/apache/skywalking-python/pull/300

**Full Changelog**: https://github.com/apache/skywalking-python/compare/v1.0.0...v1.0.1