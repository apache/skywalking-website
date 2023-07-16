---
title: Release Apache SkyWalking Kubernetes Helm Chart 4.5.0
date: 2023-07-16
author: SkyWalking Team
---

SkyWalking Kubernetes Helm Chart 4.5.0 is released. Go to [downloads](/downloads) page to find release tars.

- Add helm chart for swck v0.7.0.
- Add `pprof` port export in satellite.
- Trunc the resource name in swck's helm chart to no more than 63 characters.
- Adding the `configmap` into cluster role for oap init mode.
- Add config to set Pod securityContext.
- Keep the job name prefix the same as OAP Deployment name.
- Use startup probe option for first initialization of application
- Allow setting env for UI deployment.
- Add Istio ServiceEntry permissions.
