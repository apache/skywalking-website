---
title: Release Apache SkyWalking Rover 0.6.0
date: 2024-03-31
author: SkyWalking Team
description: "Release Apache SkyWalking Rover 0.6.0"
---

SkyWalking Rover 0.6.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

#### Features
* Enhance compatibility when profiling with SSL.
* Update `LabelValue` obtain pod information function to add default value parameter.
* Add `HasOwnerName` to judgement pod has owner name.
* Publish the `latest` Docker image tag.
* Improve the stability of Off CPU Profiling.
* Support collecting the access log from Kubernetes.
* Remove the scanner mode in the process discovery module.
* Upgrade Go library to `1.21`, eBPF library to `0.13.2`.
* Support using `make docker.debug` to building the debug docker image.

#### Bug Fixes

#### Documentation
* Update architecture diagram.
* Delete module design and project structure document.
* Adjust configuration modules during setup.

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/185?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-rover/milestone/6?closed=1)