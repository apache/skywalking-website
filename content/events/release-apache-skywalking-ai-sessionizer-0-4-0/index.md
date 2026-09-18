---
title: Release Apache SkyWalking AI Sessionizer 0.4.0
date: 2026-09-18
author: SkyWalking Team
description: "Release Apache SkyWalking AI Sessionizer 0.4.0."
---

SkyWalking AI Sessionizer 0.4.0 is released. Go to [downloads](/downloads) page to find release tars.

Changes by Version

0.4.0
------------------

#### Provider bodies

* A new `claude-code-provider` adapter lands the request and response bodies Claude Code writes for its model provider, when `OTEL_LOG_RAW_API_BODIES=file:<dir>` is in its environment: the system prompt, the tool schemas and every message as it was sent, which no transcript holds.
* A landed body keeps only what its session does not hold yet. Each tool definition and every string of 1 KiB or more is stored once by its SHA-256, and the front a body shares with the body before it is one copy. On two captures the landed files were 25.5% and 21.6% of the bytes written, and every body rebuilt byte for byte.
* A round carries the join from a model call to its bodies, so a reader no longer opens the largest files a session holds to draw a conversation. `asz verify` rebuilds every landed body and compares its digest.
* `asz view` draws the prompt: the conversation page gains the inspector's Prompt tab and the route that reads the landed files.

#### Collection

* The collector's default `interval` is 10 minutes; it was 5 seconds. Every pass that finds new records lands new files, so a period of seconds wrote many small files.

#### Install

* The Claude Code plugin installs from a marketplace at a release tag, and the hooks run `asz-claude-plugin` from `PATH`. Each binary package holds `asz` and `asz-claude-plugin` side by side.
* Two install scripts, one for each install: `install/asz.sh` and `install/asz.ps1` for asz, and `install/claude-code-plugin.sh` and `.ps1` for the plugin, each run from the version's tag.
* Homebrew: `brew tap apache/skywalking-ai-sessionizer https://github.com/apache/skywalking-ai-sessionizer`, then `brew install apache/skywalking-ai-sessionizer/asz` and `.../asz-claude-code`. Every release stays installable, because the tap keeps `asz@VERSION` beside the current formula.
* apt, on Debian and Ubuntu: the release ships signed `.deb` packages of `asz` and `asz-claude-code` for AMD64 and ARM64, and `https://skywalking.apache.org/apt` installs them. [Install](/docs/skywalking-ai-sessionizer/v0.4.0/en/setup/install/) gives the commands.
* CI follows the install pages with Claude Code on each platform, and installs the Debian packages with apt.

#### Documentation

* The setup pages say how to install, set up and use asz, and little else. How the plugin, the provider bodies, the export and the commands work inside moved to their own pages.

All issues and pull requests are [here](https://github.com/apache/skywalking-ai-sessionizer/milestone/3?closed=1)
