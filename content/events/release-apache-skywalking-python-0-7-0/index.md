---
title: "Release Apache SkyWalking Python 0.7.0"
date: 2021-09-13
author: SkyWalking Team
description: "Release Apache SkyWalking Python 0.7.0."
---

SkyWalking Python 0.7.0 is released. Go to [downloads](/downloads) page to find release tars.

- Feature:
  - Support collecting and reporting logs to backend (#147)
  - Support profiling Python method level performance (#127
  - Add a new `sw-python` CLI that enables agent non-intrusive integration (#156)
  - Add exponential reconnection backoff strategy when OAP is down (#157)
  - Support ignoring traces by http method (#143)
  - `NoopSpan` on queue full, propagation downstream (#141)
  - Support agent namespace. (#126)
  - Support secure connection option for GRPC and HTTP (#134)

- Plugins:
  - Add Falcon Plugin (#146)
  - Update `sw_pymongo.py` to be compatible with cluster mode (#150)
  - Add Python celery plugin (#125)
  - Support tornado5+ and tornado6+ (#119)

- Fixes:
  - Remove HTTP basic auth credentials from log, stacktrace, segment (#152)
  - Fix `@trace` decorator not work (#136)
  - Fix grpc disconnect, add `SW_AGENT_MAX_BUFFER_SIZE` to control buffer queue size (#138)

- Others:
  - Chore: bump up `requests` version to avoid license issue (#142)
  - Fix module `wrapt` as normal install dependency (#123)
  - Explicit component inheritance (#132)
  - Provide dockerfile & images for easy integration in containerized scenarios (#159)
