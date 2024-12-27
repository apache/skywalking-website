---
title: Announcement - Changes in SkyWalking OAP’s Release Policy
date: 2024-12-27
author: SkyWalking Team
description: "Starting in 2025, the Apache SkyWalking community will no longer publish OAP server and UI JARs to Maven Central. Instead, releases will be available via source tarballs, binary tarballs on the SkyWalking download page, and Docker images on Docker Hub, ensuring a more efficient release process without impacting most users."
---

Since joining the Apache Software Foundation (ASF) incubator in 2017, the SkyWalking project has maintained a consistent release policy. Over the years, we have continuously uploaded all OAP Server and UI component libraries to Maven Central, starting from version 6.0.0 up to the latest 10.1.0 release. You can find these releases at Maven Central: org.apache.skywalking.

Initially, releasing all component JARs to Maven Central was necessary due to the early architecture of SkyWalking, where OAP Server, UI, and Java Agent all shared the same monorepo. The Java Agent included a toolkit library that many users accessed via the central repository. However, in 2021, we split the Java Agent into its own repository [skywalking-java GitHub repository](https://github.com/apache/skywalking-java), simplifying code management and release workflows.

Over time, the OAP repository has grown significantly, incorporating many new modules to support advanced features. However, this has also made the release process heavier and more time-consuming. Currently, preparing a release takes over 1 hour, with 90% of the time spent uploading JARs to Maven Central. We believe this step is no longer necessary and adds little value.

# Planned Changes
As we step into 2025, the SkyWalking community will streamline the release process with the following changes:

Starting in 2025, all JAR files of the skywalking-oap-server will no longer be published to Maven Central.
We will instead provide the release artifacts through the following channels:
- Source tarballs and binary tarballs: These will be available on the [official SkyWalking download page](https://skywalking.apache.org/downloads/#SkyWalkingAPM).
- Docker images: These will be published on Docker Hub, [OAP server](https://hub.docker.com/r/apache/skywalking-oap-server) and [OAP UI](https://hub.docker.com/r/apache/skywalking-ui).


# Impact on Users
This change will be transparent to the vast majority of users (approximately 99%). As highlighted in our Quick Start Guide, you can easily deploy OAP Server, UI, and Database with a single command using Docker Compose:


**Linux, macOS, Windows (WSL)**
```shell
bash <(curl -sSL https://skywalking.apache.org/quickstart-docker.sh) 
```

**Windows (Powershell)**
```powershell
Invoke-Expression ([System.Text.Encoding]::UTF8.GetString((Invoke-WebRequest -Uri https://skywalking.apache.org/quickstart-docker.ps1 -UseBasicParsing).Content))
```

You will be prompted to choose the storage type, and then the script will start the backend cluster with the selected storage. 

To tear down the cluster, run the following command:

```shell
docker compose --project-name=skywalking-quickstart down
```

___


To all of our re-distribution develoeprs, if you are using the `skywalking-oap-server` as a dependency in your project, you need to download the source tar from the website and publish them to your private maven repository. You could see change details [here](https://github.com/apache/skywalking/pull/12903).

# Looking Ahead
By removing the step of uploading OAP Server JARs to Maven Central, the SkyWalking release process will become more efficient. This will allow the community to focus more on delivering new features and improving the overall user experience. We are confident that this change will not impact the majority of users’ workflows.

Thank you for your continued support of the Apache SkyWalking project! If you have any questions or suggestions, feel free to reach out via our community contact channels.

**SkyWalking Community**

**End of 2024**