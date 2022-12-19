---
title: Release Apache SkyWalking Kubernetes Helm Chart 4.4.0
date: 2022-11-29
author: SkyWalking Team
---

SkyWalking Kubernetes Helm Chart 4.4.0 is released. Go to [downloads](/downloads) page to find release tars.

- [**Breaking Change**]: remove `.Values.oap.initEs`, there is no need to use this to control whether to run init job anymore,
  SkyWalking Helm Chart automatically delete the init job when installing/upgrading.
- [**Breaking Change**]: remove `files/config.d` mechanism and use `values.yaml` files to put the configurations to override
  default config files in the `/skywalking/config` folder, using `files/config.d` is very limited and you have to clone the source
  codes if you want to use this mechanism, now you can simply use our [Docker Helm Chart](https://hub.docker.com/repository/docker/apache/skywalking-helm) to install.
- Refactor oap init job, and support postgresql storage.
- Upgrade ElasticSearch Helm Chart dependency version.
