---
title: Release Apache SkyWalking AI Sessionizer 0.3.0
date: 2026-09-17
author: SkyWalking Team
description: "Release Apache SkyWalking AI Sessionizer 0.3.0."
---

SkyWalking AI Sessionizer 0.3.0 is released. Go to [downloads](/downloads) page to find release tars.

This is the first Apache release of AI Sessionizer, voted by the SkyWalking PMC. It ships a signed source package and signed binary packages for macOS, Linux and Windows, on both AMD64 and ARM64. The 0.1.0 and 0.2.0 builds on GitHub came before the vote and are not Apache releases.

Changes by Version

0.3.0
------------------

#### Commands

* `asz collect` runs the whole pipeline in one pass: it lands new records, parses every session that changed, then sends what `export.otlp` asks for. All enabled local adapters are read in the same pass.
* New `asz server` runs the pipeline and the local conversation page in one process, for watching your own conversations.
* `asz view` is now read-only. It serves a storage root that already holds conversations, such as one copied from another machine, and never collects, parses or sends.
* `asz push` makes one pass and exits. `export.otlp.interval` is removed; the collector's `interval` is the only period.
* `asz verify` now reports a lost first or last landed file of a stream against its append cursor, including a new `end gap` line.
* `asz scenario build` keeps building sessions with `--every`, reads several scenario files or a directory, and supports `--pick` and `--seed`. `--remove` sets when a pipeline may delete the sessions a build wrote. Real Claude Code sessions are never removed.

#### Workspace changes

* The files a tool call changed are shown beside its step. The Claude Code adapter records the patch of every `Edit` and `Write` result.
* A new Claude Code plugin records the changes of shell commands and of edits made inside subagents. It ships in every binary package under `claude-code-plugin/`.
* A new `claude-code-changes` adapter, on by default, collects the plugin's records.
* `asz.view` adds `workspace_changes`, joining every change record to its step.

#### Metrics

* `claude-code-local` with `metrics: true` derives `claude_code.token.usage` from the landed files, per minute, by token type, model, query source and session. `metrics_lookback`, 24 hours by default, bounds the first derivation over existing history.
* New `claude-code-otlp` adapter: an OpenTelemetry receiver, over gRPC and HTTP on one port, that Claude Code's own exporter can point at. Metrics can be enabled on only one of the two adapters, so tokens are never counted twice.
* `export.otlp.logs` and `export.otlp.metrics` switch sending of logs and metrics independently.

#### Conversation list and page

* The conversation list shows talks, model calls, subagents, Bash runs and changes with lines added and removed, matching Horizon's conversation list. Later loads reuse cached results until the conversation changes.
* The conversation page is drawn by Horizon's conversation renderer, embedded in the binary, so `asz server` and `asz view` show a conversation the same way the SkyWalking UI does, with no network access. Tool inputs and results appear as fields, edits as line diffs, and the inspector has a Changes tab.

#### Collection

* Landed records keep the provider `model` a call ran on, so per-model metrics can be derived from landed data alone.
* Source JSON keeps its original bytes apart from whitespace, instead of escaping `<`, `>`, `&`, U+2028 and U+2029.
* Parts that are not valid UTF-8 are kept in base64 with `encoding: base64`, instead of losing bytes. The schema stays `sd/1`, and files landed earlier read as before.
* Cursors of source files that Claude Code pruned are now marked `source_gone`, and set back to `active` when a file is restored.

#### Reliability

* A round file is published only when it is complete, read-only and synced, so an interrupted write no longer leaves a truncated `.sf` file that breaks later parses. This also works on exFAT storage on macOS.
* `asz repack` refuses a destination that already holds data.
* Adapter configuration: omitting `enabled` no longer disables a local adapter, and an entry without `exclude` inherits the default `/private/tmp/**` exclusion.
* Token derivation survives interrupted passes and files that are still being written, without overlapping or double-counted windows.
* The Claude Code plugin applies roots, exclusions and content limits to subagent edits. Its `readonly-v2` policy detects writes by command wrappers and writing modes that were skipped before.
* The plugin's hooks start the binary directly, without a shell.

#### Export

* `push.state` records which receiver files were sent to and which files it rejected.
* A receiver's partial success is counted as `rejected` and not retried.
* Over HTTP, a 2xx response counts as sent only when its body is empty or protobuf, and redirects are not followed, so an HTML or login page no longer marks files as sent.

#### Packaging

* Windows ARM64 joins the binary packages, for six platforms in total.
* The container image `ghcr.io/apache/skywalking-ai-sessionizer` is published as `<version>` and `latest` only. New `major.minor` tags are no longer published.
* The source package no longer contains the conversation page's fonts. A build from source draws the page with system fonts, while the binary packages still embed them.

All issues and pull requests are [here](https://github.com/apache/skywalking-ai-sessionizer/milestone/2?closed=1)
