---
title: Release Apache SkyWalking BanyanDB Java Client 0.9.1
date: 2025-10-15
author: SkyWalking Team
description: "Release Apache SkyWalking BanyanDB Java Client 0.9.1"
---

SkyWalking BanyanDB 0.9.1 is released. Go to [downloads](/downloads) page to find release tars.

### Features

- Bump up the API to support sharding_key.
- Bump up the API to support version 0.9.
- Support stage query on TopN.
- Add replicas configuration to the API: introduce `replicas` in LifecycleStage and ResourceOpts to support high availability.
- Simplify TLS options: remove unsupported mTLS client certificate settings from Options and DefaultChannelFactory; trust CA is still supported.
- Support auth with username and password.
- Update gRPC to 1.75.0.
- Add histogram metrics to write/insert/update operations of the measure, stream and property. 
- Bump up parent Apache pom to v35.
- Bump up maven to 3.6.3.
- Add IDEA setup doc to support super large generated file(by protoc).
- Add Trace model.
