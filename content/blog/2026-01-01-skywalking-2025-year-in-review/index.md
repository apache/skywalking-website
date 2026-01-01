---
title: "Apache SkyWalking 2025 in Review: Making BanyanDB Ready for Production"
date: 2026-01-01
author: SkyWalking Team
description: "A review of Apache SkyWalking community work in 2025, with a focus on BanyanDB becoming the production-grade native storage for SkyWalking."
tags:
- Community
- Year in Review
- BanyanDB
- Storage
- Release Blog
---

2025 was a very focused year for the Apache SkyWalking community: **moving BanyanDB from “native storage” to a “production-ready default”**, and making SkyWalking APM fully benefit from that foundation.

This post summarizes the key milestones, with an emphasis on BanyanDB.

## Storage strategy: saying goodbye to H2

We started 2025 with a clear direction: the **H2 storage option is permanently removed**.
This change reduced long-term maintenance burden and removed a storage choice that was not aligned with production and cloud-native deployments.

## BanyanDB: from 0.8.0 foundations to 0.9.0 production features

**BanyanDB 0.8.0** delivered the “day-2 operations” foundation that a default storage backend needs. The community put a lot of effort into making queries faster and more predictable (for example `index_mode`, numeric index types, and multiple query-path optimizations), while also making the system safer under real production pressure. Disk-usage thresholds and a query **memory protector** were added as guardrails, and the operational toolbox matured with snapshot/backup/restore utilities and improved metadata synchronization.

Just as importantly, 0.8.0 started filling in the missing pieces of a full platform: native property storage and lifecycle-related capabilities that later enabled stronger HA and stage-based deployment patterns.

**BanyanDB 0.9.0** was the “production features” milestone. It introduced the **Trace** data model as a first-class citizen, which unlocked much deeper trace storage and query capabilities. On the reliability and scaling side, the release brought configurable replicas, liaison-side improvements (including load balancing and moving some TopN flow), and broader correctness work such as migrations, version compatibility checks, and access logs.

It also made long-term operations more cloud-friendly with backup/restore support for AWS S3, GCS, and Azure Blob Storage, and added authentication primitives needed in shared environments. In short, 0.9.0 is where BanyanDB clearly moved beyond a “fast storage engine” into a “production platform”.

## SkyWalking APM: BanyanDB becomes the default path

With **APM 10.2.0**, the project made the strategic shift official: H2 was removed permanently, and BanyanDB 0.8.0 became the default path that SkyWalking invests in. A lot of the work here was not flashy, but essential — refining OAP behavior (group settings, index model changes, Progressive TTL, query limits, and more) so running BanyanDB in production felt stable and predictable.

With **APM 10.3.0**, SkyWalking and BanyanDB moved forward together: BanyanDB 0.9.0’s new trace model was adopted end-to-end, reducing inefficient query round-trips and enabling new query views that significantly lowered page latency. The integration also expanded into lifecycle-aware operations with hot/warm/cold stage configuration (including TTL and query support), and added BanyanDB **self-monitoring** through OAP and the UI — the kind of end-to-end polish that turns a storage backend into a truly native solution.

If you’d like this review to cover **APM 10.4.x** as well, please point me to the corresponding release content in this repo (I didn’t find an APM 10.4.0 release announcement in the current checkout).

## Packaging and deployment ecosystem (Helm)

BanyanDB’s production readiness is not only server features — it also depends on deployment maturity.

- Helm charts:
  - SkyWalking Kubernetes Helm Chart 4.8.0 improved BanyanDB deployment defaults by updating the bundled BanyanDB Helm dependency, fixing an init-job volume-mount mismatch, and aligning OAP/UI images with the APM 10.3.0 line.
  - BanyanDB Helm 0.4.0 added backup/restore sidecars and a default volume for property storage.
  - BanyanDB Helm 0.5.0 introduced stage-aware patterns (hot/warm/cold), improved lifecycle-sidecar scheduling, moved liaison to StatefulSet, refined internal networking, and expanded configuration options.
  - BanyanDB Helm 0.5.1 refined liaison configuration and fixed restore-init environment issues.
  - BanyanDB Helm 0.5.3 fixed a liaison/data-node port issue.

## The rest of the community: agents and tooling kept moving

While storage was the “main storyline”, the community shipped releases across agents, clients, and surrounding components throughout 2025.

Below is a consolidated view of the other releases, grouped by project, with the most important notes.

- **SkyWalking Java Agent**
  - **9.4.0**: agent self-observability; async-profiler support; broader plugin improvements.
  - **9.5.0**: virtual thread executor plugin; compatibility and stability fixes; dependency upgrades.

- **SkyWalking Go**
  - **0.6.0**: richer manual APIs (events/logs/metrics, set span error); goframev2 plugin; bug fixes including Redis cluster mode.

- **SkyWalking for NodeJS**
  - **0.8.0**: Express 4/5 compatibility, keep-alive HTTP trace fix, and test/dependency maintenance.

- **SkyWalking Python**
  - **1.2.0**: sampling service, `sw_grpc` plugin, async/profiling stability fixes, Python 3.13 support, and dropping Python 3.7.

- **SkyWalking PHP**
  - **1.0.0**: reach 1.0; add PSR-3 log reporting; upgrade toolchain/dependencies.

- **SkyWalking Rust**
  - **0.9.0**: migrate to Rust edition 2024 and upgrade dependencies.
  - **0.10.0**: Kafka client configuration refactor, `rdkafka` upgrade, CI maintenance.

- **SkyWalking Ruby**
  - **0.1.0**: initialize agent core and e2e tests; add plugins for Sinatra, redis-rb, net-http, memcached, and Elasticsearch.

- **SkyWalking Client JS**
  - **1.0.0**: add Core Web Vitals and static resource metrics; fix fetch/resource error handling; dependency and e2e/test improvements.

- **SkyWalking Satellite**
  - **1.3.0**: support native eBPF Access Log protocol and async-profiler protocol; upgrade Go toolchain.

- **SkyWalking Eyes**
  - **0.7.0**: improve installation/docs, respect gitignore behavior, upgrade Go, and simplify release steps.
  - **0.8.0**: add Elixir support and stronger dependency-license scanning (notably Ruby via Gemfile.lock), plus stability fixes.

## Looking ahead: possible directions in 2026

2025 was about making BanyanDB ready for production. In 2026, the community is exploring the next set of improvements that could make the whole stack simpler to operate, more stable under stress, and easier to integrate into broader observability ecosystems.

Possible areas include:

- **BanyanDB: remove the etcd dependency**: the direction under discussion is to move away from etcd (given ecosystem activity and maintenance concerns) and rely more on DNS-based discovery plus BanyanDB’s native property capabilities.
- **BanyanDB: stronger stability testing**: more systematic testing, including chaos testing, to validate behavior under failures and noisy conditions.
- **BanyanDB: better observability export**: introducing First Occurrence Data Collection (FODC) as a sidecar and proxy server to provide a unified stream of observability data to third-party systems.
- **SkyWalking APM: broader runtime and query capabilities**: cold-stage data query support, a newer Java runtime (Java 25), and consideration of TraceQL protocol (Temper) support.

## Closing

Thanks to everyone who contributed to SkyWalking in 2025. Every contribution is high-value — code, documentation, reviews, testing, issue triage, and operational experience — and each of them helped move the project forward.

We also want to say a special thank you to the countless end users across global companies. Many of the most valuable improvements don’t start from a pull request: they start from real-world use cases, performance investigations, production feedback, bug reports, and the patience to help us reproduce and validate fixes.

As another milestone, SkyWalking reached **968 GitHub contributors** globally, and we expect the **1000th** contributor milestone to arrive soon in 2026. But the community is much larger than the number suggests, and SkyWalking’s progress has always been driven by collaboration between contributors, adopters, and maintainers.

Apache SkyWalking was originally created by Sheng Wu as a personal project in May 2015. It would never have grown into what it is today without the whole community — and it will keep moving forward because of the community.