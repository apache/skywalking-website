---
title: Release Apache SkyWalking BanyanDB 0.10.0
date: 2026-03-31
author: SkyWalking Team
---

SkyWalking BanyanDB 0.10.0 is released. Go to [downloads](/downloads) page to find release tars.

### Features

- Remove Bloom filter for dictionary-encoded tags.
- Implement BanyanDB MCP.
- Support deleting non-entity tags when updating the schema.
- Remove check requiring tags in criteria to be present in projection.
- Add sorted query support for the Property.
- Update bydbQL to add sorted query support for the Property.
- Remove the windows arch for binary and docker image.
- Support writing data with specifications.
- Persist series metadata in liaison queue for measure, stream and trace models.
- Update the dump tool to support analyzing the parts with smeta files.
- Add replication integration test for measure.
- Activate the property repair mechanism by default.
- Add snapshot time retention policy to ensure the snapshot only can be deleted after the configured minimum age(time).
- **Breaking Change**: Change the data storage path structure for property model:
  - From: `<data-dir>/property/data/shard-<id>/...`
  - To: `<data-dir>/property/data/<group>/shard-<id>/...`
- Add a generic snapshot coordination package for atomic snapshot transitions across trace and sidx.
- Support map-reduce aggregation for measure queries: map phase (partial aggregation on data nodes) and reduce phase (final aggregation on liaison).
- Add eBPF-based KTM I/O monitor for FODC agent.
- Support relative paths in configuration.
- Support 'none' node discovery and make it the default.
- Support server-side element ID generation for stream writes when clients omit element_id.
- Implement entire group deletion.

### Bug Fixes

- Fix the wrong retention setting of each measure/stream/trace.
- Fix server got panic when create/update property with high dist usage.
- Fix incorrect key range update in sidx part metadata.
- Fix panic in measure block merger when merging blocks with overlapping timestamps.
- Fix unsupported empty string tag bug.
- Fix duplicate elements in stream query results by implementing element ID-based deduplication across scan, merge, and result building stages.
- Fix data written to the wrong shard and related stream queries.
- Fix the lifecycle panic when the trace has no sidx.
- Fix panic in sidx merge and flush operations when part counts don't match expectations.
- Fix trace queries with range conditions on the same tag (e.g., duration) combined with ORDER BY by deduplicating tag names when merging logical expression branches.
- Fix sidx tag filter range check returning inverted skip decision and use correct int64 encoding for block min/max.
- Ignore take snapshot when no data.
- Fix measure standalone write handler resetting accumulated groups on error, which dropped all successfully processed events in the batch.
- Fix memory part reference leak in mustAddMemPart when tsTable loop closes.
- Fix memory part leak in syncPartContext Close and prevent double-release in FinishSync.
- Fix segment reference leaks in measure/stream/trace queries and ensure chunked sync sessions close part contexts correctly.
- Fix duplicate query execution in distributed measure Agg+TopN queries by enabling push-down aggregation, removing the wasteful double-query pattern.
- Fix nil pointer panic in segment collectMetrics during shutdown.
- Fix entity tag handling in trace filter to prevent TagIdx index mismatch when filtering with both entity and non-entity tags.

### Document

- Add read write benchmark document for 0.9.0 release.
- Add design of KTM.
- Add FODC overview doc.
- Remove Java client doc, and recreate client APIs docs.
- Add common issue documentation.

### Chores

- Upgrade Node.js support from 20.12 to 24.6.0, and align CI, license checks, and documentation
- Add Claude Code skill for vendor dependency updates.
- Upgrade Go vendor dependencies and sync BPF2GO_VERSION with cilium/ebpf library.
