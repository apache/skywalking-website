const assert = require('node:assert/strict');
const test = require('node:test');
const {validateProjectConfig, docsForProject, deriveDocsList, collectRepos, websiteProject} = require('./project-config');

function fixture() {
  return {
    catalogs: [{
      id: 'platform', name: 'Platform', note: 'Catalog note', projects: [{
        name: 'Example', user: 'apache', repo: 'example', repoUrl: 'https://github.com/apache/example.git',
        icon: 'example', description: 'Example project.', extraContributors: [{login: 'extra-person'}],
        dockerImages: [{name: 'Server', link: 'https://hub.docker.com/r/apache/example'}],
        next: {docs: {link: '/docs/example/next/readme/', commitId: 'main', label: 'Development'}},
        releases: [{
          version: 'v2.0.0', latest: true,
          docs: {
            link: '/docs/example/v2.0.0/readme/', commitId: 'release-pin', label: '2.0.0 (Platform 11)',
            latestLink: '/docs/example/latest/readme/', latestCommitId: 'latest-docs-fix-pin',
          },
          downloads: [{name: 'Source archive', type: 'source', link: 'https://downloads.example.org/v2.tar.gz', asc: 'https://downloads.example.org/v2.tar.gz.asc', sha512: 'https://downloads.example.org/v2.tar.gz.sha512'}],
        }, {
          version: 'v1.0.0', latest: false,
          docs: {link: '/docs/example/v1.0.0/readme/', commitId: 'old-release-pin'},
          downloads: [],
        }],
      }],
    }],
    showcase: {
      name: 'Showcase', user: 'apache', repo: 'example-showcase', repoUrl: 'https://github.com/apache/example-showcase.git',
      description: 'Runnable demo.', next: {docs: {link: '/docs/example-showcase/next/readme/', label: 'Showcase for v11'}},
    },
  };
}

function project(config) { return config.catalogs[0].projects[0]; }

test('preserves the complete docs URL set, labels, order and intentionally different commit pins', () => {
  const config = validateProjectConfig(fixture());
  const groups = deriveDocsList(config);
  assert.deepEqual(groups[0].list[0].docs, [{version: 'Next', link: '/docs/example-showcase/next/readme/', versionName: 'Showcase for v11'}]);
  assert.deepEqual(groups[1].list[1].docs, [
    {version: 'Next', link: '/docs/example/next/readme/', commitId: 'main', versionName: 'Development'},
    {version: 'Latest', link: '/docs/example/latest/readme/', commitId: 'latest-docs-fix-pin'},
    {version: 'v2.0.0', link: '/docs/example/v2.0.0/readme/', commitId: 'release-pin', versionName: '2.0.0 (Platform 11)'},
    {version: 'v1.0.0', link: '/docs/example/v1.0.0/readme/', commitId: 'old-release-pin'},
  ]);
  assert.deepEqual(groups[1].list[0], {name: null, descriptionItem: 'Catalog note'});
  assert.deepEqual(groups[1].list[1].extraContributors, [{login: 'extra-person'}]);
});

test('a release addition updates the generated Latest entry without a separate Latest record', () => {
  const config = fixture();
  const item = project(config);
  const previousUrls = docsForProject(item).map(doc => doc.link);
  item.releases[0].latest = false;
  item.releases.unshift({
    version: 'v3.0.0', latest: true,
    docs: {link: '/docs/example/v3.0.0/readme/', commitId: 'new-release-pin', latestLink: '/docs/example/latest/readme/', latestCommitId: 'new-latest-docs-pin'},
  });
  validateProjectConfig(config);
  const docs = docsForProject(item);
  assert.equal(docs.filter(doc => doc.version === 'Latest').length, 1);
  assert.equal(docs.find(doc => doc.version === 'Latest').commitId, 'new-latest-docs-pin');
  assert.equal(docs.find(doc => doc.version === 'v3.0.0').commitId, 'new-release-pin');
  assert.deepEqual(docs.map(doc => doc.link).sort(), [...previousUrls, '/docs/example/v3.0.0/readme/'].sort());
  assert.equal(item.releases.some(release => release.version === 'Latest'), false);
});

test('preserves external versioned docs without inventing a Latest alias', () => {
  const config = fixture();
  const item = project(config);
  delete item.repoUrl;
  delete item.next;
  item.releases = [{version: 'v1.0.0', latest: true, docs: {link: 'https://github.com/apache/example/tree/v1.0.0'}}];
  validateProjectConfig(config);
  assert.deepEqual(docsForProject(item), [{version: 'v1.0.0', link: 'https://github.com/apache/example/tree/v1.0.0'}]);
});

test('requires an explicit Latest pin and accepts intentional differences from versioned pins', () => {
  const config = fixture();
  assert.doesNotThrow(() => validateProjectConfig(config));
  delete project(config).releases[0].docs.commitId;
  const docs = docsForProject(config.catalogs[0].projects[0]);
  assert.equal(docs.find(doc => doc.version === 'Latest').commitId, 'latest-docs-fix-pin');
  assert.equal(Object.hasOwn(docs.find(doc => doc.version === 'v2.0.0'), 'commitId'), false);
  assert.throws(() => validateProjectConfig(config), /requires an explicit documentation commitId/);
  project(config).releases[0].docs.commitId = 'release-pin';
  delete project(config).releases[0].docs.latestCommitId;
  assert.throws(() => validateProjectConfig(config), /latestLink requires an explicit latestCommitId/);
});

test('rejects missing or multiple latest releases', () => {
  for (const flags of [[false, false], [true, true]]) {
    const config = fixture();
    project(config).releases.forEach((release, index) => { release.latest = flags[index]; });
    assert.throws(() => validateProjectConfig(config), /exactly one latest release/);
  }
});

test('rejects case-insensitive version/repository collisions and standalone alias records', () => {
  const duplicateVersion = fixture();
  project(duplicateVersion).releases[1].version = 'V2.0.0';
  assert.throws(() => validateProjectConfig(duplicateVersion), /duplicate version/);
  const duplicateRepo = fixture();
  duplicateRepo.showcase.repo = 'EXAMPLE';
  assert.throws(() => validateProjectConfig(duplicateRepo), /duplicate repo/);
  for (const alias of ['Latest', 'Next']) {
    const config = fixture();
    project(config).releases[0].version = alias;
    assert.throws(() => validateProjectConfig(config), /generated alias/);
  }
});

test('rejects docs links that cannot be built, including paths for a different version', () => {
  for (const link of ['javascript:alert(1)', '/docs/example/v9.0.0/readme/', '/docs/example/v2.0.0/']) {
    const config = fixture();
    project(config).releases[0].docs.link = link;
    assert.throws(() => validateProjectConfig(config), /docs.*link/);
  }
  const config = fixture();
  delete project(config).repoUrl;
  assert.throws(() => validateProjectConfig(config), /requires repoUrl/);
});

test('accepts historical downloads without checksum links but rejects incomplete pairs and invalid file types', () => {
  const config = fixture();
  const file = project(config).releases[0].downloads[0];
  delete file.asc;
  assert.throws(() => validateProjectConfig(config), /asc and sha512 together/);
  delete file.sha512;
  assert.doesNotThrow(() => validateProjectConfig(config));
  file.type = 'package';
  assert.throws(() => validateProjectConfig(config), /type must be source or binary/);
  file.type = 'binary';
  file.link = 'not-a-url';
  assert.throws(() => validateProjectConfig(config), /link must be an HTTP/);
});

test('requires project-level Docker image arrays with usable repository links', () => {
  const config = fixture();
  project(config).dockerImages = {name: 'Server'};
  assert.throws(() => validateProjectConfig(config), /dockerImages must be an array/);
  project(config).dockerImages = [{name: 'Server', link: '/image'}];
  assert.throws(() => validateProjectConfig(config), /dockerImages\[0\] requires/);
  project(config).dockerImages = [];
  project(config).releases[0].dockerImages = [];
  assert.throws(() => validateProjectConfig(config), /dockerImages belongs on the project/);
});

test('includes Showcase and package-derived Website in the team/stars repository inventory', () => {
  const config = fixture();
  config.website = websiteProject({
    name: 'example-website', description: 'Example Website', homepage: 'example.apache.org',
    repository: {url: 'git+https://github.com/apache/example-website.git'},
  });
  validateProjectConfig(config);
  assert.deepEqual(collectRepos(config), [
    {user: 'apache', repo: 'example-showcase'}, {user: 'apache', repo: 'example-website'}, {user: 'apache', repo: 'example'},
  ]);
  assert.deepEqual(deriveDocsList(config)[0].list[1], {
    name: 'Example Website', icon: 'example-website',
    description: 'This is the repository including all source codes of https://example.apache.org', user: 'apache', repo: 'example-website',
  });
});
