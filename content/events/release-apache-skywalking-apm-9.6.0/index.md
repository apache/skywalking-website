---
title: Release Apache SkyWalking APM 9.6.0
date: 2023-09-02
author: SkyWalking Team
description: "Release Apache SkyWalking 9.6.0"
endTime: 2023-10-01T00:00:00Z
---

SkyWalking 9.6.0 is released. Go to [downloads](/downloads) page to find release tars.

#### New Alerting Kernel
* MQE(Metrics Query Expression) and a new notification mechanism are supported.

<img src="alerting-rules.png"/>

#### Support Loki LogQL 
* Newly added support for Loki LogQL and Grafana Loki Dashboard for SkyWalking collected logs

<img src="grafana-logql.png"/>

#### WARNING
* ElasticSearch 6 storage relative tests are removed. It worked and is not promised due to end of life officially.

#### Project

* Bump up Guava to 32.0.1 to avoid the lib listed as vulnerable due to CVE-2020-8908. This API is never used.
* Maven artifact `skywalking-log-recevier-plugin` is renamed to `skywalking-log-receiver-plugin`.
* Bump up cli version 0.11 to 0.12.
* Bump up the version of ASF parent pom to v30.
* Make builds reproducible for automatic releases CI.

#### OAP Server

* Add Neo4j component ID(112) language: Python.
* Add Istio ServiceEntry registry to resolve unknown IPs in ALS.
* Wrap `deleteProperty` API to the BanyanDBStorageClient.
* [Breaking change] Remove `matchedCounter` from `HttpUriRecognitionService#feedRawData`.
* Remove patterns from `HttpUriRecognitionService#feedRawData` and add max 10 candidates of raw URIs for each pattern.
* Add component ID for WebSphere.
* Fix AI Pipeline uri caching NullPointer and IllegalArgument Exceptions.
* Fix `NPE` in metrics query when the metric is not exist.
* Remove E2E tests for Istio < 1.15, ElasticSearch < 7.16.3, they might still work but are not supported as planed.
* Scroll all results in ElasticSearch storage and refactor scrolling logics, including Service, Instance, Endpoint,
  Process, etc.
* Improve Kubernetes coordinator to remove `Terminating` OAP Pods in cluster.
* Support `SW_CORE_SYNC_PERIOD_HTTP_URI_RECOGNITION_PATTERN` and `SW_CORE_TRAINING_PERIOD_HTTP_URI_RECOGNITION_PATTERN`
  to control the period of training and sync HTTP URI recognition patterns. And shorten the default period to 10s for
  sync and 60s for training.
* Fix ElasticSearch scroller bug.
* Add component ID for Aerospike(ID=149).
* Packages with name `recevier` are renamed to `receiver`.
* `BanyanDBMetricsDAO` handles `storeIDTag` in `multiGet` for `BanyanDBModelExtension`.
* Fix endpoint grouping-related logic and enhance the performance of PatternTree retrieval.
* Fix metric session cache saving after batch insert when using `mysql-connector-java`.
* Support dynamic UI menu query.
* Add comment for `docker/.env` to explain the usage.
* Fix wrong environment variable name `SW_OTEL_RECEIVER_ENABLED_OTEL_RULES` to right `SW_OTEL_RECEIVER_ENABLED_OTEL_METRICS_RULES`.
* Fix instance query in JDBC implementation.
* Set the `SW_QUERY_MAX_QUERY_COMPLEXITY` default value to 3000(was 1000).
* Accept `length=4000` parameter value of the event. It was 2000.
* Tolerate parameter value in illegal JSON format.
* Update BanyanDB Java Client to 0.4.0
* Support aggregate `Labeled Value Metrics` in MQE.
* [Breaking change] Change the default label name in MQE from `labe`l to `_`.
* Bump up grpc version to 1.53.0.
* [Breaking change] Removed '&' symbols from shell scripts to avoid OAP server process running as a background process.
* Revert part of #10616 to fix the unexpected changes: if there is no data we should return an array with `0`s,
  but in #10616, an empty array is returned.
* Cache all service entity in memory for query.
* Bump up jackson version to 2.15.2.
* Increase the default memory size to avoid OOM.
* Bump up graphql-java to 21.0.
* Add Echo component ID(5015) language: Golang.
* Fix `index out of bounds exception` in `aggregate_labels` MQE function.
* Support MongoDB Server/Cluster monitoring powered by OTEL.
* Do not print configurations values in logs to avoid sensitive info leaked.
* Move created the latest index before retrieval indexes by aliases to avoid the 404 exception. This just prevents some interference from manual operations.
* Add more Go VM metrics, as new skywalking-go agent provided since its 0.2 release.
* Add component ID for Lock (ID=5016).
* [Breaking change] Adjust the structure of hooks in the `alarm-settings.yml`. Support multiple configs for each hook types and specifying the hooks in the alarm rule.
* Bump up Armeria to 1.24.3.
* Fix BooleanMatch and BooleanNotEqualMatch doing Boolean comparison.
* Support LogQL HTTP query APIs.
* Add Mux Server component ID(5017) language: Golang.
* Remove ElasticSearch 6.3.2 from our client lib tests.
* Bump up ElasticSearch server 8.8.1 to 8.9.0 for latest e2e testing. 8.1.0, 7.16.3 and 7.17.10 are still tested.
* Add OpenSearch 2.8.0 to our client lib tests.
* Use listening mode for apollo implementation of dynamic configuration.
* Add `view_as_seq` function in MQE for listing metrics in the given prioritized sequence.
* Fix the wrong default value of `k8sServiceNameRule` if it's not explicitly set.
* Improve PromQL to allow for multiple metric operations within a single query.
* Fix MQE Binary Operation between labeled metrics and other type of value result.
* Add component ID for Nacos (ID=150).
* Support `Compare Operation` in MQE.
* Fix the Kubernetes resource cache not refreshed.
* Fix wrong classpath that might cause OOM in startup.
* Enhance the `serviceRelation` in MAL by adding settings for the `delimiter` and `component` fields. 
* [Breaking change] Support MQE in the Alerting. The Alarm Rules configuration(alarm-settings.yml), 
  add `expression` field and remove `metrics-name/count/threshold/op/only-as-condition` fields and remove `composite-rules` configuration.
* Check results in ALS as per downstream/upstream instead of per log.
* Fix GraphQL query `listInstances` not using endTime query
* Do not start server and Kafka consumer in init mode.
* Add Iris component ID(5018).
* Add OTLP Tracing support as a Zipkin trace input.

#### UI

* Fix metric name `browser_app_error_rate` in `Browser-Root` dashboard.
* Fix display name of `endpoint_cpm` for endpoint list in `General-Service` dashboard.
* Implement customize menus and marketplace page.
* Fix minTraceDuration and maxTraceDuration types.
* Fix init minTime to Infinity.
* Bump dependencies to fix vulnerabilities.
* Add scss variables.
* Fix the title of instance list and notices in the continue profiling.
* Add a link to explain the expression metric, add units in the continue profiling widget.
* Calculate string width to set Tabs name width.
* [Breaking change] Removed '&' symbols from shell scripts to avoid web application server process running as a background process.
* Reset chart label.
* Fix service associates instances.
* Remove node-sass.
* Fix commit error on Windows.
* Apply MQE on `MYSQL`, `POSTGRESQL`, `REDIS`, `ELASTICSEARCH` and `DYNAMODB` layer UI-templates.
* Apply MQE on Virtual-Cache layer UI-templates
* Apply MQE on APISIX, AWS_EKS, AWS_GATEWAY and AWS_S3 layer UI templates.
* Apply MQE on RabbitMQ Dashboards.
* Apply MQE on Virtual-MQ layer UI-templates
* Apply MQE on Infra-Linux layer UI-templates
* Apply MQE on Infra-Windows layer UI-templates
* Apply MQE on Browser layer UI-templates.
* Implement MQE on topology widget.
* Fix getEndpoints keyword blank.
* Implement a breadcrumb component as navigation.

#### Documentation

* Add Go agent into the server agent documentation.
* Add data unit description in the configuration of continuous profiling policy.
* Remove `storage extension` doc, as it is expired.
* Remove `how to add menu` doc, as SkyWalking supports marketplace and new backend-based setup.
* Separate contribution docs to a new menu structure.
* Add a doc to explain how to manage i18n.
* Add a doc to explain OTLP Trace support.
* Fix typo in `dynamic-config-configmap.md`.
* Fix out-dated docs about Kafka fetcher.
* Remove 3rd part fetchers from the docs, as they are not maintained anymore.

All issues and pull requests are [here](https://github.com/apache/skywalking/milestone/181?closed=1)
