---
title: Release Apache SkyWalking Kubernetes Helm Chart 4.3.0
date: 2022-09-20
author: SkyWalking Team
---

SkyWalking Kubernetes Helm Chart 4.3.0 is released. Go to [downloads](/downloads) page to find release tars.

* Fix hasSuffix replace hasPrefix by @geffzhang in https://github.com/apache/skywalking-kubernetes/pull/86
* Add "pods/log" permission to OAP so on-demand Pod log can work by @kezhenxu94 in https://github.com/apache/skywalking-kubernetes/pull/87
* add .Values.oap.initEs to work with ES initial by @williamyao1982 in https://github.com/apache/skywalking-kubernetes/pull/88
* Remove Istio adapter, add changelog for 4.3.0 by @kezhenxu94 in https://github.com/apache/skywalking-kubernetes/pull/89
* Bump up helm chart version by @kezhenxu94 in https://github.com/apache/skywalking-kubernetes/pull/90
