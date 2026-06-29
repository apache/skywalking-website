---
title: "认识 Horizon UI · 8/17：浏览器错误与 Source Map"
date: 2026-06-23
author: 吴晟
description: "Horizon UI 系列第八篇：浏览器端 agent 上报的 JavaScript 错误流，以及如何借助 source map 把生产环境压缩后的 stack 还原到原始文件、行、列、符号和源码片段。"
tags:
  - Logging
  - Engineering
---

*译自英文原文：[Meet Horizon UI · 8/17: Browser Errors & Source Maps](/blog/2026-06-23-horizon-ui-browser-errors-and-source-maps/)。*

这是 [Meet Horizon UI](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列的第八篇。[第七篇](/zh/2026-06-23-horizon-ui-log-explorer/)讲的是服务日志；这一篇讲 *用户* 遇到的错误，也就是浏览器端 agent 上报的 JavaScript 异常，以及把这些错误定位到源码的关键一步。

生产环境 JavaScript stack 基本不可读。代码经过压缩和打包后发布，浏览器只会报告错误出现在 `app.min.js:1:98412`，也就是一段机器生成代码里的位置，几乎不给你任何线索。Horizon 要做的是找到正确的 **source map**，把 stack 里的每一帧映射回源码：原始文件、行、列、符号名，以及出错位置附近的代码片段。

## 浏览器端错误流

在 **BROWSER** Layer 上，**Browser Logs** 标签页（屏幕上的标签名，专指 JavaScript 错误流）会列出浏览器端 agent 上报的内容。BROWSER Layer 会把槽位重命名成自己的语义：services 变成 **Applications**，instances 变成 **Versions**，endpoints 变成 **Pages**。这个列表的阅读方式类似 [Log Explorer](/zh/2026-06-23-horizon-ui-log-explorer/)：可点击的 **category** legend 带计数，density histogram 位于日志流之上。每一行都有时间、**category**、page、app version 和错误消息；如果带有压缩后的 `line:col`，也会显示成标记。

排查方式和 trace/log 标签页一致：它使用独立的 **Time range**（全局顶栏暂停），你可以按 **Version**、**Page** 或 **Category** 收窄，然后点击 **Run query**。没有后台轮询把视图不断往前推，也没有要学习的查询语言，只有结构化控件。点击一行后，它会在日志流里原地展开。

![图 1：BROWSER Layer 上的 Browser Logs 标签页。category legend 和 density histogram 位于 JS 错误流上方，每行显示 category、page、app version 和压缩后的 line:col。](/screenshots/horizon-0.7.0/p08-browser-01-stream.webp)
图 1：浏览器端 agent 上报的错误流：按 category 组织、带图表，并限定到某个 app 版本和页面。</br>

压缩后的 `line:col` 就是最典型的问题。它是真实位置，但位置在 *构建后* 的 bundle 里，不在你的源码里。后面的解析流程就是为了解决这个落差。

## 从压缩后的 stack 定位到源码

展开一个错误后，面板分成两侧：左边是浏览器原样报告的 **raw stack**，也就是那段很难读的生产栈；右边是解析结果区域。选择一个 **source map**，点击 **Resolve**，Horizon 会解析 stack，并通过这份 map 映射 **每一帧**：

- 每帧原始 **`file:line:column`**；
- 原始 **symbol name**（如果 map 携带了）；
- 出错行附近几行 **原始源码**，命中行会高亮（如果 map 内嵌 `sourcesContent`）。

map 覆盖不到的 frame 会明确标为 `unmapped`。所以一条顶层 frame 为 `app.min.js:1:45` 的 stack，可以还原成 `checkout.ts:2:20` 上的 `computeCartTotal`，并把 `checkout.ts` 附近几行显示出来。真正抛错的 `cart.items.reduce(...)` 就在面板里，不只是还原第一帧，而是从上到下还原整条 stack。

这里有一些细节决定结果是否可信：浏览器 stack 的列号从 1 开始计数，source map 从 0 开始计数，所以解析器每次查找前都会做偏移；这条路径用真实 bundler 输出测试，而不是手写 fixture。

![图 2：展开后的错误。左侧是压缩后的原始 stack，右侧是解析后的 stack，每一帧显示原始 file:line:column、symbol 和高亮源码片段。](/screenshots/horizon-0.7.0/p08-browser-02-resolve.webp)
图 2：核心流程：把压缩后的 stack 匹配到正确 map，然后逐帧还原到你自己的源码。</br>

## 哪些错误可以用 source map 解析

不是每类错误都有可还原内容。**`JS`**、**`PROMISE`** 和 **`VUE`** 是真实 JavaScript 错误，它们的 stack 指向 bundle，可以解析。**`AJAX`** 和 **`RESOURCE`** 是网络和加载失败；它们的“stack”是 HTTP status 或失败 URL，不是代码，所以 source map 没有东西可映射（Horizon 不会阻止它们，只是没有可映射的 JavaScript 位置）。没有 source map 的代码、`eval` 或 inline scripts 里的 frame，也会保持 `unmapped`。（`JS` 也是唯一由浏览器上报顶层 `line:col` 的 category；其他 category 的位置在 stack 字符串内部，由解析器提取。）

## 提供 source map：上传或挂载

解析前必须让 map 可用。Horizon 提供两种方式，持久化策略有意不同：

- **Upload** 一个 `.map`，直接从标签页上传。它只保存在服务端 **内存** 里，没有后端存储，并且临时性是设计目标：它占用内存预算，在压力下按 least-recently-used 淘汰，**服务重启后丢失**；多实例部署时，它也只存在于接收上传的那一个实例。这个路径适合临时排查：拖一个 map 进来，解析，处理完离开。
- **Mount** `.map` 文件到服务端 **source-map 目录**（容器镜像中是 `/app/sourcemaps`，可通过 `HORIZON_SOURCEMAPS_DIR` 指定）。这些文件在启动时按 Source Map v3 校验，按需从磁盘读取（所以不占内存预算），重启后仍然存在，会自动重新加载，并且 **不能从 UI 删除**。这是生产路径：把构建产物里的 map 文件放进镜像或挂载目录，它们就一直可用。

管理器会显示每个 map 的来源（*uploaded · temporary* 还是 *mounted · durable*），以及当前内存预算使用量。预算配置，包括单文件上限和常驻上传总量上限，默认 64 MiB 和 512 MiB，位于 `horizon.yaml` 的 `sourceMaps` 块。

![图 3：source-map 管理器。Upload .map 控件、内存预算条（这里是 0 B / 512 MB，max 64 MB/file）和已加载 maps；图中 map 是 Mounted 且 durable，所以不能在这里删除，uploaded maps 会显示为 temporary。](/screenshots/horizon-0.7.0/p08-browser-03-sourcemap-manager.webp)
图 3：两种提供 map 的方式：upload 用于快速排查，mount 用于生产环境长期使用。</br>

## map 必须手动选择

Horizon 刻意 **不猜测**。浏览器端 agent 会上报 app **version**，但不会上报精确的构建指纹，所以没有安全方法自动把一个错误匹配到某份 map。用错构建的 map 会给出非常自信、但完全错误的行号，比没有答案更糟。所以这里由你选择：挑选和这次错误对应构建的 map，并按版本给 map 清晰命名。（还有一个必须直说的注意点：source map 的 `sourcesContent` 会包含你的原始源码，所以无论上传还是挂载，都要把 map 当成敏感内容，只放在可信服务器上。）

手动选择 map 这件事，也划清了 **权限** 边界。查看错误、列出 maps、**解析** stack 都是读操作，由 `browser-errors:read` 控制；**上传或删除** map 是写操作，由 `source-map:write` 控制。所以只读用户可以反复解析 stack，但没有权限改变已加载的 map 集合。读就是读，修改 map 存储才是写。

## 后续阅读

字段参考，包括 categories、两种提供路径、预算，以及如何按构建版本匹配 map，可以看 [Browser Logs & Source Maps 文档](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/operate/browser-source-maps/)。

下一篇进入 Profiling：五种 profiler（trace、async、eBPF、Go pprof、network）如何共用一套火焰图视图，以及为什么 network profiling 是例外。
