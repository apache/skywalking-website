# SkyWalking Events

## Release Apache SkyWalking APM 6.6.0
###### Dec. 27th, 2019
6.6.0 release. Go to [downloads](/downloads) page to find release tars.
1. Service Instance dependency are available.
2. Support ElasticSearch 7 as a storage option.
3. Reduce the register load

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
