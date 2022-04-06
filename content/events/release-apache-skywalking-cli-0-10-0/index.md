---
title: "Release Apache SkyWalking CLI 0.10.0"
date: 2022-04-06
author: SkyWalking Team
description: "Release Apache SkyWalking CLI 0.10.0"
---

SkyWalking CLI 0.10.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

### Features

- Allow setting `start` and `end` with relative time (#128)
- Add some commands for the browser (#126)
- Add the sub-command `service layer` to query services according to layer (#133)
- Add the sub-command `layer list` to query layer list (#133)
- Add the sub-command `instance get` to query single instance (#134)
- Add the sub-command `endpoint get` to query single endpoint info (#134)
- Change the GraphQL method to the v9 version according to the server version (#134)
- Add `normal` field to Service entity (#136)
- Add the command `process` for query Process metadata (#137)
- Add the command `profiling ebpf` for process ebpf profiling (#138)
- Support `getprofiletasklogs` query (#125)
- Support query list alarms (#127)
- [Breaking Change] Update the command `profile` as a sub-command `profiling trace`, and update `profiled-analyze` command to `analysis` (#138)
- `profiling ebpf/trace analysis` generates the profiling graph HTML on default and saves it to the current work directory (#138)

### Bug Fixes

- Fix quick install (#131)
- Set correct go version in publishing snapshot docker image (#124)
- Stop build kit container after finishing (#130)

### Chores

- Add cross platform build targets (#129)
- Update download host (#132)
