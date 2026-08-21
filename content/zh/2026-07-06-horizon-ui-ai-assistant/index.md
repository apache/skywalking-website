---
title: "认识 Horizon UI · AI Assistant：用日常语言查询你的可观测性数据"
date: 2026-07-06
author: 吴晟
description: "Horizon UI 新增的 AI Assistant 可以用和 UI 相同的图表、拓扑和表格回答运行中系统的问题；它只读、按权限返回结果，并运行在你自己接入的高性价比模型上。"
tags:
  - Release
  - AI
  - Cloud Native
---

*译自英文原文：[Meet Horizon UI · The AI Assistant: Ask Your Observability Data in Plain Language](/blog/2026-07-06-horizon-ui-ai-assistant/)。*

[**Meet Horizon UI**](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列已经以 17/17 收官：它完整讲过 SkyWalking 新控制台的各个界面，从展示系统全貌的侧边栏、adaptive dashboards、topology 和 3D map，到 trace 和 log explorers、profiling、alarms、operations surface、access control，以及 config-driven customization。这篇是新的章节，随 **Horizon UI 1.0** 一起到来：内置的 **AI Assistant** 让你可以像聊天一样查询自己的可观测性数据，而不是一路点进去查。

它不是简单地给 dashboard 加一个聊天入口。你可以直接问它：*"what's unhealthy in the system right now?"*、*"investigate the response time for a service"*。它会沿用 dashboards 的查询路径，从你的 OAP backend 读取**实时数据**，然后流式返回一份按步骤展开的分析结果；结果里仍然是 Horizon 到处都在使用的**同一套图表、拓扑和表格**。它是**只读**的，**继承你的权限**，并且默认关闭，直到 operator 启用它并配置好模型。

{{< video src="/screenshots/horizon-1.0/ai-00-investigation.mp4" poster="/screenshots/horizon-1.0/ai-00-investigation-poster.webp" caption="一个问题，一次完整排查：assistant 先 triage active alarms，再画出 response-time 和 error-rate 图来解释问题；这些图使用 dashboards 同一套 widgets，并带有编号，方便正文引用。" >}}

## 能看见的答案，而不是一整屏文字

Assistant 的基本方式是 *show, don't describe*。它先写一两句话，再**画出真实图形**，解释图里实际说明了什么，然后进入下一步。每个图都是实时渲染的结果，不是截图，也不是编出来的数字：line charts、single-value cards、top-N lists、带 label 的 tables 和 record lists，都会根据底层 metric expression 的形状来选择。它会给自己画出的每个 block 编上连续的 **Figure N**，所以正文可以引用刚刚渲染出来的图，比如 “the response-time chart above shows the spike”，而不是泛泛而谈。

它也不只会画图。只要问题涉及对象之间的连接关系，或者某个东西运行在哪里，assistant 就会把**真实功能视图以只读方式嵌进对话里**。这些视图使用各个专门页面的同一套组件，只是自动聚焦到当前问题上：

- **Dependency views**：聚焦一跳的 **one-hop topology**（某个 service 的直接 upstream callers 和 downstream dependencies，而不是整张 layer map）、**cross-layer hierarchy**（Smartscape fan，把 service 向上映射到 mesh mirror，向下映射到 backing infrastructure）、**deployment** graph、source→destination pair 的 **instance map**，以及 **API-dependency** chain；这些视图都可以在对话里缩放和过滤。
- **Signal explorers**：真实的 **Traces** 列表，点击一行就展开 span **waterfall**（native SkyWalking 和 Zipkin tracing layers 都支持）；存储日志的 **Logs** 视图；以及浏览器应用的 **Browser errors** 错误流和 stack traces。

![图 1：当问题是服务如何连接时，assistant 会直接在对话里画出 dependency graph；无需跳转，使用的也是 topology 页面同一套组件。](/screenshots/horizon-1.0/ai-01-topology.webp)
图 1：当问题是服务如何连接时，assistant 会直接在对话里画出 dependency graph；无需跳转，使用的也是 topology 页面同一套组件。</br>

## 基于实时数据，不会编造 metrics

这些 figures 可信，是因为 assistant 不是在凭空猜你的系统。它把三类信息组合起来回答问题，而正是它们之间的配合，把分散的 signals 串成一张连贯的图：

- **实时数据**：它通过 dashboards 使用的**同一个 OAP query protocol** 读取数据，所以看到的就是 dashboards 看到的内容，并且受你的权限和它自己的 time window 约束。
- **你的 layer 配置**：assistant 会把 layer 和 overview templates 当作了解每个 layer 的目录：有哪些 curated metrics 和它们的 **MQE** expressions，每个 metric 属于哪个 entity **scope**（Service / ServiceInstance / Endpoint），以及这个 layer 带有哪些组件。它会**原样渲染**这些 expressions，而不是临时发明 metric 名；因此对话里的图会和 dashboard 对齐。如果某个 layer 没有 trace component，它也会直接说明。
- **SkyWalking 的模型**：layers、scopes、metric catalog、topology 和 hierarchy。这些结构把 metric、entity 和依赖边接起来，让 assistant 能沿依赖关系继续分析。

这带来一个好处：catalog 来自*你的*配置，也就是你在 **Layer dashboards** admin 里编辑的内容，所以它也是你可以控制的扩展点。给 layer 加一个 metric，或者启用 traces/logs component，assistant 下一次排查就能用上；换句话说，把 layer 配好，就是在扩展它的能力边界。

![图 2：在画任何东西之前，assistant 会先用和 UI 相同的基础能力建立方向感：列出 layers 和 services，浏览 metric catalog；因此每个 figure 都是由 catalog 支撑的查询。](/screenshots/horizon-1.0/ai-02-catalog-grounded.webp)
图 2：在画任何东西之前，assistant 会先用和 UI 相同的基础能力建立方向感：列出 layers 和 services，浏览 metric catalog；因此每个 figure 都是由 catalog 支撑的查询。</br>

## 有引导的 root-cause，也知道何时收手

你问 *"what's the root cause?"*，assistant 不会到处乱查。它会加载匹配的 **investigation playbook**：一个通用方法，再加上 latency、error-rate / SLA、saturation、middleware dependency、Kubernetes workload 或 service mesh 的专门变体。

当一个 service 看起来不健康时，原因可能出在它自己，也可能出在它调用的依赖上。所以 assistant 会**沿 dependency graph 追到问题起点**，也就是 root service，而不是停在第一个 symptom 上；它会区分 service 自身故障和从 dependency 传导过来的故障。找到那里后，它继续下钻到这个 service 最慢的 **instances 和 endpoints**，再找到 **error stack**。当线索离开应用层，它会沿 cross-layer hierarchy **向下进入 backing infrastructure**。database、cache 或 queue 是 topology leaf，没有更下游的服务，所以 investigation 会在那里触底，然后转向它的 logs、Kubernetes hierarchy 和 network edge，因为 memory / disk / connection pressure 这类原因往往就在那里。

对 Kubernetes workload，它可以拉取 pod container 的 **on-demand logs**，也就是 error stack，并把获取到的日志行作为**只读结果**内联展示。这些日志直接从 cluster 取回，不会被保存；这个结果块不是实时终端，所以如果要看更新的日志，可以再问一次，或者打开专门的 **Pod Logs** tab 保持 tail。它继承你的 `logs:read` 权限，并受 OAP 能力控制；如果 on-demand logs 关闭了，assistant 会直接说明，而不是静默失败。

更关键的是，它知道什么时候该**收手**。当现有数据和工具无法进一步定位原因时，它会给出有边界、诚实的答案：结论或最佳假设、背后的证据，以及一个编号列表，逐条说明它无法确定什么、为什么无法确定，而不是在 pods 和 metrics 之间来回打转。对于 Kubernetes，它甚至会把调查交接下去，给出精确的 `kubectl` 命令，让你执行后把结果贴回来。

![图 3：一次 investigation 的结尾是一份 summary，而不是卡在那里：哪里出了问题、影响哪些 services、可能是什么模式，以及接下来如何确认。](/screenshots/horizon-1.0/ai-03-summary.webp)
图 3：一次 investigation 的结尾是一份 summary，而不是卡在那里：哪里出了问题、影响哪些 services、可能是什么模式，以及接下来如何确认。</br>

## 只读，以及一个需要你批准的动作

Assistant 的所有 investigation tools 都是**只读**的：它只观察和解释，不会修改 configuration、rules 或 dashboards。**Profiling 是唯一的动作入口**，并且有两层 gate：当 metrics 和 traces 无法定位原因时，assistant 会把 profiling task 作为 **decision card** *提议*出来，里面写清楚它发现了什么、为什么 profiling 有帮助、它预期看到什么。只有你在 popout 里**批准**，并且你持有 `profile:enable` 权限时，任务才会运行。Profile 收集完成后，你可以在后续对话里让它分析结果；它不会自己触发任何动作。

这个原则贯穿到底。进入 assistant 需要 `ai:read` 权限（内置 viewer、maintainer、operator 和 admin roles 默认都有），但这只代表能打开对话。每个 data tool 执行前都会**重新检查自己的 read verb**：figures 需要 `metrics:read`，alarms 需要 `alarms:read`，graphs 需要 `topology:read`，此外还有 `traces:read`、`logs:read`、`browser-errors:read`。如果你没有某个 verb，对应 tool 会被拒绝，并在对话记录里显示为 **denied** chip，所以 assistant 不能越过你的权限范围读取数据。

<!-- FIGURE TO CAPTURE (see CAPTURE-CHECKLIST.md): the profiling decision card — the assistant's proposed cause + rationale + expectation, with the Approve control, before anything runs. -->

## 接入你自己的 LLM

这里决定了它能不能真的落地：**不需要顶级大模型**。Assistant **不绑定模型厂商**，通过可插拔的模型接入层访问你的模型。默认支持任何 **OpenAI-compatible** endpoint（hosted model、自托管或本地模型、AI gateway 都可以）；也支持 **Amazon Bedrock**。你只需要设置 model id、base URL 和 API key，集成就完成了。

为什么中等规模的模型也能做好这件事？因为可观测性经验不在模型里，而在 **tools、metric catalog 和内置 playbooks** 里。模型的工作是*编排*这些 tools，并把结果组织成可读的分析，而不是从零开始理解 SkyWalking（temperature 固定为 0，以稳定 tool-calling）。实际使用中，一个高性价比、具备 tool-calling 能力的模型通常就足够；你不必为了得到可靠 investigation，就去使用或等待市场上最大的模型。

启用它只需要一小段 config。可以写在 `horizon.yaml`，也可以完全通过 `HORIZON_AI_*` 环境变量配置：

```yaml
ai:
  enabled: true
  provider: openai-compatible   # or: bedrock
  model: "your-model-id"
  baseUrl: "https://your-endpoint/v1"
  apiKey: "${HORIZON_AI_API_KEY}"   # secret — env only, redacted from logs
```

API key 按 secret 处理：只通过环境变量设置，会在 logs 中脱敏，并排除在 audit trail 之外。浮动的 **AI Assistant** launcher 会对每个已登录用户显示，方便大家发现这个功能；但在它被启用并指向模型之前，panel 只会以**只读**方式打开，显示一条简短的 “ask your administrator to set it up” 提示，而不是 chat box。System prompt 和 starter example chips 都带有合理默认值，也可以被完整替换；starter 还可以嵌入 `<service>` 或 `<layer>` 占位符，打开一个自由输入框。你输入近似名称，模型会在查询时把它解析为真实 entity。

<!-- FIGURE TO CAPTURE (see CAPTURE-CHECKLIST.md): the enable/config surface — the launcher's read-only "ask your administrator" state, or the AI config block. -->

## Safe by construction

因为 assistant 会读取不可信的运行数据，比如 service 和 pod names、alarm messages、log lines、trace text，所以它被设计为**把 tool 返回的一切都当作待分析的数据，而不是要服从的指令**。一行日志如果写着 "ignore previous instructions"，它会被引用并分析，而不是被执行。Assistant 被要求留在 observability task 内，不展示自己的配置，也不展示其他用户的数据。结合默认只读、每个 tool 的 read-verb re-check，以及 logs 和 audit trail 中的 secret redaction，这个 assistant 的设计目标就是可以更放心地接到真实生产 backend 上。

## 它在哪里，以及如何开始

你可以从 launcher 把 assistant 打开为 **side drawer**；需要更多空间时，把它**展开成 `/ai` full page**；也可以弹出到单独的 browser tab。它有自己的 time window（chat header 里有 clock，默认过去一小时），没有 service picker：直接在问题里写 service 名即可。隐私方面：你的模型**凭证只存在 server configuration 里，不会进入 browser**；conversation history 保存在 browser 的 **local storage** 中（有上限，跨 tab 同步），你可以从 `/ai` 的 History sidebar 删除任意 conversation。

AI Assistant 随 **Horizon UI 1.0** 发布。要试用它，启用 `ai:` block，指向一个你已有访问权限的模型，然后问出第一个你原本会手动排查的问题。完整配置说明请看 [AI Assistant 文档](/docs/skywalking-horizon-ui/next/operate/ai-assistant/)。

如果你刚开始了解 Horizon，可以先读系列开篇 [Meet Horizon UI · 1/17](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 和 [getting-started guide](/zh/2026-06-30-horizon-ui-getting-started-and-migration/)。然后回来，让 assistant 带你走一遍你自己的系统。
