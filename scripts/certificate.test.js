const assert = require('node:assert/strict');
const test = require('node:test');
const {buildPeople, codeFor, issuedCodes, dayFile} = require('./certificate');
const model = require('../assets/js/certificate/model');

const catalog = {categories: [
  {id: 'main', name: 'Main', repos: ['apache/main']},
  {id: 'agent', name: 'Agent', repos: ['apache/agent', 'SkyAPM/Old-Agent']},
]};
const committee = {pmc: [{name: 'Pat Lead (Project V.P.)', apacheId: 'pat', github: 'pat-gh'}], committer: [{name: 'Cy Commit', apacheId: 'cy'}]};

function team() {
  const person = (login, contributions, type = 'User') => ({login, contributions, type});
  return {totalCount: 6, projects: [{type: 'Platform', list: [
    {name: null, descriptionItem: 'Catalog note'},
    {name: 'Main', user: 'apache', repo: 'main', icon: 'main', contributors: [
      person('pat-gh', 50), person('someone**', 9, 'Anonymous'), person('ann', 5), person('dependabot[bot]', 4), person('0xAlanYin', 1),
      // Appended by scripts/team.js from projects.yml extraContributors: a name, no count.
      {login: 'Adrian Cole'}, {login: 'github-actions[bot]'},
    ]},
  ]}, {type: 'Agents', list: [
    {name: 'Agent', user: 'apache', repo: 'agent', contributors: [person('ann', 7), person('pat-gh', 2)]},
    {name: '(Archived) Old Agent', user: 'SkyAPM', repo: 'old-agent', contributors: [person('ann', 1)]},
  ]}]};
}

test('people data keeps verifiable contributors, their ranks and the catalog order', () => {
  const people = buildPeople(team(), committee, catalog, '2026-10-20');
  assert.equal(people.generated, '2026-10-20');
  assert.deepEqual(people.catalogs.map(c => c.id), ['main', 'agent']);
  const main = people.catalogs[0].repos[0];
  // Anonymous commits, bots and name-only extras are dropped; ranks keep their position.
  assert.deepEqual(main.contributors, [{l: 'pat-gh', n: 50, r: 1}, {l: 'ann', n: 5, r: 3}, {l: '0xAlanYin', n: 1, r: 5}]);
  assert.equal(main.of, 7);
  const old = people.catalogs[1].repos[1];
  assert.equal(old.label, 'Old Agent');
  assert.equal(old.archived, true);
  assert.equal(old.icon, null);
});

test('a repository missing from data/repositories.yml stops the build', () => {
  const data = team();
  data.projects[1].list.push({name: 'New', user: 'apache', repo: 'new', contributors: []});
  assert.throws(() => buildPeople(data, committee, catalog, '2026-10-20'), /apache\/new is not listed in data\/repositories.yml/);
});

test('facts carry role, totals and the 10% rank band of every category', () => {
  const people = buildPeople(team(), committee, catalog, '2026-10-20');
  const idx = model.index(people);
  const pat = model.facts(people, idx, model.resolve(idx, {contributor: 'pat-gh'}));
  // A member's GitHub login resolves to the member.
  assert.deepEqual(pat, {key: 'member:pat', role: 'p', total: 52, projects: 2, bands: 'a5'});
  const ann = model.facts(people, idx, model.resolve(idx, {contributor: 'ANN'}));
  // Main: ann is #2 of 3, band 10 - floor(1 * 10 / 3) = 7; Agent: #1 of 2, band 10.
  assert.deepEqual(ann, {key: 'contributor:ann', role: 'x', total: 13, projects: 3, bands: '7a'});
  // A member without GitHub data has no totals and empty bands.
  const cy = model.facts(people, idx, model.resolve(idx, {member: 'cy'}));
  assert.deepEqual(cy, {key: 'member:cy', role: 'c', total: null, projects: 0, bands: '00'});
  assert.equal(model.canonical('2026-10-20', cy), 'v1|2026-10-20|member:cy|c||0|00');
});

test('codes are 80 bits of SHA-256 in Crockford base32, and change with any fact', () => {
  assert.equal(model.encode(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])), '000G40R40M30E209');
  const facts = {key: 'member:wusheng', role: 'p', total: 8193, projects: 48, bands: 'aaaaaaaa'};
  assert.equal(codeFor('2026-10-20', facts), 'Z1JQ11JK2CGHW9DZ');
  assert.notEqual(codeFor('2026-10-20', {...facts, total: 8194}), 'Z1JQ11JK2CGHW9DZ');
  assert.notEqual(codeFor('2026-10-21', facts), 'Z1JQ11JK2CGHW9DZ');
});

test('the day list holds one code for every member and every other contributor', () => {
  const people = buildPeople(team(), committee, catalog, '2026-10-20');
  const codes = issuedCodes(people, '2026-10-20');
  // pat (member, also pat-gh), cy (member), ann and 0xAlanYin (contributors).
  assert.equal(codes.length, 4);
  assert.deepEqual(codes, [...codes].sort());
  const idx = model.index(people);
  assert.ok(codes.includes(codeFor('2026-10-20', model.facts(people, idx, model.resolve(idx, {contributor: '0xalanyin'})))));
});

test('the day file names the day\'s categories in order before the codes', () => {
  const people = buildPeople(team(), committee, catalog, '2026-10-20');
  const lines = dayFile(people, '2026-10-20').trim().split('\n');
  assert.equal(lines[0], '# {"categories":["Main","Agent"]}');
  assert.deepEqual(lines.slice(1), issuedCodes(people, '2026-10-20'));
});

test('logins and IDs that are names of JavaScript object members are ordinary keys', () => {
  const data = team();
  data.projects[0].list[1].contributors.push({login: 'constructor', contributions: 3, type: 'User'}, {login: '__proto__', contributions: 2, type: 'User'});
  const people = buildPeople(data, committee, catalog, '2026-10-20');
  const idx = model.index(people);
  assert.equal(model.facts(people, idx, model.resolve(idx, {contributor: 'constructor'})).total, 3);
  assert.equal(model.facts(people, idx, model.resolve(idx, {q: '__proto__'})).total, 2);
  assert.equal(model.resolve(idx, {member: 'constructor'}), null);
  assert.equal(model.resolve(idx, {q: 'toString'}), null);
});
