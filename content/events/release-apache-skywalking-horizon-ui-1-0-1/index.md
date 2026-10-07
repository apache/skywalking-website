---
title: Release Apache SkyWalking Horizon UI 1.0.1
date: 2026-10-07
author: SkyWalking Team
description: "Release Apache SkyWalking Horizon UI 1.0.1."
---

SkyWalking Horizon UI 1.0.1 is released. Go to [downloads](/downloads) page to find release tars.

1.0.1 is 1.0.0 with a binary distribution that starts on Linux, and dependency updates that clear the security advisories open against 1.0.0. It adds no features and needs no configuration change.

##### Operating Horizon

* *Fixes*: **the binary distribution starts on Linux.** The 1.0.0 binary tarball carried a hidden macOS metadata file, named `._<file>`, beside every file; unpacked on Linux, the server stopped at boot with `invalid ELF header` on `._argon2.glibc.node`. The 1.0.1 tarball carries only the release's own files. The 1.0.0 source release and container image were not affected.

##### Dependencies

* **Fastify 5.12.5 and fast-uri 3.1.8 / 4.2.1 clear the security advisories open against 1.0.0.** Horizon keeps `server.trustProxy: 1` (and any other hop count) recording the same client address as on 1.0.0, so no configuration change is needed.
* **hono, qs, ip-address, brace-expansion and DOMPurify** move to patched versions, so the release package no longer carries the flagged versions.

Full release notes are [here](https://github.com/apache/skywalking-horizon-ui/releases/tag/v1.0.1).
