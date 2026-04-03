---
title: Release Apache SkyWalking APM 10.4.0
date: 2026-04-01
author: SkyWalking Team
description: "Release Apache SkyWalking APM 10.4.0."
---

SkyWalking APM 10.4.0 is released. Go to [downloads](/downloads) page to find release tars.

##### Project

* Introduce OAL V2 engine with immutable AST models, type-safe enums, precise error location reporting, and clean separation between parsing and code generation.
* Introduce MAL/LAL/Hierarchy V2 engine — replace Groovy-based DSL runtime with ANTLR4 parser + Javassist bytecode generation.
  - Fail-fast compilation at startup — syntax and type errors are caught immediately instead of at first execution.
  - Thread-safe generated classes with no ThreadLocal or shared mutable state.
  - JMH benchmarks confirm v2 runtime speedups: MAL execute ~6.8x, LAL compile ~39x / execute ~2.8x, Hierarchy execute ~2.6x faster than Groovy v1.
* **Breaking Change** — LAL: remove `slowSql {}` and `sampledTrace {}` sub-DSLs from the grammar. Replaced by the configurable `outputType` mechanism.
  - An explicit `sink {}` block is now **required** for data to be persisted.
  - Add `def` local variable support in LAL extractor with `toJson()` and `toJsonArray()` built-in functions, null-safe navigation, method chaining with compile-time type inference, and explicit type cast via `as`.
  - **Breaking Change** — `LALOutputBuilder.init()` signature changed from `init(LogData, NamingControl)` to `init(LogData, Optional<Object> extraLog, NamingControl)`.
* Support building, testing, and publishing with Java 25.
* Add `library-batch-queue` module — a partitioned, self-draining queue with type-based dispatch, adaptive partitioning, idle backoff, and throughput-weighted drain rebalancing.
* Replace DataCarrier with BatchQueue for L1 metrics aggregation, L2 metrics persistence, TopN persistence, all three exporters, and gRPC remote client. Total OAP threads reduced from 150+ to ~72 (~50% reduction).
* Remove `library-datacarrier-queue` module.
* Add virtual thread support (JDK 25+) for gRPC and Armeria HTTP server handler threads. On JDK 25+, all 11 thread pools share ~9 carrier threads instead of up to 1,400+ platform threads.
* Change default Docker base image to JDK 25 (`eclipse-temurin:25-jre`). JDK 11 kept as `-java11` variant.
* Fix `/debugging/config/dump` may leak sensitive information if there are second level properties in the configuration.

##### OAP Server

* KubernetesCoordinator: make self instance return real pod IP address instead of `127.0.0.1`.
* Fix KubernetesCoordinator self-endpoint race condition.
* Enhance the alarm kernel with recovered status notification capability.
* Fix BrowserWebVitalsPerfData `clsTime` to `cls` and make it double type.
* Fix range matrix and scalar binary operation in PromQL.
* Add `LatestLabeledFunction` for meter.
* MAL Labeled metrics support additional attributes.
* Add support for OpenSearch/ElasticSearch client certificate authentication.
* Fix BanyanDB logs paging query.
* Replace BanyanDB Java client with native implementation.
* Fix trace profiling query time range condition.
* `BrowserErrorLog`, OAP Server generated UUID to replace the original client side ID.
* MQE: fix multiple labeled metric query and ensure no results are returned if no label value combinations match.
* Fix `BrowserErrorLog` BanyanDB storage query order.
* `BanyanDB Client`: Property query support `Order By`.
* MQE: trim the label values condition for the labeled metrics query.
* PromQL service: fix time parse issue when using RFC3339 time format for querying.
* Envoy metrics service receiver: support adapter listener metrics.
* Envoy metrics service receiver: support config MAL rules files.
* Fix `HttpAlarmCallback` creating a new `HttpClient` on every alarm `post()` call, leaking NIO selector threads.
* Add `SharedKubernetesClient` singleton to replace 9 separate `KubernetesClientBuilder().build()` calls.
* Reduce Armeria HTTP server event loop threads. All 7 HTTP servers now share one event loop group.
* Add the spring-ai components and the GenAI layer.
* Support TraceQL and Tempo API for Zipkin and SkyWalking native trace query.
* Remove `initExp` from MAL configuration.
* Activate `otlp-traces` handler in `receiver-otel` by default.
* Support Virtual-GenAI monitoring.
* Fix on-demand pod log parsing failure by replacing invalid `DateTimeFormatter` pattern with `ISO_OFFSET_DATE_TIME`.
* Fix Zipkin receiver compatibility with application/x-protobuf Content-Type.
* Support Envoy AI Gateway observability (SWIP-10): new `ENVOY_AI_GATEWAY` layer with MAL/LAL rules for GenAI metrics and access log sampling via OTLP.
* OTel metric receiver: convert data point attribute dots to underscores.
* OTel log handler: prefer `service.instance.id` over `service.instance` with fallback.
* Support virtual GenAI analysis for otlp and zipkin traces.
* Fix BanyanDB time range overflow in profile thread snapshot query.

##### UI

* Fix the missing icon in new native trace view.
* Enhance the alert page to show the recovery time of resolved alerts.
* Implement a common pagination component.
* Add the `coldStage` to the `Duration` for queries.
* Add the GenAI icon to Topology.
* Add the gen-ai menu.
* Fix: set the step to SECOND in the duration for Log/Trace/Alarm/Tag.

##### Documentation

* Restructure `docs/README.md` for better navigation with high-level documentation overview.
* Move Marketplace as a top-level menu section.
* Restructure agent compatibility page with OAP 10.x focus.
* Remove outdated FAQ docs and "since 7/8/9.x" version statements.

All issues and pull requests are [here](https://github.com/apache/skywalking/issues?q=milestone:10.4.0)
