---
title: "Release Apache SkyWalking Python 0.8.0"
date: 2022-07-10
author: SkyWalking Team
description: "Release Apache SkyWalking Python 0.8.0."
---

SkyWalking Python 0.8.0 is released. Go to [downloads](/downloads) page to find release tars.

- Feature:
  - Update mySQL plugin to support two different parameter keys. (#186)
  - Add a `SW_AGENT_LOG_REPORTER_SAFE_MODE` option to control the HTTP basic auth credential filter (#200)

- Plugins:
  - Add Psycopg(3.x) support (#168)
  - Add MySQL support (#178)
  - Add FastAPI support (#181)
  - Drop support for flask 1.x due to dependency issue in Jinja2 and EOL (#195)
  - Add Bottle support (#214)

- Fixes:
  - Spans now correctly reference finished parents (#161)
  - Remove potential password leak from Aiohttp outgoing url (#175)
  - Handle error when REMOTE_PORT is missing in Flask (#176)
  - Fix sw-rabbitmq TypeError when there are no headers (#182)
  - Fix agent bootstrap traceback not shown in sw-python CLI (#183)
  - Fix local log stack depth overridden by agent log formatter (#192)
  - Fix typo that cause user sitecustomize.py not loaded (#193)
  - Fix instance property wrongly shown as UNKNOWN in OAP (#194)
  - Fix multiple components inconsistently named on SkyWalking UI (#199)
  - Fix SW_AGENT_LOGGING_LEVEL not properly set during startup (#196)
  - Unify the http tag name with other agents (#208)
  - Remove namespace to instance properties and add pid property (#205)
  - Fix the properties are not set correctly (#198)
  - Improved ignore path regex (#210)
  - Fix sw_psycopg2 register_type() (#211)
  - Fix psycopg2 register_type() second arg default (#212)
  - Enhance Traceback depth (#206)
  - Set spans whose http code > 400 to error (#187)

- Docs:
  - Add a FAQ doc on `how to use with uwsgi` (#188)

- Others:
  - Refactor current Python agent docs to serve on SkyWalking official website (#162)
  - Refactor SkyWalking Python to use the CLI for CI instead of legacy setup (#165)
  - Add support for Python 3.10 (#167)
  - Move flake configs all together (#169)
  - Introduce another set of flake8 extensions (#174)
  - Add E2E test coverage for trace and logging (#199)
  - Now Log reporter `cause_exception_depth` traceback limit defaults to 10
  - Enable faster CI by categorical parallelism (#170)
