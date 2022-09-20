---
title: "Release Apache SkyWalking CLI 0.11.0"
date: 2022-09-20
author: SkyWalking Team
description: "Release Apache SkyWalking CLI 0.11.0"
---

SkyWalking CLI 0.11.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

* Add `.github/scripts` to release source tarball by @kezhenxu94 in https://github.com/apache/skywalking-cli/pull/140
* Let the eBPF profiling could performs by service level by @mrproliu in https://github.com/apache/skywalking-cli/pull/141
* Add the sub-command for estimate the process scale by @mrproliu in https://github.com/apache/skywalking-cli/pull/142
* feature: update install.sh version regex by @Alexxxing in https://github.com/apache/skywalking-cli/pull/143
* Update the commands relate to the process by @mrproliu in https://github.com/apache/skywalking-cli/pull/144
* Add layer to event related commands by @fgksgf in https://github.com/apache/skywalking-cli/pull/145
* Add layer to events.graphql by @fgksgf in https://github.com/apache/skywalking-cli/pull/146
* Add layer field to alarms.graphql by @fgksgf in https://github.com/apache/skywalking-cli/pull/147
* Upgrade crypto lib to fix cve by @kezhenxu94 in https://github.com/apache/skywalking-cli/pull/148
* Remove `layer` field in the `instance` and `process` commands by @mrproliu in https://github.com/apache/skywalking-cli/pull/149
* Remove `duration` flag in `profiling ebpf schedules` by @mrproliu in https://github.com/apache/skywalking-cli/pull/150
* Remove `total` field in `trace list` and `logs list` commands by @mrproliu in https://github.com/apache/skywalking-cli/pull/152
* Remove `total` field in `event list`, `browser logs`, `alarm list` commands. by @mrproliu in https://github.com/apache/skywalking-cli/pull/153
* Add `aggregate` flag in `profiling ebpf analysis` commands by @mrproliu in https://github.com/apache/skywalking-cli/pull/154
* event: fix event query should query all types by default by @kezhenxu94 in https://github.com/apache/skywalking-cli/pull/155
* Fix a possible lint error and update CI lint version by @JarvisG495 in https://github.com/apache/skywalking-cli/pull/156
* Add commands for support network profiling by @mrproliu in https://github.com/apache/skywalking-cli/pull/158
* Add the components field in the process relation by @mrproliu in https://github.com/apache/skywalking-cli/pull/159
* Trim license headers in query string by @kezhenxu94 in https://github.com/apache/skywalking-cli/pull/160
* Bump up dependency swck version to fix CVE by @kezhenxu94 in https://github.com/apache/skywalking-cli/pull/161
* Bump up swck dependency for transitive dep upgrade by @kezhenxu94 in https://github.com/apache/skywalking-cli/pull/162
* Add the sub-commands for query sorted metrics/records by @mrproliu in https://github.com/apache/skywalking-cli/pull/163
* Add compatibility documentation by @mrproliu in https://github.com/apache/skywalking-cli/pull/164
* Overhaul licenses, prepare for 0.11.0 by @kezhenxu94 in https://github.com/apache/skywalking-cli/pull/165
