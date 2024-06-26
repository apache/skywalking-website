---
title: Release Apache SkyWalking Go 0.1.0
date: 2023-06-04
author: SkyWalking Team
description: "Release Apache SkyWalking Go 0.1.0"
---

SkyWalking Go 0.1.0 is released. Go to [downloads](https://skywalking.apache.org/downloads) page to find release tars.

#### Features
* Initialize the agent core and user import library.
* Support gRPC reporter for management, tracing protocols.
* Automatic detect the log frameworks and inject the log context.

#### Plugins
* Support [Gin](https://github.com/gin-gonic/gin) framework.
* Support [Native HTTP](https://pkg.go.dev/net/http) server and client framework.
* Support [Go Restful](https://github.com/emicklei/go-restful) v3 framework.
* Support [Dubbo](https://github.com/apache/dubbo-go) server and client framework.
* Support [Kratos](github.com/go-kratos/kratos) v2 server and client framework.
* Support [Go-Micro](https://github.com/go-micro/go-micro) v4 server and client framework.
* Support [GORM](https://github.com/go-gorm/gorm) v2 database client framework.
    * Support [MySQL Driver](https://github.com/go-gorm/mysql) detection.

#### Documentation
* Initialize the documentation.

#### Issues and PR
- All issues are [here](https://github.com/apache/skywalking/milestone/176?closed=1)
- All and pull requests are [here](https://github.com/apache/skywalking-go/milestone/1?closed=1)