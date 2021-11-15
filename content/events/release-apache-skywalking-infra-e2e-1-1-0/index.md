---
title: Release Apache SkyWalking Infra E2E 1.1.0
date: 2021-11-15
author: SkyWalking Team
description: "Release Apache SkyWalking Infra E2E 1.1.0"
---

SkyWalking Infra E2E 1.1.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

#### Features
* Support using `setup.init-system-environment` to import environment.
* Support `body` and `headers` in http trigger.
* Add `install` target in makefile.
* Stop trigger when cleaning up.
* Change interval setting to Duration style.
* Add reasonable default `cleanup.on`.
* Support `float` value compare when type not match
* Support reuse `verify.cases`.
* Ignore trigger when not set.
* Support export `KUBECONFIG` to the environment.
* Support using `setup.kind.import-images` to load local docker images.
* Support using `setup.kind.expose-ports` to declare the resource port for host access.
* Support save pod/container std log on the Environment.

#### Bug Fixes
* Fix that trigger is not continuously triggered when running `e2e trigger`.
* Migrate timeout config to Duration style and wait for node ready in KinD setup.
* Remove manifest only could apply the `default` namespace resource.

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/102?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-infra-e2e/pulls?q=is%3Apr+is%3Aclosed+milestone%3A1.1.0)