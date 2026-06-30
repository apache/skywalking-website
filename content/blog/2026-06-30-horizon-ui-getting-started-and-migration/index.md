---
title: "Meet Horizon UI · 17/17: Getting Started & Migration"
date: 2026-06-30
author: Sheng Wu
description: "The finale of the Meet Horizon UI series: install Horizon as a single env-driven container, point it at your OAP, and — if you're on the old UI — swap it in drop-in. Plus the OAP 10.x vs 11.x compatibility matrix: what works on the query port, and what needs OAP 11's admin host."
tags:
  - Release
  - Community
---

This is the seventeenth and final post in the [Meet Horizon UI](/blog/2026-06-21-skywalking-horizon-ui-introduction/) series, closing **Act 5 — make it yours & adopt**. Sixteen posts toured what Horizon shows, does, governs, and lets you customize. This one is the practical close: how to get it running, what it needs from your backend, and how to swap it in for an existing UI.

## One image, one config

Horizon ships as a **single container image** — the Vue UI and its Fastify BFF in one artifact — published to GHCR at `ghcr.io/apache/skywalking-horizon-ui`. There's one configuration file, `horizon.yaml`, and its defining trait is that **every field is an environment-variable token** (`${HORIZON_X:default}`) expanded *before* the YAML is parsed. So you can run the image with nothing mounted and set only the env vars you care about, or copy the file, edit it, and mount it.

```yaml
# horizon.yaml — every field is an env token: ${HORIZON_X:default},
# expanded before YAML parsing. Run image-native with env vars, or mount this file.
server:
  host: "${HORIZON_SERVER_HOST:127.0.0.1}"   # the image sets 0.0.0.0
  port: ${HORIZON_SERVER_PORT:8081}

oap:
  queryUrl:  "${HORIZON_OAP_QUERY_URL:http://127.0.0.1:12800}"          # GraphQL — required
  adminUrl:  "${HORIZON_OAP_ADMIN_URL:http://127.0.0.1:17128}"          # admin REST — operate features
  zipkinUrl: "${HORIZON_OAP_ZIPKIN_URL:http://127.0.0.1:9412/zipkin}"   # optional

auth:
  backend: "${HORIZON_AUTH_BACKEND:local}"     # local | ldap
  local:
    users: ${HORIZON_AUTH_LOCAL_USERS:[]}      # JSON; hash with: pnpm --filter bff cli:hash

session:
  ttlMinutes: ${HORIZON_SESSION_TTL_MINUTES:60}
  cookieSecure: ${HORIZON_SESSION_COOKIE_SECURE:false}   # set true behind HTTPS
```

Pointing it at an existing OAP is three URLs. A container run is then just env vars over the image:

```bash
docker run -d --name horizon -p 8081:8081 \
  -e HORIZON_SERVER_HOST=0.0.0.0 \
  -e HORIZON_OAP_QUERY_URL=http://oap:12800 \
  -e HORIZON_OAP_ADMIN_URL=http://oap:17128 \
  -e HORIZON_AUTH_LOCAL_USERS='[{"username":"admin","passwordHash":"$argon2id$...","roles":["admin"]}]' \
  ghcr.io/apache/skywalking-horizon-ui:<version>
```

Two things worth knowing on the first boot. There is **no default admin/admin** — with the `local` backend and no users (or `ldap` with no group mappings) the BFF starts but no one can sign in until you configure it; you generate password hashes with `pnpm --filter bff cli:hash`. And for reproducible deploys, **pin to a specific release tag or commit SHA** rather than a rolling tag.

## What works on which OAP

Horizon is built **natively against OAP 11.x**, and it **partially supports OAP 10.x**. The split is clean and maps to the two halves of this series: the **observe** data-plane runs against OAP's query port and works on both lines; the **operate** surfaces live on OAP's admin port, which only 11.x runs.

| Surface | OAP 10.x | OAP 11.x | Port |
|---|:---:|:---:|---|
| Layer dashboards, overviews, topology | ✓ | ✓ | query `:12800` |
| Traces (native + Zipkin), logs, alarms (read), profiling | ✓ | ✓ | query `:12800` (+ `:9412` for Zipkin) |
| Inspect, DSL Management, Live Debugger, Alarm-rule editor | — | ✓ | admin `:17128` |
| Cluster Status → Admin pane, template & translation publishing | — | ✓ | admin `:17128` |

Crucially, Horizon **never reads the OAP version number** — it detects each capability by probing for the module and GraphQL fields it needs, hides the sidebar entries it can't back, and falls back to read-only for admin pages when the admin port is dark. So if you only need triage (dashboards, alarms, traces, logs), a 10.x backend is enough; anything in the operate half needs 11.x with its admin modules (`admin-server`, `receiver-runtime-rule`, `dsl-debugging`, `inspect`) enabled.

## Swapping in for an existing UI

If you run the previous-generation UI today, the migration is **drop-in**. Horizon speaks the **same OAP GraphQL query protocol and the same MQE language**, so there are **no agent changes and no backend changes** — you point Horizon at the OAP you already run. The clean cutover is to run both side by side, let people use Horizon against live data, and retire the old UI when you're ready. Everything Horizon adds on top — its [governance](/blog/2026-06-30-horizon-ui-access-control-and-security/) (RBAC, auth, audit, themes) and its [config-driven templates](/blog/2026-06-30-horizon-ui-customization-and-templates/) — is Horizon's own, layered in the BFF, independent of what your OAP does.

## Verify and operate

Confirm the connection from the [Cluster Status](/blog/2026-06-30-horizon-ui-platform-introspection/) page: the topbar carries the OAP build-version chip, and the Query pane shows version, timezone, and a health score; the Admin and Zipkin panes light up to match what your backend exposes. A few operational notes for production:

- **Persist state.** Admin-edited templates land under `/app/bundled_templates` and the audit, setup, and alarm files under `/data`; mount durable volumes there or those edits are ephemeral and vanish with the container.
- **Sessions are per-BFF.** They live in each node's memory with no shared store, so multiple replicas need sticky sessions (otherwise a failover means re-login).
- **Probes and TLS.** `/api/health` is public with no OAP dependency — wire it to your container probes — and set `session.cookieSecure: true` behind HTTPS.

For the full reference — the [container image](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/setup/container-image/), the [`horizon.yaml`](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/setup/horizon-yaml/) field-by-field, and the [OAP compatibility matrix](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/compatibility/oap-version/) — see the docs.

## That's the series

Seventeen posts, five acts: we **oriented** in the console, **observed** services across layers — metrics, traces, logs, topology, profiling — **operated** on the backend with runtime rules, live debugging, and inspection, **governed** it with access control, and finally made it **ours** with templates, eight languages, and a clean install. The best next step is to stop reading and start clicking: the public demo at [demo.skywalking.apache.org](https://demo.skywalking.apache.org) runs Horizon against a live SkyWalking backend. Thanks for following along.
