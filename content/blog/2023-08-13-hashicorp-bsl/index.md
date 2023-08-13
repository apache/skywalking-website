---
title: "The Statement for SkyWalking users on HashiCorp license changes"
date: 2023-08-13
author: "Apache SkyWalking"
description: "HashiCorp announced to adopt the Business Source License from Mozilla Public License v2.0 (MPL 2.0). SkyWalking community posts the statement for our own users to explain the evaluation of the potential implications."
startTime: 2023-08-13T00:00:00Z
endTime: 2023-09-30T10:00:00Z
---

On Aug. 10th, 2023, HashiCorp announced to adopt the Business Source License (BSL) from Mozilla Public License v2.0 (MPL 2.0), here is their [post](https://www.hashicorp.com/blog/hashicorp-adopts-business-source-license). 
They officially annouced they have changed the license for the **ALL** of their open-source products from the previous MPL 2.0 to a source-available license, BSL 1.1. 
Meanwhile, HashiCorp APIs, SDKs, and almost all other libraries will remain MPL 2.0.

HashiCorp Inc. is one of the most important vendors in the cloud-native landscape, as well as Golang ecosystem. This kind of changes would have potential implications for 
SkyWalking, which is closely integrated with cloud-native technology stacks. 


# Conclusion First
- **What does that mean for SkyWalking users?**

SkyWalking community has evaluated our dependencies from HashiCorp products and libraries, the current conclusion is

**SkyWalking users would NOT suffer any implication. All components of SkyWalking don't have hard-dependency on BSL license affected codes.**

SkyWalking community have found out all following dependencies of all relative repositories, all licenses are TRUELY stayed unchanged, and compatible with Apache 2.0 License.

- [x] OAP Server @kezhenxu94 @wu-sheng 
  - consul-client Apache 2.0 Repo archived on Jul 27, 2023
- [x] BanyanDB @hanahmily @lujiajing1126 
   - [x] Server @hanahmily 
     - hashicorp/golang-lru MPL-2.0
     - hashicorp/hcl MPL-2.0
   - [x] CLI @hanahmily **No HashiCorp Dependency**
- [x] SkyWalking OAP CLI @kezhenxu94 
  - github.com/hashicorp/hcl v1.0.0 MPL-2.0
  - All under swck as transitive dependencies
- [x] SWCK @hanahmily
  - hashicorp/consul/api MPL-2.0
  - hashicorp/consul/sdk MPL-2.0
  - hashicorp/errwrap MPL-2.0
  - hashicorp/go-cleanhttp MPL-2.0
  - hashicorp/go-immutable-radix MPL-2.0
  - hashicorp/go-msgpack MIT
  - hashicorp/go-multierror MPL-2.0
  - hashicorp/go-rootcerts MPL-2.0
  - hashicorp/go-sockaddr MPL-2.0
  - hashicorp/go-syslog MIT
  - hashicorp/go-uuid MPL-2.0
  - hashicorp/go.net BSD-3
  - hashicorp/golang-lru MPL-2.0
  - hashicorp/hcl MPL-2.0
  - hashicorp/logutils MPL-2.0
  - hashicorp/mdns MIT
  - hashicorp/memberlist MPL-2.0
  - hashicorp/serf MPL-2.0
- [x] Go agent @mrproliu 
	- hashicorp/consul/api MPL-2.0
	- hashicorp/consul/sdk MPL-2.0
	- hashicorp/errwrap MPL-2.0
	- hashicorp/go-cleanhttp MPL-2.0
	- hashicorp/go-hclog MIT
	- hashicorp/go-immutable-radix MPL-2.0
	- hashicorp/go-kms-wrapping/entropy MPL-2.0
	- hashicorp/go-kms-wrapping/entropy/v2 MPL-2.0
	- hashicorp/go-msgpack MIT
	- hashicorp/go-multierror MPL-2.0
	- hashicorp/go-plugin MPL-2.0
	- hashicorp/go-retryablehttp MPL-2.0
	- hashicorp/go-rootcerts MPL-2.0
	- hashicorp/go-secure-stdlib/base62 MPL-2.0
	- hashicorp/go-secure-stdlib/mlock MPL-2.0
	- hashicorp/go-secure-stdlib/parseutil MPL-2.0
	- hashicorp/go-secure-stdlib/password MPL-2.0
	- hashicorp/go-secure-stdlib/tlsutil MPL-2.0
	- hashicorp/go-sockaddr MPL-2.0
	- hashicorp/go-syslog MIT
	- hashicorp/go-uuid MPL-2.0
	- hashicorp/go-version MPL-2.0
	- hashicorp/go.net BSD-3-Clause
	- hashicorp/golang-lru MPL-2.0
	- hashicorp/logutils MPL-2.0
	- hashicorp/mdns MIT
	- hashicorp/memberlist MPL-2.0
	- hashicorp/serf MPL-2.0
	- hashicorp/vault/api MPL-2.0
	- hashicorp/vault/sdk MPL-2.0
	- hashicorp/yamux MPL-2.0
- [x] SkyWalking eyes @kezhenxu94 
  - none
- [x] SkyWalking Infra e2e @kezhenxu94 
  - all under swck as transitive dependencies
- [x] SkyWalking rover(ebpf agent) @mrproliu 
	- hashicorp/consul/api MPL-2.0
	- hashicorp/consul/sdk MPL-2.0
	- hashicorp/errwrap MPL-2.0
	- hashicorp/go-cleanhttp MPL-2.0
	- hashicorp/go-hclog MIT
	- hashicorp/go-immutable-radix MPL-2.0
	- hashicorp/go-msgpack MIT
	- hashicorp/go-multierror MPL-2.0
	- hashicorp/go-retryablehttp MPL-2.0
	- hashicorp/go-rootcerts MPL-2.0
	- hashicorp/go-sockaddr MPL-2.0
	- hashicorp/go-syslog MIT
	- hashicorp/go-uuid MPL-2.0
	- hashicorp/golang-lru MPL-2.0
	- hashicorp/hcl MPL-2.0
	- hashicorp/logutils MPL-2.0
	- hashicorp/mdns MIT
	- hashicorp/memberlist MPL-2.0
	- hashicorp/serf MPL-2.0
- [x] SkyWalking satellite @mrproliu 
	- hashicorp/consul/api MPL-2.0
	- hashicorp/consul/sdk MPL-2.0
	- hashicorp/errwrap MPL-2.0
	- hashicorp/go-cleanhttp MPL-2.0
	- hashicorp/go-immutable-radix MPL-2.0
	- hashicorp/go-msgpack MIT
	- hashicorp/go-multierror MPL-2.0
	- hashicorp/go-rootcerts MPL-2.0
	- hashicorp/go-sockaddr MPL-2.0
	- hashicorp/go-syslog MIT
	- hashicorp/go-uuid MPL-2.0
	- hashicorp/go.net BSD-3-Clause
	- hashicorp/golang-lru MPL-2.0
	- hashicorp/hcl MPL-2.0
	- hashicorp/logutils MPL-2.0
	- hashicorp/mdns MIT
	- hashicorp/memberlist MPL-2.0
	- hashicorp/serf MPL-2.0
- [x] SkyWalking Terraform (scripts) @kezhenxu94 
   - **No HashiCorp Dependency**
   - The scripts for Terraform users only. No hard requirement.

_The GitHub ID is listed about the PMC members did the evaluations._

## FAQ
### If I am using Consule to manage SkyWalking Cluster, does this license change bring an implication?

**YES**, anyone using their server sides would be affected once you upgrade to later released versions after Aug. 10th, 2023.

This is HashiCorp's statement
> End users can continue to copy, modify, and redistribute the code for all non-commercial and commercial use, except where providing a competitive offering to HashiCorp. Partners can continue to build integrations for our joint customers. We will continue to work closely with the cloud service providers to ensure deep support for our mutual technologies. Customers of enterprise and cloud-managed HashiCorp products will see no change as well.
Vendors who provide competitive services built on our community products will no longer be able to incorporate future releases, bug fixes, or security patches contributed to our products.

So, notice that, the implication about whether voilating BSL 1.1 is determined by the HashiCorp Inc about the status of the identified competitive relationship. We can't provide any suggestions.
Please refer to [FAQs and contacts](https://www.hashicorp.com/license-faq) for the official explanations.


### Will SkyWalking continoue to use HashiCorp Consul as an optional cluster coordinator and/or an optional dynamic configuration server?

For short term, **YES**, we will keep that part of codes, as the licenses of the SDK and the APIs are still in the MPL 2.0.

But, during the evaluation, we noticed the consul client we are using is [rickfast/consul-client](https://github.com/rickfast/consul-client) which had been archived by the owner on Jul 27, 2023. So, we are facing the issues that no maintaining and no version to upgrade.
If there is not a new consul Java client lib available, we may have to remove this to avoid CVEs or version incompatible with new released servers.