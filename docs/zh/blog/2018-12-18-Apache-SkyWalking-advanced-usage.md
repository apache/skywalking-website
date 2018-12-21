# Apache SkyWalking 之高级用法

作者： SkyWalking 兴趣爱好者，赵禹光

# 导读
 * SkyWalking中Java探针是使用JavaAgent的两大字节码操作工具之一的Byte Buddy（另外是Javassist）实现的。项目还包含.Net core和Nodejs自动探针，以及Service Mesh Istio的监控。总体上，SkyWalking是一个多语言，多场景的适配，特别为微服务、云原生和基于容器架构设计的可观测性分析平台（Observability Analysis Platform）。
 * 本文基于SkyWalking 5.0.0-RC2和Byte Buddy 1.7.9版本，会从以下几个章节，让大家掌握SkyWalking Java探针的使用，进而让SkyWalking在自己公司中的二次开发变得触手可及。
    * Byte Buddy实现JavaAgent项目
    * 迭代JavaAgent项目的方法论
    * SkyWalking agent项目如何Debug
    * SkyWalking插件开发实践
 * 文章底部有SkyWalking和Byte Buddy相应的学习资源。

# Byte Buddy实现

 * 首先如果你对JavaAgent还不是很了解可以先百度一下，或在公众号内看下《JavaAgent原理与实践》简单入门下。
 * SpringMVC分发请求的关键方法相信已经不用我在赘述了，那我们来编写Byte Buddy JavaAgent代码吧。

```Java
 public class AgentMain {
    public static void premain(String agentOps, Instrumentation instrumentation) {
        new AgentBuilder.Default()
                .type(ElementMatchers.named("org.springframework.web.servlet.DispatcherServlet"))
                .transform((builder, type, classLoader, module) ->
                        builder.method(ElementMatchers.named("doDispatch"))
                                .intercept(MethodDelegation.to(DoDispatchInterceptor.class)))
                .installOn(instrumentation);
    }
}
```

 * 编写DispatcherServlet doDispatch拦截器代码（是不是跟AOP如出一辙）
 
```Java
 public class DoDispatchInterceptor {
    @RuntimeType
    public static Object intercept(@Argument(0) HttpServletRequest request, @SuperCall Callable<?> callable) {
        final StringBuilder in = new StringBuilder();
        if (request.getParameterMap() != null && request.getParameterMap().size() > 0) {
            request.getParameterMap().keySet().forEach(key -> in.append("key=" + key + "_value=" + request.getParameter(key) + ","));
        }
        long agentStart = System.currentTimeMillis();
        try {
            return callable.call();
        } catch (Exception e) {
            System.out.println("Exception :" + e.getMessage());
            return null;
        } finally {
            System.out.println("path:" + request.getRequestURI() + " 入参:" + in + " 耗时:" + (System.currentTimeMillis() - agentStart));
        }
    }
}
```

 * resources/META-INF/MANIFEST.MF
 
```xml
Manifest-Version: 1.0
Premain-Class: com.z.test.agent.AgentMain
Can-Redefine-Classes: true
```

 * pom.xml文件

```xml
dependencies
    +net.bytebuddy.byte-buddy 
    +javax.servlet.javax.servlet-api *scope=provided
plugins
    +maven-jar-plugin *manifestFile=src/main/resources/META-INF/MANIFEST.MF
    +maven-shade-plugin *include:net.bytebuddy:byte-buddy:jar:
    +maven-compiler-plugin
```

 * 小结：没几十行代码就完成了，通过Byte Buddy实现应用组件SpringMVC记录请求路径、入参、执行时间JavaAgent项目，是不是觉得自己很优秀。
 
# 持续迭代JavaAgent 
 * 本章节主要介绍JavaAgent如何Debug，以及持续集成的方法论。
 * 首先我的JavaAgent项目目录结构如图所示:
   ![](https://raw.githubusercontent.com/zhaoyuguang/test/master/my-test.png?2)
 * 应用项目是用几行代码实现的SpringBootWeb项目:


```Java
@SpringBootApplication(scanBasePackages = {"com"})
public class TestBootWeb {
    public static void main(String[] args) {
        SpringApplication.run(TestBootWeb.class, args);
    }
    @RestController
    public class ApiController {
        @PostMapping("/ping")
        public String ping(HttpServletRequest request) {
            return "pong";
        }
    }
}

```
 
 * 下面是关键JavaAgent项目如何持续迭代与集成:
 
```xml
VM options增加:-JavaAgent:{$HOME}/Code/github/z_my_test/test-agent/target/test-agent-1.0-SNAPSHOT.jar=args
Before launch 在Build之前增加：
    Working directory:{$HOME}/Code/github/incubator-skywalking
    Command line:-T 1C -pl test-agent -am clean package -Denforcer.skip=true -Dmaven.test.skip=true -Dmaven.compile.fork=true
```

* 小结:看到这里的将JavaAgent持续迭代集成方法，是不是瞬间觉得自己手心已经发痒起来，很想编写一个自己的agent项目了呢，等等还有一个好消息:test-demo这10几行的代码实现的Web服务，居然有5k左右的类可以使用agent增强。
* 注意mvn编译加速的命令是maven3+版本以上才支持的哈。

# SkyWalking Debug
 * 峰回路转，到了文章的主题《SkyWalking之高级用法》的正文啦。首先，JavaAgent项目想Debug，还需要将agent代码与接入agent项目至少在同一个工作空间内，网上方法有很多，这里我推荐大家一个最简单的方法。File->New->Module from Exisiting Sources...引入skywalking-agent源码即可
![](https://raw.githubusercontent.com/zhaoyuguang/test/master/import.png)
 * 详细的idea编辑器配置：
![](https://raw.githubusercontent.com/zhaoyuguang/test/master/boot-one.png)
 * 优化SkyWalking agent编译时间，我的集成时间优化到30秒左右：

```xml
VM options增加:-JavaAgent:-JavaAgent:{$HOME}/Code/github/incubator-skywalking/skywalking-agent/skywalking-agent.jar：不要用dist里面的skywalking-agent.jar，具体原因大家可以看看源码：apm-sniffer/apm-agent/pom.xml中的maven插件的使用。
Before launch 在Build之前增加：
    Working directory:{$HOME}/Code/github/incubator-skywalking
    Command line:-T 1C -pl apm-sniffer/apm-sdk-plugin -amd clean package -Denforcer.skip=true -Dmaven.test.skip=true -Dmaven.compile.fork=true： 这里我针对插件包，因为紧接着下文要开发插件
另外根pom注释maven-checkstyle-plugin也可加速编译
```

 
# kob之SkyWalking插件编写
 * kob（贝壳分布式作业调度框架）是贝壳找房项目微服务集群中的基础组件，通过编写贝壳分布式作业调度框架的SkyWalking插件，可以实时收集作业调度任务的执行链路信息，从而及时得到基础组件的稳定性，了解细节可点击阅读《[贝壳分布式调度框架简介](https://mp.weixin.qq.com/s/3hXyFCgclsuoznNQ2ulC4g)》。想详细了解SkyWalking插件编写可在文章底部参考链接中，跳转至对应的官方资源，好话不多说，代码一把唆起来。
 * apm-sdk-plugin pom.xml增加自己的插件model

```xml
<artifactId>apm-sdk-plugin</artifactId>
    <modules>
        <module>kob-plugin</module>
        ...
    <modules>
```

* resources.skywalking-plugin.def增加自己的描述

```xml
kob=org.apache.skywalking.apm.plugin.kob.KobInstrumentation
```

* 在SkyWalking的项目中，通过继承ClassInstanceMethodsEnhancePluginDefine可以定义需要拦截的类和增强的方法，编写作业调度方法的instrumentation

```Java
public class KobInstrumentation extends ClassInstanceMethodsEnhancePluginDefine {
    private static final String ENHANCE_CLASS = "com.ke.kob.client.spring.core.TaskDispatcher";
    private static final String INTERCEPT_CLASS = "org.apache.skywalking.apm.plugin.kob.KobInterceptor";
    @Override
    protected ClassMatch enhanceClass() {
        return NameMatch.byName(ENHANCE_CLASS);
    }
    @Override
    protected ConstructorInterceptPoint[] getConstructorsInterceptPoints() {
        return null;
    }
    @Override
    protected InstanceMethodsInterceptPoint[] getInstanceMethodsInterceptPoints() {
        return new InstanceMethodsInterceptPoint[] {
                new InstanceMethodsInterceptPoint() {
                    @Override
                    public ElementMatcher<MethodDescription> getMethodsMatcher() {
                        return named("dispatcher1");
                    }
                    @Override
                    public String getMethodsInterceptor() {
                        return INTERCEPT_CLASS;
                    }
                    @Override
                    public boolean isOverrideArgs() {
                        return false;
                    }
                }
        };
    }
}
```

* 通过实现InstanceMethodsAroundInterceptor后，定义beforeMethod、afterMethod和handleMethodException的实现方法，可以环绕增强指定目标方法，下面自定义interceptor实现span的跟踪（这里需要注意SkyWalking中span的生命周期，在afterMethod方法中结束span）

```Java
public class KobInterceptor implements InstanceMethodsAroundInterceptor {
    @Override
    public void beforeMethod(EnhancedInstance objInst, Method method, Object[] allArguments,  Class<?>[] argumentsTypes, MethodInterceptResult result) throws Throwable {
        final ContextCarrier contextCarrier = new ContextCarrier();
        com.ke.kob.client.spring.model.TaskContext context = (TaskContext) allArguments[0];
        CarrierItem next = contextCarrier.items();
        while (next.hasNext()) {
            next = next.next();
            next.setHeadValue(JSON.toJSONString(context.getUserParam()));
        }
        AbstractSpan span = ContextManager.createEntrySpan("client:"+allArguments[1]+",task:"+context.getTaskKey(), contextCarrier);
        span.setComponent(ComponentsDefine.TRANSPORT_CLIENT);
        SpanLayer.asRPCFramework(span);
    }
    @Override
    public Object afterMethod(EnhancedInstance objInst, Method method, Object[] allArguments, Class<?>[] argumentsTypes, Object ret) throws Throwable {
        ContextManager.stopSpan();
        return ret;
    }
    @Override
    public void handleMethodException(EnhancedInstance objInst, Method method, Object[] allArguments, Class<?>[] argumentsTypes, Throwable t) {
    }
}
```

 * 实现效果，将操作名改成任务执行节点+任务执行方法，实现kob的SkyWalking的插件编写，加上报警体系，可以进一步增加公司基础组件的稳定性。
![](https://raw.githubusercontent.com/zhaoyuguang/test/master/shixian.png)

# 参考链接
 * Apache SkyWalking（an APM system）
https://github.com/apache/incubator-skywalking
 * Byte Buddy（runtime code generation for the Java virtual machine）
https://github.com/raphw/byte-buddy