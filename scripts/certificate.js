// Builds the data of the Certificate of Contribution (/certificate/):
//
// - assets/certificate/people.json: today's contributors per repository, grouped into the
//   contribution categories of data/repositories.yml, plus the PMC and committers. The page
//   draws certificates from it and it is rebuilt every time.
// - static/certificate/verify/<date>.txt: the code of every certificate that can be issued
//   today, after a header line naming the day's categories in polygon order, so a verified
//   polygon is labelled as it was issued. This is the only certificate data the site keeps:
//   the deploy carries certificate/verify/ forward on asf-site, so a certificate stays
//   verifiable for good.
//
// Run after `npm run team`; without data/team.yml only members are listed.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
// js-yaml, not yamljs: yamljs reads an unquoted login such as 0xAlanYin as a hex number.
const yaml = require('js-yaml');
const {loadProjectConfig} = require('./project-config');
const model = require('../assets/js/certificate/model');

const root = path.join(__dirname, '..');

function buildPeople(team, committee, catalog, date) {
  const categoryOf = {};
  catalog.categories.forEach(category => category.repos.forEach(repo => { categoryOf[repo.toLowerCase()] = category.id; }));
  const buckets = {};
  for (const group of team.projects || []) {
    for (const item of group.list || []) {
      if (!item.repo) continue;
      const category = categoryOf[`${item.user}/${item.repo}`.toLowerCase()];
      if (!category) throw new Error(`certificate: ${item.user}/${item.repo} is not listed in data/repositories.yml`);
      const contributors = item.contributors || [];
      // Only GitHub accounts with a commit count get a certificate: anonymous commits, bots and
      // name-only acknowledgements (projects.yml extraContributors, e.g. "Adrian Cole") cannot be
      // verified. Ranks keep their position in the full list.
      const rows = contributors
        .map((c, i) => ({l: String(c.login), n: c.contributions, r: i + 1, type: c.type}))
        .filter(row => row.type !== 'Anonymous' && !row.l.endsWith('[bot]') && Number.isInteger(row.n) && row.n > 0)
        .map(({l, n, r}) => ({l, n, r}));
      (buckets[category] = buckets[category] || []).push({
        name: item.name,
        label: item.name.replace(/^\((Archived|Retired|Experimental|outdated)\)\s*/, ''),
        archived: /^\((Archived|Retired|outdated)\)/.test(item.name),
        icon: item.icon || null,
        of: contributors.length,
        contributors: rows,
      });
    }
  }
  return {
    generated: date,
    totalPeople: team.totalCount || 0,
    catalogs: catalog.categories.map(c => ({id: c.id, name: c.name, repos: buckets[c.id] || []})),
    members: {pmc: committee.pmc || [], committer: committee.committer || []},
  };
}

function codeFor(date, facts) {
  const digest = crypto.createHash('sha256').update(model.canonical(date, facts), 'utf8').digest();
  return model.encode(digest);
}

function issuedCodes(people, date) {
  const idx = model.index(people);
  return model.everyone(idx)
    .map(query => codeFor(date, model.facts(people, idx, model.resolve(idx, query))))
    .sort();
}

// The day file: a '#' header with the categories in order, then one code per line.
function dayFile(people, date) {
  const header = '# ' + JSON.stringify({categories: people.catalogs.map(c => c.name)});
  return [header, ...issuedCodes(people, date)].join('\n') + '\n';
}

function main() {
  const date = new Date().toISOString().slice(0, 10);
  const config = loadProjectConfig(root);
  const teamFile = path.join(root, 'data/team.yml');
  const load = file => yaml.safeLoad(fs.readFileSync(file, 'utf8'));
  const team = fs.existsSync(teamFile) ? load(teamFile) : {};
  const committee = load(path.join(root, 'data/committee.yml'));
  const people = buildPeople(team, committee, config.repositoryCatalog, date);

  fs.mkdirSync(path.join(root, 'assets/certificate'), {recursive: true});
  fs.writeFileSync(path.join(root, 'assets/certificate/people.json'), JSON.stringify(people));
  const verifyDir = path.join(root, 'static/certificate/verify');
  fs.mkdirSync(verifyDir, {recursive: true});
  const day = dayFile(people, date);
  fs.writeFileSync(path.join(verifyDir, `${date}.txt`), day);
  const count = day.split('\n').filter(line => line && !line.startsWith('#')).length;
  console.log(`certificate: ${count} certificate codes for ${date}${team.projects ? '' : ' (no data/team.yml: members only)'}.`);
}

module.exports = {buildPeople, codeFor, issuedCodes, dayFile};

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
