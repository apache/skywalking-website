---
title: "Release Apache SkyWalking Python 1.1.0"
date: 2024-07-22
author: SkyWalking Team
description: "Release Apache SkyWalking Python 1.1.0."
---

SkyWalking Python 1.1.0 is released! Go to [downloads](/downloads) page to find release tars.

**PyPI Wheel**: <https://pypi.org/project/apache-skywalking/1.1.0/>

**DockerHub Image**: <https://hub.docker.com/r/apache/skywalking-python>

## What's Changed

* Fix wrong docker tag name by @kezhenxu94 in <https://github.com/apache/skywalking-python/pull/307>
* Update release doc to reflect new steps by @Superskyyy in <https://github.com/apache/skywalking-python/pull/306>
* Fix unexpected 'No active span' IllegalStateError by @ZEALi in <https://github.com/apache/skywalking-python/pull/311>
* Add Neo4j plugin. by @Jedore in <https://github.com/apache/skywalking-python/pull/312>
* Update README.md to reflect new slack channel by @Superskyyy in <https://github.com/apache/skywalking-python/pull/313>
* Replace Kafka CI image tags to sha by @FAWC438 in <https://github.com/apache/skywalking-python/pull/319>
* Python agent performance enhancement with asyncio by @FAWC438 in <https://github.com/apache/skywalking-python/pull/316>
* loose restrict of greenlet (#3) by @jaychoww in <https://github.com/apache/skywalking-python/pull/326>
* Add support printing TID to logs by @CodePrometheus in <https://github.com/apache/skywalking-python/pull/323>
* Fix psutil dockerfile version constraint by @Superskyyy in <https://github.com/apache/skywalking-python/pull/328>
* Change from pkg_resources to importlib metadata by @shenxiangzhuang in <https://github.com/apache/skywalking-python/pull/329>
* Update NOTICE to 2024 by @Superskyyy in <https://github.com/apache/skywalking-python/pull/332>
* Disable uwsgi e2e by @Superskyyy in <https://github.com/apache/skywalking-python/pull/337>
* Fix unexpected 'decode' AttributeError when MySQLdb module is mapped by PyMySQL by @ZEALi in <https://github.com/apache/skywalking-python/pull/336>
* Add Pulsar plugin by @CodePrometheus in <https://github.com/apache/skywalking-python/pull/345>
* fix(agent): no attribute '_SkyWalkingAgent__log_queue' using kafka plain text by @tsonglew in <https://github.com/apache/skywalking-python/pull/343>
* Bump up version to 1.1.0 by @kezhenxu94 in <https://github.com/apache/skywalking-python/pull/347>

## New Contributors

* @CodePrometheus made their first contribution in <https://github.com/apache/skywalking-python/pull/323>
* @shenxiangzhuang made their first contribution in <https://github.com/apache/skywalking-python/pull/329>
* @tsonglew made their first contribution in <https://github.com/apache/skywalking-python/pull/343>

**Full Changelog**: <https://github.com/apache/skywalking-python/compare/v1.0.1...v1.1.0>

