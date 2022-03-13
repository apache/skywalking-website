---
title: "Release Apache SkyWalking for NodeJS 0.4.0"
date: 2022-03-13
author: SkyWalking Team
description: "Release Apache SkyWalking NodeJS 0.4.0."
---

SkyWalking NodeJS 0.4.0 is released. Go to [downloads](/downloads) page to find release tars.

- Fix mysql2 plugin install error. (#74)
- Update IORedis Plugin, fill `dbinstance` tag as host if `condition.select` doesn't exist. (#73)
- Experimental AWS Lambda Function support. (#70)
- Upgrade dependencies to fix vulnerabilities. (#68)
- Add lint pre-commit hook and migrate to eslint. (#66, #67)
- Bump up gRPC version, and use its new release repository. (#65)
- Regard `baseURL` when in Axios Plugin. (#63)
- Add an API to access the trace id. (#60)
- Use agent test tool snapshot Docker image instead of building in CI. (#59)
- Wrapped IORedisPlugin call in try/catch. (#58)
