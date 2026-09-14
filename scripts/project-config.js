const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');

const projectFields = ['name', 'icon', 'description', 'user', 'repo', 'repoUrl', 'extraContributors'];

function check(condition, message) {
  if (!condition) throw new Error(`Invalid project config: ${message}`);
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isWebLink(value) {
  if (!isText(value) || /\s/.test(value)) return false;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); }
  catch (_) { return false; }
}

function validateProjectConfig(config) {
  check(isObject(config), 'expected an object');
  check(Array.isArray(config.catalogs), 'catalogs must be an array');
  const catalogIds = new Set();
  const repos = new Set();
  const localDocs = new Set();

  function validateDocs(docs, project, version, where) {
    check(isObject(docs), `${where} must be an object`);
    const local = typeof docs.link === 'string' && docs.link.startsWith('/');
    check(local ? /^\/docs\/[^/?#\s]+\/[^/?#\s]+\/readme\/$/.test(docs.link) : isWebLink(docs.link), `${where}.link must be a /docs/.../readme/ path or an HTTP(S) URL`);
    if (local) {
      check(isText(project.repoUrl), `${where} requires repoUrl for locally built documentation`);
      const slug = docs.link.split('/')[3];
      check(slug === version.toLowerCase(), `${where}.link version must match ${version}`);
      if (version !== 'Next') check(isText(docs.commitId), `${where} requires an explicit documentation commitId`);
      check(!localDocs.has(docs.link.toLowerCase()), `duplicate docs link ${docs.link}`);
      localDocs.add(docs.link.toLowerCase());
    }
    if (docs.commitId !== undefined) check(isText(docs.commitId), `${where}.commitId must be a nonempty string`);
    if (docs.label !== undefined) check(isText(docs.label), `${where}.label must be a nonempty string`);
  }

  function validateProject(project, where) {
    check(isObject(project), `${where} must be an object`);
    ['name', 'repo', 'user', 'description'].forEach(field => check(isText(project[field]), `${where}.${field} must be a nonempty string`));
    check(/^[a-z0-9_.-]+$/i.test(project.repo), `${where}.repo must be a repository name`);
    check(/^[a-z0-9_-]+$/i.test(project.user), `${where}.user must be a GitHub owner`);
    const key = project.repo.toLowerCase();
    check(!repos.has(key), `duplicate repo ${project.repo}`);
    repos.add(key);
    if (project.repoUrl !== undefined) check(isWebLink(project.repoUrl), `${where}.repoUrl must be an HTTP(S) URL`);
    if (project.extraContributors !== undefined) {
      check(Array.isArray(project.extraContributors), `${where}.extraContributors must be an array`);
      project.extraContributors.forEach((person, index) => check(isObject(person) && isText(person.login), `${where}.extraContributors[${index}] requires login`));
    }
    if (project.next !== undefined) {
      check(isObject(project.next), `${where}.next must be an object`);
      validateDocs(project.next.docs, project, 'Next', `${where}.next.docs`);
    }
    const releases = project.releases === undefined ? [] : project.releases;
    check(Array.isArray(releases), `${where}.releases must be an array`);
    const versions = new Set();
    let latestCount = 0;
    releases.forEach((release, index) => {
      const releasePath = `${where}.releases[${index}]`;
      check(isObject(release), `${releasePath} must be an object`);
      check(isText(release.version) && /^[a-z0-9][a-z0-9._-]*$/i.test(release.version), `${releasePath}.version must be a version key`);
      const version = release.version.toLowerCase();
      check(!['next', 'latest'].includes(version), `${releasePath}.version cannot be the generated alias ${release.version}`);
      check(!versions.has(version), `${where} has duplicate version ${release.version}`);
      versions.add(version);
      check(typeof release.latest === 'boolean', `${releasePath}.latest must be true or false`);
      if (release.latest) latestCount++;
      if (release.docs !== undefined) {
        validateDocs(release.docs, project, release.version, `${releasePath}.docs`);
        if (release.docs.latestLink !== undefined) {
          check(/^\/docs\/[^/?#\s]+\/latest\/readme\/$/.test(release.docs.latestLink), `${releasePath}.docs.latestLink must be a /docs/.../latest/readme/ path`);
          check(isText(release.docs.latestCommitId), `${releasePath}.docs.latestLink requires an explicit latestCommitId`);
          if (release.latest) validateDocs({...release.docs, link: release.docs.latestLink, commitId: release.docs.latestCommitId}, project, 'Latest', `${releasePath}.docs latest alias`);
        } else if (release.docs.latestCommitId !== undefined) {
          check(false, `${releasePath}.docs.latestCommitId requires latestLink`);
        }
      }
      const downloads = release.downloads === undefined ? [] : release.downloads;
      check(Array.isArray(downloads), `${releasePath}.downloads must be an array`);
      downloads.forEach((file, fileIndex) => {
        const filePath = `${releasePath}.downloads[${fileIndex}]`;
        check(isObject(file) && isText(file.name), `${filePath} requires a name`);
        check(['source', 'binary'].includes(file.type), `${filePath}.type must be source or binary`);
        check(isWebLink(file.link), `${filePath}.link must be an HTTP(S) URL`);
        // Registries and historical entries may have neither verification link.
        check((file.asc !== undefined) === (file.sha512 !== undefined), `${filePath} must provide asc and sha512 together`);
        if (file.asc !== undefined) {
          check(isWebLink(file.asc) && isWebLink(file.sha512), `${filePath} verification links must be HTTP(S) URLs`);
        }
      });
      check(release.dockerImages === undefined, `${releasePath}.dockerImages belongs on the project, not on a release`);
    });
    const images = project.dockerImages === undefined ? [] : project.dockerImages;
    check(Array.isArray(images), `${where}.dockerImages must be an array`);
    images.forEach((image, imageIndex) => check(isObject(image) && isText(image.name) && isWebLink(image.link), `${where}.dockerImages[${imageIndex}] requires a name and HTTP(S) link`));
    check(latestCount === (releases.length ? 1 : 0), `${where} must have exactly one latest release when releases are present (found ${latestCount})`);
  }

  config.catalogs.forEach((catalog, index) => {
    const where = `catalogs[${index}]`;
    check(isObject(catalog) && isText(catalog.id) && isText(catalog.name), `${where} requires id and name`);
    check(!catalogIds.has(catalog.id), `duplicate catalog id ${catalog.id}`);
    catalogIds.add(catalog.id);
    check(Array.isArray(catalog.projects), `${where}.projects must be an array`);
    catalog.projects.forEach((project, projectIndex) => validateProject(project, `${where}.projects[${projectIndex}]`));
  });
  validateProject(config.showcase, 'showcase');
  if (config.website) validateProject(config.website, 'website');
  return config;
}

function websiteProject(packageInfo) {
  const repository = typeof packageInfo.repository === 'string' ? packageInfo.repository : packageInfo.repository.url;
  const url = new URL(repository.replace(/^git\+/, ''));
  const [user, repo] = url.pathname.replace(/^\//, '').replace(/\.git$/, '').split('/');
  const homepage = /^https?:\/\//.test(packageInfo.homepage) ? packageInfo.homepage : `https://${packageInfo.homepage}`;
  return {
    name: packageInfo.description,
    icon: packageInfo.name,
    description: `This is the repository including all source codes of ${homepage}`,
    user,
    repo,
  };
}

function loadProjectConfig(root = path.join(__dirname, '..')) {
  const projects = YAML.load(path.join(root, 'data/projects.yml'));
  const {showcase} = YAML.load(path.join(root, 'data/get-started.yml'));
  const packageInfo = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  return validateProjectConfig({...projects, showcase, website: websiteProject(packageInfo)});
}

function docsForProject(project) {
  const docs = [];
  function add(version, entry) {
    const doc = {version, link: entry.link};
    if (entry.label) doc.versionName = entry.label;
    if (entry.commitId) doc.commitId = entry.commitId;
    docs.push(doc);
  }
  if (project.next && project.next.docs) add('Next', project.next.docs);
  const releases = project.releases || [];
  const latest = releases.find(release => release.latest);
  if (latest && latest.docs && latest.docs.latestLink) {
    // Latest can intentionally use a documentation fix newer than the release pin.
    add('Latest', {link: latest.docs.latestLink, commitId: latest.docs.latestCommitId});
  }
  releases.forEach(release => { if (release.docs) add(release.version, release.docs); });
  return docs;
}

function docsProject(project) {
  const result = {};
  projectFields.forEach(field => { if (project[field] !== undefined) result[field] = project[field]; });
  const docs = docsForProject(project);
  if (docs.length) result.docs = docs;
  return result;
}

function deriveDocsList(config) {
  const quickStart = {type: 'Quick Start', buttonText: 'Showcase', list: [docsProject(config.showcase)]};
  if (config.website) quickStart.list.push(docsProject(config.website));
  return [quickStart, ...config.catalogs.map(catalog => {
    const group = {type: catalog.name, list: catalog.projects.map(docsProject)};
    if (catalog.description !== undefined) group.description = catalog.description;
    if (catalog.buttonText !== undefined) group.buttonText = catalog.buttonText;
    if (catalog.note) group.list.unshift({name: null, descriptionItem: catalog.note});
    return group;
  })];
}

function collectRepos(config) {
  return deriveDocsList(config).flatMap(group => group.list)
    .filter(project => project.user && project.repo)
    .map(({user, repo}) => ({user, repo}));
}

module.exports = {loadProjectConfig, validateProjectConfig, docsForProject, deriveDocsList, collectRepos, websiteProject};

if (require.main === module) {
  try {
    const config = loadProjectConfig();
    const docs = deriveDocsList(config).flatMap(group => group.list).flatMap(project => project.docs || []);
    console.log(`Validated ${config.catalogs.length} catalogs, ${collectRepos(config).length} repositories and ${docs.length} documentation entries.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
