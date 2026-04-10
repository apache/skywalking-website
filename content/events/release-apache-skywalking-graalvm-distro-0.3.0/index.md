---
title: Release Apache SkyWalking GraalVM Distro version 0.3.0
date: 2026-04-10
author: SkyWalking Team
description: "Release Apache SkyWalking GraalVM Distro 0.3.0"
endTime: 2026-06-10T00:00:00Z
---

SkyWalking GraalVM Distro 0.3.0 is released. Go to [downloads](https://skywalking.apache.org/downloads/#SkyWalkingGraalVMDistro) page to find release tars.


### Upstream Sync

- Sync SkyWalking submodule to upstream v10.4.0 release tag.
- Add `gen-ai-analyzer` module: GenAI provider/model metrics from virtual-gen-ai.oal.
- Add Envoy AI Gateway MAL/LAL rules and config.
- Add TraceQL config properties: `lookback`, `zipkinTracesListResultTags`, `skywalkingTracesListResultTags`.

### GraalVM Native Image Compatibility

- Add `library-server-for-graalvm`: replace `DynamicSslContext` to use `SslProvider.JDK` instead of `SslProvider.OPENSSL`, enabling gRPC TLS in native images without `netty_tcnative`.

### Documentation

- Document TLS/SSL limitation: native image lacks `netty_tcnative`, recommend service mesh for mTLS.

### E2E Tests

- Add SSL e2e test case (gRPC TLS with JDK SSL provider in native image).
- Add mTLS e2e test case (mutual TLS with client certificates).
- Add RabbitMQ, RocketMQ, ActiveMQ, Pulsar, Kafka, Redis, MongoDB, Flink monitoring e2e test cases (OTEL metrics collection).
- Add AWS DynamoDB, S3, EKS, API Gateway e2e test cases (mock sender metrics).
- Add Auth e2e test case (token-based agent-to-OAP authentication).
- Add OTLP Traces e2e test case (OpenTelemetry trace ingestion via Zipkin API).
- Add Virtual MQ e2e test case (Kafka-instrumented virtual MQ layer metrics).
- Add Kafka Exporter e2e test case (trace and log export to Kafka).
- Add Virtual GenAI e2e test case (GenAI provider/model metrics via Spring AI + Java agent).
- Add Envoy AI Gateway e2e test case (ENVOY_AI_GATEWAY layer metrics/logs via OTLP).
- Add TraceQL SkyWalking e2e test case (Tempo API with SkyWalking native trace datasource).
- Add Envoy AI Gateway MAL comparison tests (34 tests for gateway-service and gateway-instance rules).
- Add Self-Observability e2e test case (OAP Prometheus telemetry via OTEL collector).
- Add MQE e2e test case (Metrics Query Engine expression evaluation with baseline).
