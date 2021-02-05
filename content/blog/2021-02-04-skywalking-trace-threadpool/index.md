---
title: "Apache SkyWalking: How to propagate trace between threads when using ThreadPoolExecutor"
date: 2021-02-04
author: "Binglong Li"
description: "This post introduces how to propagate trace between threads when using ThreadPoolExecutor, 
which skywalking agent can not enhance"
tags:
- Java
- Agent
- Tracing
- thread
---

When using skywalking java agent, people usually propagate trace easily. They even do not need to change the business 
code. However, it becomes harder when you want to propagate trace between threads when using ThreadPoolExecutor. 
You can use the RunnableWrapper in the maven artifact org.apache.skywalking:apm-toolkit-trace. This way you must change 
your code. The developer manager usually don't like this because there may be lots of projects, or lots of runnable code. 
If they don't use skywalking some day, the code added will be superfluous and inelegant.

Is there a way to propagate trace without changing the business code? Yes. 

Skywalking java agent enhances an instance by add a field and implement an interface. The ThreadPoolExecutor is a special
class that is used widely. We even don't know when and where it is loaded. Most JVMs do not allow changes in the class
file format for classes that have been loaded previously. So skywalking can not always enhance the ThreadPoolExecutor 
properly. However, we can apply advice to the ThreadPoolExecutor#execute method and wrap the Runnable param using our 
own agent, then enhance the wrapper class by skywalking java agent. An advice do not change the layout of a class.

Now we should decide how to do this. You can use the RunnableWrapper in the maven artifact 
org.apache.skywalking:apm-toolkit-trace to wrap the param, but you will face another problem. This RunnableWrapper 
has a plugin whose active condition is checking if there is @TraceCrossThread. Byte buddy in
skywalking will use net.bytebuddy.pool.TypePool.Default.WithLazyResolution.LazyTypeDescription to find the annotations
of a class. The LazyTypeDescription finds annotations by using a URLClassLoader with no urls if the classloader is
null(bootstrap classloader). So it can not find the @TraceCrossThread class unless you change the LocationStrategy of
skywalking java agent builder.

In [this project](https://github.com/libinglong/skywalking-threadpool-agent), I write my own wrapper class, 
and simply add a plugin with a name match condition.

Finally, note you should add your own agent after the skywalking agent since the wrapper class should not be loaded before
skywalking agent instrumentation have finished.

