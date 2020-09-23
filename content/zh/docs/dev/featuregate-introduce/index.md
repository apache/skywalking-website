---
title: "Featuregate 介绍"
linkTitle: "Featuregate 介绍"
date: 2020-03-13
weight: 2
aliases: "/zh/docs/dev/featuregate-introduce"
description: >
  本页介绍了 MOSN 的 featuregate。
---

## Featuregate 介绍

在 MOSN 中，存在一些功能需要在启动时决定是否开启的，为了满足这种需求，MOSN 推出了 featuregate（功能开关）的能力。

Featuregate 描述了一组 MOSN 中需要开启 / 关闭的 feature 状态，每个 feature 都有自己默认的状态，每个 MOSN 版本支持的 feature、feature 默认的版本都有所不同；featuregate 的描述用一个字符串表示，按照`${feature}=${bool}`的方式，用逗号进行分割：

```
// 通用模版
./mosn start -c ${config path} -f ${feature gates description}
// 示例
./mosn start -c mosn_config.json -f "auto_config=true,XdsMtlsEnable=true"
```

Featuregate 不仅仅是提供了一种功能切换的能力，同时也提供了一种可扩展的开发机制，基于 MOSN 进行二次开发时，可以使用 featuregate 做到如下的功能：

- 功能切换的能力，可以控制某个 feature 的开启 / 关闭
- feature 之间的依赖关系管理，包括 feature 之间的启动顺序依赖、开启 / 关闭状态的依赖等
  - 举例说明，基于 MOSN 实现两个 feature，分别为 A 和 B，需要在 A 初始化完成以后，B 会使用 A 初始化的结果进行初始化，这就是 B 依赖 A，当 feature A 处于 Disable 状态时，B 显然也会处于 Disable 或者需要作出对应的“降级”； feature gate 框架提供了一种简单的方式，可以更加专注于 feature 的开发，而不用去管理对应的启动与依赖

基于 featuregate 的框架，在 MOSN 中进行不同 feature 的二次开发，是 featuregate 框架最主要的目的。

## 基于 featuregate 进行开发

### Featuregate 实现

首先，我们来看一下，featuregate 框架提供了哪些接口：

```Go
// 返回一个 Feature 当前的状态，true 表示 enable，false 表示 disable
func Enabled(key Feature) bool
// “订阅”一个 Feature，并且返回其订阅完成以后的状态。
// 当订阅的 Feature 初始化完成以后，会返回其是否 Enable。
// 如果订阅的 Feature 是 Disable 的，会直接返回 false；如果在订阅的 timeout 期间，Feature 依然没有
// 初始化完成，那么会返回订阅超时的错误，如果 timeout 小于等于 0，则没有订阅超时
func Subscribe(key Feature, timeout time.Duration) (bool, error)
// 设置 feature gates 的状态，value 为一个完整的 feature gates 描述
func Set(value string) error
// 设置 feature gates 的状态，其中 map 的 key 为 feature 的 key，value 是期望设置的 feature 状态
func SetFromMap(m map[string]bool) error
// 新注册一个 feature 到 feature gate 中
func AddFeatureSpec(key Feature, spec FeatureSpec) error
// 设置一个 feature 的状态
func SetFeatureState(key Feature, enable bool) error
// 开启初始化 feature
func StartInit()
// 等待所有的 feature 初始化结束
func WaitInitFinsh() error
```

这其中，StartInit 和 WaitInitFinsh 是由 MOSN 框架进行调用，基于 MOSN 进行二次开发时无须关注和调用；通常情况下，Set 和 SetFromMap 也无须关注。所有的上述接口，都是由框架下默认的一个不可导出的全局 featuregate 对象暴露，在没有极为特殊需求的场景下（如编写单元测试），不需要额外生成 FeatureGate 对象，使用默认的即可。

接下来，我们看一下 featuregate 的实现：

```Go
type knownFeatureSpec struct {
        FeatureSpec
        once    sync.Once
        channel chan struct{}
}
type Feature string
type FeatureGate struct {
        // lock guards writes to known, enabled, and reads/writes of closed
        lock  sync.Mutex
        known map[Feature]*knownFeatureSpec
        // inited is set to true when StartInit is called.
        inited bool
        wg     sync.WaitGroup
        once   sync.Once
}
```

Featuregate 包含了一个 map，用于记录所有被支持的 feature；一个`inited`状态标，表示 featuregate 是否已经完成了初始化；`once`用于确保 featuregate 的初始化只执行一次，`WaitGroup`则用于同步 feature 初始化的结果；一个`Mutex`用于并发保护。
按照 featuregate 的设计，不同的 feature 是可以通过`Add`的方式新增，以及不同的`Set`方法改变状态的，而不同 feature 的初始化`Init`函数都会统一执行，因此一旦执行完`Init`，则不再允许新增 feature、修改 feature 状态；因此我们需要一个`inited`的标记来记录这个行为。
`knownFeatureSpec`是一个不可导出的结构体，用于对表示不同 feature 的`FeatureSpec`封装，其中的`once`和`channel`均是用于 featuregate 中订阅和初始化使用，在此不做详细说明。
下面，我们来看一下`FeatureSpec`的定义，这也是我们基于 featuregate 框架进行开发的核心数据结构。

```Go
type prerelease string
const (
        // Values for PreRelease.
        Alpha = prerelease("ALPHA")
        Beta  = prerelease("BETA")
        GA    = prerelease("")
)
type FeatureSpec interface {
        // Default is the default enablement state for the feature
        Default() bool
        // LockToDefault indicates that the feature is locked to its default and cannot be changed
        LockToDefault() bool
        // SetState sets the enablement state for the feature
        SetState(enable bool)
        // State indicates the feature enablement
        State() bool
        // InitFunc used to init process when StartInit is invoked
        InitFunc()
        // PreRelease indicates the maturity level of the feature
        PreRelease() prerelease
}
```

- `prerelease` 是不可导出的定义，有三个约定的导出变量可以使用，相当于传统语言的 Enum 类型，用于描述 feature 的信息，没有明确的作用
- `FeatureSpec`可以自行实现，同时多数情况下可以用框架实现的`BaseFeatureSpec`，或者基于`BaseFeatureSpec`进行封装；如注释描述，通常情况下只需要额外封装实现一个`InitFunc`函数即可

```Go
// BaseFeatureSpec is a basic implementation of FeatureSpec.
// Usually, a feature spec just need an init func.
type BaseFeatureSpec struct {
        // 默认状态
        DefaultValue    bool
        // 是否可修改状态，如果为 true，说明这个 feature 只能保持默认状态
        // 一般情况下设置这个为 true 的时候，default 也是 true
        // 这种 feature 主要会用于做为其他 feature 的“基础依赖”
        IsLockedDefault bool
        PreReleaseValue prerelease
        stateValue      bool  // stateValue shoule be setted by SetState
        inited          int32 // inited cannot be setted
}
```

### Featuregate 的使用

了解了 featuregate 的基本实现，就可以考虑使用 featuregate 进行基本的编程扩展了。下面会介绍几种 featuregate 的使用场景，以及如何编写 feature。

#### 1. 基本的“全局”开关

对于 feature 切换最基本的使用场景，就是使用一个类似“全局变量”进行控制，通过`if`条件判断执行不同的逻辑。使用 featuregate 框架实现这种能力，可以把控制 feature 切换的参数全部统一到启动参数中。

```Go
var featureName featuregate.Feature = "simple_feature"
func init() {
    fs := &featuregate.BaseFeatureSpec{
        DefaultValue: true
    }
    featuregate.AddFeatureSpec(featureName,fs)
}

func myfunc() {
    if featuregate.Enable(featureName) {
        dosth()
    } else {
        dosth2()
    }
}
```

#### 2. 需要进行“初始化”操作

通过封装扩展 InitFunc 函数，让相关的初始化工作在 MOSN 启动时统一完成，如果 feature 处于 disable 状态，那么 InitFunc 不会执行。

```Go
var featureName featuregate.Feature = "init_feature"

type MyFeature struct {
    *BaseFeatureSpec
}

func (f *MyFeature) InitFunc() {
    doInit()
}
// 其他的类似 1.
```

#### 3. Feature 之间存在依赖关系

这个功能是 featuregate 框架提供的最重要的能力，可以方便的解决下面的场景：

- 假设我们存在四个独立的组件（feature），分别是 A、B、C，D
- B 和 C 的启动都依赖于 A，即首先要 A 启动完成，然后 B 和 C 才能启动完成；D 依赖于 B，必须 B 启动完成，D 才可以启动
- 如果 A 没有启动，B 就不能启动，而 C 存在一种降级方案，依然可以继续工作
- 四个 feature 在 featuregate 框架下可各自实现，如下

```Go
var FeatureA featuregate.Feature = "A"

func init() {
    fs := &featuregate.BaseFeatureSpec{
        DefaultValue: true
    }
    featuregate.AddFeatureSpec(FeatureA,fs)
}
```

```Go
var FeatureB featuregate.Feature = "B"

type FB struct {
    *BaseFeatureSpec
}

func (f *FB) InitFunc() {
    enabled, err := featuregate.Subscribe(FeatureA, 5 * time.Second)
    if err != nil || !enabled {
        f.SetState(false) // 如果 FeatureA 没有开启，则 FeatureB 也不开启
    }
}
```

```Go
var FeatureC  featuregate.Feature = "C"

type FC struct {
    *BaseFeatureSpec
    mode int32
}

func (f *FC) InitFunc() {
    enabled, err := featuregate.Subscribe(FeatureA, 5 * time.Second)
    if err != nil || !enabled {
        f.mode = -1 // 降级模式
        return
    }
    if enabled {
        f.mode = 1 // 正常模式
    }
}

func (f *FC) MyFunc() {
    if f.mode == 1 {
        dosth()
    } else if f.mode == -1 {
        dosth2()
    }
}
```

```Go
type FeatureD featuregate.Feature = "D"

type FD struct {
    *BaseFeatureSpec
}

func (f *FD) InitFunc() {
    enabled, err := featuregate.Subscribe(FeatureB, 0) // 不超时，一定要等待 B 结束
    if err != nil || !enabled {
        return
    }
    f.Start()
}

func (f *FD) Start() {
}
```

### FAQ

#### 为什么不使用配置的方式，而要使用 featuregate?

- 配置文件需要进行解析，featuregate 更有利于扩展能力的实现
- 有的 feature 需要判断的时机，比配置文件解析要早，甚至可能影响配置解析的逻辑
