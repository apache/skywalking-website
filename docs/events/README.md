# SkyWalking Events

## Release Apache SkyWalking Python 0.4.0
###### Nov. 18th, 2020
SkyWalking Python 0.4.0 is released. Go to [downloads](/downloads/) page to find release tars.
- Feature: Support Kafka reporter protocol (#74)
- BugFix: Move generated packages into skywalking namespace to avoid conflicts (#72)
- BugFix: Agent cannot reconnect after server is down (#79)
- Test: Mitigate unsafe yaml loading (#76)

## Release Apache SkyWalking Client JS 0.2.0
###### Nov. 17th, 2020
SkyWalking Client JS 0.2.0 is released. Go to [downloads](/downloads/) page to find release tars.
- Bug Fixes
  - Fixed a bug in `sslTime` calculate.
  - Fixed a bug in server response status judgment.

## Release Apache SkyWalking Cloud on Kubernetes 0.1.0
###### Nov. 16th, 2020
SkyWalking Cloud on Kubernetes 0.1.0 is released. Go to [downloads](/downloads) page to find release tars.
- Add OAPServer CRDs and controller.

## Welcome Jiapeng Liu as new committer
###### Nov. 5th, 2020
Based on his continuous contributions, Jiapeng Liu (a.k.a [evanljp](https://github.com/evanljp)) has been voted as a new committer.

## Release Apache SkyWalking Kubernetes Helm Chart 4.0.0
###### Nov. 3rd, 2020
SkyWalking Kubernetes Helm Chart 4.0.0 is released. Go to [downloads](/downloads) page to find release tars.
- Allow overriding configurations files under /skywalking/config.
- Unify the usages of different SkyWalking versions.
- Add Values for init container in case of using private regestry.
- Add services, endpoints resources in ClusterRole.

## Release Apache SkyWalking Client JS 0.1.0
###### Oct. 30th, 2020
SkyWalking Client JS 0.1.0 is released. Go to [downloads](/downloads) page to find release tars.
- Support Browser Side Monitoring. Require SkyWalking APM 8.2+.

## Release Apache SkyWalking APM 8.2.0
###### Oct. 27th, 2020
SkyWalking 8.2.0 is released. Go to [downloads](/downloads) page to find release tars.
- Support Browser Side Monitoring
- Query Traces by Tags
- Introduce Meter Analysis Language
- Allow Configuring Composite Alert Rules

## Release Apache SkyWalking LUA Nginx 0.3.0
###### Oct. 24th, 2020
SkyWalking LUA Nginx 0.3.0 is released. Go to [downloads](/downloads) page to find release tars.
- Load the `base64` module in `utils`, different ENV use different library.
- Add prefix `skywalking`, avoid conflicts with other lua libraries.
- Chore: only expose the method of setting random seed, it is optional.
- Coc: use correct code block type.
- CI: add `upstream_status` to tag `http.status`
- Add `http.status`

## Release Apache SkyWalking CLI 0.4.0
###### Oct 11th, 2020
SkyWalking CLI 0.4.0 is released. Go to [downloads](/downloads) page to find release tars.
- Features
  - Add dashboard global command with auto-refresh
  - Add dashboard global-metrics command
  - Add traces search
  - Refactor metrics thermodynamic command to adopt the new query protocol

- Bug Fixes
  - Fix wrong golang standard time

## Welcome Huaxi Jiang as new committer
###### Sep. 28th, 2020
Based on his continuous contributions, Huaxi Jiang (a.k.a [fgksgf](https://github.com/fgksgf)) has been voted as a new committer.

## Release Apache SkyWalking Python 0.3.0
###### Aug 28th, 2020
SkyWalking Python 0.3.0 is released. Go to [downloads](/downloads) page to find release tars.
- New plugins
    - Urllib3 Plugin (#69)
    - Elasticsearch  Plugin (#64)
    - PyMongo Plugin (#60)
    - Rabbitmq Plugin (#53)
    - Make plugin compatible with Django (#52)
    
- API
    - Add process propagation (#67)
    - Add tags to decorators (#65)
    - Add Check version of packages when install plugins (#63)
    - Add thread propagation (#62)
    - Add trace ignore (#59)
    - Support snapshot context (#56)
    - Support correlation context (#55)
    
- Chores and tests
    - Test: run multiple versions of supported libraries (#66)
    - Chore: add pull request template for plugin (#61)
    - Chore: add dev doc and reorganize the structure (#58)
    - Test: update test health check (#57)
    - Chore: add make goal to package release tar ball (#54)

## Release Apache SkyWalking Chart 3.1.0 for SkyWalking 8.1.0
###### Aug. 13th, 2020
SkyWalking Chart 3.1.0 is released. Go to [downloads](/downloads) page to find release tars.
- Support SkyWalking 8.1.0
- Support enable oap dynamic configuration through k8s configmap

## Welcome Wei Hua as new committer
###### Aug. 1st, 2020
Based on his continuous contributions, Wei Hua (a.k.a [alonelaval](https://github.com/alonelaval)) has been voted as a new committer.

## Release Apache SkyWalking APM 8.1.0
###### Aug. 3rd, 2020
SkyWalking APM 8.1.0 is release. Go to [downloads](/downloads) page to find release tars.
- Support Kafka as an optional trace, JVM metrics, profiling snapshots and meter system data transport layer.
- Support Meter system, including the native metrics APIs and the Spring Sleuth adoption.
- Support JVM thread metrics.  

## Release Apache SkyWalking Python 0.2.0
###### July 28th, 2020
SkyWalking Python 0.2.0 is released. Go to [downloads](/downloads) page to find release tars.
- Plugins:
    - Kafka Plugin (#50)
    - Tornado Plugin (#48)
    - Redis Plugin (#44)
    - Django Plugin (#37)
    - PyMsql Plugin (#35)
    - Flask plugin (#31)

- API
    - Add `ignore_suffix` Config (#40)
    - Add missing `log` method and simplify test codes (#34)
    - Add content equality of SegmentRef (#30)
    - Validate carrier before using it (#29)

- Chores and tests
    - Test: print the diff list when validation failed (#46)
    - Created venv builders for linux/windows and req flashers + use documentation (#38)

## Release Apache SkyWalking CLI 0.3.0
###### July 27th, 2020
SkyWalking CLI 0.3.0 is released. Go to [downloads](/downloads) page to find release tars.
- Command: health check command
- Command: Add trace command
- BugFix: Fix wrong metrics graphql path

## Release Apache SkyWalking Python 0.1.0
###### Jun. 28th, 2020
SkyWalking Python 0.1.0 is released. Go to [downloads](/downloads) page to find release tars.
- API: agent core APIs, check [the APIs and the examples](https://github.com/apache/skywalking-python/blob/3892cab9d5d2c03107cfb2b1c59a6c77c5c3cc35/README.md#api)
- Plugin: built-in libraries `http`, `urllib.request` and third-party library `requests` are supported.
- Test: agent test framework is setup, and the corresponding tests of aforementioned plugins are also added.

## Release Apache SkyWalking Chart 3.0.0 for SkyWalking 8.0.1
###### Jun. 27th, 2020
SkyWalking Chart 3.0.0 is released. Go to [downloads](/downloads) page to find release tars.
- Support SkyWalking 8.0.1

## Relase Apache SkyWalking Nginx LUA 0.2.0
###### June 21th, 2020
SkyWalking Nginx LUA 0.2.0 is release. Go to [downloads](/downloads) page to find release tars.
- Adapt the new v3 protocol.
- Implement correlation protocol.
- Support batch segment report.

## Release Apache SkyWalking APM 8.0.0
###### June 15th, 2020
SkyWalking APM 8.0.0 is release. Go to [downloads](/downloads) page to find release tars.
- v3 protocol is added and implemented
- New Dashboard UI and new Query Protocol are provided
- Prometheus fetcher is supported. Once you have Prometheus SDK instrumented app, the metrics could be read by SkyWalking.
- Register mechanism has been removed due to buckets effect on performance and memory cost.

## Welcome Wei Zhang to join the PMC
###### Apr. 20th, 2020
Based on his continuous contributions, Wei Zhang (a.k.a [arugal](https://github.com/arugal)) has been invited to join the PMC. Welcome aboard.

## Release Apache SkyWalking Chart 2.0.0 for SkyWalking 7.0.0
###### Mar. 31th, 2020
SkyWalking Chart 2.0.0 is released. Go to [downloads](/downloads) page to find release tars.
- Support SkyWalking 7.0.0
- Support set ES user/password
- Add CI for release

## Release Apache SkyWalking APM 7.0.0
SkyWalking APM 7.0.0 is release. Go to [downloads](/downloads) page to find release tars.
- Upgrade JDK minimal JDK requirement to JDK8
- Support profiling code level performance 
- Don't support SkyWalking v5 agent in-wire and out-wire protocol. V6 is required.

## Release Apache SkyWalking CLI 0.2.0
###### Mar. 20th, 2020
SkyWalking CLI 0.2.0 is released. Go to [downloads](/downloads) page to find release tars.
- Support visualization of heat map
- Support top N entities, `swctl metrics top 5 --name service_sla`
- Support thermodynamic metrics, `swctl metrics thermodynamic --name all_heatmap`
- Support multiple linear metrics, `swctl --display=graph --debug metrics multiple-linear --name all_percentile`

## Release Apache SkyWalking Chart 1.1.0 for SkyWalking 6.6.0
###### Mar. 16th, 2020
SkyWalking Chart 1.1.0 is released. Go to [downloads](/downloads) page to find release tars.
- Support SkyWalking 6.6.0
- Support deploy Elasticsearch 7
- The official helm repo was changed to the official Elasticsearch repo (https://helm.elastic.co/)

## SkyWalking Nginx LUA 0.1.0 release
###### Mar. 10th, 2020
Support tracing and collect metrics from Nginx server. Require SkyWalking APM 7.0+.

## Welcome Ming Wen as new committer
###### Mar. 9th, 2020
Based on his continuous contributions, Ming Wen (a.k.a [moonming](https://github.com/moonming)) has been voted as a new committer.

## Welcome Haochao Zhuang to join the PMC
###### Mar. 5th, 2020
Based on his continuous contributions, Haochao Zhuang (a.k.a [dmsolr](https://github.com/dmsolr)) has been invited to join the PMC. Welcome aboard.

## Welcome Zhusheng Xu as new committer
###### Feb. 21st, 2020
Based on his continuous contributions, Zhusheng Xu (a.k.a [aderm](https://github.com/aderm)) has been voted as a new committer.

## Welcome Han Liu as new committer
###### Feb. 8th, 2020
Based on his continuous contributions, Han Liu (a.k.a [mrproliu](https://github.com/mrproliu)) has been voted as a new committer.

## Welcome Hongwei Zhai to join the PMC
###### Jan. 3rd, 2020
Based on his continuous contributions, Hongwei Zhai (a.k.a [innerpeacez](https://github.com/innerpeacez)) has been invited to join the PMC. Welcome aboard.

## Release Apache SkyWalking APM 6.6.0
###### Dec. 27th, 2019
6.6.0 release. Go to [downloads](/downloads) page to find release tars.
1. Service Instance dependency detection are available.
2. Support ElasticSearch 7 as a storage option.
3. Reduce the register load.

## Release Apache SkyWalking Chart 1.0.0 for SkyWalking 6.5.0
###### Dec. 26th, 2019
SkyWalking Chart 1.0.0 is released. Go to [downloads](/downloads) page to find release tars.
1. Deploy SkyWalking 6.5.0 by Chart.
2. Elasticsearch deploy optional.

## Welcome Weiyi Liu as new committer
###### Dec. 10th, 2019
Based on his continuous contributions, Weiyi Liu (a.k.a [wayilau](https://github.com/wayilau)) has been voted as a new committer.

## Release Apache SkyWalking CLI 0.1.0
###### Dec. 10th, 2019
SkyWalking CLI 0.1.0 is released. Go to [downloads](/downloads) page to find release tars.
1. Add command `swctl service` to list services
1. Add command `swctl instance` and `swctl search` to list and search instances of service.
1. Add command `swctl endpoint` to list endpoints of service.
1. Add command `swctl linear-metrics` to query linear metrics and plot the metrics in Ascii Graph mode.
1. Add command `swctl single-metrics` to query single-value metrics.

## Welcome Qiuxia Fan as new committer
###### Nov. 23th, 2019
Based on her continuous contributions, Qiuxia Fan (a.k.a [Fine0830](https://github.com/Fine0830)) has been voted as a new committer.

## Release Apache SkyWalking APM 6.5.0
###### Nov. 15th, 2019
6.5.0 release. Go to [downloads](/downloads) page to find release tars.
1. New metrics comparison view in UI.
2. Dynamic Alert setting supported.
3. JDK9-12 supported in backend.

## Welcome Wei Zhang as new committer
###### Nov. 14th, 2019
Based on his continuous contributions, Wei Zhang (a.k.a [arugal](https://github.com/arugal)) has been voted as a new committer.

## Welcome Haochao Zhuang as new committer
###### Oct. 20th, 2019
Based on his continuous contributions, Haochao Zhuang (a.k.a [dmsolr](https://github.com/dmsolr)) has been voted as a new committer.

## Release Apache SkyWalking APM 6.4.0
###### Sep. 9th, 2019
6.4.0 release. Go to [downloads](/downloads) page to find release tars.
1. Highly recommend to upgrade due to Pxx metrics calculation bug.
1. Make agent working in JDK9+ Module system.

Read [changelog](https://github.com/apache/skywalking/blob/master/CHANGES.md) for the details.

## Welcome Weijie Zou as a new committer
###### September 10th, 2019
Based on his contributions to the skywalking ui project, Weijie Zou (a.k.a [Kdump](https://github.com/x22x22)) has been accepted as a new committer.

## Welcome Yuguang Zhao to join the PMC
###### August 27th, 2019
Based on his continuous contributions, Yuguang Zhao (a.k.a [zhaoyuguang](https://github.com/zhaoyuguang)) has been invited to join the PMC. Welcome aboard.

## Welcome Zhenxu Ke to join the PMC
###### August 23rd, 2019
Based on his continuous contributions, Zhenxu Ke (a.k.a [kezhenxu94](https://github.com/kezhenxu94)) has been invited to join the PMC. Welcome aboard.

## Welcome Yanlong He as a new committer
###### Aug. 9th, 2019
Based on his contributions to the skywalking PHP project, Yanlong He (a.k.a [heyanlong] (https://github.com/heyanlong)) has been accepted as a new committer.

## Release Apache SkyWalking APM 6.3.0
###### Aug. 8th, 2019
6.3.0 release. Go to [downloads](/downloads) page to find release tars.
1. Improve ElasticSearch storage implementation performance again.
1. OAP backend re-install w/o agent reboot required.

Read [changelog](https://github.com/apache/skywalking/blob/master/CHANGES.md) for the details.

## Release Apache SkyWalking APM 6.2.0
###### July 2nd, 2019
6.2.0 release. Go to [downloads](/downloads) page to find release tars.
ElasticSearch storage implementation changed, high reduce payload to ElasticSearch cluster.

Read [changelog](https://github.com/apache/skywalking/blob/master/CHANGES.md) for the details.

## Welcome Zhenxu Ke as a new committer
###### June 17th, 2019
Based on his continuous contributions, Zhenxu Ke (a.k.a [kezhenxu94](https://github.com/kezhenxu94)) has been voted as a new committer.

## Release Apache SkyWalking APM 6.1.0
###### May 5th, 2019
6.1.0 release. Go to [downloads](/downloads) page to find release tars.
This is the first top level project version.

Key updates
1. RocketBot UI
1. OAP performance improvement

## RocketBot UI has been accepted as SkyWalking primary UI
###### April 23rd 2019
Apache SkyWalking PMC accept the RocketBot UI contributions. After IP clearance, it will be released in SkyWalking 6.1 soon.

## SkyWalking graduated as Apache Top Level Project
###### April 17th 2019
Apache board approved SkyWalking graduated as TLP at April 17th 2019.

## Welcome Yuguang Zhao as a new committer
###### April 15th, 2019
Based on his continuous contributions, he has been accepted as a new committer.

## Transfer Docker Images to Apache Official Repository
###### Feb 17th, 2019
According to Apache Software Foundation branding policy all docker images of Apache Skywalking should be
transferred from [skywalking](https://hub.docker.com/u/skywalking) to [apache](https://hub.docker.com/u/apache) with
a prefix *skywalking-*. The transfer details are as follows

 - skywalking/base -> apache/skywalking-base
 - skywalking/oap -> apache/skywalking-oap-server
 - skywalking/ui -> apache/skywalking-ui

 All of repositories in [skywalking](https://hub.docker.com/u/skywalking) will be **removed after one week**.

## Welcome Jian Tan as a new PPMC.
###### Jan 29th, 2019
Based on his contributions to the project, he has been accepted as SkyWalking PPMC. Welcome aboard.

## Release Apache SkyWalking APM 6.0.0-GA
###### Jan 29th, 2019
6.0.0-GA release. Go to [downloads](/downloads) page to find release tars.
This is an important milestone version, we recommend all users upgrade to this version.

Key updates
1. Bug fixed
1. Register bug fix, refactor and performance improvement
1. New trace UI

## Welcome Jinlin Fu as new committer
###### Jan. 10th, 2019
Jinlin Fu has contributed 4 new plugins, including gson, activemq, rabbitmq and canal, which made SkyWalking supporting
all mainstream OSS MQ. Also provide several documents and bug fixes. The SkyWalking PPMC based on these,
promote him as new committer. Welcome on board.

## Release Apache SkyWalking APM 6.0.0-beta
###### Dec 25th, 2018
6.0.0-beta release. Go to [downloads](/downloads) page to find release tars.

Key updates
1. Bugs fixed, closed to GA
1. New protocols provided, old still compatible.
1. Spring 5 supported
1. MySQL and TiDB as optional storage


## Welcome Yao Wang as a new PPMC.
###### Dec. 22th, 2018
Based on his contributions. Including created [RocketBot](https://github.com/TinyAllen/rocketbot) as our secondary UI, new [website](http://skywalking.apache.org/) and very cool trace view page in next release. he has been accepted as SkyWalking PPMC. Welcome aboard.

## Welcome Yixiong Cao as a new committer.
###### Dec. 10th, 2018
Based on his contributions to the project, he has been accepted as SkyWalking committer. Welcome aboard.

## Welcome Lang Li as a new committer.
###### Dec. 6th, 2018
Based on his contributions to the project, he has been accepted as SkyWalking committer. Welcome aboard.


## Welcome Jian Tan as a new committer.
###### Dec. 2rd, 2018
Based on his contributions to the project, he has been accepted as SkyWalking committer. Welcome aboard.


## Release Apache SkyWalking 6.0.0-alpha
###### Nov. 14th, 2018
APM consistently compatible in language agent(Java, .Net, NodeJS), 3rd party format(Zipkin) and service mesh telemetry(Istio).
Go to [downloads](/downloads) page to find release tars.


## Release Apache SkyWalking 5.0.0-GA
###### Oct. 17th, 2018
A stable version of 5.x release. Go to [downloads](/downloads) page to find release tars.


## Release Apache SkyWalking 5.0.0-RC2
###### Sep. 12th, 2018
5.0.0-RC2 release. Go to [downloads](/downloads) page to find release tars.

## Release Apache SkyWalking 5.0.0-beta2
###### July 11th, 2018
5.0.0-beta2 release. Go to [downloads](/downloads) page to find release tars.

## Release Apache SkyWalking 5.0.0-beta
###### May 23rd, 2018
5.0.0-beta release. Go to [downloads](/downloads) page to find release tars.

## Release Apache SkyWalking APM 5.0.0-alpha
###### April 3rd, 2018
5.0.0-alpha release. Go to [downloads](/downloads) page to find release tars.
