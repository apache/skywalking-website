
---
title: Release Apache SkyWalking BanyanDB 0.7.1
date: 2024-11-18
author: SkyWalking Team
---

SkyWalking BanyanDB 0.7.1 is released. Go to [downloads](/downloads) page to find release tars.

### Features

- Add the bydbctl analyze series command to analyze the series data.
- Index: Remove sortable field from the stored field. If a field is sortable only, it won't be stored.
- Index: Support InsertIfAbsent functionality which ensures documents are only inserted if their docIDs are not already present in the current index. There is a exception for the documents with extra index fields more than the entity's index fields.

### Bug Fixes

- Fix the bug that TopN processing item leak. The item can not be updated but as a new item.
- Resolve data race in Stats methods of the inverted index.


### Documentation

- Improve the description of the memory in observability doc.
- Update kubernetes install document to align the banyandb helm v0.3.0.

### Chores

- Fix metrics system typo.
