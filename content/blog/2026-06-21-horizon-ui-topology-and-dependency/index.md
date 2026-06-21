---
title: "Meet Horizon UI · 3/16: Topology & Service Dependency"
date: 2026-06-21
author: Sheng Wu
description: "Part 3 of the Meet Horizon UI series: one template-driven topology engine that repaints for every layer, a filter to cut the noise, drill-down from a call into instances, the endpoint-dependency graph, and the cross-layer Smartscape overlay."
tags:
  - Cloud Native
  - Tracing
---

This is the third post in the [Meet Horizon UI](/blog/2026-06-21-skywalking-horizon-ui-introduction/) series. [Part 2](/blog/2026-06-21-horizon-ui-dashboards-and-mqe/) was about reading your services as numbers on a dashboard; this one is about reading them as a **map** — who calls whom, how hard, and how that same logical service looks across every layer it reports through.

The call data behind a SkyWalking topology is one thing; the *views* Horizon draws from it are several. There's the per-layer service map, a drill-down into the instances behind a single call, an endpoint-level dependency graph, and a cross-layer overlay that ties a service's faces together. They're all the same engine, pointed at different questions. (The Deployment tab — the map of one clustered service's *own* instances — and the WebGL 3D map are big enough to get their own posts next.)

## One topology engine, repainted per layer

Open any layer's **Topology** tab and you get a left-to-right hierarchical service map: `User` (when present) seeds the left, and each service sits in a column by its call depth — within a column, nodes keep the order the graph walk reached them, so the dominant chain reads top-down. Each service is a **hexagonal node** with three template-driven metric channels, none of them hardcoded:

- a **center** metric printed inside the hex (with its unit),
- a **ring** metric painted as an SLA-style colour band around its border (green → red),
- a **secondary** metric surfaced in the node's tooltip and detail panel.

Edges carry the call's throughput as an **RPM chip**, also pulled from the template (the server-side metric, falling back to the client side). Swap the `mqe`, `unit`, or `role` in the layer's `topology` JSON and the map repaints — same engine, different meaning per layer. Each node also wears the **icon of its detected component** — the same icon set the trace waterfall uses, so a PostgreSQL node actually looks like PostgreSQL, a Kafka node like Kafka.

![Figure 1: A per-layer service map — hexagonal nodes with an SLA health-ring border, the center metric inside, an RPM chip on each edge, and component icons on the nodes.](/screenshots/horizon-0.7.0/p03-topology-01-service-map.png)
Figure 1: One template-driven topology engine — health-ring hex nodes, RPM-chipped edges, real component icons.</br>

## Cut the noise

Real topologies are noisy — a dense map fills with conjectured peers OAP couldn't fully resolve (a bare `rcmd:80`, an un-instrumented address). Horizon's **Filter** control turns those off without hiding your real dependencies. It derives one facet automatically — **by layer** — and presents it exactly as the sidebar does: each row carries the layer's own icon and localized name (*Virtual Database*, *Java Agent*, …), plus an **Others** bucket for nodes OAP couldn't classify and a standalone **User** toggle. Uncheck *Others* and the uninstrumented clutter — and its dangling edges — disappears, while your databases, caches and queues (separated by their own `VIRTUAL_*` rows) stay on the map. Filtering is client-side and the rows re-derive on every refresh, so it never goes stale.

![Figure 2: The topology Filter — one auto-derived by-layer facet (each row with its layer icon and name), an Others bucket, and a User toggle — cutting the conjectured peers out of a dense map.](/screenshots/horizon-0.7.0/p03-topology-02-filter-denoise.png)
Figure 2: De-noise in one click — drop the unresolved "Others" peers and keep your real dependencies.</br>

When a layer's services fall into OAP service groups, the map's service-focus selector groups by them too, and clicking a group header **batch-selects or clears every service in that group** — so you can focus a whole team's slice of a busy map at once.

![Figure 3: The group-aware service selector — services grouped by OAP `Service.group`, with a group header that focuses or clears the whole group in one click.](/screenshots/horizon-0.7.0/p03-topology-03-group-selector.png)
Figure 3: Focus a whole service group at once from the map's selector.</br>

## Drill from a call into its instances

A service-to-service edge is an aggregate — behind it are real instances talking to real instances. Click a call on the map and choose **Instance map →**, and Horizon draws exactly that: the client service's instances in the left column, the server service's in the right, with the instance-level calls between them, animated client→server. It reuses everything from the service map — the health-ring nodes, the per-call client/server metric sidebar, a node popover with **Open instance dashboard** — and labels the columns in the layer's own vocabulary (*Pods* on Kubernetes, *Sidecars* on the data plane). The two service pickers are **relationship-aware**: the server list is the chosen client's callees, the client list is the chosen server's callers, each re-deriving as you change the other.

![Figure 4: The instance map — the client service's instances (left) and the server service's (right) with the instance-level calls between them, plus the per-call metric sidebar.](/screenshots/horizon-0.7.0/p03-topology-04-instance-map.png)
Figure 4: Drill from an aggregate call into the instance-to-instance traffic behind it.</br>

## Walk the request chain, endpoint by endpoint

Service topology answers "which services call this one." The **API dependency** tab answers the sharper question — "which *endpoints* call this endpoint, and which does it call." Pick an endpoint and it lays out in columns by direction: callers on the left, the focus endpoint in the centre, callees on the right, with the same SLA-coloured node border, the RPM and latency on every edge, and the heaviest edge labeled. A selected node shows a single **+** handle that pulls in *its* own callers and callees in one click, so you walk the chain one hop at a time instead of drowning in the whole graph; drag nodes apart, and the drill-out links (**Open endpoint**, **Service →**) open in a new tab so you keep the graph you're exploring.

![Figure 5: The API-dependency graph — callers left, the focus endpoint centre, callees right, expanded one hop with the + handle, latency and SLA-coloured RPM on every edge.](/screenshots/horizon-0.7.0/p03-topology-05-api-dependency.png)
Figure 5: Walk the endpoint call chain a hop at a time, latency on every edge.</br>

## One service, every layer it reports through

A single logical service often reports through several layers at once — a General agent, a Service Mesh sidecar, the mesh data plane, a Kubernetes pod. SkyWalking has modeled that cross-layer hierarchy since OAP 10; what Horizon adds is making it **one click from anywhere on the map**. Select a node and Horizon lazily probes its hierarchy — if the service has cross-layer peers, a small **chevron-stack chip** clips to the node.

![Figure 6: A selected service node carrying the chevron-stack chip — the cue that this service also reports through other layers.](/screenshots/horizon-0.7.0/p03-topology-06-smartscape.png)
Figure 6: The chevron-stack chip on a selected node — lazily probed on selection, it shows only when the service has cross-layer peers.</br>

Click the chip and the topology dims under a **Smartscape** overlay: the focused node re-renders bright in place, and its peers fan out vertically by OAP's layer order — request-near layers above, infra-near below. From there a two-step click opens any peer in its own layer, pre-selected. (Auto-refresh pauses while the overlay is open so nothing shifts under you.)

![Figure 7: The Smartscape overlay — one logical service projected across its layers (General agent, Service Mesh, mesh data plane, Kubernetes), fanned by layer order, each peer one click from its own layer.](/screenshots/horizon-0.7.0/p03-topology-06-smartscape-expand.png)
Figure 7: One service, every layer it reports through — the cross-layer hierarchy as a one-click overlay on the map.</br>

## Where to go next

Every metric, threshold, and edge weight on these maps lives in the layer template's `topology` block — which means you tune them the same config-driven way you tune dashboards, the subject of a later post in this series. For the field reference, see the [layer-template](https://skywalking.apache.org/docs/) topology docs.

Next up: **the Deployment tab and BanyanDB self-observability** — where the same map technique turns *inward* to show how one clustered service's own instances are deployed and talk to each other.
