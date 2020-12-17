---
title: "[Design] NGE2E - Next Generation End-to-End Testing Framework"
date: 2020-12-14
author: "[Zhenxu Ke](https://github.com/kezhenxu94), Tetrate.io; [Huaxi Jiang](http://github.com/fgksgf), Committer; [Ke Zhang](http://github.com/HumbertZhang), Committer"
description: "The design of Next Generation End-to-End Testing Framework"
---

NGE2E is the next generation End-to-End Testing framework that aims to help developers to set up, debug, and verify E2E tests with ease. It's built based on the lessons learnt from tens of hundreds of test cases in the SkyWalking main repo.

# Goal

- keep the feature parity with the existing E2E framework in SkyWalking main repo;
- support both [docker-compose](https://docs.docker.com/compose/) and [KinD](https://kind.sigs.k8s.io) to orchestrate the tested services under different environments;
- get rid of the heavy `Java/Maven` stack, which exists in the current E2E; be language independent as much as possible, users only need to configure YAMLs and run commands, without writing codes;

# Non-Goal

- this framework is not involved with the build process, i.e. it won't do something like `mvn package` or `docker build`, the artifacts (`.tar`, docker images) should be ready in an earlier process before this;
- this project doesn't take the plugin tests into account, at least for now;
- this project doesn't mean to add/remove any new/existing test case to/from the main repo;
- this documentation won't cover too much technical details of how to implement the framework, that should go into an individual documentation;

# Design

Before diving into the design details, let's take a quick look at how the end user might use NGE2E.

> All the following commands are mock, and are open to debate.

To run a test case in a directory `/path/to/the/case/directory`

```shell
swctl e2e run /path/to/the/case/directory

# or

cd /path/to/the/case/directory && swctl e2e run
```

This will run the test case in the specified directory, this command is a wrapper that glues all the following commands, which can be executed separately, for example, to debug the case:

**NOTE**: because all the options can be loaded from a configuration file, so as long as a configuration file (say `e2e.yaml`) is given in the directory, every command should be able to run in bare mode (without any option explicitly specified in the command line);

### Set Up Services

```shell
swctl e2e setup --env=compose --file=docker-compose.yaml --wait=for=service-health
swctl e2e setup --env=kind --file=kind.yaml --resources=bookinfo.yaml,gateway.yaml --wait=for=pod-ready
swctl e2e setup # If configuration file e2e.yaml is present
```
    
- `--env`: the environment, may be `compose` or `kind`, represents docker-compose and KinD respectively;
- `--file`: the `docker-compose.yaml` or `kind.yaml` file that declares how to set up the environment;
- `--resources`: for KinD, the resources files/directories to apply (using `kubectl apply -f`);
- `--command`: a command to run after the environment is started, this may be useful when users need to install some extra tools or apply resources from command line, like `istioctl install --profile=demo`;
- `--wait`: wait until the given condition is met; the most frequently-used strategy should be `for=service-health`, that makes the `e2e setup` command to wait for all services to be `healthy`; other possible strategies may be something like `for="log:Started Successfully"`, `for="http:localhost:8080/healthcheck"`, etc. if really needed;


### Trigger Inputs

```shell
swctl e2e trigger --interval=3s --times=0 --action=http --url="localhost:8080/users"
swctl e2e trigger --interval=3s --times=0 --action=cmd --cmd="curl localhost:8080/users"
swctl e2e trigger # If configuration file e2e.yaml is present
```

- `--interval=3s`: trigger the action every 3 seconds;
- `--times=0`: how many times to trigger the action, `0=infinite`;
- `--action=http`: the action of the trigger, i.e. "perform an http request as an input";
- `--action=cmd`: the action of the trigger, i.e. "execute the `cmd` as an input";


### Query Output

```shell
swctl service ls
```

this does exactly the same as what `swctl` is doing at present;


### Verify

```shell
swctl e2e verify --actual=actual.data.yaml --expected=expected.data.yaml
swctl e2e verify --query="service ls" --expected=expected.data.yaml
swctl e2e verify # If configuration file e2e.yaml is present
```

- `--actual`: the actual data file;
- `--expected`: the expected data file;
- `--query`: the query to get the actual data, will be executed in command `swctl`;
  > the `--query` option will get the output into a temporary file and use the `--actual` under the hood;


### Cleanup

```shell
swctl e2e cleanup --env=compose --file=docker-compose.yaml
swctl e2e cleanup --env=kind --file=kind.yaml --resources=bookinfo.yaml,gateway.yaml
swctl e2e cleanup # If configuration file e2e.yaml is present
```

This step requires the same options in the setup step so that it can clean up all things necessarily.

### Summarize

To summarize, the directory structure of a test case might be

```text
case-name
├── agent-service        # optional, an arbitrary project that is used in the docker-compose.yaml if needed
│   ├── Dockerfile
│   ├── pom.xml
│   └── src
├── docker-compose.yaml
├── e2e.yaml             # see a sample below
└── testdata
    ├── expected.endpoints.service1.yaml
    ├── expected.endpoints.service2.yaml
    └── expected.services.yaml
```

or

```text
case-name
├── kind.yaml
├── bookinfo
│   ├── bookinfo.yaml
│   └── bookinfo-gateway.yaml
├── e2e.yaml             # see a sample below
└── testdata
    ├── expected.endpoints.service1.yaml
    ├── expected.endpoints.service2.yaml
    └── expected.services.yaml
```

a sample of `e2e.yaml` may be

```yaml
setup:
  env: kind
  file: kind.yaml
  resources: bookinfo.yaml
  command: | # it can be a shell script or anything executable
    istioctl install --profile=demo -y
    kubectl label namespace default istio-injection=enabled

  # OR
  # env: compose
  # file: docker-compose.yaml

  wait: 
    for: service-health

  # wait: 
  #   for: pods-ready

  # OR
  # wait:
  #   for: log
  #   log: Started Successfully

  # OR
  # wait:
  #   for: http
  #   url: localhost:8080/healthcheck

  # OR
  # wait:
  #   for: command
  #   cmd: curl http://localhost:8080/healthcheck

trigger:
  action: http
  interval: 3s
  times: 0
  url: localhost:9090/users

verify:
  - query: service ls
    expected: expected.services.yaml
  - query: endpoint ls --service="YnVzaW5lc3Mtem9uZTo6cHJvamVjdEM=.1"
    expected: expected.projectC.endpoints.yaml
```

and a single command should do the trick.

```shell
swctl e2e run
```

# Modules

This project is divided into the following modules.

## Controller

A controller command (`swctl e2e run`) composes all the steps declared in the `e2e.yaml`, it should be progressive and clearly display which step is currently running. If it failed in a step, the error message should be as much comprehensive as possible. An example of the output might be

```text
swctl e2e run
✔ Started Kind Cluster - Cluster Name
✔ Checked Pods Readiness - All pods are ready
? Generating Traffic - http localhost:9090/users (progress spinner)
✔ Verified Output - service ls
(progress spinner) Verifying Output - endpoint ls
✘ Failed to Verify Output Data - endpoint ls
  <the diff content>
✔ Clean Up
```

## Initializer

The initializer is responsible for

- when `env==compose`
    + start the `docker-compose` services;
    + check the services' healthiness; 
    + wait until all services are ready according to the `interval`, etc.;


- when `env==kind`
    + start the KinD cluster according to the config files;
    + apply the resources files (`--resources`) or/and run the custom init command (`--commands`);
    + check the pods' readiness;
    + wait until all pods are ready according to the `interval`, etc.;

## Verifier

According to scenarios we have at the moment, the must-have features are:

- matchers
    + exact match
    + not null
    + not empty
    + greater than 0
    + regexp match
    + at least one of list element match


- functions
    + base64 encode/decode


in order to help to identify simple bugs from the GitHub Actions workflow, there are some "nice to have" features:

- printing the diff content when verification failed is a super helpful bonus proved in the Python agent repo;

# Logging

When a test case failed, all the necessary logs should be collected into a dedicated directory, which could be uploaded to the GitHub Artifacts for downloading and analysis;

Logs through the entire process of a test case are:

- KinD clusters logs;
- containers/pods logs;
- the logs from the NGE2E itself;


# More Planned

## Debugging

Debugging the E2E locally has been a strong requirement and time killer that we haven't solve up to date, though we have enhancements like https://github.com/apache/skywalking/pull/5198 , but in this framework, we will adopt a new method to "really" support debugging locally.

The most common case when debugging is to run the E2E tests, with one or more services forwarded into the host machine, where the services are run in the IDE or in debug mode.

For example, you may run the SkyWalking OAP server in an IDE and run `swctl e2e run`, expecting the other services (e.g. agent services, SkyWalking WebUI, etc.) inside the containers to connect to your local OAP, instead of the one declared in `docker-compose.yaml`.  

For Docker Desktop Mac/Windows, we can access the services running on the host machine inside containers via `host.docker.internal`, for Linux, it's `172.17.0.1`.

One possible solution is to add an option `--debug-services=oap,other-service-name` that rewrites all the router rules inside the containers from `oap` to `host.docker.internal`/`172.17.0.1`. 

## CodeGen

When adding new test case, a code generator would be of great value to eliminate the repeated labor and copy-pasting issues.


```shell
swctl e2e new <case-name>
```
