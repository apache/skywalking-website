const process = require('process');
const path = require('path');
const fs = require('fs');
const YAML = require('yamljs');
const axios = require('axios');

const {promises} = fs;
const docsFile = path.join(__dirname, '../data/docs.yml');
const starsFile = path.join(__dirname, '../data/stars.yml');

const SLEEP_MS = 1500;
const sleep = (ms = SLEEP_MS) => new Promise((r) => setTimeout(r, ms));

function loadYaml(file) {
  return new Promise((resolve) => YAML.load(file, (data) => resolve(data)));
}

function loadCached() {
  try {
    return YAML.load(starsFile) || {repos: {}};
  } catch (_) {
    return {repos: {}};
  }
}

function collectRepos(docs) {
  const repos = new Map();
  for (const group of docs) {
    for (const item of group.list || []) {
      if (item && item.user && item.repo) {
        repos.set(`${item.user}/${item.repo}`, {user: item.user, repo: item.repo});
      }
    }
  }
  return [...repos.values()];
}

async function fetchOne({user, repo}) {
  const url = `https://api.github.com/repos/${user}/${repo}`;
  const headers = {'User-Agent': 'skywalking-website-build'};
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  // one transient-error retry — GH occasionally drops the connection
  let lastErr;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const {data} = await axios.get(url, {headers, timeout: 15000});
      return {
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
        watchers: data.subscribers_count || 0,
        openIssues: data.open_issues_count || 0,
      };
    } catch (err) {
      lastErr = err;
      const transient = err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED';
      if (!transient) break;
      await sleep(2000);
    }
  }
  throw lastErr;
}

function hasUsableValue(entry) {
  return entry && (entry.stars > 0 || entry.forks > 0);
}

async function main() {
  const docs = await loadYaml(docsFile);
  const cached = loadCached();
  const repos = collectRepos(docs);

  const out = {repos: {...cached.repos}, totals: {stars: 0, forks: 0, repos: repos.length}, generatedAt: new Date().toISOString()};

  let failures = 0, skipped = 0;
  for (const r of repos) {
    const key = `${r.user}/${r.repo}`;
    try {
      const data = await fetchOne(r);
      out.repos[key] = data;
      console.log(`${key}  ★ ${data.stars}`);
    } catch (err) {
      failures++;
      const status = err.response && err.response.status;
      const prev = cached.repos && cached.repos[key];
      if (hasUsableValue(prev)) {
        out.repos[key] = prev;
        console.warn(`${key}  fetch failed (${status || err.code}) — using cached ★ ${prev.stars}`);
      } else {
        delete out.repos[key];
        skipped++;
        console.warn(`${key}  fetch failed (${status || err.code}) — no usable cache, omitting`);
      }
    }
    await sleep();
  }

  for (const key of Object.keys(out.repos)) {
    out.totals.stars += out.repos[key].stars || 0;
    out.totals.forks += out.repos[key].forks || 0;
  }

  await promises.writeFile(starsFile, YAML.stringify(out, 4, 2), 'utf8');
  console.log(`\nstars.yml written: ${Object.keys(out.repos).length}/${repos.length} repos, ${failures} failures (${skipped} omitted), ★ ${out.totals.stars} total`);
}

main().catch((err) => {
  console.error(err);
  if (fs.existsSync(starsFile)) {
    console.warn('stars script failed; keeping existing data/stars.yml');
    process.exit(0);
  }
  process.exit(1);
});
