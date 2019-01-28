# 下载SkyWalking发布版本
从下面提供的链接从Apache SkyWalking（孵化）镜像下载。

**只有源码包属于Apache官方发布包，其他Linux和Windows平台二进制发布包只是为了方便用户使用。**

## 6.x 版本
| 日期 | 版本| | 下载 |
|:---:|:--:|:--:|:--:|
| Dec 25th, 2018 | 6.0.0-beta | 源码| [[src]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta-src.tgz) [[asc]](https://www.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta-src.tgz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta-src.tgz.sha512)|
| | | Windows| [[zip]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta.zip) [[asc]](https://www.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta.tar.gz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta.tar.gz.sha512)|
| | | Linux | [[tar]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta.tar.gz) [[asc]](https://www.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta.zip.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta.zip.sha512)|
| | | 文档| [文档](https://github.com/apache/incubator-skywalking/blob/v6.0.0-beta/docs/README.md) |
| Nov. 14th, 2018 | 6.0.0-alpha | 源码| [[src]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha-src.tgz) [[asc]](https://www.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha-src.tgz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha-src.tgz.sha512)|
| | | Windows| [[zip]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha.zip) [[asc]](https://www.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha.tar.gz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha.tar.gz.sha512)|
| | | Linux | [[tar]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha.tar.gz) [[asc]](https://www.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha.zip.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha.zip.sha512)|
| | | 文档| [文档](https://github.com/apache/incubator-skywalking/blob/v6.0.0-alpha/docs/README.md) |

### 6.0.0-beta更新日志

#### 协议
- 提供 Trace Data Protocol v2
- 提供 SkyWalking Cross Process Propagation Headers Protocol v2.

#### Java Agent
- 支持 Trace Data Protocol v2
- 支持 SkyWalking Cross Process Propagation Headers Protocol v2.
- 支持 SkyWalking Cross Process Propagation Headers Protocol v1 在兼容模式下运行. 需要显示声明打开.
- 支持 SpringMVC 5
- 支持 webflux
- 支持使用环境变量复写agent.config.
- 可以显示复写Span tag.
- 修复 Spring Controller Inherit 问题.
- 修复 ElasticSearch plugin 空指针.
- 修复 agent classloader 死锁问题.
- 修复 agent 日志拼写错误.
- 修复 resettemplete plugin 中错误的组件id.
- 修复错误使用 transform `ignore()`.
- 修复 H2 查询问题.

#### Backend
- 支持 Trace Data Protocol v2 并且 Trace Data Protocol v1 仍然继续有效.
- 支持 MySQL 作为存储.
- 支持 TiDB 作为存储.
- 支持使用环境变量复写application.yml.
- 支持 service instance 和 endpoint 告警.
- 支持 istio 的 namespace.
- 支持多种新的查询结果，包括service throughput(cpm), successful rate(sla), avg response time and p99/p95/p90/p75/p50 response time.
- 支持后端trace采样.
- 支持 Zipkin 格式.
- 支持 init 模式.
- 支持Zookeeper的namespace.
- 支持在集群管理中使用consul.
- OAL 生成工具被合并到主库，在 `compile` 阶段可以使用.
- 优化 trace 分页查询.
- 修复 trace 查询没有使用fuzzy query.
- 修复告警激活错误的问题.
- 去掉在数据库和缓存中非必要的条件.
- 修复在ES存储中错误的namespace问题.
- 修复 `Remote clients selector error: / by zero `.
- 修复 segment TTL 不生效的问题.

#### UI
- 支持多种新的图表，包括 service throughput(cpm), successful rate(sla), avg response time and p99/p95/p90/p75/p50 response time.
- 修复 TopN endpoint 链接错误的问题.
- 增强 trace stack 现实效果.
- 修复 CI.

#### 文档
- 增加更多的 agent 设置文档.
- 增加更多的贡献者文档.
- 更新用户墙.
- 增加 RocketBot UI 项目链接.

问题和Pull Requests 在 [这里](https://github.com/apache/incubator-skywalking/milestone/31?closed=1)

## 5.x 版本
| 日期 | 版本| | 下载 |
|:---:|:--:|:--:|:--:|
| Oct. 17th, 2018 | 5.0.0-GA | 源码| [[src]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA-src.tgz) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA-src.tgz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA-src.tgz.sha512) |
| | | Windows| [[zip]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA.zip) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA.tar.gz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA.tar.gz.sha512)|
| | | Linux | [[tar]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA.tar.gz) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA.zip.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA.zip.sha512)|
| | | 文档 | [文档](https://github.com/apache/incubator-skywalking/blob/v5.0.0-GA/docs/README.md)|
| Sep. 12th, 2018 |5.0.0-RC2 | Source codes | [[src]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2-src.tgz) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2-src.tgz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2-src.tgz.sha512) |
| | | Windows| [[zip]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2.zip) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2.tar.gz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2.tar.gz.sha512) |
| | | Linux | [[tar]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2.tar.gz) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2.zip.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2.zip.sha512) |
| | | 文档 | [文档](https://github.com/apache/incubator-skywalking/blob/v5.0.0-RC2/docs/README.md) |
| July 11th, 2018 |5.0.0-beta2 | Source codes | [[src]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2-src.tgz) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2-src.tgz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2-src.tgz.sha512)|
| | | Windows | [[zip]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2.zip) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2.tar.gz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2.tar.gz.sha512) |
| | | Linux | [[tar]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2.tar.gz) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2.zip.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2.zip.sha512)|
| | | 文档 | [文档](https://github.com/apache/incubator-skywalking/blob/v5.0.0-beta2/docs/README.md) |
| May 23th, 2018 |5.0.0-beta | Source codes |[[src]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta-src.tgz) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta-src.tgz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta-src.tgz.sha512)|
| | | Windows | [[zip]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta.zip) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta.tar.gz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta.tar.gz.sha512)|
| | | Linux | [[tar]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta.tar.gz) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta.zip.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta.zip.sha512) |
| | | 文档 | [文档](https://github.com/apache/incubator-skywalking/blob/v5.0.0-beta/docs/README.md) |
| April 3rd, 2018 |5.0.0-alpha | Source codes |[[src]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha-src.tgz) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha-src.tgz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha-src.tgz.sha512)|
| | | Windows | [[zip]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.zip) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.tar.gz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.tar.gz.sha512)|
| | | Linux | [[tar]](http://www.apache.org/dyn/closer.cgi/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.tar.gz) [[asc]](https://www.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.zip.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.zip.sha512)|
| | | 文档 | [文档](https://github.com/apache/incubator-skywalking/blob/v5.0.0-alpha/docs/README.md) |

# 5.x 更新日志

#### 探针改变
  - 在探针设置中添加对包名称的忽略。这些包中的类将被增强，甚至插件声明。
  - 支持Undertow 2.x插件。
  - 修复Motan插件的错误类名，而不是与功能相关的问题，只是命名修改。

#### Collector改变
  - 使缓冲文件处理程序更安全地关闭。
  - 在AlarmService中修复NPE。

#### 文档
  - Fix compiling doc link.
  - 更新新的演示地址。

[问题和Pull Requests](https://github.com/apache/incubator-skywalking/milestone/27?closed=1)

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

# 所有变更
[变更](https://github.com/apache/incubator-skywalking/blob/master/CHANGES.md)文档.
