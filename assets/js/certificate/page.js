/*
 * /certificate page controller.
 *
 * Issuing: ?contributor=<GitHub login> or ?member=<Apache ID> draws a certificate from today's
 * data (assets/certificate/people.json, see scripts/certificate.js). Its ID is the data date plus
 * a code covering its facts (SWCertModel), and its QR code links back here with both.
 *
 * Verifying: a link with &id=<yyyymmdd>-<code> carries the certificate's facts. The page
 * recomputes the code from them, checks it against the ID, and looks it up in that day's list
 * of issued codes (certificate/verify/<yyyy-mm-dd>.txt), which the site keeps for good.
 */
(function () {
  'use strict';

  var app = document.getElementById('cert-app');
  if (!app) return;
  var M = window.SWCertModel;
  var $ = function (sel) { return app.querySelector(sel); };
  var SITE = (app.dataset.base || 'https://skywalking.apache.org/').replace(/\/?$/, '/');
  var ID = /^(\d{4})(\d{2})(\d{2})-([0-9A-HJKMNP-TV-Z]{16})$/;
  var MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

  function siteDate(iso) {
    var d = new Date(iso + 'T00:00:00'), day = d.getDate();
    var suffix = (day % 100 >= 11 && day % 100 <= 13) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th');
    return MONTHS[d.getMonth()] + ' ' + day + suffix + ', ' + d.getFullYear();
  }

  function codeFor(date, facts) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(M.canonical(date, facts)))
      .then(function (buf) { return M.encode(new Uint8Array(buf)); });
  }

  function groupCode(code) { return code.match(/.{4}/g).join('-'); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function plural(n, word) { return n.toLocaleString('en-US') + ' ' + word + (n === 1 ? '' : 's'); }
  function asRole(role) { return role === 'PMC Member' ? 'a PMC member' : 'a ' + role.toLowerCase(); }
  function splitName(name) {
    var t = /^(.*?)\s*\((.*)\)\s*$/.exec(name);
    return t ? { name: t[1], note: t[2] } : { name: name, note: null };
  }
  var TICK = '<span class="tick" aria-hidden="true">✓</span>';

  var state = { data: null, idx: null, ctx: null, person: null, svg: null };

  // Every lookup gets a generation; an answer that arrives after a newer lookup started is
  // dropped, so a slow verification can never overwrite the result of a later search.
  var generation = 0;
  function stale(token) { return token !== generation; }

  function setStatus(kind, html) {
    var el = $('.cert-status');
    el.className = 'cert-status ' + kind;
    el.innerHTML = html;
  }

  function fail(html, token) {
    if (stale(token)) return;
    state.person = null;
    $('.cert-result').hidden = true;
    $('.cert-verify').hidden = true;
    setStatus('missing', html);
  }

  // ---- Issuing ------------------------------------------------------------------------------

  function buildPerson(found) {
    var data = state.data, m = found.member, st = found.stats;
    var projects = st ? st.projects.slice().sort(function (a, b) {
      return b.contributions - a.contributions || a.rank - b.rank;
    }) : [];
    var named = m ? splitName(m.name) : null;
    var facts = M.facts(data, state.idx, found);
    var date = data.generated;
    return codeFor(date, facts).then(function (code) {
      var id = date.replace(/-/g, '') + '-' + code;
      var query = (m ? 'member=' + encodeURIComponent(m.apacheId) : 'contributor=' + encodeURIComponent(st.login)) +
        '&id=' + id + '&r=' + facts.role + (facts.total == null ? '' : '&t=' + facts.total) +
        '&n=' + facts.projects + '&b=' + facts.bands;
      return {
        kind: m ? 'member' : 'contributor',
        displayName: m ? named.name : '@' + st.login,
        login: st ? st.login : (m && m.github) || null, apacheId: m ? m.apacheId : null,
        role: m ? m.role : 'Contributor', roleNote: named ? named.note : null,
        total: facts.total, projectCount: facts.projects, top: projects.slice(0, 2), projects: projects,
        categories: M.categories(data, state.idx, found),
        verifyUrl: SITE + 'certificate/?' + query,
        certId: groupCode(code),
        issued: siteDate(date)
      };
    });
  }

  function issue(p, token) {
    var found = M.resolve(state.idx, p);
    if (!found) {
      return fail('<strong>Not found.</strong> No PMC member, committer or contributor <code>' + esc(p.member || p.contributor || p.q) +
        '</code> is listed on skywalking.apache.org. Contributors are matched by GitHub login; anonymous commits ' +
        'and bots are not listed.', token);
    }
    setStatus('idle', 'Preparing the certificate…');
    return buildPerson(found).then(function (person) {
      if (stale(token)) return;
      state.person = person;
      var detail = person.total != null
        ? plural(person.total, 'contribution') + ' across ' + plural(person.projectCount, 'project')
        : 'no public commit statistics on file';
      // Issuing is not verification: that only happens when a certificate's verify link is opened.
      setStatus('issued', '<span><strong>Certificate generated</strong> for ' + esc(person.displayName) + ', listed on skywalking.apache.org as ' +
        asRole(person.role) + (person.roleNote ? ' (' + esc(person.roleNote) + ')' : '') + ', with ' + detail +
        ' as of ' + esc(person.issued) + '. Certificate ID <code>' + esc(person.certId) + '</code>; anyone can verify it from its QR code or verify link.</span>');
      $('.cert-verify').hidden = true;
      $('.cert-result').hidden = false;
      state.svg = SWCert.render('claude', person, state.ctx);
      $('.cert-result .cert-canvas').innerHTML = state.svg;
    }).catch(function (err) {
      fail('Could not draw the certificate: ' + esc(err.message), token);
    });
  }

  // ---- Verifying ----------------------------------------------------------------------------

  function claimedFacts(p) {
    var key = p.member ? 'member:' + p.member.toLowerCase() : (p.contributor ? 'contributor:' + p.contributor.toLowerCase() : null);
    if (!key || (p.member && p.contributor)) return null;
    if (!/^[pcx]$/.test(p.r || '') || !/^\d*$/.test(p.t || '') || !/^\d+$/.test(p.n || '') || !/^[0-9a]+$/.test(p.b || '')) return null;
    return { key: key, role: p.r, total: p.t ? Number(p.t) : null, projects: Number(p.n), bands: p.b };
  }

  // A day's record: '#' header lines (the day's categories, in polygon order) and one code per
  // line. Lines may come in any order; differing headers leave the categories unknown.
  function issuedRecord(date) {
    return fetch(app.dataset.verify + date + '.txt').then(function (r) {
      if (!r.ok) return null;
      return r.text().then(function (text) {
        var codes = [], headers = [];
        text.split('\n').forEach(function (line) {
          line = line.trim();
          if (line.charAt(0) === '#') headers.push(line);
          else if (line) codes.push(line);
        });
        var categories = null;
        if (headers.length && headers.every(function (h) { return h === headers[0]; })) {
          try { categories = JSON.parse(headers[0].slice(1)).categories || null; } catch (e) { categories = null; }
        }
        return { codes: codes, categories: categories };
      });
    });
  }

  function verify(p, token) {
    var parts = ID.exec(p.id || '');
    var facts = claimedFacts(p);
    if (!parts || !facts) return fail('<strong>Not verifiable.</strong> This link is not a complete certificate verification link.', token);
    var date = parts[1] + '-' + parts[2] + '-' + parts[3], code = parts[4], shown = groupCode(code);
    setStatus('idle', 'Checking certificate <code>' + esc(shown) + '</code>…');
    return codeFor(date, facts).then(function (expected) {
      if (stale(token)) return;
      if (expected !== code) {
        return fail('<strong>Not authentic.</strong> The facts in this link do not match certificate <code>' + esc(shown) +
          '</code>: they have been changed since it was issued.', token);
      }
      return issuedRecord(date).then(function (record) {
        if (stale(token)) return;
        if (!record) return fail('<strong>Not verifiable.</strong> No certificate records are published for ' + esc(siteDate(date)) + '.', token);
        if (record.codes.indexOf(code) < 0) {
          return fail('<strong>Not authentic.</strong> Certificate <code>' + esc(shown) + '</code> was not issued on ' + esc(siteDate(date)) + '.', token);
        }
        showVerified(p, facts, date, shown, record.categories);
      });
    }).catch(function (err) {
      fail('<strong>Not verifiable right now.</strong> The certificate records could not be loaded (' + esc(err.message) +
        '). Try again later.', token);
    });
  }

  function showVerified(p, facts, date, shown, categories) {
    var now = M.resolve(state.idx, p.member ? { member: p.member } : { contributor: p.contributor });
    var role = M.ROLE_NAME[facts.role];
    var name = now && now.member ? splitName(now.member.name).name : (p.member || '@' + p.contributor);
    setStatus('verified', TICK + '<span><strong>Authentic.</strong> Certificate <code>' + esc(shown) + '</code> was issued to ' +
      esc(name) + ' on ' + esc(siteDate(date)) + ', and every fact below matches it.</span>');
    $('.cert-verify-canvas').innerHTML = SWCert.designs.claude.renderVerification({
      displayName: name, kind: p.member ? 'member' : 'contributor', apacheId: p.member, login: p.contributor,
      role: role, total: facts.total, projects: facts.projects, bands: facts.bands,
      categories: categories, issued: siteDate(date), certId: shown, date: date
    }, state.ctx);
    $('.cert-verify-today').innerHTML = todayLine(now, name, role, facts) +
      ' <a href="' + esc(location.pathname + '?' + (p.member ? 'member=' + encodeURIComponent(p.member) : 'contributor=' + encodeURIComponent(p.contributor))) +
      '">See today\'s certificate &rarr;</a>';
    $('.cert-result').hidden = true;
    $('.cert-verify').hidden = false;
  }

  function todayLine(now, name, role, facts) {
    if (!now) return 'Today ' + esc(name) + ' is no longer listed on skywalking.apache.org.';
    var roleNow = now.member ? now.member.role : 'Contributor';
    var line = 'Today ' + esc(name) + ' is ' + (roleNow === role ? 'still listed as ' + asRole(roleNow)
      : 'listed as ' + asRole(roleNow) + ' (' + role.toLowerCase() + ' when issued)');
    var total = now.stats ? now.stats.projects.reduce(function (s, x) { return s + x.contributions; }, 0) : null;
    if (facts.total == null || total == null) return line + '.';
    if (total === facts.total) return line + ', with the same ' + plural(total, 'contribution') + '.';
    if (total > facts.total) return line + ', with ' + plural(total, 'contribution') + ' (' + facts.total.toLocaleString('en-US') + ' when issued).';
    return line + ', with ' + plural(total, 'contribution') + ', fewer than the ' + facts.total.toLocaleString('en-US') +
      ' when issued. That happens when commit history is rewritten or a repository leaves the site.';
  }

  // ---- Page ---------------------------------------------------------------------------------

  function params() {
    var q = new URLSearchParams(location.search), p = {};
    ['contributor', 'member', 'q', 'id', 'r', 't', 'n', 'b'].forEach(function (k) { p[k] = q.get(k); });
    return p;
  }

  function show(p) {
    var token = ++generation;
    state.person = null;
    state.svg = null;
    $('.cert-result').hidden = true;
    $('.cert-verify').hidden = true;
    if (p.id) return verify(p, token);
    if (!(p.member || p.contributor || p.q)) {
      setStatus('idle', 'Enter a GitHub login or an Apache ID to generate a certificate.');
      return;
    }
    return issue(p, token);
  }

  function navigate(p) {
    var q = new URLSearchParams();
    if (p.member) q.set('member', p.member);
    else if (p.contributor) q.set('contributor', p.contributor);
    else if (p.q) q.set('q', p.q);
    history.pushState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
    show(p);
  }

  $('.cert-png').addEventListener('click', function () {
    if (state.svg) SWCert.downloadPNG(state.svg, state.person, 2);
  });
  $('.cert-print').addEventListener('click', function () { window.print(); });
  $('.cert-copy').addEventListener('click', function (ev) {
    var btn = ev.currentTarget;
    navigator.clipboard.writeText(state.person.verifyUrl).then(function () {
      btn.classList.add('copied');
      setTimeout(function () { btn.classList.remove('copied'); }, 1600);
    });
  });

  var form = document.querySelector('.cert-search');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var v = form.q.value.trim().replace(/^@/, '');
      if (v) navigate({ q: v });
    });
  }
  window.addEventListener('popstate', function () { show(params()); });

  setStatus('idle', 'Loading contribution data…');
  fetch(app.dataset.people).then(function (r) {
    if (!r.ok) throw new Error('certificate data is not published');
    return r.json();
  }).then(function (data) {
    state.data = data;
    state.idx = M.index(data);
    return SWCert.buildContext({
      files: {
        skywalkingLogo: app.dataset.logo,
        skywalkingLogoWhite: app.dataset.logoWhite,
        asfLogo: app.dataset.asfLogo,
        asfOakleaf: app.dataset.asfLeaf
      },
      iconBase: app.dataset.icons,
      catalogs: data.catalogs,
      totalPeople: data.totalPeople
    });
  }).then(function (ctx) {
    state.ctx = ctx;
    var p = params();
    if (form && !p.id && (p.member || p.contributor || p.q)) form.q.value = p.member || p.contributor || p.q;
    show(p);
  }).catch(function (err) {
    setStatus('missing', 'Could not load contribution data: ' + esc(err.message));
  });
})();
