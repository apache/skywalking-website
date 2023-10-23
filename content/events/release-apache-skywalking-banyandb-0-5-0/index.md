---
title: Release Apache SkyWalking BanyanDB 0.5.0
date: 2023-10-23
author: SkyWalking Team
---

SkyWalking BanyanDB 0.5.0 is released. Go to [downloads](/downloads) page to find release tars.

### Features

- List all properties in a group.
- Implement Write-ahead Logging
- Document the clustering.
- Support multiple roles for banyand server.
- Support for recovery buffer using wal.
- Register the node role to the metadata registry.
- Implement the remote queue to spreading data to data nodes.
- Fix parse environment variables error
- Implement the distributed query engine.
- Add mod revision check to write requests.
- Add TTL to the property.
- Implement node selector (e.g. PickFirst Selector, Maglev Selector).
- Unified the buffers separated in blocks to a single buffer in the shard.

### Bugs

- BanyanDB ui unable to load icon.
- BanyanDB ui type error
- Fix timer not released
- BanyanDB ui misses fields when creating a group
- Fix data duplicate writing
- Syncing metadata change events from etcd instead of a local channel.

### Chores

- Bump several dependencies and tools.
- Drop redundant "discovery" module from banyand. "metadata" module is enough to play the node and shard discovery role.
