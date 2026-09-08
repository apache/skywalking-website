---
title: "BanyanDB 0.11.0：新特性与升级指南"
date: 2026-09-07
author: "BanyanDB 团队"
description: "BanyanDB 0.11.0：默认启用向量化查询、可插拔链路采样、Schema 屏障，以及不可忽略的升级顺序。"
tags:
  - Release
  - Storage
---

*译自英文原文：[BanyanDB 0.11.0: What's New and How to Upgrade](/blog/banyandb-0-11-0-vectorized-queries-by-default-explained/)。*

![BanyanDB 0.11.0 发布封面：包含 229 次提交、14 位贡献者，以及默认启用向量化的三类查询引擎](banner.jpg)

[BanyanDB](https://github.com/apache/skywalking-banyandb) 0.11.0 已正式发布。向量化查询从可选功能升级为默认路径；链路保留采样有了可插拔流水线；集群级 Schema 一致性屏障补上了正确性缺口；编码智能体可以通过两条新路径用自然语言查询 BanyanDB；etcd 支持也已移除，Schema Registry 统一使用 Property 模式。

我们逐一梳理了此次发布的 229 次提交，整理出集群运维人员需要关注的功能、性能改进、API 变化和升级风险。

> **核心要点**
>
> - Measure、Stream 和 Trace 的向量化查询路径现已**默认启用**，可减少扫描密集型查询的内存分配；但这也改变了滚动升级顺序：必须**先升级 Liaison 节点，再升级 Data 节点**。
> - 新增的合并中（in-merge）和最终化阶段（finalize-time）链路保留采样流水线，可通过可插拔的 `.so` 采样器插件丢弃不需要的 Span；即使一次合并涉及数百万条链路，其内存占用也有明确上限。
> - 编码智能体现在可以通过两种方式使用自然语言查询 BanyanDB：一种是带有 `bydbql` Skill 的 Claude Code/Codex **MCP 插件**，另一种是独立的 **`bydbctl agent`** 终端界面。
> - **etcd 支持已完全移除**，API 版本也升级至 0.11，因此请安排维护窗口执行升级。队列和生命周期指标同样经过了重新设计。


## 向量化查询现已默认启用

列式（向量化）查询路径使用批量列式流水线取代逐行 Protobuf 序列化。自 0.10 起，Measure 查询已经默认使用该路径；在 0.11 中，**Stream 和 Trace 查询也加入其中**：`--stream-vectorized-enabled`、`--trace-vectorized-enabled` 和 `--measure-vectorized-enabled` 均默认为 `true`。

对于 Measure 查询，单节点场景的覆盖现已完整：扫描、通过 `BatchAggregation` 实现的 `GroupBy`+`Agg`、标量归并（scalar reduce）、原始 `GroupBy`、`TopN`/`BottomN`、`order_by`，以及边界错误的一致性，都会通过向量化分派执行，并保持与逐行路径相同的语义。其 gRPC 线上格式与逐行路径的输出逐字节一致；团队还通过 6 小时的生产环境浸泡测试验证了这一点，期间未发现任何差异。分布式 Map 模式的部分聚合和多 Group 请求目前仍使用逐行路径，后续版本将继续完善。

这也是本次发布中最重要的**滚动升级破坏性变更**。所需的升级顺序请参阅下文的[破坏性变更与安全升级方法](#breaking-changes-and-how-to-upgrade-safely)。

## 可插拔的链路保留采样流水线

链路数据保留得越多，存储成本越高；直接丢弃数据，又可能删掉排障需要的链路。0.11 在存储节点加入了**合并中链路保留过滤器**。过滤器按 Group 执行采样器链，从核心 Part 和二级索引 Part 中安全移除未保留的链路。采样器可按 Group 动态配置，也支持运行时注册、更新和移除。

为了让过滤器能在生产环境中稳定运行，0.11 加入了两项设计：

- **最终化采样（Finalization sampling）**是一道尽力而为的兜底机制。节点范围内仅有一个并发度为 1 的扫描器，定期扫描已经冷却的 Segment，并让每个 Shard 尚未最终化的 Part 通过所属 Group 的采样器链进行强制合并。它复用现有的热合并路径，因此不会与热合并信号量竞争。每个 Part 都带有 `finalizeGen` 标记；该标记会先于 Part 元数据写入磁盘，因此即使进程崩溃，重放时也不会重复采样。
- **Drop set 的大小在设计上有界。** Shard 的首轮最终化可能会将所有已冷却的 Part 一次性选入同一次合并。如果不加限制，包含 1,800 万个条目的 Drop set 会占用约 1.3 GiB 活跃堆内存和 2.6 GiB 预留堆内存，而该进程还需要同时处理查询。因此，流水线限制的是采样*决策*数量，而不是裁剪谓词。一旦某次合并的 Drop set 已满，后续原本建议丢弃的记录都会被保留，而不再加入集合。这样，集合对于实际执行的丢弃操作始终是完整的，既不会出现孤立条目，也不会遗漏任何条目。上限由内存保护器按 `limit/(16×CPUs)` 计算，使并发合并的总占用保持在约 `limit/16`。

<figure>

<svg viewBox="0 0 640 340" width="100%" role="img" aria-label="链路保留采样流水线示意图：来自合并中过滤器的新 Part，以及来自最终化兜底机制的已冷却 Segment，都会进入按 Group 配置的采样器链；每条链路随后被分流为保留或丢弃">
  <title>链路保留采样流水线如何决定保留哪些数据</title>
  <desc>采样器链接收两类输入：在合并中过滤阶段评估的新 Part，以及由最终化兜底扫描器扫描、未经过合并中过滤的已冷却 Segment。采样器链按 Group 规则评估，并将每条链路分流为保留或丢弃。</desc>
  <rect x="20" y="40" width="220" height="56" rx="8" fill="none" stroke="#38bdf8"></rect>
  <text x="130.0" y="60.0" text-anchor="middle" font-size="13" fill="currentColor">新 Part</text>
  <text x="130.0" y="76.0" text-anchor="middle" font-size="13" fill="currentColor">（合并中过滤器）</text>
  <rect x="20" y="240" width="220" height="56" rx="8" fill="none" stroke="#a78bfa"></rect>
  <text x="130.0" y="260.0" text-anchor="middle" font-size="13" fill="currentColor">已冷却 Segment</text>
  <text x="130.0" y="276.0" text-anchor="middle" font-size="13" fill="currentColor">（最终化兜底）</text>
  <rect x="300" y="140" width="160" height="56" rx="8" fill="none" stroke="currentColor"></rect>
  <text x="380.0" y="160.0" text-anchor="middle" font-size="13" fill="currentColor">采样器链</text>
  <text x="380.0" y="176.0" text-anchor="middle" font-size="13" fill="currentColor">（按 Group 配置的规则）</text>
  <rect x="520" y="40" width="100" height="56" rx="8" fill="none" stroke="#22c55e"></rect>
  <text x="570.0" y="68.0" text-anchor="middle" font-size="13" fill="currentColor">保留</text>
  <rect x="520" y="240" width="100" height="56" rx="8" fill="none" stroke="#94a3b8"></rect>
  <text x="570.0" y="268.0" text-anchor="middle" font-size="13" fill="currentColor">丢弃</text>
  <line x1="240.0" y1="68.0" x2="295.0" y2="150.5" stroke="#38bdf8" stroke-width="2"></line>
  <path d="M 300.0 158.0 L 292.8 154.5 L 299.5 150.0 Z" fill="#38bdf8"></path>
  <line x1="240.0" y1="268.0" x2="295.0" y2="185.5" stroke="#a78bfa" stroke-width="2"></line>
  <path d="M 300.0 178.0 L 299.5 186.0 L 292.8 181.5 Z" fill="#a78bfa"></path>
  <line x1="460.0" y1="158.0" x2="515.0" y2="75.5" stroke="#22c55e" stroke-width="2"></line>
  <path d="M 520.0 68.0 L 519.5 76.0 L 512.8 71.5 Z" fill="#22c55e"></path>
  <line x1="460.0" y1="178.0" x2="515.0" y2="260.5" stroke="#94a3b8" stroke-width="2"></line>
  <path d="M 520.0 268.0 L 512.8 264.5 L 519.5 260.0 Z" fill="#94a3b8"></path>
  <text x="320" y="325" text-anchor="middle" font-size="10" fill="#898781">来源：BanyanDB CHANGES.md 与 docs/design/trace-drop-set-bounding.md，0.11.0</text>
</svg>

<figcaption>链路保留采样流水线如何决定保留哪些数据。原创示意图。</figcaption>
</figure>

完整的推导过程请参阅 [Trace Drop Set 边界设计文档](https://github.com/apache/skywalking-banyandb/blob/master/docs/design/trace-drop-set-bounding.md)。

项目随版本提供了适配 SkyWalking 自有 Trace Schema 和 Zipkin 的第一方采样器插件（`sw-trace-sampler.so`、`zipkin-trace-sampler.so`），以及带资源上限的遥测 SDK。采样器插件因此可以输出自身经过计量的指标和日志，而不会让宿主进程的基数或日志预算无限增长。

完整的配置 Schema 请参阅 [Trace Pipeline 插件 SDK 与采样器配置参考](https://github.com/apache/skywalking-banyandb/blob/master/plugins/README.md)。

## 集群级 Schema 一致性

在 0.11 之前，Schema 变更（例如创建 Stream、添加 Index Rule 或删除 Group）可能尚未应用到集群中的所有节点，元数据服务就已经返回成功。此时，如果查询命中尚未追上进度的节点，便可能看到过期或缺失的 Schema。

0.11 引入了客户端可观测的 Revision 跟踪和屏障 RPC，补上了这一缺口。具体字段和 RPC 请参阅下文的 [API 变更](#api-changes)；完整 RPC 契约请参阅 [Schema 一致性客户端接口与 SchemaBarrierService 参考](https://github.com/apache/skywalking-banyandb/blob/master/docs/interacting/schema-consistency/barriers.md)。

第二阶段将屏障扩展至整个集群：通过新增的 `NodeSchemaStatusService`，将相同调用扇出至每个 Liaison 和 Data 节点，并安全处理混合版本及成员变更场景。所有能力均为显式启用；取零值的请求会保留原有行为，因此不传入 Revision 的现有客户端不会受到影响。

## 编码智能体的自然语言查询

0.11 为编码智能体提供了两种相互独立的 BanyanDB 查询方式，无需手写 BydbQL。

第一种是 **Claude Code / Codex 插件**。它将 BanyanDB MCP Server 与 `bydbql` Skill 打包在一起，可针对 STREAM、MEASURE、TRACE 和 PROPERTY 资源将自然语言转换为 BydbQL。直接从仓库安装即可使用：Claude Code 运行 `/plugin install apache/skywalking-banyandb`，Codex 使用对应的 `codex plugin add` 流程。

安装后，Claude Code 或 Codex 会话会获得四个 MCP 工具：`list_groups_schemas` 用于发现 Schema；`get_generate_bydbql_prompt` 用于生成查询（这是唯一会注入实时索引字段列表，并强制执行 `ORDER BY` Index Rule 替换的工具）；`validate_bydbql` 通过预构建的 Go 二进制文件执行仅解析式的语法和安全校验；`list_resources_bydbql` 则用于执行已校验的只读语句。

第二种是 **`bydbctl agent`**。这是一个独立的双窗格终端界面，可直接驱动 Codex 或 Claude Code CLI 进程，以自然语言交互查询 BanyanDB。它会发现 Schema、生成类型明确的查询计划，并执行只读查询。

`bydbctl agent` 不持有 AI 提供商凭据，需要先为它调用的 CLI 单独完成认证。MCP 插件把查询能力加入已有的 Claude Code/Codex 会话；`bydbctl agent` 则提供专用的交互界面。

<figure>

<svg viewBox="0 0 640 260" width="100%" role="img" aria-label="BanyanDB 0.11 两种自然语言查询路径示意图：Claude Code 或 Codex 会话使用带 BydbQL Skill 的 MCP 插件，以及独立的 bydbctl agent 终端界面驱动 Codex 或 Claude Code CLI 进程；两条路径最终都查询 BanyanDB">
  <title>使用自然语言查询 BanyanDB 的两种方式</title>
  <desc>路径一：Claude Code 或 Codex 会话使用带 BydbQL Skill 的 MCP 插件直接查询 BanyanDB。路径二：独立的 bydbctl agent 终端界面驱动另一个 Codex 或 Claude Code CLI 进程查询 BanyanDB。两条路径相互独立，且均为只读。</desc>
  <rect x="20" y="30" width="220" height="56" rx="8" fill="none" stroke="#38bdf8"></rect>
  <text x="130.0" y="50.0" text-anchor="middle" font-size="13" fill="currentColor">Claude Code / Codex</text>
  <text x="130.0" y="66.0" text-anchor="middle" font-size="13" fill="currentColor">会话</text>
  <rect x="300" y="30" width="180" height="56" rx="8" fill="none" stroke="#38bdf8"></rect>
  <text x="390.0" y="50.0" text-anchor="middle" font-size="13" fill="currentColor">MCP 插件</text>
  <text x="390.0" y="66.0" text-anchor="middle" font-size="13" fill="currentColor">（BydbQL Skill）</text>
  <rect x="20" y="160" width="220" height="56" rx="8" fill="none" stroke="#a78bfa"></rect>
  <text x="130.0" y="180.0" text-anchor="middle" font-size="13" fill="currentColor">bydbctl agent</text>
  <text x="130.0" y="196.0" text-anchor="middle" font-size="13" fill="currentColor">（终端界面）</text>
  <rect x="300" y="160" width="180" height="56" rx="8" fill="none" stroke="#a78bfa"></rect>
  <text x="390.0" y="180.0" text-anchor="middle" font-size="13" fill="currentColor">Codex / Claude Code</text>
  <text x="390.0" y="196.0" text-anchor="middle" font-size="13" fill="currentColor">CLI 进程</text>
  <rect x="540" y="95" width="90" height="66" rx="8" fill="none" stroke="currentColor"></rect>
  <text x="585.0" y="128.0" text-anchor="middle" font-size="13" fill="currentColor">BanyanDB</text>
  <line x1="240.0" y1="58.0" x2="291.0" y2="58.0" stroke="#38bdf8" stroke-width="2"></line>
  <path d="M 300.0 58.0 L 293.1 62.0 L 293.1 54.0 Z" fill="#38bdf8"></path>
  <line x1="240.0" y1="188.0" x2="291.0" y2="188.0" stroke="#a78bfa" stroke-width="2"></line>
  <path d="M 300.0 188.0 L 293.1 192.0 L 293.1 184.0 Z" fill="#a78bfa"></path>
  <line x1="480.0" y1="58.0" x2="533.6" y2="111.6" stroke="#38bdf8" stroke-width="2"></line>
  <path d="M 540.0 118.0 L 532.3 115.9 L 537.9 110.3 Z" fill="#38bdf8"></path>
  <line x1="480.0" y1="188.0" x2="533.1" y2="143.8" stroke="#a78bfa" stroke-width="2"></line>
  <path d="M 540.0 138.0 L 537.2 145.5 L 532.1 139.4 Z" fill="#a78bfa"></path>
  <text x="320" y="245" text-anchor="middle" font-size="10" fill="#898781">来源：docs/operation/mcp/plugin.md、skills/bydbql/SKILL.md、docs/interacting/bydbctl/agent.md</text>
</svg>

<figcaption>两条相互独立、只读的 BanyanDB 自然语言查询路径。原创示意图。</figcaption>
</figure>

如需开始使用该终端界面，请参阅 [`bydbctl agent` 配置与使用文档](https://github.com/apache/skywalking-banyandb/blob/master/docs/interacting/bydbctl/agent.md)。

## 同期发布：Canopy、迁移工具及更多功能

0.11 同时加入四项能力：

- **Canopy** 是采用 Fastify BFF 的独立 React SPA，不依赖现有 `ui/`。它支持 Group/Stream/Measure/Trace/IndexRule 元数据的 CRUD、在分布式集群上完整支持 WHERE 子句的查询控制台、Property Collection CRUD，以及 TopN 聚合管理。它还拥有独立的 Docker 镜像、CI 和端到端测试套件。（这些细节来自 `canopy/` 相关提交及设计文档本身；CHANGES.md 对 Canopy 的介绍较为简略。）
- **迁移工具**新增 `copy`、`verify` 和 `analyze` 子命令。在早期版本 Trace/生命周期迁移能力的基础上，现在也支持 Measure 和 Stream 数据，包括索引模式的 Measure。
- **Schema 变更时可以修改 Tag 类型，而不会破坏旧 Part。** 如果 Tag 类型发生变化（例如从 int 变为 string），BanyanDB 现在会将每种类型变体分别持久化到各自的文件（`{tag_name}.{tag_type}.tf`）中，而不再覆盖原文件；查询和合并逻辑则通过（名称、类型）二元组完成解析。该机制适用于 Measure、Stream、Trace 和 SIDX Part。
- Trace Part 合并采用**公平的快/慢通道调度**，短合并不再排在耗时较长的合并之后；队列等待时间现通过 `total_merge_queue_latency` 暴露。

运行方法请参阅 [Canopy 配置与架构指南](https://github.com/apache/skywalking-banyandb/blob/master/canopy/README.md)。

## 性能改进

除上述默认启用向量化的查询引擎外，0.11 还包含多项有针对性的优化：

- Trace 和 Stream 的**点查更快**：通过延迟解码 Block 元数据，只需少量行的查询不再需要预先承担元数据解码开销。
- **Trace 采样器的解码路径得到优化**：延迟解码、字符串和 Tag 的零拷贝处理、提前拒绝 Tag、直接读取标量，以及缓存规则前缀，使 SkyWalking 和 Zipkin 采样器的采样决策成本与 Tag 规则成本大约减半。
- **GCS 备份上传更快**：每个对象及其校验和元数据现在通过一次请求写入，省去了每个对象一次的 `Update` 往返。
- **生命周期迁移的内存效率显著提高。** 通过流式 Dump Reader 和按大小分级的序列化缓冲池，不再将大型 Measure Part 整体读入内存；在相同工作负载下，行重放的堆内存峰值降低了约 80%：

<figure>

<svg viewBox="0 0 560 380" width="100%" role="img" aria-label="分组柱状图对比 0.11.0 优化前后的生命周期行重放堆内存峰值：优化前约 1500 MB，优化后约 296 MB，降低 80%">
  <title>生命周期行重放堆内存峰值：0.11.0 优化前后对比</title>
  <desc>通过流式 Dump Reader、按大小分级的序列化缓冲池，以及有界的在途批次（默认 32 MiB），大型 Measure Part 行重放时的堆内存峰值从约 1.5 GB 降至约 296 MB，降幅约 80%。来源：BanyanDB CHANGES.md，0.11.0。</desc>
  <text x="20" y="30" font-size="15" fill="currentColor">生命周期迁移：优化前 &#8594; 优化后的堆内存峰值</text>
  <text x="20" y="48" font-size="11" fill="#898781">相同工作负载下大型 Measure Part 的行重放</text>
  <rect x="190" y="80.0" width="100" height="220.0" rx="4" fill="#38bdf8"></rect>
  <text x="240.0" y="68.0" text-anchor="middle" font-size="15" fill="currentColor">~1.5 GB</text>
  <text x="240.0" y="322" text-anchor="middle" font-size="12" fill="#898781">优化前</text>
  <rect x="350" y="256.6" width="100" height="43.4" rx="4" fill="#22c55e"></rect>
  <text x="400.0" y="244.6" text-anchor="middle" font-size="15" fill="currentColor">~296 MB</text>
  <text x="400.0" y="322" text-anchor="middle" font-size="12" fill="#898781">优化后</text>
  <line x1="150" y1="300" x2="410" y2="300" stroke="#898781" stroke-width="1"></line>
  <text x="410" y="226.6" text-anchor="end" font-size="12" fill="#22c55e">&#8595; 堆内存峰值降低约 80%</text>
  <text x="280" y="372" text-anchor="middle" font-size="10" fill="#898781">来源：BanyanDB CHANGES.md，0.11.0（流式 Dump Reader + 缓冲池 + 32 MiB 有界批次）</text>
</svg>

<figcaption>来源：BanyanDB CHANGES.md，0.11.0——流式 Dump Reader、按大小分级的序列化缓冲池，以及默认 32 MiB 的在途批次字节数上限。</figcaption>
</figure>

<h2 id="api-changes">API 变更</h2>

API 版本也已升级至 0.11，这项变更会直接影响升级流程，详见下文的[破坏性变更](#breaking-changes-and-how-to-upgrade-safely)。本节先列出需要显式启用的增量 API：

- Group/IndexRule/IndexRuleBinding/TopNAggregation 的创建和更新响应新增 `mod_revision`；所有删除响应新增 `delete_time`；新增 `created_at`，且更新时会保留该字段。
- 新增 `STATUS_SCHEMA_NOT_APPLIED` 状态码，用于 Revision 超前于服务端缓存的写入与查询。
- 新增 `SchemaBarrierService` RPC：`AwaitRevisionApplied`、`AwaitSchemaApplied` 和 `AwaitSchemaDeleted`。客户端可以阻塞等待，直到 Schema 变更传播至整个集群后再继续。
- 新增 `QueryRequest.group_mod_revisions` / `QueryResponse.group_statuses`，用于按 Group 对查询路径进行 Revision 门控。
- **BydbQL 新增 `?` 位置参数绑定**：可以绑定值，而无需将其以字符串方式插入查询文本，从而像参数化 SQL 一样防止 QL 注入。可复用的 `Prepared` 绑定类型还在 gRPC 查询路径之上增加了预处理语句缓存，并提供有界缓存、Top-K 保留、缓存与慢查询可观测性；慢查询日志中还会对绑定参数脱敏。
- 新增校验：Measure 的 `ShardingKey` 现在必须包含所有 `Entity` Tag，以确保实体局部性。

<h2 id="breaking-changes-and-how-to-upgrade-safely">破坏性变更与安全升级方法</h2>

按照项目升级指南中的顺序，具体如下：

**1. API 版本 0.11。** 不支持同时包含 0.10 与 0.11 节点的集群。此次升级需要维护窗口：停止写入和所有 API 客户端，停止全部 0.10 节点，将所有节点升级至 0.11 并启动，再将 API 客户端升级为要求 0.11 版本；确认 Schema 初始化和数据写入正常后，方可恢复流量。回滚时同样必须先停止所有客户端和节点——无论升级还是回滚，都绝不能运行 0.10/0.11 混合版本集群。

**2. 向量化查询路径：先升级 Liaison，再升级 Data。** 启用向量化路径的分布式 Data 节点会在 Liaison↔Data 线路上发送原生列式 Frame，而不是 Protobuf。0.11 Liaison 可以解码两种格式——它根据每条消息 Frame 开头的魔数进行分派；但旧版 Liaison 完全不具备 Frame 解码器，因此无法反序列化响应。这改变了常规的滚动升级顺序：

| 升级顺序 | 结果 |
| --- | --- |
| 先 Liaison，后 Data | **安全。** 新版 Liaison 可以同时解码 Frame 和 Protobuf；旧版 Data 节点在升级前会继续发送 Protobuf。 |
| 先 Data，后 Liaison | 在整个发布过程中，**查询都会失败**。 |

单机部署不受影响，因为只有分布式 Data 节点会发送这种 Frame。如果无法控制节点升级顺序，请在启动新版 Data 节点时添加 `--stream-vectorized-enabled=false --trace-vectorized-enabled=false --measure-vectorized-enabled=false`，并在所有 Liaison 升级完成后再启用这些选项。回滚也使用相同的三个选项；由于它们只影响查询路径和线上格式，不影响磁盘格式，因此无需迁移数据。对于沿用此前版本“Data 节点优先”假设的自动化滚动升级流水线，这项变更最容易造成问题。

**3. etcd 已移除。** 现在仅支持基于 Property 的 Schema Registry。所有 `--etcd-*` 选项和 `--namespace` 均已移除，`--node-discovery-mode` 也不再接受 `etcd`（请使用 `dns`、`file` 或 `none`）。如果 `--schema-registry-mode` 或 `--node-discovery-mode` 仍然引用 etcd，则必须先迁移至基于 Property 的 Registry，之后才能运行 0.11。

**4. 队列与生命周期指标经过重新设计。** `queue_pub`/`queue_sub` 指标现统一采用带 `operation`/`group` 标签的模型（旧有 `topic` 标签和 Chunk 排序指标族已移除）；生命周期健康指标新增 `remote_node`/`remote_role`/`remote_tier`/`group` 标签，而 `banyandb_lifecycle_self_identity_resolution_total` 则被完全移除。请在升级前更新仪表盘和告警，而不是升级之后再处理。

完整的维护窗口检查清单请参阅[“升级至 0.11”完整指南](https://github.com/apache/skywalking-banyandb/blob/master/docs/operation/upgrade.md#upgrading-to-011)。

## 版本背后

<!-- [ORIGINAL DATA] -->
从 v0.10.3 到 v0.11.0，共有 14 位贡献者提交了非合并提交。这提醒我们，如此内容丰富的版本来自团队协作，而非一次单独的推进。

<figure>

<svg viewBox="0 0 560 380" width="100%" role="img" aria-label="BanyanDB 0.11.0 主要贡献者棒棒糖图，按提交数统计：Gao Hongtao 131 次、mrproliu 48 次、其他八位贡献者合计 18 次、Owen Willison 11 次、Huang Youliang 10 次、OmCheeLin 6 次、Tanay Paul 5 次">
  <title>BanyanDB 0.11.0 主要贡献者</title>
  <desc>提交数统计，v0.10.3 至 v0.11.0，非合并提交，共 14 位贡献者。Gao Hongtao 131 次、mrproliu 48 次、其他 8 位贡献者合计 18 次、Owen Willison 11 次、Huang Youliang 10 次、OmCheeLin 6 次、Tanay Paul 5 次。</desc>
  <text x="20" y="30" font-size="15" fill="currentColor">0.11.0 主要贡献者</text>
  <text x="20" y="48" font-size="11" fill="#898781">每位作者的提交数，v0.10.3&#8594;v0.11.0（共 14 位贡献者）</text>
  <text x="176" y="64" text-anchor="end" font-size="12" fill="currentColor">Gao Hongtao</text>
  <line x1="190" y1="60" x2="498.8" y2="60" stroke="#898781" stroke-width="2"></line>
  <circle cx="498.8" cy="60" r="7" fill="#38bdf8"><title>Gao Hongtao: 131 次提交</title></circle>
  <text x="512.8" y="64" font-size="12" fill="currentColor">131</text>
  <text x="176" y="104" text-anchor="end" font-size="12" fill="currentColor">mrproliu</text>
  <line x1="190" y1="100" x2="303.1" y2="100" stroke="#898781" stroke-width="2"></line>
  <circle cx="303.1" cy="100" r="7" fill="#38bdf8"><title>mrproliu: 48 次提交</title></circle>
  <text x="317.1" y="104" font-size="12" fill="currentColor">48</text>
  <text x="176" y="144" text-anchor="end" font-size="12" fill="currentColor">其他 8 位贡献者</text>
  <line x1="190" y1="140" x2="232.4" y2="140" stroke="#898781" stroke-width="2"></line>
  <circle cx="232.4" cy="140" r="7" fill="#38bdf8"><title>其他 8 位贡献者: 18 次提交</title></circle>
  <text x="246.4" y="144" font-size="12" fill="currentColor">18</text>
  <text x="176" y="184" text-anchor="end" font-size="12" fill="currentColor">Owen Willison</text>
  <line x1="190" y1="180" x2="215.9" y2="180" stroke="#898781" stroke-width="2"></line>
  <circle cx="215.9" cy="180" r="7" fill="#38bdf8"><title>Owen Willison: 11 次提交</title></circle>
  <text x="229.9" y="184" font-size="12" fill="currentColor">11</text>
  <text x="176" y="224" text-anchor="end" font-size="12" fill="currentColor">Huang Youliang</text>
  <line x1="190" y1="220" x2="213.6" y2="220" stroke="#898781" stroke-width="2"></line>
  <circle cx="213.6" cy="220" r="7" fill="#38bdf8"><title>Huang Youliang: 10 次提交</title></circle>
  <text x="227.6" y="224" font-size="12" fill="currentColor">10</text>
  <text x="176" y="264" text-anchor="end" font-size="12" fill="currentColor">OmCheeLin</text>
  <line x1="190" y1="260" x2="204.1" y2="260" stroke="#898781" stroke-width="2"></line>
  <circle cx="204.1" cy="260" r="7" fill="#38bdf8"><title>OmCheeLin: 6 次提交</title></circle>
  <text x="218.1" y="264" font-size="12" fill="currentColor">6</text>
  <text x="176" y="304" text-anchor="end" font-size="12" fill="currentColor">Tanay Paul</text>
  <line x1="190" y1="300" x2="201.8" y2="300" stroke="#898781" stroke-width="2"></line>
  <circle cx="201.8" cy="300" r="7" fill="#38bdf8"><title>Tanay Paul: 5 次提交</title></circle>
  <text x="215.8" y="304" font-size="12" fill="currentColor">5</text>
  <line x1="190" y1="46" x2="190" y2="314" stroke="#898781" stroke-width="1"></line>
  <text x="280" y="372" text-anchor="middle" font-size="10" fill="#898781">来源：BanyanDB Git 历史，v0.10.3…v0.11.0（229 次非合并提交，14 位作者）</text>
</svg>

<figcaption>来源：BanyanDB Git 历史，v0.10.3…v0.11.0（229 次非合并提交，14 位作者）。原创分析。</figcaption>
</figure>

## 后续计划

向量化引擎的发布说明也列出了尚未完成的工作：分布式 Map 模式的部分聚合和多 Group（多 Measure）请求仍然使用逐行路径。这些缺口预计要到后续版本才会补齐。随着 SDK 和开发工具包趋于稳定，链路采样流水线的插件生态也有望超越目前两个第一方采样器的规模。

## 常见问题

### 升级至 0.11 时，是否必须调整自动化升级顺序？

是的。如果运行分布式集群，且启用了任一向量化选项（默认即为启用），就必须先升级 Liaison 节点，再升级 Data 节点；这与此前所有版本的建议顺序相反。另一种做法是在新版 Data 节点上暂时禁用向量化选项，等所有 Liaison 升级后再启用。

### 可以继续使用 etcd 进行 Schema 发现吗？

不可以。在 0.11 中，`--schema-registry-mode` 仅接受 `property`，且所有 `--etcd-*` 选项均已移除。请在升级前迁移至基于 Property 的 Registry。

### 除性能外，向量化查询路径的正确性是否值得信赖？

Measure 路径经过了 6 小时的生产环境浸泡测试，其输出与逐行路径逐字节一致，且未发现任何差异；此外还通过了针对各类工作负载的基准门禁。如果确实遇到不一致，三个引擎（Measure、Stream、Trace）都保留了回滚选项（`--{measure,stream,trace}-vectorized-enabled=false`），可立即切回逐行路径，且无需迁移数据。

### BydbQL 现在支持参数化查询了吗？

是的。0.11 为 BydbQL 新增了 `?` 位置参数绑定，可以绑定值，而无需将其以字符串方式插入查询文本，从而防止 QL 注入。可复用的 `Prepared` 绑定类型还在 gRPC 查询路径中提供预处理语句缓存，并支持有界缓存、Top-K 保留、缓存与慢查询可观测性；慢查询日志中会对绑定参数脱敏。

### BydbQL MCP 插件与 `bydbctl agent` 有何区别？

MCP 插件会为正在运行的任意 Claude Code 或 Codex 会话添加四个 BanyanDB 查询工具（Schema 发现、生成、校验和执行）。安装一次后，即可与其他工作一起使用。`bydbctl agent` 则是独立的专用双窗格终端界面，专为交互式 BanyanDB 查询而设计。如果希望在现有智能体工作流中查询 BanyanDB，请使用插件；如果希望使用独立查询工具，请使用 `bydbctl agent`。

## 总结

BanyanDB 0.11.0 默认启用列式查询引擎，用可插拔流水线处理链路保留采样，并为编码智能体提供自然语言查询入口。升级分布式集群时，0.11 API 版本和 Liaison→Data 的节点顺序都会影响服务可用性。完整改动见[0.11.0 发布说明](https://github.com/apache/skywalking-banyandb/tree/master/CHANGES.md)，生产升级步骤见[“升级至 0.11”检查清单](https://github.com/apache/skywalking-banyandb/blob/master/docs/operation/upgrade.md#upgrading-to-011)。
