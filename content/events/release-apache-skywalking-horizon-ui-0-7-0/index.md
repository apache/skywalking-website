---
title: Release Apache SkyWalking Horizon UI 0.7.0
date: 2026-06-25
author: SkyWalking Team
description: "Release Apache SkyWalking Horizon UI 0.7.0."
---

SkyWalking Horizon UI 0.7.0 is released. Go to [downloads](/downloads) page to find release tars.

This release broadens what Horizon can observe — browser JS errors with source-map de-obfuscation, an Airflow layer, and a clustered BanyanDB self-observability layer — and deepens how you navigate a deployment: lock-and-compare across entities on a layer dashboard, three new topology drill-downs (instance map, intra-service deployment, API dependency), and portable dashboard config with OAP as the single source of truth.

##### Browser errors & source maps

* A new **Browser Logs** tab on the `BROWSER` layer lists the JS error logs the browser agent reports — message, category, page, app version, time, and the minified `line:col` — filterable by category and time window. Expanding a row shows the raw stack alongside a de-obfuscated view.
* **Source-map de-obfuscation** ([skywalking#6784](https://github.com/apache/skywalking/issues/6784)): upload a `.map` file and resolve any error's minified stack back to the original file, line, column, symbol name, and a source snippet by picking which map to apply. Uploaded maps live in the BFF's **memory only** (no backend storage) — surfaced as *temporary*, LRU-evicted at the configured budget, and lost on restart. For durable provisioning, mount `.map` files into the server's static source-map directory (`HORIZON_SOURCEMAPS_DIR`, `/app/sourcemaps` in the image); those reload automatically and can't be deleted from the UI. Budgets are tuned via the new `sourceMaps` block in `horizon.yaml` (defaults 64 MiB per-file / 512 MiB total). Upload/delete require the new `source-map:write` permission; viewing and resolving ride on `browser-errors:read`.

##### Two new layers: Airflow & BanyanDB self-observability

* **Airflow** (SWIP-7), under *Workflow Scheduler*: a service dashboard (scheduler / executor / pool KPIs and trends), a Components dashboard (per-host scheduler and triggerer metrics for **Airflow 3.x** native OTel), and a 3D Infra Map load ring for *Tasks Executable*. Pairs with OAP backend SWIP-7 (`meter_airflow_*`).
* **BanyanDB** (SWIP-15), under *Self-Observability*: models a clustered, role- and tier-aware BanyanDB deployment scraped through its FODC proxy — the cluster is one **Cluster** (service), each container a **Container** (instance, carrying its `container_name` role and `node_type` tier), and each storage **Group** an endpoint. It ships a Cluster dashboard (write/query/error-rate, capacity, a Containers-by-Role table), a **role-adaptive** Container dashboard (shared CPU/memory/Go-runtime resources, plus liaison ingestion / data storage / lifecycle migration panels gated on each container's role), a per-data-model Group dashboard (measure / stream / trace / property), and a **Deployment** tab rendering the container inventory with role-pair-specific call edges. The whole deployment model is editable from **Layer dashboards** admin → **Deployment** scope. Pairs with OAP backend SWIP-15 (`meter_banyandb_*`).

##### Lock & compare entities on a dashboard

* **Pin several services, instances, or endpoints — including ones from different services — and compare them in place.** Compare is standard on every service / instance / endpoint layer dashboard; nothing to enable. The entity you're viewing is always part of the comparison, tagged `CURRENT` and shown first; pinned entities add to it, up to six, each in its own stable hue.
* Each widget compares **inline in its own tile** — line widgets overlay one series per entity, card widgets show one row each, top-N and record widgets get per-entity tabs plus a merged *All* tab, and table widgets gain an **Entity** column. Each entity loads as its own request, so tiles fill in progressively and one slow or failed entity never blanks the others. The Topology, Deployment, trace, and log pages are unaffected.

##### New topology drill-downs

* **Instance map** — click a call between two services, then **Instance map →**, to open each service's instances as client / server columns with the instance-level calls between them: pan/zoom, animated flow, per-call client/server metric sidebar, and relationship-aware pair pickers drawn from the call graph. Configurable per layer (Layer dashboards → *Topology* → **Enable instance topology**), on out of the box for **General**, **Service Mesh**, **Kubernetes Service**, and **Cilium Service**.
* **Deployment tab** — the instance-to-instance call graph *within a single service* (e.g. a clustered store's nodes calling each other). Instances render as hexagons that bundle into pods (main + sibling containers); cluster them by one or more instance attributes or a name regex; a tiered, draggable layout reads upstream→downstream left-to-right. Edge metrics are keyed by **(source-role → target-role)** pair, with a primary metric printed inline and a **Flows** sub-tab tabling every edge per role-pair. Off by default; opt in per layer.
* **API dependency tab** — an endpoint's caller → callee chain as a column graph (callers left, focus centre, callees right) with the same health-ring borders, SLA-coloured RPM, and latency as the service map. A single **+** handle pulls in an endpoint's own callers and callees to walk the chain; drill-outs open in a new browser tab. Localized across all eight UI languages.

##### Topology readability

* A new **Filter** control on the per-layer service map (and the embedded topology widget) hides the conjectured peers that clutter a dense map — faceted by **layer** (each row carrying the layer's own icon and localized name), plus a standalone **User** toggle and an **Others** bucket for unresolved peers. Filtering is client-side and defaults to showing everything.
* **Technology component icons** now render on service-map nodes — the same icon set the trace waterfall uses, so a PostgreSQL node looks like PostgreSQL — falling back to the generic glyph when a component ships no icon.
* The topology's **service selector** now groups its list by OAP `Service.group`; clicking a group header batch-selects or unselects every service in that group.

##### Service group as a first-class layer axis

* A per-layer **Split menu by service group** toggle fans a layer into one sidebar entry per OAP `Service.group` (the `<group>::` prefix), each entry scoped to its group across header, picker, topology, dashboards, and roster. The service picker surfaces each service's group chip, and the **navigation sidebar is now resizable** (drag the divider, double-click to reset; width persists per browser) so long group-split names stay readable.
* **Every layer OAP reports now appears in the sidebar**, including layers with no Horizon template (they render with default capabilities). A layer is hidden only when an admin disables its template or it is listed in the new config-driven `layers.excluded` block in `horizon.yaml` (defaults `FAAS` and `VIRTUAL_GATEWAY`).

##### Dashboard config is portable, and OAP is the source of truth

* Every template admin page — Overview templates, Layer dashboards, the 3D-map config, and the per-locale Translations — now has **Export** and **Import**. Export downloads the *in-use* version (what end users render) as JSON for backup, sharing, or moving a dashboard to another OAP; Import loads a JSON file as a local draft to preview, then publish with **Check diff & push**. Import never writes OAP directly.
* **Runtime config is strictly what's on OAP.** Dashboards, overviews, and topology now render only the version published to OAP's UI-template store (or the in-code minimal default) — the disk-bundled templates reach a running UI only by being synced to OAP or through the admin **Preview** button, never as a silent live fallback. An unreachable template store is a **visible block** (a banner, matching the OAP-query-unreachable strip), not a quiet bundled back-fill. The Preview button now drives *every* template-rendered page — overview detail, per-layer topology (incl. the instance map), API dependency, traces, and network profiling.

##### Layer landing shows every service

* The layer landing now probes **all** services up to a configurable cap (`query.landingServiceCap` in `horizon.yaml`, default **100**) and runs a cheap ranking pass to pick the **true top-N** by the landing's order-by column — replacing the old cap of the first 25 *by list order*, which both hid services and mis-ranked them. The service picker lists the *whole* layer (below-cap services show `low` in the ranked column rather than disappearing), and the header chip reads **"metrics: top N"** to make the trim explicit.
* Selecting a low-traffic, below-cap service now works on **every** tab — logs, traces, and endpoint-dependency resolve the name from the full roster, not just the landing sample, so a tail service drills in everywhere.

##### Widgets & formatting

* Layer-dashboard widgets gain a structured **Visible when** gate — by an MQE expression (has-value, or `>` / `<` a threshold) or by an entity attribute (e.g. *language equals JAVA*) — evaluated server-side, so a gated-out group's queries are skipped entirely (a non-JVM instance no longer runs the JVM widget queries at all).
* New card formats: **`enum`** maps a coded metric to a readable, per-locale-translatable label (`1 → OK`), and **`duration`** renders a SECONDS metric as a human time-ago (`5m 20s ago`). **Record widgets drill into the originating trace** — resolved by trace id (so it works across layers) — with click-to-copy statement text. The **instance-list badge** is now configurable per layer (any attribute instead of the fixed agent `language`, hidden when empty or `UNKNOWN`). Large numbers on axes and tooltips use compact SI suffixes (`45.1k`, `1.34M`) instead of scientific notation.

##### Live debugger & DSL apply

* The live debugger groups MAL sample fan-outs by metric into one-line summaries and opens an expanded group straight into a **diff view** — shared labels dimmed into a "common" block, only the differing labels highlighted — so it's immediate which label distinguishes each sample. Multiple output entities fold the same way; long fractional `rate()` / `avg()` values are trimmed for display (the exact value stays on hover).
* **DSL management shows live apply progress.** A structural rule change (scope, downsampling, or metric set) now tracks the apply across the cluster through a phase stepper (Compiled → Confirming → Committing → Done) and reports success only once OAP confirms durability. *"Applied — cluster propagation unconfirmed"* is surfaced as a warning (the rule is applied; lagging nodes self-converge), a failed apply is called out as **rolled back** with the edit kept for a retry, and a one-click **Force re-apply** recovers a stuck node.

##### Access control, performance & fixes

* **RBAC**: the Roles & Permissions board now lists `infra-3d:read`; editing a layer-dashboard template gates on `dashboard:write` (publishing overview / alert / 3D-map configs stays on `overview:write`); the Cluster Status debug view needs only `live-debug:read`; and saving a local draft enforces the same per-kind permission as publishing.
* **Performance**: layer dashboards reuse the warm per-layer service catalog (one fewer OAP round-trip), the alarms list and count fire their two startup probes in parallel, the 3D Infra Map loads metrics in bounded-concurrency batches, and an oversized topology (>5,000 services / 15,000 calls) fails with a clear "too large to render" notice instead of an unreadable map. Partial metric-load failures now surface a banner so a backend hiccup isn't misread as real "no traffic" data.
* **Fixes**: the API-dependency tab honors the topbar time picker; one failed metric group no longer blanks an entire dashboard; trace-list rows pick the correct root span on BanyanDB; the server-timezone offset is cached per OAP URL so repointing OAP re-probes immediately; baseline security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`) are sent on every response; and the profiling pages use more of the page height.

Full release notes are [here](https://github.com/apache/skywalking-horizon-ui/releases/tag/v0.7.0).
