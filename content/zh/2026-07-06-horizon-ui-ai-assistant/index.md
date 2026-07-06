---
title: "认识 Horizon UI · AI Assistant：用日常语言查询你的可观测性数据"
date: 2026-07-06
draft: true
author: 吴晟
description: "Horizon UI 新增的 AI Assistant 可以用和 UI 相同的图表、拓扑和表格回答关于 live system 的问题；它只读、继承权限，并运行在你自己接入的高性价比模型上。"
tags:
  - Release
  - AI
  - Cloud Native
---

*译自英文原文：[Meet Horizon UI · The AI Assistant: Ask Your Observability Data in Plain Language](/blog/2026-07-06-horizon-ui-ai-assistant/)。*

[**Meet Horizon UI**](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列已经以 17/17 收官：它完整讲过 SkyWalking 新控制台的每个界面，从映射系统全貌的侧边栏、adaptive dashboards、topology 和 3D map，到 trace 和 log explorers、profiling、alarms、operations surface、access control，以及 config-driven customization。这篇是新的章节，随 **Horizon UI 1.0** 一起到来：内置的 **AI Assistant** 让你可以像聊天一样查询自己的可观测性数据，而不是一路点进去查。

它不是简单地给 dashboard 加一个聊天入口。你可以问它：*"what's unhealthy in the system right now?"*、*"investigate the response time for a service"*。它会通过和 dashboards 相同的 query path，从你的 OAP backend 读取 **live data**，然后流式返回一段有顺序的分析叙事，并使用 Horizon 里到处都在用的**同一套 charts、topology 和 tables**。它是**只读**的，**继承你的权限**，并且默认关闭，直到 operator 启用它并配置好模型。

{{< video src="/screenshots/horizon-1.0/ai-00-investigation.mp4" poster="/screenshots/horizon-1.0/ai-00-investigation-poster.webp" caption="一个问题，一次完整调查：assistant 先 triage active alarms，再绘制解释它们的 response-time 和 error-rate 图；这些图来自 dashboards 使用的同一套 widgets，并带有编号，方便正文引用。" >}}

## 能看见的答案，而不是一堵文字墙

Assistant 的核心习惯是 *show, don't describe*。它先写一两句话，然后**画出真实图形**，解释图里实际出现了什么，再进入下一步。每个 figure 都是真实 render，不是截图，也不是编出来的数字：line charts、single-value cards、top-N lists、带 label 的 tables 和 record lists，都会根据底层 metric expression 的形状来选择。它画出的每个 block 都会使用一个连续递增的 **Figure N** 计数，所以叙事可以指向自己真实渲染出的图，比如 “the response-time chart above shows the spike”，而不是泛泛而谈。

它也不止画 charts。只要问题涉及对象之间如何连接，或者某个东西运行在哪里，assistant 就会把**真实 feature view 以内联、只读方式嵌进对话里**。这些都是 dedicated pages 使用的同一套 components，只是帮你聚焦到当前问题：

- **Dependency views**：focused **one-hop topology**（某个 service 的直接 upstream callers 和 downstream dependencies，而不是整张 layer map）、它的 **cross-layer hierarchy**（Smartscape fan，把 service 向上映射到 mesh mirror，向下映射到 backing infrastructure）、**deployment** graph、source→destination pair 的 **instance map**，以及 **API-dependency** chain；这些视图都可以在对话里 zoom 和 filter。
- **Signal explorers**：真实的 **Traces** list，并且点击行后显示 span **waterfall**（native SkyWalking 和 Zipkin tracing layers 都支持）；stored **Logs** view；以及 browser app 的 **Browser errors** stream 和 stack traces。

![图 1：当问题是服务如何连接时，assistant 会直接在对话里画出 dependency graph；无需跳转，使用的也是 topology 页面同一套 component。](/screenshots/horizon-1.0/ai-01-topology.webp)
图 1：当问题是服务如何连接时，assistant 会直接在对话里画出 dependency graph；无需跳转，使用的也是 topology 页面同一套 component。</br>

## 基于 live data，不会编造 metrics

这些 figures 可信，是因为 assistant 不是在自由联想你的系统。它把三类来源组合起来回答问题，而正是它们之间的配合，把分散的 signals 变成一张连贯的图：

- **Live data**：它通过 dashboards 使用的**同一个 OAP query protocol** 读取数据，所以看到的就是 dashboards 看到的内容，并且被限制在你的权限和它自己的 time window 内。
- **你的 layer 配置，被当作 skill 使用**：layer 和 overview templates 是 assistant 认识每个 layer 的目录：有哪些 curated metrics 和它们的 **MQE** expressions，每个 metric 属于哪个 entity **scope**（Service / ServiceInstance / Endpoint），以及这个 layer 带有哪些 components。它会**原样渲染**这些 expressions，而不是临时发明 metric 名；因此 chat 里的 figure 会和 dashboard 对齐。如果某个 layer 没有 trace component，它也会直接说明。
- **SkyWalking 的模型**：layers、scopes、metric catalog、topology 和 hierarchy。这些是 connective tissue，让它能把 metric 绑定到对应 entity，并沿 dependency edge 继续分析。

这带来一个很好的结果：catalog 来自*你的*配置，也就是你在 **Layer dashboards** admin 里编辑的内容，所以它也是你可以控制的扩展点。给 layer 加一个 metric，或者启用 traces/logs component，assistant 下一次 investigation 就会使用它；把 layer 配好，本质上就是在扩展 assistant 能做什么。

![图 2：在画任何东西之前，assistant 会先用和 UI 相同的 building blocks 建立方向感：列出 layers 和 services，浏览 metric catalog；因此每个 figure 都是 catalog-backed query。](/screenshots/horizon-1.0/ai-02-catalog-grounded.webp)
图 2：在画任何东西之前，assistant 会先用和 UI 相同的 building blocks 建立方向感：列出 layers 和 services，浏览 metric catalog；因此每个 figure 都是 catalog-backed query。</br>

## 有引导的 root-cause，也知道何时停止

你问 *"what's the root cause?"*，assistant 不会漫游。它会加载匹配的 **investigation playbook**：一个 master method，再加上 latency、error-rate / SLA、saturation、middleware dependency、Kubernetes workload 或 service mesh 的 focused variants。

当一个 service 看起来不健康时，原因可能在它自己，也可能在它依赖的东西上。所以 assistant 会**沿 dependency graph 找到问题从哪里开始**，也就是 root service，而不是停在第一个 symptom 上；它会区分 service 自身故障和它从被调用 dependency 继承来的故障。找到那里后，它继续钻到这个 service 最慢的 **instances 和 endpoints**，再触达 **error stack**。当线索离开 application tier，它会沿 cross-layer hierarchy **向下进入 backing infrastructure**。database、cache 或 queue 是 topology leaf，没有更下游的服务，所以 investigation 会在那里触底，然后转向它的 logs、Kubernetes hierarchy 和 network edge，因为 memory / disk / connection pressure 这类原因往往就在这些地方。

对 Kubernetes workload，它可以拉取 pod container 的 **on-demand logs**，也就是 error stack，并把获取到的日志行作为**只读结果**内联展示。这些日志直接从 cluster stream 过来，不会被存储；这个 block 不是 live console，所以如果要看更新的行，可以再问一次，或者打开专门的 **Pod Logs** tab 保持 tail。它继承你的 `logs:read` 权限，并受 OAP 能力控制；如果 on-demand logs 关闭了，assistant 会直接说明，而不是静默失败。

更关键的是，它知道什么时候该**停止**。当现有数据和工具无法进一步定位原因时，它会给出有边界、诚实的答案：结论或最佳假设、背后的证据，以及一个编号列表，逐条说明它无法确定什么、为什么无法确定，而不是在随机 pods 和 metrics 之间无限循环。对于 Kubernetes，它甚至会把调查交接下去，给出精确的 `kubectl` 命令，让你执行后把结果贴回来。

![图 3：一次 investigation 的结尾是一份 summary，而不是死胡同：哪里出了问题、影响哪些 services、可能是什么模式，以及接下来如何确认。](/screenshots/horizon-1.0/ai-03-summary.webp)
图 3：一次 investigation 的结尾是一份 summary，而不是死胡同：哪里出了问题、影响哪些 services、可能是什么模式，以及接下来如何确认。</br>

## 只读，以及一个需要你批准的动作

Assistant 的所有 investigation tools 都是**只读**的：它只观察和解释，不会修改 configuration、rules 或 dashboards。**Profiling 是唯一的 action**，并且有两层 gate：当 metrics 和 traces 无法定位原因时，assistant 会把 profiling task 作为 **decision card** *提议*出来，里面写清楚它发现了什么、为什么 profiling 有帮助、它预期看到什么。只有你在 popout 里**批准**，并且你持有 `profile:enable` 权限时，任务才会运行。Profile 收集完成后，你可以在后续 turn 里让它分析结果；它不会自己触发任何动作。

这个姿态贯穿到底。进入 assistant 需要 `ai:read` 权限（内置 viewer、maintainer、operator 和 admin roles 默认都有），但这只代表能打开 chat。每个 data tool 执行前都会**重新检查自己的 read verb**：figures 需要 `metrics:read`，alarms 需要 `alarms:read`，graphs 需要 `topology:read`，此外还有 `traces:read`、`logs:read`、`browser-errors:read`。如果你没有某个 verb，对应 tool 会被拒绝，并在 transcript 里显示为 **denied** chip，所以 assistant 不能看到超过你权限范围的数据。

<!-- FIGURE TO CAPTURE (see CAPTURE-CHECKLIST.md): the profiling decision card — the assistant's proposed cause + rationale + expectation, with the Approve control, before anything runs. -->

## Bring your own LLM

这里决定了你能不能真的跑起来：**不需要 frontier model**。Assistant 是 **vendor-neutral** 的，通过 pluggable transport 访问你的模型，不绑定特定 vendor。默认支持任何 **OpenAI-compatible** endpoint（hosted model、自托管或本地模型、AI gateway 都可以）；也支持 **Amazon Bedrock**。你只需要设置 model id、base URL 和 API key，集成就完成了。

为什么中等规模的模型也能做好这件事？因为 observability expertise 不在模型里，而在 **tools、metric catalog 和内置 playbooks** 里。模型的工作是*编排*这些 tools，并*叙述*结果，而不是从零开始理解 SkyWalking（temperature 固定为 0，以获得稳定的 tool-calling）。实际使用中，一个高性价比、具备 tool-calling 能力的模型通常就足够；你不需要为了得到可靠 investigation 而付费使用、或者等待市场上最大的模型。

启用它只需要一小段 config。可以写在 `horizon.yaml`，也可以完全通过 `HORIZON_AI_*` 环境变量配置：

```yaml
ai:
  enabled: true
  provider: openai-compatible   # or: bedrock
  model: "your-model-id"
  baseUrl: "https://your-endpoint/v1"
  apiKey: "${HORIZON_AI_API_KEY}"   # secret — env only, redacted from logs
```

API key 是 secret：只通过环境变量设置，会从 logs 中 redact，并排除在 audit trail 之外。浮动的 **AI Assistant** launcher 会对每个已登录用户显示，让功能可发现；但在它被启用并指向模型之前，panel 会以**只读**方式打开，显示一个简短的 “ask your administrator to set it up” 提示，而不是 chat box。System prompt 和 starter example chips 都带有合理默认值，也可以被完整替换；starter 还可以嵌入 `<service>` 或 `<layer>` placeholder，打开一个 free-text fill-in。你输入近似名称，模型会在 query time 把它解析为真实 entity。

<!-- FIGURE TO CAPTURE (see CAPTURE-CHECKLIST.md): the enable/config surface — the launcher's read-only "ask your administrator" state, or the AI config block. -->

## Safe by construction

因为 assistant 会读取不可信的 operational data，比如 service 和 pod names、alarm messages、log lines、trace text，所以它被设计为**把 tool 返回的一切都当作待分析的数据，而不是要服从的指令**。一行日志如果写着 "ignore previous instructions"，它会被引用和调查，而不是被执行。Assistant 被要求留在 observability task 内，不展示自己的配置，也不展示其他用户的数据。结合 read-only-by-default、每个 tool 的 read-verb re-check，以及 logs 和 audit trail 中的 secret redaction，这个 assistant 的设计目标就是可以安全地接到真实生产 backend 上。

## 它在哪里，以及如何开始

你可以从 launcher 把 assistant 打开为 **side drawer**；需要更多空间时，把它**展开成 `/ai` full page**；也可以 pop out 到单独 browser tab。它有自己的 time window（chat header 里有 clock，默认过去一小时），没有 service picker：直接在问题里写 service 名即可。隐私方面：你的模型**凭证只存在 server configuration 里，不会进入 browser**；conversation history 保存在 browser 的 **local storage** 中（有上限，跨 tab 同步），你可以从 `/ai` 的 History sidebar 删除任意 conversation。

AI Assistant 随 **Horizon UI 1.0** 发布。要试用它，启用 `ai:` block，指向一个你已有访问权限的模型，然后问出第一个你原本会手动排查的问题。完整配置说明请看 [AI Assistant documentation](/docs/skywalking-horizon-ui/next/operate/ai-assistant/)。

如果你刚开始了解 Horizon，可以先读系列开篇 [Meet Horizon UI · 1/17](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 和 [getting-started guide](/zh/2026-06-30-horizon-ui-getting-started-and-migration/)。然后回来，让 assistant 带你走一遍你自己的系统。
