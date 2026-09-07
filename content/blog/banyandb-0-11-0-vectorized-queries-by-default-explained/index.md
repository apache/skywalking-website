---
title: "BanyanDB 0.11.0: What's New and How to Upgrade"
date: 2026-09-07
author: "The BanyanDB Team"
description: "BanyanDB 0.11.0: default vectorized queries, pluggable trace sampling, schema barriers, and the upgrade order you must not skip."
tags:
  - Release
  - Storage
---

![BanyanDB 0.11.0 release cover showing 229 commits, 14 contributors, and three query engines vectorized by default](banner.jpg)

[BanyanDB](https://github.com/apache/skywalking-banyandb) 0.11.0 is out, and it's a dense one: vectorized queries move from opt-in to the default query path, a new pluggable pipeline handles trace-retention sampling, cluster-wide schema-consistency barriers close a real correctness gap, coding agents get two new ways to query BanyanDB in natural language, and etcd support is fully removed in favor of the property-based schema registry. We went through the 229 commits behind the release — not just the changelog — to pull out what actually matters if you operate a cluster.

> **Key Takeaways**
>
> - Vectorized query paths for measure, stream, and trace are now **on by default**, cutting allocations for scan-heavy queries — but it flips the rolling-upgrade order: **liaison nodes first, then data nodes**.
> - A new in-merge and finalize-time trace-retention sampling pipeline drops unwanted spans with pluggable `.so` sampler plugins, with bounded memory even under multi-million-trace merges.
> - Coding agents can query BanyanDB in natural language two ways now: a Claude Code/Codex **MCP plugin** with a `bydbql` skill, and a standalone **`bydbctl agent`** terminal UI.
> - **etcd support is fully removed** and the API version bumps to 0.11 — plan a maintenance-window upgrade. Queue and lifecycle metrics were also redesigned.

Below: the features worth trying, the performance work worth knowing about, the API surface that grew, and the changes that will break your upgrade if you're not ready for them.

## Vectorized Queries Are Now the Default

The columnar (vectorized) query path — which replaces per-row protobuf serialization with a batch, columnar pipeline — was already on by default for measure queries since 0.10. In 0.11, **stream and trace queries join it**: `--stream-vectorized-enabled`, `--trace-vectorized-enabled`, and `--measure-vectorized-enabled` all default to `true`.

For measure queries specifically, coverage is now complete on a single node: scan, `GroupBy`+`Agg` via `BatchAggregation`, scalar reduce, raw `GroupBy`, `TopN`/`BottomN`, `order_by`, and boundary-error parity all resolve through the vectorized dispatch with row-path-equivalent semantics. The gRPC wire format is byte-identical to the row path's output, and the team validated it with a 6-hour production soak showing zero divergences. Distributed Map-mode partial aggregation and multi-group requests still flow through the row path pending follow-up work.

This is also the release's headline **breaking change for rolling upgrades** — see [Breaking Changes](#breaking-changes-and-how-to-upgrade-safely) below for the required upgrade order.

## A Pluggable Pipeline for Trace Retention Sampling

Trace volume is the classic observability-backend problem: keep everything and pay for it, or drop data and hope you kept the traces that mattered. 0.11 gives BanyanDB an answer: a storage-node **in-merge trace-retention filter** that evaluates per-group sampler chains and safely drops non-retained traces from both core and secondary-index parts, configured dynamically per group with runtime register/update/remove support.

Two design properties make this production-shaped rather than a one-off filter:

- **Finalization sampling** is a best-effort backstop. A single node-wide, concurrency-1 scanner periodically sweeps cooled segments and force-merges each shard's un-finalized parts through the group's sampler chain, reusing the existing hot-merge path so it never contends with the hot-merge semaphore. A per-part `finalizeGen` stamp — written to disk before the part metadata — means a crash can't double-sample on replay.
- **The drop-set is bounded by design.** A shard's first finalize round can select every cooled part into one merge. An 18-million-entry drop set would otherwise reach roughly 1.3 GiB live and 2.6 GiB reserved heap, in a process also serving queries. So the pipeline bounds the sampling *decision* instead, not the pruning predicate. Once a merge's drop set is full, every further proposed drop is retained instead of recorded. The set stays complete with respect to drops actually performed — no orphaned entries, none missing. The ceiling itself comes from the memory protector, as `limit/(16×CPUs)`, so the aggregate across concurrent merges stays near `limit/16`.

<figure>

<svg viewBox="0 0 640 340" width="100%" role="img" aria-label="Diagram of the trace retention sampling pipeline: new parts from in-merge filtering and cooled segments from the finalization backstop both feed into a per-group sampler chain, which routes each trace to retained or dropped">
  <title>How the trace-retention sampling pipeline decides what to keep</title>
  <desc>Two inputs feed the sampler chain: new parts evaluated during in-merge filtering, and cooled segments swept by the finalization backstop scanner for parts that missed the in-merge pass. The sampler chain evaluates per-group rules and routes each trace to retained or dropped.</desc>
  <rect x="20" y="40" width="220" height="56" rx="8" fill="none" stroke="#38bdf8"></rect>
  <text x="130.0" y="60.0" text-anchor="middle" font-size="13" fill="currentColor">New parts</text>
  <text x="130.0" y="76.0" text-anchor="middle" font-size="13" fill="currentColor">(in-merge filter)</text>
  <rect x="20" y="240" width="220" height="56" rx="8" fill="none" stroke="#a78bfa"></rect>
  <text x="130.0" y="260.0" text-anchor="middle" font-size="13" fill="currentColor">Cooled segments</text>
  <text x="130.0" y="276.0" text-anchor="middle" font-size="13" fill="currentColor">(finalization backstop)</text>
  <rect x="300" y="140" width="160" height="56" rx="8" fill="none" stroke="currentColor"></rect>
  <text x="380.0" y="160.0" text-anchor="middle" font-size="13" fill="currentColor">Sampler chain</text>
  <text x="380.0" y="176.0" text-anchor="middle" font-size="13" fill="currentColor">(per-group rules)</text>
  <rect x="520" y="40" width="100" height="56" rx="8" fill="none" stroke="#22c55e"></rect>
  <text x="570.0" y="68.0" text-anchor="middle" font-size="13" fill="currentColor">Retained</text>
  <rect x="520" y="240" width="100" height="56" rx="8" fill="none" stroke="#94a3b8"></rect>
  <text x="570.0" y="268.0" text-anchor="middle" font-size="13" fill="currentColor">Dropped</text>
  <line x1="240.0" y1="68.0" x2="295.0" y2="150.5" stroke="#38bdf8" stroke-width="2"></line>
  <path d="M 300.0 158.0 L 292.8 154.5 L 299.5 150.0 Z" fill="#38bdf8"></path>
  <line x1="240.0" y1="268.0" x2="295.0" y2="185.5" stroke="#a78bfa" stroke-width="2"></line>
  <path d="M 300.0 178.0 L 299.5 186.0 L 292.8 181.5 Z" fill="#a78bfa"></path>
  <line x1="460.0" y1="158.0" x2="515.0" y2="75.5" stroke="#22c55e" stroke-width="2"></line>
  <path d="M 520.0 68.0 L 519.5 76.0 L 512.8 71.5 Z" fill="#22c55e"></path>
  <line x1="460.0" y1="178.0" x2="515.0" y2="260.5" stroke="#94a3b8" stroke-width="2"></line>
  <path d="M 520.0 268.0 L 512.8 264.5 L 519.5 260.0 Z" fill="#94a3b8"></path>
  <text x="320" y="325" text-anchor="middle" font-size="10" fill="#898781">Source: BanyanDB CHANGES.md and docs/design/trace-drop-set-bounding.md, 0.11.0</text>
</svg>

<figcaption>How the trace-retention sampling pipeline decides what to keep. Original diagram.</figcaption>
</figure>

See the [trace drop-set bounding design doc](https://github.com/apache/skywalking-banyandb/blob/master/docs/design/trace-drop-set-bounding.md) for the full derivation.

First-party sampler plugins ship for SkyWalking's own trace schema and for Zipkin (`sw-trace-sampler.so`, `zipkin-trace-sampler.so`), plus a bounded telemetry SDK so a sampler plugin can emit its own metered metrics and logs without the host process's cardinality or log budget going unbounded.

See the [trace-pipeline plugin SDK and sampler config reference](https://github.com/apache/skywalking-banyandb/blob/master/plugins/README.md) for the full config schema.

## Cluster-Wide Schema Consistency

Before 0.11, a schema change (create a stream, add an index rule, delete a group) could return success from the metadata service before every node in the cluster had actually applied it — a query against a node that hadn't caught up could see stale or missing schema. 0.11 introduces client-observable revision tracking and a barrier RPC to close that gap. See [API Changes](#api-changes) below for the concrete fields and RPCs, and the [schema-consistency client surface and SchemaBarrierService reference](https://github.com/apache/skywalking-banyandb/blob/master/docs/interacting/schema-consistency/barriers.md) for the full RPC contract.

Phase 2 extends the barrier cluster-wide: it fans the same calls out across every liaison and data node through a new `NodeSchemaStatusService`, handling mixed-version and membership-change cases safely. All of it is opt-in — zero-valued requests preserve prior behavior, so existing clients that don't pass a revision see no change.

## Natural-Language Querying for Coding Agents

0.11 gives coding agents two independent ways to query BanyanDB without hand-writing BydbQL.

The first is a **Claude Code / Codex plugin** that packages the BanyanDB MCP server with a `bydbql` skill for natural-language-to-BydbQL generation over STREAM, MEASURE, TRACE, and PROPERTY resources. Install it directly from the repository (`/plugin install apache/skywalking-banyandb` in Claude Code, or the equivalent `codex plugin add` flow), and any Claude Code or Codex session gains four MCP tools: `list_groups_schemas` for schema discovery, `get_generate_bydbql_prompt` for generation (it's the only tool that injects the live indexed-field list and enforces `ORDER BY` index-rule substitution), `validate_bydbql` for parse-only syntax and safety validation via a prebuilt Go binary, and `list_resources_bydbql` to execute a validated, read-only statement.

The second is **`bydbctl agent`**, a standalone two-pane terminal UI that drives a Codex or Claude Code CLI process directly for interactive natural-language BanyanDB querying: it discovers your schema, proposes typed query plans, and runs read-only queries. It owns none of your AI provider's credentials — you authenticate the CLI it wraps, separately. Where the MCP plugin adds BanyanDB querying to any Claude Code/Codex session, `bydbctl agent` is a dedicated interactive tool for the same job.

<figure>

<svg viewBox="0 0 640 260" width="100%" role="img" aria-label="Diagram of two natural-language querying paths in BanyanDB 0.11: a Claude Code or Codex session using the MCP plugin bydbql skill, and the standalone bydbctl agent terminal UI driving a Codex or Claude Code CLI process, both ultimately querying BanyanDB">
  <title>Two ways to query BanyanDB in natural language</title>
  <desc>Path one: a Claude Code or Codex session uses the MCP plugin bydbql skill to query BanyanDB directly. Path two: the standalone bydbctl agent terminal UI drives a separate Codex or Claude Code CLI process, which queries BanyanDB. Both paths are independent and read-only.</desc>
  <rect x="20" y="30" width="220" height="56" rx="8" fill="none" stroke="#38bdf8"></rect>
  <text x="130.0" y="50.0" text-anchor="middle" font-size="13" fill="currentColor">Claude Code / Codex</text>
  <text x="130.0" y="66.0" text-anchor="middle" font-size="13" fill="currentColor">session</text>
  <rect x="300" y="30" width="180" height="56" rx="8" fill="none" stroke="#38bdf8"></rect>
  <text x="390.0" y="50.0" text-anchor="middle" font-size="13" fill="currentColor">MCP plugin</text>
  <text x="390.0" y="66.0" text-anchor="middle" font-size="13" fill="currentColor">(bydbql skill)</text>
  <rect x="20" y="160" width="220" height="56" rx="8" fill="none" stroke="#a78bfa"></rect>
  <text x="130.0" y="180.0" text-anchor="middle" font-size="13" fill="currentColor">bydbctl agent</text>
  <text x="130.0" y="196.0" text-anchor="middle" font-size="13" fill="currentColor">(terminal UI)</text>
  <rect x="300" y="160" width="180" height="56" rx="8" fill="none" stroke="#a78bfa"></rect>
  <text x="390.0" y="180.0" text-anchor="middle" font-size="13" fill="currentColor">Codex / Claude Code</text>
  <text x="390.0" y="196.0" text-anchor="middle" font-size="13" fill="currentColor">CLI process</text>
  <rect x="540" y="95" width="90" height="66" rx="8" fill="none" stroke="currentColor"></rect>
  <text x="585.0" y="128.0" text-anchor="middle" font-size="13" fill="currentColor">BanyanDB</text>
  <line x1="240.0" y1="58.0" x2="291.0" y2="58.0" stroke="#38bdf8" stroke-width="2"></line>
  <path d="M 300.0 58.0 L 293.1 62.0 L 293.1 54.0 Z" fill="#38bdf8"></path>
  <line x1="240.0" y1="188.0" x2="291.0" y2="188.0" stroke="#a78bfa" stroke-width="2"></line>
  <path d="M 300.0 188.0 L 293.1 192.0 L 293.1 184.0 Z" fill="#a78bfa"></path>
  <line x1="480.0" y1="58.0" x2="533.6" y2="111.6" stroke="#38bdf8" stroke-width="2"></line>
  <path d="M 540.0 118.0 L 532.3 115.9 L 537.9 110.3 Z" fill="#38bdf8"></path>
  <line x1="480.0" y1="188.0" x2="533.1" y2="143.8" stroke="#a78bfa" stroke-width="2"></line>
  <path d="M 540.0 138.0 L 537.2 145.5 L 532.1 139.4 Z" fill="#a78bfa"></path>
  <text x="320" y="245" text-anchor="middle" font-size="10" fill="#898781">Source: docs/operation/mcp/plugin.md, skills/bydbql/SKILL.md, docs/interacting/bydbctl/agent.md</text>
</svg>

<figcaption>Two independent, read-only paths to query BanyanDB in natural language. Original diagram.</figcaption>
</figure>

See the [bydbctl agent setup and usage doc](https://github.com/apache/skywalking-banyandb/blob/master/docs/interacting/bydbctl/agent.md) to get started with the terminal UI.

## Also Shipped: Canopy, Migration Tooling, and More

Four more additions worth knowing about:

- **Canopy** is a brand-new admin UI — a standalone React SPA with a Fastify BFF, not embedded in the existing `ui/` — covering metadata CRUD for Group/Stream/Measure/Trace/IndexRule, a query console with WHERE-clause coverage across distributed clusters, Property collection CRUD, and TopN aggregation management. It shipped with its own Docker image, CI, and E2E suite. (These specifics come from the `canopy/` commits and design docs themselves, not from CHANGES.md, which covers Canopy in less detail.)
- **A migration tool** with `copy`, `verify`, and `analyze` subcommands now covers measure and stream data (index-mode measures included), building on the trace/lifecycle migration work from earlier releases.
- **Tags can change type across schema changes without breaking old parts.** If a tag's type changes (say, int to string), BanyanDB now persists each type variant in its own file (`{tag_name}.{tag_type}.tf`) instead of overwriting, and query/merge logic resolves by the (name, type) pair. This covers measure, stream, trace, and sidx parts.
- **Fair fast/slow lane scheduling** for trace part merges, so short merges no longer queue behind long-running ones; queue wait time is now exposed as `total_merge_queue_latency`.

See the [Canopy setup and architecture guide](https://github.com/apache/skywalking-banyandb/blob/master/canopy/README.md) for how to run it.

## Performance Improvements

Beyond the vectorized-by-default query engine above, a handful of targeted optimizations landed in 0.11:

- **Faster point-lookup queries** for trace and stream, via lazy block-metadata decode — queries that only need a handful of rows no longer pay for decoding metadata upfront.
- **Trace sampler decode path optimized**: deferred decoding, zero-copy string and tag handling, early tag rejection, direct scalar reads, and cached rule prefixes roughly halve sampler decision cost and tag-rule cost for the SkyWalking and Zipkin samplers.
- **Faster GCS backup uploads** — each object and its checksum metadata now write in one request, dropping the per-object `Update` round-trip.
- **Lifecycle migration is dramatically more memory-efficient.** Streaming the dump reader and pooling size-classed marshal buffers, instead of reading a large measure part entirely into memory, cuts peak heap for row-replay by roughly 80% on the same workload:

<figure>

<svg viewBox="0 0 560 380" width="100%" role="img" aria-label="Grouped bar chart comparing peak heap memory during lifecycle row-replay before and after the 0.11.0 optimization: about 1500 megabytes before, about 296 megabytes after, an 80 percent reduction">
  <title>Lifecycle row-replay peak heap: before vs. after 0.11.0</title>
  <desc>Peak heap during large-measure-part row replay dropped from approximately 1.5 GB to approximately 296 MB, roughly an 80% reduction, via a streaming dump reader, pooled size-classed marshal buffers, and a bounded in-flight batch (default 32 MiB). Source: BanyanDB CHANGES.md, 0.11.0.</desc>
  <text x="20" y="30" font-size="15" fill="currentColor">Lifecycle migration: peak heap, before &#8594; after</text>
  <text x="20" y="48" font-size="11" fill="#898781">Row-replay of large measure parts, same workload</text>
  <rect x="190" y="80.0" width="100" height="220.0" rx="4" fill="#38bdf8"></rect>
  <text x="240.0" y="68.0" text-anchor="middle" font-size="15" fill="currentColor">~1.5 GB</text>
  <text x="240.0" y="322" text-anchor="middle" font-size="12" fill="#898781">Before</text>
  <rect x="350" y="256.6" width="100" height="43.4" rx="4" fill="#22c55e"></rect>
  <text x="400.0" y="244.6" text-anchor="middle" font-size="15" fill="currentColor">~296 MB</text>
  <text x="400.0" y="322" text-anchor="middle" font-size="12" fill="#898781">After</text>
  <line x1="150" y1="300" x2="410" y2="300" stroke="#898781" stroke-width="1"></line>
  <text x="410" y="226.6" text-anchor="end" font-size="12" fill="#22c55e">&#8595; ~80% less peak heap</text>
  <text x="280" y="372" text-anchor="middle" font-size="10" fill="#898781">Source: BanyanDB CHANGES.md, 0.11.0 (streaming dump reader + pooled buffers + 32 MiB bounded batch)</text>
</svg>

<figcaption>Source: BanyanDB CHANGES.md, 0.11.0 — streaming dump reader, pooled size-classed marshal buffers, and a 32 MiB default bound on in-flight batch bytes.</figcaption>
</figure>

<h2 id="api-changes">API Changes</h2>

The API version itself also moved to 0.11 — that's covered under [Breaking Changes](#breaking-changes-and-how-to-upgrade-safely) below, since it's upgrade-blocking rather than additive. The changes here are all additive and opt-in:

- `mod_revision` added to Group/IndexRule/IndexRuleBinding/TopNAggregation create/update responses; `delete_time` added to all delete responses; `created_at` added and preserved across updates.
- New `STATUS_SCHEMA_NOT_APPLIED` status code for writes and queries whose revision is ahead of the server's cache.
- New `SchemaBarrierService` RPC — `AwaitRevisionApplied`, `AwaitSchemaApplied`, `AwaitSchemaDeleted` — so a client can block until a schema change has actually propagated, cluster-wide, before proceeding.
- `QueryRequest.group_mod_revisions` / `QueryResponse.group_statuses` added for per-group query-path revision gating.
- **BydbQL gains `?` positional parameter binding** — bind values instead of string-interpolating them into the query text, closing off QL injection the same way parameterized SQL does elsewhere. A reusable `Prepared` binding type layers prepared-statement caching on top, on the gRPC query path, with a bounded cache, top-K retention, cache and slow-query observability, and bound parameters redacted in the slow-query log.
- New validation: Measure's `ShardingKey` must now contain all `Entity` tags, to guarantee entity locality.

<h2 id="breaking-changes-and-how-to-upgrade-safely">Breaking Changes and How to Upgrade Safely</h2>

Straight from the project's own upgrade guide, in order:

**1. API version 0.11.** A cluster containing both 0.10 and 0.11 nodes is not supported. This one needs a maintenance window: stop writes and all API clients, stop all 0.10 nodes, upgrade and start all nodes at 0.11, upgrade API clients to require version 0.11, then verify schema initialization and ingestion before restoring traffic. Rollback means stopping all clients and nodes first — never run a mixed 0.10/0.11 cluster, in either direction.

**2. Vectorized query paths, liaison before data.** A distributed data node with a vectorized path enabled emits a native columnar frame instead of protobuf on the liaison↔data wire. A 0.11 liaison decodes both formats — it dispatches per message on the frame's leading magic byte — but an older liaison has no frame decoder at all and fails to deserialize the response. That flips the normal rolling-upgrade order:

| Upgrade order | Result |
| --- | --- |
| Liaison first, then data | **Safe.** New liaisons decode both frames and protobuf; old data nodes keep sending protobuf until upgraded. |
| Data first, then liaison | **Queries fail** for the duration of the rollout. |

Standalone deployments are unaffected — the frame is only emitted on a distributed data node. If you can't control node ordering, start new data nodes with `--stream-vectorized-enabled=false --trace-vectorized-enabled=false --measure-vectorized-enabled=false` and flip them on only after every liaison is upgraded. Rollback is the same three flags; no data migration is involved, since the flags affect only the query and wire paths, never the on-disk format. This is the one most likely to bite an automated rolling-upgrade pipeline that assumes "data nodes first" from every previous release.

**3. etcd is gone.** The property-based schema registry is the only supported mode now. Every `--etcd-*` flag is gone, `--namespace` is gone, and `--node-discovery-mode` no longer accepts `etcd` (use `dns`, `file`, or `none`). If `--schema-registry-mode` or `--node-discovery-mode` still reference etcd, you need to migrate to the property-based registry before you can run 0.11 at all.

**4. Queue and lifecycle metrics were redesigned.** `queue_pub`/`queue_sub` metrics moved to a uniform `operation`/`group`-labeled model (the old `topic` label and chunk-ordering metric families are gone), and lifecycle health metrics gained `remote_node`/`remote_role`/`remote_tier`/`group` labels while `banyandb_lifecycle_self_identity_resolution_total` was removed outright. Update dashboards and alerts before you upgrade, not after.

See the [complete "Upgrading to 0.11" walkthrough](https://github.com/apache/skywalking-banyandb/blob/master/docs/operation/upgrade.md#upgrading-to-011) for the full maintenance-window checklist.

## Behind the Release

<!-- [ORIGINAL DATA] -->
14 people contributed non-merge commits between v0.10.3 and v0.11.0 — a reminder that a release this dense is a team effort, not a single push.

<figure>

<svg viewBox="0 0 560 380" width="100%" role="img" aria-label="Lollipop chart of top contributors to BanyanDB 0.11.0 by commit count: Gao Hongtao 131, mrproliu 48, eight other contributors combined 18, Owen Willison 11, Huang Youliang 10, OmCheeLin 6, Tanay Paul 5">
  <title>Top contributors to BanyanDB 0.11.0</title>
  <desc>Commit counts, v0.10.3 to v0.11.0, non-merge commits, 14 total contributors. Gao Hongtao 131, mrproliu 48, eight other contributors combined 18, Owen Willison 11, Huang Youliang 10, OmCheeLin 6, Tanay Paul 5.</desc>
  <text x="20" y="30" font-size="15" fill="currentColor">Top contributors to 0.11.0</text>
  <text x="20" y="48" font-size="11" fill="#898781">Commits per author, v0.10.3&#8594;v0.11.0 (14 contributors total)</text>
  <text x="176" y="64" text-anchor="end" font-size="12" fill="currentColor">Gao Hongtao</text>
  <line x1="190" y1="60" x2="498.8" y2="60" stroke="#898781" stroke-width="2"></line>
  <circle cx="498.8" cy="60" r="7" fill="#38bdf8"><title>Gao Hongtao: 131 commits</title></circle>
  <text x="512.8" y="64" font-size="12" fill="currentColor">131</text>
  <text x="176" y="104" text-anchor="end" font-size="12" fill="currentColor">mrproliu</text>
  <line x1="190" y1="100" x2="303.1" y2="100" stroke="#898781" stroke-width="2"></line>
  <circle cx="303.1" cy="100" r="7" fill="#38bdf8"><title>mrproliu: 48 commits</title></circle>
  <text x="317.1" y="104" font-size="12" fill="currentColor">48</text>
  <text x="176" y="144" text-anchor="end" font-size="12" fill="currentColor">8 other contributors</text>
  <line x1="190" y1="140" x2="232.4" y2="140" stroke="#898781" stroke-width="2"></line>
  <circle cx="232.4" cy="140" r="7" fill="#38bdf8"><title>8 other contributors: 18 commits</title></circle>
  <text x="246.4" y="144" font-size="12" fill="currentColor">18</text>
  <text x="176" y="184" text-anchor="end" font-size="12" fill="currentColor">Owen Willison</text>
  <line x1="190" y1="180" x2="215.9" y2="180" stroke="#898781" stroke-width="2"></line>
  <circle cx="215.9" cy="180" r="7" fill="#38bdf8"><title>Owen Willison: 11 commits</title></circle>
  <text x="229.9" y="184" font-size="12" fill="currentColor">11</text>
  <text x="176" y="224" text-anchor="end" font-size="12" fill="currentColor">Huang Youliang</text>
  <line x1="190" y1="220" x2="213.6" y2="220" stroke="#898781" stroke-width="2"></line>
  <circle cx="213.6" cy="220" r="7" fill="#38bdf8"><title>Huang Youliang: 10 commits</title></circle>
  <text x="227.6" y="224" font-size="12" fill="currentColor">10</text>
  <text x="176" y="264" text-anchor="end" font-size="12" fill="currentColor">OmCheeLin</text>
  <line x1="190" y1="260" x2="204.1" y2="260" stroke="#898781" stroke-width="2"></line>
  <circle cx="204.1" cy="260" r="7" fill="#38bdf8"><title>OmCheeLin: 6 commits</title></circle>
  <text x="218.1" y="264" font-size="12" fill="currentColor">6</text>
  <text x="176" y="304" text-anchor="end" font-size="12" fill="currentColor">Tanay Paul</text>
  <line x1="190" y1="300" x2="201.8" y2="300" stroke="#898781" stroke-width="2"></line>
  <circle cx="201.8" cy="300" r="7" fill="#38bdf8"><title>Tanay Paul: 5 commits</title></circle>
  <text x="215.8" y="304" font-size="12" fill="currentColor">5</text>
  <line x1="190" y1="46" x2="190" y2="314" stroke="#898781" stroke-width="1"></line>
  <text x="280" y="372" text-anchor="middle" font-size="10" fill="#898781">Source: BanyanDB git history, v0.10.3…v0.11.0 (229 non-merge commits, 14 authors)</text>
</svg>

<figcaption>Source: BanyanDB git history, v0.10.3…v0.11.0 (229 non-merge commits, 14 authors). Original analysis.</figcaption>
</figure>

## What's Next

The vectorized engine's own release notes flag what's still pending: distributed Map-mode partial aggregation and multi-group (multi-measure) requests still run through the row path. Expect that gap to close in a follow-up release rather than this one — and expect the trace-sampling pipeline's plugin ecosystem to grow past the two first-party samplers now that the SDK and dev toolkit are stable.

## Frequently Asked Questions

### Do I have to reorder my upgrade automation for 0.11?

Yes, if you run a distributed cluster with any of the vectorized flags enabled (the default). Upgrade liaison nodes before data nodes — the reverse of every prior release's guidance — or disable the vectorized flags on new data nodes until every liaison is upgraded.

### Can I keep running etcd for schema discovery?

No. `--schema-registry-mode` only accepts `property` in 0.11, and every `--etcd-*` flag has been removed. Migrate to the property-based registry before upgrading.

### Is the vectorized query path safe to trust for correctness, not just speed?

The measure path was validated by a 6-hour production soak with byte-identical parity and zero divergences against the row path, plus per-workload bench gates. All three engines (measure, stream, trace) keep a rollback flag (`--{measure,stream,trace}-vectorized-enabled=false`) that reverts to the row path immediately with no data migration required, if you do hit a discrepancy.

### Does BydbQL support parameterized queries now?

Yes. 0.11 adds positional `?` parameter binding to BydbQL, so you bind values instead of string-interpolating them into the query text, closing off QL injection. A reusable `Prepared` binding type also adds prepared-statement caching on the gRPC query path, with a bounded cache, top-K retention, cache and slow-query observability, and bound parameters redacted in the slow-query log.

### What's the difference between the BydbQL MCP plugin and `bydbctl agent`?

The MCP plugin adds four BanyanDB query tools (schema discovery, generation, validation, execution) to any Claude Code or Codex session you're already running — install it once and it's available alongside whatever else you're doing. `bydbctl agent` is a separate, dedicated two-pane terminal UI purpose-built for interactive BanyanDB querying. Use the plugin if you want BanyanDB querying inside your existing agent workflow; use `bydbctl agent` if you want a standalone querying tool.

## Conclusion

0.11.0 is the release where BanyanDB's columnar query engine graduates from opt-in to default, trace retention gets a real pluggable answer instead of a blunt TTL, and coding agents get first-class natural-language access to your data. Read the [full 0.11.0 release notes](https://github.com/apache/skywalking-banyandb/tree/master/CHANGES.md) for the complete list, and work through the ["Upgrading to 0.11" checklist](https://github.com/apache/skywalking-banyandb/blob/master/docs/operation/upgrade.md#upgrading-to-011) before you touch a production cluster.
