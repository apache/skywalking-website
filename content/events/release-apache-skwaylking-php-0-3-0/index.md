---
title: Release Apache SkyWalking PHP 0.3.0
date: 2023-02-02
author: SkyWalking Team
description: "Release Apache SkyWalking PHP 0.3.0"
---

SkyWalking PHP 0.3.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

## What's Changed
* Make explicit rust version requirement by @wu-sheng in https://github.com/apache/skywalking-php/pull/35
* Update dependencies version limitation. by @jmjoy in https://github.com/apache/skywalking-php/pull/36
* Startup 0.3.0 by @heyanlong in https://github.com/apache/skywalking-php/pull/37
* Support PHP 8.2 by @heyanlong in https://github.com/apache/skywalking-php/pull/38
* Fix php-fpm freeze after large amount of request. by @jmjoy in https://github.com/apache/skywalking-php/pull/39
* Lock develop rust version to 1.65, upgrade deps. by @jmjoy in https://github.com/apache/skywalking-php/pull/41
* Fix worker unexpected shutdown. by @jmjoy in https://github.com/apache/skywalking-php/pull/42
* Update docs about installing rust. by @jmjoy in https://github.com/apache/skywalking-php/pull/43
* Retry cargo test when failed in CI. by @jmjoy in https://github.com/apache/skywalking-php/pull/44
* Hack dtor for mysqli to cleanup resources. by @jmjoy in https://github.com/apache/skywalking-php/pull/45
* Report instance properties and keep alive. by @jmjoy in https://github.com/apache/skywalking-php/pull/46
* Add configuration option `skywalking_agent.runtime_dir`. by @jmjoy in https://github.com/apache/skywalking-php/pull/47
* Add authentication support. by @jmjoy in https://github.com/apache/skywalking-php/pull/48
* Support TLS. by @jmjoy in https://github.com/apache/skywalking-php/pull/49
* Periodic reporting instance properties. by @jmjoy in https://github.com/apache/skywalking-php/pull/50
* Bump to 0.3.0. by @jmjoy in https://github.com/apache/skywalking-php/pull/51

### Breaking
* Remove `http://` scheme in `skywalking_agent.server_addr`.

## New Contributors
* @wu-sheng made their first contribution in https://github.com/apache/skywalking-php/pull/35

**Full Changelog**: https://github.com/apache/skywalking-php/compare/v0.2.0...v0.3.0

## PECL
https://pecl.php.net/package/skywalking_agent/0.3.0
