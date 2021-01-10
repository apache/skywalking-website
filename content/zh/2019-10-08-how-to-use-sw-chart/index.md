---
title: 使用 chart 部署 SkyWalking
date: 2019-10-08
author: innerpeacez
description: 本文主要讲述的是如何使用 Helm Charts  将 SkyWalking 部署到 Kubernetes 集群中。
zh_tags:
- User Manual
---

- 作者：innerpeacez
- [原文地址](https://ipzgo.top/2019-10-08-%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8-helm-chart-%E9%83%A8%E7%BD%B2-skywalking/)

本文主要讲述的是如何使用 Helm Charts  将 SkyWalking 部署到 Kubernetes 集群中，相关文档可以参考[skywalking-kubernetes ](https://github.com/apache/skywalking-kubernetes)和 [backend-k8s 文档](https://github.com/apache/skywalking/blob/master/docs/en/setup/backend/backend-k8s.md) 。

目前推荐的四种方式：

- 使用 helm 2 提供的 helm serve 启动本地 helm repo 
- 使用本地 chart 文件部署
- 使用 harbor 提供的 repo 功能
- 直接从官方 repo 进行部署

注意：目前 skywalking 的 chart 还没有提交到官方仓库，请先参照前三种方式进行部署

#### Helm 2 提供的 helm serve 

##### **打包对应版本的 skywalking chart**

1.配置 helm 环境，[参考 Helm 环境配置](https://ipzgo.top/2019-07-26-Windows-%E4%BD%BF%E7%94%A8-helm3-%E5%92%8C-kubectl/) ，如果你要部署 helm2 相关 chart 可以直接配置 helm2 的相关环境

2.克隆/下载ZIP [**skywalking-kubernetes**](https://github.com/apache/skywalking-kubernetes) 这个仓库，仓库关于chart的目录结构如下

> helm-chart
>
> - helm2
>   - 6.0.0-GA
>   - 6.1.0
> - helm3
>   - 6.3.0
>   - 6.4.0

克隆/下载ZIP 完成后进入指定目录打包对应版本的chart 

```shell
cd skywalking-kubernetes/helm-chart/<helm-version>/<skywalking-version>
```

注意：helm-version 为对应的 helm 版本目录，skywalking-version 为对应的 skywalking 版本目录，下面以helm3 和 skywalking 6.3.0 为例

```shell
cd skywalking-kubernetes/helm-chart/helm3/6.3.0
```

3.由于skywalking 依赖 elasticsearch 作为存储库，执行以下命令更新依赖，默认会从官方repo进行拉取

```shell
helm dep up skywalking
```

> Hang tight while we grab the latest from your chart repositories...
> ...Successfully got an update from the "stable" chart repository
> Update Complete. ⎈Happy Helming!⎈
> Saving 1 charts
> Downloading elasticsearch from repo https://kubernetes-charts.storage.googleapis.com/
> Deleting outdated charts

如果官方 repo 不存在，请先添加官方仓库

```shell
helm repo add stable https://kubernetes-charts.storage.googleapis.com
```

>"stable" has been added to your repositories

4.打包 skywalking , 执行以下命令

```shell
helm package skywalking/
```

>Successfully packaged chart and saved it to: C:\code\innerpeacez_github\skywalking-kubernetes\helm-chart\helm3\6.3.0\skywalking-0.1.0.tgz

打包完成后会在当前目录的同级目录生成 .tgz 文件

```
 ls
```

>skywalking/  skywalking-0.1.0.tgz

##### 启动 helm serve 

由于上文配置的 helm 为 helm3 ,但是 helm 3中移除了 helm serve 的相关命令，所以需要另外一个环境配置helm2 的相关环境，[下载 helm 2.14.3 的二进制文件](https://github.com/helm/helm/releases/tag/v2.14.3)，配置基本上没有大的差别，不在赘述

初始化 helm 

```shelm
helm init
```

将上文生成的 **skywalking-0.1.0.tgz** 文件复制到 helm 相关目录 `/root/.helm/repository/local`,启动 serve

```shell
helm serve --address <ip>:8879 --repo-path /root/.helm/repository/local
```

注意： ip 为要能够被上文配置 helm 3 环境的机器访问到

可以访问一下看看服务 serve 是否启动成功

```shell
curl ip:8879
```

##### 部署 skywalking

1.在helm3 环境中添加启动的本地 repo 

```shell
helm repo add local http://<ip>:8879
```

2.查看 skywalking chart 是否存在于本地仓库中

```shell
helm search skywalking
```

> NAME             	CHART VERSION	APP VERSION	DESCRIPTION                 
> local/skywalking 	0.1.0        	6.3.0      	Apache SkyWalking APM System

3.部署

```shell
helm -n test install skywalking local/skywalking
```

这样 skywalking 就部署到了 k8s 集群中的 test 命名空间了，至此本地安装skywalking 就完成了。

#### 本地文件部署

如果你不想存储到 chart 到仓库中也可以直接使用本地文件部署 skywalking,按照上面的步骤将skywalking chart 打包完成之后，直接使用以下命令进行部署

```shell
helm -n test install skywalking skywalking-0.1.0.tgz
```

#### harbor 作为 repo 存储 charts

harbor 目前已经提供了，charts repo 的能力，这样就可以将 docker 镜像和 chart 存储在一个仓库中了，方便维护，具体harbor 的部署方法参考 [Harbor 作为存储仓库存储 chart](https://ipzgo.top/2019-07-26-Helm-3-%E4%BD%BF%E7%94%A8-harbor-%E4%BD%9C%E4%B8%BA%E4%BB%93%E5%BA%93%E5%AD%98%E5%82%A8-charts/)

#### 官方 repo 部署

目前没有发布到官方 repo 中，后续发布完成后，只需要执行下面命令即可

```shell
helm install -n test stable/skywalking
```

### 总结

四种方式都可以进行部署，如果你想要自定义 chart ,需要使用上述两种本地方法及 harbor 存储的方式，以便你修改好 chart 之后进行部署.
