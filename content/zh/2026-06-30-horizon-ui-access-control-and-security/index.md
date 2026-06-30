---
title: "认识 Horizon UI · 14/17：访问控制与安全"
date: 2026-06-30
author: 吴晟
description: "Horizon UI 系列第十四篇：Horizon 自己的访问控制体系，包括由服务端强制执行的四级 RBAC、本地与 LDAP/AD 认证、append-only audit log、仅在 LDAP 故障时可用的 break-glass 入口，以及五套内置主题。所有逻辑都在 Horizon BFF 中实现，对任何 OAP 版本都一致。"
tags:
  - Engineering
  - Cloud Native
---

*译自英文原文：[Meet Horizon UI · 14/17: Access Control & Security](/blog/2026-06-30-horizon-ui-access-control-and-security/)。*

这是 [Meet Horizon UI](/zh/2026-06-21-skywalking-horizon-ui-introduction/) 系列的第十四篇，也开启第四幕 **govern & secure it**。前面的文章讲 Horizon 能展示什么、能操作什么；这一篇讲**谁可以看、谁可以操作**。先明确一个架构边界：RBAC、认证、audit log、break-glass、主题，这些都是 **Horizon 自己的治理逻辑，由 Horizon BFF 在服务端强制执行**，不依赖也不改动 OAP admin host。因此，无论后端是 OAP 10.x 还是 11.x，行为都一样。

## 先过登录这一关

任何页面渲染之前，都要先登录。Horizon 支持两种认证后端，由配置选择：**Local**，也就是在 `horizon.yaml` 里声明用户和 Argon2id 密码哈希；或者 **LDAP / Active Directory**，由 Horizon 绑定到目录服务，再把目录组映射成 Horizon 角色（可以用 `memberOf`，也可以做 group search，查询由 bind account 完成）。登录页会用一个 pill 显示当前使用的认证后端，并允许用户在认证前选择语言。登录失败时也刻意避免暴露用户枚举线索：用户名错误、密码错误、用户不在任何映射组里，都会返回同一句 *"invalid credentials"*。

![图 1：Horizon 登录页：显示 `Local users` 的认证后端状态 pill、语言选择器，以及峡谷背景上的用户名/密码表单。](/screenshots/horizon-0.7.0/p14-security-01-login.webp)
图 1：登录页：认证后端状态 pill（这里是 `Local users`）、认证前语言选择器和登录表单。认证是第一道门，之后的所有操作再由角色控制。</br>

对管理员来说，**Auth status** 页面会展示认证后端的当前状态：provider 和哈希算法、用户定义位置、break-glass 是否启用，以及当前活跃 session 数。这里有一点要读准确：**active-session count 指的是你正在访问的这个 Horizon BFF 上的 session 数，不是整个集群的总数**；session 保存在每个 BFF 节点的内存里。

![图 2：Auth status 管理页面：provider 为 LOCAL，哈希算法为 argon2id，显示配置文件、break-glass disabled，以及 active-session count。](/screenshots/horizon-0.7.0/p14-security-02-auth-status.webp)
图 2：Auth status：一眼看到认证后端状态，包括 provider（这里是 local、Argon2id）、用户定义位置、break-glass 是否启用，以及当前 Horizon BFF 上的 active-session count（不是集群总数）。</br>

## 谁能做什么

登录之后，每个操作都要经过权限判断。Horizon 内置四个递进角色：**viewer** 可以读取观测数据（dashboard、trace、log、alarm）；**maintainer** 增加平台监控相关页面（cluster status、inspect、retention、config）；**operator** 再增加 dashboard、alarm、runtime rules 和诊断工具；**admin** 拥有全部权限，包括用户和访问控制管理。权限本身是带命名空间的 **verb**，例如 `metrics:read`、`rule:write:structural`、`inspect:read`，并支持通配符（`*`、`rule:*`、`*:read`）。

**Roles & Permissions** 页面把整套模型摊开：上半部分是 **menu-visibility matrix**，显示每个角色能看到哪些侧边栏菜单，以及背后对应的 read verb；下半部分是按 area 拆开的 action matrix，精确标出 viewer / maintainer / operator / admin 分别能做什么。这个页面只读；角色定义在 `horizon.yaml` 里，保存后会 **hot-reload**，不需要重启。

![图 3：Roles & Permissions 页面顶部：四个角色卡片，以及 menu-visibility matrix（每个侧边栏菜单 × 角色，由最后一列的 read verb 把守）。](/screenshots/horizon-0.7.0/p14-security-03-roles.webp)
图 3：Roles & Permissions 页面顶部：角色卡片，以及 menu-visibility matrix——每个侧边栏菜单和角色的关系，由最后一列的 read verb 把守；下方还有按 area 拆分的 action matrix。页面只读：角色定义在 `horizon.yaml`，并支持 hot-reload。</br>

权限判断在**服务端**执行。BFF 会拦截每个受保护请求：未认证返回 401，session 缺少对应 verb 返回 403。route→verb 映射也是强制的：如果某条 route 没有配置权限项，构建会失败，因此不会因为漏配而意外开放。UI 也会按同一套 verb 逻辑隐藏不可用菜单，但这只是纵深防御，不是权限边界；伪造 UI 请求也无法提权，因为最终裁决在 BFF。

## 当前有哪些用户

**Users** 页面列出 Horizon 知道的所有账号：local、LDAP 和 break-glass。每行会显示来源、分配到的角色、上次登录时间和 IP。页面只读；local 用户仍然定义在 `horizon.yaml`，新增用户需要写 YAML，并用 CLI 生成密码哈希。和 Auth status 一样，last-seen 和 active-24h 统计都是**单个 BFF 节点内存里的数据**。多副本部署时，它反映的是当前这个节点，不是整个集群。

![图 4：Users 管理页面：local 用户（admin、viewer、maintainer、operator）列表，包含 source、roles、last-seen、IP，以及单节点 total/active 计数。](/screenshots/horizon-0.7.0/p14-security-04-users.webp)
图 4：Users：列出每个账号的来源（local / LDAP / break-glass）、角色和上次登录信息。last-seen 和 active count 都是 per-BFF-node、in-memory 统计，因此多副本部署只显示当前节点的数据。</br>

## Audit，以及 break-glass 应急入口

所有敏感操作都会进入一个 **append-only audit log**，以 JSON Lines 写在磁盘上（`horizon-audit.jsonl`）。它记录登录成功和失败、break-glass 激活、规则编辑和应用（包含 OAP 返回结果）、alarm 和 dashboard setup 变更、Live Debugger start/stop。普通读取不会记录，只记录写操作和敏感操作，避免日志量失控。每一行都会带上操作者、动作、检查的 verb、时间、结果和来源 IP。Horizon 自己不负责轮转这个文件；生产环境里应该配合 log shipper 和持久化存储，避免重启后丢失。

**Break-glass** 是应急入口：一个本地 admin credential，但它**只在认证后端是 LDAP 且目录服务当前不可达时生效**。它的作用是在目录故障时让你重新进系统，而不是长期存在的后门。它不绕过 RBAC，登录后的 session 只拥有你配置给它的角色，甚至可以只有 `viewer`；每次使用都会双重记录：audit log 一条，加上一条 WARN；LDAP 恢复后，它会立刻失效。

## 主题：让界面适合自己的环境

最后是一个轻量但实际有用的部分。Horizon 内置 **五套主题**：**Horizon** 是默认主题，深色、琥珀色调、高密度，偏 observability 场景；**Meridian** 是偏冷的 navy/indigo 风格，适合长期看表格的 SRE；**Obsidian** 使用接近纯黑和等宽字体，适合 OLED 屏；**Daybreak** 是轻亮配色，适合共享屏幕和打印；**Aurora** 是 magenta 到 cyan 的玻璃质感，更适合演示。管理员可以在 Global Defaults 页面设置**组织默认主题**；每个用户也可以从 topbar theme chip 按**当前设备**覆盖默认值。如果个人选择和组织默认不同，chip 上会用一个点标出来。

![图 5：Global Defaults 页面展示五张主题预览卡：Horizon、Meridian、Obsidian、Daybreak、Aurora，每张卡展示 palette、density、font 和 `Use this theme` 按钮。](/screenshots/horizon-0.7.0/p14-security-05-themes.webp)
图 5：五套内置主题：Horizon（默认）、Meridian、Obsidian、Daybreak、Aurora。每套主题都展示 palette、density 和 font。管理员在这里设置组织默认主题；每个用户可以从 topbar chip 按设备覆盖。</br>

## 后续阅读

这篇里的五个入口都属于 Horizon 自己的 BFF 侧治理，不访问 OAP admin host，因此在不同 OAP 版本上行为一致。（本地开发时也可以完全关闭 RBAC；这时 Roles board 会用红色标出来。）字段参考，包括 verb 列表、LDAP group mapping、audit schema 和 break-glass 启用方式，可以看 [RBAC](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/access-control/rbac/)、[LDAP backend](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/access-control/ldap-backend/)、[Audit log](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/access-control/audit-log/) 和 [Break-glass](https://skywalking.apache.org/docs/skywalking-horizon-ui/next/access-control/break-glass/) 文档。

下一篇进入 **Act 5 — make it yours & adopt**，从 **Customization: Config-Driven Layer Templates** 开始：整个控制台如何由可编辑、可预览、可发布的模板塑造。
