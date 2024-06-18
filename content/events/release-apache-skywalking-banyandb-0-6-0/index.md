---
title: Release Apache SkyWalking BanyanDB 0.6.0
date: 2024-05-13
author: SkyWalking Team
---

SkyWalking BanyanDB 0.6.0 is released. Go to [downloads](/downloads) page to find release tars.

### Features

- Support etcd client authentication.
- Implement Local file system.
- Add health check command for bydbctl.
- Implement Inverted Index for SeriesDatabase.
- Remove Block Level from TSDB.
- Remove primary index.
- Measure column-based storage:
  - Data ingestion and retrieval.
  - Flush memory data to disk.
  - Merge memory data and disk data.
- Stream column-based storage:
  - Data ingestion and retrieval.
  - Flush memory data to disk.
  - Merge memory data and disk data.
- Add HTTP services to TopNAggregation operations.
- Add preload for the TopN query of index.
- Remove "TREE" index type. The "TREE" index type is merged into "INVERTED" index type.
- Remove "Location" field on IndexRule. Currently, the location of index is in a segment.
- Remove "BlockInterval" from Group. The block size is determined by the part.
- Support querying multiple groups in one request.

### Bugs

- Fix the bug that property merge new tags failed.
- Fix CPU Spike and Extended Duration in BanyanDB's etcd Watching Registration Process.
- Fix panic when closing banyand.
- Fix NPE when no index filter in the query.

### Chores

- Bump go to 1.22.
- Bump node to 2.12.2.
- Bump several tools.
- Bump all dependencies of Go and Node.
- Combine banyand and bydbctl Dockerfile.
- Update readme for bydbctl
