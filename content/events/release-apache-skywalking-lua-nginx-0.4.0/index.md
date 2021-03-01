---
title: Release Apache SkyWalking LUA Nginx 0.4.0
date: 2021-03-01
author: SkyWalking Team
---

SkyWalking LUA Nginx 0.4.0 is released. Go to [downloads](/downloads) page to find release tars.

- Add a global field 'includeHostInEntrySpan', type 'boolean', mark the entrySpan include host/domain.
- Add destroyBackendTimer to stop reporting metrics.
- Doc: set random seed in init_worker phase.
- Local cache some variables and reuse them in Lua module.
- Enable local cache and use tablepool to reuse the temporary table.