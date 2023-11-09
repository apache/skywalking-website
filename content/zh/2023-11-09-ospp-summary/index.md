---
title: "开源之夏 2023 SkyWalking 社区项目情况公示"
author: "Apache SkyWalking"
date: 2023-11-09
description: "开源之夏是由中科院软件所“开源软件供应链点亮计划”发起并长期支持的一项暑期开源活动，旨在鼓励在校学生积极参与开源软件的开发维护，培养和发掘更多优秀的开发者，促进优秀开源软件社区的蓬勃发展，助力开源软件供应链建设。11月9日，官方完成最终审核，并发布结果。"
tags:
- OSPP
---

Aapche SkyWalking PMC 和 committer团队参加了"开源之夏 2023"活动，作为导师，共获得了9个官方赞助名额。最终对学生开放如下任务

* SkyWalking 支持 GraalVM
* Skywalking Infra E2E 自测试
* 监控Apache Pulsar
* 统一BanyanDB的查询计划和查询执行器
* 使用Helm部署BanyanDB
* 编写go agent的gRPC插件
* 监控Kafka
* 集成SkyWalking PHP到SkyWalking E2E 测试
* 在线黄金指标异常检测

经过3个月的开发，上游评审，PMC成员评议，PMC Chair复议，OSPP官方委员会评审多个步骤，现公布项目参与人员与最终结果

# 通过评审项目（共6个）
## SkyWalking 支持 GraalVM
- 学生：张跃骎
- 学校：辽宁大学 本科
- 合并PR：https://github.com/apache/skywalking/pull/11354
- 后续情况说明：GraalVM因为复杂的生态，替代的代码将被分离到[SkyWalking GraalVM Distro](https://github.com/apache/skywalking-graalvm-distro), 相关讨论，请参见[Issue 11518](https://github.com/apache/skywalking/issues/11518)

## Skywalking Infra E2E 自测试
- 学生：王子忱
- 学校：华中师范大学 本科
- 合并PR：[115](https://github.com/apache/skywalking-infra-e2e/pull/115), [116](https://github.com/apache/skywalking-infra-e2e/pull/116), [117](https://github.com/apache/skywalking-infra-e2e/pull/117), [118](https://github.com/apache/skywalking-infra-e2e/pull/118), [119](https://github.com/apache/skywalking-infra-e2e/pull/119)
- 后续情况说明：此特性已经包含在发行版skywalking-infra-e2e v1.3.0中

## 统一BanyanDB的查询计划和查询执行器
- 学生：曾家华
- 学校：电子科技大学 本科
- 合并PR：[343](https://github.com/apache/skywalking-banyandb/pull/343)

## 使用Helm部署BanyanDB
- 学生：黄友亮
- 学校：北京邮电大学 硕士研究生
- 合并PR：[1](https://github.com/apache/skywalking-banyandb-helm/pull/1)
- 情况说明：因为BanyanDB Helm为新项目，学生承接了项目初始化、功能提交、自动化测试，发布准备等多项任务。所参与功能包含在skywalking-banyandb-helm v0.1.0中

## 编写go agent的gRPC插件
- 学生：胡宇腾
- 学校：西安邮电大学
- 合并PR：[88](https://github.com/apache/skywalking-go/pull/88), [94](https://github.com/apache/skywalking-go/pull/94)
- 后续情况说明：该学生在开源之夏相关项目外，完成了[feature: add support for iris #99](https://github.com/apache/skywalking-go/pull/99)和[Go agent APIs](https://github.com/apache/skywalking-go/pull/104)功能开发。并发表文章[SkyWalking Go Toolkit Trace 详解](https://skywalking.apache.org/zh/2023-10-18-skywalking-toolkit-trace/)以及英文译本[Detailed explanation of SkyWalking Go Toolkit Trace](https://skywalking.apache.org/blog/2023-10-18-skywalking-toolkit-trace/)

## 监控Kafka
- 学生：王竹
- 学校：美国东北大学 ( Northeastern University)
- 合并PR：[11282](https://github.com/apache/skywalking/pull/11282), [UI 318](https://github.com/apache/skywalking-booster-ui/pull/318)


# 未通过评审项目（3个）
下列项目因为质量无法达到社区要求，违规等原因，将被标定为失败。
**注：在开源之夏中失败的项目，其Pull Reqeust可能因为符合社区功能要求，也被接受合并。**

## 监控Apache Pulsar
- 学生：孟祥迎
- 学校：重庆邮电大学 本科
- 合并PR：[11339](https://github.com/apache/skywalking/pull/11339)
- 失败原因：项目申请成员，作为ASF Pulsar项目的Committer，在担任Pulsar开源之夏项目导师期间，但依然申请了学生参与项目。属于违规行为。SkyWalking PMC审查了此行为并通报开源之夏组委会。开源之夏组委会依据活动规则取消其结项奖金。

## 集成SkyWalking PHP到SkyWalking E2E 测试
- 学生：罗文
- 学校：San Jose State University B.S.
- 合并PR：[11330](https://github.com/apache/skywalking/pull/11330)
- 失败原因：根据pull reqeust中的提交记录，SkyWalking PMC Chair审查了提交明细，学生参与代码数量大幅度小于导师的提交代码。并在考虑到这个项目难度以及明显低于SkyWalking 开源之夏项目的平均水平的情况下，通报给开源之夏组委会。经过组委会综合评定，项目不合格。

## 在线黄金指标异常检测
- 学生：黄颖
- 学校：同济大学 研究生
- 合并PR：无
- 失败原因：项目在进度延迟后实现较为简单且粗糙，并且没有提供算法评估结果和文档等。在 PR 开启后的为期一个月审核合并期间，学生并未能成功按预定计划改善实现的质量和文档。和导师以及 SkyWalking 社区缺少沟通。

# 结语
SkyWalking社区每年都有近10位PMC成员或Committer参与开源之夏中，帮助在校学生了解顶级开源项目、开源社区的运作方式。我们希望大家在每年经过3个月的时间，能够真正的帮助在校学生了解开源和参与开源。
因为，社区即使在考虑到学生能力的情况下，不会明显的降低pull request的接受标准。希望今后的学生，能够在早期，积极、主动和导师，社区其他成员保持高频率的沟通，对参与的项目有更深入、准确的了解。