---
title: "SkyWalking GraalVM Distro：设计与基准测试"
date: 2026-03-15
author: 吴晟
description: "从设计到测试，详解 SkyWalking GraalVM Distro 如何把一个成熟、运行时动态特性很多的 Java 可观测性后端做成原生二进制，并沉淀出可重复的迁移流程。"
tags:
- GraalVM
- Native Image
- Performance
- Cloud Native
- Serverless
- BanyanDB
---

![graph.jpg](./graph.jpg)

*这篇文章会完整介绍我们如何把 Apache SkyWalking OAP 迁移到 GraalVM Native Image。目标不是做一次性移植，而是把这件事做成一套能持续跟上上游演进的流程。*

如果你想看这项工作的更大背景，以及 AI Coding 如何让这个项目真正做得出来，请阅读：[AI Coding 如何重塑软件架构师的工作方式](/zh/2026-03-13-how-ai-changed-the-economics-of-architecture/)。

## 为什么 GraalVM 在这里是刚需

GraalVM Native Image 可以把 Java 应用做 Ahead-of-Time（AOT）编译，生成独立可执行文件。对于像 SkyWalking OAP 这样的可观测性后端来说，这不是“锦上添花”的性能优化，而是明确的工程刚需。

可观测性平台必须是基础设施中最可靠的部分。它必须在自己要观测的那些故障发生时依然存活。在云原生环境里，工作负载会不断扩缩容、迁移和重启，负责观测一切的后端本身不能还是那个启动慢、空闲占用大、恢复缓慢的重型进程。

我们的基准测试结果让这个结论变得非常具体：

- **启动时间：**约 5 ms 对比约 635 ms。在 Kubernetes 集群里，当 OAP Pod 被驱逐或重新调度时，635 ms 的差距意味着这段时间里的遥测数据可能会丢失。5 ms 的情况下，新 Pod 往往在大部分客户端还没感知到中断之前就已经重新开始接收数据了。
- **空闲内存：**约 41 MiB 对比约 1.2 GiB。可观测性后端是 24/7 常驻运行的。在多租户或边缘部署场景里，基础 RSS 降了 97%，可以放进更小的节点，而不再必须占用一台专用机器。
- **负载下内存：**在 20 RPS 下约 629 MiB 对比约 2.0 GiB。生产级负载下内存降了 70%，直接对应更少的节点、更低的云账单，以及在后端本身成为扩容瓶颈之前更多的余量。
- **没有预热惩罚：**峰值吞吐可以更早发挥出来。JVM 的 JIT 编译器往往需要数分钟流量才能完成热点优化，在这段时间里，尾延迟更差，数据处理也会滞后。原生二进制没有同样的阶段。
- **更小的攻击面：**不再需要完整 JDK 运行时，需要跟踪和修补的 CVE 也就少了很多。对于一个会接收整个集群所有服务数据的组件来说，这一点很重要。

这些都不是“小修小补”。它们直接改变了哪些部署形态开始变得可行：无服务器形态的可观测性后端、边车式采集模型、内存预算极其紧张的边缘节点。只有当后端足够轻、足够快时，这些方案才真正有落地空间。

## 挑战：一个成熟、动态特性很多的 Java 平台

SkyWalking OAP 身上有大型 Java 平台的所有典型问题：运行时字节码生成、重反射初始化、classpath 扫描、基于 SPI 的模块装配，以及动态 DSL 执行。这些机制方便扩展，但做 GraalVM native image 时全是障碍。

GraalVM 文档中列出的限制，只是问题的开始。在一个成熟的 OSS 平台里，这些限制会深深缠绕在多年积累下来的运行时设计决策中。常规的 GraalVM native image 很难处理运行时类生成、反射、动态发现和脚本执行，而这些在 SkyWalking OAP 中都不是零散存在的，它们本来就是系统设计的一部分。

在这个发行版的早期历史里，还有一座非常具体的大山。那时上游 SkyWalking 仍然高度依赖 Groovy 来处理 LAL、MAL 和 Hierarchy 脚本。理论上，它只是另一个“不支持运行时动态”的组件；但在实践里，Groovy 是整条路径上最大的障碍。它不仅仅是脚本执行问题，而是代表着一整套在 JVM 世界里极其便利、在 native image 世界里极其不友好的动态模型。

## 设计目标：让迁移这件事可以重复做

设计目标不是”把 native-image 跑通一次就完”，而是做出一套能反复用、能长期维护的迁移系统：

1. **把运行时生成的产物前移到构建期。** OAL、MAL、LAL、Hierarchy 规则，以及 meter 相关的生成类，都在构建期完成编译并打包，而不是等到启动时才动态生成。
2. **用确定性的加载机制替代动态发现。** classpath 扫描和运行时注册路径被转换为基于 manifest 的加载方式。
3. **减少运行时反射，并在构建期生成 native 元数据。** 反射配置不再依赖人工维护的猜测清单，而是根据真实 manifest 和扫描结果生成。
4. **让上游同步边界保持清晰。** same-FQCN replacements 会被显式打包、列清单，并通过陈旧性检查守住边界。
5. **让变化第一时间暴露出来。** 一旦上游 provider、规则文件或被替换的源文件发生变化，测试就会失败，迫使我们做显式审查。

这才是最关键的架构转变。好的抽象和前瞻性，在 AI 时代并没有变得不重要，反而变得更重要了，因为它们决定了 AI 带来的速度，最终产出的是一个可维护的系统，还是一堆膨胀得更快的代码。

## 把运行时动态行为变成构建期产物

SkyWalking OAP 里有多个在 JVM 世界里很自然、但在 native image 里很棘手的动态子系统：

- OAL 会在运行时生成类。
- LAL、MAL 和 Hierarchy 在历史上与大量基于 Groovy 的运行时行为绑定在一起，这也是早期 distro 工作中最难处理的阻碍之一。
- MAL、LAL 和 Hierarchy 规则依赖运行时编译行为。
- 基于 Guava 的 classpath 扫描会发现注解、dispatcher、decorator 和 meter function。
- 基于 SPI 的模块和 provider 发现依赖更动态的运行时环境。
- YAML/config 初始化和框架集成依赖反射访问。

在 SkyWalking GraalVM Distro 里，这些问题不是靠零散补丁一个个修掉的，而是被统一收敛到一条构建期流水线里。

预编译器会在构建过程中运行 DSL 引擎、导出生成类、写入 manifest、序列化配置数据，并生成 native-image 元数据。这样一来，启动时只需要做类加载和注册，不再需要运行时代码生成。运行期之所以能变得更简单，是因为原本的复杂性被前移到了构建期。

这也是为什么这个项目不只是一次性能优化。我们的设计目标，是把复杂性前移到一个更容易验证、更容易自动化、也更便于反复执行的位置。

## same-FQCN 替换：一条可控的边界

这个发行版里最实用的设计选择之一，就是使用 same-FQCN 替换类。我们没有依赖模糊的启动技巧，也没有依赖未文档化的加载顺序假设。相反，我们会重新打包 GraalVM 特定 jar，排除原本的上游类，再让替换类占据完全相同的 fully-qualified class name。

这对可维护性非常关键，因为它建立了一条非常清晰的边界：

- 上游类仍然定义行为契约；
- GraalVM 侧的替换类提供兼容的实现策略；
- 打包过程则让这次替换变得显式可见。

例如，OAL 的加载过程从运行时编译变成了基于 manifest 的预编译类加载。类似的替换也处理了 MAL 和 LAL DSL 加载、模块装配、配置初始化，以及多个对反射敏感的路径。目标不是把一切都 fork 出去，而是只替换那些运行时模型从根本上不适合 native image 的部分。

随后，这条边界还会通过测试来守护：测试会对照与 replacement 对应的上游源文件做哈希。当上游改动了这些文件中的任何一个，构建就会失败，并明确告诉我们哪个 replacement 需要重新审查。这样一来，“如何跟上上游”就不再是一个充满焦虑的抽象问题，而变成一项明确、可落地的工程工作。

## 反射配置不是猜出来的，而是生成出来的

在很多 GraalVM 迁移项目里，`reflect-config.json` 最终会变成一个靠经验不断累积的工件。它会越来越大，越来越陈旧，最后没有人真正清楚它是不是完整，也不清楚每一项配置为什么存在。这种模式在一个持续演化的大型 OSS 平台里是无法扩展的。

在这个发行版里，反射元数据直接从构建产物和扫描结果中生成，包括：

- OAL、MAL、LAL、Hierarchy 以及 meter 生成类的 manifest；
- 注解扫描得到的类；
- Armeria HTTP handler；
- GraphQL resolver 和 schema 映射类型；
- 被接受的 `ModuleConfig` 类。

这是一种健康得多的模式。我们不再依赖人去记住所有可能触发反射访问的路径，而是让系统根据真实迁移流水线推导出反射元数据。构建过程本身，成为了事实来源。

## 让上游同步变得现实可行

如果这个发行版只是一次性的工程冲刺，那它的意义会小很多。真正困难的事情，是在上游 SkyWalking 继续演进的同时，让它还能持续维护下去。

这也是为什么仓库里会有一整套显式的清单和漂移检测机制：

- provider 清单，用来强制新上游 provider 被分类；
- 规则文件清单，用来强制新 DSL 输入被显式确认；
- 预编译 YAML 输入的 SHA watcher；
- 带 GraalVM 特定 replacement 的上游源文件 SHA watcher。

好的抽象不仅仅是代码结构优雅，更在于你是否选择了一种能在未来变化面前继续成立的迁移设计。

## 基准测试结果

我们在一台 Apple M3 Max（macOS、Docker Desktop、10 CPUs / 62.7 GB）上，对标准 JVM OAP 和 GraalVM Distro 做了对比测试，两者都连接到 BanyanDB。

### 启动测试（Docker Compose，无流量，3 次取中位数）

| 指标 | JVM OAP | GraalVM OAP | 差异 |
|------|---------|-------------|------|
| 冷启动时间 | 635 ms | 5 ms | 约快 127 倍 |
| 热启动时间 | 630 ms | 5 ms | 约快 126 倍 |
| 空闲 RSS | 约 1.2 GiB | 约 41 MiB | 约降低 97% |

启动时间的测量方式，是从 OAP 第一条应用日志时间戳开始，到出现 `listening on 11800` 日志（即 gRPC 服务 ready）为止。

### 持续负载下（Kind + Istio 1.25.2 + Bookinfo，约 20 RPS，2 个 OAP 副本）

在 60 秒预热之后，每 10 秒采样一次，共 30 个样本。

| 指标 | JVM OAP | GraalVM OAP | 差异 |
|------|---------|-------------|------|
| CPU 中位数（millicores） | 101 | 68 | -33% |
| CPU 平均值（millicores） | 107 | 67 | -37% |
| 内存中位数（MiB） | 2068 | 629 | **-70%** |
| 内存平均值（MiB） | 2082 | 624 | **-70%** |

两个版本报告的 entry-service CPM 一致，说明在这个测试负载下，两者的流量处理能力相同。

我们每 30 秒通过 swctl 对所有已发现服务收集这些指标：
`service_cpm`、`service_resp_time`、`service_sla`、`service_apdex`、`service_percentile`。

完整的基准测试脚本和原始数据位于发行版仓库中的 [benchmark/](https://github.com/apache/skywalking-graalvm-distro/tree/main/benchmark) 目录。

## 当前状态

这个项目已经是一个可运行的实验性发行版，托管在独立仓库中：[apache/skywalking-graalvm-distro](https://github.com/apache/skywalking-graalvm-distro)。

当前发行版有意聚焦在一种现代、高性能的运行模式上：

- **存储：** BanyanDB
- **集群模式：** Standalone 和 Kubernetes
- **配置方式：** 无配置或 Kubernetes ConfigMap
- **运行模型：** 固定模块集合、预编译产物和 AOT 友好的装配方式

这种聚焦是刻意的。要把迁移做成一套可重复的系统，第一步必须先把边界收清楚，做出一个真正能跑起来的版本，然后再在不失控的前提下逐步扩展。

## 快速开始

由于 SkyWalking GraalVM Distro 的设计目标就是追求极致性能，它目前最适合与 **BanyanDB** 存储后端搭配使用。当前发布的镜像已经可以在 Docker Hub 获取，你可以直接用下面这个 `docker-compose.yml` 启动整套系统。

```yaml
version: '3.8'

services:
  banyandb:
    image: ghcr.io/apache/skywalking-banyandb:e1ba421bd624727760c7a69c84c6fe55878fb526
    container_name: banyandb
    restart: always
    ports:
      - "17912:17912"
      - "17913:17913"
    command: standalone --stream-root-path /tmp/stream-data --measure-root-path /tmp/measure-data --measure-metadata-cache-wait-duration 1m --stream-metadata-cache-wait-duration 1m
    healthcheck:
      test: ["CMD", "sh", "-c", "nc -nz 127.0.0.1 17912"]
      interval: 5s
      timeout: 10s
      retries: 120

  oap:
    image: apache/skywalking-graalvm-distro:0.1.1
    container_name: oap
    depends_on:
      banyandb:
        condition: service_healthy
    restart: always
    ports:
      - "11800:11800"
      - "12800:12800"
    environment:
      SW_STORAGE: banyandb
      SW_STORAGE_BANYANDB_TARGETS: banyandb:17912
      SW_HEALTH_CHECKER: default
    healthcheck:
      test: ["CMD-SHELL", "nc -nz 127.0.0.1 11800 || exit 1"]
      interval: 5s
      timeout: 10s
      retries: 120

  ui:
    image: ghcr.io/apache/skywalking/ui:10.3.0
    container_name: ui
    depends_on:
      oap:
        condition: service_healthy
    restart: always
    ports:
      - "8080:8080"
    environment:
      SW_OAP_ADDRESS: http://oap:12800
```

只需要执行：

```bash
docker compose up -d
```

欢迎社区来测试这个新发行版、提交 issue，并帮助我们推动它走向生产可用。

*特别感谢 GraalVM 团队提供的技术基础。*
