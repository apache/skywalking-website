---
title: Release Apache SkyWalking Cloud on Kubernetes 0.11.0
date: 2026-09-01
author: SkyWalking Team
description: "Release Apache SkyWalking Cloud on Kubernetes 0.11.0"
---

SkyWalking Cloud on Kubernetes 0.11.0 is released. Go to [downloads](/downloads) page to find release tars.

0.11.0
------------------

### Features

- Release the `skywalking-swck` Helm chart from this repository. One chart installs the operator and, behind a values flag, the custom metrics adapter. The CRDs, the operator's ClusterRole and the admission webhook configurations it ships are generated from the operator sources by `make chart-manifests`, and CI fails on any drift.
- Wire BanyanDB storage. A `Storage` of `type: banyandb` now yields `SW_STORAGE=banyandb` and `SW_STORAGE_BANYANDB_TARGETS`. Previously the operator could only configure Elasticsearch, so an `OAPServer` on BanyanDB had to carry the storage environment by hand — and the variable it needed changed name between SkyWalking 9.x and 11.x. Without this SWCK cannot deploy a working OAP at all across the supported range, since SkyWalking removed H2 permanently in 10.2.0.
- Wire BanyanDB TLS. `security.tls` with `security.tlsSecretName` mounts the CA at `/skywalking/bydb-tls` and sets `SW_STORAGE_BANYANDB_SSL_TRUST_CA_PATH`. Previously `tls: true` on a `banyandb` `Storage` was accepted, wired no TLS, and mounted the Elasticsearch keystore secret, leaving the OAP pod waiting on a secret nothing creates.
- Pass BanyanDB credentials from a `Storage`'s `security.user.secretName`, as the Elasticsearch path already did.
- Configure the Horizon UI with environment variables instead of a generated file. `UI.spec.env` and `UI.spec.envFrom` now carry them, the operator sets only what it derives, and the ConfigMap is mounted only when `spec.config` supplies a whole file — so a setting added in a future Horizon release works without an SWCK release.
- Add `UI.spec.templatesMode`, emitted as `HORIZON_TEMPLATES_MODE`. Left unset it follows the admin address: `live` reads OAP's template store over the OAP admin host, so it is chosen only when `spec.OAPServerAdminAddress` is set, and `readonly` — which renders the templates bundled in the image — otherwise.
- Add `envFrom` to `OAPServer` and `Satellite`, which are configured entirely through environment variables and previously had no way to take one from a Secret.
- Reference storage credentials instead of copying them. The operator used to read the `Storage`'s user secret and write the username and password in as literal env values, so they appeared in both the `OAPServer` and its Deployment for anyone with read access. They are now `secretKeyRef`s resolved by the kubelet.
- Support OAP 10.4.0 and later, with 11.0.0 recommended, matching `skywalking-helm`. An `OAPServer` below that is admitted with a warning rather than rejected.
- Ship the Helm chart tarball as a signed, voted artifact on dist.apache.org, alongside the source and binary tarballs.

### Breaking changes

- **Only the Horizon UI is deployed.** `spec.kind` on the `UI` resource now accepts `horizon` alone — `apache/skywalking` removed the legacy Booster UI in 11.0.0 and no longer builds an image for it. A `UI` with `kind: booster` is rejected, with a message saying what to use instead.
- **An `OAPServer` with no storage is refused.** SkyWalking removed the embedded H2 permanently in 10.2.0, so there is nothing to fall back to: an `OAPServer` with nowhere to write starts, dials a BanyanDB on `127.0.0.1:17912` and never becomes ready. The webhook now says so at admission. Setting `SW_STORAGE` directly in `spec.config` still counts as having chosen a storage.
- **`OAPServerConfig` and `OAPServerDynamicConfig` default to version `11.0.0`**, was `9.5.0`. These match an `OAPServer` by exact version string, so a config that omits `version` previously only attached to an OAP explicitly pinned at 9.5.0. Set `spec.version` explicitly if you run an older OAP.

### Bugs

- Stop reconciling a `UI` whose `kind` is no longer supported. Narrowing the CRD enum to `horizon` only rejects new resources — schema validation runs on admission, never on read — so a `UI` stored as `kind: booster` by an earlier operator survives the upgrade and still reconciles. With the templates now unconditionally Horizon's, reconciling one rewrote a running Booster Deployment into a shape its image cannot serve and took the UI down on the first pass after upgrade. Such a resource is now left untouched, with an `UnsupportedKind` event saying what to do.
- Stop applying an `OAPServer` Deployment when the `Storage` it names cannot be read. Every lookup error was logged and ignored, and the Deployment applied anyway — without `SW_STORAGE`, targets, credentials or TLS volumes — so a `Storage` briefly deleted and recreated replaced a working OAP with one that never becomes ready. The reconcile now leaves the running Deployment alone, emits a `StorageUnresolved` event and requeues.
- Keep the storage TLS volume when an `OAPServerConfig` mounts static files. The overlay assigned over the pod's volume and mount lists, and `ApplyOverlay` is an RFC 7386 merge patch under which an array replaces rather than merges — so the certificate volume disappeared and `SW_STORAGE_BANYANDB_SSL_TRUST_CA_PATH` pointed at nothing.
- Roll the OAP when its credential `Secret` is rotated. Environment variables taken from a Secret are resolved once, when the container starts, so a rotation went unnoticed until something restarted the pod. The controller now watches Secrets and carries the referenced Secret's `resourceVersion` in a pod-template annotation.
- Create certificate signing requests through `certificates.k8s.io/v1`. The `v1beta1` API this used was removed in Kubernetes 1.22, so internal Elasticsearch TLS could not obtain a certificate on any cluster newer than that and the workload waited on a Secret nothing produced. The wait loop is also bounded now, and sleeps.
- Fix the default image for `kind: horizon` UIs. It was `apache/skywalking-horizon-ui:<version>`, a Docker Hub repository that does not exist — Horizon releases share `apache/skywalking-ui` with the legacy Booster UI and are told apart by a `horizon-` tag prefix. Since `horizon` is the default kind, every `UI` created without an explicit image could never pull.
- Build genuinely multi-architecture images. The Dockerfiles hardcoded `GOARCH=amd64` while the publish workflow advertised `linux/arm64`, so `apache/skywalking-swck:0.10.0` shipped an arm64 manifest holding x86-64 binaries and an arm64 node got `exec format error`. The release now builds a binary per architecture, and the publish workflow pulls every advertised platform back and checks the ELF machine type before the release completes.
- Raise the OAP startup probe budget from 110 seconds to 10 minutes. SkyWalking 11 has no embedded storage, so every start installs a schema into BanyanDB or Elasticsearch — work that overran the old probe on a cold cluster, and being killed mid-schema turned a slow first boot into a crash loop.
- Stop deriving the Horizon admin and Zipkin URLs. The OAP admin host arrived in 11.x, and on 10.x port 17128 is the AI-pipeline URI-recognition server, so a derived `oap.adminUrl` pointed Horizon at the wrong service; the `OAPServer` this operator deploys exposes no Zipkin port at all. Both are now emitted only when `spec.OAPServerAdminAddress` / `spec.OAPServerZipkinAddress` are set.
- Stop maintaining a copy of Horizon's configuration schema. The generated config restated Horizon's own defaults and had drifted: `viewer` was granted 6 of the 12 permissions Horizon gives that role, and the admin landing route was `/admin/cluster`, which Horizon has no route for. It also carried keys Horizon 1.0.0's schema does not have, whose presence stops the BFF booting at all.
- Stop truncating rendered manifests at the first `#`. Every manifest was cut line-by-line at its first hash with no awareness of YAML quoting, so any value containing one — a password, an AI prompt, a URL fragment — was severed mid-string and the resulting manifest no longer parsed. Only whole-line comments are dropped now.
- Require `SW_STORAGE` to carry a value. The mandatory-storage check accepted an entry named `SW_STORAGE` with nothing behind it, which reaches the OAP as an empty selector and produces exactly the never-ready state the check exists to prevent.
- Render an `OAPServer` whose `Storage` cannot be read yet, rather than reaching through the nil and failing to render at all.
- Reference the Elasticsearch credentials from the `Storage` controller too, which still copied them out of the Secret and into the resource.
- Deep-copy the new `env` and `envFrom` fields; `zz_generated.deepcopy.go` had not been regenerated, so those slices were shared with the objects controller-runtime's cache hands out.
- Ship the `eventexporter` admission webhook in the chart, and drop the duplicate `meventexporter.kb.io` entry that the API server rejects.

### Documentation

- Document BanyanDB storage: the endpoint format and its gRPC port, cluster targets, authentication, persistence, and the flags BanyanDB 0.11 renamed. See `docs/en/setup/banyandb.md`.
- Document that Horizon ships with no users, so a UI refuses every login until one is seeded through `HORIZON_AUTH_LOCAL_USERS`.
- Restructure the documentation into `docs/en/{concepts-and-designs,setup,examples,guides,changes}`, following the layout of `apache/skywalking`, and move the changelog into `docs/en/changes/`.

**Full Changelog**: https://github.com/apache/skywalking-swck/compare/v0.10.0...v0.11.0
