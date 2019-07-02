# 下载SkyWalking发布版本
从下面提供的链接从Apache SkyWalking镜像下载。

**只有源码包属于Apache官方发布包，其他Linux和Windows平台二进制发布包只是为了方便用户使用。**

## 下载6.x最新版本
| 日期 | 版本| | 下载 |
|:---:|:--:|:--:|:--:|
| July 2nd, 2019 | 6.2.0 | Source code| [[src]](https://www.apache.org/dyn/closer.cgi/skywalking/6.2.0/apache-skywalking-apm-6.2.0-src.tgz) [[asc]](https://www.apache.org/dist/skywalking/6.2.0/apache-skywalking-apm-6.2.0-src.tgz.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.2.0/apache-skywalking-apm-6.2.0-src.tgz.sha512)|
| | | Binary Distribution (Windows)| [[zip]](https://www.apache.org/dyn/closer.cgi/skywalking/6.2.0/apache-skywalking-apm-6.2.0.zip) [[asc]](https://www.apache.org/dist/skywalking/6.2.0/apache-skywalking-apm-6.2.0.zip.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.2.0/apache-skywalking-apm-6.2.0.zip.sha512)|
| | | Binary Distribution (Linux) | [[tar]](https://www.apache.org/dyn/closer.cgi/skywalking/6.2.0/apache-skywalking-apm-6.2.0.tar.gz) [[asc]](https://www.apache.org/dist/skywalking/6.2.0/apache-skywalking-apm-6.2.0.tar.gz.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.2.0/apache-skywalking-apm-6.2.0.tar.gz.sha512)|
| | | Documentation| [Documentation](https://github.com/apache/skywalking/blob/v6.2.0/docs/README.md) |
| Jan 29th, 2019 | 6.1.0 | Source code| [[src]](https://www.apache.org/dyn/closer.cgi/skywalking/6.1.0/apache-skywalking-apm-6.1.0-src.tgz ) [[asc]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0-src.tgz.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0-src.tgz.sha512)|
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
* ElasticSearch 存储实现改进。模型完全修改，升级版本需要删除之前所有的索引.
* CI和集成测试由Apache基础设施提供
* DataCarrier性能提升3-5倍.
* CI编译校验增加Windows平台.

#### Java Agent
* 支持采集SQL参数[可选]
* 支持 SolrJ 插件.
* 支持 RESTEasy 插件.
* 支持 Spring Gateway 2.1.x 插件
* TracingContext性能优化
* 支持 Apache ShardingSphere(incubating) 插件.
* application toolkit支持 `span#error`.
* 修复空堆栈造成探针OOM的问题
* 修复堆栈信息部正确的问题
* 修复SpringMVC插件上下文清除不完全的问题
* 修复CPU读取不正确的问题
* 修复 SpringMVC 插件不支持HTTP forward的问题.
* 修复 lettuce plugin async commend NPE.
* 修复 webflux plugin cast exception.
* [CI]支持 `import` check.

#### Backend
* 支持ElasticSearch 基于时间存储的实现.
* 支持后端动态配置。支持慢SQL阈值动态配置.
* 动态配置服务端实现支持DCS(gRPC based), Zookeeper, Apollo, Nacos.
* 拓扑图中支持 P99/95/90/75/50 图标.
* 新拓扑图查询协议
* 支持 Envoy ALS in Service Mesh .
* 支持 Nacos 集群管理
* 增强metrics exporter, 支持增量和全量导出
* 修复 module provider 重复加载问题
* 修改 TOP slow SQL 太长在ES中无法存储的问题
* 修复 H2TopologyQuery bug.
* 修复 H2 log query bug.（无功能影响）
* Mesh场景下，支持pod状态过滤
* 修复H2和MySQL告警查询bug
* 代码重构

#### UI
* 修复`ID is null`查询
* 页面重构，时间选择更友好
* 登录移除
* 修复Trace时间显示不正确
* 新增拓扑图中，线指标 P99/95/90/75/50
* 修改 P99/95/90/75/50 风格，提高可读性
* 修复trace页面刷新404问题

#### Document
* Go2Sky项目加入SkyAPM组织，链接更新
* 增加 ElasticSearch storage FAQ
* 增加 WebSphere 安装 FAQ.
* 新增开源用户
* 新增告警回调接口文档


[问题和Pull Request](https://github.com/apache/skywalking/milestone/33?closed=1)

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
