---
title: MOSN 源码解析 - filter扩展机制
linkTitle: MOSN 源码解析 - filter扩展机制
date: 2020-02-09
aliases: "blog/posts/mosn-filter"
author: "[姚昌宇（有米科技）](https://trainyao.github.io)"
description: >
  MOSN 源码解析系列之 filter 扩展机制，如何创建自己的 filter 来扩展 MOSN。
---

本文的内容基于 MOSN v0.9.0。

## 机制

使用过滤器模式来实现扩展是常见的设计模式，MOSN 也是使用了这种方式来构建可扩展性。

MOSN 把过滤器相关的代码放在了 `pkg/filter` 目录下：

```bash
➜  mosn git:(2c6f58c5) ✗ ll pkg/filter
total 24
drwxr-xr-x   8 mac  staff   256 Feb  5 08:52 .
drwxr-xr-x  30 mac  staff   960 Feb  5 08:52 ..
drwxr-xr-x   3 mac  staff    96 Aug 28 22:37 accept
-rw-r--r--   1 mac  staff  2556 Feb  5 08:52 factory.go
-rw-r--r--   1 mac  staff  2813 Feb  5 08:52 factory_test.go
drwxr-xr-x   6 mac  staff   192 Aug 28 22:37 network
drwxr-xr-x   7 mac  staff   224 Aug 28 22:37 stream
-rw-r--r--   1 mac  staff  1248 Feb  5 08:52 types.go
➜  mosn git:(2c6f58c5) ✗
```

包括 `accept` 过程的 filter，`network` 处理过程的 filter，以及 `stream` 处理的 filter。其中 accept filters 目前暂不提供扩展（加载、运行写死在代码里面，如要扩展需要修改源码），
steram、network filters 是可以通过定义新包在 `pkg/filter` 目录下实现扩展。

每一个 filter 包都会有一个 init 函数，拿 `pkg/filter/network/proxy` 包为例：
```bash
...

 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package proxy

import (
    ...
)

func init() {
	filter.RegisterNetwork(v2.DEFAULT_NETWORK_FILTER, CreateProxyFactory)
}

...
```

包被运行时会将 filter 注册到 filter factory 里，在必要时候，注册的回调函数（如例子里的 `CreateProxyFactory`）就会被调用。

## 加载 & 运行 filters

下面来详细看看 filters 被加载和运行的过程。

### 加载

我们可以看看，init 函数注册的回调函数是在什么时机被调用的：

[mosn.io/mosn/pkg/filter/factory.go L57:](https://github.com/mosn/mosn/blob/0.9.0/pkg/filter/factory.go#L57)
```go
...
// CreateNetworkFilterChainFactory creates a StreamFilterChainFactory according to filterType
func CreateNetworkFilterChainFactory(filterType string, config map[string]interface{}) (types.NetworkFilterChainFactory, error) {
	if cf, ok := creatorNetworkFactory[filterType]; ok {
...
```
↓

[mosn.io/mosn/pkg/config/parser.go L372:](https://github.com/mosn/mosn/blob/0.9.0/pkg/config/parser.go#L372)
```go
...
// GetNetworkFilters returns a network filter factory by filter.Type
func GetNetworkFilters(c *v2.FilterChain) []types.NetworkFilterChainFactory {
	var factories []types.NetworkFilterChainFactory
	for _, f := range c.Filters {
		factory, err := filter.CreateNetworkFilterChainFactory(f.Type, f.Config)
...
```

可见，MOSN 在调用 `config.GetNetworkFilters` 会根据`配置信息`中 `filter.Type` 作为名字，在已注册的 filters 中找到需要加载的 filter，并返回 networkFilterChainFactory。
可以看到， `filter.Type` 其实就是 init 函数调用时，包调用 `filter.RegisterNetwork` 函数的第一个参数：filter 名。

那么，配置信息又是从哪里来的呢？

来源1： **配置文件**。

用户可以通过定义 MOSN 的 config.json，MOSN 启动时会根据 listener 指定的 filter 数组进行 filters 的初始化。

[https://github.com/mosn/mosn/blob/0.9.0/pkg/mosn/starter.go#L173](https://github.com/mosn/mosn/blob/0.9.0/pkg/mosn/starter.go#L173)
```go
func NewMosn(c *config.MOSNConfig) *Mosn {
    ...
  
    var nfcf []types.NetworkFilterChainFactory
  	var sfcf []types.StreamFilterChainFactory
  
    // Note: as we use fasthttp and net/http2.0, the IO we created in mosn should be disabled
    // network filters
  	if !lc.UseOriginalDst {
  	    // network and stream filters
        nfcf = config.GetNetworkFilters(&lc.FilterChains[0])
  		sfcf = config.GetStreamFilters(lc.StreamFilters)

    ...
```

来源2：**XDS 信息解析**。

MOSN 里的 XDS client 会将 XDS resources 解析成 MOSN 的 config，当 downstream client 连接进来的时候根据 config 进行组装需要用到的 filters。
    
[https://github.com/mosn/mosn/blob/0.9.0/pkg/xds/conv/update.go#L71](https://github.com/mosn/mosn/blob/0.9.0/pkg/xds/conv/update.go#L71)
```go
// ConvertAddOrUpdateListeners converts listener configuration, used to  add or update listeners
func ConvertAddOrUpdateListeners(listeners []*envoy_api_v2.Listener) {
...
		var streamFilters []types.StreamFilterChainFactory
		var networkFilters []types.NetworkFilterChainFactory

		if !mosnListener.UseOriginalDst {
			for _, filterChain := range mosnListener.FilterChains {
				nf := config.GetNetworkFilters(&filterChain)
				networkFilters = append(networkFilters, nf...)
			}
			streamFilters = config.GetStreamFilters(mosnListener.StreamFilters)
...
```

所以，filters 的配置主要是来源于配置文件。

### 运行

filters 的配置是在 listener 之下的，配置解析会将每个 listener 配置声明要用到的 filters 初始化到 listener 实例里，在连接 accept 以及处理过程中，调用上文的函数初始化 filters 并调用。

MOSN 会将连接的上下文信息放在 context 内传给 filter，并将 stream 传给 filter。下面是代码流程：

(1) 连接 accept：

[https://github.com/mosn/mosn/blob/0.9.0/pkg/server/handler.go#L394](https://github.com/mosn/mosn/blob/0.9.0/pkg/server/handler.go#L394)
```go
func (al *activeListener) OnAccept(rawc net.Conn, useOriginalDst bool, oriRemoteAddr net.Addr, ch chan types.Connection, buf []byte) {
...
arc.ContinueFilterChain(ctx, true)
```

(2) 将连接上下文放入 context，并用以创建 filter chain，并初始化 filter manager，执行 filters 的 `OnNewConnection` 函数。
filter manager 是 filters 的代理，外部会在不同阶段调用 filter manager 的不同函数，filter manager 管理 filters 的执行逻辑：

[https://github.com/mosn/mosn/blob/0.9.0/pkg/server/handler.go#L394](https://github.com/mosn/mosn/blob/0.9.0/pkg/server/handler.go#L394)

```go
func (al *activeListener) OnAccept(rawc net.Conn, useOriginalDst bool, oriRemoteAddr net.Addr, ch chan types.Connection, buf []byte) {
    ...
   
    ctx := mosnctx.WithValue(context.Background(), types.ContextKeyListenerPort, al.listenPort)
    ctx = mosnctx.WithValue(ctx, types.ContextKeyListenerType, al.listener.Config().Type)
    ctx = mosnctx.WithValue(ctx, types.ContextKeyListenerName, al.listener.Name())
    ctx = mosnctx.WithValue(ctx, types.ContextKeyNetworkFilterChainFactories, al.networkFiltersFactories)
    ctx = mosnctx.WithValue(ctx, types.ContextKeyStreamFilterChainFactories, &al.streamFiltersFactoriesStore)
    ctx = mosnctx.WithValue(ctx, types.ContextKeyAccessLogs, al.accessLogs)
    if rawf != nil {
       ctx = mosnctx.WithValue(ctx, types.ContextKeyConnectionFd, rawf)
    }
    if ch != nil {
       ctx = mosnctx.WithValue(ctx, types.ContextKeyAcceptChan, ch)
       ctx = mosnctx.WithValue(ctx, types.ContextKeyAcceptBuffer, buf)
    }
    if oriRemoteAddr != nil {
       ctx = mosnctx.WithValue(ctx, types.ContextOriRemoteAddr, oriRemoteAddr)
    }
    ...
    
```
↓

[https://github.com/mosn/mosn/blob/0.9.0/pkg/server/handler.go#L454](https://github.com/mosn/mosn/blob/0.9.0/pkg/server/handler.go#L454)
```go
func (al *activeListener) OnNewConnection(ctx context.Context, conn types.Connection) {
    //Register Proxy's Filter
    filterManager := conn.FilterManager()
    for _, nfcf := range al.networkFiltersFactories {
    nfcf.CreateFilterChain(ctx, al.handler.clusterManager, filterManager)
    }
    filterManager.InitializeReadFilters()
...
```

(3) 执行 filter 的 `OnData` 方法
    
[https://github.com/mosn/mosn/blob/0.9.0/pkg/network/connection.go#L428](https://github.com/mosn/mosn/blob/0.9.0/pkg/network/connection.go#L428) ->

[https://github.com/mosn/mosn/blob/0.9.0/pkg/network/connection.go#L484](https://github.com/mosn/mosn/blob/0.9.0/pkg/network/connection.go#L484)

```go
func (c *connection) doRead() (err error) {
    ...
    c.onRead()
    ...

func (c *connection) onRead() {
    ...
    c.filterManager.OnRead()
```

至此，filter 就实现了对连接的干预，filter 就像中间件，可以返回 [type.Continue](https://github.com/mosn/mosn/blob/0.9.0/pkg/types/network.go#L148) 控制连接继续进行，
也可以返回 [type.Stop](https://github.com/mosn/mosn/blob/0.9.0/pkg/types/network.go#L149) 停止连接继续处理。即可以对连接内容进行干预，比如在 static response 的场景，
返回既定的 response 内容；也可以对连接处理流程进行干预，比如在 fault injection 的场景，增加连接延时，等等。  

## MOSN 实现了的 filters

根据文件目录我们可以看出 MOSN 目前实现了哪些 filter：

```text

➜  mosn git:(2c6f58c5) ✗ ll pkg/filter/network
total 0
drwxr-xr-x   7 mac  staff  224 Aug 28 22:37 .
drwxr-xr-x   8 mac  staff  256 Feb  9 15:49 ..
drwxr-xr-x  3 mac  staff   96 Feb  8 10:35 connectionmanager // 连接管理
drwxr-xr-x  4 mac  staff  128 Feb  5 08:52 faultinject // 错误注入相关
drwxr-xr-x  3 mac  staff   96 Feb  9 12:37 proxy // 代理逻辑, 这个 filter 目前是 MONS 里的逻辑一部分, 负责将 stream 发送到 serverStream, 开启流量的代理
drwxr-xr-x  6 mac  staff  192 Feb  5 08:52 tcpproxy // tcp 代理逻辑

➜  mosn git:(2c6f58c5) ✗ ll pkg/filter/stream
total 0
drwxr-xr-x   7 mac  staff  224 Aug 28 22:37 .
drwxr-xr-x   8 mac  staff  256 Feb  9 15:49 ..
drwxr-xr-x  11 mac  staff  352 Feb  5 08:52 commonrule // stream filter 逻辑公共部分, rule engine 等等
drwxr-xr-x   6 mac  staff  192 Feb  5 08:52 faultinject // 错误注入相关
drwxr-xr-x   3 mac  staff   96 Aug 28 22:37 healthcheck // upstream 健康检查相关
drwxr-xr-x   3 mac  staff   96 Feb  5 08:52 mixer // mixer 逻辑相关
drwxr-xr-x   4 mac  staff  128 Feb  5 08:52 payloadlimit // 限流相关
```

具体每个 filter 的逻辑都可以根据下述的 filter 结构，进行代码跟读和调试，分别理解每个 filter 的作用。

## filter 包含的内容 & 如何扩展 MOSN filters

一个 filter 包含以下内容：

1. init 函数，register 创建 filter manager 的回调函数
1. 回调函数需要返回一个实现了 `types.NetworkFilterChainFactory` 接口的 struct
1. 该 struct 的 `CreateFilterChain` 方法创建具体逻辑的实例，并调用 `callback` 参数的 `addReadFilter` | `addWriteFilter` 函数，进行 filter 注入到 filter manager
1. 具体的业务逻辑

由此可见，通过 filter 机制扩展 MOSN，我们只需实现上述 4 样东西，与 MOSN 一同编译。再通过适当的 config 内容配置，或者与 XDS server 协作并生成含有你扩展的 filter 名及配置
（这部分需要修改 MOSN 源码，MOSN 与 XDS server 交互并生成 config，选用哪些 filter 目前是写死在代码里的），MOSN 就会在适当时候加载并运行你的 filter，对代理流量进行干预。

## 总结

本文通过分析 MOSN 源码，简述了 MOSN 的filter扩展机制，并简述了实现自己的 filter 需要做的东西。大家可以通过该机制，使用 MONS 轻松 cover 自己具体的使用场景。

---

参考资料:

- [MOSN 源码](https://github.com/mosn/mosn)
