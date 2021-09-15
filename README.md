# Apache SkyWalking Website

This is the repository including all source codes of `https://skywalking.apache.org`.

## Preview and generate static files

This site was compiled using [Hugo](https://gohugo.io).

1. Install hugo
2. Run `npm install` to install the required libraries.
3. Pull this repo into your local environment, and run `hugo server` at the root folder, you can see the site preview from http://localhost:1313
4. To generate the static website, run `npm run build` for the whole website. Run `npm run build-with-docs` if you want to build the project documentations.

## Contributing

This guide will guide you on how to contribute to the site.

This site uses [Hugo](https://gohugo.io) to organize and manage content with the following sections are available:

### Homepage

Located at `content/_index.html`。

### Projects and Document

The data of documentation link is located in `data/docs.yml` and formated as `YAML`.

Update the [config file](https://github.com/algolia/docsearch-configs/blob/master/configs/skywalking.json) everytime in order that a new documentation version will be available searched by [algolia](https://www.algolia.com/).

### Event

Located at `content/events`. If you don't want to create a new blog, you need to create a new subdirectory under this directory. Here is a sample event below.

```yaml
---
title: This is a title
date: 2020-04-28
author: Author
description: This is description.
# endTime: 2021-04-24T23:59:59Z
# startTime: 2021-04-22T00:00:00Z
# buttonText: Go
# img: /images/skywalking_200x200.png
---

Content
```

If you want to display the summary in the popover in the lower right corner, you need to configure a parameter `endTime`. The parameters are as follows.

|Parameter|Description|Required|Default|
|----|----|----|----|
|endTime|End time|true|-|
|startTime|Start time|false|Current time|
|buttonText|Button text|false|Read more|
|img|The illustration|false|/images/skywalking_200x200.png|
|poster|The poster|false|-|

### Blog

Located at `content/blog`. If you want to create a new blog, you need to create a new subdirectory under this directory. Here is a sample blog below.

```yaml
---
title: This is a title
date: 2020-04-28
author: Author
description: This is description.
---

Content
```

### Downloads

The data of release is located in `data/releases.yml` and formated as `YAML`.
The data of docker image is located in `data/dockerImages.yml` and formated as `YAML`.

### Team

This is a single page located at `content/team/_index.md`.

### 中文博客

Located at `content/zh`. If you want to create a new blog, you need to create a new subdirectory under this directory. Here is a sample blog below.

```yaml
---
title: 博客标题
date: 2020-04-28
author: 作者姓名
description: 博客摘要
---

博客正文。
```

### User Wall

All user information are in `/data/users.yml`. Users are encouraged to add themselves to this page.

### Links

Configure in the `config.toml` file. 

### Website Configuration

The website configuration file located at `config.toml`.

### Images

The images within the blogs, events and 中文博客 should keep at the same folder as the blog file, and you should reference that with the relative path.
