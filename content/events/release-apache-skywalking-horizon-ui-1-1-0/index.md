---
title: Release Apache SkyWalking Horizon UI 1.1.0
date: 2026-11-06
author: SkyWalking Team
description: "Release Apache SkyWalking Horizon UI 1.1.0."
---

SkyWalking Horizon UI 1.1.0 is released. Go to [downloads](/downloads) page to find release tars.

1.1.0 brings Horizon up to OAP 11.1.0. It reads the AI agent conversations OAP now stores, adds bundled layers for applications that report OpenTelemetry traces, queries traces in TraceQL, and lets one Horizon serve several teams by limiting a role to layers and service groups. Several changes need action when you upgrade, so read **Upgrading** first.

##### Upgrading

* **The Alarms page's setup is stored under a new name**, `horizon.alert.default` instead of `horizon.alert.page-setup`. A changed setup comes back at the shipped defaults; set it again at **Dashboard setup → Alarm pages**. A deployment that mounts its own bundled templates renames `alert/page-setup.json` to `alert/default.json` before upgrading.
* **Each Dashboard setup page has its own read/write permission pair.** `dashboard:read` / `dashboard:write` become `layer-template:read` / `layer-template:write`, and `overview:write` splits into five. The built-in roles are updated for you, and the old names keep working for this release; Horizon now logs a warning at startup naming any permission it does not recognise.
* **Layer page addresses changed, and old addresses are not redirected.** A group entry of a layer split by service group moves from `/layer/general~payments/…` to `/layer/general/payments/…`, and a Service, Instance or Endpoint sub page to `…/service/page/<id>`. Update bookmarks and any `rbac.landingByRole` route that names an old address. An overview widget placed on one service group is now saved as `GENERAL[payments]`; one saved in the old `GENERAL~PAYMENTS` form needs its layer picked again in **Dashboard setup → Overview templates**.
* **A stored template whose content would break its pages is no longer served.** It is hidden instead of breaking the sidebar or every dashboard, and the **Dashboard setup** page that owns it lists it with its problems.
* **Turning the Cold pill on no longer re-reads the page**; it changes what the next read asks for. Press Refresh to re-read at once.
* **A record list whose widget names no trace store asks which store to open a trace from**, including the bundled slow-statement and slow-command lists. Set **Record trace → Trace store** on the widget to skip the question.

##### AI agent conversations

* **Horizon reads the AI agent conversations OAP 11.1.0 stores.** A new bundled **AI Agents** layer lists the conversations the [SkyWalking AI Sessionizer](https://github.com/apache/skywalking-ai-sessionizer) pushes, per agent, with their talks, model calls, subagents, Bash runs and file changes. It sits behind a new permission, `ai-conversation:read`, which the built-in viewer, maintainer and operator roles carry.
* **Each conversation opens as one shareable page**: the transcript, with the agent's work folded under each input; a flow timeline with lanes for model calls, tools, MCP calls and nested subagent streams; and an inspector for the selected step.
* **See what the agent actually did.** Which files each tool call changed, each opening to its diff; the exact request and response of each model call, LangChain and LangGraph agents included; where a call's history was trimmed or changed; and what each call to an MCP server returned and how long it took.
* **Metrics for each agent**: tokens and cache read share per agent and runtime, an **MCP tools** tab per server and tool, and a bundled **AI Agent Overview** page with the top agents, hourly tokens and a daily calendar heatmap.

##### GenAI evaluation

* **The Virtual GenAI layer gains an Evaluation records tab**: the LLM-as-Judge results OAP stores, one row per judged call and task, with its score or verdict, reason and judge model, and a link to the trace the call was judged from. The **Models** dashboard gains an **Evaluation Score** chart that drills into the tab.

##### Sign-in and access control

* **A role can be limited to layers, and to service groups within a layer.** `metrics:read@GENERAL`, or `metrics:read@GENERAL[payments,risk]` for the services of those groups, so one Horizon can serve several teams that each see only their own services. The sidebar, the pickers and the service counts follow the grant.
* **A custom role can be added without restating the built-in ones.** Set `builtinRoles: keep` and the roles you list are merged onto `viewer`, `maintainer`, `operator` and `admin` instead of replacing them.
* **Dashboard setup pages open read-only** for a role that holds the read permission but not the write one.
* **The login audit can be stored in BanyanDB** instead of PostgreSQL, including the BanyanDB SkyWalking already stores its telemetry in, since Horizon keeps its records in groups of its own.

##### Traces, logs and events

* **Traces can be queried in TraceQL**, Grafana Tempo's query language, over the SkyWalking-native spans, the Zipkin spans, or the OTLP spans OAP 11.1.0 keeps as they arrive. Each trace store a layer names gets its own sidebar row with a name you choose, set at **Dashboard setup → Layer dashboards → Trace stores**. Templates need no change: the old `traces.source` field is read as the stores it named.
* **A trace can be looked up by its id**, on the Traces tab and on **Trace inspect**, with or without a time range. Every trace link now has one form, `?traceId=<id>&traceType=<source>`, so a link opens the same trace in the same view on any page.
* **Long values are readable in place.** A span's long tag value previews on one line and opens in full with a **Copy**; on the **Logs** tab a long log expands in the list instead of needing a popout for each one.
* **Cluster status reports every trace API in one pane**: the Zipkin endpoint and each TraceQL datasource, whether it answered, and the exact URL tried when it did not.

##### Dashboards

* **Four new bundled layers for OpenTelemetry traces.** For applications that set `service.layer=OTLP_GENERAL`, OAP 11.1.0 builds services, topology and metrics from their OTLP spans. The sidebar gains an **OpenTelemetry** group with **OTLP Service** (service list, service, instance and endpoint dashboards, topology and Traces), and **OTLP Virtual Database**, **OTLP Virtual MQ** and **OTLP Virtual Cache** for what those services call.
* **The Linux and Windows layers read OpenTelemetry host metrics**, from the Collector's `hostmetrics` receiver as well as node-exporter, Telegraf or windows_exporter, and each host gains a **Processes** tab.
* **The BanyanDB layer has a Trace Sampling page** for the tail sampling BanyanDB 0.11 can run inside the storage tier.
* **The OAP layer charts alarm delivery**: how OAP 11.1.0's HTTP alarm hooks (Webhook, Slack, PagerDuty, Discord and others) delivered, by result, response status and latency.
* **The Envoy AI Gateway layer is now called Agent Router**, after the project's new name. Only the display names changed; the layer key `ENVOY_AI_GATEWAY` and its metrics stay as they were.
* **The layer header's KPIs describe one completed hour, and say which one**, instead of re-reading every service of the layer over the picked window on every refresh.

##### Overview dashboards

* **Two new widget types.** `calendar-heatmap` draws the last 7 to 93 days by the hour or by the day; `ranking` lists a layer's services by one metric, busiest first. Rankings and page-side KPIs can also sum a counter over the picked range (`rangeTotal`) instead of averaging it, so tokens read as a total.

##### Dashboard templates

* **Invalid templates stored on OAP are reported, and never served.** One broken template no longer takes down the sidebar or every dashboard; the **Dashboard setup** rows show a red warning, and each page lists its invalid templates with their problems.
* **A disabled template can be enabled again** on every Dashboard setup page, so deleting a dashboard or an alarm page is no longer final.
* **Import checks a file before staging it**, underlining its problems on the file itself.
* **A template published elsewhere reaches an open browser on its own**, within about a minute, whether it came from another Horizon, `swctl` or anything else writing the same OAP store.
* **Every MQE field in the layer template editor can be run where you type it**, against a service and time range you pick, with a graph of exactly what came back.

##### Alarms

* **Named alarm pages.** Besides **Alarms**, a deployment can set up any number of named pages, for example one per team, each with its own pinned tiles, starting window and sidebar row. A pinned tile can name service groups, `GENERAL[payments, risk]`.
* *Fixes*: instance, endpoint and relation alarms land in their layers rather than under **Other**; every rule and every relation is its own incident; filtering by a service lists every alarm about it.

##### Profiling

* **Hide framework frames, find a frame, pop the result out.** **Hide frames** folds runs of frames that match a pattern, such as `org.apache.tomcat.`, so the code you wrote is no longer buried under JDK, Tomcat and Spring frames ([apache/skywalking#14173](https://github.com/apache/skywalking/issues/14173)). **Find frame…** marks matches, and **Pop out** opens the result almost full-window. All three work on Trace, eBPF, Async and pprof Profiling, with Java and Go presets.
* *Fixes*: eBPF Profiling's Tree showed every frame's total as its self time; a Go trace profile lost its top frame; the Trace Profiling flame graph said `ns` for milliseconds.

##### Refreshing

* **Refreshing is one coordinated round**: the header, the service list, every widget, the alarms card and the maps ask about one time window, and the round ends when the last of them lands.
* **Auto-refresh has its own on/off**, separate from the interval. The refresh control shows when requests are actually in flight, and a refresh that fails is recorded beside it, with the request and the server's answer.
* *Fixes*: overview grids, layer dashboards and maps no longer empty on every refresh, and a failed read is no longer drawn as a page of zeroes.

##### Query cold stage

* **Cold is asked for only where cold data is kept**: traces, logs and metrics. Alarms, pickers, events and profiling stay hot, so they keep answering while Cold is on. Zipkin traces now follow the toggle.

##### Dependencies

* **Fastify, @grpc/grpc-js, the MCP SDK, Vue and the packages they bring move to patched versions**, clearing the security advisories open against the release package. `server.trustProxy` keeps recording the same client address as before.

Full release notes are [here](https://github.com/apache/skywalking-horizon-ui/releases/tag/v1.1.0).
