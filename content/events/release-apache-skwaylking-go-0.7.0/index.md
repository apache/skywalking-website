---
title: Release Apache SkyWalking Go 0.7.0
date: 2026-08-07
author: SkyWalking Team
description: "Release Apache SkyWalking Go 0.7.0"
---

SkyWalking Go 0.7.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

#### Features

* Support Windows plugin test.
* Support Kafka reporter.
* Add recover to goroutine to prevent unexpected panics.
* Add mutex to fix some data race.
* Replace external `goapi` dependency with in-repo generated protocols.
* Support pprof profiling.
* Align the agent with the supported Go releases (retire EOL Go 1.19-1.23): publish Go 1.24, 1.25, 1.26 base images, bump the module `go.mod` floor to Go 1.24, and run the CI build, plugin, and e2e jobs on Go 1.24-1.26.
* Support managing toolkit spans across goroutines through `SpanRef`.

#### Plugins

* Support gRPC v1.81.1 with Go 1.25 and Go 1.26.

#### Documentation

#### Bug Fixes

* Fix gRPC server tracing with recent internal stream types.
* Fix plugin interceptors bypassed on Windows.
* Fix wrong tracing context switch when trace ignore plugin activated.
* Fix data race when sending trace data to reporter.
* Fix multiple data races in span lifecycle, correlation context and segment collection.
* Add recover protection for the metrics, profile and segment-transform goroutines.
* Fix the RocketMQ batch consumer span: report once with one segment reference per message (new `ExtractContext` API).
* Fix nil dereference and wrong span ownership in the RocketMQ/Pulsar async producer callbacks.
* Fix concurrent finish flags of the gRPC streaming client and the go-micro socket close.
* Fix the MongoDB command span to complete through the async API (events may fire on different goroutines).
* Fix the gorm span storage to be per-statement and the mux response writer wrapping a nil writer.
* Add recover protection for the kafka instance-check and gRPC profile-fetch goroutines.
* Fix unsynchronized consumer-tag map access in the AMQP plugin (fatal concurrent map read/write).

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/238?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-go/milestone/8?closed=1)
