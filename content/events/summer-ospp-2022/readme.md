---
title: "Open Source Promotion Plan 2022 -- Project List"
date: 2022-04-04
author: SkyWalking Team
---

**SkyWalking** is an open-source APM system, including monitoring, tracing, and diagnosing capabilities for distributed systems in Cloud Native architecture. It covers monitoring for Linux, Kubernetes, Service Mesh, Serverless/Function-as-a-Service, agent-attached services, and browsers. With data covering traces, metrics, logs, and events, SkyWalking is a full-stack observability APM system.

Open Source Promotion Plan is a summer program organized and long-term supported by Open Source Software Supply Chain Promotion Plan. It aims to encourage college students to actively participate in developing and maintaining open-source software and promote the vigorous development of an excellent open-source software community.

Apache SkyWalking has been accepted in OSPP 2022

| Project | Description | Difficulty | Mentor / E-mail | Expectation | Tech. Requirements | Repository |
|---------|-------------|------------|-----------------|-------------|--------------------|------------|
| SkyAPM-PHP | Add switches for monitoring items | Advanced Level | Yanlong He / heyanlong@apache.org | Complete project development work | C++, GO, PHP | https://github.com/SkyAPM/SkyAPM-php-sdk |
| SkyWalking-Infra-E2E | Optimize verifier                 | Normal Level   | Huaxi Jiang / hoshea@apache.org   | 1. Continue to verify cases when other cases fail <br/> 2. Merge retry outputs <br/> 3. Prettify verify results' output | Go                 | https://github.com/apache/skywalking-infra-e2e |
| SkyWalking | Metrics anomaly detection with machine learning  | Advanced Level | Yihao Chen / yihaochen@apache.org | An MVP version of ML-powered metrics anomaly detection using dynamic baselines and thresholds | Python, Java | https://github.com/apache/skywalking |
| SkyWalking Python | Collect PVM metrics and send the metrics to OAP backend, configure dashboard in UI | Normal Level | Zhenxu Ke / kezhenxu94@apache.org | Core Python VM metrics should be collected and displayed in SkyWalking. | Python | https://github.com/apache/skywalking-python [issue](https://github.com/apache/skywalking/issues/5944) |
| SkyWalking BanyanDB| Command line tools for BanyanDB| Normal Level|Hongtao Gao / hanahmily@apache.org| Command line tools should access relevant APIs to manage resources and online data.|Go|https://github.com/apache/skywalking-banyandb |
| SkyWalking SWCK|CRD and controller for BanyanDB| Advance Level| Ye Cao / dashanji@apache.org| CRD and controller provision BanyanDB as the native Storage resource.|Go|https://github.com/apache/skywalking-swck |
| SkyAPM-Go2sky | Collect golang metrics such as gc, goroutines and threads, and send the the metrics to OAP backend, configure dashboard in UI | Normal Level | Wei Zhang / zhangwei24@apache.org | Core golang metrics should be collected and displayed in SkyWalking. | Go | https://github.com/SkyAPM/go2sky |
| SkyWalking | Collect system metrics such as system_load, cpu_usage, mem_usage from telegraf and send the metrics to OAP backend, configure dashboard in UI | Normal Level | Haoyang Liu / liuhaoyangzz@apache.org | System metrics should be collected and displayed in SkyWalking. | Java | https://github.com/apache/skywalking |

Mentors could submit pull requests to update the above list.

# Contact the community

You could send emails to mentor's personal email to talk about the project and details.
The official mail list of the community is dev@skywalking.apache.org. You need to subscribe to the mail list to get all replies. Send mail to dev-suscribe@skywalking.apache.org and follow the replies.
