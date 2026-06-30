---
title: "认识 Horizon UI · 17/17：安装与迁移"
date: 2026-06-30
author: 吴晟
description: "Meet Horizon UI 系列收官篇：用一个环境变量驱动的容器启动 Horizon，指向已有 OAP；如果你还在使用上一代 UI，也可以把 Horizon 平滑替换进去。文中还说明 OAP 10.x 和 11.x 的兼容边界：哪些功能只需要 query port，哪些需要 OAP 11 的 admin host。"
tags:
  - Release
  - Community
---

*译自英文原文：[Meet Horizon UI · 17/17: Getting Started & Migration](/blog/2026-06-30-horizon-ui-getting-started-and-migration/)。*

这是 [Meet Horizon UI](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列的第十七篇，也是最后一篇，为第五幕 **make it yours & adopt** 收尾。前十六篇已经讲过 Horizon 能展示什么、能操作什么、如何治理，以及如何定制。这篇回到最实际的问题：怎样把它跑起来，它对后端有什么要求，以及怎样替换掉现有 UI。

## 一个镜像，一份配置

Horizon 以**单个容器镜像**发布：Vue UI 和 Fastify BFF 打在同一个 artifact 里，镜像位于 GHCR：`ghcr.io/apache/skywalking-horizon-ui`。配置文件只有一个：`horizon.yaml`。它最重要的特点是，**每个字段都是环境变量 token**（`${HORIZON_X:default}`），并且会在 YAML 解析之前展开。所以你可以不挂载任何文件，只用环境变量启动镜像；也可以复制这份文件，修改后挂载进去。

```yaml
# horizon.yaml — 每个字段都是 env token: ${HORIZON_X:default}
# 会在 YAML 解析前展开。可以直接用环境变量启动镜像，也可以挂载这份文件。
server:
  host: "${HORIZON_SERVER_HOST:127.0.0.1}"   # 镜像内默认设置为 0.0.0.0
  port: ${HORIZON_SERVER_PORT:8081}

oap:
  queryUrl:  "${HORIZON_OAP_QUERY_URL:http://127.0.0.1:12800}"          # GraphQL，必需
  adminUrl:  "${HORIZON_OAP_ADMIN_URL:http://127.0.0.1:17128}"          # admin REST，operate 功能使用
  zipkinUrl: "${HORIZON_OAP_ZIPKIN_URL:http://127.0.0.1:9412/zipkin}"   # 可选

auth:
  backend: "${HORIZON_AUTH_BACKEND:local}"     # local | ldap
  local:
    users: ${HORIZON_AUTH_LOCAL_USERS:[]}      # JSON；用 pnpm --filter bff cli:hash 生成 hash

session:
  ttlMinutes: ${HORIZON_SESSION_TTL_MINUTES:60}
  cookieSecure: ${HORIZON_SESSION_COOKIE_SECURE:false}   # HTTPS 后面应设为 true
```

把 Horizon 指向已有 OAP，只需要三个 URL。容器启动命令就是给镜像加上环境变量：

```bash
docker run -d --name horizon -p 8081:8081 \
  -e HORIZON_SERVER_HOST=0.0.0.0 \
  -e HORIZON_OAP_QUERY_URL=http://oap:12800 \
  -e HORIZON_OAP_ADMIN_URL=http://oap:17128 \
  -e HORIZON_AUTH_LOCAL_USERS='[{"username":"admin","passwordHash":"$argon2id$...","roles":["admin"]}]' \
  ghcr.io/apache/skywalking-horizon-ui:<version>
```

第一次启动时有两点需要注意。第一，Horizon **没有默认的 admin/admin**。使用 `local` 后端但没有配置用户，或者使用 `ldap` 但没有配置 group mapping 时，BFF 会启动，但没人能登录；密码哈希可以用 `pnpm --filter bff cli:hash` 生成。第二，为了让部署可复现，生产环境应该固定到明确的 release tag 或 commit SHA，而不是使用滚动标签。

## 哪些功能需要哪个 OAP

Horizon **主要面向 OAP 11.x 构建**，同时**部分支持 OAP 10.x**。边界很清楚，也对应这个系列的两半：**observe** 数据面走 OAP query port，两条版本线都能用；**operate** 页面依赖 OAP admin port，只有 11.x 提供。

| 功能 | OAP 10.x | OAP 11.x | 端口 |
|---|:---:|:---:|---|
| Layer dashboards、overviews、topology | ✓ | ✓ | query `:12800` |
| Traces（native + Zipkin）、logs、alarms（read）、profiling | ✓ | ✓ | query `:12800`（Zipkin 使用 `:9412`） |
| Inspect、DSL Management、Live Debugger、Alarm-rule editor | — | ✓ | admin `:17128` |
| Cluster Status → Admin pane、template 和 translation 发布 | — | ✓ | admin `:17128` |

关键点是，Horizon **不会靠读取 OAP 版本号来判断能力**。它会探测所需 module 和 GraphQL field：能支撑的功能才显示侧边栏入口；admin port 不可用时，admin 页面会降级成只读或显示明确提示。所以如果你只需要 triage，也就是 dashboard、alarm、trace、log，OAP 10.x 就够了；operate 这半边需要 OAP 11.x，并启用对应 admin modules（`admin-server`、`receiver-runtime-rule`、`dsl-debugging`、`inspect`）。

## 替换现有 UI

如果你现在运行的是上一代 UI，迁移到 Horizon 可以做成**平滑替换**。Horizon 使用**同一套 OAP GraphQL query protocol 和同一套 MQE 语言**，所以**不需要改 agent，也不需要改后端**；只要把 Horizon 指向正在运行的 OAP 即可。更稳妥的切换方式是先让两个 UI 并行运行，让大家用 Horizon 访问 live data，等准备好了再下线旧 UI。Horizon 额外提供的东西，比如 [governance](/zh/2026-06-30-horizon-ui-access-control-and-security/)（RBAC、auth、audit、themes）和 [config-driven templates](/zh/2026-06-30-horizon-ui-customization-and-templates/)，都是 Horizon 自己在 BFF 里叠加的能力，和 OAP 本身相互独立。

## 验证与生产运行

可以从 [Cluster Status](/zh/2026-06-30-horizon-ui-platform-introspection/) 页面确认连接情况：topbar 会显示 OAP build-version chip，Query 面板会展示版本、时区和健康评分；Admin 和 Zipkin 面板则会根据后端实际暴露的能力亮起。生产环境还要注意几件事：

- **持久化状态。** 管理员编辑的 template 会落在 `/app/bundled_templates`，audit、setup 和 alarm 文件会落在 `/data`；这两个路径应该挂载持久化 volume，否则容器重建后这些修改会丢失。
- **Session 按 BFF 节点保存。** Session 保存在每个节点内存里，没有共享存储；多副本部署需要 sticky sessions，否则故障切换后用户要重新登录。
- **探针和 TLS。** `/api/health` 是公开接口，不依赖 OAP，适合作为容器探针；如果部署在 HTTPS 后面，记得把 `session.cookieSecure` 设为 `true`。

完整参考可以看文档：[container image](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/setup/container-image/)、[`horizon.yaml`](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/setup/horizon-yaml/) 字段说明，以及 [OAP compatibility matrix](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/compatibility/oap-version/)。

## 系列到这里结束

十七篇，五幕：我们先在控制台里**建立方向感**，然后跨 layer **观察**服务的 metrics、traces、logs、topology 和 profiling；接着用 runtime rules、live debugging 和 inspect **操作**后端；再通过 access control **治理**控制台；最后用 templates、八种语言和清晰的安装路径，把它变成自己的工具。下一步最好不是继续读，而是直接点开试试：公开 demo [demo.skywalking.apache.org](https://demo.skywalking.apache.org) 已经把 Horizon 接到了一套 live SkyWalking 后端上。谢谢一路读到这里。
