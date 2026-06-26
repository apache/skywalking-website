---
title: "Release Apache SkyWalking for NodeJS 0.9.0"
date: 2026-06-26
author: SkyWalking Team
description: "Release Apache SkyWalking NodeJS 0.9.0."
---

SkyWalking NodeJS 0.9.0 is released. Go to [downloads](/downloads) page to find release tars.

## What's Changed
* Modify mongoose call xxxx() throwing "is not a function" by @shivendoodeshmukh in https://github.com/apache/skywalking-nodejs/pull/128
* fix: add destroy methods to prevent memory leaks in protocol clients by @wolfsilver in https://github.com/apache/skywalking-nodejs/pull/129
* Bugfix: Pg plugin can't collect paramter values by @z2015 in https://github.com/apache/skywalking-nodejs/pull/131
* fix: prevent OOM when collector unreachable; upgrade grpc-js to 1.14.4 by @wu-sheng in https://github.com/apache/skywalking-nodejs/pull/132
* chore: add release automation scripts (release.sh + release-finalize.sh) by @wu-sheng in https://github.com/apache/skywalking-nodejs/pull/133

## New Contributors
* @shivendoodeshmukh made their first contribution in https://github.com/apache/skywalking-nodejs/pull/128
* @wolfsilver made their first contribution in https://github.com/apache/skywalking-nodejs/pull/129
* @z2015 made their first contribution in https://github.com/apache/skywalking-nodejs/pull/131

**Full Changelog**: https://github.com/apache/skywalking-nodejs/compare/v0.8.0...v0.9.0
