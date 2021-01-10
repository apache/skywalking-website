---
title: 关于 ElastiSsearch 因 basic 认证导致 SkyWalking 无法正常调用接口问题
date: 2019-01-02
author: 刘离勇
description: ElasticSearch basic 验证。
zh_tags:
- User Manual
- ElasticSearch
---

SkyWalking 依赖 elasticsearch 集群，如果 elasticsearch 安装有 x-pack 插件的话，那么就会存在一个 Basic 认证，导致 skywalking 无法调用 elasticsearch, 解决方法是使用 nginx 做代理，让 nginx 来做这个 Basic 认证，那么这个问题就自然解决了。

方法如下:

1. 安装 nginx

> yum install -y nginx

2. 配置 nginx

```xml
server {
        listen       9200 default_server;
        server_name  _;
        
        location / {
                 proxy_set_header Host $host;
                 proxy_set_header X-Real-IP $remote_addr;
                 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                 proxy_pass http://localhost:9200;
                 #Basic字符串就是使用你的用户名(admin),密码(12345)编码后的值
                 #注意:在进行Basic加密的时候要使用如下格式如:admin:123456 注意中间有个冒号
                 proxy_set_header Authorization "Basic YWRtaW4gMTIzNDU2";
        }
    }
```

3. 验证

> curl localhost:9200

```xml
{
  "name" : "Yd0rCp9",
  "cluster_name" : "es-cn-4590xv9md0009doky",
  "cluster_uuid" : "jAPLrqY5R6KWWgHnGCWOAA",
  "version" : {
    "number" : "6.3.2",
    "build_flavor" : "default",
    "build_type" : "tar",
    "build_hash" : "053779d",
    "build_date" : "2018-07-20T05:20:23.451332Z",
    "build_snapshot" : false,
    "lucene_version" : "7.3.1",
    "minimum_wire_compatibility_version" : "5.6.0",
    "minimum_index_compatibility_version" : "5.0.0"
  },
  "tagline" : "You Know, for Search"
}
```

看到如上结果那么恭喜你成功了。
