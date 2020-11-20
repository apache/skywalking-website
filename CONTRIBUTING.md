# How to Contribute

This guide will guide you on how to contribute to the site.

This site uses [Hugo](https://gohugo.io) to organize and manage content with the following sections are available:

## Homepage

Located at `content/_index.html`。

## Projects and Document

TODO

## Event

Located at `content/blog`.If you don't want to create a new blog, you need to create a new subdirectory under this directory. Here is a sample blog below.

```yaml
---
title: This is a title
date: 2020-04-28
author: Author
description: This is description.
---

Content
```

## Blog

Located at `content/blog`.If you don't want to create a new blog, you need to create a new subdirectory under this directory. Here is a sample blog below.

```yaml
---
title: This is a title
date: 2020-04-28
author: Author
description: This is description.
---

Content
```

## Downloads

This is a single page located at `content/downloads/_index.md`.

## Team

This is a single page located at `content/team/_index.md`.

## 中文博客

Located at `content/zh`.If you don't want to create a new blog, you need to create a new subdirectory under this directory. Here is a sample blog below.

```yaml
---
title: 博客标题
date: 2020-04-28
author: 作者姓名
description: 博客摘要
---

博客正文。
```

## Links

Configure in the `config.toml` file. 

## Website Configuration

The website configuration file located at `config.toml`.

## Images

The images within the blogs, events and 中文博客 should keep at the same folder as the blog file, and you should reference that with the relative path.