# SkyWalking Website - AI Assistant Guide

## Git Commit Rules
- Do NOT add `Co-Authored-By` with Claude or any AI assistant in commit messages.

## Release Event Post

Event posts live in `content/events/<slug>/index.md`.
Slug format: `release-apache-skywalking-<component>-<version>` with dots replaced by dashes (e.g. `release-apache-skywalking-java-agent-9-6-0`).

### Frontmatter
```yaml
---
title: Release Apache SkyWalking <Component Name> <VERSION>
date: YYYY-MM-DD
author: SkyWalking Team
description: "Release Apache SkyWalking <Component Name> <VERSION>."
---
```

### Body
1. Opening: `SkyWalking <Component Name> X.X.X is released. Go to [downloads](/downloads) page to find release tars.`
2. `Changes by Version` header
3. Version number with `------------------` underline
4. Bullet list of user-facing changes from the source repo's `CHANGES.md` at the release tag. Exclude dependency bumps, build-only, and test-only items.
5. Closing: `All issues and pull requests are [here](<github milestone link>)`

## Chinese blog translation

Chinese editions of English posts live in `content/zh/<same directory name>/index.md`.
`content/zh` holds Chinese posts only; it is not a translated site.

**总原则：不逐句对齐英文，而是保留技术含义、重写中文句子。** 目标是让文章读起来像中文作者
自己写的，而不是翻译稿。

**抽象词还原为具体说法.** 英文技术写作偏爱高抽象名词，直译到中文会变空洞：

| 英文 | 不要 | 应该（视上下文） |
|------|------|------------------|
| cost / economics | 成本、经济性 | 时间、人力、精力、代价、负担、划不划算 |
| scope | 范围 | 边界、覆盖面、做到什么程度 |
| capability | 能力 | 能做什么（仅泛指时用"能力"） |
| pipeline / workflow | 管道、工作流 | 流水线、流程、一整套步骤、做法、怎么干 |
| compromise | 妥协 | 折中、退而求其次、不得不接受的方案 |
| affordable / sustainable / repeatable | 可负担、可持续、可重复 | 做得起、划算；能长期维护、不会越做越累；能反复执行、下次还能用 |

**改写英文句法为中文句法.** 不保留英文句子结构：

| 英文结构 | 翻译腔 | 中文写法 |
|----------|--------|----------|
| This means that... | 这意味着…… | 问题在于…… / 换句话说…… |
| What changed was... | 真正改变的是…… | 关键变化是…… / 变化在于…… |
| The result was not X but Y | 结果不是X而是Y | 最终产出的不只是X，更重要的是Y |
| It is X that matters | 重要的是X | X才是关键 |
| ...which makes it... | ……这使得它…… | ……所以…… / ……于是…… |
| by doing X, we achieved Y | 通过做X，我们实现了Y | 做了X之后，Y就…… |

长定语从句拆成短句；英文的动词并列（scanning, compiling, and regenerating）要断句或用顿号；
一句话里超过三个"的"就拆句。

**被动语态改成主动或无主语：** `X was replaced by Y` → 我们用Y替换了X（不要"X被Y替换了"）；
`It can be observed that` → 从结果来看 / 实际上。

**术语.** 保留英文：专有名称与代码标识（GraalVM, Native Image, AOT, SPI, FQCN, OAL, MAL, LAL,
BanyanDB, same-FQCN, classpath, manifest）、工具名（Claude Code, Docker, Kubernetes）、项目名
（Apache SkyWalking）。中文化普通技术词：replacement classes → 替换类；drift detector → 漂移检测；
consistency check → 一致性检查；code comprehension → 读懂代码。

**语气.** 专业但不板着脸，可用"我们""说实话"这类第一人称；段落不要照搬英文的长段。

**Frontmatter.** `title` 和 `description` 用中文重写而不是直译；`author` 的 "Sheng Wu" 改为
"吴晟"；`date` 和 `tags` 保持不变。

Before finishing, check: no `这意味着` / `真正改变的是` style translation-ese, abstract words
resolved to concrete ones, no passive voice left, long clauses split, terminology handled
consistently — and that it reads as if written in Chinese.

## Project configuration

`data/projects.yml` owns the catalog, project metadata, documentation versions,
downloads, and container images. Its structure is `catalogs[]` → `projects[]` →
`next.docs` / `releases[]` / `dockerImages[]`. Catalogs have `id`, `name`, `description`, and optional
`note`; project `featured` and `menu` metadata control cards and shortcuts, with
shortcut groups in the top-level `menu` list. Keep repository identities and
existing `downloadAliases` stable.

`dockerImages` belongs to the project, alongside `releases`. Each item has `name`
and `link`, with optional presentation metadata. These links point to Docker Hub
repositories and remain available independently of the selected release.

`data/get-started.yml` owns both Showcase and platform installation, separate
from `data/projects.yml`. Its `showcase` block contains Showcase metadata,
`next.docs`, and `quickstart`; its `skywalking` block contains installation commands.
See the complete YAML example in README.md. Run `node scripts/project-config.js`
for local configuration validation without fetching repositories or artifacts.

## Releases in data/projects.yml

Each release has `version` and a boolean `latest`. Keep exactly one `latest: true`
per project with releases; unreleased projects can have `releases: []`. A release
can contain optional `docs`, `downloads`, `label`, and `date`.
Each `downloads` item has `name`, `type` (`source` or `binary`), and `link`, with
`asc` and `sha512` supplied together when available. Keep container images on the
project rather than in releases; they are not version-pinned image tags.

### Link rules
- **Latest active release** (`latest: true`, top entry): uses `https://www.apache.org/dyn/closer.cgi/skywalking/...` for download and `https://downloads.apache.org/skywalking/...` for asc/sha512.
- **Older versions**: use `https://archive.apache.org/dist/skywalking/...` for all links (download, asc, sha512).
- When adding a new version, insert it at the top with `latest: true`, set the previous latest to `latest: false`, and move its Apache download/signature/checksum links to `archive.apache.org`. Preserve registry links and documentation pins.
- **Archived projects**: set project `archived: true` and use archive URLs even for the final release marked `latest: true`.

### URL pattern
All components follow: `skywalking/<url-path-segment>/<version>/<artifact-filename>`

### Component reference

| Component | URL path segment | Artifact prefix | Source v-prefix | Dist v-prefix |
|-----------|-----------------|-----------------|-----------------|---------------|
| SkyWalking APM | (version only) | `apache-skywalking-apm-` | yes | yes |
| Java Agent | `java-agent/` | `apache-skywalking-java-agent-` | no | yes |
| Python Agent | `python/` | `skywalking-python-` | yes | yes |
| Go Agent | `go/` | `apache-skywalking-go-` | yes | yes |
| NodeJS Agent | `node-js/` | `skywalking-nodejs-` | yes | no |
| Rust Agent | `rust/` | `skywalking-` | yes | yes |
| PHP Agent | `php/` | `skywalking_agent-` | yes | yes |
| Client JavaScript | `client-js/` | `skywalking-client-js-` | yes | yes |
| Ruby Agent | `ruby/` | `skywalking-ruby-` | yes | yes |
| Nginx LUA Agent | `nginx-lua/` | `skywalking-nginx-lua-` | yes | yes |
| Satellite | `satellite/` | `apache-skywalking-satellite-` | yes | yes |
| Rover | `rover/` | `apache-skywalking-rover-` | yes | yes |
| CLI | `cli/` | `skywalking-cli-` | yes | yes |
| Kubernetes Helm | `kubernetes/` | `skywalking-helm-` | yes | (source only) |
| SWCK | `swck/` | `skywalking-swck-` | yes | yes |
| BanyanDB Server | `banyandb/` | `skywalking-banyandb-` | yes | yes |
| BanyanDB Java Client | `banyandb-java-client/` | `apache-skywalking-banyandb-java-client-` | yes | yes |
| BanyanDB Helm | `banyandb-helm/` | `skywalking-banyandb-helm-` | yes | (source only) |
| Eyes | `eyes/` | `skywalking-license-eye-` | yes | yes |
| Infra E2E | `infra-e2e/` | `skywalking-e2e-` | yes | yes |

### Date format
Use `Mon. DDth, YYYY` with ordinal suffixes: 1st, 2nd, 3rd, all others th (e.g. `Feb. 16th, 2026`).

## Documentation in data/projects.yml

- `next.docs` defines development documentation through `link`, optional explicit
  `commitId`, and optional display `label`.
- A release's `docs.link` and `docs.commitId` define its numbered documentation;
  optional `docs.label` customizes its displayed name.
- On the release marked `latest: true`, `docs.latestLink` generates the Latest
  entry and requires an explicit `docs.latestCommitId`. Do not add separate
  `Next` or `Latest` releases.
- Hugo-hosted documentation needs project `repoUrl` and paths of the form
  `/docs/<repo-slug>/<version>/readme/`. External documentation can use HTTP(S)
  links in either `next.docs` or release `docs`.

**Explicit documentation commit pins are authoritative.** `docs.commitId` and
`docs.latestCommitId` can intentionally differ from each other and from the
release tag. Preserve them exactly; never infer, replace, or synchronize them
from tag commits. Set new pins only from explicitly supplied documentation
revisions, and leave existing pins unchanged during unrelated release updates.

`layouts/partials/seo/doc-canonical-map.html` compares the generated entries'
commit IDs. A numbered tree canonicalizes to Latest only when their explicit
pins match. Different pins remain self-canonical; do not alter pins to force a
canonical relationship.

## SEO metadata

`layouts/partials/seo/` owns every search-facing tag; it is wired in once through
`layouts/partials/hooks/head-end.html`, so the theme stays unforked.

- `meta.html` — `rel=canonical`, `<meta name="description">`, en/zh `hreflang`
- `doc-canonical-map.html` — the commitId rule described above
- `schema.html` — JSON-LD (Organization, SoftwareApplication, BlogPosting, TechArticle, BreadcrumbList)
- `lang.html` — the `<html lang>` value, derived from the URL because `content/zh`
  is a section rather than a Hugo language

Rules that are easy to break:

- **`baseURL` in config.toml must stay absolute.** Sitemap `<loc>`, `og:url` and
  canonical all derive from it, and the sitemaps.org spec rejects relative `<loc>`.
- **`<title>` is emitted only by `themes/docsy/layouts/partials/head.html`.** Every
  `baseof.html` used to repeat it, giving each page two. Do not add it back.
- **`content/zh` holds Chinese blog posts only** — not a translated site. Adding a
  `[languages]` block would restructure those URLs and strand the `layouts/zh/`
  templates, for no gain.
- The home page's `<title>` comes from `seo_title` in `content/_index.html` front
  matter; every other page uses `Page | Apache SkyWalking`.
