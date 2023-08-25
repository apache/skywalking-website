---
title: Release Apache SkyWalking PHP 0.6.0
date: 2023-08-25
author: SkyWalking Team
description: "Release Apache SkyWalking PHP 0.6.0"
---

SkyWalking PHP 0.6.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

## What's Changed
* Polish doc about Swoole by @wu-sheng in https://github.com/apache/skywalking-php/pull/73
* Start 0.6.0 development. by @jmjoy in https://github.com/apache/skywalking-php/pull/74
* Fix hook for Doctrine PDO class by @matikij in https://github.com/apache/skywalking-php/pull/76
* Log Exception in tracing span when throw. by @jmjoy in https://github.com/apache/skywalking-php/pull/75
* Upgrade dependencies and adapt. by @jmjoy in https://github.com/apache/skywalking-php/pull/77
* Fix required rust version and add runing php-fpm notice in docs. by @jmjoy in https://github.com/apache/skywalking-php/pull/78
* Bump openssl from 0.10.48 to 0.10.55 by @dependabot in https://github.com/apache/skywalking-php/pull/79
* Fix the situation where the redis port is string. by @jmjoy in https://github.com/apache/skywalking-php/pull/80
* Optionally enable zend observer api for auto instrumentation. by @jmjoy in https://github.com/apache/skywalking-php/pull/81
* Fix the empty span situation in redis after hook. by @jmjoy in https://github.com/apache/skywalking-php/pull/82
* Add mongodb pluhgin. by @jmjoy in https://github.com/apache/skywalking-php/pull/83
* Update rust nightly toolchain in CI and format. by @jmjoy in https://github.com/apache/skywalking-php/pull/84
* Add notice document for `skywalking_agent.enable`. by @jmjoy in https://github.com/apache/skywalking-php/pull/85
* Upgrade dependencies. by @jmjoy in https://github.com/apache/skywalking-php/pull/86
* Fix docs by @heyanlong in https://github.com/apache/skywalking-php/pull/87
* Add kafka reporter. by @jmjoy in https://github.com/apache/skywalking-php/pull/88
* Release SkyWalking PHP Agent 0.6.0 by @jmjoy in https://github.com/apache/skywalking-php/pull/89

## New Contributors
* @matikij made their first contribution in https://github.com/apache/skywalking-php/pull/76

**Full Changelog**: https://github.com/apache/skywalking-php/compare/v0.5.0...v0.6.0

## PECL
https://pecl.php.net/package/skywalking_agent/0.6.0
