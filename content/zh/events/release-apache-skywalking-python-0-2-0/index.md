---
title: "Release Apache SkyWalking Python 0.2.0"
date: 2020-07-28
author: SkyWalking Team
---

SkyWalking Python 0.2.0 is released. Go to [downloads](/downloads) page to find release tars.

- Plugins:
  - Kafka Plugin (#50)
  - Tornado Plugin (#48)
  - Redis Plugin (#44)
  - Django Plugin (#37)
  - PyMsql Plugin (#35)
  - Flask plugin (#31)

- API
  - Add `ignore_suffix` Config (#40)
  - Add missing `log` method and simplify test codes (#34)
  - Add content equality of SegmentRef (#30)
  - Validate carrier before using it (#29)

- Chores and tests
  - Test: print the diff list when validation failed (#46)
  - Created venv builders for linux/windows and req flashers + use documentation (#38)