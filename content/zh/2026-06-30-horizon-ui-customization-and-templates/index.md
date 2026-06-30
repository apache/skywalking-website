---
title: "认识 Horizon UI · 15/17：用模板定制控制台"
date: 2026-06-30
author: 吴晟
description: "Horizon UI 系列第十五篇：整个控制台都由可编辑模板驱动。你可以把任意 layer 或 overview 打开成模板，在本地草稿里调整组件、widget 和文案，预览后发布到 OAP 给整个组织使用，并在发布前查看差异，也可以导出和导入。"
tags:
  - Engineering
  - Cloud Native
---

*译自英文原文：[Meet Horizon UI · 15/17: Customization — Config-Driven Layer Templates](/blog/2026-06-30-horizon-ui-customization-and-templates/)。*

这是 [Meet Horizon UI](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列的第十五篇，也开启第五幕 **make it yours & adopt**。这个系列里你看到的 per-layer dashboard、overview、topology、3D map，都**不是写死在代码里**。它们由一套套 **template** 驱动，Horizon 也把编辑这些 template 的工具做进了控制台。这篇讲的就是这个编辑器：在本地草稿里修改任意 dashboard，先预览，再发布到 OAP，让整个组织都看到同一个版本。

## 一切都是模板

打开 **Admin → Layer dashboards**，后端上报的每个 layer 都可以配置。这里最重要的是编辑模型，而且所有模板编辑器都遵循同一套模型：**Save (local)** 只把修改保存在当前浏览器里，不会碰服务端；真正被所有人看到的**共享版本**保存在 OAP；Horizon 随版本发布的 **bundled** JSON 只是种子模板和只读 fallback。状态 badge 会告诉你每个 layer 当前处在哪种状态：**synced** 表示本地和远端一致；**diverged** 表示 bundled 和 OAP 上的 live 版本不同，渲染时以 OAP 为准；**local** 表示当前浏览器里有未发布的编辑。**Reset to ▾** 可以把 Bundled 或 Remote 重新加载到编辑器；**Preview ▾** 则会用 Local、Bundled 或 Remote 版本打开真实页面预览。

一个 layer 的配置不只是图表。你还可以选择它暴露哪些 **sub-view**，比如 Service、Instances、Topology、Deployment、Traces、Logs、profiling；可以设置展示用的 **alias**，甚至可以改菜单里的名词。下面的 Istio mesh layer 就把 “Instances” 改成了 *Sidecars*。

![图 1：Layer dashboards 管理页：顶部有 Save/Reset/Preview/Check-diff-and-push 控制，下面是 layer 配置，包括组件开关、alias 和菜单文案重命名。](/screenshots/horizon-0.7.0/p15-templates-01-layer-admin.webp)
图 1：Layer dashboards 管理页：每个 layer 都是一个 template。顶部操作区体现了完整模型：**Save (local)** 保存在浏览器里，**Reset to** / **Preview** Bundled 或 Remote 版本，最后用 **Check diff & push** 发布。下面可以选择这个 layer 暴露哪些 sub-view、设置 alias，并重命名菜单名词，比如把 instances 叫作 *Sidecars*。</br>

## 编辑 Widget

每个 scope 里的 dashboard 都是一个可以直接编辑的 **12 列网格**：拖动 header 可以调整顺序，拖动角落可以改变大小，点 **+ Add widget** 可以新增 widget。点击任意 widget，会打开它的编辑抽屉：这里可以改驱动它的 **MQE expression**、widget **type**（line / top / table / card 等）、**title**、**unit**，还可以设置 **Visible when** 条件，让某个表达式有值或者某个实体属性匹配时才显示这个 widget。

![图 2：Widget 编辑画布：12 列 widget 网格，选中一个 widget 后右侧抽屉展示 id、title、tip、type、unit、MQE expressions 和 Visible-when 条件。](/screenshots/horizon-0.7.0/p15-templates-02-widget-editor.webp)
图 2：Widget 画布：一个可以拖拽排序、调整大小的 12 列网格。点中 widget 后会打开抽屉，编辑 **MQE expression**、type、title、unit 和 **Visible when** 条件。</br>

## 发布前先看差异

在你发布之前，本地修改不会影响其他用户；而发布之前，Horizon 会先让你看清楚到底改了什么。点击 **Check diff & push** 会打开左右对照的 diff：左侧是当前 live 的 **remote** 版本，右侧是**你的 local** 草稿。只有继续点 **Confirm push**，本地草稿才会替换 OAP 上的 live 版本，所有用户才会看到变化。只有 local 和 remote 真的不一样时，这个按钮才会启用。

![图 3：“Publish local to OAP?” diff 弹窗：左右对照 JSON diff，高亮了 widget 标题从 Traffic 改为 “Traffic Name Changed”，底部有 Cancel / Confirm push。](/screenshots/horizon-0.7.0/p15-templates-03-diff-push.webp)
图 3：Check diff & push：草稿发布给所有人之前，先用左右对照 diff 展示变化（remote 在左，本地草稿在右）。这里改了一个 widget title；只有点 **Confirm push** 才会真正发布。</br>

新增 layer 也走这套流程。后端已经上报、但 Horizon 没有内置模板的 layer，会先打开一个空白默认模板；你配置它的 components 和 widgets，**Save** 后第一次 push 就会把模板发布到 OAP。一个 layer 不需要先随版本带上 JSON 文件，才能变成完整可配置的页面。

## Overview 与迁移复用

**Overview templates** 编辑器也使用同样的模型：一个 12 列画布，布局和线上页面一致，只是编辑器里使用 mock data，真实页面会使用真实数据。**+ New dashboard** 会写出一个本地草稿；**Delete** 是软禁用，因为 OAP 目前没有 hard delete。所有模板管理页也都有 **Export** 和 **Import**，包括 layer dashboards、overviews、3D map config 和 translations：Export 会把当前实际使用的版本下载成 JSON 文件，便于备份、共享，或者把一个 dashboard 搬到另一个 OAP；Import 读取 JSON 文件、校验，然后作为**本地草稿**加载进来，供你预览和发布。Import 不会直接写 OAP。

![图 4：Overview templates 管理页：Services Dashboard 位于 12 列画布上，包含 section header、KPI tiles、topology widget 和 active-alarms widget，以及 New-dashboard / export / import / draft 控制。](/screenshots/horizon-0.7.0/p15-templates-04-overview.webp)
图 4：Overview templates 使用同一套模型：12 列画布、mock data、作为本地草稿创建的 **+ New dashboard**，以及用 **Export / Import** 在不同 OAP 后端之间迁移 dashboard。</br>

## 它在哪里运行

编辑和预览完全发生在**浏览器本地**；只有发布时才会调用 OAP。发布会通过 OAP 11 提供的 admin host，把 template 写入 OAP 的 **ui-template store**。Bundled JSON 是种子模板和只读 fallback；只要 OAP 上发布过版本，渲染时就以 OAP 版本为准。权限也按角色控制：发布 layer dashboards 需要 `dashboard:write`，发布 overviews 需要 `overview:write`。字段参考，包括 template 结构、widget 类型和新增 layer 的流程，可以看 [Layer templates](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/customization/layer-templates/)、[Overview templates](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/customization/overview-templates/) 和 [Adding a new layer](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/customization/adding-a-new-layer/) 文档。

下一篇：[八种语言的本地化](/zh/2026-06-30-horizon-ui-localization-i18n/)：同一套 template 如何支持八种语言。
