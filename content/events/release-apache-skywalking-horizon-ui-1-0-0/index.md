---
title: Release Apache SkyWalking Horizon UI 1.0.0
date: 2026-08-28
author: SkyWalking Team
description: "Release Apache SkyWalking Horizon UI 1.0.0."
---

SkyWalking Horizon UI 1.0.0 is released. Go to [downloads](/downloads) page to find release tars.

Horizon reaches 1.0 — a dark, dense, information-first console over the same OAP query protocol and MQE the previous UI used, with layer-driven dashboards you configure rather than code. This release adds three things that were not there before: an AI assistant that reads your live data and answers with real dashboard widgets, an MCP endpoint so the agent you already use can read the same data, and single sign-on with a durable login audit behind it.

##### AI assistant

* **Ask about your system in plain language and get an answer built from real widgets, not just text.** A launcher on the right edge opens a chat; the assistant reads live data and streams back an ordered narrative with inline charts, top-N lists and tables drawn by the same components the dashboards use. Open it as a side drawer, expand it to a full page, or give it its own tab.
* **Read-only, and it inherits your permissions.** It lists services, reads active alarms, browses each layer's metric catalog, drills a service down to its instances and endpoints and charts any of it — never seeing more than you can, and never changing configuration, rules or dashboards.
* **It embeds the real product views, scoped to what you asked about.** Topology, traces, logs, browser errors, deployment, API dependencies, instance map or a cross-layer hierarchy mount inside the chat with their interactions intact — click a trace and its span waterfall opens. Native SkyWalking and Zipkin tracing are both covered.
* **Everything it shows is a snapshot, and says so.** Each block carries a replay badge and its capture time, and re-renders identically when you reopen the conversation rather than quietly re-querying and showing today's data under yesterday's question.
* **It can propose profiling, and only you start it.** When metrics and traces cannot localise a cause it presents a decision card explaining what it found and what profiling would reveal. Nothing runs until you approve it, and only if you hold the permission; the result — flame graph, profiled trace waterfall, or network conversation graph — renders inline once collected.
* **Guided root-cause analysis** follows built-in investigation playbooks — a master method plus latency, error-rate, saturation, middleware, Kubernetes-workload and service-mesh specialisations — including following a service down into the infrastructure layer behind it. It answers in each layer's own vocabulary, calling a Kubernetes instance a Pod and a mesh instance a Sidecar, and reads your configured warning thresholds rather than guessing what "healthy" means.
* **Bring your own model.** Off by default, vendor-neutral, configured by an administrator: any OpenAI-compatible endpoint — hosted, local or a gateway — or Amazon Bedrock. The assistant's instructions and the starter prompts both ship with defaults you can replace entirely. Conversations are kept per user in the browser, unencrypted and labelled as such, with a usage meter, a save toggle and a clear-all.

##### Agent access over MCP

* **The agent you already use can read Horizon.** Point Claude Code, Codex, Claude Desktop or any Model Context Protocol client at Horizon and it gets the same tools the AI assistant uses — metric catalog, figures, topology, traces, logs, Kubernetes, profiling proposals and the root-cause playbooks. The model stays on the caller's side, so no provider and no API key are configured here.
* **It is not a new exposure.** The endpoint needs the same login as every other route, a permission gates the connection, and each tool re-checks the permission its own screen needs. Nothing served over MCP writes anything, and every tool declares itself read-only.
* **An agent can log in through your browser instead of being handed a token.** It opens Horizon's own login page, you approve once on a consent screen, and it keeps its token from there. The screen shows the permissions the grant would really carry, filtered by what you actually hold, so it never promises access you cannot delegate. Off by default.
* A client that can draw gets the real widgets rather than a picture of them; a terminal client reads the data and presents it its own way. A Horizon can name itself, and that name reaches the agent, so production and staging are never told apart by guesswork.

##### Sign-in and access control

* **Sign in with your identity provider** — Google, Okta, Entra, Keycloak or anything else speaking OpenID Connect, with each configured provider becoming a button on the login page. Providers that issue only an access token are supported too. It is additive by design: password login keeps working alongside it, so a misconfigured provider never locks you out during an incident.
* **An identity provider says who you are; it does not decide what you may do here.** New sign-ins are viewers unless you say otherwise, you decide which domains may sign in at all, and per-address and per-domain overrides raise individuals. Horizon shows the display name your directory holds, with the verified address one hover away.
* **An account page, reached by clicking your own name** — who you are, how you proved it, and which roles you hold and what they grant, so "why can I not see this page" has an answer that does not need an administrator. The roles board lists every navigation entry, marks permissions that gate nothing as reserved, and never offers a role an entry it cannot open.
* **API tokens for callers with no browser.** Scripts, CI jobs and agents authenticate under exactly the permissions each route requires; a token names a user, can never carry more than that user currently holds, and is revoked by removing the user.
* **What one session read never reaches the next person on that browser.** Signing out, signing in, or a session ending mid-use discards everything cached. Shortening the session timeout now shortens the sessions you already have, not just new ones.
* *Fixes*: sign-in accepts up to 64 characters for username and password and the form stops at the same limit; the sign-in card no longer runs off the edge below roughly 410px; source-map upload and removal are disabled with the reason on hover for operators lacking `source-map:write`, and removal now asks first.

##### Login audit

* **A durable record of who signed in, when, and from where** — optional, off by default, backed by a shared database rather than a file. An hourly summary stacked by sign-in method comes first, then filters, then the list.
* **It records only what a valid credential produced** — successful sign-ins plus the two refusals that happen after authentication already succeeded. A wrong password or unknown user stays in the application log, because those are what an anonymous caller can produce at will. Nothing that could resume a session is ever recorded.
* **Signing in never waits for the database and cannot be blocked by it.** Records are written in the background; an unreachable database is invisible to the person signing in, and the page says it cannot be reached rather than showing an empty table.
* **Token traffic is counted on its own tab, at its own grain** — one row per token per hour, because stacking machine traffic beside human sign-ins let a busy script outweigh every person next to it. Reading the log needs its own permission that a wildcard does not grant, since it holds verified email and client addresses; there is no write and no delete.
* *Fixes*: a failing statistics write no longer reports the store as healthy — each write schedule is tracked separately, so the store reads unhealthy for as long as anything is failing. A failed audit write is dropped rather than retried or held, so memory does not grow for the length of an outage.

##### Dashboards

* **Layer dashboards are configuration, not code.** Every layer's screens are defined by a template you edit in the console — widgets, scopes, service-list columns, thresholds and labels — and published to your backend. Forty-six bundled dashboards ship ready to use.
* **A layer's Service, Instance and Endpoint views can each carry more than one page**, each with its own URL and widgets, so a layer's metrics need not share one screen. A page can name the entity it lists — "Brokers" rather than "Instances" — and narrow which services or instances it covers.
* **A new tab widget packs related views into one grid slot**, each tab its own small dashboard. Only the active tab is queried, so an unopened tab costs nothing.
* **The dashboard editor works beside the canvas** — picking a widget kind is a menu with descriptions, the editor pins next to the board and opens complete, and adding a widget scrolls it into view. Rows under a layer can be dragged into your own order in a live preview of the real menu.
* **Publishing refuses a template that would break the layer**, naming the field at fault and writing nothing, rather than storing it and emptying that layer's screen for everyone. Work in progress still publishes, since a half-filled section is a normal state of an unfinished draft.
* **Click a latency or error point on a chart to open the matching traces**, pre-filtered to that service and centred on the bucket you clicked, opening slowest-first or error-only depending on the metric. Cards can render values as coloured status chips rather than bare numbers, and overview dashboards roll up a whole layer with per-widget control over the aggregation and ranking.

##### Traces, logs and events

* **A trace explorer with a duration-distribution scatter, a time-positioned waterfall and a span detail modal** — and Zipkin traces render with the same experience as native ones, including plain-language hints for Zipkin's annotation codes. One shareable link opens either kind.
* **Logs and browser errors query on demand.** Conditions stage until you press Run query, so a fresh tab prompts you rather than firing a broad query. Stored logs can be searched by content where the backend supports it, with the field appearing only on a backend that can actually answer it.
* **Cross-layer inspection for raw logs, browser errors and Kubernetes pod logs.** Browser errors carry source-map upload and de-obfuscation back to the original frames with a source snippet; pod logs tail a container on demand and are never stored.
* **A per-service events popout on every layer's service banner** — agent restarts, Kubernetes events and other lifecycle records — one row per instance on a time axis, with a search box for services running hundreds of them.
* *Fixes*: a custom time range that cannot be read is now refused with the reason under the control, instead of being swapped silently for a default window so the results answer a question nobody asked. Switching service no longer leaves the previous service's endpoints, instances or profiling segments on screen — dependent lists clear immediately, and a slow reply for a selection you have moved off is discarded rather than overwriting the current one.

##### Profiling

* **Five kinds of profiling in one place** — trace sampling, async-profiler for JVM services, pprof for Go services, eBPF on/off-CPU, and network profiling — each with a task list, a create dialog that says upfront what it needs, and a flame graph or conversation graph for the result.
* **Continuous profiling has a home.** Arm a policy once and the task starts itself when a process crosses a threshold, with nobody present. Each target lists the instances and processes actually being evaluated and how often each has fired — the difference between a policy that is stored and one that is working.
* A task a policy started is visible beside the ones you started by hand, newest first. A profiling request that cannot be honoured is refused with the reason rather than quietly repaired into something more expensive. Kubernetes services gain network profiling.

##### Languages, look and feel

* **The whole console speaks eight languages** — English plus German, Spanish, French, Japanese, Korean, Portuguese and Simplified Chinese. Product, protocol and metric names stay in their original form, because those are what operators read across the docs, the source and every other SkyWalking surface.
* **Dashboard text is translated in the console**, per language, on a page showing what the site actually renders rather than the shipped defaults — with staged drafts, a diff before you publish, and a reset to bundled. A translation belongs to its widget rather than its position, so rearranging a dashboard leaves every other widget's translation where it was.
* Escape closes any dismissible panel; searchable on-theme dropdowns replace the browser's native controls wherever a picker lists more than a handful of entries; Kubernetes tables are denser. The live debugger reads cleanly on tall and wide captures, with the frozen first column pinned as you scroll sideways, and a step that dropped a record says why in the backend's own words.

##### Operating Horizon

* **The container image runs on environment variables alone** — no mounted configuration file, no repackaging — and the shipped configuration file doubles as the complete, self-documenting reference for every variable. Serving Horizon under a path prefix is a first-class option.
* **Run against a backend whose template store you cannot write**, rendering every dashboard from the bundled templates and never calling the template API. The configuration surface becomes honestly read-only while metrics, traces, logs and topology work exactly as before — the supported way to run against an OAP release with no template management endpoint.
* **Cluster Status reports what is actually reachable**, testing the real path each feature calls rather than inferring health from configuration being present, so a module that is loaded but broken reads as unreachable instead of a misleading green.
* **Configuration hot-reloads, and a rejected reload says so out loud**, naming the field at fault and continuing to serve the last valid configuration. Query fan-out is tunable per deployment — batch sizes, concurrency and protective caps — with defaults matching the built-in behaviour.
* **A strict content policy ships by default**, permitting scripts only from Horizon's own origin, forbidding inline script and refusing to be framed. Responses are not cached by the browser, so metrics, traces, logs and configuration are not left behind on a shared workstation, while the console's own files stay cacheable. Outbound documentation links are restricted to hosts you trust.
* **A duplicated dashboard record is reported, never resolved behind your back.** A dashboard whose definition is ambiguous is hidden rather than rendered from whichever copy happened to win, and opening it by URL explains why and points at where to fix it.
* *Fixes*: the DSL editor asks before deleting a rule that has no bundled version and warns before you navigate away with unsaved YAML; the alarms and events Custom range applies on Apply rather than as soon as you open it; the OAL file viewer no longer strands you on an expired session; and `cli:hash` completes when you press Enter instead of waiting for end-of-input.

Full release notes are [here](https://github.com/apache/skywalking-horizon-ui/releases/tag/v1.0.0).
