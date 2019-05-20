# Download the SkyWalking releases

Use the links below to download the Apache SkyWalking from one of our mirrors.

**Only source code releases are official Apache releases: Windows and Linux binary distributions are just for end user convenience.**

## Download the last version
| Date | Version| | Downloads |
|:---:|:--:|:--:|:--:|
| May 5th, 2019 | 6.1.0 | Source code| [[src]](https://www.apache.org/dyn/closer.cgi/skywalking/6.1.0/apache-skywalking-apm-6.1.0-src.tgz) [[asc]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0-src.tgz.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0-src.tgz.sha512)|
| | | Binary Distribution (Windows)| [[zip]](https://www.apache.org/dyn/closer.cgi/skywalking/6.1.0/apache-skywalking-apm-6.1.0.zip) [[asc]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0.zip.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0.zip.sha512)|
| | | Binary Distribution (Linux) | [[tar]](https://www.apache.org/dyn/closer.cgi/skywalking/6.1.0/apache-skywalking-apm-6.1.0.tar.gz) [[asc]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0.tar.gz.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.1.0/apache-skywalking-apm-6.1.0.tar.gz.sha512)|
| | | Documentation| [Documentation](https://github.com/apache/skywalking/blob/v6.1.0/docs/README.md) |

### Docker Images for convenience
**Docker images are not official ASF releases but provided for convenience. Recommended usage is always to build the source**

- Base, https://hub.docker.com/r/apache/skywalking-base
- SkyWalking OAP Server, https://hub.docker.com/r/apache/skywalking-oap-server
- SkyWalking UI, https://hub.docker.com/r/apache/skywalking-ui

### Changes in the last version
#### Project
**SkyWalking graduated as Apache Top Level Project**.
- Support compiling project agent, backend, UI separately.

#### Java Agent
- Support Vert.x Core 3.x plugin.
- Support Apache Dubbo plugin.
- Support `use_qualified_name_as_endpoint_name` and `use_qualified_name_as_operation_name` configs in SpringMVC plugin.
- Support span async close APIs in core. Used in Vert.x plugin.
- Support MySQL 5,8 plugins.
- Support set instance id manually(optional).
- Support customize enhance trace plugin in optional list.
- Support to set peer in Entry Span.
- Support Zookeeper plugin.
- Fix Webflux plugin created unexpected Entry Span.
- Fix Kafka plugin NPE in Kafka 1.1+
- Fix wrong operation name in postgre 8.x plugin.
- Fix RabbitMQ plugin NPE.
- Fix agent can't run in JVM 6/7, remove `module-info.class`.
- Fix agent can't work well, if there is whitespace in agent path.
- Fix Spring annotation bug and inheritance enhance issue.
- Fix CPU accessor bug.

#### Backend
**Performance improved, especially in CPU limited environment. 3x improvement in service mesh scenario(no trace) in 8C16G VM.
Significantly cost less CPU in low payload.**

- Support database metric and SLOW SQL detection.
- Support to set max size of metadata query. And change default to 5000 from 100.
- Support ElasticSearch template for new feature in the future.
- Support shutdown Zipkin trace analysis, because it doesn't fit production environment.
- Support log type, scope HTTP_ACCESS_LOG and query. No feature provided, prepare for future  versions.
- Support .NET clr receiver.
- Support Jaeger trace format, no analysis.
- Support group endpoint name by regax rules in mesh receiver.
- Support `diable` statement in OAL.
- Support basic auth in ElasticSearch connection.
- Support metric exporter module and gRPC implementor.
- Support `>, <, >=, <=` in OAL.
- Support role mode in backend.
- Support Envoy metric.
- Support query segment by service instance.
- Support to set host/port manually at cluster coordinator, rather than based on core settings.
- Make sure OAP shutdown when it faces startup error.
- Support set separated gRPC/Jetty ip:port for receiver, default still use core settings.
- Fix JVM receiver bug.
- Fix wrong dest service in mesh analysis.
- Fix search doesn't work as expected.
- Refactor `ScopeDeclaration` annotation.
- Refactor register lock mechanism.
- Add SmartSql component for .NET
- Add integration tests for ElasticSearch client.
- Add test cases for exporter.
- Add test cases for queue consume.

#### UI
- RocketBot UI has been accepted and bind in this release.
- Support CLR metric.

#### Document
- Documents updated, matching Top Level Project requirement.
- UI licenses updated, according to RocketBot UI IP clearance.
- User wall and powered-by list updated.
- CN documents removed, only consider to provide by volunteer out of Apache.


All issues and pull requests are [here](https://github.com/apache/skywalking/milestone/32?closed=1)

## Incubator release versions
Downloads for all versions when SkyWalking was an incubator project.

* [Archive incubating repository](https://archive.apache.org/dist/incubator/skywalking/).

You can also read the [changelogs](https://github.com/apache/incubator-skywalking/blob/master/CHANGES.md) for all versions.


<br/>

# Verify the releases
[PGP signatures KEYS](https://www.apache.org/dist/incubator/skywalking/KEYS)

It is essential that you verify the integrity of the downloaded files using the PGP or SHA signatures. The PGP signatures can be verified using GPG or PGP. Please download the KEYS as well as the asc signature files for relevant distribution. It is recommended to get these files from the main distribution directory and not from the mirrors.

```
gpg -i KEYS

or

pgpk -a KEYS

or

pgp -ka KEYS
```

To verify the binaries/sources you can download the relevant asc files for it from main distribution directory and follow the below guide.

```
gpg --verify apache-skywalking-apm-incubating********.asc apache-skywalking-apm-incubating*********

or

pgpv apache-skywalking-apm-incubating********.asc

or

pgp apache-skywalking-apm-incubating********.asc
```

<br/>
