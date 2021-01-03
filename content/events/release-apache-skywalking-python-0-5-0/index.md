---
title: "Release Apache SkyWalking Python 0.5.0"
date: 2020-12-28
author: SkyWalking Team
description: "Release Apache SkyWalking Python 0.5.0."
---

SkyWalking Python 0.5.0 is released. Go to [downloads](/downloads) page to find release tars.

- New plugins
    - Pyramid Plugin (#102)
    - AioHttp Plugin (#101)
    - Sanic Plugin (#91)

- API and enhancements
    - `@trace` decorator supports `async` functions
    - Supports async task context
    - Optimized path trace ignore
    - Moved exception check to `Span.__exit__`
    - Moved Method & Url tags before requests

- Fixes:
    - `BaseExceptions` not recorded as errors
    - Allow pending data to send before exit
    - `sw_flask` general exceptions handled
    - Make `skywalking` logging Non-global

- Chores and tests
    - Make tests really run on specified Python version
    - Deprecate 3.5 as it's EOL
