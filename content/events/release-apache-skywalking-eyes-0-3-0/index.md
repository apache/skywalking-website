---
title: "Release Apache SkyWalking Eyes 0.3.0"
date: 2022-05-14
author: "[SkyWalking Team](/team)"
description: "Release Apache SkyWalking Eyes 0.3.0."
---

SkyWalking Eyes 0.3.0 is released. Go to [downloads](/downloads) page to find release tars.

- Dependency License
  - Fix license check in go library testify (#93)

- License Header
  - `fix` command supports more languages:
    - Add comment style for cmake language (#86)
    - Add comment style for hcl (#89)
    - Add mpl-2.0 header template (#87)
    - Support fix license header for tcl files (#102)
    - Add python docstring comment style (#100)
    - Add comment style for makefile & editorconfig (#90)
  - Support config license header comment style (#97)
  - Trim leading and trailing newlines before rewrite license header cotent (#94)
  - Replace already existing license header based on pattern (#98)
  - [docs] add the usage for config the license header comment style (#99)

- Project
  - Obtain default github token in github actions (#82)
  - Add tests for bare spdx license header content (#92)
  - Add github action step summary for better experience (#104)
  - Adds an option to the action to run in `fix` mode (#84)
  - Provide `--summary` flag to generate the license summary file (#103)
  - Add .exe suffix to windows binary (#101)
  - Fix wrong file path and exclude binary files in src release (#81)
  - Use t.tempdir to create temporary test directory (#95)
  - Config: fix incorrect log message (#91)
  - [docs] correct spelling mistakes (#96)
