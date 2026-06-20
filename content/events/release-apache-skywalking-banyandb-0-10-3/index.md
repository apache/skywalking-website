---
title: Release Apache SkyWalking BanyanDB 0.10.3
date: 2026-06-20
author: SkyWalking Team
---

SkyWalking BanyanDB 0.10.3 is released. Go to [downloads](/downloads) page to find release tars.

### Bug Fixes

- Persist segment end time in per-segment metadata so boundaries don't shift across restarts or config changes.
- Fix flaky on-disk integration tests caused by Ginkgo v2 random container shuffling closing gRPC connections prematurely.
- ui: fix query editor refresh/reset behavior and BydbQL keyword highlighting.
- Fix flaky `file_snapshot` subtest in measure/stream/trace by waiting until every introduced mem part has been flushed to disk, instead of only checking the latest snapshot creator.
- Fix flaky `TestCollectWithPartialClosedSegments` by raising `SegmentIdleTimeout` so wall-clock variance on slow CI does not mark still-open segments as idle.
- Fix FODC lifecycle cache poisoning where transient `InspectAll` failures were cached for 10 minutes and masked liaison recovery; raise FODC agent and proxy timeouts from 10s to 40s.
- Fix FODC `/cluster/lifecycle` dropping zero-valued group fields (e.g. `replicas=0`, `close=false`) under `encoding/json` + `omitempty`; switch to `protojson` so all fields are emitted (nil nested messages serialize as `null`).
- Fix trace `block_writer` panic on out-of-order timestamps within the same traceID, which dropped one trace-write batch per panic in multi-agent SkyWalking deployments. Spans of a single trace originate from independently-clocked services, and trace storage is organized by traceID rather than timestamp, so per-traceID timestamp monotonicity is not a writer invariant.
- Fix nil-pointer panic on cold-tier data nodes when FODC `InspectAll` raced with idle-segment cleanup.
- Add `GroupLifecycleInfo.errors` to surface per-group collection failures from FODC `InspectAll` instead of silently dropping the affected node entry.
- Fix `CollectDataInfo` and `CollectLiaisonInfo` not handling `CATALOG_PROPERTY` groups.
- Close BanyanDB merge write-path durability gap that allowed torn parts to be created by a crash between data write and metadata commit. Metadata files (`metadata.json` for trace/measure/stream, `manifest.json` for sidx, plus `traceID.filter` and `tag.type`) now go through a new `WriteAtomic` (write-tmp + fsync + rename + fsync-dir) sequence; data writers (`seqWriter.Close`, `localFileSystem.Write`) now propagate fdatasync errors instead of silently dropping them. `mustOpenFilePart` / `mustOpenPart` in each engine cleans up safe post-rename `.tmp` leftovers on open. (#13862, root cause for #13861)
- Fix lifecycle migration where the receiving node could create segments shorter than the configured `SegmentInterval`.
- Fail fast on incompatible storage version at boot. Previously the server would start in a degraded `SERVING` state with affected groups un-loaded because the property schema-registry retry loop swallowed the version-incompatibility panic. Compatible versions are listed in `banyand/internal/storage/versions.yml`.
- Release bluge index writers on segment rotation so `analysisWorker` pools sized from `GOMAXPROCS` don't accumulate across rotations. Two layered defects kept the existing idle-segment reclaim path from running: `segmentIdleTimeout` defaulted to `0` (which disabled the 10-minute reclaim ticker), and `incRef` refreshed `lastAccessed` on every rotation tick so `closeIdleSegments` never observed an idle segment. Defaults to `time.Hour`, moves the `lastAccessed` bump to real read/write call sites, and rewrites `closeIdleSegments` to take its own CAS-bumped snapshot so a concurrent reopen cannot have its only ref dropped under the reclaimer (apache/skywalking#13874).
- Fix incorrect counts and missing trace fields in the lifecycle migration report.
- Fix trace query identity-tag projection: when `trace_id`/`span_id` are explicitly projected, reconstruct them from span identity at response build time instead of requesting them as stored tags, and preserve tag order with null-filled per-span value alignment in the distributed trace result iterator.
- Fix FODC proxy corrupting Prometheus metric types. The agent dropped the `# TYPE` line while parsing banyandb `/metrics`, the `StreamMetrics` proto carried no type field, and the proxy guessed the type from a name-suffix heuristic — downgrading counters to gauge, mislabeling `_count`-suffixed counters as histograms, and splitting summaries into two conflicting `# TYPE` lines. Capture the type with the Prometheus `expfmt` parser, store it in the flight recorder, thread it through a new `Metric.type` enum over gRPC, and emit the real type from the proxy; pre-upgrade (untyped) samples fold into the matching typed family so a mixed-version rollout never emits two conflicting `# TYPE` lines for one metric.
- Trace storage metrics now expose the `storage` sub-scope, matching the `stream_storage_*` naming. The `StorageMetricsFactory` for trace switched from the root `trace` scope to `trace.storage`, so per-segment inverted-index metrics (`inverted_index_total_updates`, `inverted_index_total_doc_count`, `inverted_index_total_term_searchers_started`) are now emitted as `banyandb_trace_storage_*` instead of `banyandb_trace_*`, aligning the dashboard query names. Other trace metrics (`trace_tst_*`, `trace_scheduler_*`) are unchanged.
- Fix FODC agent labeling metrics with `node_role="ROLE_UNSPECIFIED"`. The agent resolved the node role exactly once at startup via a single `GetCurrentNode` poll whose endpoint retries spanned only ~1s; when the sibling lifecycle/banyandb gRPC server was not yet listening (`connect: cannot assign requested address`) the role fell back to `ROLE_UNSPECIFIED` permanently, so most nodes never reported their real `ROLE_DATA`/`ROLE_LIAISON`. Retry the initial node-role resolution with exponential backoff until a non-unspecified role is obtained or a 25s budget elapses.

### Chores

- Regenerate expired TLS test certificate with 100-year validity.
- Set Ginkgo `--repeat` to 0 in the flaky-test workflow so the hourly run completes within the 50-minute timeout.
