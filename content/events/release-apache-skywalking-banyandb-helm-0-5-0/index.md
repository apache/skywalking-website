---
title: Release Apache SkyWalking BanyanDB Helm 0.5.0
date: 2025-11-01
author: SkyWalking Team
---

SkyWalking BanyanDB Helm 0.5.0 is released. Go to [downloads](/downloads) page to find release tars.

#### Features

- Support Lifecycle Sidecar for automated data management across hot/warm/cold node roles with configurable schedules
- Introduce the data node template system to support different node roles (hot, warm, cold) with role-specific configurations
- Convert liaison component from Deployment to StatefulSet for improved state management and stable network identities
- Implement component-based storage configuration with separate data, liaison, and standalone sections. Enable external data and liaison storage by default with persistent volume claims
- Add headless services for StatefulSet pod discovery and stable network identities, enabling reliable pod-to-pod communication
- Add internal-grpc port 18912 for liaison pod-to-pod communication, enhancing cluster internal networking
- Enable etcd defragmentation by default with daily scheduling (0 0 * * *) to maintain optimal etcd performance
- Enhance pod hostname configuration using headless services for improved service discovery and networking
- Implement volume permissions init containers for proper file ownership and permissions on mounted volumes
- Add the mount target for the trace mode
- Add `auth` to configure the basic credential file.
- Set etcd's reposiotry to "bitnamilegacy". Bitnami removed non-hardened, Debian-based software images in its free tier under https://news.broadcom.com/app-dev/broadcom-introduces-bitnami-secure-images-for-production-ready-containerized-applications

#### Bugs

- Fix missing "trace" mount target in liaison and standalone storage configurations
- Fix typo "observability"

#### Chores

- Bump up e2e test cases.
