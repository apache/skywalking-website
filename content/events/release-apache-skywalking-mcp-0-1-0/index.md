---
title: "Release Apache SkyWalking MCP 0.1.0"
date: 2026-03-26
author: SkyWalking Team
description: "Release Apache SkyWalking MCP 0.1.0"
---

SkyWalking MCP 0.1.0 is released. Go to [downloads](/downloads) page to find release tars.

## What's Changed

* Initial release of the `swmcp` binary (SkyWalking MCP server).
* Support for three MCP transport modes: `stdio`, `sse`, and `streamable`.
* Integration with Apache SkyWalking OAP via GraphQL, including:
  * Traces, logs, metrics, topology, alarms, and events query tools.
  * MQE (Metrics Query Extension) tools using the OAP `/graphql` endpoint.
* Prompt support for trace and log analysis and utility workflows.
* Embedded documentation and dynamic metrics resources for MQE.
* Makefile targets for build, lint, license checks, and Docker image creation.
* Docker image is available at [apache/skywalking-mcp](https://hub.docker.com/r/apache/skywalking-mcp).
