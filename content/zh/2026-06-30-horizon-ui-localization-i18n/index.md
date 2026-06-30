---
title: "认识 Horizon UI · 16/17：八种语言的本地化"
date: 2026-06-30
author: 吴晟
description: "Horizon UI 系列第十六篇：Horizon 支持八种语言。本地化不是每次渲染时重新翻译，而是在服务端把翻译 overlay 合并到同一套 template 上；用户可以从顶栏切换语言，也可以在 Translations 管理页点选任意 widget 直接补翻译，而 OAP 返回的数据始终保持原样。"
tags:
  - Engineering
  - Community
---

*译自英文原文：[Meet Horizon UI · 16/17: Localization in Eight Languages](/blog/2026-06-30-horizon-ui-localization-i18n/)。*

这是 [Meet Horizon UI](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列的第十六篇，仍然属于第五幕 **make it yours & adopt**。上一篇讲到，整个控制台都由 template 驱动。本地化也建立在这个基础上：Horizon 支持**八种语言**，每种翻译都是覆盖在同一套 template 上的一层 **overlay**。它不是 fork 出一份 dashboard，也不是每次渲染图表时重新翻译。

## 翻译是 overlay，在服务端合并一次

每个非英语 locale 都是一份 **overlay catalog**，覆盖在英语 **source template** 上。BFF 返回 template 时，会根据请求头里的语言选择，把 overlay **合并到 source 上一次**，再返回本地化后的 template。翻译只在服务端解析一次，不会在每个图表加载时再处理。合并逻辑也比较宽容：overlay 会 deep-merge 到 source 上；没有翻译到的 leaf 会**回退到英语**，所以一份只翻了一半的 catalog 也是有效的。新增或修正语言，本质上就是编辑 overlay，不需要改 source dashboard。

这里有一条刻意划清的边界：哪些内容会翻译，哪些不会。会翻译的是界面 **chrome**，例如 widget title、tip、label、menu alias。但 **OAP 提供的数据不会翻译**：service、instance、endpoint 名称，tags，log line，alarm rule name，span operation，都会按后端返回的原样展示。SkyWalking、Kubernetes、Envoy 这类产品或协议名，MQE 表达式，以及 RPM / P95 / SLA 这样的代码和缩写，也保持原样。

## 点一下就能翻译

本地化不需要手写 JSON。**Admin → Translations** 会给出目标语言的 live preview：选择 template 和 language，**点击任意 widget**，右侧面板会列出可以翻译的字段：上方是英语 source，下方是你的翻译。每种语言都有进度计数，模板那篇提到的草稿模型也同样适用：**Stage local** 把改动保存在浏览器里，**Check diff & push** 把 overlay 发布到 OAP，**Export / Import** 可以把某种语言的翻译作为 JSON 文件迁移。

![图 1：Translations 管理页正在翻译法语：浮动面板中展示某个 widget 的 EN source 和目标语言字段；实时法语预览中，RPM / P95 / SLA 标签保持原样。](/screenshots/horizon-0.7.0/p16-i18n-01-translations.webp)
图 1：Translations 管理页：选择语言（这里是 Français），在 live preview 中点击任意 widget，就可以输入翻译。title 和 tip 会翻译；`RPM` / `P95` / `SLA` 这类代码保持原样，OAP 提供的所有值也保持原样。</br>

## 八种语言，按设备选择

Horizon 正式支持八种 locale：**English** 是 source，另外还有 **Deutsch、Español、Français、日本語、한국어、Português、中文（简体）**。你可以从顶栏的 **language chip** 切换语言；所有页面都支持，包括登录前的 login 页面。选择会按当前设备持久化。

![图 2：顶栏 language menu 展开，列表从 English 开始，然后是 Deutsch、Español、Français、Japanese、Korean、Português 和 Chinese。](/screenshots/horizon-0.7.0/p16-i18n-02-locale-chip.webp)
图 2：顶栏 language chip：八种正式支持的语言，English 加 Deutsch、Español、Français、日本語、한국어、Português、中文。每个设备可以独立选择，登录页也能切换。</br>

切换语言后，整个控制台都会跟着变。下面是中文里的 General Service dashboard：sidebar、tabs 和 widget title 都已经本地化，而 API path、service name 和 metric value 仍然按 OAP 返回值展示。你也会看到少数 widget title 还是英语：那几个 leaf 还没有翻译，所以自然回退到 source。这正是 overlay 模型想要的降级方式。

![图 3：以中文渲染的 General Service dashboard：sidebar（概览、服务仪表板、告警、通用服务）和 widget title（流量、错误率）已本地化，API paths 和 metric values 保持不变。](/screenshots/horizon-0.7.0/p16-i18n-03-localized.webp)
图 3：同一个 General Service dashboard 的中文版本：sidebar、tabs 和 widget title 会本地化；service name、API path 和 metric value 仍然按 OAP 返回值展示。未翻译的 leaf 会回退到英语。</br>

## 它在哪里运行

Locale 解析发生在 **BFF 侧**，所以它兼容任意 OAP。发布翻译时，会通过 OAP 11 的 admin host，把 sibling overlay 写入 OAP 的 template store；权限由 `overview:write` 控制。八种 UI chrome message catalog 是随包内置的，切换时同步生效，不需要额外网络请求。CI 里的 `i18n:validate` 会检查每个 source template 都有对应 locale 的 overlay，避免 source 和翻译脱节。字段参考，包括哪些字段可翻译、如何新增语言，可以看 [i18n 文档](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/customization/i18n/)。

下一篇，也就是这个系列的收官篇：[安装与迁移](/zh/2026-06-30-horizon-ui-getting-started-and-migration/)：安装 Horizon，并把它替换到现有 UI 的位置。
