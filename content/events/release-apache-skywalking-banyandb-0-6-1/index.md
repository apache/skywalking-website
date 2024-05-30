---
title: Release Apache SkyWalking BanyanDB 0.6.1
date: 2024-05-30
author: SkyWalking Team
---

SkyWalking BanyanDB 0.6.1 is released. Go to [downloads](/downloads) page to find release tars.

### Features

- Add benchmarks for stream filtering and sorting.
- Limit the max pre-calculation result flush interval to 1 minute.
- Use both datapoint timestamp and server time to trigger the flush of topN pre-calculation result.

### Bugs

- Fix the bug that topN query doesn't return when an error occurs.
- Data race in the hot series index selection.
- Remove SetSchema from measure cache which could change the schema in the cache.
- Fix duplicated items in the query aggregation top-n list.
- Fix non-"value" field in topN pre-calculation result measure is lack of data.
- Encode escaped characters to int64 bytes to fix the malformed data.
