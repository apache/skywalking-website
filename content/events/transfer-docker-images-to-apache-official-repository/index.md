---
title: Transfer Docker Images to Apache Official Repository
date: 2019-02-17
author: SkyWalking Team
---

According to Apache Software Foundation branding policy all docker images of Apache Skywalking should be
transferred from [skywalking](https://hub.docker.com/u/skywalking) to [apache](https://hub.docker.com/u/apache) with
a prefix *skywalking-*. The transfer details are as follows

 - skywalking/base -> apache/skywalking-base
 - skywalking/oap -> apache/skywalking-oap-server
 - skywalking/ui -> apache/skywalking-ui

 All of repositories in [skywalking](https://hub.docker.com/u/skywalking) will be **removed after one week**.