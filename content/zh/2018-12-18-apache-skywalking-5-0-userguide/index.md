---
title: Apache SkyWalking 5.0 中文版图文详解使用手册
date: 2018-12-18
author: 工匠小猪猪的技术世界（微信公众号）
description: 本文纯粹介绍 Apache SkyWalking 如何使用，面对的群体包括了解和不了解 SkyWalking 原理的使用者和打算使用者。
zh_tags:
- User Manual
- Web UI
---

## 版本选择

我们采用的是 5.0.0-RC2 的版本，SkyWalking 的版本信息可以参考 https://github.com/apache/incubator-skywalking/blob/5.x/CHANGES.md

那么为什么我们没有采用 5.1.0 版本呢，这是因为我们公司内部需要支持 es x-pack，但是在官方发布里面，没有支持 xpack 的版本。

在 Apache SkyWalking 官方文档 https://github.com/CharlesMaster/incubator-skywalking/tree/master/docs/others/cn 中有提到，SkyWalking 5.x 仍受社区支持。

对于用户计划从 5.x 升级到 6.x，您应该知道关于有一些概念的定义的变更。最重要的两个改变了的概念是：

1. Application（在 5.x 中）更改为 **Service**（在 6.x 中），Application Instance 也更改为 **Service Instance**。
2. Service（在 5.x 中）更改为 Endpoint（在 6.x 中）。

## 图文详解

Apache SkyWalking 的监控界面由 Monitor 和 Trace 两者构成，Monitor 菜单又包括 Dashbord、Topology、Application、Service、Alarm 五个子菜单构成。本文就是围绕这些菜单分别逐一进行介绍。

![img](0081Kckwly1gkkfaoynmhj30e20mmaan.jpg)

## Monitor

当用户通过 SkyWalking 登陆界面使用用户名、密码登陆以后，就会默认进入到 SkyWalking 的 Monitor 下的 Dashboard 界面

![img](0081Kckwly1gkkfapc02wj316g0m2gmn.jpg)

## Dashboard

下图就是用户登陆之后都会看到的关键 Dashboard 页面，在这个页面的下方的关键指标，图中都做了详细的解释。

![image-20201110220355494](0081Kckwly1gkkfey6mylj31mb0u0qnv.jpg)

上图中 app 需要强调的是，52 个 app 并不代表 52 个应用，比如 paycenter 有两台 paycenter1 和 paycenter2 就算了 2 个 app，当然还有一些应用是 3 个以上的。在我们公司，paycenter1、paycenter2 这些运维都和我们跳板机管理平台上的名称设置的一样，约定大于配置，开发人员可以更加便捷的排查问题。

> 再次修正一下，关于 dashboard 页面的 app 数，语言类探针，是探针的 app_code 来决定的。比如我们公司的线上配置就是 agent.application_code=auth-center-1

上图中需要解释两个概念：

- cpm 代表每分钟请求次数
- SLA=(TRANSACTION_CALLS- TRANSACTION_ERROR_CALLS ) * 10000 ) / TRANSACTION_CALLS

该页面主要支持四个跳转：

一、在上图中，App 板块上的帮助选项是可以直接跳转到 Application 监控页面的。 ![img](0081Kckwly1gkkfatq9rrj31340bajs1.jpg)

二、 Service 板块上的帮助选项是可以直接跳转到 Service 监控页面的。 

![image-20201110220524415](0081Kckwly1gkkfghp1izj30m6086t9a.jpg)

三、 Slow Service 列表中的每一个慢服务点击以后都会进入到其专项的 Service 监控页面。

四、 Application Throughput 列表中的每一个 Application 点击以后也都是可以进入到其专项的 Application 监控页面。

> 关于 Application 和 Service 的详细介绍我们后续会展开

在 Dashboard 的页面上部分，还有一个选择功能模块： ![img](0081Kckwly1gkkfauiuvnj326s0egacd.jpg)

左侧部分可以定期 refresh Dashboard 的数据，右侧则可以调整整体的查询区间。

## Topology

点击 Monitor 菜单下的 Topology 你会看到下面这张拓扑图

![img](0081Kckwly1gkkfasjfraj31rc0u0tcb.jpg)

当然这张图太过于夸张了，如果接入 SkyWalking 的应用并不是很多，会如下图所示： ![img](0081Kckwly1gkkfas3wlaj318f0homy1.jpg)

左侧的三个小按钮可以调整你的视图，支持拖拽。右侧可以输入你所关心的应用名。比如我们输入一个支付和订单两个应用，左侧的拓扑图会变得更加清晰：

![img](0081Kckwly1gkkfaqs4umj31mu0u0q6o.jpg)

另外，上图中的绿色圆圈都是可以点击的，如果你点击以后，还会出现节点信息： ![img](0081Kckwly1gkkfaqefu4j30sk0my3zh.jpg)

## Application

点击 Monitor 菜单下的 Application 你会看到下面这张图，这张图里你可以看到的东西都做了注解。

![image-20201110220324947](0081Kckwly1gkkfef76xcj31ti0u01fl.jpg)

这张图里有一个惊喜，就是如果你点开 More Server Details，你可以看到更多的信息

![image-20201110220238472](0081Kckwly1gkkfdluzblj31oy0u0tm2.jpg)

![image-20201110220226783](0081Kckwly1gkkfdetks9j316y0u0tgg.jpg)

是的，除了 Host、IPv4、Pid、OS 以外，你还可以看到 CPU、Heap、Non-Heap、GC（Young GC、Old GC）等详细监控信息。

## Service

点击 Monitor 菜单下的 Service 你会看到下面这张图，这张图里你可以看到的同样都做了注解。 ![img](0081Kckwly1gkkfaps4xnj31pk0u0jul.jpg)

关于 Dependency Map 这张图我们再补充一下，鼠标悬停可以看到每个阶段的执行时间，这是 Service 下的功能 ![img](0081Kckwly1gkkfauwowgj31v00u0mzz.jpg)

我们点开图中该图中 Top 20 Slow Traces 下面的被我马赛克掉的 trace 的按钮框，可以看到如下更加详细的信息： 

![image-20201110220444481](0081Kckwly1gkkfftbd4rj31k50u04qp.jpg)

这些信息可以帮助我们知道每一个方法在哪个阶段那个具体实现耗时了多久。 

![image-20201110220427876](0081Kckwly1gkkffi442xj32060n67go.jpg)

如上图所示，每一行基本都是可以打开的，每一行都包含了 Tags、Logs 等监控内容

## Alarm

点击 Monitor 菜单下的 Alarm 你会看到告警菜单。目前 5.X 版本的还没有接入邮件、短信等告警方式，后续 6 支持 webhook，用户可以自己去接短信和邮件。

告警内容中你可以看到 Applicaion、Server 和 Service 三个层面的告警内容

![image-20201110220147756](0081Kckwly1gkkfcqi2uxj31wd0u0h00.jpg)

## Trace

Trace 是一个非常实用的功能，用户可以根据精确的 TraceId 去查找

![img](0081Kckwly1gkkfavf2lgj31l00u0mys.jpg)

也可以设定时间段去查找

![image-20201110220555459](0081Kckwly1gkkfh13afbj31n50u0akg.jpg)

我在写使用手册时候，非常巧的是，看到了上图三起异常，于是我们往下拉列表看到了具体的数据

![image-20201110220614258](0081Kckwly1gkkfhcjpa6j32440nck39.jpg)

点击进去，我们可以看到具体的失败原因 ![img](0081Kckwly1gkkfaw3kppj31lu0u042l.jpg)

当然用户也可以直接将 Trace State 调整为 Error 级别进行查询

![img](0081Kckwly1gkkfax9uubj31ps0u0413.jpg)

## 再回顾一遍

一、首先我们进入首页： 

![image-20201110220641793](0081Kckwly1gkkfhu2nboj31ca0ms15o.jpg)

二、点击一下首页的 Slow Service 的 projectC，可以看到如下信息： 

![image-20201110220700002](0081Kckwly1gkkfi5994yj31aq0pnk4q.jpg)

三、如果点击首页的 Appliation Throughput 中的 projectD，可以看到如下信息：

![img](0081Kckwly1gkkfaroz97j31bl0kwta6.jpg)

四、继续点进去右下角的这个 slow service 里的 Consumer，我们可以看到下图： 

![img](0081Kckwly1gkkfawsvybj31ax0p6dl4.jpg)

## 参考资料 

- https://twitter.com/AsfSkyWalking/status/1013616673218179072
- https://twitter.com/AsfSkyWalking/status/1013617100143800320
