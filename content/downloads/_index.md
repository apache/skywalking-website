---
title: "Downloads"
linkTitle: "Downloads"
descriptions: "Download the SkyWalking releases."
---

{{< downloads-block >}}


<div class="container verify">

## Verify the releases

It is essential that you verify the integrity of the downloaded files using the PGP or SHA signatures. Please download the KEYS as well as the .asc/.sha512 signature files for relevant distribution. It is recommended to get these files from the main distribution directory and not from the mirrors.

<div class="code-wrapper">
<div>

##### Verify using GPG/PGP

Download [PGP signatures KEYS](https://downloads.apache.org/skywalking/KEYS), and the release with its .asc signature file. And then:

```shell
# GPG verification
gpg --import KEYS
gpg --verify apache-skywalking-apm-***.asc apache-skywalking-apm-***
```
</div>

<div>

##### Verify using SHA512
Download the release with its .sha512 signature file. And then:

```shell
# SHA-512 verification
shasum -a 512 hadoop-X.Y.Z-src.tar.gz

```
</div>

</div>

</div>
