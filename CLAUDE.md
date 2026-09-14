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
