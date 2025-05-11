---
title: "Release Apache SkyWalking Python 1.2.0"
date: 2025-05-11
author: SkyWalking Team
description: "Release Apache SkyWalking Python 1.2.0."
---

SkyWalking Python 1.2.0 is released! Go to [downloads](/downloads) page to find release tars.

**PyPI Wheel**: <https://pypi.org/project/apache-skywalking/1.2.0/>

**DockerHub Image**: <https://hub.docker.com/r/apache/skywalking-python>

## What's Changed
* Fix: user/password replacement is not allowed for relative urls by @tsonglew in https://github.com/apache/skywalking-python/pull/349
* Fix outdated make dev-fix rule in CodeStyle.md by @tsonglew in https://github.com/apache/skywalking-python/pull/350
* Fix pulsar client not support init arguments other than service_url by @tsonglew in https://github.com/apache/skywalking-python/pull/351
* Drop support for 3.7 and fix tests by @kezhenxu94 in https://github.com/apache/skywalking-python/pull/356
* Fix TestClient for fastapi cause the req.client None error by @CharlieSeastar in https://github.com/apache/skywalking-python/pull/355
* Feat sampling service by @tsonglew in https://github.com/apache/skywalking-python/pull/357
* Fix agent start failed in async mode when profiling is enabled by @tsonglew in https://github.com/apache/skywalking-python/pull/360
* Perf ignore uuid and timestamp generation for NoopContext by @tsonglew in https://github.com/apache/skywalking-python/pull/361
* Feat add sw_grpc plugin by @tsonglew in https://github.com/apache/skywalking-python/pull/362
* feature: add support to python 3.13 by @henriquemeca in https://github.com/apache/skywalking-python/pull/366
* Add isSizeLimited in SegmentObject by @CodePrometheus in https://github.com/apache/skywalking-python/pull/367
* Bump gunicorn from 20.1.0 to 23.0.0 by @dependabot in https://github.com/apache/skywalking-python/pull/368
* Bump up to 1.2.0 and remove change log file by @kezhenxu94 in https://github.com/apache/skywalking-python/pull/369
* chore: fix linting error by @kezhenxu94 in https://github.com/apache/skywalking-python/pull/370

## New Contributors
* @CharlieSeastar made their first contribution in https://github.com/apache/skywalking-python/pull/355
* @henriquemeca made their first contribution in https://github.com/apache/skywalking-python/pull/366
* @dependabot made their first contribution in https://github.com/apache/skywalking-python/pull/368

**Full Changelog**: https://github.com/apache/skywalking-python/compare/v1.1.0...v1.2.0
