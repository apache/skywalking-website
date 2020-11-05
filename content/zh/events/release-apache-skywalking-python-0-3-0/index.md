---
title: "Release Apache SkyWalking Python 0.3.0"
date: 2020-08-28
author: SkyWalking Team
description: "Release Apache SkyWalking Python 0.3.0."
---

SkyWalking Python 0.3.0 is released. Go to [downloads](/downloads) page to find release tars.

- New plugins
  - Urllib3 Plugin (#69)
  - Elasticsearch  Plugin (#64)
  - PyMongo Plugin (#60)
  - Rabbitmq Plugin (#53)
  - Make plugin compatible with Django (#52)

- API
  - Add process propagation (#67)
  - Add tags to decorators (#65)
  - Add Check version of packages when install plugins (#63)
  - Add thread propagation (#62)
  - Add trace ignore (#59)
  - Support snapshot context (#56)
  - Support correlation context (#55)

- Chores and tests
  - Test: run multiple versions of supported libraries (#66)
  - Chore: add pull request template for plugin (#61)
  - Chore: add dev doc and reorganize the structure (#58)
  - Test: update test health check (#57)
  - Chore: add make goal to package release tar ball (#54)