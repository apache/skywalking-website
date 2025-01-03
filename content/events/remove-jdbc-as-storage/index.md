---
title: "First Announcement of 2025: H2 Storage Option Permanently Removed"
date: 2025-01-03
author: SkyWalking Team
description: "Apache SkyWalking has removed H2 as a storage option in 2025, replacing it with the production-ready BanyanDB. BanyanDB offers better performance, cloud-native compatibility, and scalability, ensuring a consistent and reliable storage experience. Users are encouraged to migrate to BanyanDB for modern observability needs."
---

As we step into 2025, we are thrilled to share some major updates regarding Apache SkyWalking's storage architecture. Starting from this year, **H2** will no longer be supported as a storage option. This decision marks a significant milestone in our journey to enhance SkyWalking’s scalability, reliability, and adaptability for both local and cloud-native environments.

Back in **2015**, we introduced **H2** as the default storage option for SkyWalking to simplify the first-time installation experience. Its in-memory mode provided an easy way for users to get started locally without additional setup. While it served its purpose for an initial learning curve, over the years, we’ve observed several challenges that have made H2 unsuitable for production and cloud-based environments. 

With the progress of the **BanyanDB** sub-project, we are confident in making **BanyanDB** the default storage choice moving forward. Let's dive into the reasoning behind this transition and what it means for you.

---

## Why Are We Moving Away from H2?

While H2 was a good choice for local installations in its early days, its limitations became increasingly evident as SkyWalking evolved:

1. **Performance Limitations**:
   - H2's **in-memory mode** struggles with high workloads, often leading to **data loss** after about 20 minutes. This behavior occurs without any warnings, making it unreliable for long-term use.

2. **Cloud-Native Deployment Challenges**:
   - H2’s design does not align with **cloud-native** architectures. When users migrated from local setups to **Kubernetes (K8s)** or similar environments, H2 caused **endless rebooting** of the OAP server due to state loss, creating confusion and frustration.

3. **Inconsistencies in Feature Implementations**:
   - H2 relies on the OAP’s **JDBC implementation**, which differs significantly from the implementations for **Elasticsearch** and **BanyanDB**. This inconsistency led to discrepancies in behavior, especially when users switched to production-ready storage backends.

---

## BanyanDB: The Future of SkyWalking Storage

With the progress of the **BanyanDB sub-project**, we are excited to announce that **BanyanDB 0.8** (scheduled for release in early 2025) is fully **production-ready**. BanyanDB is designed to address the limitations of H2 while providing a seamless experience for both local and cloud-native deployments. 

### Why BanyanDB?

1. **Performance and Reliability**:
   - BanyanDB can handle larger workloads without the risk of data loss, making it far more suitable for production environments.

2. **Cloud-Native First**:
   - Built with cloud-native architectures in mind, BanyanDB works seamlessly in **Kubernetes** and other containerized environments, ensuring stability and scalability.

3. **User-Friendly**:
   - Despite its advanced capabilities, BanyanDB is easy to set up locally, lowering the barrier to entry for new users.

4. **Unified Features**:
   - BanyanDB ensures consistent behavior with other storage backends like Elasticsearch, providing a more predictable and reliable user experience.

---

## How to Get Started with BanyanDB

Setting up BanyanDB is simple and straightforward. Follow these steps to transition from H2 to BanyanDB:

### Step 1: Identify the BanyanDB Version

Locate the bundled BanyanDB version in your OAP binary by checking the following file:

```text
/config/bydb.dependencies.properties
```

### Step 2: Set Up BanyanDB Using Docker

Run the following commands to pull and run BanyanDB as a standalone container:

```bash
export BYDB_VERSION=xxx

docker pull apache/skywalking-banyandb:${BYDB_VERSION}

docker run -d \
  -p 17912:17912 \
  -p 17913:17913 \
  --name banyandb \
  apache/skywalking-banyandb:${BYDB_VERSION} \
  standalone
```

- **Ports**:
  - `17912`: gRPC port for communication.
  - `17913`: HTTP port for administration.

### Step 3: Start SkyWalking OAP and UI

Once BanyanDB is running, you can start the OAP server and UI with their default settings using:

```bash
bin/startup.sh
```

- **OAP Server**:
  - gRPC APIs: `0.0.0.0:11800`
  - HTTP APIs: `0.0.0.0:12800`
- **UI**:
  - Port: `8080`
  - Queries OAP APIs via `127.0.0.1:12800`.

---

## What This Means for You

- **For New Users**:
  - BanyanDB will be the default storage option, providing a smooth experience for both local and cloud-native setups.

- **For Existing Users**:
  - If you are still using H2, we strongly recommend migrating to a production-ready storage backend such as **BanyanDB** or **Elasticsearch**. BanyanDB is especially well-suited for modern cloud environments.

---

## Looking Ahead

The removal of H2 is a step forward in making SkyWalking a truly robust, cloud-native observability platform. By focusing on **BanyanDB**, we aim to provide a storage solution that grows with your needs, whether you're running SkyWalking locally or scaling it across distributed environments.

We’re excited about this transition and look forward to hearing your feedback as you adopt BanyanDB. If you have any questions or need assistance, feel free to reach out to the community.

Here’s to a more scalable and reliable SkyWalking in 2025!
