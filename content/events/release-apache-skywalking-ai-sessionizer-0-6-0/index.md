---
title: Release Apache SkyWalking AI Sessionizer 0.6.0
date: 2026-10-25
author: SkyWalking Team
description: "Release Apache SkyWalking AI Sessionizer 0.6.0."
---

SkyWalking AI Sessionizer 0.6.0 is released. Go to [downloads](/downloads) page to find release tars.

Changes by Version

0.6.0
------------------

#### Kiro

* A new adapter, `kiro-local`, collects the sessions Kiro's V3 agent engine writes under `~/.kiro`: kiro-cli started with `--v3`, and Kiro Crew on its `kas` backend. It is on by default and needs nothing from Kiro. [Kiro](/docs/skywalking-ai-sessionizer/v0.6.0/en/setup/kiro/) gives the setup.
* A Kiro subagent is joined to the parent that started it, and a compaction is a context reset with its summary. Kiro records no token counts, so no token metric is derived for it.

#### Retention

* A storage root no longer only grows. `storage.retention.metadata_only_after`, off by default, removes the landed files of a conversation that has been idle that long, and keeps a skeleton of each: who did what, when, in what order and at what cost. On one root, 847.5 MB of landed files had skeletons of 29.6 MB.
* `storage.retention.retire_after`, off by default and at least as long, removes everything of an idle conversation and retires it. A retired conversation is never collected again.
* [Retention](/docs/skywalking-ai-sessionizer/v0.6.0/en/formats/storage-root/#retention) gives the rules.

#### Withholding what the runtime sent the model

* The Claude Code and LangChain adapters name the system prompt and the tool schemas the runtime sent. They are named by the shape of the record, never by its text.
* `view.hide` lists what `asz view` and `asz server` withhold. An operator can then serve a conversation to the people the agent served, without the system prompt or the tool schemas. A withheld step keeps its place and its size, and loses its text. [Configuration](/docs/skywalking-ai-sessionizer/v0.6.0/en/setup/configuration/#view) gives the keys.

#### MCP calls

* A call to an MCP server names its server and its tool.
* The Claude Code plugin records each call to an MCP server: the server, how the call ended, the time measured around it, and the size and SHA-256 of the arguments and of the answer, never their text.
* The page draws these calls on their own lane, with an Execution tab. Two new metrics count them, `agent.mcp.calls` and `agent.mcp.duration`.

#### Where a model call's history changed

* Each model call records the message list its request was sent, and is compared with the call before it. Where the history changed, the page draws a `history.change` card just before the call. It says how many messages were kept, changed, dropped and added. This works for Claude Code with provider bodies, including the provider threads Claude Code 2.1.302 continues, and for LangChain. [Session Flow](/docs/skywalking-ai-sessionizer/v0.6.0/en/formats/session-flow/) gives the rules.

#### LangChain and LangGraph

* A LangChain JS or LangGraph JS application lands as a Python one does. Its client writes times and messages in other shapes, and every run it sent was refused before.
* A summary that `SummarizationMiddleware` wrote resets the context, as a Claude Code compaction does.
* A run whose conversation can no longer be found is not collected. It used to land under a name for runs with no identity supplied, which put the evidence of one conversation into another.
* The Prompt tab shows a LangChain call's messages in LangChain's own words: `system`, `human`, `ai` and `tool`.

#### Claude Code

* The question of a headless run is on the page. `claude -p` and Agent SDK applications write their prompt in a shape that was not read as a person's input.
* A tool result that holds an image beside its text keeps the image.

#### Collection and export

* A landed file fits `max_delta_bytes`. A single record larger than the budget lands alone, and its largest payloads are taken out, with their size and SHA-256 kept.
* One command writes to a storage root at a time.
* A session is sent to one owner: the endpoint, the service name and the instance it was first sent under. After any of them changes, a session sent before is held, and every pass says why.
* No landed line holds a byte that is not valid UTF-8, which an OpenTelemetry receiver refuses.

#### Conversation model

* A sub-agent's result leads back to the call that started it, by a new `result_of` relation. Every child used to read as a dead end.
* Two different entities can no longer get one id. On a local root, 3,637 of 357,841 ids moved. The next round of an existing conversation writes them again under the new ids, and nothing is landed again.
* The document lists what happened in the order it happened, never by id.
* A segment is an activity window only. In `asz.view` it keeps `id`, `talks`, `from` and `to`.

#### Renamed and removed

The project is before 1.0, and these changes break existing setups on purpose.

* `claude_code.token.usage` is now `agent.token.usage`. A receiver's rules must read the new name.
* The `claude-code-otlp` receiver is removed. Every metric asz sends is derived from the landed files. Point Claude Code's own exporter at a receiver that reads it, such as the SkyWalking OAP.
* Metrics are one section of the configuration, `metrics`, on by default with a look-back of 72 hours. They are derived only when they will be sent. The adapter keys `metrics` and `metrics_lookback` are ignored.

#### Container image

* The image owns its storage root, `/asz/data`. The first collection into a new volume no longer fails with `permission denied`.

All issues and pull requests are [here](https://github.com/apache/skywalking-ai-sessionizer/milestone/5?closed=1)
