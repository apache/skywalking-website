---
title: "Release Apache SkyWalking CLI 0.2.0"
date: 2020-03-20
author: SkyWalking Team
---

SkyWalking CLI 0.2.0 is released. Go to [downloads](/downloads) page to find release tars.

- Support visualization of heat map
- Support top N entities, `swctl metrics top 5 --name service_sla`
- Support thermodynamic metrics, `swctl metrics thermodynamic --name all_heatmap`
- Support multiple linear metrics, `swctl --display=graph --debug metrics multiple-linear --name all_percentile`