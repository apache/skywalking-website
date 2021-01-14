---
title: Release Apache SkyWalking LUA Nginx 0.3.0
date: 2020-10-24
author: SkyWalking Team
---

SkyWalking LUA Nginx 0.3.0 is released. Go to [downloads](/downloads) page to find release tars.

- Load the `base64` module in `utils`, different ENV use different library.
- Add prefix `skywalking`, avoid conflicts with other lua libraries.
- Chore: only expose the method of setting random seed, it is optional.
- Coc: use correct code block type.
- CI: add `upstream_status` to tag `http.status`
- Add `http.status`