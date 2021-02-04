---
title: Welcome
type: projectDoc
layout: baseof
---
# Welcome
**Here are SkyWalking 8 official documentation. You're welcome to join us.**

From here you can learn all about **SkyWalking**’s architecture, how to deploy and use SkyWalking, and develop based on SkyWalking contributions guidelines.

**NOTICE, SkyWalking 8 uses brand new tracing APIs, it is incompatible with all previous releases.**

- [Concepts and Designs](../en/concepts-and-designs/readme). You'll find the the most important core ideas about SkyWalking. You can learn from here if you want to understand what is going on under our cool features and visualization.

- [Setup](../en/setup/readme). Guides for installing SkyWalking in different scenarios. As a platform, it provides several ways of the observability.

- [UI Introduction](../en/ui/readme). Introduce the UI usage and features. 

- [Contributing Guides](../en/guides/readme). Guides are for PMC member, committer or new contributor. Here, you can find how to start contributing.

- [Protocols](../en/protocols/readme). Protocols show the communication ways between agents/probes and backend. Anyone interested in uplink telemetry data should definitely read this.

- [FAQs](../en/FAQ/readme). A manifest of already known setup problems, secondary developments experiments. When you are facing a problem, check here first.


In addition, you might find these links interesting:

- The latest and old releases are all available at [Apache SkyWalking release page](http://skywalking.apache.org/downloads/). The change logs are [here](../../CHANGES).

- [SkyWalking WIKI](https://cwiki.apache.org/confluence/display/SKYWALKING/Home) hosts the context of some changes and events.

- You can find the speaking schedules at Conf, online videos and articles about SkyWalking in [Community resource catalog](https://github.com/OpenSkywalking/Community).

We're always looking for help improving our documentation and codes, so please don’t hesitate to [file an issue](https://github.com/apache/skywalking/issues/new) 
if you see any problem. 
Or better yet, submit your own contributions through pull request to help make them better.

___
# Document Catalog
If you are already familiar with SkyWalking, you could use this catalog to find the document chapter directly.

* [Concepts and Designs](../en/concepts-and-designs/readme)
  * What is SkyWalking?
    * [Overview and Core concepts](../en/concepts-and-designs/overview). Provides a high-level description and introduction, including the problems the project solves.
    * [Project Goals](../en/concepts-and-designs/project-goals). Provides the goals which SkyWalking is trying to focus on and provide features about.
  * Probe
    * [Introduction](../en/concepts-and-designs/probe-introduction). Lead readers to understand what the probe is, how many different probes exists and why we need them.
    * [Service auto instrument agent](../en/concepts-and-designs/service-agent). Introduces what the auto instrument agents do and which languages does SkyWalking already support. 
    * [Manual instrument SDK](../en/concepts-and-designs/manual-sdk). Introduces the role of the manual instrument SDKs in SkyWalking ecosystem.
    * [Service Mesh probe](../en/concepts-and-designs/service-mesh-probe). Introduces why and how SkyWalking receive telemetry data from Service mesh and proxy probe.
  * Backend
    * [Overview](../en/concepts-and-designs/backend-overview). Provides a high level introduction about the OAP backend.
    * [Observability Analysis Language](../en/concepts-and-designs/oal). Introduces the core languages, which are designed for aggregation behaviour definition.
    * [Query in OAP](../en/protocols/readme#query-protocol). A set of query protocol provided, based on the Observability Analysis Language metrics definition.
  * UI
    * [Overview](../en/concepts-and-designs/ui-overview).  A simple brief about SkyWalking UI.
  * CLI (Command Line Interface)
    * SkyWalking CLI provides a command line interface to interact with SkyWalking backend (via GraphQL), for more information, [click here](https://github.com/apache/skywalking-cli).
* [Setup](../en/setup/readme).
  * Backend, UI, Java agent, and CLI are Apache official release, you could find them at [Apache SkyWalking DOWNLOAD page](http://skywalking.apache.org/downloads/).
  * Language agents in Service
    * All available [agents](../en/setup/readme#language-agents-in-service) for different languages.
    * [Java agent](../en/setup/service-agent/java-agent/readme). Introduces how to install the java agent to your service, without changing any code.
      * [Supported middleware, framework and library](../en/setup/service-agent/java-agent/Supported-list).
      * [Agent Configuration Properties](../en/setup/service-agent/java-agent/readme#table-of-agent-configuration-properties).
      * [Optional plugins](../en/setup/service-agent/java-agent/readme#optional-plugins).
      * [Bootstrap/JVM class plugin](../en/setup/service-agent/java-agent/readme#bootstrap-class-plugins).
      * [Advanced reporters](../en/setup/service-agent/java-agent/readme#advanced-reporters).
      * [Plugin development guide](../en/setup/service-agent/java-agent/readme#plugin-development-guide).
      * [Agent plugin tests and performance tests](../en/setup/service-agent/java-agent/readme#test).
    * [Other language agents](../en/setup/readme#language-agents-in-service) includes Nginx LUA, Python, .NetCore, PHP, NodeJS, Go.
    * Browser performance monitoring
      * Track the performance of the browser, such as latency of redirect, dns, ttfb. For more information, [click here](https://github.com/apache/skywalking-client-js).
  * Service Mesh
    * [SkyWalking on Istio](../en/setup/istio/readme). Introduces how to use Istio Mixer bypass Adapter to work with SkyWalking.
    * Use [ALS (access log service)](https://www.envoyproxy.io/docs/envoy/latest/api-v2/service/accesslog/v2/als.proto) to observe service mesh, without Mixer. Follow [document](../en/setup/envoy/als_setting) to open it.
  * Proxy
    * [Envoy Proxy](https://www.envoyproxy.io/)
      * [Sending metrics to Skywalking from Envoy](../en/setup/envoy/metrics_service_setting). How to send metrics from Envoy to SkyWalking using [Metrics service](https://www.envoyproxy.io/docs/envoy/latest/api-v2/config/metrics/v2/metrics_service.proto.html).
  * [Backend, UI and CLI setup document](../en/setup/backend/backend-ui-setup).
    * [Backend setup document](../en/setup/backend/backend-setup).
      * [Configuration Vocabulary](../en/setup/backend/configuration-vocabulary). Configuration Vocabulary lists all available configurations provided by `application.yml`.
      * [Overriding settings](../en/setup/backend/backend-setting-override) in application.yml is supported.
      * [IP and port setting](../en/setup/backend/backend-ip-port). Introduces how IP and port set can be used.
      * [Backend init mode startup](../en/setup/backend/backend-init-mode). How to init the environment and exit graciously. Read this before you try to start a new cluster.
      * [Cluster management](../en/setup/backend/backend-cluster). Guide about backend server cluster mode.
      * [Deploy in kubernetes](../en/setup/backend/backend-k8s). Guides you to build and use SkyWalking image, and deploy in k8s.
      * [Choose storage](../en/setup/backend/backend-storage). As we know, in default quick start, backend is running with H2 DB. But clearly, it doesn't fit the product env. In here, you could find what other choices do you have. Choose the one you like, we also welcome anyone to contribute new storage implementors.
      * [Set receivers](../en/setup/backend/backend-receivers). You could choose receivers by your requirements, most receivers are harmless, at least our default receivers are. You would set and active all receivers provided.
      * [Open fetchers](../en/setup/backend/backend-fetcher). You could open different fetchers to read metrics from the target applications. These ones work like receivers, but in pulling mode, typically like Prometheus.
      * Do [trace sampling](../en/setup/backend/trace-sampling) at backend. Trace sampling allows you to keep your metrics accurate, whilst only keeping some traces in storage based on rate.
      * Follow [slow DB statement threshold](../en/setup/backend/slow-db-statement) config document to understand how to detect slow database statements (including SQL statements) in your system.
      * Official [OAL scripts](../en/guides/backend-oal-scripts). As you known from our [OAL introduction](../en/concepts-and-designs/oal), most of backend analysis capabilities based on the scripts. Here is the description of official scripts, which helps you to understand which metrics data are in process, also could be used in alarm.
      * [Alarm](../en/setup/backend/backend-alarm). Alarm provides a time-series based check mechanism. You could set alarm rules targeting the analysis oal metrics objects.
      * [Advanced deployment options](../en/setup/backend/advanced-deployment). If you want to deploy backend in very large scale and support high loads, you may need this.
      * [Metrics exporter](../en/setup/backend/metrics-exporter). Use metrics data exporter to forward metrics data to 3rd party systems.
      * [Time To Live (TTL)](../en/setup/backend/ttl). Metrics and traces are time series data, they would be saved forever, you could set the expired time for each dimension.
      * [Dynamic Configuration](../en/setup/backend/dynamic-config). Make configuration of OAP changed dynamic, from remote service or 3rd party configuration management system.
      * [Uninstrumented Gateways](../en/setup/backend/uninstrumented-gateways). Configure gateways/proxies that are not supported by SkyWalking agent plugins, to reflect the delegation in topology graph.
      * [Apdex threshold](../en/setup/backend/apdex-threshold). Configure the thresholds for different services if Apdex calculation is activated in the OAL.
      * [Service Grouping](../en/setup/backend/service-auto-grouping). An automatic grouping mechanism for all services based on name.
      * [Group Parameterized Endpoints](../en/setup/backend/endpoint-grouping-rules). Configure the grouping rules for parameterized endpoints, to improve the meaning of the metrics.
      * [OpenTelemetry Metrics Analysis](../backend-receivers#opentelemetry-receiver). Activate built-in configurations to convert the metrics forwarded from OpenTelemetry collector. And learn how to write your own conversion rules.
      * [Meter Analysis](../en/setup/backend/backend-meter). Set up the backend analysis rules, when use [SkyWalking Meter System Toolkit](../en/setup/service-agent/java-agent/readme#advanced-features) or meter plugins. 
      * [Spring Sleuth Metrics Analysis](../en/setup/backend/spring-sleuth-setup). Configure the agent and backend to receiver metrics from micrometer.
    * [UI setup document](../en/setup/backend/ui-setup).
    * [CLI setup document](https://github.com/apache/skywalking-cli).
* [UI Introduction](../en/ui/readme). Introduce the UI usage and features.
* [Contributing Guides](../en/guides/readme). Guides are for PMC member, committer or new contributor. At here, you can find how to start contributing.
  * [Contact us](../en/guides/readme#contact-us). Guide users about how to contact the official committer team or communicate with the project community.
  * [Process to become official Apache SkyWalking Committer](../en/guides/asf/committer). How to become an official committer or PMC member.
  * [Compiling Guide](../en/guides/How-to-build). Follow this to compile the whole project from the source code.
  * [Agent plugin development guide](../en/guides/Java-Plugin-Development-Guide). Guide developers to write their plugin, and follow [plugin test requirements](../en/guides/Plugin-test) when you push the plugin to the upstream.
* [Protocols](../en/protocols/readme). Protocols show the communication ways between agents/probes and backend. Anyone interested in uplink telemetry data should definitely read this.
* [FAQs](../en/FAQ/readme). A manifest of already known setup problems, secondary developments experiments. When you are facing a problem, check here first.


