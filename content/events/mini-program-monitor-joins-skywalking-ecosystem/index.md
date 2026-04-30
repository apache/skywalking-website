---
title: Mini Program Monitor joins SkyWalking ecosystem
date: 2026-04-30
author: SkyWalking Team
description: "SkyAPM/mini-program-monitor joins the SkyWalking ecosystem, providing WeChat & Alipay Mini Program monitoring for Apache SkyWalking via OTLP and SkyWalking native protocols."
---

[SkyAPM/mini-program-monitor](https://github.com/SkyAPM/mini-program-monitor) has joined the SkyWalking ecosystem.

The project is a monitoring agent for WeChat (微信) and Alipay (支付宝) Mini Programs that reports telemetry to Apache SkyWalking via OTLP and SkyWalking native protocols. It extends SkyWalking's end-user experience monitoring to the mini program platforms, which are a major part of the mobile experience in China.

### Signals

- **Error tracking** — JS errors, unhandled promise rejections, and page-not-found events, reported as OTLP logs with OpenTelemetry semantic conventions (`exception.type`, `exception.stacktrace`).
- **Performance metrics** — app launch, first render, first paint, route navigation, script execution, and sub-package load, reported as OTLP gauge metrics.
- **Request metrics** — `wx.request` / `my.request`, plus `downloadFile` / `uploadFile`, reported as an OTLP delta histogram bucketed per flush interval. Failed requests (4xx/5xx/timeout) also emit error logs.
- **Distributed tracing** *(opt-in)* — `sw8` header propagation across outgoing requests, reported as SkyWalking `SegmentObject` to `/v3/segments`.

### Platform-aware backend

Every signal carries `miniprogram.platform: wechat | alipay` (resource attribute on OTLP, span tag on segments), and each platform has its own SkyWalking component ID (WeChat = 10002, Alipay = 10003). Operators with one WeChat and one Alipay app against the same backend can slice by platform without forcing distinct `service.name`s.

### Compatibility

- WeChat base library ≥ 2.11
- Alipay base library ≥ 2.0
- Apache SkyWalking OAP ≥ 10.x with the OTLP HTTP receiver
- Any other OTLP-compatible backend (OpenTelemetry Collector, Grafana, etc.)

OTLP wire format is protobuf by default, with JSON available for debugging. Unsent events are persisted to storage on app hide and restored on next launch. The package has no runtime dependencies.

See the [project README](https://github.com/SkyAPM/mini-program-monitor) for installation, configuration, and a `make preview` target that boots OAP, UI, and both platform simulators for a hands-on demo.
