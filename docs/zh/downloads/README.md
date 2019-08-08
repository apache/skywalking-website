# 下载SkyWalking发布版本
从下面提供的链接从Apache SkyWalking镜像下载。

**只有源码包属于Apache官方发布包，其他Linux和Windows平台二进制发布包只是为了方便用户使用。**

## 下载6.x最新版本
| 日期 | 版本| | 下载 |
|:---:|:--:|:--:|:--:|
| Aug. 8th, 2019 | 6.3.0 | Source code| [[src]](https://www.apache.org/dyn/closer.cgi/skywalking/6.3.0/apache-skywalking-apm-6.3.0-src.tgz) [[asc]](https://www.apache.org/dist/skywalking/6.3.0/apache-skywalking-apm-6.3.0-src.tgz.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.3.0/apache-skywalking-apm-6.3.0-src.tgz.sha512)|
| | | Binary Distribution (Windows)| [[zip]](https://www.apache.org/dyn/closer.cgi/skywalking/6.3.0/apache-skywalking-apm-6.3.0.zip) [[asc]](https://www.apache.org/dist/skywalking/6.3.0/apache-skywalking-apm-6.3.0.zip.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.3.0/apache-skywalking-apm-6.3.0.zip.sha512)|
| | | Binary Distribution (Linux) | [[tar]](https://www.apache.org/dyn/closer.cgi/skywalking/6.3.0/apache-skywalking-apm-6.3.0.tar.gz) [[asc]](https://www.apache.org/dist/skywalking/6.3.0/apache-skywalking-apm-6.3.0.tar.gz.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.3.0/apache-skywalking-apm-6.3.0.tar.gz.sha512)|
| | | Documentation| [Documentation](https://github.com/apache/skywalking/blob/v6.3.0/docs/README.md) |
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
