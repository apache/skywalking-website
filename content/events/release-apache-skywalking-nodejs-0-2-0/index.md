---
title: "Release Apache SkyWalking for NodeJS 0.2.0"
date: 2021-03-31
author: SkyWalking Team
description: "Release Apache SkyWalking NodeJS 0.2.0."
---

SkyWalking NodeJS 0.2.0 is released. Go to [downloads](/downloads) page to find release tars.

- Add AMQPLib plugin (RabbitMQ). (#34)
- Add MongoDB plugin. (#33)
- Add PgPlugin - PosgreSQL. (#31)
- Add MySQLPlugin to plugins. (#30)
- Add http protocol of host to http plugins. (#28)
- Add tag http.method to plugins. (#26)
- Bugfix: child spans created on immediate cb from op. (#41)
- Bugfix: async and preparing child entry/exit. (#36)
- Bugfix: tsc error of dist lib. (#24)
- Bugfix: AxiosPlugin async() / resync(). (#21)
- Bugfix: some requests of express / axios are not close correctly. (#20)
- Express plugin uses http wrap explicitly if http plugin disabled. (#42)
