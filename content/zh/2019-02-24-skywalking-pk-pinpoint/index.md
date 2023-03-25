---
title: APM巅峰对决：SkyWalking P.K. Pinpoint
date: 2019-02-24
author: 王振飞
description: 这应该是目前两款最优秀的开源APM软件：skywalking和Pinpoint，本文基于它们截止2019年2月最新的版本，进行最全方位的对比。看看到底谁能更胜一筹...
zh_tags:
  - Use Case
---

> 作者：王振飞, 写于：2019-02-24
> **说明**：此文是个人所写，版本归属作者，代表个人观点，仅供参考，不代表 skywalking 官方观点。
> **说明**：本次对比基于 skywalking-6.0.0-GA 和 Pinpoint-1.8.2（截止 2019-02-19 最新版本）。另外，我们这次技术选型直接否定了 Zipkin，其最大原因是它对代码有侵入性，CAT 也是一样。这是我们所完全无法接受的。

这应该是目前最优秀的两款开源 APM 产品了，而且两款产品都通过字节码注入的方式，实现了对代码**完全无任何侵入**，他们的对比信息如下：

![Pinpoint P.K. skywalking](0081Kckwly1gkl4kjo1okj30in0q3gnb.jpg)

**OAP 说明**: skywalking6.x 才有 OAP 这个概念，skywalking5.x 叫 collector。

接下来，对每个 PK 项进行深入分析和对比。更多精彩和首发内容请关注公众号：【**阿飞的博客**】。

**社区比较**

这一点上面 skywalking 肯定完胜。一方面，skywalking 已经进入 apache 孵化，社区相当活跃。而且项目发起人是中国人，我们能够进入官方群（Apache SkyWalking 交流群：`392443393`）和项目发起人吴晟零距离沟通，很多问题能第一时间得到大家的帮助（玩过开源的都知道，这个价值有多大）。
而 Pinpoint 是韩国人开发的，免不了有沟通障碍。至于 github 上最近一年的 commit 频率，skywalking 和 Pinpoint 旗鼓相当，都是接近 20 的水平:
![Insight commit](0081Kckwly1gkl4kone2qj30rs0eudgj.jpg)

**所以，社区方面，skywalking 更胜一筹。**

### **支持语言比较**

Pinpoint 只支持 Java 和 PHP，而 skywalking 支持 5 种语言：Java, C#, PHP, Node.js, Go。如果公司的服务涉及到多个开发语言，那么 skywalking 会是你更好的选择。并且，如果你要实现自己的探针（比如 python 语言），skywalking 的二次开发成本也比 Pinpoint 更低。

> 说明：Github 上有开发者为 Pinpoint 贡献了对 Node.js 的支持，请戳链接：https://github.com/peaksnail/pinpoint-node-agent。但是已经停止维护，几年没更新了！

**所以，支持语言方面，skywalking 更胜一筹**。

### **协议比较**

SkyWalking 支持 gRPC 和 http，不过建议使用 gRPC，skywalking6.x 版本已经不提供 http 方式（但是还会保留接收 5.x 的数据），以后会考虑删除。
而 Pinpoint 使用的是 thrift 协议。
协议本身没有谁好谁坏。

### **存储比较(重要)**

笔者认为，存储是 skywalking 和 Pinpoint 最大的差异所在，因为底层存储决定了上层功能。

Pinpoint 只支持 HBase，且扩展代价较大。这就意味着，如果选择 Pinpoint，还要有能力 hold 住一套 HBase 集群（daocloud 从 Pinpoint 切换到 skywalking 就是因为 HBase 的维护代价有点大）。在这方面，skywalking 支持的存储就多很多，这样的话，技术选型时可以根据团队技术特点选择合适的存储，而且还可以自行扩展（不过生产环境上应该大部分是以 es 存储为主）。

Pinpoint 只支持 HBase 的另一个缺陷就是，HBase 本身查询能力有限（HBase 只能支持三种方式查询：RowKey 精确查找，SCAN 范围查找，全表扫描）限制了 Pinpoint 的查询能力，所以其支持的查询一定是在时间的基础上（Pinpoint 通过鼠标圈定一个时间范围后查看这个范围内的 Trace 信息）。而 skywalking 可以多个维度任意组合查询，例如：时间范围，服务名，Trace 状态，请求路径，TraceId 等。

另外，Pinpoint 和 skywalking 都支持 TTL，即历史数据保留策略。skywalking 是在 OAP 模块的 application.yml 中配置从而指定保留时间。而 Pinpoint 是通过 HBase 的 ttl 功能实现，通过 Pinpoint 提供的 hbase 脚本`https://github.com/naver/pinpoint/blob/master/hbase/scripts/hbase-create.hbase`可以看到：ApplicationTraceIndex 配置了`TTL => 5184000`，SqlMetaData_Ver2 配合了`TTL => 15552000`，单位是秒。

> **说明**：es 并不是完全碾压 HBase，es 和 HBase 没有绝对的好和坏。es 强在检索能力，存储能力偏弱(千亿以下，es 还是完全有能力 hold 的住的)。HBase 强在存储能力，检索能力偏弱。如果搜集的日志量非常庞大，那么 es 存储就比较吃力。当然，没有蹩脚的中间件，只有蹩脚的程序员，无论是 es 还是 HBase，调优才是最关键的。同样的，如果对检索能力有一定的要求，那么 HBase 肯定满足不了你。所以，又到了根据你的业务和需求决定的时刻了，trade-off 真是无所不在。

![skywalking trace query](0081Kckwly1gkl4kqmtxej30nt0mb74w.jpg)

### **UI 比较**

Pinpoint 的 UI 确实比 skywalking 稍微好些，尤其是服务的拓扑图展示。不过 daocloud 根据 Pinpoint 的风格为 skywalking 定制了一款 UI。请戳链接：https://github.com/TinyAllen/rocketbot，项目介绍是：`rocketbot: A UI for Skywalking`。截图如下所示；
![rocketbot: A UI for Skywalking](0081Kckwly1gkl4kmm7q3j30yg0jmgmm.jpg)
**所以，只比较原生 UI 的话，Pinpoint 更胜一筹。**

### **扩展性比较**

Pinpoint 好像设计之初就没有过多考虑扩展性，无论是底层的存储，还是自定义探针实现等。而 skywalking 核心设计目标之一就是**Pluggable**，即可插拔。

以存储为例，pinpoint 完全没有考虑扩展性，而 skywalking 如果要自定义实现一套存储，只需要定义一个类实现接口`org.apache.skywalking.oap.server.library.module.ModuleProvider`，然后实现一些 DAO 即可。至于 Pinpoint 则完全没有考虑过扩展底层存储。

再以实现一个自己的探针为例（比如我要实现 python 语言的探针），Pinpoint 选择 thrift 作为数据传输协议标准，而且为了节省数据传输大小，在传递常量的时候也尽量使用数据参考字典，传递一个数字而不是直接传递字符串等等。这些优化也增加了系统的复杂度：包括使用 Thrift 接口的难度、UDP 数据传输的问题、以及数据常量字典的注册问题等等。Pinpoint 发展这么年才支持 Java 和 PHP，可见一斑。而 skywalking 的数据接口就标准很多，并且支持 OpenTracing 协议，除了官方支持 Java 以外，C#、PHP 和 Node.js 的支持都是由社区开发并维护。

还有后面会提到的告警，skywalking 的可扩展性也要远好于 Pinpoint。

最后，Pinpoint 和 skywalking 都支持插件开发，Pinpoint 插件开发参考：http://naver.github.io/pinpoint/1.8.2/plugindevguide.html。skywalking插件开发参考：https://github.com/apache/incubator-skywalking/blob/master/docs/en/guides/Java-Plugin-Development-Guide.md。

**所以，扩展性方面 skywalking 更胜一筹**。

### **告警比较**

Pinpoint 和 skywalking 都支持自定义告警规则。

但是恼人的是，Pinpoint 如果要配置告警规则，还需要安装 MySQL(配置告警时的用户，用户组信息以及告警规则都持久化保存在 MySQL 中)，这就导致 Pinpoint 的维护成本又高了一些，既要维护 HBase 又要维护 MySQL。

Pinpoint 支持的告警规则有：SLOW COUNT|RATE, ERROR COUNT|RATE, TOTAL COUNT, SLOW COUNT|RATE TO CALLEE, ERROR COUNT|RATE TO CALLEE, ERROR RATE TO CALLEE, HEAP USAGE RATE, JVM CPU USAGE RATE, DATASOURCE CONNECTION USAGE RATE。

Pinpoint 每 3 分钟周期性检查过去 5 分钟的数据，如果有符合规则的告警，就会发送 sms/email 给用户组下的所有用户。需要说明的是，实现发送 sms/email 的逻辑需要自己实现，Pinpoint 只提供了接口`com.navercorp.pinpoint.web.alarm.AlarmMessageSender`。并且 Pinpoint 发现告警持续时，会递增发送 sms/email 的时间间隔 3min -> 6min -> 12min -> 24min，防止 sms/email 狂刷。

> **Pinpoint 告警参考**：http://naver.github.io/pinpoint/1.8.2/alarm.html

skywalking 配置告警不需要引入任何其他存储。skywalking 在 config/alarm-settings.xml 中可以配置告警规则，告警规则支持自定义。

skywalking 支持的告警规则（配置项中的名称是 indicator-name）有：service_resp_time, service_sla, service_cpm, service_p99, service_p95, service_p90, service_p75, service_p50, service_instance_sla, service_instance_resp_time, service_instance_cpm, endpoint_cpm, endpoint_avg, endpoint_sla, endpoint_p99, endpoint_p95, endpoint_p90, endpoint_p75, endpoint_p50。

Skywalking 通过 HttpClient 的方式远程调用在配置项 webhooks 中定义的告警通知服务地址。skywalking 也支持 silence-period 配置，假设在 TN 这个时间点触发了告警，那么 TN -> TN+period 这段时间内不会再重复发送该告警。

> **skywalking 告警参考**：https://github.com/apache/incubator-skywalking/blob/master/docs/en/setup/backend/backend-alarm.md。目前只支持official_analysis.oal脚本中Service, Service Instance, Endpoint scope 的 metric，其他 scope 的 metric 需要等待后续扩展。

Pinpoint 和 skywalking 都支持常用的告警规则配置，但是 skywalking 采用 webhooks 的方式就灵活很多：短信通知，邮件通知，微信通知都是可以支持的。而 Pinpoint 只能 sms/email 通知，并且还需要引入 MySQL 存储，增加了整个系统复杂度。所以，**告警方面，skywalking 更胜一筹**。

### **JVM 监控**

skywalking 支持监控：Heap, Non-Heap, GC(YGC 和 FGC)。
Pinpoint 能够监控的指标主要有：Heap, Non-Heap, FGC, DirectBufferMemory, MappedBufferMemory，但是没有 YGC。另外，Pinpoint 还支持多个指标同一时间点查看的功能。如下图所示：

![Pinpoint JVM inspector](0081Kckwly1gkl4kp7botj30yg0i5jwg.jpg)
**所以，对 JVM 的监控方面，Pinpoint 更胜一筹。**

### **服务监控**

包括操作系统，和部署的服务实例的监控。
Pinpoint 支持的维度有：CPU 使用率，Open File Descriptor，数据源，活动线程数，RT，TPS。
skywalking 支持的维度有：CPU 使用率，SLA，RT，CPM（Call Per Minutes）。
所以，这方面两者旗鼓相当，没有明显的差距。

### **跟踪粒度比较**

Pinpoint 在这方面做的非常好，跟踪粒度非常细。如下图所示，是 Pinpoint 对某个接口的 trace 信息：
![Pinpoint trace detail](0081Kckwly1gkl4kppkcjj30yg0je7ck.jpg)

而同一个接口 skywalking 的 trace 信息如下图所示：
![skywalking trace detail](0081Kckwly1gkl4knyttmj30yg091dhi.jpg)

![skywalking trace sql](0081Kckwly1gkl4kq1n8vj30yg0bggna.jpg)

> **备注**: 此截图是 skywalking 加载了插件`apm-spring-annotation-plugin-6.0.0-GA.jar`（这个插件允许跟踪加了@Bean, @Service, @Component and @Repository 注解的 spring context 中的 bean 的方法）。

通过对比发现，**在跟踪粒度方面，Pinpoint 更胜一筹**。

### **过滤追踪**

Pinpoint 和 skywalking 都可以实现，而且配置的表达式都是基于 ant 风格。
Pinpoint 在 Web UI 上配置 `filter wizard` 即可自定义过滤追踪。
skywalking 通过加载 apm-trace-ignore-plugin 插件就能自定义过滤跟踪，skywalking 这种方式更灵活，比如一台高配服务器上有若干个服务，在共用的 agent 配置文件 apm-trace-ignore-plugin.config 中可以配置通用的过滤规则，然后通过-D 的方式为每个服务配置个性化过滤。

**所以，在过滤追踪方面，skywalking 更胜一筹**。

### **性能损耗**

由于 Pinpoint 采集信息太过详细，所以，它对性能的损耗最大。而 skywalking 默认策略比较保守，对性能损耗很小。
有网友做过压力测试，对比如下：

![压力测试](0081Kckwly1gkl4kk0bgjj30yg0ae45o.jpg)

> 图片来源于：https://juejin.im/post/5a7a9e0af265da4e914b46f1

**所以，在性能损耗方面，skywalking 更胜一筹**。

### **发布包比较**

skywalking 与时俱进，全系标配 jar 包，部署只需要执行 start.sh 脚本即可。而 Pinpoint 的 collector 和 web 还是 war 包，部署时依赖 web 容器（比如 Tomcat）。拜托，都 9012 年了。

**所以，在发布包方面，skywalking 更胜一筹**。

### **支持组件比较**

![支持组件对比](0081Kckwly1gkl4kkfvddj30ox0sx74l.jpg)

skywalking 和 Pinpoint 支持的中间件对比说明：

1. **WEB 容器说明**：Pinpoint 支持几乎所有的 WEB 容器，包括开源和商业的。而 wkywalking 只支持开源的 WEB 容器，对 2 款大名鼎鼎的商业 WEB 容器 Weblogic 和 Wevsphere 都不支持。
2. **RPC 框架说明**：对 RPC 框架的支持，skywalking 简直秒杀 Pinpoint。连小众的 motan 和 sofarpc 都支持。
3. **MQ 说明**：skywalking 比 Pinpoint 多支持一个国产的 MQ 中间件 RocketMQ，毕竟 RocketMQ 在国内名气大，而在国外就一般了。加之 skywalking 也是国产的。
4. **RDBMS/NoSQL 说明**：Pinpoint 对 RDBMS 和 NoSQL 的支持都要略好于 skywalking，RDBMS 方面，skywalking 不支持 MSSQL 和 MariaDB。而 NoSQL 方面，skywalking 不支持 Cassandra 和 HBase。至于 Pinpoint 不支持的 H2，完全不是问题，毕竟生产环境是肯定不会使用 H2 作为底层存储的。
5. **Redis 客户端说明**：虽然 skywalking 和 Pinpoint 都支持 Redis，但是 skywalking 支持三种流行的 Redis 客户端：Jedis，Redisson，Lettuce。而 Pinpoint 只支持 Jedis 和 Lettuce，再一次，韩国人开发的 Pinpoint 无视了目前中国人开发的 GitHub 上 star 最多的 Redis Client -- Redisson。
6. **日志框架说明**：Pinpoint 居然不支持 log4j2？但是已经有人开发了相关功能，详情请戳链接：[log4j plugin support log4j2 or not? https://github.com/naver/pinpoint/issues/3055](https://github.com/naver/pinpoint/issues/3055)

通过对 skywalking 和 Pinpoint 支持中间件的对比我们发现，skywalking 对国产软件的支持真的是全方位秒杀 Pinpoint，比如小众化的 RPC 框架：motan（微博出品），sofarpc，阿里的 RocketMQ，Redis 客户端 Redisson，以及分布式任务调度框架 elastic-job 等。当然也从另一方面反应国产开源软件在世界上的影响力还很小。

这方面没有谁好谁坏，毕竟每个公司使用的技术栈不一样。如果你对 RocketMQ 有强需求，那么 skywalking 是你的最佳选择。如果你对 es 有强需求，那么 skywalking 也是你的最佳选择。如果 HBase 是你的强需求，那么 Pinpoint 就是你的最佳选择。如果 MSSQL 是你的强需求，那么 Pinpoint 也是你的最佳选择。总之，这里完全取决你的项目了。

### **总结**

经过前面对 skywalking 和 Pinpoint 全方位对比后我们发现，对于两款非常优秀的 APM 软件，有一种既生瑜何生亮的感觉。Pinpoint 的优势在于：追踪数据粒度非常细、功能强大的用户界面，以及使用 HBase 作为存储带来的海量存储能力。而 skywalking 的优势在于：非常活跃的中文社区，支持多种语言的探针，对国产开源软件非常全面的支持，以及使用 es 作为底层存储带来的强大的检索能力，并且 skywalking 的扩展性以及定制化要更优于 Pinpoint：

- 如果你有海量的日志存储需求，推荐 Pinpoint。
- 如果你更看重二次开发的便捷性，推荐 skywalking。

最后，参考上面的对比，结合你的需求，哪些不能妥协，哪些可以舍弃，从而更好的选择一款最适合你的 APM 软件。

### **参考链接**

- 参考[1]. https://github.com/apache/incubator-skywalking/blob/master/docs/en/setup/service-agent/java-agent/Supported-list.md
- 参考[2]. http://naver.github.io/pinpoint/1.8.2/main.html#supported-modules
- 参考[3]. https://juejin.im/post/5a7a9e0af265da4e914b46f1

---

> 如果觉得本文不错，请关注作者公众号：【**阿飞的博客**】，多谢！
