---
title: "Horizon UI 1.0 正式发布：SkyWalking 新一代控制台接棒 Booster"
date: 2026-09-10
author: 吴晟
description: "Horizon UI 1.0 正式发布，社区投票决定由 Horizon 接替 Booster，承担 SkyWalking 今后的 UI 开发与维护。本文介绍新控制台、迁移要点，以及 AI 智能体可观测性的最新进展。"
images:
  - /blog/2026-09-10-horizon-ui-1-0-ga/horizon-1.0-ga-featured.png
tags:
  - Release
  - Community
---

*英文原文：[Horizon UI 1.0 GA: SkyWalking's New Mainstream UI](/blog/2026-09-10-horizon-ui-1-0-ga/)。*

![Apache SkyWalking Horizon UI 1.0 正式发布，成为 SkyWalking 新一代主流 UI。](/blog/2026-09-10-horizon-ui-1-0-ga/horizon-1.0-ga-featured.png)

**Apache SkyWalking Horizon UI 1.0 已正式发布（GA）。社区也已投票决定，由 Horizon 接替 Booster，作为 SkyWalking 今后主要开发和维护的用户界面。**

Horizon [1.0.0 于 8 月 28 日发布](/events/release-apache-skywalking-horizon-ui-1-0-0/)。随后，社区通过了将 UI 开发与维护工作集中到 Horizon、停止维护 Booster 的提案。[投票结果](https://lists.apache.org/thread/phjx33xfcb0mygcw5jlrmfd73tt8pkpr)于 9 月 3 日公布：**3 票具有约束力的赞成票（binding +1），没有反对票**。随着这项提案通过，Horizon 正式接棒，成为 SkyWalking 用户使用和管理可观测性数据的新一代控制台。

## Booster 停止维护，现有用户需要关注什么

**Booster UI 已结束维护。** 按照[社区投票通过的方案](https://lists.apache.org/thread/phjx33xfcb0mygcw5jlrmfd73tt8pkpr)，Booster 不再增加新功能，也不再修复缺陷或提供安全更新，**包括 CVE 漏洞修复**。代码仓库和已发布的版本仍会保留。社区建议现有用户逐步迁移到 Horizon，以便继续获得后续版本的功能与维护支持。

感谢所有参与 Booster 开发、维护、翻译和测试的贡献者，也感谢长期使用并提供反馈的用户。多年来，Booster 帮助大家了解系统运行状态、定位线上问题。Horizon 延续了 SkyWalking 的可观测性模型，并以新的界面和交互方式，继续完善日常排查与运维体验。

## 在一个控制台里完成观测、排查和运维

过去几个月，我们通过[《认识 Horizon UI》系列](/zh/2026-06-21-skywalking-horizon-ui-introduction/)陆续介绍了新控制台的各项功能。本文沿用该系列及后续 AI 助手介绍中的截图，回顾 1.0 带来的主要体验。

Horizon 围绕服务组织信息，侧边栏根据 OAP 上报的服务及其所属层（Layer）生成导航。进入服务页面，就能查看相关的指标、拓扑、调用链、日志和告警。1.0 版本内置 **46 个仪表盘**，用户可以通过模板，在控制台中调整图表组件、阈值、标签和布局。

![Horizon 服务概览：左侧按层组织导航，右侧展示服务指标、拓扑和当前告警。](/screenshots/horizon-0.7.0/p01-intro-01-sidebar-is-the-estate.webp)

*服务概览集中展示服务健康状态、调用关系和当前告警。图片来自[《认识 Horizon UI》首篇](/zh/2026-06-21-skywalking-horizon-ui-introduction/)。*

排查问题时，可以从图表上的一次延迟异常出发，找到对应的调用链，再通过瀑布图查看各个调用步骤（Span）的耗时。SkyWalking 原生链路和 Zipkin 链路使用统一的查询与查看方式。如果仅靠指标还不足以定位问题，还可以继续查看日志、借助源码映射（source map）定位浏览器错误，或使用五类性能剖析功能深入分析。

需要了解系统全貌时，**3D 基础设施地图**会按层展示服务及其关联关系。用户可以先观察整体部署，再进入具体服务；地图上的告警标记也能帮助快速发现需要关注的位置。

![Horizon 3D 基础设施地图：按层展示服务及其关联关系。](/screenshots/horizon-0.7.0/p05-3dmap-01-overview.webp)

*先了解部署全貌，再进入具体服务查看详情。图片来自[《3D 基础设施地图》](/zh/2026-06-22-horizon-ui-3d-infrastructure-map/)。*

运维工作也可以在 Horizon 中完成。启用 OAP 11 的相应模块后，用户能够管理运行时规则，用实时样本调试规则执行过程，检查接入的数据，并查看 OAP 集群的配置和健康状态。这些功能的访问权限由服务端校验。本地账户与 LDAP 认证、单点登录、可配置的仪表盘，以及八种语言支持，则方便不同团队按自身需求使用控制台。

## 让 AI 助手参与日常排查

Horizon 1.0 内置 **AI 助手**，并通过**模型上下文协议（MCP）**向外部智能体开放查询能力，让 AI 参与日常的系统排查。

内置助手读取实时可观测性数据，并使用 Horizon 自身的图表、表格、拓扑和调用链视图展示分析结果。这些视图可以交互，保存的查询结果也会保留当时的时间戳，再次打开对话时仍可查看排查时使用的数据。AI 助手是可选功能，默认关闭，由管理员启用并配置模型。

![Horizon AI 助手在对话中展示可交互的服务拓扑，辅助分析系统问题。](/screenshots/horizon-1.0/ai-01-topology.webp)

*助手可以在对话中展示与控制台其他页面相同的交互式拓扑。图片来自[《Horizon UI AI 助手》](/zh/2026-07-06-horizon-ui-ai-assistant/)。*

通过 MCP，外部智能体也能使用这些排查能力，模型仍由客户端运行或接入。所有访问都受已登录用户的权限约束，MCP 工具仅提供只读操作。对于内置助手，如果现有数据不足以定位问题，它可以建议发起性能剖析；但真正启动任务，仍需要用户具备相应权限并明确批准。

这样，用户和智能体就能围绕同一服务，使用同一套视图和数据协同排查。1.0 的完整功能与变更见[版本说明](/docs/skywalking-horizon-ui/v1.0.0/changelog/1.0.0/)。

## 下一步：让 AI 智能体的工作过程可观测

Horizon 1.0 也是面向 AI 可观测性的一个起点。我们正在沿着两个方向推进：用 AI 帮助用户理解系统，同时让 AI 智能体自身的工作过程能够被查看、追溯和分析。

在[首次介绍 Apache SkyWalking AI Sessionizer](/blog/2026-09-03-ai-sessionizer-first-look/)之后，这些设想已经有了具体实现。Sessionizer 可以将整理、关联后的对话记录发送给 OAP，**开发中的 Horizon 1.1 和 OAP 11.1** 则增加了 **AI Agents 层**，用于查询和查看这些记录。下文介绍的是开发分支中的进展，将在 1.0 正式版的基础上继续完善。

Horizon 和 Sessionizer 的本地查看器共用一套对话渲染组件。打开对话后，可以阅读对话中的交互记录，展开其中一轮对话，查看回复背后的模型调用和工具执行过程，也可以沿时间线进入子智能体的执行记录。选中一个步骤，就能查看详细信息及对应的来源记录。分享链接会保留当前选中的轮次和步骤，方便其他人直接查看同一位置。具体用法见[对话回放文档](https://github.com/apache/skywalking-horizon-ui/blob/22e2f8692de57b12529fad4b6c819d8943b7e565/docs/operate/ai-agent-conversations.md)。

**Claude Code 的文件变更追踪也已加入其中。** 开发中的 **AI Sessionizer 0.3.0** 会记录工具执行期间的工作区变更，并关联到相应的工具调用；无法归属到具体调用的变更则单独保留。对话中的 **Changes（变更）**视图会按工作区和文件汇总记录。点击一条变更，就能跳转到对应的工具执行步骤，展开差异，查看新增和删除的内容，并进一步追溯这条记录的来源。智能体说了什么、调用了什么工具，以及执行期间记录到了哪些文件变化，都可以放在一起查看。

对于 Claude Code 自身记录的主智能体编辑操作，Sessionizer 无需插件即可读取。可选的 [asz Claude Code 插件](https://github.com/apache/skywalking-ai-sessionizer/blob/b66b0578c0e523bb6c442c4b8201776333a40872/docs/en/setup/claude-code-plugin.md)进一步支持采集 **Shell 命令执行期间的文件变更，以及子智能体内的编辑操作**。记录也会说明采集的限制：多个工具的执行时间重叠时，会明确标注，避免将变更单独归到某一次调用上；某条命令跳过了工作区扫描，也不会被当作“文件没有变化”的依据。

新的 [AI 智能体仪表盘](https://github.com/apache/skywalking-horizon-ui/blob/22e2f8692de57b12529fad4b6c819d8943b7e565/docs/dashboards/ai_agent.md)还可以按类型、模型，以及主智能体和子智能体分别展示 Token 用量，并查看缓存读取占比。费用、活跃时长等额外指标，需要由 Claude Code 自带的遥测导出器提供。对话回放、文件变更和用量指标，让智能体的执行过程与资源消耗有了具体的观察依据。后续还会继续扩展对更多智能体运行环境的支持，并完善分析能力。

## 如何迁移到 Horizon

可以从 [Horizon 1.0 文档](/docs/skywalking-horizon-ui/v1.0.0/readme/)和[下载页面](/downloads/)开始。Horizon 与 OAP 独立发布，切换控制台之前，需要先根据现有 OAP 版本完成配置。

**容器镜像仍在原来的 [Docker Hub `apache/skywalking-ui` 仓库](https://hub.docker.com/r/apache/skywalking-ui)中发布。** Horizon 使用 `horizon-*` 标签，本次正式版对应 **`apache/skywalking-ui:horizon-1.0.0`**。**`apache/skywalking-ui:latest` 现在也已指向 Horizon**；如果部署一直跟随 `latest`，需要注意，使用新镜像更新部署时，控制台将切换为 Horizon。

- **Horizon 主要面向 OAP 11.x。** 配置好查询和管理接口的连接，并按需要启用相应模块。仪表盘发布依赖 OAP 11 的模板管理 REST API。
- **对 OAP 10.x 的支持有限，且必须配置 `templates.mode: readonly`**，也可以设置环境变量 `HORIZON_TEMPLATES_MODE=readonly`。此时 Horizon 使用内置模板。若要使用包括 SkyWalking 原生链路详情在内的排查功能，需要 OAP 10.3 或更高版本；更早的 10.x 版本在链路查看和端点选择方面还有额外限制。连接 OAP 10 时，无法使用 Horizon 的模板编辑功能及依赖 OAP 11 的管理功能。
- **迁移时请核对控制台配置。** 配置用户或身份提供方、角色映射，并检查团队日常使用的仪表盘。原有 Booster 自定义仪表盘如需保留，应根据实际需求使用 Horizon 模板重新配置。完成常用排查流程的验证后，再切换团队的访问入口。

各版本的支持范围见 [OAP 兼容性指南](/docs/skywalking-horizon-ui/v1.0.0/compatibility/oap-version/)；通过环境变量或挂载文件配置容器的方法，见[容器部署指南](/docs/skywalking-horizon-ui/v1.0.0/setup/container-image/)。

感谢所有参与试用、提交反馈并帮助 Horizon 走到 1.0 的用户和贡献者。欢迎在自己的环境中体验 Horizon，继续阅读[《认识 Horizon UI》系列](/zh/2026-06-21-skywalking-horizon-ui-introduction/)，也欢迎[参与项目建设](https://github.com/apache/skywalking-horizon-ui)，一起完善 SkyWalking 的下一代控制台。
