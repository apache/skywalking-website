
---
title: Release Apache SkyWalking BanyanDB 0.8.0
date: 2025-04-07
author: SkyWalking Team
---

SkyWalking BanyanDB 0.8.0 is released. Go to [downloads](/downloads) page to find release tars.

### Features

- Add the `bydbctl analyze series` command to analyze the series data.
- Index: Remove sortable field from the stored field. If a field is sortable only, it won't be stored.
- Index: Support InsertIfAbsent functionality which ensures documents are only inserted if their docIDs are not already present in the current index. There is a exception for the documents with extra index fields more than the entity's index fields.
- Measure: Introduce "index_mode" to save data exclusively in the series index, ideal for non-timeseries measures.
- Index: Use numeric index type to support Int and Float
- TopN: Group top n pre-calculation result by the group key in the new introduced `_top_n_result` measure, which is used to store the pre-calculation result.
- Index Mode: Index `measure_nam` and `tags` in `entity` to improve the query performance.
- Encoding: Improve the performance of encoding and decoding the variable-length int64.
- Index: Add a cache to improve the performance of the series index write.
- Read cpu quota and limit from the cgroup file system to set gomaxprocs.
- Property: Add native storage layer for property.
- Add the max disk usage threshold for the `Measure`, `Stream`, and `Property` to control the disk usage.
- Add the "api version" service to gRPC and HTTP server.
- Metadata: Wait for the existing registration to be removed before registering the node.
- Stream: Introduce the batch scan to improve the performance of the query and limit the memory usage.
- Add memory protector to protect the memory usage of the system. It will limit the memory usage of the querying.
- Metadata: Introduce the periodic sync to sync the metadata from the etcd to the local cache in case of the loss of the events.
- Test: Add the e2e test for zipkin.
- Test: Limit the CPU and memory usage of the e2e test.
- Add taking the snapshot of data files.
- Add backup command line tool to backup the data files.
- Add restore command line tool to restore the data files.
- Add concurrent barrier to partition merge to improve the performance of the partition merge.
- Improve the write performance.
- Add node labels to classify the nodes.
- Add lifecycle management for the node.
- Property: Introduce the schema style to the property.
- Add time range parameters to stream index filter.
- UI: Add the `stages` to groups.
- Add time range return value from stream local index filter.
- Deduplicate the documents on building the series index.

### Bug Fixes

- Fix the bug that TopN processing item leak. The item can not be updated but as a new item.
- Resolve data race in Stats methods of the inverted index.
- Fix the bug when adding new tags or fields to the measure, the querying crashes or returns wrong results.
- Fix the bug that adding new tags to the stream, the querying crashes or returns wrong results.
- UI: Polish Index Rule Binding Page and Index Page.
- Fix: View configuration on Property page.
- UI: Add `indexMode` to display on the measure page.
- UI: Refactor Groups Tree to optimize style and fix bugs.
- UI: Add `NoSort` Field to IndexRule page.
- Metadata: Fix the bug that the cache load nil value that is the unknown index rule on the index rule binding.
- Queue: Fix the bug that the client remove a registered node in the eviction list. The node is controlled by the recovery loop, doesn't need to be removed in the failover process.
- UI: Add prettier to enforce a consistent style by parsing code.
- Parse string and int array in the query result table.
- Fix the bug that fails to update `Group` Schema's ResourceOpts.
- UI: Implement TopNAggregation data query page.
- UI: Update BanyanDB UI to Integrate New Property Query API.
- UI: Fix the Stream List.
- Fix the oom issue when loading too many unnecessary parts into memory.
- bydbctl: Fix the bug that the bydbctl can't parse the absolute time flag.

### Documentation

- Improve the description of the memory in observability doc.
- Update kubernetes install document to align the banyandb helm v0.3.0.
- Add restrictions on updating schema.
- Add docs for the new property storage.
- Update quick start guide to use showcase instead of the old example.

### Chores

- Fix metrics system typo.
- Bump up OAP in CI to 6d262cce62e156bd197177abb3640ea65bb2d38e.
- Update cespare/xxhash to v2 version.
- Bump up Go to 1.24.

### CVEs

- GO-2024-3321: Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto
- GO-2024-3333: Non-linear parsing of case-insensitive content in golang.org/x/net/html
