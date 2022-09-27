---
title: "Release Apache SkyWalking Eyes 0.4.0"
date: 2022-07-11
author: "[SkyWalking Team](/team)"
description: "Release Apache SkyWalking Eyes 0.4.0."
---

SkyWalking Eyes 0.4.0 is released. Go to [downloads](/downloads) page to find release tars.

- Reorganize GHA by header and dependency. (#123)
- Add rust cargo support for dep command. (#121)
- Support license expression in dep check. (#120)
- Prune npm packages before listing all dependencies (#119)
- Add support for multiple licenses in the header config section (#118)
- Add `excludes` to `license resolve` config (#117)
- maven: set `group:artifact` as dependency name and extend functions in summary template (#116)
- Stablize summary context to perform consistant output (#115)
- Add custom license urls for identification (#114)
- Lazy initialize GitHub client for comment (#111)
- Make license identifying threshold configurable (#110)
- Use Google's licensecheck to identify licenses (#107)
- dep: short circuit if user declare dep license (#108)
