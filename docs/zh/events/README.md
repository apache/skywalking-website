# SkyWalking 事件概要


## SkyWalking Cloud on Kubernetes 0.1.0 发布
###### 2020 年 11 月 16 日
SkyWalking Cloud on Kubernetes 0.1.0 发布. 前往 [下载页面](/downloads) 查看如何使用.
- 增加OAPServer自定义资源定义及其控制器

## 欢迎刘嘉鹏成为新的committer
###### 2020 年 11 月 5 日
根据他长期的项目贡献，他被投票选举为项目的 committer

## SkyWalking Kubernetes Helm Chart 4.0.0 发布
###### 2020 年 11 月 3 日
SkyWalking Kubernetes Helm Chart 4.0.0 发布. 前往 [下载页面](/downloads) 查看如何使用.
- 支持自定义覆盖默认的 OAP 配置文件; (`/skywalking/config`).
- 统一不同 SkyWalking 版本的使用方式.

## SkyWalking Client JS探针0.1.0发布
###### 2020 年 10 月 30 日
SkyWalking Client Js 0.1.0 发布. 前往 [下载页面](/downloads) 查看如何使用.
- 支持浏览器监控. 需要SkyWalking APM 8.2以上版本.

## Release Apache SkyWalking APM 8.2.0
###### 2020 年 10 月 27 日
SkyWalking 8.2.0 发布. 前往 [下载页面](/downloads) 查看如何使用.
- 支持浏览器端监控
- 通过 tag 查询链路数据
- 引入指标分析语言(Meter Analysis Language)
- 告警条件支持配置组合条件

## Release Apache SkyWalking LUA Nginx 0.3.0
###### 2020 年 10 月 24 日
SkyWalking LUA Nginx 0.3.0 发布. 前往 [下载页面](/downloads) 查看如何使用.
- 从 `utils` 加载 `base64` 的模块, 不同环境使用不同的库.
- 添加 `skywalking` 前缀, 避免与其他 LUA 库冲突.
- 添加 `http.status` tag.

## Release Apache SkyWalking CLI 0.4.0
###### Oct 11th, 2020
SkyWalking CLI 0.4.0 发布. 前往[下载页面](/downloads) 查看如何使用.
- 功能
  - 增加自动刷新的全局仪表盘命令
  - 增加 dashboard global-metrics 命令
  - 增加 trace 搜索
  - 采用新的查询协议重构 metrics thermodynamic 命令

- 错误修复
  - 修复错误的 golang 标准时间

## 欢迎江华禧成为新的committer
###### 2020 年 9 月 28 日
根据他长期的项目贡献，他被投票选举为项目的 committer

## Release Apache SkyWalking Python 0.3.0
###### Aug 28th, 2020
SkyWalking Python 0.3.0 发布. 前往[下载页面](/downloads) 查看如何使用.
- 新增插件
    - Urllib3 Plugin (#69)
    - Elasticsearch  Plugin (#64)
    - PyMongo Plugin (#60)
    - Rabbitmq Plugin (#53)
    - 使插件与Django兼容 (#52)
    
- API
    - 增加进程间传播 (#67)
    - 在装饰器上添加 `tags` (#65)
    - 在安装插件时，进行版本检查 (#63)
    - 增加线程间传播 (#62)
    - 增加 `trace_ignore_path` 配置，用以忽略指定的路径 (#59)
    - 增加线程的快照 (#56)
    - 增加数据在不同的应用间透传 (#55)
    
- 事务性和测试
    - 测试: 支持多版本的运行(#66)
    - 事务: 为插件添加pull request模板 (#61)
    - 事务: 添加开发文档并重新组织结构 (#58)
    - 测试: 更新测试健康检查
    - 事务: 添加编译发行包 (#54)

## Release Apache SkyWalking Chart 3.1.0 for SkyWalking 8.1.0
###### Aug. 13th, 2020
SkyWalking Chart 3.1.0 发布. 请到[下载页面](/downloads)查找发行版本.
- 支持 SkyWalking 8.1.0
- 支持基于 kubernetes comfigmap 的 OAP 动态配置

## 欢迎华卫成为新的committer
###### 2020 年 8 月 1 日
根据他长期的项目贡献，他被投票选举为项目的 committer

## Release Apache SkyWalking APM 8.1.0
###### 2020 年 8 月 3 日
SkyWalking APM 8.1.0 发布. 请到[下载页面](/downloads)查找发行版本.
- 支持使用支持使用MQ传输监控数据传输监控数据
- 执行新的指标系统MeterSystem，提供原生的metrics API，并支持Spring Sleuth
- 支持JVM线程指标监控

## Release Apache SkyWalking Python 0.2.0
###### July 28th, 2020
SkyWalking Python 0.2.0 发布. 前往[下载页面](/downloads) 查看如何使用.
- 新增插件
    - Kafka Plugin (#50)
    - Tornado Plugin (#48)
    - Redis Plugin (#44)
    - Django Plugin (#37)
    - PyMsql Plugin (#35)
    - Flask plugin (#31)

- API
    - 增加 `ignore_suffix` 配置, 支持忽略后缀的 endpoint (#40)
    - 增加 `log` 方法 (#34)
    - 增加 `SegmentRef` 相等逻辑 (#30)
    - 使用上下文载体 `carrier` 前, 判断其是否合法 (#29)

- 事务性和测试
    - 测试: 插件测试失败时, 打印期望的数据和实际的数据的差别 (#46)
    - 添加搭建开发环境所需的脚本 (#38)

## Release Apache SkyWalking CLI 0.3.0
###### July 27th, 2020
SkyWalking CLI 0.3.0 发布. 请到[下载页面](/downloads) 查看如何使用.
- Command: OAP 健康检查命令
- Command: trace 命令
- BugFix: 修复错误的 metrics graphql 查询文件路径

## Release Apache SkyWalking Python 0.1.0
###### Jun. 28th, 2020
SkyWalking Python 0.1.0 发布. 请到 [下载页面](/downloads) 查看如何使用.
- API: agent 核心 API, 查看 [API 列表及其示例](https://github.com/apache/skywalking-python/blob/3892cab9d5d2c03107cfb2b1c59a6c77c5c3cc35/README.md#api)
- 插件: 支持内置框架 `http`, `urllib.request` 和三方库 `requests`.
- 测试: 搭建 agent 测试框架, 上述插件的相应测试也已添加.

## Release Apache SkyWalking Chart 3.0.0 for SkyWalking 8.0.1
###### Mar. 31th, 2020
SkyWalking Chart 3.0.0 发布. 请到[下载页面](/downloads)查找发行版本.
- 支持 SkyWalking 8.0.1

## Release Apache SkyWalking Nginx LUA 0.2.0
###### 2020 年 6 月 21 日
SkyWalking APM 8.0.0 发布. 请到[下载页面](/downloads)查找发行版本.
- 适配新的v3探针协议
- 支持correlation protocol
- 支持Segment批量上传

## Release Apache SkyWalking APM 8.0.0
###### 2020 年 6 月 15 日
SkyWalking APM 8.0.0 发布. 请到[下载页面](/downloads)查找发行版本.
- 新的v3探针协议
- 新的UI dashboard和新查询协议
- 注册机制被彻底删除

## 欢迎张伟成为项目管理委员会成员
###### 2020 年 4 月 20 日
由于他对该项目的持续贡献，张伟 (a.k.a [arugal](https://github.com/arugal)) 已被邀请加入 SkyWalking 项目管理委员会。欢迎。

## Release Apache SkyWalking Chart 2.0.0 for SkyWalking 7.0.0
###### Mar. 31th, 2020
SkyWalking Chart 2.0.0 发布. 请到[下载页面](/downloads)查找发行版本.
- 支持 SkyWalking 7.0.0
- 支持设置 ES user/password
- 添加 CI 流程

## Release Apache SkyWalking APM 7.0.0
###### Mar. 22nd, 2020
SkyWalking APM 7.0.0 发布. 请到[下载页面](/downloads)查找发行版本.
- 升级探针最低JDK要求到JDK1.8
- 支持代码级性能剖析
- 不再兼容支持v5探针协议，只支持v6协议

## Release Apache SkyWalking CLI 0.2.0
###### Mar. 20th, 2020
SkyWalking CLI 0.1.0 发布. 请到[下载页面](/downloads)查找发行版本.
1. 支持热力图可视化.
1. 支持 top n 命令展示 top n 个实体.
1. 支持热力图 metrics.
1. 支持多线性 metrics

## SkyWalking Chart 1.1.0 发布（SkyWalking 6.6.0）
###### Mar. 16th, 2020
SkyWalking Chart 1.1.0 发布。 请到[下载页面](/downloads)查找发行版本。
- 支持 SkyWalking 6.6.0
- 支持部署 Elasticsearch 7
- 修改 helm 官方仓库为 elastic 官方仓库

## SkyWalking Nginx Lua探针0.1.0发布
###### 2020 年 3 月 10 日
支持基于Nginx的分布式追踪和指标收集。需要SkyWalking APM 7.0以上版本。

## 欢迎温铭成为新的committer
###### 2020 年 3 月 9 日
根据他长期的项目贡献，他被投票选举为项目的 committer

## 欢迎庄浩潮成为项目管理委员会成员
###### 2020 年 3 月 5 日
由于他对该项目的持续贡献，庄浩潮 (a.k.a [dmsolr](https://github.com/dmsolr)) 已被邀请加入 SkyWalking 项目管理委员会。欢迎。

## 欢迎徐竹胜成为新的committer
###### 2020 年 2 月 21 日
根据他长期的项目贡献，他被投票选举为项目的 committer

## 欢迎刘晗成为新的committer
###### 2020 年 2 月 8 日
根据他长期的项目贡献，他被投票选举为项目的 committer

## 欢迎翟宏伟成为项目管理委员会成员
###### 2020 年 1 月 3 日
由于他对该项目的持续贡献，翟宏伟 (a.k.a [innerpeacez](https://github.com/innerpeacez)) 已被邀请加入 SkyWalking 项目管理委员会。欢迎。

## SkyWalking 6.6.0 发布
###### 2019年12月27日
Apache SkyWalking 6.6.0发布。跳转到 [下载](/downloads) 页面查找发布版本。
1. 新增服务实例依赖
2. 可以选择ElasticSearch7 作为存储
3. 降低注册压力

## SkyWalking Chart 1.0.0 发布（SkyWalking 6.5.0）
###### Dec. 26th, 2019
SkyWalking Chart 1.0.0 发布。 请到[下载页面](/downloads)查找发行版本。
1. 部署 SkyWalking 6.5.0 到 Kubernetes 集群。
2. Elasticsearch 部署可选。

## 欢迎刘唯一成为新的committer
###### 2019 年 12 月 10 日
根据他长期的项目贡献，他被投票选举为项目的 committer

## Release Apache SkyWalking CLI 0.1.0
###### Dec. 10th, 2019
SkyWalking CLI 0.1.0 发布. 请到[下载页面](/downloads)查找发行版本.
1. 添加命令 `swctl service` 列出服务.
1. 添加命令 `swctl instance` 和 `swctl search` 列出/搜索某个服务的所有实例.
1. 添加命令 `swctl endpoint` 列出服务的 endpoints.
1. 添加命令 `swctl linear-metrics` 来查询线性指标并绘制成 Ascii Graph 模式.
1. 添加命令 `swctl single-metrics` 来查询单值的指标.

## 欢迎范秋霞成为新的committer
###### 2019 年 11 月 23 日
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

## 欢迎何延龙成为新的committer
###### 2019 年 08 月 09 日
由于他在SkyAPM-PHP上对该项目的持续贡献，何延龙(a.k.a [heyanlong](https://github.com/heyanlong))被投票选举为项目的 committer。

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
