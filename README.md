# Apache SkyWalking Website

This is the repository including all source codes of `https://skywalking.apache.org`.

## Preview and generate static files

This site was compiled using [Hugo](https://gohugo.io).

1. Install [Hugo](https://gohugo.io/installation/) 
2. Pull this repo into your local environment, and run `npm install` to install the required libraries (without pulling the project documentation).
3. Run `hugo server` at the root folder, you can see the site preview from http://localhost:1313
4. To generate the static website, run `npm run build` for the whole website. Run `npm run build-with-docs` if you want to build the project documentations.

## Contributing

This guide will guide you on how to contribute to the site.

This site uses [Hugo](https://gohugo.io) to organize and manage content with the following sections are available:

### Homepage

Located at `content/_index.html`。

### Projects and Documentation

The data of documentation link is located in `data/docs.yml` and formated as `YAML`.

#### Search Engine
Update the [config file](https://github.com/algolia/docsearch-configs/blob/master/configs/skywalking.json) everytime, so that a new documentation version will be available searched by [algolia](https://www.algolia.com/).

#### AI Docs Q&A
Release managers of SkyWalking projects should use the Kapa.ai [dashboard](https://app.kapa.ai/) to sync and ingest new documentation/blogs/FAQs if needed, or set up automatic refresh (crawling) of the Q&A sources.

If you need access to the dashboard, contact @superskyyy for an invitation.

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

### Community Calendar

Located at `data/talks.yml`, rendered at `/events/calendar/`. This is where conference
talks, meetups and summits go — the release timeline at `/events/` is driven by
`content/events` instead, and the two do not mix.

To add or update a talk, edit `data/talks.yml` and open a pull request. You can do it
entirely in the browser: use the **Add your talk** link on the calendar page, or the
GitHub *Edit* button on the file. No local Hugo setup needed.

```yaml
events:
  - event: Community Over Code Asia 2026
    intro: >-
      One or two sentences on what this conference is, for readers who
      have never heard of it.
    start: "2026-08-07"
    end: "2026-08-09"          # omit for a single-day event
    location: Beijing, China   # or "Online"
    venue: Mountain Yang Hall  # optional
    url: https://asia.communityovercode.org
    recap: /zh/2023-08-20-coc-asia-2023/   # optional, a recap post on this site
    talks:
      - title: "Observing LLM Applications with SkyWalking 10.4"
        speaker: 邵一鸣 YiMing Shao
        date: "2026-08-09"     # only when it differs from the event start
        time: 13:30 GMT+8
        room: Mountain Yang Hall
        url: https://asia.communityovercode.org/sessions/observability-1206017.html
        video: https://www.bilibili.com/video/BVxxxxxxxxx
        intro: >-
          One or two sentences on what the session covers, in the same
          language as the title.
```

Event fields:

|Parameter|Description|Required|Default|
|----|----|----|----|
|event|Conference / meetup name|true|-|
|start|Start date, `"YYYY-MM-DD"`, zero-padded|true|-|
|end|End date, for multi-day events|false|`start`|
|location|`City, Country`, or `Online`|true|-|
|venue|Venue name|false|-|
|intro|What this conference is, in one or two sentences|true|-|
|url|Event home page. Omit rather than guess|false|-|
|recap|Link to a recap post on this site|false|-|
|talks|One or more sessions|true|-|

Session fields, under `talks`:

|Parameter|Description|Required|Default|
|----|----|----|----|
|title|Session title|true|-|
|speaker|Speaker name. Use `中文名 English Name` when both are known|true|-|
|intro|What the session covers. Condense the published abstract; don't invent one|false|-|
|date|Session day, when it differs from the event `start`|false|`start`|
|time|e.g. `13:30 GMT+8`|false|-|
|room|Room name|false|-|
|url|Session page|false|-|
|video|Recording|false|-|
|slides|Slide deck|false|-|

Two things happen on their own, so you don't need to maintain them:

- **Upcoming vs. past** is decided at build time from the event's `end` date, and the
  site rebuilds daily, so an event moves itself into the past section once it is over.
- **The year pager** under *Past* builds its year buttons and counts from the data, so
  a new year appears as soon as an event needs it.

If a required field is missing, or a date isn't in `YYYY-MM-DD` form, the build fails
with a message naming the offending event — so a broken entry shows up as a failed
check on the pull request rather than as a blank card on the site.

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

The website configuration file is located at `config.toml`.

### Images

The images within the blogs, events and 中文博客 should be kept at the same folder as the blog file, and you should reference them with the relative path.
