---
title: Release Apache SkyWalking BanyanDB 0.9.0
date: 2025-11-27
author: SkyWalking Team
---

SkyWalking BanyanDB 0.9.0 is released. Go to [downloads](/downloads) page to find release tars.

### Features

- Add sharding_key for TopNAggregation source measure.
- API: Update the data matching rule from the node selector to the stage name.
- Add dynamical TLS load for the gRPC and HTTP server.
- Implement multiple groups query in one request.
- Replica: Replace Any with []byte Between Liaison and Data Nodes.
- Replica: Support configurable replica count on Group.
- Replica: Move the TopN pre-calculation flow from the Data Node to the Liaison Node.
- Add a wait and retry to write handlers to avoid the local metadata cache being loaded.
- Implement primary block cache for measure.
- Implement versioning properties and replace physical deletion with the tombstone mechanism for the property database.
- Implement skipping index for stream.
- Add Load Balancer Feature to Liaison.
- Implement fadvise for large files to prevent page cache pollution.
- Data Model: Introduce the `Trace` data model to store the trace/span data.
- Support dictionary encoding for low cardinality columns.
- Push down aggregation for topN query.
- Push down min/max aggregation to data nodes.
- Introduce write queue mechanism in liaison nodes to efficiently synchronize stream and measure partition folders, improving write throughput and consistency.
- Add trace module metadata management.
- Add chunked data sync to improve memory efficiency and performance during data transfer operations, supporting configurable chunk sizes, retry mechanisms, and out-of-order handling for both measure and stream services.
- Implement comprehensive migration system for both measure and stream data with file-based approach and enhanced progress tracking.
- Backup/Restore: Add support for AWS S3, Google Cloud Storage (GCS), and Azure Blob Storage as remote targets for backup and restore operations.
- Improve TopN processing by adding "source" tag to track node-specific data, enhancing data handling across distributed nodes.
- Implement Login with Username/Password authentication in BanyanDB.
- Enhance flusher and introducer loops to support merging operations, improving efficiency by eliminating the need for a separate merge loop and optimizing data handling process during flushing and merging.
- Enhance stream synchronization with configurable sync interval - Allows customization of synchronization timing for better performance tuning.
- Refactor flusher and introducer loops to support conditional merging - Optimizes data processing by adding conditional logic to merge operations.
- New storage engine for trace: Data ingestion and retrieval, Flush memory data to disk, Merge memory data and disk data.
- Enhance access log functionality with sampling option.
- Implement a resilient publisher with circuit breaker and retry logic with exponential backoff.
- Optimize gRPC message size limits: increase server max receive message size to 16MB and client max receive message size to 32MB for better handling of large time-series data blocks.
- Add query access log support for stream, measure, trace, and property services to capture and log all query requests for monitoring and debugging purposes.
- Implement comprehensive version compatibility checking for both regular data transmission and chunked sync operations, ensuring proper API version and file format version validation with detailed error reporting and graceful handling of version mismatches.
- Breaking Change: Rename disk usage configuration flags and implement forced retention cleanup.
- Implement cluster mode for trace.
- Implement Trace views.
- Use Fetch request to instead of axios request and remove axios.
- Implement Trace Tree for debug mode.
- Implement bydbQL.
- UI: Implement the Query Page for BydbQL.
- Refactor router for better usability.
- Implement the handoff queue for Trace.
- Add dump command-line tool to parse and display trace part data with support for CSV export and human-readable timestamp formatting.
- Implement backoff retry mechanism for sending queue failures.
- Implement memory load shedding and dynamic gRPC buffer sizing for liaison server to prevent OOM errors under high-throughput write traffic.
- Add stream dump command to parse and display stream shard data with support for CSV export, filtering, and projection.

### Bug Fixes

- Fix the deadlock issue when loading a closed segment.
- Fix the issue that the etcd watcher gets the historical node registration events.
- Fix the crash when collecting the metrics from a closed segment.
- Fix topN parsing panic when the criteria is set.
- Remove the indexed_only field in TagSpec.
- Fix returning empty result when using IN operator on the array type tags.
- Fix memory leaks and OOM issues in streaming processing by implementing deduplication logic in priority queues and improving sliding window memory management.
- Fix etcd prefix matching any key that starts with this prefix.
- Fix the sorting timestamps issue of the measure model when there are more than one segment.
- Fix comparison issues in TopN test cases.

### Document

- Introduce AI_CODING_GUIDELINES.md to provide guidelines for using AI assistants (like Claude, Cursor, GitHub Copilot) in development, ensuring generated code follows project standards around variable shadowing, imports, error handling, code style and documentation.
