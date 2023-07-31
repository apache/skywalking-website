---
title: "New Features of SkyWalking Go 0.2.0"
date: 2023-07-31
author: "Han Liu"
description: "Introduction the new features of SkyWalking Go 0.2.0"
tags:
- Golang
- Agent
- Metrics
- Logging
---

# Announcing Apache SkyWalking Go 0.2.0
I'm excited to announce the release of Apache SkyWalking Go 0.2.0! This version packs several awesome new features that I'll overview below.

# Log Reporting
The log reporting feature allows the Go agent to automatically collect log content from supported logging frameworks like [logrus](https://github.com/sirupsen/logrus) and [zap](https://pkg.go.dev/go.uber.org/zap). 
The logs are organized and sent to the SkyWalking backend for visualization. You can see how the logs appear for each service in the SkyWalking UI:

![Reported Logging](reported_logging.png)

## Making Logs Searchable
You can configure certain log fields to make them searchable in SkyWalking. Set the `SW_AGENT_LOG_REPORTER_LABEL_KEYS` environment variable to include additional fields beyond the default log level.

For example, with logrus:

```go
# define log with fields
logrus.WithField("module", "test-service").Info("test log")
```

## Metrics Reporting
The agent can now collect and report custom metrics data from `runtime/metrics` to the backend. Supported metrics are documented [here](https://pkg.go.dev/runtime/metrics#hdr-Metric_key_format).

![Runtime Metrics](metrics.png)

# Automatic Instrumentation
In 0.1.0, you had to manually integrate the agent into your apps. Now, the new commands can automatically analyze and instrument projects at a specified path, no code changes needed!
Try using the following command to import `skywalking-go` into your project:

```shell
# inject to project at current path
skywalking-go-agent -inject=./ -all
```

Or you can still use the original manual [approach](https://github.com/apache/skywalking-go/blob/main/docs/en/setup/gobuild.md#22-code-dependency) if preferred.

# Get It Now!

Check out the [CHANGELOG](https://skywalking.apache.org/events/release-apache-skwaylking-go-0.2.0/) for the full list of additions and fixes. I encourage you to try out SkyWalking Go 0.2.0 today! Let me know if you have any feedback.
