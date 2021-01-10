---
title: Apache SkyWalking Committer申请流程
date: 2019-09-12
author: x22x22
description: 本文介绍申请Apache SkyWalking Committer流程。
zh_tags:
- Open Source Contribution
---

作者： SkyWalking committer，[Kdump](https://github.com/x22x22)

本文介绍申请Apache SkyWalking Committer流程, 流程包括以下步骤

1. 与PMC成员表达想成为committer的意愿(主动/被动)
1. PMC内部投票
1. PMC正式邮件邀请
1. 填写Apache iCLA申请表
1. 设置ApacheID和邮箱
1. 设置GitHub加入Apache组织
1. GitHub其它一些不重要设置

## 前期过程

1. 与PMC成员表达想成为committer的意愿(主动/被动)
1. PMC内部投票

当你对项目的贡献活跃度足够高或足够多时, Skywalking项目的PMC(项目管理委员会)会找到你并询问你是否有意愿成为项目的Committer, 或者也可以主动联系项目的PMC表达自己的意向, 在此之后PMC们会进行内部讨论和投票并告知你是否可以进入下一个环节.这个过程可能需要一周.
如果PMC主动邀请你进行非正式的意愿咨询, 你可以选择接受或拒绝.

***PS***:PMC会向你索要你的个人邮箱, 建议提供Gmail, 因为后期绑定Apache邮箱需要用到, 其它邮箱我不确定是否能绑定.

***PS***:从Apache官方的流程来讲, 现有的PMC会在没有通知候选人的情况下先进行候选人投票, 但是Skywalking项目的PMC有可能更倾向于先得到候选人的意愿再进行投票.

## 正式阶段

1. PMC正式邮件邀请
   * 当你收到PMC正式的邀请邮件时, 恭喜你, 你已经通过了PMC的内部投票, 你需要用英文回答接受邀请或者拒绝邀请, 记住回复的时候一定要选择`全部回复`.
1. 填写Apache iCLA申请表
   * 在你收到的PMC邮件中, 有几个ASF官方链接需要你去浏览, 重点的内容是查看[CLAs](http://www.apache.org/licenses/contributor-agreements.html#clas), 并填写[Individual Contributor License Agreement](http://www.apache.org/licenses/icla.pdf), 你可以将`icla.pdf`文件下载到本地, 使用PDF工具填写里面所需的信息, 并打印出来签名(一定要手写签名, 否则会被要求重新签名), 再扫描(或手机拍照)成电子文档(需要回复PDF格式, 文件名建议重命名为`你的名字-icla.pdf`), 使用gpg对电子文档进行签名(参考[HOW-TO: SUBMITTING LICENSE AGREEMENTS AND GRANTS
     
     ](http://www.apache.org/licenses/contributor-agreements.html#submitting)), Window可以使用GnuPG或者Gpg4win.
   * 完成gpg签名后, 请将你签名用的公钥上送到[pool.sks-keyservers.net](http://hkps.pool.sks-keyservers.net)服务器, 并在这个页面中验证你的公钥是否可以被搜索到, 搜索关键词可以是你秘钥中填写的名字或者邮箱地址.
   * gpg签名后, 会生成`.pdf.asc`的文件, 需要将你的`你的名字-icla.pdf`和`你的名字-icla.pdf.asc`以附件的方式一起发送到<secretary@apache.org>, 并抄送给<private@skywalking.apache.org>.

1. 设置ApacheID和邮箱
   * 大概5个工作日内, 你会收到一封来至于<root@apache.org>的邮件, 主题为`Welcome to the Apache Software Foundation (ASF)!`, 恭喜你, 你已经获得了ApacheID, 这时候你需要根据邮件内容的提示去设置你的ApacheID密码, 密码设置完成后, 需要在[Apache Account Utility](https://id.apache.org/)页面中重点设置`Forwarding email address`和`Your GitHub Username`两个信息.保存信息的时候需要你填写当前的ApacheID的密码.
   * 现在进入Gmail, 选择右上角的齿轮->设置->账号和导入->添加其他电子邮件地址->参考[Sending email from your apache.org email address](https://reference.apache.org/committer/email)给出的信息根据向导填写Apache邮箱.

1. 设置GitHub加入Apache组织
   * 进入[Welcome to the GitBox Account Linking Utility!](https://gitbox.apache.org/setup/), 按照顺序将`Apache Account`和`GitHub Account`点绿, 想点绿`MFA Status`, 需要去GitHub开启2FA, 请参考[配置双重身份验证](https://help.github.com/cn/articles/configuring-two-factor-authentication)完成2FA的功能.
   * 等待1~2小时后登陆自己的GitHub的dashboard界面, 你应该会看到一条Apache组织邀请你加入的通知, 这个时候接受即可享有Skywalking相关GitHub项目权限了.

## 其它提示

1. GitHub其它一些不重要设置
   * 在GitHub首页展示Apache组织的logo: 进入[Apache GitHub组织](https://github.com/apache)->People->搜索自己的GitHubID->将`Private`改成`Public`
