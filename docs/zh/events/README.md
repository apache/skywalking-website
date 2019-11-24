# SkyWalking 事件概要

## 欢迎范秋霞成为新的committer
###### 2019 年 11 月 14 日
根据她长期的项目贡献，她被投票选举为项目的 committer。

## SkyWalking 6.5.0 发布
###### 2019年11月15日
Apache SkyWalking 6.5.0发布。跳转到 [下载](/downloads) 页面查找发布版本。
1. 新的指标比较视图。
2. 支持动态告警配置。
3. 后端支持在JDK9-12中部署。

## 欢迎张伟成为新的committer
###### 2019 年 11 月 14 日
根据他长期的项目贡献，他被投票选举为项目的 committer。

## 欢迎庄浩潮成为新的committer
###### 2019 年 10 月 20 日
根据他长期的项目贡献，他被投票选举为项目的 committer。

## SkyWalking 6.4.0 发布
###### 2019年9月11日
Apache SkyWalking 6.4.0发布。跳转到 [下载](/downloads) 页面查找发布版本。
1. Pxx计算函数存在严重bug，强烈建议升级。
1. 探针支持JDK9+模块化组件

阅读 [changelog](https://github.com/apache/skywalking/blob/master/CHANGES.md) 了解详细升级内容。

## 欢迎邹伟杰成为新的committer
###### 2019 年 09 月 10 日
由于他在UI上对skywalking项目的贡献，邹伟杰(a.k.a [Kdump](https://github.com/x22x22))被投票选举为项目的 committer。

## 欢迎赵禹光成为项目管理委员会成员
###### 2019 年 08 月 27 日
由于他对该项目的持续贡献，他已被邀请加入 SkyWalking 项目管理委员会。欢迎。

## 欢迎柯振旭成为项目管理委员会成员
###### 2019 年 08 月 23 日
由于他对该项目的持续贡献，他已被邀请加入 SkyWalking 项目管理委员会。欢迎。

## SkyWalking 6.3.0 发布
###### 2019年8月8日
Apache SkyWalking 6.3.0发布。跳转到 [下载](/downloads) 页面查找发布版本。
1. 进一步优化ElasticSearch存储实现性能
1. 后端重新安装、升级时，探针不需要重启

阅读 [changelog](https://github.com/apache/skywalking/blob/master/CHANGES.md) 了解详细升级内容。

## SkyWalking 6.2.0 发布
###### 2019年7月2日
Apache SkyWalking 6.2.0发布。跳转到 [下载](/downloads) 页面查找发布版本。
ElasticSearch存储实现修改，大幅减少对ElasticSearch集群的压力。

阅读 [changelog](https://github.com/apache/skywalking/blob/master/CHANGES.md) 了解详细升级内容。

## 欢迎柯振旭成为新的committer
###### 2019年6月17日
根据他长期的项目贡献，他被投票选举为项目的 committer。

## SkyWalking 6.1.0 发布
###### 2019年5月5日
Apache SkyWalking 6.1.0发布。跳转到 [下载](/downloads) 页面查找发布版本。
这是成为顶级项目后的第一个版本。

关键更新
1. RocketBot UI
1. OAP后端性能大幅提升

## RocketBot UI被接受为SkyWalking主UI
###### 2019年4月23日
Apache SkyWalking PMC 同意接受RocketBot UI项目。在完成IP确认工作后，它将随SkyWalking 6.1发布。

## SkyWalking 毕业成为Apache顶级项目
###### 2019年4月17日
Apache董事会批准SkyWalking孵化器毕业，成为顶级项目。

## 欢迎赵禹光成为新的committer
###### 2019年4月15日
根据他长期的项目贡献，他被提升为项目的committer。

## 迁移Docker镜像到Apache官方仓库
###### 2019年2月17日
根据Apache Software Foundation的品牌政策，Apache Skywalking的所有docker镜像将会
从[skywalking](https://hub.docker.com/u/skywalking)迁移到[apache](https://hub.docker.com/u/apache)中。
skywalking的镜像将以 *skywalking-* 为前缀。具体迁移方案如下:

 -  skywalking/base  -> apache/skywalking-base
 -  skywalking/oap  -> apache/skywalking-oap-server
 -  skywalking/ui  -> apache/skywalking-ui

[skywalking](https://hub.docker.com/u/skywalking)中的所有库将在**一周后删除**。

## 欢迎谭建成为PPMC
###### 2019年01月29日
根据他对该项目的贡献，他已被接纳为SkyWalking PPMC。欢迎。

## Release Apache SkyWalking APM 6.0.0-GA
###### Jan 29th, 2019
6.0.0-GA发布。跳转到 [下载](/downloads) 页面查找发布版本。
这是一个重要的里程碑版本，我们建议所有用户更新到此版本

关键更新
1. BUG修复
1. 注册BUG修复，重构和性能优化
1. 新的Trace展示页面

## 欢迎付金林成为新的committer
###### 2019年1月10日
付金林贡献了4个新的插件，包括gson, activemq, rabbitmq 和 canal，使得SkyWalking支持所有的主流开源MQ。
同时提供了部分文档和BUG修复。SkyWalking PPMC基于这些贡献，接纳他成为新的committer。

## 发布Apache SkyWalking APM 6.0.0-beta版本
###### 2018年12月25日
6.0.0-beta发布。跳转到[下载](/zh/downloads/)页面查找发布版本。

关键更新
1. 修复大量BUG，稳定性接近GA
1. 提供新的数据协议，老协议依然支持
1. 支持 Spring 5
1. 支持MySQL和TiDB作为新的可选存储

## 欢迎王垚成为PPMC
###### 2018年12月22日
根据他的贡献，包括制作了[RocketBot](https://github.com/TinyAllen/rocketbot)作为我们的第二套UI, 新的[Skywalking官网](http://skywalking.apache.org/) 和下一版本中非常酷的链路追踪页面.他已被接纳为SkyWalking PPMC。欢迎。

## 欢迎曹奕雄成为committer
###### 2018年12月10日
根据他对该项目的贡献，他已被接纳为SkyWalking提交者。欢迎。

## 欢迎李浪成为committer
###### 2018年12月6日
根据他对该项目的贡献，他已被接纳为SkyWalking提交者。欢迎。


## 欢迎谭建成为committer.
###### 2018年12月2日
根据他对该项目的贡献，他已被接纳为SkyWalking提交者。欢迎。


## 发布Apache SkyWalking 6.0.0-alpha版本
###### 2018年11月14日
APM始终兼容多语言探针（Java，.Net，NodeJS）、第三方追踪数据格式（Zipkin）和服务网格遥测数据（Istio）。跳转到[下载](/zh/downloads/)页面查找发布版本。


## 发布Apache SkyWalking 5.0.0-GA
###### 2018年10月17日
5.x版本的稳定版本。跳转到[下载](/zh/downloads/)页面查找发布版本。


## 发布Apache SkyWalking 5.0.0-RC2版本
###### 2018年9月12日
5.0.0-RC2发布。跳转到[下载](/zh/downloads/)页面查找发布版本。

## 发布Apache SkyWalking 5.0.0-beta2版本
###### 2018年7月11日
5.0.0-beta2发布。跳转到[下载](/zh/downloads/)页面查找发布版本。

## 发布Apache SkyWalking 5.0.0-beta版本
###### 2018年5月23日
5.0.0-beta发布。跳转到[下载](/zh/downloads/)页面查找发布版本。

## 发布Apache SkyWalking APM 5.0.0-alpha版本
###### 2018年4月3日
5.0.0-alpha发布。跳转到[下载](/zh/downloads/)页面查找发布版本。
