---
title: Release Apache SkyWalking BanyanDB Java Client 0.7.0
date: 2024-09-28
author: SkyWalking Team
description: "Release Apache SkyWalking BanyanDB Java Client 0.7.0"
---

SkyWalking BanyanDB 0.7.0 is released. Go to [downloads](/downloads) page to find release tars.

### Features

* Bump up the API of BanyanDB Server to support the query trace.
* Add trace to response.
* Add ToString annotation to Tag.
* Enhance the BulkWriteProcessor.
* Provide a new method to order data by timestamp.
* Refactor metadata object to original protocol.
* Complemented the Schema management API.
* Enhance the MetadataCache.
* Add more IT tests.
* Remove analyze DNS name to get/refresh IP for create connection.
* Support new Match Query proto.

### Bugs

* Fix MeasureQuery.SumBy to use SUM instead of COUNT
* Add missing FloatFieldValue type in the Measure write operation
* Fix wrong result of the Duration.ofDay
* Remove duplicate orderBy method in measure query.
