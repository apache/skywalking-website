---
title: "Release Apache SkyWalking CLI 0.16.0"
date: 2026-11-10
author: SkyWalking Team
description: "Release Apache SkyWalking CLI 0.16.0"
---

SkyWalking CLI 0.16.0 is released. Go to [downloads](/downloads) page to find release tars.

### Bug Fixes

* Upgrade `golang.org/x/net` to v0.62.0 (with `golang.org/x/crypto` v0.58.0, `golang.org/x/text` v0.43.0 and `golang.org/x/sys` v0.49.0) to fix GO-2026-6860 and GO-2026-6866.
* Fix the `actions/setup` GitHub Action installing Go 1.24, older than the Go 1.26 that `go.mod` requires.
