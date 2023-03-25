---
title: SkyWalking的远程调试
date: 2019-01-24
author: 丁兵兵
description: "远程调试的目的是为了解决代码或者说程序包部署在服务器上运行，只能通过log来查看问题，以及不能跟在本地IDE运行debug那样查找问题，观看程序运行流程..."
zh_tags:
  - User Manual
  - Development
  - Java
  - Agent
---

ps:本文仅写给菜鸟，以及不知道如何远程调试的程序员，并且仅仅适用 skywalking 的远程调试

## 概述

远程调试的目的是为了解决代码或者说程序包部署在服务器上运行，只能通过 log 来查看问题，以及不能跟在本地 IDE 运行 debug 那样查找问题，观看程序运行流程...
想想当你的程序运行在服务器上，你在本地的 IDE 随时 debug，是不是很爽的感觉。

好了不废话，切入正题。

## 环境篇

IDE：推荐 [IntelliJ IDEA](https://www.jetbrains.com/idea/)

开发语言: 本文仅限于 java，其他语言请自行询问 google 爸爸或者 baidu 娘娘

源代码：自行从 github 下载，并且确保你运行的 skywalking 包也源代码的一致，（也就是说你自己从源代码编译打包运行，虽然不一样也可以调试，但是你想想你在本地开发，更改完代码，没有重新运行，debug 出现的诡异情况）

## 场景篇

假定有如下三台机器

| IP          |    用途    | 备注                                                    |
| ----------- | :--------: | :------------------------------------------------------ |
| 10.193.78.1 | oap-server | skywalking 的 oap 服务（或者说 collector 所在的服务器） |
| 10.193.78.2 |   agent    | skywalking agent 运行所在的服务器                       |
| 10.193.78.0 |    IDE     | 你自己装 IDE 也就是 IntelliJ IDEA 的机器                |

以上环境，场景请自行安装好，并确认正常运行。本文不在赘述

废话终于说完了

## 操作篇

首要条件，下载源码后，先用 maven 打包编译。然后使用 Idea 打开源码的父目录，整体结构大致如下图
![IMAGE](0081Kckwly1gkl4h16jepj30u00ui0wk.jpg)

### 1 :agent 调试

#### 1)Idea 配置部分

![IMAGE](0081Kckwly1gkl4gsba9dj32m803k40w.jpg)
点击 Edit Configurations
在弹出窗口中依次找到（红色线框的部分）并点击
![IMAGE](0081Kckwly1gkl4gxw1u0j319s0c8mzm.jpg)
![IMAGE](0081Kckwly1gkl4gsox3jj30ek10gadm.jpg)
打开的界面如下
![IMAGE](0081Kckwly1gkl4gt601gj31cp0u0gsh.jpg)

修改 Name 值，自己随意，好记即可
然后 Host 输入 10.193.78.2 Port 默认或者其他的，重要的是这个端口在 10.193.78.2 上没有被占用

然后找到 Use module classpath 选择 apm-agent
最终的结果如下：
![IMAGE](0081Kckwly1gkl4h0pw50j30yu0u0jxk.jpg)

注意选择目标 agent 运行的 jdk 版本，很重要

然后点击 Apply，并找到如下内容，并且复制待用
![IMAGE](0081Kckwly1gkl4gytahmj30y50u0wka.jpg)

#### 2）agent 配置部分

找到 agent 配置的脚本，并打开，找到配置 agent 的地方，
![IMAGE](0081Kckwly1gkl4h05q0uj30ji016q3a.jpg)
就这个地方，在这个后边加上刚才复制的内容
最终的结果如下
![IMAGE](0081Kckwly1gkl4gz8kowj31e000uaav.jpg)
提供一个我配置的 weblogic 的配置（仅供参考）
![IMAGE](0081Kckwly1gkl4gyfw8lj31r6020abk.jpg)
然后重启应用（agent）

#### 3）调试

回到 Idea 中找到这个地方，并点击 debug 按钮，你没看错，就是红色圈住的地方
![IMAGE](0081Kckwly1gkl4gun36lj30ew01mmxa.jpg)
然后控制台如果出现以下字样：
![IMAGE](0081Kckwly1gkl4gzq0t3j30y40123z2.jpg)
那么恭喜你，可以愉快的加断点调试了。
ps:需要注意的是 agent 的、
service instance 的注册可能不能那么愉快的调试。因为这个注册比较快，而且是在 agent 启动的时候就发生的，
而远程调试也需要 agent 打开后才可以调试，所以，如果你手快当我没说这句话。

### 2 :oap-server 的调试（也就是 collector 的调试）

具体过程不在赘述，和上一步的 agent 调试大同小异，不同的是
Use module classpath 需要选择 oap-server

![IMAGE](0081Kckwly1gkl4gxeoh7j319g03amxr.jpg)
