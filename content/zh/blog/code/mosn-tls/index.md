---
title: MOSN 源码解析 - TLS
linkTitle: MOSN 源码解析 - TLS
date: 2020-04-26
author: "[永鹏](https://github.com/nejisama)"
description: "MOSN TLS 能力解析。"
aliases: "/zh/blog/code/mosn-tls"
---

本文基于的内容是 MOSN v0.12.0。

### 概述

MOSN 提供了基于 TLS 加密的安全通信的能力，本文主要从三个方面介绍 MOSN 的 TLS 相关实现，包括：MOSN 作为服务端提供 TLS 的能力、MOSN 作为客户端提供 TLS 的能力，以及 TLS 模块的实现。关于 TLS 的配置，可以参考配置文件说明的文档。


### 服务端 (Listener)

MOSN 作为服务端的时候，就是有请求发送到 MOSN，基于 MOSN 的 Listener 处理请求。Listener 做配置解析的时候，如果存在 TLS 相关的配置，会尝试生成一个 TLSManager，在连接建立的时候，会根据 TLSManager 返回的状态判断是否需要建立 TLS 加密连接，代码如下：

```Go
func newActiveListener(lc *v2.Listener, ...) (*activeListener, error) { // 其他参数省略
    ... // 省略
  mgr, err := mtls.NewTLSServerContextManager(lc)
  if err != nil {
    return nil,err
  }
  al.tlsMng = mgr
  return al, nil
}
```

```Go
func (al *activeListener) OnAccept(rawc net.Conn, ch chan api.Connection, ...) { // 其他参数省略
    ...// 省略
    // if ch is not nil, the conn has been initialized in func transferNewConn
    if al.tlsMng != nil && ch == nil {
        conn, err := al.tlsMng.Conn(rawc)
        if err != nil {
            rawc.Close()
            return
        }
        rawc = conn
    }
    arc := newActiveRawConn(rawc, al)
    ...// 省略
}
```

判断是否需要建立 TLS 连接会基于 TLSManager 的状态。

- 如果 TLSManager 是关闭 TLS 状态，则一定不支持 TLS 连接。
- 如果 TLSManager 是开启 TLS 状态，还需要额外判断是否支持 Inspector 模式，如果支持 Inspector，则说明 MOSN 的 Listener 可以同时处理 TLS 加密连接和明文的非加密连接；此时 MOSN 会等待连接上收到的第一个数据，判断请求是明文还是 TLS，从而决定使用连接状态。如果不支持 Inspector 模式，那么就只支持 TLS 连接。

判断是否兼容 Inspector 的逻辑如下。MOSN 会在建立上执行`Peek`，尝试获取连接上第一个数据字节，如果是 0x16（来自 TLS 握手的 Client Hello 的第一个字节），则判断为 TLS 连接，否则判断为明文连接。

```Go
func (mng *serverContextManager) Conn(c net.Conn) (net.Conn, error) {
        if _, ok := c.(*net.TCPConn); !ok {
                return c, nil
        }
        if !mng.Enabled() {
                return c, nil
        }
        if !mng.inspector {
                return &TLSConn{
                        tls.Server(c, mng.config.Clone()),
                }, nil
        }
        // inspector
        conn := &Conn{
                Conn: c,
        }
        buf, err := conn.Peek()
        if err != nil {
                return nil, err
        }
        switch buf[0] {
        // TLS handshake
        case 0x16:
                return &TLSConn{
                        tls.Server(conn, mng.config.Clone()),
                }, nil
        // Non TLS
        default:
                return conn, nil
        }
}
```

除了普通的 TLS 以外，MOSN 还支持双向 TLS，即 Server 端要求 Client 端也提供证书，也是可以配置不同的兼容场景，包括：

- Client 必须提供 TLS 证书，完成双向 TLS 加密。
- 要求 Client 提供 TLS 证书，但是如果 Client 没有提供证书，也可以兼容执行普通的 TLS 加密逻辑实现如下。

```Go
func (ctx *tlsContext) setServerConfig(tmpl tls.Config, cfg *v2.TLSConfig, hooks ConfigHooks) {
        tlsConfig := &tmpl
        // no certificate should be set no server tls config
        if len(tlsConfig.Certificates) == 0 {
                return
        }
        if !cfg.RequireClientCert {
                tlsConfig.ClientAuth = tls.NoClientCert
        } else {
                if cfg.VerifyClient {
                        tlsConfig.ClientAuth = tls.RequireAndVerifyClientCert
                } else {
                        tlsConfig.ClientAuth = tls.VerifyClientCertIfGiven
                }
        }
        tlsConfig.VerifyPeerCertificate = hooks.ServerHandshakeVerify(tlsConfig)
        ctx.server = tlsConfig
        // build matches
        ctx.buildMatch()
}
```

### 客户端 (Cluster)

MOSN 作为客户端的时候，就是 MOSN 在把请求向后端（Upstream）转发的时候，基于 MOSN 的 Cluster 配置转发请求。在 Cluster 配置解析的时候，如果存在 TLS 相关的配置，会尝试生成一个 TLSManager。在转发请求向后端建立连接的时候，会基于两个维度判断是否要建立 TLS 连接。

- 首先判断建立连接的 Host 配置是否允许建立 TLS 连接，这个是考虑到有的场景特定的 Host 不希望建立 TLS 连接或者不支持 TLS 连接进行的设计。默认配置情况下，Host 配置都是允许建立 TLS 连接的。
- 在 Host 允许建立 TLS 的情况下，会根据 TLSManager 的状态，判断是否要建立 TLS 连接。

```Go
func newSimpleCluster(clusterConfig v2.Cluster) *simpleCluster {
    ... // 省略
    mgr, err := mtls.NewTLSClientContextManager(&clusterConfig.TLS)
    if err != nil {
       // 日志记录，此时 Cluster 还可以正常创建，等同于不支持 TLS
    }
    info.tlsMng = mgr
    cluster := &simpleCluster{
        info: info,
    }
    ... //
    return cluster
}
```

```Go
func (sh *simpleHost) CreateConnection(context context.Context) types.CreateConnectionData {
    var tlsMng types.TLSContextManager
    if sh.SupportTLS() {
         tlsMng = sh.clusterInfo.TLSMng()
    }
    clientConn := network.NewClientConnection(nil, sh.clusterInfo.ConnectTimeout(), tlsMng, sh.Address(), nil)
    ... // 省略
}
```

### TLS 模块

MOSN 的 TLS 能力，都通过 TLSManager 提供，TLSManager 分为 ServerManager 和 ClientManager，分别有各自的逻辑，其核心都是通过 Conn 方法，利用 Provider 提供`tls.Config`，建立 TLS 连接。

#### provider

provider 是 MOSN 的 TLS 模块中提供 TLS 运行时配置的模块，支持静态配置模式`staticProvider`和动态 SDS 模式`sdsProvider`。无论是哪种模式，provider 中最终存储的对象都是 MOSN 定义的`tlsContext`。

MOSN 在进行配置解析时，会判断使用哪种模式，然后基于不同的情况解析出 `tlsContext`。同时需要说明的是，静态模式只是区别于动态 SDS 模式的一种模式，通过 TLS 的扩展，我们也可以做到静态模式下，让证书动态获取，这一点在后文中会进行介绍。

```Go
func NewProvider(cfg *v2.TLSConfig) (types.TLSProvider, error) {
    if !cfg.Status { // 未开启 TLS
        return nil,nil
    }
    if cfg.SdsConfig != nil { // 动态 SDS 模式
        ... // 省略
        return getOrCreateProvider(cfg), nil
    } else { // 静态配置模式
        ctx, err := newTLSContext(cfg, secret)
        ... // 省略
    }
}
```

#### tlsContext

`tlsContext`是 MOSN 中 TLS 运行时的基础单元，主要功能是负责提供 MOSN 运行时所需要的`tls.Config`。其定义与方法如下。

```Go
type tlsContext struct {
        serverName string
        ticket     string
        matches    map[string]struct{}
        client     *tls.Config
        server     *tls.Config
}
func (ctx *tlsContext) buildMatch() {}
func (ctx *tlsContext) setServerConfig(tmpl tls.Config, cfg *v2.TLSConfig, hooks ConfigHooks) {}
func (ctx *tlsContext) setClientConfig(tmpl tls.Config, cfg *v2.TLSConfig, hooks ConfigHooks) {}
func (ctx *tlsContext) MatchedServerName(sn string) bool {}
func (ctx *tlsContext) MatchedALPN(protos []string) bool {}
func (ctx *tlsContext) GetTLSConfig(client bool) *tls.Config {}
```

基于 TLS 的配置，通过`newTLSContext`生成`tlsContext`，随后在 TLSManager 中通过`MatchedServerName`和`MatchedALPN`判断是否要选择该`tlsContext`，最后通过`GetTLSConfig`提供`tls.Config`建立 TLS 连接。

```Go
func newTLSContext(cfg *v2.TLSConfig, secret *secretInfo) (*tlsContext, error) {
    ... // 省略
    // extension config
    factory := getFactory(cfg.Type)
    hooks := factory.CreateConfigHooks(cfg.ExtendVerify)
    // pool can be nil, if it is nil, TLS uses the host's root CA set.
    pool, err := hooks.GetX509Pool(secret.Validation)
    if err != nil {
        return nil, err
    }
    tmpl.RootCAs = pool
    tmpl.ClientCAs = pool
    // set tls context
    ctx := &tlsContext{
        serverName: cfg.ServerName,
        ticket:     cfg.Ticket,
    }
    cert, err := hooks.GetCertificate(secret.Certificate, secret.PrivateKey)
    ... // 省略
    // needs copy template config
    if len(tmpl.Certificates) > 0 {
        ctx.setServerConfig(*tmpl, cfg, hooks)
    }
    ctx.setClientConfig(*tmpl, cfg, hooks)
    return ctx, nil
}
```

`secretInfo`包含了可以获取完整的 TLS 证书信息的内容，完整的证书信息包括证书、私钥、以及签发证书的 CA 信息。通常情况下，secretInfo 就是完整的 TLS 证书信息，在有 tls 扩展的场景，则是利用`secretInfo`通过扩展实现进行获取。代码中通过`getFactory`获取到的`hooks`就是扩展实现，在没有扩展的时候，返回的就是默认的`hooks`。

动态 SDS 模式下，当 MOSN 收到来自 SDS 服务端的信息以后，也是通过调用`newTLSContext`生成`tlsContext`提供 TLS 能力。

#### TLS 扩展

考虑到一些 TLS 运行时的配置安全需求以及证书校验需求，MOSN 对 TLS 运行时配置提供了一个扩展点，可以按照需求扩展两种类型，四个功能：
+ 解析证书和私钥的方式可扩展，默认是读取证书 / 私钥的明文字符串或明文文件
+ 解析 CA 证书的方式可扩展，默认是读取 CA 证书的明文字符串或明文文件
+ Server 端握手校验的方式可扩展，默认是标准的 TLS 握手校验方式
+ Client 端握手校验的方式可扩展，默认是标准的 TLS 握手校验方式

```Go
// ConfigHooks is a  set of functions used to make a tls config
type ConfigHooks interface {
        // GetCertificate returns the tls.Certificate by index.
        // By default the index is the cert/key file path or cert/key pem string
        GetCertificate(certIndex, keyIndex string) (tls.Certificate, error)
        // GetX509Pool returns the x509.CertPool, which is a set of certificates.
        // By default the index is the ca certificate file path or certificate pem string
        GetX509Pool(caIndex string) (*x509.CertPool, error)
        // ServerHandshakeVerify returns a function that used to set "VerifyPeerCertificate" defined in tls.Config.
        // If it is returns nil, the normal certificate verification will be used.
        // Notice that we set tls.Config.InsecureSkipVerify to make sure the "VerifyPeerCertificate" is called,
        // so the ServerHandshakeVerify should verify the trusted ca if necessary.
        // If the TLSConfig.RequireClientCert is false, the ServerHandshakeVerify will be ignored
        ServerHandshakeVerify(cfg *tls.Config) func(rawCerts [][]byte, verifiedChains [][]*x509.Certificate) error
        // ClientHandshakeVerify returns a function that used to set "VerifyPeerCertificate" defined in tls.Config.
        // If it is returns nil, the normal certificate verification will be used.
        // Notice that we set tls.Config.InsecureSkipVerify to make sure the "VerifyPeerCertificate" is called,
        // so the ClientHandshakeVerify should verify the trusted ca if necessary.
        // If TLSConfig.InsecureSkip is true, the ClientHandshakeVerify will be ignored.
        ClientHandshakeVerify(cfg *tls.Config) func(rawCerts [][]byte, verifiedChains [][]*x509.Certificate) error
}
```
