---
title: Release Apache SkyWalking BanyanDB Helm 0.7.0
date: 2026-09-08
author: SkyWalking Team
---

SkyWalking BanyanDB Helm 0.7.0 is released. Go to [downloads](/downloads) page to find release tars.

#### Features

- Add optional canopy web console deployment (`canopy.*`): Deployment + Service + optional Ingress for standalone and cluster modes, with a generated default admin user (strong random password, stable across upgrades; retrievable from the install notes or the `<release>-canopy-auth` Secret). The BanyanDB HTTP services now also expose the observability port 2121 so the console's monitoring target works in both modes.
- Remove etcd support (breaking change). If upgrading, remove `etcd-client.*` and `cluster.*.tls.etcdSecretName` from your values overrides.
- Disable the lifecycle metrics collector when the lifecycle sidecar container is disabled.
- Enable FODC panic/crash diagnostics collection by default. Configure via `cluster.fodc.agent.config.crashCollection.{enabled,dir,maxArtifacts,diagnosisMemoryPercent}`.
- Add FODC memory-pressure pprof capture for data and liaison nodes. Configure via `cluster.fodc.agent.pressureProfiler.*`.
- Add trace-pipeline sampler plugin support for data nodes (`plugins.*`): deploy the plugin host/carrier images, mount trusted and third-party plugin directories, and validate the plugin configuration at install time.
- Validate generated resource names (StatefulSets, Services, Secrets, Deployments) at install/upgrade time to avoid exceeding Kubernetes' 63-byte label limit, failing fast with a clear error instead of at apply time.
