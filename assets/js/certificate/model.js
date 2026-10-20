/*
 * Certificate model, shared by the browser (assets/js/certificate/page.js) and the build
 * (scripts/certificate.js), so a certificate drawn in the browser and the list of issued codes
 * written by the build always agree.
 *
 * A certificate is identified by its issue date and a code: the first 80 bits of the SHA-256
 * of its verified facts (date, person, role, total contributions, projects, and the rank band
 * of every category), in Crockford base32. The verify link carries the date, the code and the
 * facts; the build publishes each day's codes in certificate/verify/<date>.txt.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SWCertModel = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = 'v1';
  var ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  var ROLE = { 'PMC Member': 'p', 'Committer': 'c', 'Contributor': 'x' };
  var ROLE_NAME = { p: 'PMC Member', c: 'Committer', x: 'Contributor' };

  // Lookup tables without a prototype, so a login or Apache ID such as "constructor" or
  // "__proto__" is an ordinary key.
  function table() { return Object.create(null); }

  function index(data) {
    var logins = table(), members = table(), memberByGithub = table();
    data.catalogs.forEach(function (c) {
      c.repos.forEach(function (r) {
        r.contributors.forEach(function (row) {
          var key = row.l.toLowerCase();
          var entry = logins[key] = logins[key] || { login: row.l, projects: [] };
          entry.projects.push({
            name: r.name, label: r.label, icon: r.icon || null, archived: !!r.archived, catalog: c.id,
            contributions: row.n, rank: row.r, of: r.of
          });
        });
      });
    });
    [['pmc', 'PMC Member'], ['committer', 'Committer']].forEach(function (g) {
      (data.members[g[0]] || []).forEach(function (m) {
        var member = { name: m.name, apacheId: m.apacheId, github: m.github || null, role: g[1] };
        members[m.apacheId.toLowerCase()] = member;
        if (m.github) memberByGithub[m.github.toLowerCase()] = member;
      });
    });
    // Every listed person's total in each category, highest first, for category ranks.
    var categoryTotals = table();
    data.catalogs.forEach(function (c) { categoryTotals[c.id] = []; });
    Object.keys(logins).forEach(function (k) {
      var sums = table();
      logins[k].projects.forEach(function (p) { sums[p.catalog] = (sums[p.catalog] || 0) + p.contributions; });
      Object.keys(sums).forEach(function (id) { categoryTotals[id].push(sums[id]); });
    });
    Object.keys(categoryTotals).forEach(function (id) {
      categoryTotals[id].sort(function (a, b) { return b - a; });
    });
    return { logins: logins, members: members, memberByGithub: memberByGithub, categoryTotals: categoryTotals };
  }

  // Competition ranking: 1 + the number of people with strictly more, so ties share a rank.
  function rankIn(descending, value) {
    var lo = 0, hi = descending.length;
    while (lo < hi) {
      var mid = (lo + hi) >> 1;
      if (descending[mid] > value) lo = mid + 1; else hi = mid;
    }
    return lo + 1;
  }

  // Find who a query refers to. Members win, so a committer's GitHub link still yields their role.
  function resolve(idx, query) {
    var member = query.member ? idx.members[query.member.toLowerCase()] : null;
    var login = query.contributor || null;
    if (!member && login) member = idx.memberByGithub[login.toLowerCase()] || null;
    if (!member && !login && query.q) {
      member = idx.members[query.q.toLowerCase()] || idx.memberByGithub[query.q.toLowerCase()] || null;
      login = member ? null : query.q;
    }
    if (member) login = member.github;
    var stats = login ? idx.logins[login.toLowerCase()] || null : null;
    if (!member && !stats) return null;
    return { member: member, stats: stats };
  }

  // A person's standing in every category, in catalog order. The band (0-10) places the
  // category's vertex on the contribution polygon: rank in 10% steps, 10 for the top 10%.
  function categories(data, idx, found) {
    var sums = table();
    (found.stats ? found.stats.projects : []).forEach(function (p) {
      sums[p.catalog] = (sums[p.catalog] || 0) + p.contributions;
    });
    return data.catalogs.map(function (c) {
      var v = sums[c.id] || 0, all = idx.categoryTotals[c.id];
      var rank = v ? rankIn(all, v) : null;
      return {
        id: c.id, name: c.name, contributions: v, rank: rank, of: all.length,
        band: v ? 10 - Math.floor((rank - 1) * 10 / all.length) : 0
      };
    });
  }

  // The facts a certificate's code covers.
  function facts(data, idx, found) {
    var m = found.member, projects = found.stats ? found.stats.projects : [];
    return {
      key: m ? 'member:' + m.apacheId.toLowerCase() : 'contributor:' + found.stats.login.toLowerCase(),
      role: m ? ROLE[m.role] : 'x',
      total: projects.length ? projects.reduce(function (s, p) { return s + p.contributions; }, 0) : null,
      projects: projects.length,
      bands: categories(data, idx, found).map(function (c) { return c.band.toString(11); }).join('')
    };
  }

  function canonical(date, f) {
    return [VERSION, date, f.key, f.role, f.total == null ? '' : f.total, f.projects, f.bands].join('|');
  }

  // The first 80 bits of a SHA-256 digest (bytes) as 16 Crockford base32 characters.
  function encode(bytes) {
    var out = '', bits = 0, value = 0;
    for (var i = 0; i < 10; i++) {
      value = (value << 8) | bytes[i];
      bits += 8;
      while (bits >= 5) {
        out += ALPHABET[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
      value &= (1 << bits) - 1;
    }
    return out;
  }

  // Everyone the site lists on a given day: members, then contributors who are not members.
  function everyone(idx) {
    var people = Object.keys(idx.members).map(function (id) { return { member: id }; });
    Object.keys(idx.logins).forEach(function (login) {
      if (!idx.memberByGithub[login]) people.push({ contributor: login });
    });
    return people;
  }

  return {
    VERSION: VERSION, ROLE: ROLE, ROLE_NAME: ROLE_NAME,
    index: index, rankIn: rankIn, resolve: resolve, categories: categories,
    facts: facts, canonical: canonical, encode: encode, everyone: everyone
  };
});
