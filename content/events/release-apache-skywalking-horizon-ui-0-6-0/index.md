---
title: Release Apache SkyWalking Horizon UI 0.6.0
date: 2026-06-02
author: SkyWalking Team
description: "Release Apache SkyWalking Horizon UI 0.6.0."
---

SkyWalking Horizon UI 0.6.0 is released. Go to [downloads](/downloads) page to find release tars.

This release is the production-readiness pass for Horizon UI: every page now renders correctly across the eight supported languages on non-UTC OAP deployments, with deliberate caps and validation on the load surfaces operators reach.

##### Eight-locale internationalization

* Eight first-class UI languages — English (source) plus zh-CN, ja, ko, es, pt, de, fr — selectable from the top-bar locale chip on every page (including the pre-auth login), persisted per device. Every routed page and shared sub-component renders through `vue-i18n`; missing leaves fall back to English so partial catalogs degrade invisibly.
* All 42 layer dashboards and both overview dashboards carry per-locale overlay catalogs (~2,300 translatable leaves per non-English locale). The BFF picks the locale from the request's `X-Horizon-Locale` header, merges the overlay onto the source, and serves the localised template — translation resolves once on the BFF, never on every chart mount.
* A new admin surface (Dashboard setup → Translations) edits the per-locale overlays through the live preview: pick a language, click any widget, type the translation. Per-locale status chips show which dashboards have drafts, are synced, diverge from disk, or are empty.
* Product, project and protocol names (SkyWalking, Kubernetes, OAP, MQE, eBPF, Zipkin, OpenTelemetry, Istio, GraphQL…), OAP scope enums, layer keys, MQE function names, env vars, HTTP status codes and runtimes stay verbatim in every locale; OAP-supplied data (service names, alarm rule names, span operations, log messages) is never translated.
* The `i18n:validate` gate is stricter: every source template must have a sibling overlay per advertised locale, and empty `{}` overlays are now a finding.

##### 3D Infrastructure Map

* A standalone bird's-eye view of the deployment at `/3d/map`: services render as cubes on stacked tier-planes (apps · service mesh · middleware · infra), each tier subdivided into per-layer zones. Drag to rotate, scroll to zoom, arrow keys / WASD to pan; click a cube for its detail card and a link into that layer's dashboard.
* Live data windows: the map auto-refreshes every minute — per-cube traffic rolls up the last 2h of metrics and alarmed services light up from the last 20m of alarms. The deployment structure is read live from OAP (not a bundled snapshot), so the map is correct on any deployment.
* **Beacon mode** dims every healthy cube to a wireframe ghost so firing services jump out during an incident. **Logic groups** cluster related layers into one labelled block (a Self-Observability group ships by default). Call relationships animate directional particles so traffic direction reads at a glance.
* Tier order, per-layer plane mapping, cube colors, the traffic MQE per layer and the logic groups are all driven by a structured admin page at `/admin/3d-map`, published to OAP and shared across the deployment the same way as dashboards (local draft → **Check diff & push**). The per-layer service map gains a **View in 3D** link focused on just that layer.

##### Smartscape service hierarchy

* OAP 10's cross-layer service hierarchy is now reachable from any layer's service map — a logical service projected across observation layers (GENERAL agent ↔ MESH sidecar ↔ MESH_DP data-plane ↔ K8S_SERVICE pod) is one click away on every selected hex.
* Picking a node lazily probes `getServiceHierarchy`; services with cross-layer peers get a chevron-stack chip. Clicking it opens a focus-and-context overlay with peers fanned by layer level; a two-step peer open arms then opens the destination layer in a new tab, pre-selecting the peer service.
* Every per-layer page validates the URL-hydrated `?service=<id>` against the layer's real service roster (served from the BFF's 60s catalog cache), so deep links to low-traffic services resolve instead of silently swapping services or hanging on "Resolving service…".

##### On-demand pod logs & BanyanDB cold-stage

* A new per-layer **Pod Logs** tab live-tails a Kubernetes pod's container logs, pulled on demand through OAP and never persisted: pick a pod and container, choose a trailing window (30s–30m) and refresh interval (2s–30s), with Include / Exclude keyword filtering forwarded to OAP. Enabled on the Kubernetes-deployed layers (`K8S_SERVICE`, `MESH`, `MESH_DP`).
* A topbar **Cold** pill (BanyanDB only) switches every page to read from the cold lifecycle stage — it replaces the read, not unions it. A cold-trap banner warns when the pill is on but the time range sits inside the hot+warm window. Trace lookup from a log row now carries the row's timestamp so a trace living in cold resolves from a cold-era log row.

##### Dashboards, templates & authoring

* The Layer dashboards and Overview templates admin pages share one editing model: your work-in-progress lives in your browser ("Save (local)" never touches the server), and the live shared version is whatever OAP serves. A **Reset to ▾** control loads Bundled or Remote into the editor; a **Preview ▾** control opens the real page rendering Local / Bundled / Remote; **Check diff & push** publishes with a side-by-side diff, enabled only when the local draft actually differs from remote.
* "+ New dashboard" writes a local draft; **Delete = soft-disable** (OAP has no hard delete). The Overview templates editor is rebuilt as a layer-style 12-column drag-to-reorder canvas that mirrors the live grid; the Layer dashboards picker is a single filterable dropdown with alias + key + sync status and a live menu preview.
* A new **`table` widget** for label-dimensioned metrics; sync-status banners now count source rows only (per-locale translation rows no longer inflate the `remote-only` / `diverged` counts).

##### Time picker drives every page

* The global time picker now drives layer dashboards, overview widgets (Services Dashboard), landing and topology — previously hardcoded to the last 60 minutes. Custom range seeds from the last applied range on reopen; the Active alarms widget title shows the actual window. Locale-bleed fixes on the alarms custom-range stamp and the log date column (`5月08日` → uniform `MM-DD`).

##### Wire-correctness on non-UTC OAP

* Every BFF query route now spells `Duration.start` / `end` in the OAP server's timezone (probed once per minute, cached). Previously only the alarms route did this; dashboards / landing / topology / endpoint / instance / eBPF / traces / logs all emitted UTC, silently shifting every query on non-UTC installs by the server's offset.
* Traces and logs now query at SECOND precision (records, not metric buckets) so a just-finished trace falls inside the window instead of being rounded off the MINUTE boundary.

##### Performance hardening

* Per-layer landing batches no longer 5xx on wide layers — requests are chunked at 6 services per round-trip and fired in parallel instead of one GraphQL with up to 250 aliased fragments tripping OAP's complexity ceiling.
* Trace waterfalls open fast on huge traces (rows render lazily via `content-visibility`; a 5000-span trace no longer freezes the main thread). Backgrounded tabs stop polling and resume with one immediate tick on return.

##### RBAC & input-validation hardening

* `/api/health` no longer leaks the active session count to unauthenticated callers — the public liveness probe returns only status + version.
* `pageSize` is capped server-side on every trace (200) / log (100) route, defending the OAP storage `LIMIT` at the BFF boundary. Profiling task bodies (async-profiler, pprof, eBPF fixed-task, network) are sanitized and bounded — duration caps, target/event caps, payload clamps — closing a DoS vector for users with `profile:enable`.

##### Alerting rules & live debugger

* The **Operate › Alerting rules** *Currently watching* list now aggregates entities across the whole cluster and tags each row with the OAP node evaluating it. Clicking a watched entity opens a running-context popup: current state (`FIRING` / `SILENCED_FIRING` / `RECOVERY_OBSERVATION`), window size, silence/recovery countdowns, last-alarm time, and the per-metric snapshot rendered as a sparkline so you can see exactly why a rule is (or isn't) firing.
* Live debugger fixes: `?historyId=…` deep-links no longer render blank (TDZ ReferenceError in `loadHistorical`); captured records are no longer wiped on stop; tab buttons route to the correct `/operate/live-debug/<tab>` path; node cards keep a stable order; empty captures show an explicit placeholder.

##### Smaller touches & reliability

* DSL / OAL catalog headers spell out the language name (`Metrics Analysis Language - OpenTelemetry Rules`, `Log Analysis Language`, `Observability Analysis Language`); the Layer dashboards / Overview editors now open REMOTE on diverged rows so you edit what users actually see.
* The four admin "Check diff & push" diff modals no longer log a Monaco `resetSchema` console error. Inter + JetBrains Mono are now self-hosted (no Google Fonts CDN), so air-gapped deployments render the intended typography; one six-step typescale now spans every admin page.
* The main sidebar folds to a narrow rail; overview dashboards appear in the sidebar only when their layers are reporting services; root `/` cascades through a sensible chain so the user never sees a blank page.
* When the BFF is unreachable the UI shows a clear "Cannot reach the server" message instead of "body stream already read". A server-global service-by-layer catalog singleton (60s TTL + single-flight) caps OAP to one fan-out per minute regardless of how many routes poll. Aligned with upstream [skywalking#13884](https://github.com/apache/skywalking/pull/13884) — Horizon now sends `id = <envelope name>` on `POST /ui-management/templates`, working against both current and legacy OAP.

Full release notes are [here](https://github.com/apache/skywalking-horizon-ui/releases/tag/v0.6.0).
