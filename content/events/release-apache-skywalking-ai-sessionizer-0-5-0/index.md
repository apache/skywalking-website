---
title: Release Apache SkyWalking AI Sessionizer 0.5.0
date: 2026-09-24
author: SkyWalking Team
description: "Release Apache SkyWalking AI Sessionizer 0.5.0."
---

SkyWalking AI Sessionizer 0.5.0 is released. Go to [downloads](/downloads) page to find release tars.

Changes by Version

0.5.0
------------------

#### LangChain and LangGraph

* asz assembles conversations from an agent built on LangChain or LangGraph, without changing the application. The new `langsmith-ingest` adapter receives what LangChain's own tracing client sends, and every LangChain application already carries that client. Four environment variables are the whole setup. [LangChain and LangGraph](/docs/skywalking-ai-sessionizer/v0.5.0/en/setup/langchain/) gives them.
* What each model call was sent, and what came back, lands beside the conversation as a provider body, as Claude Code's bodies do. On the captured corpus, a twenty-turn conversation lands at 13% of its size on the wire, bodies included.
* A run is posted when it starts and patched when it ends, and both count as one call. A slow turn is visible before it finishes, and a process that died mid-turn still leaves what it had reported.
* Ownership is a namespace, not a thread key, so two applications can both use the thread `123` in the project `production`. A thread key is never used as a file path.
* A new plugin, `apache-skywalking-asz-langchain`, records what each of an agent's tool calls changed on disk. The application imports nothing, and the plugin adds 0.01 s to interpreter start when it is off. [LangChain Plugin](/docs/skywalking-ai-sessionizer/v0.5.0/en/setup/langchain-plugin/) gives the setup.
* `asz-changes` records the tool calls of any runtime, not only Claude Code's. `tools.scope` takes an exact name, a regular expression beginning `re:`, or `*`, with an `exclude` list in the same forms.
* `asz glossary` takes a dialect, and `asz conversation -terms native` uses the words of the runtime a session came from.
* The Claude Code token metric counts Claude Code's calls only. A LangChain conversation in the same root was counted into it.

#### Renamed

The change recorder is no longer Claude Code's alone, and its names now say so. These changes break existing setups on purpose, because the project is before 1.0. [Upgrading from 0.4.0](/docs/skywalking-ai-sessionizer/v0.5.0/en/setup/install/#upgrading-from-040) gives the steps in order.

* The binary `asz-claude-plugin` is now `asz-changes`. So is the Debian package `asz-claude-code`.
* One Homebrew formula, `asz`, installs both binaries. Run `brew uninstall asz-claude-code`.
* The Claude Code plugin is now `file-changes`. The installer copies its data across, so nothing is lost by upgrading.
* The adapter `claude-code-changes` is now `changes`. A configuration that still names it keeps working.

#### Install

* Homebrew 7 loads a tap that is not its own only after `brew trust`. [Install](/docs/skywalking-ai-sessionizer/v0.5.0/en/setup/install/#homebrew-on-macos-and-linux) now runs `brew trust https://github.com/apache/skywalking-ai-sessionizer` before `brew tap`.
* The install scripts put `asz-changes` beside `asz`, as Homebrew and apt do.

All issues and pull requests are [here](https://github.com/apache/skywalking-ai-sessionizer/milestone/4?closed=1)
