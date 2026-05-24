---
title: Release Apache SkyWalking Horizon UI 0.5.0
date: 2026-05-24
author: SkyWalking Team
description: "Release Apache SkyWalking Horizon UI 0.5.0."
---

SkyWalking Horizon UI 0.5.0 is released. Go to [downloads](/downloads) page to find release tars.

First Apache-style release cut from this repo: source + binary tarballs, GPG-signed and SHA-512 checksummed, with a self-contained binary that boots via `node server.js` and no `pnpm install` step. Binary distribution ships a regenerated `LICENSE` + `NOTICE` that enumerate every bundled third-party package — produced by `scripts/collect-dist-licenses.mjs` during packaging and validated against a deny-list before signing.

##### Profiling

* **pprof (Go) profiling** is fully wired: pick one event per task (CPU / HEAP / BLOCK / MUTEX / GOROUTINE / ALLOCS / THREADCREATE), with duration shown for CPU/BLOCK/MUTEX and a sampling-rate field for BLOCK/MUTEX. Create and analyze both match OAP's single-event pprof schema.
* **eBPF profiling** gets a reworked process picker — click a row to expand its full attributes, selection lives on the checkbox, anchored pop-out — a refresh button on every task list, Intl-formatted times, and a hover-info frame on the flame graph. Flame-graph thrash on re-analyze is gone.
* The shared flame graph fixes "% of root" (it read a never-aggregated count), highlights the selected frame across all four profilers, and shows a single hover card (the library's duplicate native tooltip is suppressed).
* After creating any profiling task (trace / async / eBPF / network / pprof) the list now polls up to 4× at 10s until the new task shows up, instead of leaving a stale pre-create list.

##### Network profiling & process topology

* A booster-style honeycomb process topology: pods as hexagons, peers hugging the boundary, animated protocol-coloured edges (HTTP/TCP/TLS), a node pop-over, and a wide client | server edge-metric dashboard. Network task creation and the task-list query now use OAP's schema field names.

##### Platform monitoring (operate)

* Two new read-only operate pages: **Data retention** (TTL — `getRecordsTTL` / `getMetricsTTL`) and **OAP configuration** (the admin-port config dump, with OAP-masked secrets). Gated on new `ttl:read` / `config:read` verbs granted to maintainer and above. Data retention now loads on non-BanyanDB backends too (the `metadata` TTL field is optional).
* The operate sidebar now leads with a single **Platform monitoring** group (cluster status, data retention, OAP configuration) above the per-layer self-observability dashboards.

##### Dashboards & templates

* **The global time picker now drives dashboards.** Layer dashboards query OAP at the picker's window and precision (MINUTE / HOUR / DAY) instead of a fixed last-hour minute window, and line charts label the x-axis with real times per step (e.g. `MM-DD` for a 30-day view) rather than `-Nm`.
* **New `table` widget** for label-dimensioned metrics — pod phase per service, node condition, deployment replicas, etc. — rendered as one column per label (e.g. `Condition | Node`) instead of a scalar card or a misleading flat line. The K8S dashboards (and kong / mongodb / elasticsearch) now use it where upstream booster-ui does; widgets that were charting a single `latest(…)` value as a line are now cards. The K8S Cluster view is realigned to the upstream layout (totals cards · resource lines · status tables).
* **Edit locally, publish on your terms.** Saving a dashboard/overview template now writes the local bundled copy (so the edit renders immediately for preview) and marks it diverged — nothing reaches OAP until you press **Sync all to OAP**, which pushes only the templates that differ, behind a confirmation listing exactly what will be written. A post-save tip spells out that the change is local-only until published.
* **Local-vs-remote, made explicit.** When local edits diverge from OAP, a per-session prompt (by menu name, not file name) asks which to render — **keep my local edits** (preview) or **use live** (which overwrites the local copy with the remote version, confirmed). The layer-templates admin page carries the same Local/Remote display toggle next to Sync all, and a **Diverged only** filter; each diverged layer shows a yellow warning icon in the sidebar.

##### Traces

* The native trace view auto-selects OAP's trace-query API — `queryTraces` (whole trace inline, BanyanDB) vs `queryBasicTraces` (segment list + a per-trace fetch on click, every other backend) — and a banner states which is in use; in segment-list mode the list reads "Segments" and a click loads the full trace.
* Span kind (Entry / Exit / Local) renders as a colored word, not a filled pill.

##### Auth, RBAC & resilience

* Every OAP call — GraphQL, admin REST, and Zipkin — now carries the configured basic-auth credentials, so a secured OAP no longer 401s pages.
* The sidebar is RBAC-gated by read verb, the Roles page shows a per-role menu-visibility matrix, and the Users page labels per-node "Active (24h)" / "Last seen" honestly (these are tracked per BFF replica, not cluster-wide).
* **Routes are verb-gated, not just menus.** A user without the required read verb is bounced from a restricted page (e.g. a viewer can no longer reach Cluster Status via the topbar OAP chip or a direct URL); the chip only links there for `cluster:read`. This sits on top of the existing per-route BFF verb enforcement.
* **LDAP** resolves group membership with the service account, not the logging-in user — directories that hide the group subtree from ordinary users no longer collapse every login to the fallback role.
* When OAP is unreachable the menu and admin loaders fall back to bundled templates, and non-JSON OAP responses surface a clear diagnostic.

##### Smaller touches

* Top-N widgets get hover tooltips for long names and a title-bar pop-out to the full ranked list; redundant single-service name prefixes are dropped.
* The admin template-diff modal is a wide side-by-side view with labelled bundled-vs-OAP columns and an explanation of what the template drives; the layer-dashboards admin rail gains an in-page search.
* Per-layer alarm filtering uses the singular `queryAlarms` layer condition.
* The `general` layer drops `networkProfiling`, which is instance-scoped to k8s / mesh.

Full release notes are [here](https://github.com/apache/skywalking-horizon-ui/releases/tag/v0.5.0).
