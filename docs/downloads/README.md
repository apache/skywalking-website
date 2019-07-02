# Download the SkyWalking releases

Use the links below to download the Apache SkyWalking from one of our mirrors.

**Only source code releases are official Apache releases: Windows and Linux binary distributions are just for end user convenience.**

## Download the last version
| Date | Version| | Downloads |
|:---:|:--:|:--:|:--:|
| July 2nd, 2019 | 6.2.0 | Source code| [[src]](https://www.apache.org/dyn/closer.cgi/skywalking/6.2.0/apache-skywalking-apm-6.2.0-src.tgz) [[asc]](https://www.apache.org/dist/skywalking/6.2.0/apache-skywalking-apm-6.2.0-src.tgz.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.2.0/apache-skywalking-apm-6.2.0-src.tgz.sha512)|
| | | Binary Distribution (Windows)| [[zip]](https://www.apache.org/dyn/closer.cgi/skywalking/6.2.0/apache-skywalking-apm-6.2.0.zip) [[asc]](https://www.apache.org/dist/skywalking/6.2.0/apache-skywalking-apm-6.2.0.zip.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.2.0/apache-skywalking-apm-6.2.0.zip.sha512)|
| | | Binary Distribution (Linux) | [[tar]](https://www.apache.org/dyn/closer.cgi/skywalking/6.2.0/apache-skywalking-apm-6.2.0.tar.gz) [[asc]](https://www.apache.org/dist/skywalking/6.2.0/apache-skywalking-apm-6.2.0.tar.gz.asc) [[sha512]](https://www.apache.org/dist/skywalking/6.2.0/apache-skywalking-apm-6.2.0.tar.gz.sha512)|
| | | Documentation| [Documentation](https://github.com/apache/skywalking/blob/v6.2.0/docs/README.md) |
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
* ElasticSearch implementation performance improved, and CHANGED totally. Must delete all existing indexes to do upgrade.
* CI and Integration tests provided by ASF INFRA.
* Plan to enhance tests including e2e, plugin tests in all pull requests, powered by ASF INFRA.
* DataCarrier queue write index controller performance improvement. 3-5 times quicker than before.
* Add windows compile support in CI.

#### Java Agent
* Support collect SQL parameter in MySQL plugin.[Optional]
* Support SolrJ plugin.
* Support RESTEasy plugin.
* Support Spring Gateway plugin for 2.1.x
* TracingContext performance improvement.
* Support Apache ShardingSphere(incubating) plugin.
* Support `span#error` in application toolkit.
* Fix OOM by empty stack of exception.
* FIx wrong cause exception of stack in span log.
* Fix unclear the running context in SpringMVC plugin.
* Fix CPU usage accessor calculation issue.
* Fix SpringMVC plugin span not stop bug when doing HTTP forward.
* Fix lettuce plugin async commend bug and NPE.
* Fix webflux plugin cast exception.
* [CI]Support `import` check.

#### Backend
* Support time series ElasticSearch storage.
* Provide dynamic configuration module and implementation. Slow SQL threshold supports dynamic config today.
* Dynamic Configuration module provide multiple implementations, DCS(gRPC based), Zookeeper, Apollo, Nacos.
* Provide P99/95/90/75/50 charts in topology edge.
* New topology query protocol and implementation.
* Support Envoy ALS in Service Mesh scenario.
* Support Nacos cluster management.
* Enhance metric exporter. Run in increment and total modes.
* Fix module provider is loaded repeatedly.
* Change TOP slow SQL storage in ES to Text from Keyword, as too long text issue.
* Fix H2TopologyQuery tiny bug.
* Fix H2 log query bug.(No feature provided yet)
* Filtering pods not in 'Running' phase in mesh scenario.
* Fix query alarm bug in MySQL and H2 storage.
* Codes refactor.

#### UI
* Fix some `ID is null` query(s).
* Page refactor, especially time-picker, more friendly.
* Login removed.
* Trace timestamp visualization issue fixed.
* Provide P99/95/90/75/50 charts in topology edge.
* Change all P99/95/90/75/50 charts style. More readable.
* Fix 404 in trace page.

#### Document
* Go2Sky project has been donated to SkyAPM, change document link.
* Add FAQ for ElasticSearch storage, and links from document.
* Add FAQ fro WebSphere installation.
* Add several open users.
* Add alarm webhook document.


All issues and pull requests are [here](https://github.com/apache/skywalking/milestone/33?closed=1)

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
