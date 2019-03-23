# 下载SkyWalking发布版本
从下面提供的链接从Apache SkyWalking（孵化）镜像下载。

**只有源码包属于Apache官方发布包，其他Linux和Windows平台二进制发布包只是为了方便用户使用。**

## 下载6.x最新版本
| 日期 | 版本| | 下载 |
|:---:|:--:|:--:|:--:|
| Jan 29th, 2019 | 6.0.0-GA | 源码| [[src]](https://www.apache.org/dyn/closer.cgi/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA-src.tgz) [[asc]](https://www.apache.org/dist/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA-src.tgz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA-src.tgz.sha512)|
| | | Windows| [[zip]](https://www.apache.org/dyn/closer.cgi/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA.zip) [[asc]](https://www.apache.org/dist/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA.zip.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA.zip.sha512)|
| | | Linux | [[tar]](https://www.apache.org/dyn/closer.cgi/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA.tar.gz) [[asc]](https://www.apache.org/dist/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA.tar.gz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA.tar.gz.sha512)|
| | | Document| [文档](https://github.com/apache/incubator-skywalking/blob/v6.0.0-GA/docs/README.md) |

## Docker 镜像
**Docker镜像不属于Apache官方发布包，在此提供仅为了方便用户使用。**

- Base, https://hub.docker.com/r/apache/skywalking-base
- SkyWalking OAP Server, https://hub.docker.com/r/apache/skywalking-oap-server
- SkyWalking UI, https://hub.docker.com/r/apache/skywalking-ui

### 6.0.0-GA更新日志

#### Java Agent
- 支持 gson 可选插件
- 支持 canal 插件.
- 修复 ojdbc component id 配置.
- 修复 dubbo 插件冲突问题 .
- 修复 OpenTracing tag 匹配问题.
- 修复 ignore 插件中一个校验逻辑失效.

#### Backend
- 调整 service inventory 存储实体, 增加 properties属性
- 调整 service instance inventory 存储实体, 增加 properties属性
- 调整service inventory 存储实体，增加NodeType属性
- 修复在ref中存在local和exit span的operation name，segment会整体丢失问题
- 修复日志中错误的索引名称
- 修复错误的告警信息
- 增加一个span数量限制的测试用例
- 增加一个服务端自监控模块，提供prometheus作为默认实现，并提供grafana UI配置
- 重构注册API
- 修复H2和MySQL存储，endpoint依赖图不完整。
- 优化实体注册和修改注册实现
- 加快buffer文件读取速度
- 修复和移除不必要的注册操作。

#### UI
- 增加新的Trace视图
- 对Tag value支持word-break

#### Document
- 新增两种启动模式文档
- 增加php探针项目链接
- 补充部分文档
- 更新年份到2019
- 更新用户墙
- 修正编译说明中的部分描述

[问题和Pull Requests](https://github.com/apache/incubator-skywalking/milestone/30?closed=1)

## 6.x 版本
| 日期 | 版本| | 下载 |
|:---:|:--:|:--:|:--:|
| Dec 25th, 2018 | 6.0.0-beta | 源码| [[src]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta-src.tgz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta-src.tgz.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta-src.tgz.sha512)|
| | | Windows| [[zip]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta.zip) [[asc]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta.zip.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta.zip.sha512)|
| | | Linux | [[tar]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta.tar.gz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta.tar.gz.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-beta/apache-skywalking-apm-incubating-6.0.0-beta.tar.gz.sha512)|
| | | 文档| [文档](https://github.com/apache/incubator-skywalking/blob/v6.0.0-beta/docs/README.md) |
| Nov. 14th, 2018 | 6.0.0-alpha | 源码| [[src]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha-src.tgz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha-src.tgz.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha-src.tgz.sha512)|
| | | Windows| [[zip]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha.zip) [[asc]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha.zip.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha.zip.sha512)|
| | | Linux | [[tar]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha.tar.gz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha.tar.gz.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/6.0.0-alpha/apache-skywalking-apm-incubating-6.0.0-alpha.tar.gz.sha512)|
| | | 文档| [文档](https://github.com/apache/incubator-skywalking/blob/v6.0.0-alpha/docs/README.md) |


## 5.x 版本
| 日期 | 版本| | 下载 |
|:---:|:--:|:--:|:--:|
| Oct. 17th, 2018 | 5.0.0-GA | 源码| [[src]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA-src.tgz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA-src.tgz.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA-src.tgz.sha512) |
| | | Windows| [[zip]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA.zip) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA.zip.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA.zip.sha512)|
| | | Linux | [[tar]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA.tar.gz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA.zip.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-GA/apache-skywalking-apm-incubating-5.0.0-GA.zip.sha512)|
| | | 文档 | [文档](https://github.com/apache/incubator-skywalking/blob/v5.0.0-GA/docs/README.md)|
| Sep. 12th, 2018 |5.0.0-RC2 | Source codes | [[src]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2-src.tgz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2-src.tgz.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2-src.tgz.sha512) |
| | | Windows| [[zip]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2.zip) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2.zip.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2.zip.sha512) |
| | | Linux | [[tar]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2.tar.gz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2.zip.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-RC2/apache-skywalking-apm-incubating-5.0.0-RC2.zip.sha512) |
| | | 文档 | [文档](https://github.com/apache/incubator-skywalking/blob/v5.0.0-RC2/docs/README.md) |
| July 11th, 2018 |5.0.0-beta2 | Source codes | [[src]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2-src.tgz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2-src.tgz.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2-src.tgz.sha512)|
| | | Windows | [[zip]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2.zip) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2.zip.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2.zip.sha512) |
| | | Linux | [[tar]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2.tar.gz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2.zip.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta2/apache-skywalking-apm-incubating-5.0.0-beta2.zip.sha512)|
| | | 文档 | [文档](https://github.com/apache/incubator-skywalking/blob/v5.0.0-beta2/docs/README.md) |
| May 23th, 2018 |5.0.0-beta | Source codes |[[src]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta-src.tgz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta-src.tgz.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta-src.tgz.sha512)|
| | | Windows | [[zip]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta.zip) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta.zip.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta.zip.sha512)|
| | | Linux | [[tar]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta.tar.gz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta.zip.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-beta/apache-skywalking-apm-incubating-5.0.0-beta.zip.sha512) |
| | | 文档 | [文档](https://github.com/apache/incubator-skywalking/blob/v5.0.0-beta/docs/README.md) |
| April 3rd, 2018 |5.0.0-alpha | Source codes |[[src]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha-src.tgz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha-src.tgz.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha-src.tgz.sha512)|
| | | Windows | [[zip]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.zip) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.zip.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.zip.sha512)|
| | | Linux | [[tar]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.tar.gz) [[asc]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.zip.asc) [[sha512]](https://archive.apache.org/dist/incubator/skywalking/5.0.0-alpha/apache-skywalking-apm-incubating-5.0.0-alpha.zip.sha512)|
| | | 文档 | [文档](https://github.com/apache/incubator-skywalking/blob/v5.0.0-alpha/docs/README.md) |

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
