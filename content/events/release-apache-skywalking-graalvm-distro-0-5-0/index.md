---
title: Release Apache SkyWalking GraalVM Distro 0.5.0
date: 2026-11-10
author: SkyWalking Team
description: "Release Apache SkyWalking GraalVM Distro 0.5.0."
---

SkyWalking GraalVM Distro 0.5.0 is released. Go to [downloads](https://skywalking.apache.org/downloads/#SkyWalkingGraalVMDistro) page to find release tars.

This release is built on the Apache SkyWalking **v11.1.0** release tag.

### Upstream Sync

- Sync SkyWalking submodule to the upstream **v11.1.0** release tag (`d34eff29ba`).
- **TAL (Trace Analysis Language) on the native image.** Wire upstream's new `trace-analyzer` module (on by default, `SW_TRACE_ANALYZER=-` removes it) and pre-compile its rules like LAL: the precompiler compiles `tal/otlp-general.yaml` (`otlp-general`, `otlp-slow-sql`) and generates the 28 `otlp_*` meter classes at build time; the replacement `TalDSL` loads the pre-compiled class and creates its metrics, and upstream's `SpanFilterListener`, pairing and receiver path run unchanged.
- TAL rules are user-editable, so the pre-compilation is generic: every `tal/*.yaml` is compiled, whatever it declares (any metric function, labeled metrics with their `labelLimit`, percentile `buckets` / `ranks`, inline `layerDefinitions` used across files, alias or class-name input and output types), and files are installed in upstream's order, which decides which rule runs first on a span.
- Wire the two new analyzer modules: `ai-evaluation` (SWIP-16 LLM-as-judge over sampled GenAI spans; disabled by default, configured through the new `config/ai-evaluation.yml`) and `ai-agent-conversation` (AI agent conversations landed by the AI Sessionizer; on by default because the GraphQL query module requires it, turned off with its `none` provider).
- Server clusters (apache/skywalking#14183). `server-clusters.yml`, and its dynamic configuration item `core.default.serverClusters`, name a message broker, database or cache that clients reach at several addresses as one service. The native trace analysis renames such peers, and on the OTLP path the new TAL function `findServerClusterName(address[, kind])` does, which the shipped `otlp-general` and `otlp-slow-sql` rules call.
- The shipped `otlp-general` rule counts a CONSUMER `receive` span that has a parent (the .NET Kafka instrumentation's only record of a message) as the consumer's request, reads `messaging.system.name` before `messaging.system`, reads `aws_sqs` / `aws_sns` as `aws.sqs` / `aws.sns`, and drops a CLIENT `settle` span as it drops a CLIENT `receive`.
- HTTP alarm hook delivery self-observability: `alarm_http_delivery_total`, `alarm_http_delivery_status_total` and `alarm_http_delivery_latency_seconds` on `telemetry.prometheus`, with three new `otel-rules/oap.yaml` rules. TraceQL accepts the `All` wildcard on `status` and `kind`.
- Adopt every rule file upstream added or changed, all enabled with the upstream defaults: `lal/ai-agent.yaml`, `meter-analyzer-config/gen-ai-model.yaml` (judge scores), `otel-rules/ai-agent/runtime-{instance,service}.yaml` and `mcp_endpoint.yaml`, `otel-rules/banyandb/banyandb-trace-sampling.yaml`, OpenTelemetry-native host and process monitoring (`otel-rules/process-hostmetrics-{linux,windows}.yaml`, reworked `vm.yaml` / `windows.yaml`), the Kafka, RabbitMQ, PostgreSQL, MySQL, Kong, APISIX, Zabbix and AI agent rule fixes, the AI-evaluation and alarm-delivery counters in `otel-rules/oap.yaml`, and `oal/mesh.oal`.
- Mirror the new `application.yml` options: native OTLP trace storage (`otlpTraceStorage: otlp` is the new default; `zipkin` keeps the converted path), OTLP service grouping, searchable tags, head sampling and rate cap, the TraceQL `/otlp` datasource, the Kubernetes metadata read settings, the alarm hooks' `httpTimeout`, the `ai-agent-conversation` read windows and `hide`, BanyanDB credential / trust-CA hot reload (`secretsManagementFile`), the `recordsAIAgent` BanyanDB group, the Zipkin cold-stage query, and the ports opening once boot completes.

### GraalVM Native Image Compatibility

- Embed every `query-protocol/*.graphqls` schema with one glob instead of a per-file list; upstream's new `gen-ai-evaluation-record` and `ai-agent-conversation` schemas were missing and the native OAP died at boot.
- The precompiler's Armeria scan collects `@Decorator` targets (the AI agent conversation view's `CompressResponse`): without the metadata the native OAP died at boot with "cannot inject the dependency".
- Register the admin-server family's Jackson response POJOs for reflection: `/inspect/*` answered HTTP 400 (`No serializer found for class ...MetricsResponse`) in the native image since 0.4.0.
- Register the protobuf descriptor closure of the OTLP/HTTP JSON receivers' requests and of `LogData`: OTLP/HTTP JSON requests failed natively with `Generated message class ... missing method getResourceLogsList`. The same for `ExportTraceServiceResponse` (now JSON-printed by the OTLP/HTTP trace receiver) and Tempo's `TraceByIDResponse` (the TraceQL `/otlp` trace-by-id route).
- Register the `ConversationFile` LAL output builder for reflection, and package `ai-evaluation.yml` and `server-clusters.yml` in both distributions.
- Register for reflection the TAL expression and meter classes, their configs, every input type, input provider and output builder the TAL rules resolve through, and `PairingFact` (TAL pairing halves cross OAP nodes as stream data) and `SpanMetadata`; a native rule calling `toJson(meta)` and `toJson(span)` returns the same JSON as the JVM OAP.
- Register the status module's `Debugging*Rsp` DTOs (trace, OTLP, Zipkin, log, MQE, topology): `/debugging/*` serializes them to YAML through Jackson, and none were covered since the 11.0.0 relocation.
- Bundle `ios-analyzer`: the distro never shipped it, so the iOS HTTP and MetricKit span listeners (SWIP-11) did not run and an iOS app's `service_cpm`, endpoint and instance traffic stayed empty.
- Reflection metadata for three JSON paths: the admin `/status/cluster/nodes` answer (HTTP 500 without it), the `/status/alarm/*` answers (`{}` without them) and the AWS Firehose receiver's request and answer (every post answered 400 without them).
- Register the UI template REST bodies (`DashboardSetting`, `DashboardConfiguration`, `TemplateChangeStatus`) for reflection: on 0.4.0 `POST` / `PUT /ui-management/templates` failed natively.

### Documentation

- Document the new `ai-evaluation`, `ai-agent-conversation`, `trace-analyzer` and `traceQL` modules and TAL in `distro-policy.md`, `configuration.md` and `internals/dsl-immigration.md` (TAL rules are not live-debuggable because upstream emits no TAL probes), list `server-clusters.yml` among the `config/` files, and refresh the build-time counts.
- Correct the TLS docs: `supported-features.md` and the FAQ still called gRPC TLS unsupported, which 0.3.0 fixed. They now list what the native image serves: agent gRPC TLS, receiver gRPC TLS and mTLS, REST HTTPS, OAP-to-BanyanDB TLS.

All issues and pull requests are [here](https://github.com/apache/skywalking-graalvm-distro/releases/tag/v0.5.0)
