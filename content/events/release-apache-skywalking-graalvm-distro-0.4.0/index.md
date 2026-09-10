---
title: Release Apache SkyWalking GraalVM Distro version 0.4.0
date: 2026-09-10
author: SkyWalking Team
description: "Release Apache SkyWalking GraalVM Distro 0.4.0"
endTime: 2026-11-10T00:00:00Z
---

SkyWalking GraalVM Distro 0.4.0 is released. Go to [downloads](https://skywalking.apache.org/downloads/#SkyWalkingGraalVMDistro) page to find release tars.


### Upstream Sync

- Sync SkyWalking submodule to the upstream **v11.0.0** release tag (`6f1fd78e87`), via `ad733554b0` and `89624809f0`.
- Wire the admin-server family on the admin host (HTTP `:17128`, admin-internal gRPC `:17129`): `admin-server`, `status` (relocated from the 10.x `status-query` plugin — `/status/*`, `/debugging/*`), `inspect` (SWIP-14 metric catalog, `/inspect/*`), `ui-management` (dashboard-template REST for the Horizon UI, `/ui-management/*`), and `dsl-debugging` (SWIP-13 DSL live debugger, see below). The `status-query` plugin is removed.
- Adopt every rule file upstream added or reworked: Airflow layer (SWIP-7, `otel-rules/airflow/*`), BanyanDB self-observability (SWIP-15: reworked `banyandb-service/instance`, new `banyandb-endpoint` and `banyandb-instance-relation` on the new `SERVICE_INSTANCE_RELATION` meter scope), Node.js and PHP runtime meters (`meter-analyzer-config/nodejs-runtime`, `php-runtime`), the Envoy TCP access-log LAL rule (`envoy-als-tcp`), iOS (SWIP-11) and mini-program (SWIP-12) OTel rules, Envoy AI Gateway MCP rules, the mini-program log-MAL rules and the `ai_route_type` searchable log tag — all enabled with the upstream defaults.
- Follow the upstream DSL refactors: rule source attribution (`DslSourceRef`; generated classes are named `{yaml}_L{line}_{rule}` exactly as the JVM distro names them), the DSL class-loading move to `core/dsl`, LAL input-type routing (Envoy HTTP vs TCP entries on the same layer — the pre-compiled LAL manifest records each rule's effective input type), and `meter-analyzer-config` loading through the shared `Rules` loader (`MeterConfig`/`MeterConfigs` are gone upstream and in the distro).
- Mirror the new `application.yml` options: the `restSSL*` TLS settings of every HTTP server (present for parity, not verified in the native image), the extended `meterAnalyzerActiveFiles` and `enabledOtelMetricsRules` defaults, and the BanyanDB trace-retention pipeline config.
- Drop the bundled UI templates: upstream 11.0.0 removed `ui-initialized-templates/` and `UITemplateInitializer`; templates are now managed via `ui-management`.

### DSL Management and Debugging

- **DSL live debugger (SWIP-13) is supported.** The precompiler flips upstream's `DSLDebugCodegenSwitch` before every OAL / MAL / LAL generator pass (the same switch the JVM OAP flips at boot), so the debug probes and gate holders are compiled into the pre-compiled rule classes; upstream's `dsl-debugging` module then runs unchanged, only flipping gates and reading samples at runtime. `/dsl-debugging/*` sessions work on every bundled rule, and `/runtime/oal/*` lists the OAL catalog.
- **Read-only rule catalogs.** A distro handler serves `GET /runtime/rule/list`, `/runtime/rule/bundled` and `GET /runtime/rule` with upstream's payloads and `X-Sw-*` headers from `META-INF/rule-source/`, the raw MAL/LAL files the precompiler exports at build time, so the Horizon UI's DSL catalog, editor and live-debug pickers list and open every bundled rule (always `BUNDLED`).
- **Runtime rule hot-update stays unsupported**: `POST /runtime/rule/addOrUpdate|inactivate|delete`, `/runtime/rule/dump`, `/runtime/mal/*` and `/runtime/lal/*` answer a structured HTTP 501 — they generate bytecode at runtime, which a closed-world native image cannot do.

### GraalVM Native Image Compatibility

- Config loading: `YamlConfigLoaderUtils` and `ConfigInitializerGenerator` emit a no-op dispatch branch for empty `ModuleConfig` types (`InspectModuleConfig`, `UIManagementModuleConfig`); `DSLDebuggingModuleConfig` and the BanyanDB `TracePipeline` / `SamplerPluginConfig` nested configs are generated.
- Port the upstream runtime-rule DSL overloads and the `DslSourceRef` signatures into the same-FQCN replacements: meter `DSL.parse(..., ClassPool, ClassLoader)`, `FilterExpression(..., ClassPool, ClassLoader)`, log `DSL.of(..., ClassPool, ClassLoader)`; `LALConfigs` gains upstream's `LAL_CATALOG` / `stampSource`; `HierarchyDefinitionService` loads rules by name from a `ruleName=FQCN` manifest.
- The precompiler and the MAL comparison tests compose expressions via the real upstream `MetricConvert.formatExp` (ANTLR `injectExpPrefix`) instead of a hand-rolled replica, fixing pre-compiled class lookup for chained expressions (`.sum` / `.rate` / `.downsampling`).
- Register protobuf descriptor **editions** classes (`com.google.protobuf.DescriptorProtos$*`, incl. `FeatureSet`) and **protoc-gen-validate** classes (`io.envoyproxy.pgv.validate.Validate$*`) for native-image reflection. protobuf-java 4.33 (pulled by the sync) reflects on these when parsing the BanyanDB measure descriptors; without the metadata, BanyanDB metrics queries failed at runtime with `Generated message class ... missing method`.
- Register the distro-only Armeria handlers (`UnsupportedAdminFeatureHandler`, `BundledRuleCatalogHandler`) for native-image reflection in `reachability-metadata.json`. Armeria builds its annotated routes by reflection, and these classes are not on the build-time precompiler's classpath, so without the entries their routes were never registered.
- Register the whole protobuf descriptor closure of the LAL input types (Envoy `HTTPAccessLogEntry` / `TCPAccessLogEntry`: 52 message, Builder and enum classes down to `Struct` / `Any` / `Timestamp`) with method access. Upstream JSON-prints these entries through protobuf's `JsonFormat`, both for the `EnvoyAccessLog` content of the `envoy-als` rules and for the DSL debug captures; its accessor table looks the generated getters up by reflection, so in the native image the content and the captures degraded to `jsonformat-failed` (`Generated message class ... missing method getCommonProperties`). The precompiler walks the descriptors at build time, and `LalInputTypeReflectionTest` guards the closure.
- Keep `FilterExpression#getLiteral()` in the same-FQCN MAL replacements: the upstream `Analyzer` reads it from the filter probe that only runs with a debug session attached, so a session on a filtered rule file (e.g. `otel-rules/oap.yaml`) killed ingestion with `NoSuchMethodError`. `FilteredRuleDebugCaptureTest` runs the upstream pipeline over the pre-compiled classes with a recorder attached.

### Documentation

- Document the admin-server family, the status relocation, the read-only rule catalogs, the live debugger and the unsupported hot-update (HTTP 501) in `distro-policy.md`, `supported-features.md` and `configuration.md` (which also gains the `admin-server` / `status` / `inspect` / `ui-management` / `dsl-debugging` sections and the REST TLS options); add the `0.4.0` → `11.0.0` row to `version-mapping.md`; refresh the build-time counts and the manifest table in `docs/internals/dsl-immigration.md`.

### Testing

- MAL comparison harness: run the fresh and pre-compiled paths back to back with a `CounterWindow` reset (upstream now keys counter windows by sample name, so both paths shared one window), and let auto-discovery feed `tagEqual` values, histogram buckets and the labels closures reference — the reworked BanyanDB rules and the new rule files are covered in auto-discovery mode.
- Add MAL comparison tests for the Airflow, BanyanDB endpoint / instance-relation, Node.js runtime, PHP runtime and mini-program log-MAL rules, LAL pre-compilation tests for the iOS MetricKit and mini-program rules, and `BundledRuleCatalogHandlerTest`; LAL tests look pre-compiled classes up by source coordinates; track every new YAML in the precompiled-YAML staleness baseline.

### E2E Tests

- Bump pinned dependency images for the 11.0.0 sync: BanyanDB `3b83e18f` (0.11 API), `skywalking-cli` `85e5afdb`, e2e java-test-service `95a296e2`, Kubernetes `da0e267`.
- Bump `skywalking-infra-e2e` to upstream's pin (`0d917694`) — the synced e2e expected-output templates use the `containsOnce` verify function, which the prior pin predated.
- Remove the `menu` e2e case (CI matrix + wrapper): upstream dropped the bundled UI in 11.0.0 (#13877), deleting `test/e2e-v2/cases/menu/`, so the distro wrapper referenced a non-existent reuse file.
- Add the `dsl-management` e2e case, driven by both raw curl and the official `swctl admin` command tree (upstream #13889): the read-only rule and OAL catalogs return upstream's payloads, and every runtime-rule mutation degrades to the structured HTTP 501 (`feature_not_available_in_graalvm_native`) rather than a crash or a confusing 404. Add the `dsl-debugging` e2e case: `/dsl-debugging/status` reports injection on, and session start / get / stop cycles run on a bundled MAL rule and a bundled LAL rule.
- Add the `dsl-debugging-oal` e2e case: upstream's OAL live-debug flow (`test/e2e-v2/cases/dsl-debugging/oal`) runs unchanged against the native image and captures real `service_relation_server_cpm` samples.
- Keep debug sessions active on the hot path in two existing cases: `so11y` attaches a MAL session to `otel-rules/oap.yaml` (file-level filter) before its metric checks and asserts the filter captures; `istio-als` enables the `persistence` ALS analysis and attaches a LAL session to `lal/envoy-als`, asserting every captured `HTTPAccessLogEntry` is rendered (no `jsonformat-failed`).
- Add the `airflow` (upstream Airflow mock: a replay sender feeds recorded OTLP metrics into the `airflow/*` rules) and `banyandb-so11y` (upstream SWIP-15 case: liaison + hot data node scraped by an OTel collector) e2e cases, both referencing the upstream case files by relative path so their expectations track upstream.
