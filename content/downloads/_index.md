---
title: "Downloads"
linkTitle: "Downloads"
descriptions: "Download the SkyWalking releases."
---

{{< downloads-block >}}


# Verify the releases

[PGP signatures KEYS](https://downloads.apache.org/skywalking/KEYS)

It is essential that you verify the integrity of the downloaded files using the PGP or SHA signatures. The PGP signatures can be verified using GPG or PGP. Please download the KEYS as well as the asc signature files for relevant distribution. It is recommended to get these files from the main distribution directory and not from the mirrors.

```
gpg -i KEYS

or

pgpk -a KEYS

or

pgp -ka KEYS
```

To verify the binaries/sources you can download the relevant asc files for it from main distribution directory and follow the below guide.

```
gpg --verify apache-skywalking-apm-********.asc apache-skywalking-apm-*********

or

pgpv apache-skywalking-apm-********.asc

or

pgp apache-skywalking-apm-********.asc
```
