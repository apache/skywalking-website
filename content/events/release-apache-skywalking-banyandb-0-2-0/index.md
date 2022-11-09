---
title: Release Apache SkyWalking BanyanDB 0.2.0
date: 2022-11-09
author: SkyWalking Team
---

SkyWalking BanyanDB 0.2.0 is released. Go to [downloads](/downloads) page to find release tars.

### Features

- Command line tool: bydbctl.
- Retention controller.
- Full-text searching.
- TopN aggregation.
- Add RESTFul style APIs based on gRPC gateway.
- Add "exists" endpoints to the schema registry.
- Support tag-based CRUD of the property.
- Support index-only tags.
- Support logical operator(and & or) for the query.

### Bugs

- "metadata" syncing pipeline complains about an "unknown group".
- "having" semantic inconsistency.
- "tsdb" leaked goroutines.

### Chores

- "tsdb" structure optimization.
  - Merge the primary index into the LSM-based index
  - Remove term metadata.
- Memory parameters optimization.
- Bump go to 1.19.
