---
title: 如何使用 SkyWalking Agent ？
date: 2019-08-30
author: innerpeacez
description: 本文将教你如何在 docker 或者 kubernetes 使用Skywalking Agent。
zh_tags:
- User Manual
---

> - 作者：innerpeacez
> - [原文地址](<https://ipzgo.top/2019-08-30-%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8-Skywalking-Agent/>)

如果你还不知道 Skywalking agent 是什么，[请点击这里查看 Probe](https://github.com/apache/skywalking/blob/master/docs/en/concepts-and-designs/README.md) 或者[这里查看快速了解agent](https://github.com/apache/skywalking/blob/master/docs/en/setup/service-agent/java-agent/README.md),由于我这边大部分都是 JAVA 服务，所以下文以 Java 中使用 agent 为例，提供了以下三种方式供你选择

#### 三种方式：

- 使用官方提供的基础镜像
- 将 agent 包构建到已经存在的基础镜像中
- sidecar 模式挂载 agent

##### 1.使用官方提供的基础镜像

查看官方 docker hub 提供的[基础镜像](https://hub.docker.com/r/apache/skywalking-base)，只需要在你构建服务镜像是 From 这个镜像即可，直接集成到 Jenkins 中可以更加方便

##### 2.将 agent 包构建到已经存在的基础镜像中

提供这种方式的原因是：官方的镜像属于精简镜像，并且是 openjdk ，可能很多命令没有，需要自己二次安装，以下是我构建的过程

- 下载 oracle jdk 

  这个现在 oracle 有点恶心了，wget 各种不行，然后我放弃了，直接从[官网](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)下载了

- 下载 skywalking [官方发行包](https://www.apache.org/dyn/closer.cgi/skywalking/6.3.0/apache-skywalking-apm-6.3.0.tar.gz)，并解压（以6.3.0为例）

  ```shell
  wget https://www.apache.org/dyn/closer.cgi/skywalking/6.3.0/apache-skywalking-apm-6.3.0.tar.gz && tar -zxvf apache-skywalking-apm-6.3.0.tar.gz
  ```

- 通过以下 dockerfile 构建基础镜像

  ```dockerfile
  FROM alpine:3.8 
  
  ENV LANG=C.UTF-8
  
  RUN set -eux && \
  	apk update && apk upgrade && \
  	wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub &&\
          wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.30-r0/glibc-2.30-r0.apk &&\
          apk --no-cache add unzip vim curl git bash ca-certificates glibc-2.30-r0.apk file && \
  	rm -rf /var/lib/apk/* &&\
          mkdir -p /usr/skywalking/agent/
  
  # A streamlined jre
  ADD jdk1.8.0_221/ /usr/java/jdk1.8.0_221/
  ADD apache-skywalking-apm-bin/agent/ /usr/skywalking/agent/
  
  # set env
  ENV JAVA_HOME /usr/java/jdk1.8.0_221
  ENV PATH ${PATH}:${JAVA_HOME}/bin
  
  # run container with base path:/
  WORKDIR /
  
  CMD bash
  ```

这里由于 alpine 是基于mini lib 的，但是 java 需要 glibc ,所以加入了 glibc 相关的东西，最后构建出的镜像大小在 490M 左右，因为加了挺多命令还是有点大，仅供参考，同样构建出的镜像也可以直接配置到 jenkins 中。

##### 3.sidecar 模式挂载 agent

如果你们的服务是部署在 Kubernetes 中，你还可以使用这种方式来使用 Skywalking Agent ,这种方式的好处在与不需要修改原来的基础镜像，也不用重新构建新的服务镜像，而是以sidecar 模式，通过共享volume的方式将agent 所需的相关文件挂载到已经存在的服务镜像中

**构建 skywalking agent sidecar 镜像的方法**

- 下载skywalking [官方发行包](https://www.apache.org/dyn/closer.cgi/skywalking/6.3.0/apache-skywalking-apm-6.3.0.tar.gz)，并解压

  ```shell
  wget https://www.apache.org/dyn/closer.cgi/skywalking/6.3.0/apache-skywalking-apm-6.3.0.tar.gz && tar -zxvf apache-skywalking-apm-6.3.0.tar.gz
  ```

- 通过以下 dockerfile 进行构建

  ```dockerfile
  FROM busybox:latest 
  
  ENV LANG=C.UTF-8
  
  RUN set -eux && mkdir -p /usr/skywalking/agent/
  
  ADD apache-skywalking-apm-bin/agent/ /usr/skywalking/agent/
  
  WORKDIR /
  ```

注意：这里我没有在dockerfile中下载skywalking 发行包是因为保证构建出的 sidecar 镜像保持最小，bosybox 只有700 k左右，加上 agent 最后大小小于20M

**如何使用 sidecar 呢？**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    name: demo-sw
  name: demo-sw
spec:
  replicas: 1
  selector:
    matchLabels:
      name: demo-sw
  template:
    metadata:
      labels:
        name: demo-sw
    spec:
      initContainers:
      - image: innerpeacez/sw-agent-sidecar:latest
        name: sw-agent-sidecar
        imagePullPolicy: IfNotPresent
        command: ['sh']
        args: ['-c','mkdir -p /skywalking/agent && cp -r /usr/skywalking/agent/* /skywalking/agent']
        volumeMounts:
        - mountPath: /skywalking/agent
          name: sw-agent
      containers:
      - image: nginx:1.7.9
        name: nginx
        volumeMounts:
        - mountPath: /usr/skywalking/agent
          name: sw-agent
        ports:
        - containerPort: 80
      volumes:
      - name: sw-agent
        emptyDir: {}
```

以上是挂载 sidecar 的 deployment.yaml 文件，以nginx 作为服务为例，主要是通过共享 volume 的方式挂载 agent，首先 initContainers 通过 sw-agent 卷挂载了 sw-agent-sidecar 中的 /skywalking/agent ，并且将上面构建好的镜像中的 agent 目录 cp 到了 /skywalking/agent 目录，完成之后 nginx 启动时也挂载了 sw-agent 卷，并将其挂载到了容器的 /usr/skywalking/agent 目录，这样就完成了共享过程。

#### 总结

这样除去 ServiceMesh 以外，我能想到的方式就介绍完了，希望可以帮助到你。最后给 [Skywalking 一个 Star 吧](https://github.com/apache/skywalking)，国人的骄傲。

