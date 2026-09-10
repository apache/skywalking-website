---
title: Release Apache SkyWalking GraalVM Distro 0.4.0
date: 2026-09-10
author: SkyWalking Team
description: "Release Apache SkyWalking GraalVM Distro 0.4.0."
---

SkyWalking GraalVM Distro 0.4.0 is released. Go to [downloads](https://skywalking.apache.org/downloads/#SkyWalkingGraalVMDistro) page to find release tars.

This release is built on the Apache SkyWalking **v11.0.0** release tag.

### Upstream Sync

- Sync SkyWalking submodule to the upstream **v11.0.0** release tag (`6f1fd78e87`).
- Wire the admin-server family on the admin host (HTTP `:17128`, admin-internal gRPC `:17129`): `admin-server`, `status` (relocated from the 10.x `status-query` plugin — `/status/*`, `/debugging/*`), `inspect` (SWIP-14 metric catalog, `/inspect/*`), `ui-management` (dashboard-template REST for the Horizon UI, `/ui-management/*`), and `dsl-debugging` (SWIP-13 DSL live debugger). The `status-query` plugin is removed.
- Adopt every rule file upstream added or reworked: Airflow layer (SWIP-7), BanyanDB self-observability (SWIP-15: reworked `banyandb-service/instance`, new `banyandb-endpoint` and `banyandb-instance-relation`), Node.js and PHP runtime meters, the Envoy TCP access-log LAL rule (`envoy-als-tcp`), iOS (SWIP-11) and mini-program (SWIP-12) OTel rules, Envoy AI Gateway MCP rules, the mini-program log-MAL rules and the `ai_route_type` searchable log tag — all enabled with the upstream defaults.
- Follow the upstream DSL refactors: rule source attribution (`DslSourceRef`; generated classes are named `{yaml}_L{line}_{rule}` exactly as the JVM distro names them), the DSL class-loading move to `core/dsl`, LAL input-type routing (Envoy HTTP vs TCP entries on the same layer), and `meter-analyzer-config` loading through the shared `Rules` loader.
- Mirror the new `application.yml` options: the `restSSL*` TLS settings of every HTTP server (present for parity, not verified in the native image), the extended `meterAnalyzerActiveFiles` and `enabledOtelMetricsRules` defaults, and the BanyanDB trace-retention pipeline config.
- Drop the bundled UI templates: upstream 11.0.0 removed `ui-initialized-templates/` and `UITemplateInitializer`; templates are now managed via `ui-management`.

### DSL Management and Debugging

- **DSL live debugger (SWIP-13) is supported.** The precompiler flips upstream's `DSLDebugCodegenSwitch` before every OAL / MAL / LAL generator pass, so the debug probes and gate holders are compiled into the pre-compiled rule classes; upstream's `dsl-debugging` module then runs unchanged, only flipping gates and reading samples at runtime. `/dsl-debugging/*` sessions work on every bundled rule, and `/runtime/oal/*` lists the OAL catalog.
- **Read-only rule catalogs.** `GET /runtime/rule/list`, `/runtime/rule/bundled` and `GET /runtime/rule` serve upstream's payloads from the raw MAL/LAL files the precompiler exports at build time, so the Horizon UI's DSL catalog, editor and live-debug pickers list and open every bundled rule (always `BUNDLED`).
- **Runtime rule hot-update stays unsupported**: `POST /runtime/rule/addOrUpdate|inactivate|delete`, `/runtime/rule/dump`, `/runtime/mal/*` and `/runtime/lal/*` answer a structured HTTP 501 — they generate bytecode at runtime, which a closed-world native image cannot do.

### GraalVM Native Image Compatibility

- Config loading: generate the new `DSLDebuggingModuleConfig` and the BanyanDB `TracePipeline` / `SamplerPluginConfig` nested configs, and emit a no-op dispatch branch for empty `ModuleConfig` types (`InspectModuleConfig`, `UIManagementModuleConfig`).
- Port the upstream runtime-rule DSL overloads and the `DslSourceRef` signatures into the same-FQCN replacements: meter `DSL.parse(..., ClassPool, ClassLoader)`, `FilterExpression(..., ClassPool, ClassLoader)`, log `DSL.of(..., ClassPool, ClassLoader)`; `LALConfigs` gains upstream's `LAL_CATALOG` / `stampSource`; `HierarchyDefinitionService` loads rules by name from a `ruleName=FQCN` manifest.
- The precompiler and the MAL comparison tests compose expressions via the real upstream `MetricConvert.formatExp` instead of a hand-rolled replica, fixing pre-compiled class lookup for chained expressions (`.sum` / `.rate` / `.downsampling`).
- Register protobuf descriptor **editions** classes and **protoc-gen-validate** classes for native-image reflection. protobuf-java 4.33 reflects on these when parsing the BanyanDB measure descriptors; without the metadata, BanyanDB metrics queries failed at runtime with `Generated message class ... missing method`.
- Register the whole protobuf descriptor closure of the LAL input types (Envoy `HTTPAccessLogEntry` / `TCPAccessLogEntry`, 52 classes down to `Struct` / `Any` / `Timestamp`) with method access, so the `EnvoyAccessLog` content of the `envoy-als` rules and the DSL debug captures no longer degrade to `jsonformat-failed`.
- Register the distro-only Armeria handlers (`UnsupportedAdminFeatureHandler`, `BundledRuleCatalogHandler`) in `reachability-metadata.json`, so their routes are registered in the native image.
- Keep `FilterExpression#getLiteral()` in the same-FQCN MAL replacements: the upstream `Analyzer` reads it from the filter probe that only runs with a debug session attached, so a session on a filtered rule file (e.g. `otel-rules/oap.yaml`) killed ingestion with `NoSuchMethodError`.

### Documentation

- Document the admin-server family, the status relocation, the read-only rule catalogs, the live debugger and the unsupported hot-update (HTTP 501) in `distro-policy.md`, `supported-features.md` and `configuration.md`; add the `0.4.0` → `11.0.0` row to `version-mapping.md`; refresh the build-time counts and the manifest table in `docs/internals/dsl-immigration.md`.

All issues and pull requests are [here](https://github.com/apache/skywalking-graalvm-distro/releases/tag/v0.4.0)
