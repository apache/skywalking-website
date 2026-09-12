---
title: "Beyond Agent Replay: Metrics and Change Detection in SkyWalking"
date: 2026-09-12
author: Sheng Wu
description: "Apache SkyWalking moves beyond local AI agent replay with metrics dashboards and change detection: understand agent usage, find conversations, and inspect the file changes recorded during their work."
tags:
  - AI
  - Engineering
  - Community
---

In our [first look at Apache SkyWalking AI Sessionizer](/blog/2026-09-03-ai-sessionizer-first-look/), we started with a conversation already on your machine. You could replay its messages, inspect tool calls, and follow child agents through a long task. Remote observation and metrics dashboards were still on the agenda.

Since then, **SkyWalking has gained two capabilities around that replay experience: metrics dashboards for understanding agent usage, and change detection for inspecting what happened to the files an agent worked on**. Collected conversations can now be stored centrally and explored alongside agent metrics, extending the experience beyond the machine where a task ran.

Together, these capabilities help answer questions at different scales. Where is token usage going across our agents and machines? What happened in a particular conversation? Which files changed during that work, and what discussion and tool activity surrounded those changes?

The screenshots below come from our own development work. They show the progress from local replay toward observing AI agent work in SkyWalking as a whole.

## See where agent usage is going

One conversation can explain a task in detail. Metrics make activity across many tasks visible over time.

The **AI Agent Overview** brings daily and hourly token heatmaps together with totals and a ranking of reporting agents. It gives you a place to start when reviewing usage: find busy periods, see which agents report the most tokens, and decide where to look more closely.

![SkyWalking's AI Agent Overview, showing daily and hourly token heatmaps and reporting agent services.](ai-agent-overview.png)
*Figure 1: Daily and hourly heatmaps show how token usage develops over time. The footer makes coverage explicit: this example includes the eight busiest of nine reporting services.*

Agent dashboards then break usage down by **token type, model, and main agent or subagent**, with cache read share alongside them. Input, output, cache reads, and cache creation appear separately, making it easier to understand what contributes to a large token total. You can also inspect the same metrics for an individual agent runtime, such as the collector running on one machine.

For example, a rise in usage gives you a reason to compare models, look at main-agent and subagent activity, and examine the token types involved. The runtime view helps narrow that investigation to the machine reporting the activity. These are useful views for a team operating several agents, as well as for a developer reviewing their own usage over a week.

The available measurements depend on the data you collect. Existing Claude Code transcripts provide a subset of token metrics. With Claude Code's own telemetry exporter configured, the dashboards can also show reported cost by model, active time, sessions started, lines added and removed, commits, pull requests, and edit permission decisions. Those additional widgets appear when their metrics are reported; values are not estimated from conversation text.

The [AI Agents dashboard guide](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/dashboards/ai_agent/) explains the metrics and collection options, including how to select one token-reporting path so the same activity is not counted twice. The services shown in an overview reflect the telemetry being reported; conversation replay currently has a Claude Code adapter, with Codex and LangChain/LangGraph adapters still planned.

## Find the conversations behind the activity

Once a period or agent deserves a closer look, the **Conversations** tab lets you search the collected conversations for that agent. Set the conversation query's time range and filter by runtime, title text, or conversation ID, then open a conversation in its own tab.

![SkyWalking's AI Agents Conversations tab with runtime and title filters, activity counts, and recorded change totals.](conversation-list.png)
*Figure 2: The conversation list summarizes talks, model calls, subagents, Bash runs, and recorded changes before you open an individual task.*

This is the replay experience from the first post, now available through SkyWalking's central UI. You can read the transcript beside its execution timeline, explore delegated work, and inspect the evidence behind a tool call. The address retains the selected talk, step, and stream, so a colleague with the required access can open the same position.

Metrics and conversations serve different parts of the investigation. Dashboards show usage patterns over time; the conversation records the requests, responses, and operations within a task. You can select the relevant agent and time range, find a conversation, and examine its work without returning to the originating machine.

## See which files changed during the work

Replay now reaches into the workspace as well. A conversation carries recorded file changes, giving you a way to connect the discussion and tool activity with edits to actual files.

Open the **Changes** count in the conversation header to see affected files grouped by workspace root. Each file lists its recorded changes. Select one to jump to the associated tool step and open its change inspector.

![The conversation-wide Workspace changes panel, grouping recorded edits by workspace and file.](workspace-changes-featured.png)
*Figure 3: This development conversation contains 93 change records across 39 files. Each linked record opens the tool step associated with that observation.*

The example is a conversation about adding the very agent dashboards and change inspection shown in this post. Its file list includes the planning document, dashboard templates, documentation, and changelog. Repeated edits remain visible under each path, so you can follow how a file evolved through the task without searching every mention in the transcript.

The count describes **recorded observations**. Several calls can edit one file, and separate sources can record the same call. Line totals can therefore include repeated changes to the same lines; use the individual diffs to inspect the work, and Git to review the final net change.

## Read an edit in the context of the conversation

Tool cards and timeline steps now show change indicators. Expand a card to see affected paths, operations, and line counts, then expand a file to read its unified diff. A larger inspector gives longer diffs room to read alongside the conversation.

![A Write tool's Changes inspector, showing the reported patch, its source location, and a unified diff.](tool-change-inspector.png)
*Figure 4: A recorded Write operation revises the planning document. The inspector shows the patch, its capture source and time, and a link to the supporting evidence.*

Here, the diff captures a revision to the plan after checking the repositories. The surrounding transcript retains the user's request and the agent's response. You can read what changed together with the discussion that led up to it, then inspect the recorded tool call and result.

Changes are linked through the **tool-use ID**. Each record also retains its capture source, so a patch reported by Claude Code and a workspace scan made around a shell command remain distinguishable. The [conversation replay documentation](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/operate/ai-agent-conversations/#changes) describes the change indicators, file list, and inspector.

## Include shell commands and delegated edits

The starting point remains straightforward: collecting existing Claude Code history requires no plugin or configuration changes in Claude Code. Successful editing calls such as `Edit` and `Write` can already carry native patches, which are extracted during collection. An older collection needs to be collected again to gain these records; reopening it in a newer viewer is not enough.

For broader capture, the optional **asz-changes** plugin adds before-and-after workspace scans around shell tools such as `Bash`, `PowerShell`, and `Monitor`, plus reported editing patches from subagents. This brings changes made by scripts and delegated work into the same inspection experience. Shell snapshots are available for activity observed while the plugin is installed.

The view also preserves capture limits. Overlapping tool windows can mark changes as **shared**, and changes detected between calls appear as **Changes outside observed tool windows**. Skipped or partial scans remain identifiable, and binary or oversized files may have paths and hashes without a text diff. A scan establishes what changed within its observation window; concurrent work can prevent attribution to one tool alone. See the [plugin guide](https://skywalking.apache.org/docs/skywalking-ai-sessionizer/next/en/setup/claude-code-plugin/) for the capture rules.

## Try it with your own agent work

These capabilities are available in development toward **AI Sessionizer 0.3.0, OAP 11.1, and Horizon UI 1.1**. Sessionizer collects the local evidence and exports it to SkyWalking, where OAP stores the data and Horizon provides the dashboards and conversation views. The collected evidence retains the connections between conversations, tools, and file changes throughout that path.

To start locally, follow the [quick start](https://skywalking.apache.org/docs/skywalking-ai-sessionizer/next/en/setup/quick-start/) to build Sessionizer, then run:

```sh
./bin/asz server
```

Open [http://127.0.0.1:8787](http://127.0.0.1:8787). The command has changed since the first post: `asz server` now runs collection and the local viewer, while `asz view` reads an existing collection. To capture additional shell and subagent changes in a new Claude Code session, launch it from the Sessionizer checkout with:

```sh
claude --plugin-dir plugins/claude-code
```

For centralized inspection, configure `export.otlp.endpoint` in `asz.yaml` and use compatible development builds of OAP and Horizon. The [export guide](https://skywalking.apache.org/docs/skywalking-ai-sessionizer/next/en/setup/export-otlp/) and [backend conversation guide](https://skywalking.apache.org/docs/main/next/en/setup/backend/ai-agent-conversation/) cover that setup. Choose your metrics source using the dashboard guide above, then open **AI Agents** in SkyWalking.

Start with a period of agent activity you know well. Review its token usage, find a conversation from that period, and inspect the files changed during the work. The first article made a recorded agent session navigable. Metrics dashboards and change detection now put that session in a wider context: the resources agents use and the workspace changes recorded along the way.
