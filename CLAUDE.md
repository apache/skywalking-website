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

## data/releases.yml Update

### Link rules
- **Latest version** (top entry): uses `https://www.apache.org/dyn/closer.cgi/skywalking/...` for download and `https://downloads.apache.org/skywalking/...` for asc/sha512.
- **Older versions**: use `https://archive.apache.org/dist/skywalking/...` for all links (download, asc, sha512).
- When adding a new version, insert it at the top and demote the previous latest version's links to `archive.apache.org`.

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

## data/docs.yml Update

When releasing a new version, update the component's `docs` section:

1. **Update `Latest`**: change its `commitId` to the new release tag's dereferenced commit SHA (for annotated tags, dereference with `gh api repos/apache/<repo>/git/tags/<tag-sha> --jq '.object.sha'`).
2. **Add new versioned entry**: insert a `v<VERSION>` entry right after `Latest` with the same commitId and link pattern `/docs/<repo-slug>/v<VERSION>/readme/`.
3. **Keep old versions** as-is.

`Latest` and the newest `v<VERSION>` entry **must carry the same commitId**. Steps 1
and 2 give that for free, but it is load-bearing beyond cosmetics: those two URL
trees render the same source, and `layouts/partials/seo/doc-canonical-map.html`
compares commitIds to decide which versioned pages point `rel=canonical` at
`/latest/`. If `Latest` drifts, the duplicate pair silently competes in search and
`/latest/` serves stale docs — BanyanDB sat on the v0.10.1 commit through two
releases this way.

### Docs entry types
Components use two styles in docs.yml:
- **Hugo-hosted docs** (have `repoUrl`): use `/docs/<repo-slug>/<version>/readme/` links with `commitId`. These have `Next`, `Latest`, and versioned entries.
- **GitHub-linked docs** (no `repoUrl`): use direct GitHub links like `https://github.com/apache/<repo>/tree/v<VERSION>`. These only have versioned entries, no `Latest`/`Next`.

### Getting the commitId
```bash
# Get tag object SHA
TAG_SHA=$(gh api repos/apache/<repo>/git/ref/tags/v<VERSION> --jq '.object.sha')
# Dereference annotated tag to actual commit
COMMIT_SHA=$(gh api repos/apache/<repo>/git/tags/$TAG_SHA --jq '.object.sha')
```

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
