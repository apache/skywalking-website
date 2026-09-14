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

The Projects catalog is at `/docs/`. `data/projects.yml` is the shared source for
catalogs, project identities, documentation, releases, downloads, and container
images. Each `catalogs` entry has an `id`, `name`, `description`, optional `note`,
and a `projects` list. Optional project `featured` and `menu` fields control
featured cards and menu shortcuts; the top-level `menu` list configures shortcut
groups. Project shortcuts open the matching catalog card, where visitors can
choose documentation or downloads.

Development documentation belongs in `next.docs`. Released versions belong in
`releases`, with exactly one `latest: true` when the list is nonempty. Projects
without releases can use `releases: []`. For example:

```yaml
catalogs:
  - id: SkyWalkingServers
    name: Platform & visualization
    description: Analyze telemetry and explore your systems.
    projects:
      - name: SkyWalking
        repo: skywalking
        user: apache
        repoUrl: https://github.com/apache/skywalking.git
        description: SkyWalking primary repository and docs.
        next:
          docs:
            link: /docs/main/next/readme/
        releases:
          - version: v11.0.0
            latest: true
            docs:
              link: /docs/main/v11.0.0/readme/
              commitId: 6f1fd78e872f1d380a14f271c26e8d68eb2430fc
              latestLink: /docs/main/latest/readme/
              latestCommitId: 6f1fd78e872f1d380a14f271c26e8d68eb2430fc
            downloads:
              - name: Source archive
                type: source
                link: https://www.apache.org/dyn/closer.cgi/skywalking/11.0.0/apache-skywalking-apm-11.0.0-src.tar.gz
                asc: https://downloads.apache.org/skywalking/11.0.0/apache-skywalking-apm-11.0.0-src.tar.gz.asc
                sha512: https://downloads.apache.org/skywalking/11.0.0/apache-skywalking-apm-11.0.0-src.tar.gz.sha512
        dockerImages:
          - name: SkyWalking OAP Server
            link: https://hub.docker.com/r/apache/skywalking-oap-server
menu: []
```

`docs.link` and `docs.commitId` define the numbered documentation. The latest
release's `docs.latestLink` generates the Latest documentation choice and requires
its own explicit `docs.latestCommitId`. **These two commit pins are authoritative
and may intentionally differ from each other and from the release tag. Preserve
them exactly; never infer or replace them from tags.** Optional `docs.label`
customizes the displayed version name, including for `next.docs`.

Each release can have documentation, downloads, or both. Each download has `name`,
`type` (`source` or `binary`), and `link`; provide `asc` and `sha512` together when
available. Each project's `dockerImages` array sits alongside `releases` and
contains named Docker Hub repository links with optional descriptions. Images
remain available independently of the selected release; they are repository
links rather than version-pinned image tags.
Run `node scripts/project-config.js` to validate the configuration locally without
fetching documentation or release artifacts.

The desktop header keeps Blogs beside Projects, followed by Release Posts,
Event Calendar, Users, Team, and 中文博客 in that priority order as space allows.
A More dropdown appears only when some links do not fit.
`assets/js/adaptive-navigation.js` measures the available width. The mobile
drawer uses a flat page list, with Projects opening the catalog directly and
Downloads and Get started available as separate links.

The dedicated `/downloads/` page reads each project's releases from the same
`data/projects.yml`. Project `downloadAliases` preserve published download links
by directing them to the matching project on the download page.
The download sidebar groups projects into expandable categories, opens search
matches automatically, and keeps the selected project's category expanded.

The separate `/get-started/` page contains Showcase and installation quickstarts.
Both come from `data/get-started.yml`, separate from the project catalog. Its
`showcase` block contains Showcase's identity, `next.docs`, and `quickstart`
commands; its `skywalking` block contains platform installation commands.

`showcase.diagram` defines the interactive application and observability graphs,
request paths, and optional scenarios. Node IDs must be unique within a view;
edges and paths reference those IDs, while `column`, `row`, and optional `rowSpan`
place the desktop cards. Keep the graph aligned with the Showcase README,
service code, and Docker/Kubernetes scenario manifests, including platform support. H2 belongs to
the music application; BanyanDB stores SkyWalking telemetry. Show ecosystem
integrations separately from native agents: the Showcase collectors export
OTLP metrics, while its Kubernetes mesh scenario supplies ALS access logs and
Zipkin traces. Broader receiver capabilities belong in the component details.
The documentation link comes from `showcase.next.docs.link`.

#### Search and AI answers

The navbar Search button and Command/Ctrl+K open Kapa.ai in search mode, with AI
answers available in the same dialog. The bundled widget is configured in
`themes/docsy/layouts/partials/scripts.html`; it uses `.sw-kapa-search` as its
search launcher, while the floating Ask AI button opens AI answers. Algolia
DocSearch and offline search are disabled in `config.toml`.

Release managers of SkyWalking projects should use the Kapa.ai [dashboard](https://app.kapa.ai/) to sync and ingest new documentation/blogs/FAQs if needed, or set up automatic refresh (crawling) of the search and AI sources.

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

### Event Calendar

Located at `data/talks.yml`, rendered on the standalone **Event Calendar** page at
`/events/calendar/`, linked from the top menu. Conference talks, meetups and summits
go here. **Release Posts** opens the separate monthly archive at
`/events/`, populated from `content/events`.

To add or update a talk, edit `data/talks.yml` and open a pull request. You can do it
entirely in the browser: use the **Add your talk** link on the calendar page, or the
GitHub *Edit* button on the file. No local Hugo setup needed.

Give each event a unique lowercase ASCII kebab-case `id` containing its name and
year. Keep the ID permanent even if the title or date changes. **Share event**
copies a link of the form `/events/calendar/#<id>`; links to older events open
the matching year automatically. Numeric-only fragments such as `#2023` remain
reserved for year filters.

```yaml
events:
  - event: Community Over Code Asia 2026
    id: community-over-code-asia-2026
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
|id|Unique permanent ASCII kebab-case name with year; do not change with the title or date|true|-|
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

If a required field is missing, an ID is invalid or duplicated, or a date isn't
in `YYYY-MM-DD` form, the build fails
with a message naming the offending event — so a broken entry shows up as a failed
check on the pull request rather than as a blank card on the site.

### Feeds

| Feed | Contents |
|----|----|
|`/blog/feed.xml`|English blog|
|`/zh/feed.xml`|中文博客|
|`/events/feed.xml`|Releases and community announcements|
|`/feed.xml`|Combined blog, releases and community announcements|
|`/events/calendar/index.ics`|Event calendar, subscribable in a calendar app|

RSS is opt-in per section via `outputs` in that section's `_index.md`, not through
`[outputs] section` in `config.toml`, which would also build a feed for `docs`.
`rss_sections` and `rss_limit` in `config.toml` control the combined feed and the
window size. The template is `layouts/_default/list.rss.xml`.

The calendar feed is generated from `data/talks.yml` by
`layouts/events/calendar.calendar.ics`. Use the `webcal://` link on the calendar
page to subscribe — downloading the `.ics` imports a snapshot that never updates.

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

Edit the project's `releases` in `data/projects.yml`. Add the new release first,
set `latest: true`, and change the previous latest release to `latest: false`.
For an active project's latest release, use Apache's `closer.cgi` mirror URL for downloads and
`downloads.apache.org` for signatures and checksums. Move older releases' Apache
download, signature, and checksum links to `archive.apache.org/dist/skywalking/`.
Archived projects use `archived: true` and archive URLs, including for their final
release. Preserve existing documentation pins when updating release links.

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
