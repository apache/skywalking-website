---
title: SkyWalking 使用 ElasticSearch 存储的优化
date: 2019-11-07
author: langyan1022
description: SkyWalking 使用 ElasticSearch 存储的优化。
---

PS：本文仅仅是在我的测试环境实验过，如果有问题，请自行优化调整

前记：记得skywlking还是6.0版本的时候我就在试用，当时是skywalking基本在两三天左右就会监控数据完全查不出来，elasticsearch日志报错，由于当时也算是初用es，主要用来日志收集，并且时间有限，没有继续深入研究，最近空闲，更新到最新的6.5.0(开发版本)还是会出现同样的问题，下定决心解决下，于是有了本文的浅知拙见

### 本次调优环境

skywalking: 6.5.0
elasticsearch:6.3.2(下文用es代替)

### 调优过程

1. 当然是百度了，百度后其实翻来翻去就找到一个相关的文章https://my.oschina.net/keking/blog/3025303 ，参考之。
2. 调整skywalking的这两个参数试试
   `bulkActions: 4000 # Execute the bulk every 2000 requests`
   ` bulkSize: 60 # flush the bulk every 20mb`
    然后es还是继续挂，继续频繁的重启

3. 继续看这个文章，发现了另外一篇https://www.easyice.cn/archives/207 ，继续参考之
4. 这篇文章发现每一个字我都认识，看起来也能懂，但是对于es小白的我来说，着实不知道怎么调整这些参数，姑且先加到es的配置文件里边试试看吧，于是就加了，然后重启es的时候说发现index参数配置，自从5.0之后就不支持这样配置了，还给调了个es的接口去设置，但是设置失败（真够不错的），朝着这个思路去百度，百度到快放弃，后来就寻思，再试试看吧，（百度的结果是知道了index有静态参数和动态参数，动态的参数是可以随时设置，静态的只能创建或者关闭状态的索引才可以设置）
   然鹅并不知道怎么关闭索引，继续百度，（怎么全特么百度，好吧不百度了，直接来干货）
    * 关闭索引（我的skywalking索引命名空间是dry_trace）
      `curl -XPOST  "http://localhost:9200/dry_trace*/_close"`
    * 设置参数
      ```
      curl -XPUT 'http://localhost:9200/dry_trace*/_settings?preserve_existing=true' -H 'Content-type:application/json' -d '{  
      "index.refresh_interval" : "10s",  
      "index.translog.durability" : "async",  
      "index.translog.flush_threshold_size" : "1024mb",  
      "index.translog.sync_interval" : "120s"  
      }'
      ```
   * 打开索引
        `curl -XPOST  "http://localhost:9200/dry_trace*/_open"`
5. 还有一点，第四步的方式只适用于现有的索引设置，那么新的索引设置呢，总不能每天重复下第四步吧。当然不需要，来干货
   首先登陆kinaba控制台找到开发工具
   贴入以下代码
    ```
    PUT /_template/dry_trace_tmp 
   {
   "index_patterns": "dry_trace*",
   "order": 1,
   "settings": {
   	"index": {
   		"refresh_interval": "30s",
   		"translog": {
   			"flush_threshold_size": "1GB",
   			"sync_interval": "60s",
   			"durability": "async"
   		}
   	}
   }
   }
   ```

6. 截止目前为止运行一周，还未发现挂掉，一切看起来正常

****


### 完结---

于 2019年11月
