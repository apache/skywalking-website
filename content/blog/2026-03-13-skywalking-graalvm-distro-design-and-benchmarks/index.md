---
title: "SkyWalking GraalVM Distro: Design and Benchmarks"
date: 2026-03-13
author: Sheng Wu
description: "A technical deep-dive into SkyWalking GraalVM Distro — how we turned a mature, reflection-heavy Java observability backend into a native binary with a repeatable migration pipeline."
tags:
- GraalVM
- Native Image
- Performance
- Cloud Native
- Serverless
- BanyanDB
---

*A technical deep-dive into how we migrated Apache SkyWalking OAP to GraalVM Native Image — not as a one-off port, but as a repeatable pipeline that stays aligned with upstream.*

For the broader story of how AI engineering made this project economically viable, see [How AI Changed the Economics of Architecture](/blog/2026-03-13-how-ai-changed-the-economics-of-architecture/).

## Why GraalVM Is Not Optional

GraalVM Native Image compiles Java applications Ahead-of-Time (AOT) into standalone executables. For an observability backend like SkyWalking OAP, this is not a performance optimization — it is an operational necessity.

An observability platform must be the most reliable component in the infrastructure. It has to survive the failures it is supposed to observe. In cloud-native environments where workloads scale, migrate, and restart constantly, the backend that watches everything cannot itself be the slow, heavy process that takes seconds to recover and gigabytes to idle.

Our benchmarks make the case concrete:

- **Startup:** ~5 ms vs ~635 ms. In a Kubernetes cluster where an OAP pod gets evicted or rescheduled, a 635 ms gap means lost telemetry — traces, metrics, and logs that arrive during that window are simply dropped. At 5 ms, the new pod is receiving data before most clients even notice the disruption.
- **Idle memory:** ~41 MiB vs ~1.2 GiB. Observability backends run 24/7. In a multi-tenant or edge deployment, a 97% reduction in baseline RSS is the difference between fitting the observability stack on a small node and needing a dedicated one.
- **Memory under load:** ~629 MiB vs ~2.0 GiB at 20 RPS. A 70% reduction at production-like traffic means fewer nodes, lower cloud bills, and more headroom before the backend itself becomes a scaling bottleneck.
- **No warm-up penalty:** Peak throughput is available from the first request. The JVM's JIT compiler needs minutes of traffic before it optimizes hot paths — during that window, tail latency is worse and data processing lags behind. A native binary has no such phase.
- **Smaller attack surface:** No JDK runtime means fewer CVEs to track and patch. For a component that ingests data from every service in the cluster, that matters.

These are not incremental improvements. They change what deployment topologies are practical. Serverless observability backends, sidecar-model collectors, edge nodes with tight memory budgets — all become realistic when the backend is this light and this fast.

## The Challenge: A Mature, Dynamic Java Platform

SkyWalking OAP carries all the realities of a large Java platform: runtime bytecode generation, reflection-heavy initialization, classpath scanning, SPI-based module wiring, and dynamic DSL execution. These patterns are friendly to extensibility but hostile to GraalVM native image.

The documented GraalVM limitations are only the beginning. In a mature OSS platform, those limitations are deeply entangled with years of runtime design decisions. Standard GraalVM native images struggle with runtime class generation, reflection, dynamic discovery, and script execution — all of which had deep roots in SkyWalking OAP.

There was also a very concrete mountain in the early history of this distro. Upstream SkyWalking relied heavily on Groovy for LAL, MAL, and Hierarchy scripts. In theory, that was just one more unsupported runtime-heavy component. In practice, Groovy was the biggest obstacle in the whole path. It represented not only script execution, but a whole dynamic model that was deeply convenient on the JVM side and deeply unfriendly to native image.

## The Design Goal: Make Migration Repeatable

The final design is not just "run native-image successfully." It is a system that keeps migration work repeatable:

1. **Pre-compile runtime-generated assets at build time.** OAL, MAL, LAL, Hierarchy rules, and meter-related generated classes are compiled during the build and packaged as artifacts instead of being generated at startup.
2. **Replace dynamic discovery with deterministic loading.** Classpath scanning and runtime registration paths are converted into manifest-driven loading.
3. **Reduce runtime reflection and generate native metadata from the build.** Reflection configuration is produced from actual manifests and scanned classes instead of being maintained as a hand-written guess list.
4. **Keep the upstream sync boundary explicit.** Same-FQCN replacements are intentionally packaged, inventoried, and guarded with staleness checks.
5. **Make drift visible immediately.** If upstream providers, rule files, or replaced source files change, tests fail and force explicit review.

That is the architectural shift that matters most. Reusable abstraction and foresight did not become less important in the AI era. They became more important, because they determine whether AI speed produces a maintainable system or just a fast-growing pile of code.

## Turning Runtime Dynamism into Build-Time Assets

SkyWalking OAP has several dynamic subsystems that are natural in a JVM world but problematic for native image:

- OAL generates classes at runtime.
- LAL, MAL, and Hierarchy were historically tied to Groovy-heavy runtime behavior, which became one of the biggest practical blockers in the early distro work.
- MAL, LAL, and Hierarchy rules depend on runtime compilation behavior.
- Guava-based classpath scanning discovers annotations, dispatchers, decorators, and meter functions.
- SPI-based module/provider discovery expects a more dynamic runtime environment.
- YAML/config initialization and framework integrations depend on reflective access.

In SkyWalking GraalVM Distro, these are not solved one by one as isolated patches. They are pulled into a build-time pipeline.

The precompiler runs the DSL engines during the build, exports generated classes, writes manifests, serializes config data, and generates native-image metadata. That means startup becomes class loading and registration, not runtime code generation. The runtime path is simpler because the build path became richer.

This is also why the project is more than a performance exercise. The design goal was to move complexity into a place where it is easier to verify, easier to automate, and easier to repeat.

## Same-FQCN Replacements as a Controlled Boundary

One of the most practical design choices in this distro is the use of same-FQCN replacement classes. We do not rely on vague startup tricks or undocumented ordering assumptions. Instead, the GraalVM-specific jars are repackaged so the original upstream classes are excluded and the replacement classes occupy the exact same fully-qualified names.

This matters for maintainability. It creates a very clear boundary:

- the upstream class still defines the behavior contract,
- the GraalVM replacement provides a compatible implementation strategy,
- and the packaging makes that swap explicit.

For example, OAL loading changes from runtime compilation into manifest-driven loading of precompiled classes. Similar replacements handle MAL and LAL DSL loading, module wiring, config initialization, and several reflection-sensitive paths. The goal is not to fork everything. The goal is to replace only the places where the runtime model is fundamentally unfriendly to native image.

That boundary is then guarded by tests that hash the upstream source files corresponding to the replacements. When upstream changes one of those files, the build fails and tells us exactly which replacement needs review. This is what turns "keeping up with upstream" from an anxiety problem into a visible engineering task.

## Reflection Config Is Generated, Not Guessed

In many GraalVM migrations, `reflect-config.json` becomes a manually accumulated artifact. It grows over time, gets stale, and nobody is fully sure whether it is complete or why each entry exists. That approach does not scale well for a large, evolving OSS platform.

In this distro, reflection metadata is generated from the build outputs and scanned classes:

- manifests for OAL, MAL, LAL, Hierarchy, and meter-generated classes,
- annotation-scanned classes,
- Armeria HTTP handlers,
- GraphQL resolvers and schema-mapped types,
- and accepted `ModuleConfig` classes.

This is a much healthier model. Instead of asking people to remember every reflective access path, the system derives reflection metadata from the actual migration pipeline. The build becomes the source of truth.

## Keeping Upstream Sync Practical

If this distro were only a one-time engineering sprint, it would be much less interesting. The real challenge is keeping it alive while upstream SkyWalking continues to evolve.

That is why the repo includes explicit inventories and drift detectors:

- provider inventories that force new upstream providers to be categorized,
- rule-file inventories that force new DSL inputs to be acknowledged,
- SHA watchers for precompiled YAML inputs,
- and SHA watchers for upstream source files with GraalVM-specific replacements.

Good abstraction is not only about elegant code structure. It is about choosing a migration design that can survive contact with future change.

## Benchmark Results

We benchmarked the standard JVM OAP against the GraalVM Distro on an Apple M3 Max (macOS, Docker Desktop, 10 CPUs / 62.7 GB), both connecting to BanyanDB.

### Boot Test (Docker Compose, no traffic, median of 3 runs)

| Metric | JVM OAP | GraalVM OAP | Delta |
|--------|---------|-------------|-------|
| Cold boot startup | 635 ms | 5 ms | ~127x faster |
| Warm boot startup | 630 ms | 5 ms | ~126x faster |
| Idle RSS | ~1.2 GiB | ~41 MiB | ~97% reduction |

Boot time is measured from OAP's first application log timestamp to the `listening on 11800` log line (gRPC server ready).

### Under Sustained Load (Kind + Istio 1.25.2 + Bookinfo at ~20 RPS, 2 OAP replicas)

30 samples at 10s intervals after 60s warmup.

| Metric | JVM OAP | GraalVM OAP | Delta |
|--------|---------|-------------|-------|
| CPU median (millicores) | 101 | 68 | -33% |
| CPU avg (millicores) | 107 | 67 | -37% |
| Memory median (MiB) | 2068 | 629 | **-70%** |
| Memory avg (MiB) | 2082 | 624 | **-70%** |

Both variants reported identical entry-service CPM, confirming equivalent traffic processing capability.

Service metrics collected every 30s via swctl for all discovered services:
`service_cpm`, `service_resp_time`, `service_sla`, `service_apdex`, `service_percentile`.

Full benchmark scripts and raw data are in the [benchmark/](https://github.com/apache/skywalking-graalvm-distro/tree/main/benchmark) directory of the distro repository.

## Current Status

The project is a runnable experimental distribution, hosted in its own repository: [apache/skywalking-graalvm-distro](https://github.com/apache/skywalking-graalvm-distro).

The current distro intentionally focuses on a modern, high-performance operating model:

- **Storage:** BanyanDB
- **Cluster modes:** Standalone and Kubernetes
- **Configuration:** none or Kubernetes ConfigMap
- **Runtime model:** fixed module set, precompiled assets, and AOT-friendly wiring

This focus is deliberate. A repeatable migration system starts by making a clear scope runnable, then expanding without losing control.

## Getting Started

Because the SkyWalking GraalVM Distro is designed for peak performance, it is optimized to work with **BanyanDB** as its storage backend. The current published image is available on Docker Hub, and you can boot the stack using the following `docker-compose.yml`.

```yaml
version: '3.8'

services:
  banyandb:
    image: ghcr.io/apache/skywalking-banyandb:e1ba421bd624727760c7a69c84c6fe55878fb526
    container_name: banyandb
    restart: always
    ports:
      - "17912:17912"
      - "17913:17913"
    command: standalone --stream-root-path /tmp/stream-data --measure-root-path /tmp/measure-data --measure-metadata-cache-wait-duration 1m --stream-metadata-cache-wait-duration 1m
    healthcheck:
      test: ["CMD", "sh", "-c", "nc -nz 127.0.0.1 17912"]
      interval: 5s
      timeout: 10s
      retries: 120

  oap:
    image: apache/skywalking-graalvm-distro:0.1.1
    container_name: oap
    depends_on:
      banyandb:
        condition: service_healthy
    restart: always
    ports:
      - "11800:11800"
      - "12800:12800"
    environment:
      SW_STORAGE: banyandb
      SW_STORAGE_BANYANDB_TARGETS: banyandb:17912
      SW_HEALTH_CHECKER: default
    healthcheck:
      test: ["CMD-SHELL", "nc -nz 127.0.0.1 11800 || exit 1"]
      interval: 5s
      timeout: 10s
      retries: 120

  ui:
    image: ghcr.io/apache/skywalking/ui:10.3.0
    container_name: ui
    depends_on:
      oap:
        condition: service_healthy
    restart: always
    ports:
      - "8080:8080"
    environment:
      SW_OAP_ADDRESS: http://oap:12800
```

Simply run:
```bash
docker compose up -d
```

We invite the community to test this new distribution, report issues, and help us move it toward a production-ready state.

*Special thanks to the GraalVM team for the technology foundation.*
