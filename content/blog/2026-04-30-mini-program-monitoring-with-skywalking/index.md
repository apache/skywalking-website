---
title: "Monitoring WeChat and Alipay Mini Programs with SkyWalking"
author: "Sheng Wu"
date: 2026-04-30
description: "SkyAPM/mini-program-monitor and SkyWalking OAP together extend SkyWalking's end-user monitoring to WeChat and Alipay Mini Programs. This post focuses on the data path, the cross-platform abstraction, and the OAP-side integration."
tags:
- Mini Program
- WeChat
- Alipay
- OTLP
- End User Monitoring
---

# Monitoring WeChat and Alipay Mini Programs with SkyWalking

Mini programs are a major part of the mobile experience in China, but the open-source observability ecosystem has long focused on web browsers and native apps. SkyWalking already covers browser (client-js), iOS, and the server side; mini programs and Android were the remaining gaps. With [SkyAPM/mini-program-monitor](https://github.com/SkyAPM/mini-program-monitor) joining the SkyWalking ecosystem, the mini-program half of that gap is closed — one SDK supports both WeChat and Alipay, and the matching OAP-side component IDs, MAL rules, and UI templates are merged on `main` and will ship with 10.5.0.

This post is for teams that already run a SkyWalking backend and want to bring their mini programs into the same observability stack. The interesting parts aren't *that* the project exists — they are how the data flows from a mini program to a SkyWalking dashboard, how the two platforms coexist, and what design trade-offs you should know about before rolling this out.

## Data path

The SDK uses two protocols:

- **OTLP HTTP** (error logs, performance metrics, request metrics) → OAP `/v1/logs`, `/v1/metrics`
- **SkyWalking native** (distributed tracing segments, optional) → OAP `/v3/segments`

Why not a single protocol? OTLP already covers logs and metrics, so there's no point reinventing native endpoints for those. But for tracing, OAP's native `SegmentObject` maps more cleanly onto SkyWalking's trace model, and `sw8` header propagation to the backend works without any conversion. So traces go native, everything else goes OTLP, and neither side has to translate.

OTLP defaults to protobuf; JSON is available for debugging. The SDK has zero runtime dependencies.

## Two platforms, two independent Layers and dashboards

Many teams maintain a WeChat mini program and an Alipay mini program against a shared backend. Rather than collapsing them into a single tagged service, the design promotes each platform to its own Layer — `WECHAT_MINI_PROGRAM` and `ALIPAY_MINI_PROGRAM` — with its own dashboard set. The SDK tags every signal with a resource attribute `miniprogram.platform = wechat | alipay` and assigns each platform its own component ID (WeChat = 10002, Alipay = 10003).

On the OAP side, the MAL rule's `filter` routes data into the right Layer at ingest:

```yaml
metricPrefix: meter_wechat_mp
filter: "{ tags -> tags.miniprogram_platform == 'wechat' }"
```

The Alipay rule mirrors this with `'alipay'`. The two rules are mutually exclusive — no double counting — and produce distinct metric prefixes (`meter_wechat_mp_*` vs `meter_alipay_mp_*`) that feed each Layer's dashboards. Even when both platforms use the same `service.name` (e.g. `mini-program-demo`), the UI exposes two completely separate entry points.

## Asymmetric metric semantics

This is the design choice I want to highlight. WeChat's base library exposes `PerformanceObserver`, which gives you renderer-authoritative timings: app launch, first render, route navigation, script execution, sub-package load — all real measurements. Alipay's base library doesn't offer an equivalent, so the SDK falls back to lifecycle hooks: the `App.onLaunch → App.onShow` delta is used as an approximation of launch time, and renderer-level timings simply aren't available.

So the two MAL rule sets are deliberately not the same:

- **WeChat**: `app_launch_duration`, `first_render_duration`, `route_duration`, `script_duration`, `package_load_duration`, `request_duration_percentile`, `request_cpm`
- **Alipay**: `app_launch_duration`, `first_render_duration`, `request_duration_percentile`, `request_cpm`

The Alipay `app_launch_duration` is a lifecycle approximation and is not directly comparable to WeChat's renderer timing — the dashboard tooltip says so explicitly. Putting the two numbers side by side is comparing two different measurement definitions.

## What the SDK does

Four signals:

- **Errors** — JS exceptions, unhandled promise rejections, and `pageNotFound` go out as OTLP logs, following the OTel `exception.*` semantic conventions (`exception.type`, `exception.stacktrace`). Anything downstream that speaks OTLP — SkyWalking, OTel Collector, Grafana — recognizes them.
- **Performance** — the metrics listed above. OTLP gauge.
- **Requests** — `wx.request` / `my.request` / `downloadFile` / `uploadFile` are reported as OTLP delta histograms, one batch per `flushInterval` (default 5s). The `le` bucket labels are already in milliseconds, and the MAL rule explicitly declares `MILLISECONDS` to disable the default SECONDS→MS rescale. Failed requests (4xx / 5xx / timeout) additionally emit an error log so you can pivot from a dashboard to a concrete failure.
- **Tracing (opt-in)** — when enabled, outbound requests get `sw8` header injection, and the resulting segments stitch together with backend traces into one end-to-end view. Trace data goes out as SkyWalking `SegmentObject`, not OTLP traces.

Two reliability and cardinality details worth calling out:

**Persisting events on app hide.** Mini programs get killed by the framework after some time in background, and weak networks make in-flight events easy to lose. The SDK writes unsent events to `wx.setStorage` / `my.setStorage` on `onAppHide` and restores them on the next launch.

**Avoiding cardinality explosions.** Set `serviceInstance` to the app version (e.g. `1.4.2`), not a device ID — at a million DAU the device-ID dimension blows up the OAP instance index. For request paths, the SDK exposes `urlGroupRules` regex patterns to fold parameterized URLs like `/api/user/12345` into `/api/user/{id}` so the endpoint dimension doesn't blow up either.

## What OAP needs

If you're on `main` or a release ≥ 10.5.0, the following are already shipped:

- `config/component-libraries.yml` registers `WeChat-MiniProgram: 10002` and `AliPay-MiniProgram: 10003`
- `config/otel-rules/miniprogram/` holds four MAL rules — service-scoped and instance-scoped for each platform
- `config/ui-initialized-templates/wechat_mini_program/` and `alipay_mini_program/` carry root / service / instance / endpoint dashboards
- `config/ui-initialized-templates/menu.yaml` registers both layers under the Mobile menu group

The only thing left is enabling the OTel receiver and giving the SDK an OTLP HTTP port it can reach. SkyWalking OAP binds its OTLP HTTP handler onto the receiver-sharing-server port, and that port defaults to `0` — meaning it's folded into the core REST port (12800). If you want the SDK to use the standard OTLP HTTP port 4318, set the sharing port to 4318:

```bash
docker run -d --name sw-oap \
  -p 11800:11800 -p 12800:12800 -p 4318:4318 \
  -e SW_STORAGE=banyandb \
  -e SW_STORAGE_BANYANDB_TARGETS=banyandb:17912 \
  -e SW_OTEL_RECEIVER=default \
  -e SW_RECEIVER_SHARING_REST_PORT=4318 \
  apache/skywalking-oap-server:latest
```

All receivers (OTLP, native segment, browser perf, log report) move to 4318 together, while GraphQL stays on 12800 for the UI.

Minimal SDK config:

```js
import MiniProgramMonitor from 'mini-program-monitor';

MiniProgramMonitor.init({
  service: 'mini-program-demo',
  serviceInstance: '1.4.2',          // Recommended: app version
  collector: 'http://your-oap:4318',
  enable: {
    error: true,
    perf: true,
    request: true,
    tracing: false,                  // Off by default; enable as needed
  },
});
```

WeChat and Alipay use the same config — the SDK detects the platform at runtime and tags the data accordingly.

## Compatibility

- WeChat base library ≥ 2.11
- Alipay base library ≥ 2.0
- Apache SkyWalking OAP `main` or ≥ 10.5.0, with the OTLP HTTP receiver enabled
- Any other OTLP-compatible backend (OpenTelemetry Collector, Grafana, etc.) also works, but you won't get the SkyWalking-specific cross-platform dashboards

## What's next

To get involved, head over to [SkyAPM/mini-program-monitor](https://github.com/SkyAPM/mini-program-monitor) and open an issue or PR. The repo also ships a `make preview` target that boots OAP, the UI, and both platform simulators locally — handy if you want to play with it end-to-end.

Android end-user experience monitoring is still a gap in the SkyWalking ecosystem; contributors interested in closing that one are very welcome.
