---
title: "How to integrate skywalking-nginx-lua to Nginx?"
date: 2021-12-13
author: shiyan.xiong, the user of skywalking
description: "provide a path to integrate skywalking-nginx-lua to nginx and avoid you falling pit"
tags:
- Nginx
---



We Can integrate Skywalking to Java Application by Java Agent TEC.， In typical application, the system runs Java Web applications at the backend of the load balancer, and the most commonly used load balancer is nginx. What should we do if we want to bring it under surveillance? Fortunately, skywalking has provided [Nginx agent](https://github.com/apache/skywalking-nginx-lua)。 During the integration process, it is found that the examples on the official website only support openresty. For openresty, common modules such as luajit and Lua nginx module have been integrated. Adding skywalking related configurations according to the examples on the official website can take effect. However, when configured for nginx startup, many errors will be reported. We may not want to change a load balancer (nginx to openresty) in order to use skywalking. Therefore, we must solve the integration problem between skywalking and nginx.

Note: openresty is a high-performance web development platform based on nginx + Lua, which solves the short board that is not easy to program in nginx.


Based on Skywalking-8.7.0 and Nginx-1.20.1

### Upgrade of nginx:



The agent plug-in of nginx is written based on Lua, so nginx needs to add support for Lua, [Lua nginx module](https://github.com/openresty/lua-nginx-module) It just provides this function. The Lua nginx module depends on [luajit](https://luajit.org/download.html) Therefore, first we need to install luajit. In the environment, it is best to choose version 2.1.



For nginx, you need to compile the necessary modules yourself. It depends on the following two modules:

[lua-nginx-module](https://github.com/openresty/lua-nginx-module) The version is lua-nginx-module-0.10.21rc1

[ngx_devel_kit](http://openresty.org/cn/nginx-devel-kit.html) The version using ngx_devel_kit-0.3.1

Compile nginx parameters



```shell

configure arguments: --add-module=/path/to/ngx_devel_kit-0.3.1 --add-module=/path/to/lua-nginx-module-0.10.21rc1 --with-ld-opt=-Wl,-rpath,/usr/local/LuaJIT/lib

```



The following is for skywalking-nginx-lua-0.3.0 and 0.3.0+ are described separately.



### skywalking-nginx-lua-0.3.0



After testing, skywalking-nginx-lua-0.3.0 requires the following Lua related modules

```shell

lua-resty-core https://github.com/openresty/lua-resty-core

lua-resty-lrucache https://github.com/openresty/lua-resty-lrucache

lua-cjson https://github.com/openresty/lua-cjson

```

The dependent Lua modules are as follows:

```shell

lua_package_path "/path/to/lua-resty-core/lua-resty-core-master/lib/?.lua;/path/to/lua-resty-lrucache-0.11/lib/?.lua;/path/to/skywalking-nginx-lua-0.3.0/lib/?.lua;;";

```

In the process of make & & make install, Lua cjson needs to pay attention to:

Modify a path in makefile

LUA_INCLUDE_DIR ?= /usr/local/LuaJIT/include/luajit-2.0

Reference:[ https://blog.csdn.net/ymeputer/article/details/50146143 ]( https://blog.csdn.net/ymeputer/article/details/50146143 )



### skywalking-nginx-lua-0.3.0+

For skywalking-nginx-lua-0.3.0+, tablepool support needs to be added, but it seems that cjson is not required

```shell

lua-resty-core https://github.com/openresty/lua-resty-core

lua-resty-lrucache https://github.com/openresty/lua-resty-lrucache

lua-tablepool https://github.com/openresty/lua-tablepool

```



```shell

lua_ package_ path "/path/to/lua-resty-core/lua-resty-core-master/lib/?.lua;/path/to/lua-resty-lrucache-0.11/lib/?.lua;/path/to/lua-tablepool-master/lib/?.lua;/path/to/skywalking-nginx-lua-master/lib/?.lua;;";

```

tablepool introduces two APIs according to its official documents ` table new and table. Clear ` requires luajit2.1, there is a paragraph in the skywalking-nginx-lua document that says you can use 'require ("skywalking. Util") disable_ Tablepool() ` disable tablepool



When you start nginx, you will be prompted to install openresty's own [luajit version]（ https://github.com/openresty/luajit2 )



```shell

detected a LuaJIT version which is not OpenResty's; many optimizations will be disabled and performance will be compromised (see https://github.com/openresty/luajit2 for OpenResty's LuaJIT or, even better, consider using the OpenResty releases from https://openresty.org/en/download.html )

```

here is successful configuration:


```lua
     http {
    lua_package_path "/path/to/lua-resty-core/lua-resty-core-master/lib/?.lua;/path/to/lua-resty-lrucache-0.11/lib/?.lua;/path/to/lua-tablepool-master/lib/?.lua;/path/to/skywalking-nginx-lua-master/lib/?.lua;;";

    # Buffer represents the register inform and the queue of the finished segment
    lua_shared_dict tracing_buffer 100m;

    # Init is the timer setter and keeper
    # Setup an infinite loop timer to do register and trace report.
    init_worker_by_lua_block {
        local metadata_buffer = ngx.shared.tracing_buffer

        -- Set service name
        metadata_buffer:set('serviceName', 'User Service Name')
        -- Instance means the number of Nginx deployment, does not mean the worker instances
        metadata_buffer:set('serviceInstanceName', 'User Service Instance Name')
        -- type 'boolean', mark the entrySpan include host/domain
        metadata_buffer:set('includeHostInEntrySpan', false)

        -- set random seed
        require("skywalking.util").set_randomseed()
        require("skywalking.client"):startBackendTimer("http://127.0.0.1:12800")

        -- If there is a bug of this `tablepool` implementation, we can
        -- disable it in this way
        -- require("skywalking.util").disable_tablepool()

        skywalking_tracer = require("skywalking.tracer")
    }

    server {
        listen 8090;
        
        location /ingress {
            default_type text/html;

            rewrite_by_lua_block {
                ------------------------------------------------------
                -- NOTICE, this should be changed manually
                -- This variable represents the upstream logic address
                -- Please set them as service logic name or DNS name
                --
                -- Currently, we can not have the upstream real network address
                ------------------------------------------------------
                skywalking_tracer:start("upstream service")
                -- If you want correlation custom data to the downstream service
                -- skywalking_tracer:start("upstream service", {custom = "custom_value"})
            }

            -- Target upstream service
            proxy_pass http://127.0.0.1:8080/backend;

            body_filter_by_lua_block {
                if ngx.arg[2] then
                    skywalking_tracer:finish()
                end
            }

            log_by_lua_block {
                skywalking_tracer:prepareForReport()
            }
        }
    }
}
```

Original post：https://www.cnblogs.com/kebibuluan/p/14440228.html

