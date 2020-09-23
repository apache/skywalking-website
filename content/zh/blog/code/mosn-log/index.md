---
title: MOSN 源码解析 - log 系统
linkTitle: MOSN 源码解析 - log 系统
date: 2020-03-03
aliases: "/zh/blog/code/mosn-log"
author: "[陈鹏（多点生活）](https://github.com/champly)"
description: "对 MOSN Log系统的源码解析。"
---

本文的目的是分析 MOSN 源码中的`Log系统`。

本文的内容基于 MOSN v0.10.0。

## 概述

MOSN 日志系统分为`日志`和`Metric`两大部分，其中`日志`主要包括`errorlog`和`accesslog`，`Metrics`主要包括`console数据`和`prometheus数据`

## 日志

### errorlog

errorlog 主要是用来记录`MOSN`运行时候的日志信息，[配置结构](https://github.com/mosn/mosn/blob/07cd4afe4d76619fdfbdff858239885f9a358bb2/pkg/config/v2/server.go#L28):

```go
type ServerConfig struct {
......
	DefaultLogPath  string `json:"default_log_path,omitempty"`
	DefaultLogLevel string `json:"default_log_level,omitempty"`
	GlobalLogRoller string `json:"global_log_roller,omitempty"`
......
}
```

初始化 errorlog 包括两个对象`StartLogger`和`DefaultLogger`

- StartLogger 主要用来记录 mosn 启动的日志信息，日志级别是 INFO
- DefaultLogger 主要是用来记录`MOSN`启动之后的运行日志信息，默认和 StartLogger 一样，可以通过配置文件覆盖

[代码如下：](https://github.com/mosn/mosn/blob/07cd4afe4d76619fdfbdff858239885f9a358bb2/pkg/log/logger_manager.go#L37)

```go
func init() {
	......
	// use console as start logger
	StartLogger, _ = GetOrCreateDefaultErrorLogger("", log.INFO) // 默认INFO
	// default as start before Init
	log.DefaultLogger = StartLogger
	DefaultLogger = log.DefaultLogger
	// default proxy logger for test, override after config parsed
	log.DefaultContextLogger, _ = CreateDefaultContextLogger("", log.INFO)
	......
}

......

func InitDefaultLogger(output string, level log.Level) (err error) {
	// 使用配置文件来覆盖默认配置
	DefaultLogger, err = GetOrCreateDefaultErrorLogger(output, level)
	......
}
```

### accesslog

`accesslog` 主要用来记录上下游请求的数据信息，[配置结构](https://github.com/mosn/mosn/blob/07cd4afe4d76619fdfbdff858239885f9a358bb2/pkg/config/v2/server.go#L76):

```go
type AccessLog struct {
	Path   string `json:"log_path,omitempty"`
	Format string `json:"log_format,omitempty"`
}
```

每个配置文件下面 `servers`->`listener`->`access_logs`，具体配置示例如下：

```json
{
	"servers": [
		{
			"mosn_server_name": "mosn_server_1",
			......
			"listeners": [
				{
					"name": "ingress_sofa",
					......
					"log_path": "./logs/ingress.log",
					"log_level": "DEBUG",
					"access_logs": [
						{
							"log_path": "./logs/access_ingress.log",
							"log_format": "%start_time% %request_received_duration% %response_received_duration% %bytes_sent% %bytes_received% %protocol% %response_code% %duration% %response_flag% %response_code% %upstream_local_address% %downstream_local_address% %downstream_remote_address% %upstream_host%"
						}
					]
				}
			]
		}
	]
}
```

accesslog 实现如下[接口](https://github.com/mosn/mosn/blob/07cd4afe4d76619fdfbdff858239885f9a358bb2/pkg/log/accesslog.go#L105):

```go
AccessLog interface {
    // Log write the access info.
    Log(ctx context.Context, reqHeaders HeaderMap, respHeaders HeaderMap, requestInfo RequestInfo)
}
```

调用 Log 记录日志的时候，通过使用 [变量机制](https://mosn.ioblog/code/mosn-variable) 来填充`log_format`里面的变量，相关信息保存在 ctx 里面。用于保存变量信息的 `entries` 通过 `NewAccessLog` 初始化的时候，调用 `parseFormat` 方法来初始化的，[参考相关代码](https://github.com/mosn/mosn/blob/07cd4afe4d76619fdfbdff858239885f9a358bb2/pkg/log/accesslog.go#L79)。

### log 的具体实现

log 的具体实现已经分离到了 [mosn/pkg/log](https://github.com/mosn/pkg/tree/1e4184714e744895968339725cc2dc34f5116dcb/log) 下面，`errorlog` 和 `accesslog` 的具体实现都是通过 [log.GetOrCreateLogger](https://github.com/mosn/pkg/blob/1e4184714e744895968339725cc2dc34f5116dcb/log/logger.go#L122) 来初始化的。当 `roller` 为空的时候使用默认的 `defaultRoller`，默认每天轮转。

```go
defaultRoller = Roller{MaxTime: defaultRotateTime}
......
defaultRotateTime = 24 * 60 * 60
```

#### start

根据不同的输出方式，初始化不同的 `io.Writer` 对象， [详情](https://github.com/mosn/pkg/blob/1e4184714e744895968339725cc2dc34f5116dcb/log/logger.go#L146)

| type                        | io.Writer                                         |
| :-------------------------- | :------------------------------------------------ |
| "", "stderr", "/dev/stderr" | os.Stderr                                         |
| "stdout", "/dev/stdout"     | os.Stdout                                         |
| "syslog"                    | [gsyslog](github.com/hashicorp/go-syslog)本地对象 |
| 其他                        | [gsyslog](github.com/hashicorp/go-syslog)远程对象 |

创建好 log 对象之后，通过 `loggers` 保存起来，避免创建多个对象，`loggers` 是一个 [sync.Map](https://blog.csdn.net/ChamPly/article/details/77622328)对象，是 `golang1.9` 之后加入的一个新的线程安全的 `map`。

`start` 启动之后会 创建一个一直循环读取的协程 `handler`

### handler

[相关代码](https://github.com/mosn/pkg/blob/1e4184714e744895968339725cc2dc34f5116dcb/log/logger.go#L198)

在初始化的时候，创建了一个 500 大小的 `chan` `writeBufferChan`，并且在 `handler` 里面处理需要记录的日志、重命名的事件、关闭的事件。

```go
lg := &Logger{
	output:          output,
	roller:          roller,
	writeBufferChan: make(chan buffer.IoBuffer, 500),
	reopenChan:      make(chan struct{}),
	closeChan:       make(chan struct{}),
	// writer and create will be setted in start()
}

for {
	select {
	case <-l.reopenChan:
	......
	case <-l.closeChan:
	......
	case buf = <-l.writeBufferChan:
	......
	runtime.Gosched()
}
```

#### [reopenChan](https://github.com/mosn/pkg/blob/1e4184714e744895968339725cc2dc34f5116dcb/log/logger.go#L260)

通过重命名文件之后，重新调用 `start` 方法创建新文件，主要使用在文件轮转的时候。`os.Stdout` `os.Stderr` 不支持操作，会报错。

#### closeChan

把当前 `writeBufferChan` 需要写入的数据写入到对象中，然后退出当前协程。

#### writeBufferChan

```go
for i := 0; i < 20; i++ {
	select {
	case b := <-l.writeBufferChan:
		buf.Write(b.Bytes())
		buffer.PutIoBuffer(b)
	default:
		break
	}
}
buf.WriteTo(l)
buffer.PutIoBuffer(buf)
```

当收到第一次写数据的时候不是立刻写入数据到 `log` 对象，而是在等待 20 次读取信息，一起写入到对 `log` 象中，在大量写日志的时候不会导致调用太频繁。如频繁写入文件、频繁调用写日志接口，相反，这会增加内存分配，最好的其实是使用 `writev`，但是 `go runtime` 的 `io` 库没有这个实现。可以采用 [plugin 机制](https://mosn.ioblog/code/mosn-plugin/) 来接管日志的打印，减少 `io` 卡顿对 `go runtime` 的调度影响

\*_当一次循环处理完之后，会调用 `runtime.Gosched()` 主动让出当前协程的 `cpu` 资源_

## Metrics

`Metrics` 是一种规范的度量，分为如下类型，摘抄至 [METRIC TYPES](https://prometheus.io/docs/concepts/metric_types/)

- Gauges: 代表可以任意上下波动的单个数值，通常用来表示测量值。比如内存，cpu，磁盘等信息。
- Counters: 累计度量，代表单调递增的计数器，只有在重启或者重置的时候数量为 0，其他时候一般不使用减少。可以用来表示请求的数量。
- Histograms: 直方图，对观察值(通常是请求持续时间或返回大小之类的数据)进行采样，并将其计数放到对应的配置桶中，也提供所有观测值总和信息。
- Summary: 类似于直方图，摘要采样的观测结果，可以计算滑动时间窗口内的可配置分位数。

主要代码在 `pkg/metrics` 下面包括 `pkg/metrics/sink` 和 `pkg/metrics/shm`。

### sink

`pkg/metrics/sink` 包含 `console` 和 `prometheus`，两者都实现了 [types.MetricsSink](https://github.com/mosn/mosn/blob/07cd4afe4d76619fdfbdff858239885f9a358bb2/pkg/types/metrics.go#L58) 接口。`prometheus` 是通过工厂方法 [注册](https://github.com/mosn/mosn/blob/07cd4afe4d76619fdfbdff858239885f9a358bb2/pkg/metrics/sink/prometheus/prometheus.go#L57) 进去使用的；`console` 是通过直接调用 `console.NewConsoleSink()` 来使用的。

#### prometheus

主要是通过 `prometheus` 的 `metrics` 统计请求的信息，配置文件示例:

```json
{
	"metrics": {
		......
		"sinks": [
			{
				"type": "prometheus",
				"config": {
					"port": 34903
				}
			}
		]
	}
}
```

_其中 `type` 目前只支持 `prometheus`_

通过 [prometheus 库](https://github.com/prometheus/client_golang) 提供的 http 能力，使用配置信息启动一个 http 服务，把 `Metrics` 信息通过 `http://host:port/metrics` 的方式供`prometheus`收集或展示。

#### console

主要用于 `admin api` 的 `/api/v1/stats` [展示](https://github.com/mosn/mosn/blob/07cd4afe4d76619fdfbdff858239885f9a358bb2/pkg/admin/server/server.go#L45)。所以必须配置 `admin` 相关信息，示例：

```json
{
  "admin": {
    "address": {
      "socket_address": {
        "address": "0.0.0.0",
        "port_value": 34901
      }
    }
  }
}
```

如果不配置会打印 `no admin config, no admin api served` 告警信息，[参考](https://github.com/mosn/mosn/blob/07cd4afe4d76619fdfbdff858239885f9a358bb2/pkg/admin/server/server.go#L59)

`admin api` 中还包括如下接口

- /api/v1/config_dump
- /api/v1/stats
- /api/v1/update_loglevel
- /api/v1/enable_log
- /api/v1/disbale_log
- /api/v1/states
- /api/v1/plugin
- /

其中 `update_loglevel` 用于更新 `errorlog` 日志的输出级别，`enable_log` 和 `disbale_log` 用于启用/禁用 `errorlog` 的输出

### shm

`pkg/metrics/shm` 主要是通过 `mmap` 将一个文件或者其它对象映射进内存，让多个进程共用，可以让 `MOSN` 在热升级的过程中 `metrics` 数据不会出现 `"断崖"`，关于 `shm` 的分析内容可以参考 [共享内存模型](https://mosn.ioblog/code/mosn-shm/)。

- **不鼓励在 Go 里面使用共享内存，除非你有明确的使用场景**

## 总结

通过分析 `MOSN` 源码的 `log系统` 模块，不单单是了解了日志部分，从配置、启动流程，到上下游请求都有所涉及。学习了很多，希望 `MOSN` 越来越强大。

---

- [MOSN 源码 v0.10.0](https://github.com/mosn/mosn/tree/v0.10.0)
- [pkg 源码](https://github.com/mosn/pkg/tree/1e4184714e744895968339725cc2dc34f5116dcb) commit 1e41847
