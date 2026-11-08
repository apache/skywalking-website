---
title: Release Apache SkyWalking BanyanDB 0.11.2
date: 2026-11-08
author: SkyWalking Team
description: "Release Apache SkyWalking BanyanDB 0.11.2."
---

SkyWalking BanyanDB 0.11.2 is released. Go to [downloads](/downloads) page to find release tars.

### Features

- Improve the Canopy console's text readability: raise the faint and dim text contrast, lift every font size to at least 12px, use heavier sub-navigation weights, stop forcing antialiased font smoothing, and load IBM Plex Mono 600 and Sans 700. The query builder rail is wider by default (400px) to fit the larger text.

### Bug Fixes

- Upgrade the Go toolchain to 1.26.10 and golang.org/x/net to v0.62.0 (with x/crypto, x/sys, x/text, x/term, x/mod and x/sync) for the crypto/x509 and net/http security fixes (GO-2026-6809, GO-2026-6610, GO-2026-6611, GO-2026-6612, GO-2026-6613, GO-2026-6617, GO-2026-6860, GO-2026-6866). Plugins must be rebuilt with Go 1.26.
- Stop rejecting queries by an estimated result window. Admission no longer returns `RESOURCE_EXHAUSTED` for a `limit`+`offset` above a window derived from the per-query memory assignment (1792 entries on a host without a memory limit), so clients that send `LIMIT 10000` such as OAP work without `--allowed-bytes`. The 100,000-entry absolute window, pool exhaustion, and execution-time charging are unchanged. Cap the sidx heap-merge preallocation sized by the request limit.
- Fix stream queries failing with `query memory pool exhausted` although they return few rows (apache/skywalking#14165). The vectorized stream scan now decodes blocks on demand and refunds a block's query-budget charge when its cursor is released, the sorted merge refunds a batch once its last retained row is pruned, and the block scanner counts each block once against its quota.
- Charge large tag and field values against the query allowance by their size instead of eight times their size, so a query that reads multi-MB values (for example OAP ai-agent session files stored as a `body` tag) no longer runs out of its allowance.
- Without `--allowed-bytes` or a container memory limit, size the query memory pool from host memory (75% of it, divided by 4, each query getting an eighth) instead of a fixed 64 MiB. The memory protector itself stays disabled.
- Retry property schema registry initialization indefinitely, logging an error every 10 attempts.
- Re-fetch file/DNS discovery nodes that are parked in the retry queue while discovery has not Start()-ed yet, so unbounded PreRun schema-registry retries can recover once peers become reachable without restarting liaison.
- Keep DNS discovery `ListNode` successful when some SRV addresses refuse connections but at least one node was discovered, so non-meta nodes no longer deadlock in PreRun on their own not-yet-listening gRPC address.
- Fix an un-interruptible sleep on shutdown during snapshot sync retry and add a jittered backoff for stream, measure, and trace.
- Report the real shard ID in `CollectDataInfo` shard info for stream, measure, and trace instead of the live table's slice index, so a node that owns only higher-numbered shards is no longer attributed to shard 0 in cross-node shard-load analysis.
- Reject a measure or stream whose tag name appears in more than one tag family, or twice within one family, when it is created or updated. The query layer resolves a bare tag name against a flat map keyed by name alone, so such a schema previously registered successfully and then resolved that name differently depending on which query path read it. Already-persisted schemas keep loading unchanged; only the registry's create and update paths enforce the rule.
- Fix a silently wrong result from the vectorized measure liaison's aggregation reduce when a single per-node partial exceeds 65,536 rows: past that boundary the consuming row index wrapped, folding early rows into a group a second time and never visiting the rest, with no error. It is reachable today on `Top`-bearing queries, whose per-node limit is unbounded. The reduce now consumes an oversized partial in bounded chunks, and `BatchSize` is capped at `MaxUint16` so it cannot reopen the same wrap from the output side. The liaison's raw `Top` and raw `GroupBy` passes are chunked the same way.
- Reject a `--trace-vectorized-batch-size` above 65,536 at startup instead of accepting it. The trace query path indexes a batch's active rows through a `uint16` selection, so a batch size above that bound silently wrapped -- reading early rows a second time and never reading the rest. The stream path already enforced this bound; measure now does too. A node configured above the bound will fail to start rather than return wrong results, and must lower the flag.
- Fix FODC proxy OOM kills on `/metrics`: stream the Prometheus text to the response, stop copying label maps, share one agent collection between concurrent scrapes, and install the same panic diagnostics as the agent.
- Stop the scheduled backup/lifecycle/retention scheduler from logging a false `action timed out` error for an action that runs longer than 5 minutes but ultimately succeeds. Crossing the internal 5-minute soft deadline now logs a lower-severity "still running" message and keeps waiting for the action's real outcome instead of abandoning it mid-flight; the eventual result is logged and the scheduler only starts the next scheduled run once the current one truly finishes. The scheduler's shutdown graces now overlap across its tasks instead of running one after another.
- Fix backup reporting success when an earlier catalog upload fails.
- Fix the S3 destination URL bucket parsing in the backup's `newFS`, which sent the backup to the wrong bucket.
- Return a trace's complete span set when its spans straddle a storage segment boundary (segments are per-day in local time, and each span lands in the segment matching its own timestamp) and the query's time range covers only one side of that boundary. After resolving the qualifying trace IDs from the segments the query range overlaps, fetching those traces' spans now also reopens any segment within one hour of the query range (`traceCompletionWindow`), so the neighboring day's spans are no longer silently dropped. Applies to both ORDER BY and trace-ID trace queries; trace selection, ordering, and limit/offset are unaffected.
- Apply a trace query's limit and offset after the residual span-ID filters, so a query whose limit was reached before the filters no longer drops older matching traces.
- Compare scalar literals by value rather than by pointer, so an `IN` or `BELONGS TO` filter that compares two literals with the same value now matches.
- Stop the stream block filter from skipping the rest of a series: the filter's verdict is per block, but the scan advanced a whole series on a skip, so every later block of that series was dropped.
- Clean up the merged and flushed parts that a shutdown interrupted. A merge whose introduction was refused left the merged part's directory and its file descriptors behind, and the flusher did not release the parts it could not introduce.
- Own the retained merge tail's decoded cells. The tail borrowed the decoder's buffer and the next block's decode overwrote it, so the retained rows could read a later row's tag value.
- Avoid an in-place `UnmarshalVarArray` mutation of cached filters and decode buffers: the caller's backing array was written in place, so a cached filter's arrays were mutated by the next decode of the same filter, and a trace query or an sidx element that decoded into a shared buffer saw the previous value.
- Guard the shared empty posting list against an in-place mutation, so a filter that merges into it cannot corrupt another filter's view of it.
- Wait for the liaison's entity cache before refusing a revisioned write. A schema barrier's watermark advances by each processed event's own revision, so an event handled out of revision order could carry it past a schema whose handlers had not yet filled the cache, and the write was refused with `STATUS_NOT_FOUND`.
- Derive the multi-group measure reduce layout from the query instead of inferring it from the partials that arrived: disjoint tags could leave the projection order, and a tag went missing when the only group defining it returned no rows. A multi-group aggregation also failed with `partial N schema mismatch` when a projected tag existed only in some groups; every partial is now reshaped onto the target layout, null-filling the missing non-key tags, while a key tag, an aggregate column or a type change is still a mismatch.

### Chores

- Bump `go-chi/chi/v5` to v5.4.0, `go-jose/go-jose/v4` to v4.1.7 and `golang.org/x/net` to v0.62.0, and the canopy and MCP npm dependencies (`fastify` 5.12.8, `undici` 7.30.1, `fast-uri` 3.1.9 / 4.2.3, `@modelcontextprotocol/sdk` 1.32.2, `zod` 4.6.7, `hono` 4.13.16, `@hono/node-server` 2.1.6, `body-parser` 2.4.0, `qs` 6.17.1, `ip-address` 10.7.5, and the `vite` / `vitest` dev dependencies) to clear the Dependabot and OSV CVEs, regenerate `dist/LICENSE`, `mcp/LICENSE` and `canopy/LICENSE`, and move the E2E workflows to skywalking-infra-e2e 56ac8be.
- Bump the canopy and MCP npm dependencies to clear the open Dependabot CVEs: `fast-uri` 4.2.1, `fastify` 5.12.1, `js-yaml` 4.3.2, `hono` 4.13.7, `ip-address` 10.7.3, `proxy-addr` 2.0.8 and `brace-expansion` 5.0.12. The committed `canopy/LICENSE`, `mcp/LICENSE` and the dependency license texts are regenerated to match.
- Drop the platform-pinned native build bindings from the Canopy web dependencies and declare the rolldown bindings as optional per-platform dependencies, so `npm ci` resolves a binding for the host platform instead of failing on a foreign one. Canopy now builds natively on macOS ARM64.
- Bump the pinned skywalking-cli to a commit that builds against the current goapi. The previously pinned commit no longer compiles (`api.PprofTaskCreationRequest` is undefined), so the e2e harness failed to install swctl and every e2e case failed at setup.
- Protect the `v0.11.x` release branch in `.asf.yaml` and turn off Dependabot's security-update pull requests.
- Log the Top-K dump at error level, so it is visible under the default log level.

### Documentation

- Fix the BydbQL reference examples and the Top-N `ORDER BY` form so every documented example parses, and parse every doc example in the `pkg/bydbql` tests so they cannot drift again.
