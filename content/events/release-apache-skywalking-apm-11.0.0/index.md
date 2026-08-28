---
title: Release Apache SkyWalking APM 11.0.0
date: 2026-08-28
author: SkyWalking Team
description: "Release Apache SkyWalking 11.0.0 - Horizon UI takes over, and the new admin server brings runtime rule hot-update and a live DSL debugger."
---

SkyWalking APM 11.0.0 is released. Go to [downloads](/downloads) page to find release tars.

### Horizon UI is now the official UI

**This release no longer ships a bundled web UI.** `apm-webapp` and the `skywalking-booster-ui` submodule are removed, along with the `skywalking/ui` Docker image, the on-disk dashboard seed templates, and the UI-related GraphQL mutations and sidebar-menu storage.

The official UI is [Horizon UI](https://github.com/apache/skywalking-horizon-ui), a SkyWalking sub-project that **releases independently** of the OAP backend, with images on Docker Hub at [`apache/skywalking-ui`](https://hub.docker.com/r/apache/skywalking-ui). There is no 1:1 mapping between OAP versions and Horizon UI versions — pin the UI image tag in your deployment and upgrade the two on separate cadences.

To upgrade: replace `skywalking/ui:<tag>` with `apache/skywalking-ui:latest` (or a `horizon-<version>` tag), expose port `17128` from the OAP container, and move any script that called the legacy GraphQL UI mutations to the [UI Management API](/docs/main/v11.0.0/en/setup/backend/admin-api/ui-management/).

### A new admin server, on by default

Admin and operator-facing endpoints now live on a dedicated `admin-server` host — HTTP on `17128`, plus an admin-internal gRPC bus on `17129` for peer-to-peer cluster RPCs, kept separate from the public agent gRPC port. Status, inspect, UI management, DSL debugging and runtime rules all mount on it, and all of them default to enabled.

The host has **no built-in authentication** and must be gateway-protected with IP allow-lists — never expose it to the public internet. See the [Admin API security notice](/docs/main/v11.0.0/en/setup/backend/admin-api/readme/).

Two capabilities land on that host in this release:

* **[Runtime rule hot-update](/docs/main/v11.0.0/en/setup/backend/admin-api/runtime-rule/) for MAL and LAL** — ship metric and log rule changes without restarting OAP. Rules persist to the storage backend, the cluster converges within ~30 seconds, and hot-updates survive restart.
* **[Live debugger for MAL / LAL / OAL](/docs/main/v11.0.0/en/setup/backend/admin-api/dsl-debugging/)** (SWIP-13) — a sample-based runtime debugger that captures per-stage inputs and outputs as the three DSLs process live ingest, fanning out to every cluster peer.

### New monitoring targets

iOS/iPadOS apps (SWIP-11), Apache Airflow (SWIP-7), WeChat and Alipay Mini Programs (SWIP-12), Node.js and PHP runtime metrics, MCP observability for Envoy AI Gateway, and a rebuilt BanyanDB self-observability model (SWIP-15).

#### Project

* Move the DSL class-loading machinery under `core/dsl`, and collapse the three copies of the "define a generated class into the right loader" dispatch into a static `BytecodeClassDefiner.define`. No behaviour change.
* Extend the `GET /inspect/entities` admin API to inspect a metric persisted by **any** OAP, even one this node does not define locally — the caller supplies `valueColumn` + `valueType` and the storage backend resolves the physical location from its own running config. Scope is no longer required.
* Add the `POST /inspect/values` admin API — read the value series of a metric persisted by another OAP by supplying its `{valueColumn, valueType}`. The real MQE engine runs over a request-scoped overlay, so the read returns a native MQE `ExpressionResult`. Admin-only; not mirrored onto the public REST / GraphQL surface.
* Remove the always-on alarm-to-event conversion (`EventHookCallback`). Events now originate only from real event sources (agents, SkyWalking CLI, Kubernetes Event Exporter); alarms remain available through the alarm store and the configured alarm hooks.
* **TLS for all OAP HTTP/REST servers, with cert hot-reload.** Adds `restSSLEnabled` / `restSSLKeyPath` / `restSSLCertChainPath` to every OAP HTTP server — core REST, sharing-server, admin, PromQL, LogQL, TraceQL and Zipkin query/receiver — each with its own environment variables. Refreshed certificates are picked up without restarting OAP. HTTP TLS is server-side only (no mTLS).
* **New `queryAlarms` GraphQL query** — entity / layer / rule-name filters for alarms, plus `keyword`, `tags`, `duration` and `paging`. Legacy `getAlarm` is deprecated but still routes to the same DAO. Adds a `layer` column on `AlarmRecord` and makes `id0`/`id1` indexed; `IAlarmQueryDAO.queryAlarms` is a new abstract method, so 3rd-party storage backends fail at compile if they miss the override. The new filters apply only to alarms written after the upgrade.
* **Breaking Change** — `apm-webapp` and the `skywalking-booster-ui` submodule are removed; this distribution no longer ships a bundled web UI. The `skywalking/ui` Docker image, the `apm-dist/` webapp packaging, the `ui-initialized-templates/` dashboard seeds, the `UIConfigurationManagement` GraphQL mutations and queries, the `SW_ENABLE_UPDATE_UI_TEMPLATE` flag, and the server-side sidebar menu (`UIMenuManagementService`, `UIMenu`, `MenuItem` and their storage impls) are all retired. The official UI is [Horizon UI](https://github.com/apache/skywalking-horizon-ui), released independently on its own schedule.
* **New `ui-management` admin module** — five REST operations for dashboard templates on admin-server, replacing the retired GraphQL template resolver. The sidebar menu is intentionally not served; Horizon UI owns it client-side.
* **All admin feature modules default-on** — `admin-server`, `status`, `inspect`, `ui-management`, `dsl-debugging` and `receiver-runtime-rule`. Set the matching `SW_*` env var to empty to disable a feature.
* **Status API moved to the admin host.** `/status/*` and `/debugging/*` register on admin-server (default `17128`) and no longer mirror on `core.restPort`. URIs and payloads are unchanged; only the host moved. One exception: `/status/config/ttl` stays bound on the public REST host so ecosystem tools can discover TTL bounds without learning the admin port.
* **New `admin-server` module** — shared host for admin and on-demand write APIs, running an HTTP REST surface (default `17128`) and an admin-internal gRPC bus (default `17129`) for peer-to-peer cluster RPCs. Enabled by default; it has no built-in authentication and **must** be gateway-protected. The runtime-rule config block loses its own `restHost`/`restPort`/etc. keys, which move under the new `admin-server` block.
* **Runtime rule hot-update for MAL and LAL.** `addOrUpdate` creates or replaces a rule, `inactivate` soft-pauses one while preserving the backend measure and its history, and `delete` removes an inactive row (with `?mode=revertToBundled` to fall back to the on-disk YAML). Read-side endpoints cover `get` / `bundled` / `list` / `dump`. Every node converges within ~30 s (`receiver-runtime-rule.refreshRulesPeriod`), hot-updates survive restart, and all writes serialize on a deterministic "main" peer with transparent forwarding, so an L7 load balancer can route any operator request to any OAP.
* **Live debugger for MAL / LAL / OAL** — implements SWIP-13. Idle-path cost is one volatile-bool read per probe that JIT eliminates after warm-up; active sessions fan out to every cluster peer. Disabled by default (`SW_DSL_DEBUGGING=default`). Per-session hard caps: `recordCap` ≤ 10000, `retentionMillis` ≤ 1 hour. LAL sessions accept `granularity=block|statement`. Capture payloads include raw log bodies, so treat the admin port as authenticated infrastructure.
* **BanyanDB schema mismatches are now visible at boot, not silent.** A resource whose backend shape doesn't match the current rule is skipped with an ERROR logging the declared-vs-backend diff, and OAP continues booting — previously the mismatch was accepted and its samples quietly dropped.
* Bump infra-e2e to testcontainers-go v0.42.0, which uses the Docker Compose v2 plugin natively.
* Remove the deprecated `version` field from all docker-compose files for Compose v2 compatibility.
* **Best-effort schema-cutover fence for BanyanDB.** After firing a schema install or drop, OAP waits up to a bounded window (default 2s) for every data node to apply the change before resuming dispatch, logging a warning and proceeding on laggard timeout.
* Bump dependencies: gRPC `1.70.0` → `1.80.0`, protobuf-java `3.25.5` → `4.33.1`, Netty `4.2.10.Final` → `4.2.12.Final`, Netty-tcnative `2.0.75` → `2.0.77`, pgv `1.2.1` → `1.3.0`.
* **Inspect API on admin-server.** `GET /inspect/metrics` lists every registered metric with its type / scope / catalog / value column / downsamplings; `GET /inspect/entities` scans the entities emitting values for a metric over a time range and returns an `mqeEntity` block ready to paste into `execExpression`. Adds `IMetricsQueryDAO.listEntityIdsInRange` as an abstract method. Enabled by default.
* **Status feature module relocation, finalized.** `status-query-plugin` is replaced by a `status` feature module under `server-admin/` with URIs and payloads unchanged; the selector renames from `SW_QUERY=…,status-query-plugin` to a top-level `SW_STATUS=default`.
* Drop six unused test-scoped dependencies from `runtime-rule`; that coverage now lives in `test/e2e-v2/cases/runtime-rule/`.
* Declare `server-testing` at `test` scope everywhere, keeping its `org.junit` stubs off the runtime classpath that `server-starter` copies into `oap-libs`. `library-banyandb-client` gains the direct `library-util` dependency it always needed.
* Add `ThreadPolicy.ioBound(N)` to `library-batch-queue` for queues whose consumers spend most of their time blocked — virtual threads on JDK 25+, N platform threads otherwise, with identical semantics on both paths. Also fixes `BatchQueue.shutdown()`, which ran its final drain on the caller's thread while drain loops could still be inside `consume()`, breaking the single-drain-thread invariant.

#### OAP Server

* Add component IDs for the Spring LDAP Java agent plugin (`spring-ldap`: 179) and LDAP server (`LDAP`: 180), including their server mapping.
* Fix LAL's `segmentId` and `spanId` extractor statements, which the grammar accepted and the parser never implemented — a rule writing `segmentId ...` failed at boot with a `NullPointerException` naming `IfStatementContext`. An unhandled extractor statement now reports its own rule line instead of throwing.
* Remove dead code from the DSL subsystem and correct the shared kernel's own documentation.
* Unify source attribution for every generated DSL class, so a stack frame from OAL, MAL, LAL or Hierarchy code leads back to the rule that produced it.
* Support runtime rule hot-update and DSL debugging for the `meter-analyzer-config` catalog, bringing native meter rules to parity with `otel-rules`.
* Support Elasticsearch 9.x as storage.
* Add Node.js runtime metrics via the Node.js agent `MeterReportService` pipeline (`meter_instance_nodejs_*`, default 20s sample/report), analyzed through `nodejs-runtime.yaml`.
* Add PHP runtime PHM meter analyzer (`php-runtime.yaml`) for the SkyWalking PHP agent process.
* Batch the BanyanDB schema fence per runtime-rule apply, so a rule file that changes dozens of rules no longer does `K×M` sequential fences and overruns the apply's REST budget.
* Add a runtime-rule apply-status query — the cluster main tracks each structural apply through a phase machine (pending → DDL → fencing → rolling-out → applied), with `degraded` and surfaced `fenceLaggards` for a committed-but-unconfirmed apply.
* Push runtime-rule convergence to peers on commit via a `NotifyApplied` admin-internal RPC, instead of waiting up to one refresh tick (~30s).
* Fix BanyanDB peer nodes permanently flooding `<metric> is not registered`, and a follow-on case where a peer kept translating writes with a stale schema shape after a runtime-rule reshape.
* Support LAL `json {}` parsing JSON content delivered in a plain-text log body, so previously-aborting rules on OTLP-fed layers now work without any receiver or protocol change.
* Surface the drop reason in LAL live-debugging when a rule stops a log at a parse step.
* Fix a v2 MAL `CounterWindow` key collision: `rate()` / `increase()` / `irate()` keyed each counter's sliding window on the rule's output metric name instead of the counter's own name, so counters sharing a label set computed rates against each other's values.
* Fix the v2 MAL Elvis operator `?:` to honor Groovy-falsy semantics — the fallback now applies to an empty-string primary, not only to `null`.
* SWIP-15: rebuild BanyanDB self-observability around the cluster / container / group model (requires BanyanDB 0.11+) — a cluster is one `Service`, each container a `ServiceInstance`, and each storage group an `Endpoint`.
* Runtime MAL/LAL hot-update rules can declare `layerDefinitions:` to introduce new layers.
* Fix: runtime-rule schema changes now work in `no-init` mode — the deployment mode every production cluster runs. Previously a runtime `addOrUpdate` introducing a new metric blocked forever in the storage installer's init-node poll loop.
* Fix: runtime-rule cross-node writes no longer fail with `HTTP 400 forward_self_loop` on a multi-replica Kubernetes cluster, where every replica shared the `0.0.0.0_11800` self node id.
* Fix: remove the redundant tags from the `envoy-ai-gateway.yaml` LAL configuration.
* Add a Zipkin Virtual GenAI e2e test, using the `zipkin_json` exporter to avoid a protobuf dependency conflict.
* Fix missing `taskId` filter and incorrect `IN` clause parameter binding in `JDBCJFRDataQueryDAO` and `JDBCPprofDataQueryDAO`.
* Remove deprecated `GroupBy.field_name` from BanyanDB `MeasureQuery` request building.
* Push the `taskId` filter down to the storage layer in `IAsyncProfilerTaskLogQueryDAO`, removing in-memory filtering from `AsyncProfilerQueryService`.
* Fix missing parentheses around OR conditions in `JDBCZipkinQueryDAO.getTraces()`, which bypassed the table filter for all but the first trace ID. Replaced with a proper `IN` clause.
* Fix missing `and` keyword in `JDBCEBPFProfilingTaskDAO.getTaskRecord()`, which caused a syntax error on every invocation.
* Fix storage layer bugs in profiling DAOs and add unit test coverage for JDBC query DAOs.
* Optimize `TraceQueryService.sortSpans` from O(N^2) to O(N) by pre-indexing spans by `segmentSpanId`, so trace detail queries scale linearly with span count.
* Support MCP (Model Context Protocol) observability for Envoy AI Gateway: MCP metrics (request CPM/latency, method breakdown, backend breakdown, initialization latency, capabilities), MCP access log sampling (errors only), the `ai_route_type` searchable log tag, and MCP dashboard tabs.
* Add weighted handler support to `BatchQueue` adaptive partitioning — MAL metrics use weight 0.05 at L1 (vs 1.0 for OAL), reducing partition count and memory overhead when many MAL metric types are registered.
* Fix missing `taskId` filter in pprof task log query and its JDBC / BanyanDB / Elasticsearch implementations.
* Fix duplicate calls in `EndpointTopologyBuilder`, which unlike `ServiceTopologyBuilder` did not deduplicate when storage returns multiple records for the same relation.
* Use `containsOnce` and `noDuplicates` for topology dependency e2e expected files to enforce no-duplicate verification.
* Bump infra-e2e to `ef073ad` to include `noDuplicates` pipe function support.
* PromQL: support querying Zipkin metadata (service name, remote service name, span name).
* TraceQL: support more tags and variables in Grafana for querying.
* LAL: add `sourceAttribute()` for non-persistent OTLP resource attribute access in scripts.
* LAL: add `layer: auto` mode for dynamic layer assignment when `service.layer` is absent.
* Add a two-phase `SpanListener` SPI mechanism for extensible trace span processing, and refactor GenAI from a hardcoded `SpanForward.processGenAILogic()` to `GenAISpanListener`.
* Add OTLP/HTTP receiver support for traces, logs, and metrics (`/v1/traces`, `/v1/logs`, `/v1/metrics`), for both `application/x-protobuf` and `application/json`.
* Fix: TTL query add metadata TTL.
* Fix: `PersistentWorker` used the wrong TTL for the metrics cache when the storage is BanyanDB.
* Add iOS/iPadOS app monitoring via the OpenTelemetry Swift SDK (SWIP-11) — the `IOS` layer, `IOSHTTPSpanListener` for outbound HTTP client metrics across OTel Swift's `.old`/`.stable`/`.httpDup` semantic-convention modes, and `IOSMetricKitSpanListener` for daily MetricKit metrics.
* Add Apache Airflow monitoring via native OpenTelemetry metrics (SWIP-7) — a new `AIRFLOW` layer with Service (cluster) and Instance (host) dimensions, and 27 metrics under `otel-rules/airflow/`.
* Fix LAL `layer: auto` mode dropping logs after an extractor set the layer — codegen now propagates `layer "..."` assignments to `LogMetadata.layer`.
* Fix MetricKit histogram percentile metrics being reported at 1000× their true value, by marking the `SampleFamily` with `defaultHistogramBucketUnit(MILLISECONDS)`.
* Add WeChat and Alipay Mini Program monitoring via the SkyAPM mini-program-monitor SDK (SWIP-12) — two new layers (`WECHAT_MINI_PROGRAM`, `ALIPAY_MINI_PROGRAM`) and two new JavaScript componentIds.
* Fix: remove `VirtualServiceAnalysisListener`'s dependency on `GenAIAnalyzerModule` if it is disabled.
* MAL: register `TimeUnit` in `MALCodegenHelper.ENUM_FQCN` so rule YAML can write `.histogram("le", TimeUnit.MILLISECONDS)` for SDKs that emit bucket bounds in ms.
* Fix: potential unexpected current directory inclusion in the Docker OAP classpath.
* MAL: add `safeDiv(divisor)` on `SampleFamily`, yielding `0` rather than `Infinity`/`NaN` when the divisor is `0`, and use it in the Envoy AI Gateway latency-average rules.
* Fix `envoy-ai-gateway` metrics rules to return `0` when the divisor is `0`.
* Custom `Layer`s can now be declared without modifying the OAP source — via an operator-managed `layer-extensions.yml`, an inline `layerDefinitions:` block in a MAL or LAL rule file, or a plugin extension. The recommended ordinal range for external layers is `>= 1000`.
* LAL: support full arithmetic (`+`, `-`, `*`, `/`) on numeric operands, fixing the bug where `(tag("x") as Integer) + (tag("y") as Integer)` was treated as string concatenation, so token-threshold conditions never triggered `abort {}`.
* Fix: `avgHistogramPercentile` / `sumHistogramPercentile` reported the smallest finite bucket boundary for every rank when no samples were observed in any bucket.
* Fix: MAL `expPrefix` now applies to every metric source in `exp`, not just the leading one — previously secondary metrics inside arguments silently skipped the prefix.
* Add `@Stream(allowBootReshape = true)` opt-in for additive boot-time reshape of BanyanDB streams / measures, so a new `@Column` on a code-defined stream is appended to the live schema instead of being rejected as `SKIPPED_SHAPE_MISMATCH`.
* Mask keywords `trustStorePass` and `keyStorePass` by default.
* Bump dependencies to clear CVE alerts on shipped OAP jars: log4j `2.25.3` → `2.25.4`, jackson `2.18.5` → `2.18.6`, kafka-clients `3.4.0` → `3.9.2`, postgresql `42.4.4` → `42.7.11`, commons-compress `1.21` → `1.26.2`.
* Bump more dependencies to clear CVE alerts: netty `4.2.12.Final` → `4.2.15.Final`, jackson `2.18.6` → `2.18.8`, commons-codec `1.11` → `1.13`, and realign `jackson-databind` `2.16.0` → `2.18.8` so the whole jackson family is managed at a single version.
* Bump Apache Curator `4.3.0` → `5.9.0` and Apache ZooKeeper `3.5.7` → `3.9.5` to clear CVE-2023-44981. No source changes were required.
* Migrate the Consul cluster and configuration client from the abandoned `com.orbitz.consul:consul-client` `1.5.3` to the maintained fork `org.kiwiproject:consul-client` `0.9.0`, clearing CVE-2021-0341; the BOM now pins okhttp to `4.12.0`.
* Bump test-scope assertj-core `3.20.2` → `3.27.7` to clear CVE-2026-24400.
* Clear three security alerts in the Airflow e2e mock (CI-only, never shipped): `protobuf` `4.25.8` → `5.29.6`, `opentelemetry-proto` `1.24.0` → `1.28.0`, `grpcio` `1.62.2` → `1.63.2`.
* Clear Dependabot CVE alerts in the e2e Go test fixtures (CI-only, never shipped): `golang.org/x/net` `0.48.0` → `0.55.0` and the Go toolchain `1.24` → `1.26.5`.
* Fix: continuous profiling policy validation now rejects a threshold / count of `0`, matching rover's `value >= threshold` trigger semantics. CPU percent and HTTP error rate are tightened from `[0-100]` to `(0-100]`.
* Fix wrong BanyanDB resource options in record data.
* Align the default BanyanDB stage `segmentInterval` values so each coarser stage is an integer multiple of the finer one, keeping hot → warm → cold lifecycle migration on the cheap whole-segment fast path.
* Fix: `layer-extensions.yml` is now excluded from the `skywalking-oap` jar and shipped to the distribution `config/` directory, so an operator-edited copy is no longer shadowed by the empty template bundled in the jar.
* Fix: the v2 MAL compiler now resolves custom layers referenced as `Layer.NAME` in an expression, which previously failed code generation because a custom layer has no generated `Layer.*` static field.
* Fix Envoy ALS rendering for the LAL live-debugger and the persisted log `content` — an Istio metadata-exchange peer in `filter_state_objects` is now decoded into readable peer metadata instead of an opaque `jsonformat-failed` envelope.
* Surface the effective BanyanDB configuration (`bydb.yml` / `bydb-topn.yml`) in the `/debugging/config/dump` admin API, which previously showed an empty `storage.banyandb` block.
* Fix: an MQE `top_n(metric, N, order, attrX='value')` query whose attribute is not a column of the target metric now returns a descriptive MQE error instead of a raw storage `IOException`.
* Migrate all BanyanDB storage read queries from the typed query-builder API to BydbQL.
* Fix: BanyanDB queries no longer silently truncate at the storage engine's implicit row cap (100 rows for measures, 20 for streams/traces), which was applied after `GROUP BY` on read paths where OAP sent no limit.
* Support BanyanDB's group-scoped trace retention pipeline in `bydb.yml` — the `trace` and `zipkinTrace` groups gain a `pipeline` block that OAP pushes onto the BanyanDB group as a `TracePipelineConfig`, letting a sampler plugin drop traces inside the data node during Hot-phase compaction.
* Fix: a blank value in `bydb.yml` (`key:` with nothing after it) aborted OAP startup with an opaque `NullPointerException`; the loader now skips blank entries and leaves the field at its default.
* Route LAL rules within a layer by their input type, so a single layer can host rules over different proto inputs and `LogFilterListener` skips any rule whose type doesn't match the incoming log.
* Fix the PagerDuty alarm hook to default its Events API v2 endpoint to `https://events.pagerduty.com/v2/enqueue`.
* Fix `HttpAlarmCallback` logging a successful alarm delivery as a failure — the shared HTTP hook helper treated only `200` and `204` as success, so the `202 Accepted` returned by asynchronous intake APIs produced an ERROR on every delivered alarm.
* Make the PagerDuty Events API v2 endpoint configurable through a new optional `events-api-url` setting on each `pagerduty` hook, so an EU-region account can point the hook straight at its own endpoint.
* Bump the default BanyanDB compatible server API version (`SW_STORAGE_BANYANDB_COMPATIBLE_SERVER_API_VERSIONS`) from `0.10` to `0.11`.

#### UI

* Add Airflow layer dashboards and menu i18n under Workflow Scheduler in Horizon UI (SWIP-7).
* Add the mobile menu icon and i18n labels for the iOS layer.
* Fix metric label rendering in multi-expression dashboard widgets.
* Add i18n menu labels for WeChat Mini Program and Alipay Mini Program (en / zh / es).
* Support the trace V1 view in the trace single page.

#### Documentation

* Document the `meter-analyzer-config` catalog in the runtime-rule hot-update and DSL-debugging references, and add the optional `layerDefinitions` block and the active-files startup-failure behaviour.
* Update the LAL documentation with the `sourceAttribute()` function and `layer: auto` mode.
* Add Airflow monitoring setup documentation (SWIP-7).
* Add iOS app monitoring setup documentation.
* Add WeChat / Alipay Mini Program monitoring setup documentation, plus a client-side-monitoring section in the security guide covering public-internet ingress for mobile / browser / mini-program SDKs.
* Improve the downsampling documentation.
* Fix the docker-compose quickstart: the OAP healthcheck no longer calls `curl` (absent from the JRE image), and the Horizon UI service maps the correct container port.
* Add PHP runtime metrics (PHM) dashboard documentation.
* Add Node.js runtime metrics dashboard documentation.
* Add a BanyanDB trace tail sampling guide under "BanyanDB Exclusive Setup".
* Correct the APISIX monitoring guide to align its Collector configuration and metric names with the current APISIX MAL rules and Horizon UI dashboard.

All issues and pull requests are [here](https://github.com/apache/skywalking/issues?q=milestone:11.0.0)
