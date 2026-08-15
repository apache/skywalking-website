---
title: "Release Apache SkyWalking Python 1.3.0"
date: 2026-08-14
author: SkyWalking Team
description: "Release Apache SkyWalking Python 1.3.0."
---

SkyWalking Python 1.3.0 is released! Go to [downloads](/downloads) page to find release tars.

**PyPI Wheel**: <https://pypi.org/project/apache-skywalking/1.3.0/>

**DockerHub Image**: <https://hub.docker.com/r/apache/skywalking-python>

## What's Changed
* chore(ci): remove changelog checkbox in pull request template by @shenxiangzhuang in https://github.com/apache/skywalking-python/pull/372
* chore: fix Makefile not work in Linux and non-interactive mode by @kezhenxu94 in https://github.com/apache/skywalking-python/pull/373
* fix(plugin): add exec_module to execute the module code by @shenxiangzhuang in https://github.com/apache/skywalking-python/pull/377
* Fix: kafka image in docker-compose demo by @zth9 in https://github.com/apache/skywalking-python/pull/380
* fix: pin packaging dep to 25 by @kezhenxu94 in https://github.com/apache/skywalking-python/pull/383
* infra: update markdown lint check by @kevinjqliu in https://github.com/apache/skywalking-python/pull/382
* feat: support Python 3.10-3.14, drop 3.8/3.9, update plugin compatibility by @wu-sheng in https://github.com/apache/skywalking-python/pull/386
* feat(plugin): add urllib3 2.x support for Python 3.12+ by @wu-sheng in https://github.com/apache/skywalking-python/pull/387
* feat: re-enable aiohttp/psycopg2 and add falcon v3/sanic v2 plugins by @wu-sheng in https://github.com/apache/skywalking-python/pull/389
* fix: support module-level @runnable with continue_tracing() by @wu-sheng in https://github.com/apache/skywalking-python/pull/391
* fix(ci): unblock CI — approved paths-filter pin + happybase test flake by @wu-sheng in https://github.com/apache/skywalking-python/pull/405
* perf(demo): set a timeout on flask consumer fork HTTP calls by @basheer-cloud in https://github.com/apache/skywalking-python/pull/388
* fix(ci): pin docker/* actions to ASF-approved SHAs in publish-docker by @wu-sheng in https://github.com/apache/skywalking-python/pull/406
* fix: gRPC fork safety for Gunicorn prefork (grpcio >= 1.83), sw_grpc aio compatibility, websockets >= 13 support by @wu-sheng in https://github.com/apache/skywalking-python/pull/409
* chore(test): upgrade the mock collector and drop the sw_fork_support seed workaround by @wu-sheng in https://github.com/apache/skywalking-python/pull/410
* chore: install linters in `make env`, exclude `*.txt` from the license check by @kezhenxu94 in https://github.com/apache/skywalking-python/pull/412

## New Contributors
* @zth9 made their first contribution in https://github.com/apache/skywalking-python/pull/380
* @kevinjqliu made their first contribution in https://github.com/apache/skywalking-python/pull/382
* @basheer-cloud made their first contribution in https://github.com/apache/skywalking-python/pull/388

**Full Changelog**: https://github.com/apache/skywalking-python/compare/v1.2.0...v1.3.0
