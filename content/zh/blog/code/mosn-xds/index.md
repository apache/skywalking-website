---
title: MOSN 源码解析 - XDS
linkTitle: MOSN 源码解析 - xDS
date: 2020-02-13
aliases: "blog/posts/mosn-xds"
author: "[孙福泽（Boss 直聘）](https://github.com/peacocktrain)"
description: >
  MOSN 源码解析之 XDS 模块。
---

本文的内容基于 MOSN v0.9.0。

XDS用来与pilot-discovery通讯做服务发现功能。

XDS是一类发现服务的总称，包含LDS， RDS， CDS， EDS以及SDS。

MOSN通过XDS API可以动态获取Listener（监听器），Route（路由）， Cluster（集群）， Endpoint（集群成员）以及Secret（证书）配置。

XDS的基本流程：Pilot-Discovery的Model -> XDS.pb -> GRPC -> XDS.pb -> MOSN的Model （GRPC包括序列化和网络传输）。

## 配置文件&解析

if len(DynamicResources) > 0 && len(StaticResources) > 0 进入XDS模式。

XDS模式下的MOSN配置文件mosn_config.json:
```json
{
  "dynamic_resources": {
    "lds_config": {
      "ads": {}
    },
    "cds_config": {
      "ads": {}
    },
    "ads_config": {
      "api_type": "GRPC",
      "cluster_names": ["xxx"],
      "grpc_services": [
        {
          "envoy_grpc": {
            "cluster_name": "xds-grpc"
          }
        }
      ]
    }
  },
  "static_resources": {
    "clusters": [
      {
        "name": "xds-grpc",
        "type": "STRICT_DNS",
        "lb_policy": "RANDOM",
        "hosts": [
          {
            "socket_address": {"address": "istio-pilot.istio-system.svc.boss.twl", "port_value": 15010}
          }
        ],
        "http2_protocol_options": { }
      }
    ]
  }
}
```

解析配置文件构建XDSConfig（XDS客户端的配置）。

构建adsClient（XDS客户端）。

```go
func (c *Client) Start(config *config.MOSNConfig) error {
	log.DefaultLogger.Infof("xds client start")

    //解析配置文件
	dynamicResources, staticResources, err := UnmarshalResources(config)
	if err != nil {
		log.DefaultLogger.Warnf("fail to unmarshal xds resources, skip xds: %v", err)
		return errors.New("fail to unmarshal xds resources")
	}
    
    //构建xdsConfig
	xdsConfig := v2.XDSConfig{}
	err = xdsConfig.Init(dynamicResources, staticResources)
	if err != nil {
		log.DefaultLogger.Warnf("fail to init xds config, skip xds: %v", err)
		return errors.New("fail to init xds config")
	}

    //构建adsCLient
	stopChan := make(chan int)
	sendControlChan := make(chan int)
	recvControlChan := make(chan int)
	adsClient := &v2.ADSClient{
		AdsConfig:         xdsConfig.ADSConfig,
		StreamClientMutex: sync.RWMutex{},
		StreamClient:      nil,
		MosnConfig:        config,
		SendControlChan:   sendControlChan,
		RecvControlChan:   recvControlChan,
		StopChan:          stopChan,
	}
	adsClient.Start()
	c.adsClient = adsClient
	return nil
}
```



## 初始化和启动xds连接
adsClient.start() 
```go
func (adsClient *ADSClient) Start() {
    //构建grpc双向流连接。
	adsClient.StreamClient = adsClient.AdsConfig.GetStreamClient()
	utils.GoWithRecover(func() {
        //认证和开启xds传输，并且设置定时重传
		adsClient.sendThread()
	}, nil)
	utils.GoWithRecover(func() {
        //接受下发数据，并根据类型选择不同的handler处理
		adsClient.receiveThread()
	}, nil)
}
```
函数细节：
[https://github.com/mosn/mosn/blob/master/pkg/xds/v2/adssubscriber.go](https://github.com/mosn/mosn/blob/master/pkg/xds/v2/adssubscriber.go)


## XDS消息处理和发送

四种类型处理器注册。

```go
func init() {
	RegisterTypeURLHandleFunc(EnvoyListener, HandleEnvoyListener)
	RegisterTypeURLHandleFunc(EnvoyCluster, HandleEnvoyCluster)
	RegisterTypeURLHandleFunc(EnvoyClusterLoadAssignment, HandleEnvoyClusterLoadAssignment)
	RegisterTypeURLHandleFunc(EnvoyRouteConfiguration, HandleEnvoyRouteConfiguration)
}
```

接受数据类型，将XDS类型转换成MOSN数据类型，并且加入对应的manager。

以HandlerListener为例：
```go
func HandleEnvoyListener(client *ADSClient, resp *envoy_api_v2.DiscoveryResponse) {
	log.DefaultLogger.Tracef("get lds resp,handle it")
    //解析返回消息，生成envoy_listener
	listeners := client.handleListenersResp(resp)
	log.DefaultLogger.Infof("get %d listeners from LDS", len(listeners))
    //转换envoy_listener为mosn_listener，并且加入ListenerAdapter
	conv.ConvertAddOrUpdateListeners(listeners)
	if err := client.reqRoutes(client.StreamClient); err != nil {
		log.DefaultLogger.Warnf("send thread request rds fail!auto retry next period")
	}
}
```
函数细节：
[https://github.com/mosn/mosn/blob/master/pkg/xds/v2/default_handler.go](https://github.com/mosn/mosn/blob/master/pkg/xds/v2/default_handler.go)


请求与处理流程简单所示，也可接受pilot-discovery的推送：

```
switch(type):
  case: cluster:
    接收cluster返回，根据clusterName请求Endpoints
  case: endpoint:
    接收Endpoints，请求Listener
  case: listener
    接受Listener，请求Routes
  case: router
    接受Routes
       
```



## XDS类型转换

XDS.pd数据结构类型在：
[https://github.com/envoyproxy/go-control-plane](https://github.com/envoyproxy/go-control-plane)

收到数据并反序列化为XDS的Model之后，进行结构体转换。

类型转换代码如下： 
[https://github.com/mosn/mosn/blob/master/pkg/xds/conv/convertxds.go](https://github.com/mosn/mosn/blob/master/pkg/xds/conv/convertxds.go)


