# Download the SkyWalking releases

Use the links below to download the Apache SkyWalking from one of our mirrors.

**Only source code releases are official Apache releases, the Windows and Linux binary distributions are just for end users connivance.**

## Download the last version
| Date | Version| | Downloads |
|:---:|:--:|:--:|:--:|
| Jan 29th, 2019 | 6.0.0-GA | Source code| [[src]](https://www.apache.org/dyn/closer.cgi/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA-src.tgz) [[asc]](https://www.apache.org/dist/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA-src.tgz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA-src.tgz.sha512)|
| | | Binary Distribution (Windows)| [[zip]](https://www.apache.org/dyn/closer.cgi/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA.zip) [[asc]](https://www.apache.org/dist/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA.zip.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA.zip.sha512)|
| | | Binary Distribution (Linux) | [[tar]](https://www.apache.org/dyn/closer.cgi/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA.tar.gz) [[asc]](https://www.apache.org/dist/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA.tar.gz.asc) [[sha512]](https://www.apache.org/dist/incubator/skywalking/6.0.0-GA/apache-skywalking-apm-incubating-6.0.0-GA.tar.gz.sha512)|
| | | Documentation| [Documentation](https://github.com/apache/incubator-skywalking/blob/v6.0.0-GA/docs/README.md) |

### Docker Images for convenience
**Docker images are not official ASF releases but provided for convenience. Recommended usage is always to build the source**

- Base, https://hub.docker.com/r/apache/skywalking-base
- SkyWalking OAP Server, https://hub.docker.com/r/apache/skywalking-oap-server
- SkyWalking UI, https://hub.docker.com/r/apache/skywalking-ui

### Changes in the last version
#### Java Agent
- Support gson plugin(optional).
- Support canal plugin.
- Fix missing ojdbc component id.
- Fix dubbo plugin conflict.
- Fix OpenTracing tag match bug.
- Fix a missing check in ignore plugin.

#### Backend
- Adjust service inventory entity, to add properties.
- Adjust service instance inventory entity, to add properties.
- Add nodeType to service inventory entity.
- Fix when operation name of local and exit spans in ref, the segment lost.
- Fix the index names don't show right in logs.
- Fix wrong alarm text.
- Add test case for span limit mechanism.
- Add telemetry module and prometheus implementation, with grafana setting.
- A refactor for register API in storage module.
- Fix H2 and MySQL endpoint dependency map miss upstream side.
- Optimize the inventory register and refactor the implementation.
- Speed up the trace buffer read.
- Fix and removed unnecessary inventory register operations.

#### UI
- Add new trace view.
- Add word-break to tag value.

#### Documentation
- Add two startup modes document.
- Add PHP agent links.
- Add some cn document.
- Update year to 2019
- User wall updated.
- Fix a wrong description in `how-to-build` doc.

All issues and pull requests are [here](https://github.com/apache/incubator-skywalking/milestone/30?closed=1)

## Other versions
Downloads for all versions are hosted (and mirrored) in:

* [Apache's incubating release mirrors ](https://www.apache.org/dyn/closer.cgi/incubator/skywalking/).
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
