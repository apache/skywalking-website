---
title: Release Apache SkyWalking LUA Nginx 1.0.0
date: 2024-08-22
author: SkyWalking Team
---

SkyWalking LUA Nginx 1.0.0 is released. Go to [downloads](/downloads) page to find release tars.

## What's Changed
* Update log4j to 2.17.1 to address CVE-2021-44832. by @jeremie1112 in https://github.com/apache/skywalking-nginx-lua/pull/91
* Update NOTICE year to 2022 by @dmsolr in https://github.com/apache/skywalking-nginx-lua/pull/92
* ci: run lua test cases with luajit by @tzssangglass in https://github.com/apache/skywalking-nginx-lua/pull/94
* Add IgnoreSuffix feature by @alonelaval in https://github.com/apache/skywalking-nginx-lua/pull/93
* feat: support update the peer before requesting outgoing by @dmsolr in https://github.com/apache/skywalking-nginx-lua/pull/95
* use agent-test-tool docker image instead of building from source by @dmsolr in https://github.com/apache/skywalking-nginx-lua/pull/96
* improve e2e test by @dmsolr in https://github.com/apache/skywalking-nginx-lua/pull/103
* support to try to use request-id as trace-id when trace context absent by @dmsolr in https://github.com/apache/skywalking-nginx-lua/pull/104
* stop reporting traces after the worker process begins to exit by @wangrzneu in https://github.com/apache/skywalking-nginx-lua/pull/105
* Updated tag key from `http.status` to `http.status_code` by @wuwen5 in https://github.com/apache/skywalking-nginx-lua/pull/107
* Prepare for version 1.0.0 release and fix typos in doc. by @wuwen5 in https://github.com/apache/skywalking-nginx-lua/pull/108

## New Contributors
* @jeremie1112 made their first contribution in https://github.com/apache/skywalking-nginx-lua/pull/91
* @tzssangglass made their first contribution in https://github.com/apache/skywalking-nginx-lua/pull/94
* @alonelaval made their first contribution in https://github.com/apache/skywalking-nginx-lua/pull/93
* @wuwen5 made their first contribution in https://github.com/apache/skywalking-nginx-lua/pull/107
