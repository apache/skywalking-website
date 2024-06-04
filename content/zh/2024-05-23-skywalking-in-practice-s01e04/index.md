---
title: "SkyWalking从入门到精通 - 2024系列线上分享活动（第四讲）"
date: 2024-05-23
author: 张跃骎
description: 理清数据流向；MySQL 数据库的指标是如何一步一步导向 SkyWalking 的。简单介绍 MAL；SkyWalking 如何利用领域特定语言对数据处理。简单介绍 SkyWalking UI；讲解如何打造独属于自己的监控面板。
---

本次直播是 Apache SkyWalking 社区和纵目联合举办分享活动的第四讲，由张跃骎为大家展示 SkyWalking 监控 MySQL Server，主要包含以下几部分内容：

- 理清数据流向；MySQL 数据库的指标是如何一步一步导向 SkyWalking 的。
- 简单介绍 MAL；SkyWalking 如何利用领域特定语言对数据处理。
- 简单介绍 SkyWalking UI；讲解如何打造独属于自己的监控面板。

[B站视频地址](https://www.bilibili.com/video/BV177421Z7xn)

环境准备整理如下：

# 环境准备
## MySQL Server
如果读者没有直接可使用的 MySQL Server，可以使用 Docker 通过以下命令直接创建：
``` bash
docker run -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:latest
```
关于账号，创建命令如下(即请确保具有以下权限)：
``` SQL
CREATE USER 'exporter'@'localhost' IDENTIFIED BY 'XXXXXXXX' WITH MAX_USER_CONNECTIONS 3;
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter'@'localhost';
```
## MySQL Exporter 安装
指标导出工具最简单的部署方式是通过 Docker，命令如下：
``` bash
docker run -d \
  -p 9104:9104 \
  -e "DATA_SOURCE_NAME=root:password@(host.docker.internal:3306)/"   \
  prom/mysqld-exporter:v0.14.0
```
请注意，命令中的 DATA_SOURCE_NAME 部分应该按照实际情况更换。

## OTEL Collctor
由于笔者使用的是 macos 系统，而部分版本的 OpenTelemetry Collector 在 docker desktop 上调试会有 bug，因此演示使用本地安装方式，具体安装方式请参考：[OpenTelemetry Collector安装](https://opentelemetry.io/docs/collector/installation/)。

安装好后，我们可以执行命令开始运行：
``` bash
./otelcol --config=test.conf
```

配置文件，请参考：[OTEL Collector 配置](https://github.com/apache/skywalking/blob/master/test/e2e-v2/cases/mysql/prometheus-mysql-exporter/otel-collector-config.yaml)。

