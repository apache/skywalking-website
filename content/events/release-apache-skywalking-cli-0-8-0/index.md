---
title: "Release Apache SkyWalking CLI 0.8.0"
date: 2021-09-18
author: SkyWalking Team
description: "Release Apache SkyWalking CLI 0.8.0"
---

SkyWalking CLI 0.8.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

- Features
    - Add profile command
    - Add logs command
    - Add dependency command
    - Support query events protocol
    - Support auto-completion for bash and powershell

- Bug Fixes
    - Fix missing service instance name in trace command

- Chores
    - Optimize output by adding color to help information
    - Set display style explicitly for commands in the test script
    - Set different default display style for different commands
    - Add scripts for quick install
    - Update release doc and add scripts for release
    - split into multiple workflows to speed up CI