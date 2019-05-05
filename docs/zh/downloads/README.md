# 下载SkyWalking发布版本
从下面提供的链接从Apache SkyWalking镜像下载。

**只有源码包属于Apache官方发布包，其他Linux和Windows平台二进制发布包只是为了方便用户使用。**

## 下载6.x最新版本
| 日期 | 版本| | 下载 |
|:---:|:--:|:--:|:--:|
| Jan 29th, 2019 | 6.1.0 | 源码| [[src]](https://www.apache.org/dyn/closer.cgi/skywalking/6.1.0/apache-skywalking-apm-6.1.0-src.tgz ) [[asc]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0-src.tgz.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0-src.tgz.sha512)|
| | | Binary Distribution (Windows)| [[zip]](https://www.apache.org/dyn/closer.cgi/skywalking/6.1.0/apache-skywalking-apm-6.1.0.zip) [[asc]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0.zip.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0.zip.sha512)|
| | | Binary Distribution (Linux) | [[tar]](https://www.apache.org/dyn/closer.cgi/skywalking/6.1.0/apache-skywalking-apm-6.1.0.tar.gz) [[asc]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0.tar.gz.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0.tar.gz.sha512)|
| | | Documentation| [Documentation](https://github.com/apache/skywalking/blob/v6.1.0/docs/README.md) |

## Docker 镜像
**Docker镜像不属于Apache官方发布包，在此提供仅为了方便用户使用。**

- Base, https://hub.docker.com/r/apache/skywalking-base
- SkyWalking OAP Server, https://hub.docker.com/r/apache/skywalking-oap-server
- SkyWalking UI, https://hub.docker.com/r/apache/skywalking-ui

### 6.1.0更新日志
#### Project
**SkyWalking 毕业成为Apache顶级项目**.
- 支持探针，后端和UI分开编译

#### Java Agent
- 支持 Vert.x Core 3.x 插件.
- 支持 Apache Dubbo 插件.
- 支持SpringMVC插件 `use_qualified_name_as_endpoint_name` 和 `use_qualified_name_as_operation_name` 配置.
- 支持span异步结束API。使用与Vert.x插件中。
- 支持 MySQL 5,8 插件.
- 支持手动设置实例ID。
- 支持Support customize enhance trace plugin in optional list.
- 支持对Entry Span设置peer.
- 支持 Zookeeper 插件.
- 修复 Webflux 创建不必要的 Entry Span.
- 修复 Kafka 插件在 Kafka 1.1+ 中空指针
- 修复postgre 8.x插件中错误的 operation name
- 修复 RabbitMQ 插件空指针
- 修复探针在JVM 6/7中无法启动, 删除 `module-info.class` 文件.
- 修复探针在路径有空格时，不能正常工作的问题
- 修复Spring插件标注bug.
- 修复 CPU 读取问题

#### Backend
**性能优化，尤其在CPU有限环境下。在8C16G VM中，service mesh场景下，性能提高3x。显著降低压力下的CPU消耗。**


- 支持数据库指标和慢SQL
- 支持元数据最大查询量设置，默认值修改为5000.
- 支持 ElasticSearch template
- 支持zipkin receiver以非分析模式工作。
- 支持 log 类型, scope HTTP_ACCESS_LOG. 无新功能提供。
- 支持 .NET clr receiver.
- 支持 Jaeger trace format, 无分析功能
- 在service mesh receiver中，根据正则对endpoint进行分组
- OAL中支持 `diable` 语句.
- ElasticSearch 连接支持简单认证模式.
- 支持metric导出模块和gRPC导出器
- OAL支持 `>, <, >=, <=` 操作符.
- 后端支持不同的运行模式
- 支持 Envoy metric.
- 根据根据服务实例查询trace
- 支持对集群管理器手动设置当前服务的host/port，而不是core中的配置
- 在启动出现异常时，确保OAP关闭
- 支持在receiver层面设置单独的 gRPC/Jetty ip:port
- 修复 JVM receiver bug.
- 修复service mesh中目标服务错误
- 修复搜索bug
- 重构 `ScopeDeclaration` annotation.
- 重构 register lock mechanism.
- 支持 .NET SmartSql 组件
- 支持 ElasticSearch client 集成测试.
- 支持 exporter测试.
- 支持queue consume测试.

#### UI
- RocketBot UI 已包含在发布版本中
- 支持 CLR 指标.

#### Document
- 文档更新
- UI licenses 更新
- User wall 和 powered-by list 更新.
- 中文文档已经移出

[问题和Pull Requests](https://github.com/apache/incubator-skywalking/milestone/32?closed=1)

## 孵化器历史版本
可以从Apache 孵化器归档库中找到历史版本

* [Archive 孵化器阶段发行版归档库](ttps://archive.apache.org/dist/incubator/skywalking/).

所有版本的[变更说明](https://github.com/apache/incubator-skywalking/blob/master/CHANGES.md).

# 验证版本
使用PGP或SHA签名验证下载文件的完整性至关重要。可以使用GPG或PGP验证PGP签名。请下载KEYS以及发布的asc签名文件。建议从主发布目录而不是镜像中获取这些文件。

```
gpg -i KEYS

or

pgpk -a KEYS

or

pgp -ka KEYS
```

要验证二进制文件/源，您可以从主发布目录下载相关的asc文件，并按照以下指南进行操作。

```
gpg --verify apache-skywalking-apm-incubating********.asc apache-skywalking-apm-incubating*********

or

pgpv apache-skywalking-apm-incubating********.asc

or

pgp apache-skywalking-apm-incubating********.asc
```
