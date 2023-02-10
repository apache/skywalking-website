---
title: Release Apache SkyWalking BanyanDB 0.3.0
date: 2023-02-10
author: SkyWalking Team
---

SkyWalking BanyanDB 0.3.0 is released. Go to [downloads](/downloads) page to find release tars.

### Features

- Support 64-bit float type.
- Web Application.
- Close components in tsdb gracefully.
- Add TLS for the HTTP server.
- Use the table builder to compress data.

### Bugs

- Open blocks concurrently.
- Sync index writing and shard closing.
- TimestampRange query throws an exception if no data in this time range.

### Chores

- Fixes issues related to leaked goroutines.
- Add validations to APIs.
