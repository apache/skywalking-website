---
title: "Release Apache SkyWalking CLI 0.15.0"
date: 2026-10-19
author: SkyWalking Team
description: "Release Apache SkyWalking CLI 0.15.0"
---

SkyWalking CLI 0.15.0 is released. Go to [downloads](/downloads) page to find release tars.

### Features

* Add the `ai-agent` commands, `list`, `files` and `view`, for the AI agent conversations the AI Sessionizer lands in the OAP (11.1.0+); `view` reads the whole conversation as one `asz.view` document, and `files` lists or exports its stored files by name, both from the OAP's streamed routes on the GraphQL host and both requiring the service and the sender's instance by @wu-sheng in https://github.com/apache/skywalking-cli/pull/234
* Add the sub-command `profiling async` for async-profiler query API by @zhengziyi0117 in https://github.com/apache/skywalking-cli/pull/203
* Support the owner in MQE response by using [10.2 MQE query protocol](https://github.com/apache/skywalking-query-protocol/pull/141) by @zhengziyi0117 in https://github.com/apache/skywalking-cli/pull/203
* Add the sub-command `alarm autocomplete-keys` and `alarm auto-complete-values` for alarm query API by @mrproliu in https://github.com/apache/skywalking-cli/pull/210
* Adapt the alarm message query API by @mrproliu in https://github.com/apache/skywalking-cli/pull/210
* Add the owner field in the `metrics exec` query API by @mrproliu in https://github.com/apache/skywalking-cli/pull/210
* Add the `trace-v2 list` command for adapt the new trace query API by @mrproliu in https://github.com/apache/skywalking-cli/pull/225
* Add the duration field in the `trace list` command by @mrproliu in https://github.com/apache/skywalking-cli/pull/225
* Remove the oldest `queryTraceFromColdStage` query call in the `trace list` command by @mrproliu in https://github.com/apache/skywalking-cli/pull/225
* Add the sub-command `profiling pprof` for pprof query API by @JophieQu in https://github.com/apache/skywalking-cli/pull/226
* Add the `admin` command group for the OAP admin-server REST host (default port `17128`), with a new global `--admin-url` flag (derived from `--base-url` when unset). Covers every admin feature module: `admin preflight`; `admin cluster nodes`, `admin config dump|ttl`, `admin alarm rules|rule` (status); `admin inspect metrics|entities` (inspect); `admin ui-template list|get|create|update|disable` (ui-management); `admin runtime-rule list|bundled|get|add|inactivate|delete|dump` (runtime-rule); and `admin dsl-debug status|sessions|session start|get|stop` plus `admin oal files|file|rules|rule` (dsl-debugging).
* Add the sub-command `admin inspect values` to read the VALUES of metric(s) an OAP does not define locally (foreign metrics) by supplying their `{valueColumn, valueType}` metadata, via the new `POST /inspect/values` admin API; returns the native MQE result.
* Document the `meter-analyzer-config` catalog in `admin runtime-rule` and `admin dsl-debug session start`, matching the OAP-side support for native meter rule hot-update and MAL DSL debugging.

### Bug Fixes

* Upgrade `google.golang.org/grpc` to v1.84.0, `golang.org/x/crypto` to v0.54.0 and `golang.org/x/net` to v0.57.0 to fix known CVEs (grpc CVE-2026-33186, GHSA-hrxh-6v49-42gf, CVE-2026-84445, CVE-2026-84304, CVE-2026-84303; x/crypto CVE-2026-39827 through CVE-2026-39835, CVE-2026-42508, CVE-2026-46595, CVE-2026-46597, CVE-2026-46598, CVE-2025-47914, CVE-2025-58181; x/net CVE-2026-25680).
* Upgrade `golang.org/x/net` to v0.60.0, `golang.org/x/crypto` to v0.57.0 and `golang.org/x/text` to v0.42.0 to fix the advisories left after the previous bump (x/net HTTP/2 CVE-2026-78659, CVE-2026-78660, CVE-2026-78663, CVE-2026-78669, CVE-2026-97032, reachable from swctl's HTTP clients; x/crypto CVE-2026-56854, CVE-2026-56855, CVE-2026-78662; x/text CVE-2026-56851).
* Fix wrong process id format by @mrproliu in https://github.com/apache/skywalking-cli/pull/215
* Migrate `alarm list` from the deprecated `getAlarm` GraphQL query to `queryAlarms`, adding `--layer` and `--rules` filters (OAP 11.0.0).
* `menu get` now reports a clear message when the OAP backend no longer serves the UI menu (retired in OAP 11.0.0) instead of a raw GraphQL error.
