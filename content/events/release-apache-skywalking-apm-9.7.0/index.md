---
title: Release Apache SkyWalking APM 9.7.0
date: 2023-11-28
author: SkyWalking Team
description: "Release Apache SkyWalking 9.7.0"
endTime: 2023-12-31T00:00:00Z
---

SkyWalking 9.7.0 is released. Go to [downloads](/downloads) page to find release tars.

#### Dark Mode
The dafult style mode is changed to the dark mode, and light mode is still available.

<img src=".dark-mode.png">

#### New Design Log View
A new design for the log view is currently available. Easier to locate the logs, and more space for the raw text.

<img src="logs.png>

#### Project

* Bump Java agent to 9.1-dev in the e2e tests.
* Bump up netty to 4.1.100.
* Update Groovy 3 to 4.0.15.
* Support packaging the project in JDK21. Compiler source and target remain in JDK11.

#### OAP Server

* ElasticSearchClient: Add `deleteById` API.
* Fix Custom alarm rules are overwritten by 'resource/alarm-settings.yml'
* Support Kafka Monitoring.
* Support Pulsar server and BookKeeper server Monitoring.
* [Breaking Change] Elasticsearch storage merge all management data indices into one index `management`,
  including `ui_template，ui_menu，continuous_profiling_policy`.
* Add a release mechanism for alarm windows when it is expired in case of OOM.
* Fix Zipkin trace receiver response: make the HTTP status code from `200` to `202`.
* Update BanyanDB Java Client to 0.5.0.
* Fix getInstances query in the BanyanDB Metadata DAO.
* BanyanDBStorageClient: Add `keepAliveProperty` API.
* Fix table exists check in the JDBC Storage Plugin.
* Enhance extensibility of HTTP Server library.
* Adjust `AlarmRecord` alarmMessage column length to 512.
* Fix `EventHookCallback` build event: build the layer from `Service's Layer`.
* Fix `AlarmCore` doAlarm: catch exception for each callback to avoid interruption.
* Optimize queryBasicTraces in TraceQueryEsDAO.
* Fix `WebhookCallback` send incorrect messages, add catch exception for each callback HTTP Post.
* Fix AlarmRule expression validation: add labeled metrics mock data for check.
* Support collect ZGC memory pool metrics.
* Add a component ID for Netty-http (ID=151).
* Add a component ID for Fiber (ID=5021).
* BanyanDBStorageClient: Add `define(Property property, PropertyStore.Strategy strategy)` API.
* Correct the file format and fix typos in the filenames for monitoring Kafka's e2e tests.
* Support extract timestamp from patterned datetime string in LAL.
* Support output key parameters in the booting logs.
* Fix cannot query zipkin traces with `annotationQuery` parameter in the JDBC related storage.
* Fix `limit` doesn't work for `findEndpoint` API in ES storage.
* Isolate MAL CounterWindow cache by metric name.
* Fix JDBC Log query order.
* Change the DataCarrier IF_POSSIBLE strategy to use ArrayBlockingQueue implementation.
* Change the policy of the queue(DataCarrier) in the L1 metric aggregate worker to IF_POSSIBLE mode.
* Add self-observability metric `metrics_aggregator_abandon` to count the number of abandon metrics.
* Support Nginx monitoring.
* Fix `BanyanDB Metadata Query`: make query single instance/process return full tags to avoid NPE.
* Repleace go2sky E2E to GO agent.
* Replace Metrics v2 protocol with MQE in UI templates and E2E Test.
* Fix incorrect apisix metrics otel rules.
* Support `Scratch The OAP Config Dump`.
* Support `increase/rate` function in the `MQE` query language.
* Group service endpoints into `_abandoned` when endpoints have high
  cardinality.

#### UI

* Add new menu for kafka monitoring.
* Fix independent widget duration.
* Fix the display height of the link tree structure.
* Replace the name by shortName on service widget.
* Refactor: update pagination style. No visualization style change.
* Apply MQE on K8s layer UI-templates.
* Fix icons display in trace tree diagram.
* Fix: update tooltip style to support multiple metrics scrolling view in a metrics graph.
* Add a new widget to show jvm memory pool detail.
* Fix: avoid querying data with empty parameters.
* Add a title and a description for trace segments.
* Add Netty icon for Netty HTTP plugin.
* Add Pulsar menu i18n files.
* Refactor Logs view.
* Implement the Dark Theme.
* Change UI templates for Text widgets.
* Add Nginx menu i18n.
* Fix the height for trace widget.
* Polish list style.
* Fix Log associate with Trace.
* Enhance layout for broken Topology widget.
* Fix calls metric with call type for Topology widget.
* Fix changing metrics config for Topology widget.
* Fix routes for Tab widget.
* Remove OpenFunction(FAAS layer) relative UI templates and menu item.
* Fix: change colors to match dark theme for Network Profiling.
* Remove the description of OpenFunction in the UI i18n.
* Reduce component chunks to improve page loading resource time.

#### Documentation

* Separate storage docs to different files, and add an estimated timeline for BanyanDB(end of 2023).
* Add topology configuration in UI-Grafana doc.
* Add missing metrics to the `OpenTelemetry Metrics` doc.
* Polish docs of `Concepts and Designs`.
* Fix incorrect notes of slowCacheReadThreshold.
* Update OAP setup and cluster coordinator docs to explain new booting parameters table in the logs, and how to setup
  cluster mode.

All issues and pull requests are [here](https://github.com/apache/skywalking/milestone/193?closed=1)
