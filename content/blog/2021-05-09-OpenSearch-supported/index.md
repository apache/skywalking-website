---
title: "OpenSearch, a new storage option to avoid ElasticSearch's SSPL"
date: 2021-05-09
author: Sheng Wu, Tetrate.io, Apache SkyWalking Creator. [GitHub](https://github.com/wu-sheng) [Twitter](https://twitter.com/wusheng1108) [Linkedin](https://www.linkedin.com/in/wusheng1108)
description: "Elasticsearch server doesn't release under Apache 2.0 anymore. But we have another open option in OpenSearch project."
tags:
- License
---

We posted our [**Response to Elastic 2021 License Change**](/blog/2021-01-17-elastic-change-license/) blog 4 months ago. It doesn't have a big impact in 
the short term, but because of the incompatibility between SSPL and Apache 2.0, we lost the chance of upgrading the storage server, 
which concerns the community and our users. So, we have to keep looking for a new option as a replacement.

There was an open source project, Open Distro for Elasticsearch, maintained by the AWS team. It is an Apache 2.0-licensed distribution of Elasticsearch enhanced with enterprise security, alerting, SQL, and more. After Elastic relicensed its projects, we talked with their team, and they have an agenda
to take over the community leadship and keep maintaining Elasticsearch, as it was licensed by Apache 2.0. So, they are good to fork and continue.

On April 12th, 2021, AWS announced the new project, OpenSearch, driven by the community, which is initialized from people of AWS, Red Hat, SAP, Capital One, and Logz.io. Read this [Introducing OpenSearch](https://aws.amazon.com/cn/blogs/opensource/introducing-opensearch/) blog for more detail.

Once we had this news in public, we begin to plan the process of evaluating and testing OpenSearch as SkyWalking's storage option. 
Read our [issue](https://github.com/apache/skywalking/issues/6745).

**Today, we are glad to ANNOUNCE, OpenSearch could replace ElastcSearch as the storage, and it is still licensed under Apache 2.0.**

This has been merged in the main stream, and you can find it in the dev doc already.

### OpenSearch

OpenSearch storage shares the same configurations as Elasticsearch 7.
In order to activate Elasticsearch 7 as storage, set storage provider to **elasticsearch7**.
Please download the `apache-skywalking-bin-es7.tar.gz` if you want to use OpenSearch as storage.

SkyWalking community will keep our eyes on the OpenSearch project, and look forward to their first GA release.
___

NOTE: we have to add a warning NOTICE to the Elasticsearch storage doc:

**NOTICE:** Elastic announced through their blog that Elasticsearch will be moving over to a Server Side Public
License (SSPL), which is incompatible with Apache License 2.0. This license change is effective from Elasticsearch
version 7.11. So please choose the suitable Elasticsearch version according to your usage.
