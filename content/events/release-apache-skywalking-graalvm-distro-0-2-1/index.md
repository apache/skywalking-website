---
title: Release Apache SkyWalking GraalVM Distro 0.2.1
date: 2026-03-23
author: SkyWalking Team
description: "Release Apache SkyWalking GraalVM Distro 0.2.1."
---

SkyWalking GraalVM Distro 0.2.1 is released. Go to [downloads](/downloads) page to find release tars.

This is the first official Apache release of the GraalVM Distro.

#### Changes

Apache SkyWalking GraalVM Distro is a GraalVM native image distribution of the Apache SkyWalking OAP server.
It compiles the full-featured OAP server into a single native binary (~200MB), delivering instant startup
and reduced memory footprint compared to the standard JVM distribution.

- Build-time OAL engine: pre-compile ~1285 metrics/builder/dispatcher classes via Javassist at Maven compile time.
- Build-time MAL compiler: pre-compile ~1250 MAL expressions from 71 YAML rule files into `MalExpression` classes.
- Build-time LAL compiler: pre-compile ~10 LAL scripts from 8 YAML files into `LalExpression` classes.
- Build-time Hierarchy compiler: pre-compile ~4 hierarchy matching rules into `BiFunction` classes.
- Build-time MeterSystem: pre-generate ~1188 meter function subclasses via Javassist.
- Auto-generate `reflect-config.json` by scanning HTTP handlers, GraphQL resolvers/types, config POJOs, and DSL manifests.
- Replace Groovy runtime with pure Java: MAL DSL, LAL DSL, and Hierarchy rules all use ANTLR4 + Javassist v2 engines.
- Replace Guava `ClassPath.from()` classpath scanning with build-time manifests for annotations, dispatchers, and source receivers.
- Replace `Field.setAccessible()` reflection in config loading with Lombok `@Setter`-based property copying.
- Replace `ServiceLoader` SPI discovery with direct provider wiring in `ModuleDefine`.
- Add TraceQL module (Tempo-compatible trace query API) with Zipkin and SkyWalking datasource support.
- JVM distribution: repackaged OAP server with all replacement classes via `maven-shade-plugin`.
- Native distribution: single binary (~200MB) with config files, LICENSE, NOTICE, and third-party licenses.
- Docker image available on both GHCR and Docker Hub, with multi-arch support for `linux/amd64` and `linux/arm64`.
- macOS native binary: build locally via `make native-image` on macOS.
- Sync SkyWalking submodule to upstream commit `64a1795d8a`.
