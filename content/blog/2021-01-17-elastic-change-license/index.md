---
title: "Response to Elastic 2021 License Change"
date: 2021-01-17
author: Sheng Wu, Tetrate.io, Apache SkyWalking Creator. [GitHub](https://github.com/wu-sheng) [Twitter](https://twitter.com/wusheng1108) [Linkedin](https://www.linkedin.com/in/wusheng1108)
description: "Elastic Search server doesn't release under Apache 2.0 anymore. What is the impact to the SkyWalking project?"
---

[Elastic](https://elastic.co) announced their license change, [**Upcoming licensing changes to Elasticsearch and Kibana**.](https://www.elastic.co/blog/licensing-change)
> We are moving our Apache 2.0-licensed source code in Elasticsearch and Kibana to be dual licensed under Server Side Public License (SSPL) and the Elastic License, giving users the choice of which license to apply. This license change ensures our community and customers have free and open access to use, modify, redistribute, and collaborate on the code. It also protects our continued investment in developing products that we distribute for free and in the open by restricting cloud service providers from offering Elasticsearch and Kibana as a service without contributing back. This will apply to all maintained branches of these two products and will take place before our upcoming 7.11 release. Our releases will continue to be under the Elastic License as they have been for the last three years.

Also, they provide the [FAQ page](https://www.elastic.co/pricing/faq/licensing) for more information about the impact for the users, developers, and vendors.

In the perspective of Apache Software Foundation, SSPL has been confirmed as a Catalog X LICENSE(https://www.apache.org/legal/resolved.html#category-x), 
which means hard-dependency as a part of the core is not allowed. 
With that, we can't only focus on it anymore. We need to consider other storage options. Right now, we still have InfluxDB, TiDB, H2 server still in Apache 2.0 licensed.
Right now, we still have InfluxDB, TiDB, H2 server as storage options still in Apache 2.0 licensed.

As one optional plugin, we need to focus on the client driver license. 
Right now, we are only using ElasticSearch 7.5.0 and 6.3.2 drivers, which are both Apache 2.0 licensed. So, we are safe.
For further upgrade, here is their announcement. They answer these typical cases in the FAQ page.
___

> I build a SaaS application using Elasticsearch as the backend, how does this affect me?

This source code license change should not affect you - you can use our default distribution or develop applications on top of it for free, under the Elastic License. This source-available license does not contain any copyleft provisions and the default functionality is free of charge. For a specific example, you can see our response to a question around this at Magento.

**Our users still could use, redistribute, sale the products/services, based on SkyWalking, even they are using self hosting Elastic Search unmodified server.**

___

> I'm using Elasticsearch via APIs, how does this change affect me?

This change does not affect how you use client libraries to access Elasticsearch. Our client libraries remain licensed under 
Apache 2.0, with the exception of our Java High Level Rest Client (Java HLRC).
The Java HLRC has dependencies on the core of Elasticsearch, and as a result this client library will be licensed under the 
Elastic License. Over time, we will eliminate this dependency and move the Java HLRC to be licensed under Apache 2.0. Until 
that time, for the avoidance of doubt, we do not consider using the Java HLRC as a client library in development of an 
application or library used to access Elasticsearch to constitute a derivative work under the Elastic License, and this will not 
have any impact on how you license the source code of your application using this client library or how you distribute it.

**The client driver license incompatible issue will exist, we can't upgrade the driver(s) until they release the Apache 2.0 licensed driver jars.**
**But users are still safe to upgrade the drivers by themselves.**

___

Apache SkyWalking will discuss the further actions [here](https://github.com/apache/skywalking/issues/6219). If you have any question, welcome to ask.
In the later 2021, we will begin to invest the posibility of creating SkyWalking's observability database implementation.