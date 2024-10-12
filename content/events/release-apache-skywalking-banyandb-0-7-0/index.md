
---
title: Release Apache SkyWalking BanyanDB 0.7.0
date: 2024-10-12
author: SkyWalking Team
---

SkyWalking BanyanDB 0.7.0 is released. Go to [downloads](/downloads) page to find release tars.

### File System Changes

- Bump up the version of the file system to 1.1.0 which is not compatible with the previous version.
- Move the series index into segment.
- Swap the segment and the shard.
- Move indexed values in a measure from data files to index files.
- Merge elementIDs.bin and timestamps.bin into a single file.

### Features

- Check unregistered nodes in background.
- Improve sorting performance of stream.
- Add the measure query trace.
- Assign a separate lookup table to each group in the maglev selector.
- Convert the async local pipeline to a sync pipeline.
- Add the stream query trace.
- Add the topN query trace.
- Introduce the round-robin selector to Liaison Node.
- Optimize query performance of series index.
- Add liaison, remote queue, storage(rotation), time-series tables, metadata cache and scheduler metrics.
- Add HTTP health check endpoint for the data node.
- Add slow query log for the distributed query and local query.
- Support applying the index rule to the tag belonging to the entity.
- Add search analyzer "url" which breaks test into tokens at any non-letter and non-digit character.
- Introduce "match_option" to the "match" query.

### Bugs

- Fix the filtering of stream in descending order by timestamp.
- Fix querying old data points when the data is in a newer part. A version column is introduced to each data point and stored in the timestamp file.
- Fix the bug that duplicated data points from different data nodes are returned.
- Fix the bug that the data node can't re-register to etcd when the connection is lost.
- Fix memory leak in sorting the stream by the inverted index.
- Fix the wrong array flags parsing in command line. The array flags should be parsed by "StringSlice" instead of "StringArray".
- Fix a bug that the Stream module didn't support duplicated in index-based filtering and sorting
- Fix the bug that segment's reference count is increased twice when the controller try to create an existing segment.
- Fix a bug where a distributed query would return an empty result if the "limit" was set much lower than the "offset".
- Fix duplicated measure data in a single part.
- Fix several "sync.Pool" leak issues by adding a tracker to the pool.
- Fix panic when removing a expired segment.
- Fix panic when reading a disorder block of measure. This block's versions are not sorted in descending order.
- Fix the bug that the etcd client doesn't reconnect when facing the context timeout in the startup phase.
- Fix the bug that the long running query doesn't stop when the context is canceled.
- Fix the bug that merge block with different tags or fields.
- Fix the bug that the pending measure block is not released when a full block is merged.

### Documentation

- Introduce new doc menu structure.
- Add installation on Docker and Kubernetes.
- Add quick-start guide.
- Add web-ui interacting guide.
- Add bydbctl interacting guide.
- Add cluster management guide.
- Add operation related documents: configuration, troubleshooting, system, upgrade, and observability.

### Chores

- Bump up the version of infra e2e framework.
- Separate the monolithic release package into two packages: banyand and bydbctl.
- Separate the monolithic Docker image into two images: banyand and bydbctl.
- Update CI to publish linux/amd64 and linux/arm64 Docker images.
- Make the build system compiles the binary based on the platform which is running on.
- Push "skywalking-banyandb:<tag>-testing" image for e2e and stress test. This image contains bydbctl to do a health check.
- Set etcd-client log level to "error" and etcd-server log level to "warn".
- Push "skywalking-banyandb:<tag>-slim" image for the production environment. This image doesn't contain bydbctl and Web UI.
- Bump go to 1.23.
