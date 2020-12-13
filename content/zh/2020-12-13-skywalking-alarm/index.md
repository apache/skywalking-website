---
title: skywalking报警发送到钉钉群
date: 2020-12-13
author: tristan-tsl
description: 本文将详细介绍与以往做法不同的是如何配置告警发送到钉钉群
---



这篇文章暂时不讲告警策略, 直接将默认情况下的快速尝试看到tracing数据监控过程以及告警目标以及钉钉上的告警效果

skywalking内置了很多默认的告警策略, 然后根据告警策略生成告警目标, 我们可以很容易的在界面上看到

![image-20201213163408221](image-20201213163408221.png)

当我们想去让这些告警目标通知到我们时, 根据我们的以往的经验(alertmanager), 我们会去找一个skywalking-webhook-dingtalk这样的一个服务来转发, 但是实际上, Skywalking目前版本已经自带了, 只需要简单配置一下即可



如果你是默认的配置文件, 直接执行一下命令即可(或者手动修改configs/alarm-settings.yml)

当然在这之前你需要去钉钉里面创建机器人, 勾选加签

![image-20201213164116760](image-20201213164116760.png)



```
tee <your_skywalking_path>/configs/alarm-settings.yml <<-'EOF'
dingtalkHooks:
  textTemplate: |-
    {
      "msgtype": "text",
      "text": {
        "content": "Apache SkyWalking Alarm: \n %s."
      }
    }
  webhooks:
    - url: https://oapi.dingtalk.com/robot/send?access_token=<access_token>
      secret: <加签值>
EOF
```



最终效果如下

![image-20201213164145494](image-20201213164145494.png)

谢谢观看, 我会继续完善这篇文章