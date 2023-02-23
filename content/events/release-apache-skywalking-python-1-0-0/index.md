---
title: "Release Apache SkyWalking Python 1.0.0"
date: 2023-02-22
author: SkyWalking Team
description: "Release Apache SkyWalking Python 1.0.0."
---

SkyWalking Python 1.0.0 is released! Go to [downloads](/downloads) page to find release tars.

**PyPI Wheel**: https://pypi.org/project/apache-skywalking/1.0.0/

**DockerHub Image**: https://hub.docker.com/r/apache/skywalking-python

- **Important Notes and Breaking Changes:**
  - The new PVM metrics reported from Python agent requires SkyWalking OAP v9.3.0 to show out-of-the-box.
  - **BREAKING**: Python 3.6 is no longer supported and may not function properly, Python 3.11 support is added and tested.
  - **BREAKING**: A number of common configuration options and environment variables are renamed to follow the convention of Java agent,
  please check with the latest official documentation before upgrading. (#273, #282)
  https://skywalking.apache.org/docs/skywalking-python/v1.0.0/en/setup/configuration/
  - **BREAKING**: All agent core capabilities are now covered by test cases and enabled by default (Trace, Log, PVM runtime metrics, Profiler)
  - **BREAKING**: DockerHub Python agent images since v1.0.0 will no longer include the `run` part in `ENTRYPOINT ["sw-python", "run"]`, 
  user should prefix their command with `[-d/--debug] run [-p/--prefork] <Command>` for extra flexibility.
  - Packaged wheel now provides a extra [all] option to support all three report protocols

- Feature:
  - Add support for Python 3.11 (#285)
  - Add MeterReportService (gRPC, Kafka reporter) (default:enabled) (#231, #236, #241, #243)
  - Add reporter for PVM runtime metrics (default:enabled) (#238, #247)
  - Add Greenlet profiler (#246)
  - Add test and support for Python Slim base images (#249)
  - Add support for the tags of Virtual Cache for Redis (#263)
  - Add a new configuration `kafka_namespace` to prefix the kafka topic names (#277)
  - Add log reporter support for loguru (#276)
  - Add **experimental** support for explicit os.fork(), restarts agent in forked process (#286)
  - Add **experimental** sw-python CLI `sw-python run [-p]` flag (-p/--prefork) to enable non-intrusive uWSGI and Gunicorn postfork support (#288)

- Plugins:
  - Add aioredis, aiormq, amqp, asyncpg, aio-pika, kombu RMQ plugins (#230 Missing test coverage) 
  - Add Confluent Kafka plugin (#233 Missing test coverage) 
  - Add HBase plugin Python HappyBase model  (#266) 
  - Add FastAPI plugin websocket protocol support (#269)
  - Add Websockets (client) plugin (#269)
  - Add HTTPX plugin (#283)

- Fixes:
  - Allow RabbitMQ BlockingChannel.basic_consume() to link with outgoing spans (#224)
  - Fix RabbitMQ basic_get bug (#225, #226)
  - Fix case when tornado socket name is None (#227)
  - Fix misspelled text "PostgreSLQ" -> "PostgreSQL" in Postgres-related plugins (#234)
  - Make sure `span.component` initialized as Unknown rather than 0 (#242)
  - Ignore websocket connections inside fastapi temporarily (#244, issue#9724)
  - Fix Kafka-python plugin SkyWalking self reporter ignore condition (#249)
  - Add primary endpoint in tracing context and endpoint info to log reporter (#261)
  - Enforce tag class type conversion (#262)
  - Fix sw_logging (log reporter) potentially throw exception leading to traceback confusion (#267)
  - Avoid reporting meaningless tracecontext with logs when there's no active span, UI will now show empty traceID (#272)
  - Fix exception handler in profile_context (#273)
  - Add namespace suffix to service name (#275)
  - Add periodical instance property report to prevent data loss (#279)
  - Fix sw_logging when `Logger.disabled` is true (#281)

- Docs:
  - New documentation on how to test locally (#222)
  - New documentation on the newly added meter reporter feature (#240)
  - New documentation on the newly added greenlet profiler and the original threading profiler (#250)
  - Overhaul documentation on development setup and testing (#249)
  - Add tables to state currently supported features of Python agent. (#271)
  - New configuration documentation generator (#273) 

- Others:
  - Pin CI SkyWalking License Eye (#221)
  - Fix dead link due to the 'next' url change (#235)
  - Pin CI SkyWalking Infra-E2E (#251)
  - Sync OAP, SWCTL versions in E2E and fix test cases (#249)
  - Overhaul development flow with Poetry (#249)
  - Fix grpcio-tools generated message type (#253)
  - Switch plugin tests to use slim Python images (#268)
  - Add unit tests to sw_filters (#269)

## New Contributors
* @ZEALi made their first contribution in https://github.com/apache/skywalking-python/pull/242
* @westarest made their first contribution in https://github.com/apache/skywalking-python/pull/246
* @Jedore made their first contribution in https://github.com/apache/skywalking-python/pull/263
* @alidisi made their first contribution in https://github.com/apache/skywalking-python/pull/266
* @SheltonZSL made their first contribution in https://github.com/apache/skywalking-python/pull/275
* @XinweiLyu made their first contribution in https://github.com/apache/skywalking-python/pull/283

**Full Changelog**: https://github.com/apache/skywalking-python/compare/v0.8.0...v1.0.0
