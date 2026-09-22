---
title: Release Apache SkyWalking BanyanDB 0.11.1
date: 2026-09-20
author: SkyWalking Team
description: "Release Apache SkyWalking BanyanDB 0.11.1."
---

SkyWalking BanyanDB 0.11.1 is released. Go to [downloads](/downloads) page to find release tars.

### Bug Fixes

- Stamp `RELEASE_VERSION` into official release binaries so `--version` reports the release instead of `-`.
- Stop declaring unbundled MCP npm dependencies in binary-package root `LICENSE` files (MCP Eyes output stays under `mcp/`).
- Keep MCP and Canopy dependency license texts under `mcp/licenses/` and `canopy/licenses/` (checked in). Go binary packages that stage MCP also ship `mcp/LICENSE`, `mcp/licenses/`, and `mcp/package-lock.json` with `mcp/dist`.
- Ship Canopy as an independent release archive (`skywalking-banyandb-*-canopy.tgz`) with built SPA/BFF artifacts and Canopy Eyes licenses.
- Include the full Apache-2.0 text in Canopy's root `LICENSE` and drop the accidental Linux-only `@rollup/rollup-linux-x64-gnu` hard dependency so `npm ci --omit=dev` works on macOS ARM64.
- Upgrade MCP production npm overrides (`fast-uri` 4.1.5, `hono` 4.13.8, `qs` 6.16.0) to clear `npm audit` findings.
- Fix standalone TopN write ordering.
- Fix stale Canopy query clauses after resource changes.
- Bound the vectorized stream Top-N merge by limit+offset, and bound the filtered index-order vectorized Top-N merge.
- Enforce the Canopy readonly role on the `/monitoring/*` proxy the same way as `/api/*`.
- Fix FODC proxy `/metrics` returning partial data or timing out when concurrent scrapes overlap.
- Pre-set the logging level before flag parsing and honor the configured logging level in native observability metrics.
- Enforce trace query time ranges independently of the sort index, skipping row timestamp checks when the query fully covers a part.
- Retry property schema registry initialization indefinitely, logging an error every 10 attempts.
- Bound Property, Stream, and Trace query allocations with shared memory admission and capacity hints so oversized limit/offset windows cannot force huge result buffers.
- Preserve list-all / max-limit queries (`limit=MaxUint32` or OAP `Integer.MAX_VALUE`) with incremental scan admission and result-count accounting, without over-charging Property source payloads against the liaison fallback pool.
- Register the memory protector on the liaison role so query admission uses the cgroup-backed pool instead of the 64MiB fallback.
- Reject deeply nested ByDBQL WHERE parentheses to prevent stack overflow.
- Keep system native `memory_state` (with `kind` labels) from being overwritten by the liaison load-shedding gauge so self-observability dashboard queries succeed.
- Reject group / stream / measure / trace (and related) resource names that are not a single path-safe identifier (`[a-zA-Z0-9_]([a-zA-Z0-9._-]*[a-zA-Z0-9])?`), so names cannot escape catalog storage roots.
- Bound protobuf `validate.rules` on schema and query identifiers (max length, allowlist pattern, repeated max_items, numeric ceilings) so untrusted inputs cannot escape storage roots or force unbounded allocations.

### Chores

- Remove the accidentally committed `test_table` ELF binary from the source tree.
- Remove accidentally committed local design notes from the repository root.
- Update NOTICE copyright year to 2026.
- Tolerate CI shallow checkouts without git tags when resolving `VERSION_STRING`.

### Documentation

- Document the six release archives (src, banyand, bydbctl, fodc-agent, fodc-proxy, canopy) and their 18 signed files.
- Align the build-from-source prerequisites with `go.mod` (Go 1.25.13) and the UI engines range (`Node.js >= 24.6.0`).
