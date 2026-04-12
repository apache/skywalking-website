---
title: "Release Apache SkyWalking MCP 0.2.0"
date: 2026-04-12
author: SkyWalking Team
description: "Release Apache SkyWalking MCP 0.2.0"
---

SkyWalking MCP 0.2.0 is released. Go to [downloads](/downloads) page to find release tars.

## What's Changed

* TLS certificate verification is now enforced for OAP connections. Added `--sw-insecure` flag to opt out for development and self-signed certs.
* Sensitive fields (`authorization`, `password`, `token`, `secret`) are redacted in `--log-command` output.
* Environment variable references in `--sw-username` and `--sw-password` now warn when the variable is not set, preventing silent unauthenticated requests.
* URL scheme validation now rejects non-HTTP and non-HTTPS OAP URLs.
* Regex patterns supplied to `list_mqe_metrics` are validated for complexity before compilation.
* Added `--allowed-origins` flag to `sse` and `streamable` transports for CORS origin enforcement.
* Increased reliability of core CLI commands through expanded automated test coverage.
* Removed an unused CLI tool and its associated parameter to simplify the interface and avoid confusion.
* Added validation for tool configuration properties, returning clear errors when required values are missing or invalid.

## Release Artifacts

* Source release: [apache-skywalking-mcp-0.2.0-src.tgz](https://www.apache.org/dyn/closer.cgi/skywalking/mcp/0.2.0/apache-skywalking-mcp-0.2.0-src.tgz)
* Binary release: [apache-skywalking-mcp-0.2.0-bin.tgz](https://www.apache.org/dyn/closer.cgi/skywalking/mcp/0.2.0/apache-skywalking-mcp-0.2.0-bin.tgz)
* Docker image: [apache/skywalking-mcp](https://hub.docker.com/r/apache/skywalking-mcp)

## More Details

* Docs and tag: [v0.2.0](https://github.com/apache/skywalking-mcp/tree/v0.2.0)
