/*
 * "Contribution Sky Map" — Apache SkyWalking certificate design.
 *
 * Left: a light certificate in the website's hero wash. Right: a night-sky panel with the
 * recipient's contribution polygon over the repository categories of data/repositories.yml.
 */
(function () {
  'use strict';

  window.SWCert = window.SWCert || {};
  SWCert.designs = SWCert.designs || {};

  var W = 1123, H = 794;
  var INK = '#172b40', BODY = '#4b5563', MUTED = '#8a93a3', LINE = '#e6e9ee', BRAND = '#3788D0';
  var LEFT = 56, CONTENT_W = 600;
  var PANEL_X = 700, PANEL_W = W - 16 - PANEL_X;          // 407
  var CX = PANEL_X + PANEL_W / 2, CY = 286, R = 98;       // contribution polygon centre and radius

  var TIERS = {
    'PMC Member': { from: '#28265E', to: '#7C297D', solid: '#7C297D', glow: '#d9a8f0' },
    'Committer': { from: '#2875b9', to: '#479EEB', solid: '#2875b9', glow: '#9cc9f5' },
    'Contributor': { from: '#DD552C', to: '#F79A23', solid: '#DD552C', glow: '#ffd29a' }
  };
  var TRADEMARK = 'Apache SkyWalking, SkyWalking, Apache, the Apache feather logo, and the Apache ' +
    'SkyWalking project logo are either registered trademarks or trademarks of the Apache Software Foundation.';

  function num(n) { return Number(n).toLocaleString('en-US'); }
  function f(n) { return Math.round(n * 100) / 100; }

  function hash(s) {                                       // FNV-1a → [0, 1)
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return ((h >>> 0) % 100000) / 100000;
  }

  function wrap(text, font, maxWidth, ctx) {
    var words = text.split(' '), lines = [], line = '';
    words.forEach(function (w) {
      var next = line ? line + ' ' + w : w;
      if (line && ctx.measure(next, font) > maxWidth) { lines.push(line); line = w; } else { line = next; }
    });
    if (line) lines.push(line);
    return lines;
  }

  function textLines(lines, x, y, lh, attrs, ctx) {
    return '<text x="' + x + '" y="' + y + '" ' + attrs + '>' + lines.map(function (l, i) {
      return '<tspan x="' + x + '" dy="' + (i ? lh : 0) + '">' + ctx.escape(l) + '</tspan>';
    }).join('') + '</text>';
  }

  function statement(p) {
    if (p.role === 'PMC Member') {
      return 'in recognition of stewardship as a member of the Apache SkyWalking Project Management ' +
        'Committee, and of contributions to Apache SkyWalking, an open source observability platform ' +
        'of The Apache Software Foundation.';
    }
    if (p.role === 'Committer') {
      return 'in recognition of earning commit access to Apache SkyWalking, the open source ' +
        'observability platform of The Apache Software Foundation.';
    }
    return 'in recognition of contributions to Apache SkyWalking, the open source observability ' +
      'platform of The Apache Software Foundation.';
  }

  // Contribution polygon: one vertex per category of data/repositories.yml (ctx.catalogs, in
  // config order), clockwise from the top. A vertex's distance is the recipient's rank among
  // everyone who contributed to that category, in ten 10% bands: the top 10% reach the outer
  // ring, the next 10% the ninth ring, and so on; categories without contributions sit at the
  // centre.
  function band(c) {
    if (c.band != null) return c.band;                     // computed by SWCertModel
    return c.contributions ? 10 - Math.floor((c.rank - 1) * 10 / c.of) : 0;
  }

  function polygon(p, ctx, tier, namesOnly) {
    var cats = ctx.catalogs, n = cats.length, out = [];
    var mineBy = {};
    (p.categories || []).forEach(function (c) { mineBy[c.id] = c; });
    var stat = cats.map(function (c) { return mineBy[c.id] || { contributions: 0, rank: null, of: 0 }; });
    var any = stat.some(function (c) { return c.contributions > 0; });
    function angle(k) { return -Math.PI / 2 + k * 2 * Math.PI / n; }
    function at(k, r) { return [CX + Math.cos(angle(k)) * r, CY + Math.sin(angle(k)) * r]; }
    function level(k) { return band(stat[k]) / 10; }
    function ring(k) {
      return cats.map(function (c, i) { var q = at(i, R * k); return f(q[0]) + ',' + f(q[1]); }).join(' ');
    }

    // Frame: one ring per 10% band, the halfway ring a little stronger, and the axes.
    for (var b = 1; b < 10; b++) {
      out.push('<polygon points="' + ring(b / 10) + '" fill="none" stroke="#ffffff" stroke-opacity="' + (b === 5 ? '.14' : '.06') + '"/>');
    }
    out.push('<polygon points="' + ring(1) + '" fill="#ffffff" fill-opacity=".03" stroke="#ffffff" stroke-opacity=".22"/>');
    cats.forEach(function (c, k) {
      var q = at(k, R);
      out.push('<line x1="' + f(CX) + '" y1="' + CY + '" x2="' + f(q[0]) + '" y2="' + f(q[1]) + '" stroke="#ffffff" stroke-opacity=".08"/>');
    });

    // The recipient's polygon.
    if (any) {
      var pts = cats.map(function (c, k) { var q = at(k, R * level(k)); return f(q[0]) + ',' + f(q[1]); }).join(' ');
      out.push('<polygon points="' + pts + '" fill="url(#claude-poly)" stroke="' + tier.glow + '" stroke-width="1.6" stroke-linejoin="round"/>');
      cats.forEach(function (c, k) {
        var v = stat[k].contributions, q = at(k, R * level(k));
        if (v) {
          out.push('<circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="10" fill="url(#claude-glow)"/>');
          out.push('<circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="3.4" fill="#ffffff"/>');
        }
      });
    }

    // The recipient at the centre.
    out.push('<circle cx="' + f(CX) + '" cy="' + CY + '" r="7" fill="url(#claude-tier)" stroke="#ffffff" stroke-opacity=".9" stroke-width="1.2"/>');
    out.push('<circle cx="' + f(CX) + '" cy="' + CY + '" r="2" fill="#ffffff"/>');

    // Category labels: name (wrapped when long and set beside the polygon), count, and rank.
    var LABEL = '700 9px ' + ctx.fonts.sans, TRACK = 0.8, MIN_X = PANEL_X + 14, MAX_X = PANEL_X + PANEL_W - 14;
    function width(text, font, track) { return ctx.measure(text, font) + (track || 0) * text.length; }
    cats.forEach(function (c, k) {
      var a = angle(k), cos = Math.cos(a), sin = Math.sin(a), v = stat[k].contributions;
      var anchor = cos > 0.35 ? 'start' : (cos < -0.35 ? 'end' : 'middle');
      var name = c.name.toUpperCase(), lines = [name];
      if (anchor !== 'middle' && width(name, LABEL, TRACK) > 84 && name.indexOf(' ') > 0) {
        var words = name.split(' '), best = null;
        for (var i = 1; i < words.length; i++) {
          var l1 = words.slice(0, i).join(' '), l2 = words.slice(i).join(' ');
          var wmax = Math.max(width(l1, LABEL, TRACK), width(l2, LABEL, TRACK));
          if (!best || wmax < best.w) best = { w: wmax, lines: [l1, l2] };
        }
        lines = best.lines;
      }
      var count = namesOnly ? '' : (v ? num(v) : '—'), rank = v && !namesOnly ? '#' + num(stat[k].rank) + ' of ' + num(stat[k].of) : '';
      var w = Math.max.apply(null, lines.map(function (l) { return width(l, LABEL, TRACK); })
        .concat([width(count, '9.5px ' + ctx.fonts.mono), width(rank, '9px ' + ctx.fonts.mono)]));
      var q = at(k, R + 15), x = q[0];
      if (anchor === 'start') x = Math.min(x, MAX_X - w);
      if (anchor === 'end') x = Math.max(x, MIN_X + w);
      if (anchor === 'middle') x = Math.min(Math.max(x, MIN_X + w / 2), MAX_X - w / 2);
      var lh = 11, block = (lines.length + (namesOnly ? 0 : (v ? 2 : 1))) * lh;
      var top = sin < -0.7 ? q[1] - block + 4 : (sin > 0.7 ? q[1] + 6 : q[1] - block / 2 + 8);
      var lit = v ? '.92' : '.42';
      lines.forEach(function (l, i) {
        out.push('<text x="' + f(x) + '" y="' + f(top + i * lh) + '" text-anchor="' + anchor + '" font-family=\'' + ctx.fonts.sans +
          '\' font-size="9" font-weight="700" letter-spacing="' + TRACK + '" fill="#ffffff" fill-opacity="' + lit + '">' + ctx.escape(l) + '</text>');
      });
      if (namesOnly) return;
      out.push('<text x="' + f(x) + '" y="' + f(top + lines.length * lh) + '" text-anchor="' + anchor + '" font-family=\'' + ctx.fonts.mono +
        '\' font-size="9.5" fill="' + (v ? tier.glow : '#ffffff') + '" fill-opacity="' + (v ? '1' : '.4') + '">' + ctx.escape(count) + '</text>');
      if (v) {
        out.push('<text x="' + f(x) + '" y="' + f(top + (lines.length + 1) * lh) + '" text-anchor="' + anchor + '" font-family=\'' + ctx.fonts.mono +
          '\' font-size="9" fill="#ffffff" fill-opacity=".55">' + ctx.escape(rank) + '</text>');
      }
    });
    return out.join('');
  }

  // The certificate's paper, night-sky panel and frame, shared by the certificate and its
  // verification record. extraDefs adds definitions of the caller's own.
  function shell(tier, extraDefs) {
    var s = [];
    s.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '">');
    s.push('<defs>' +
      '<radialGradient id="claude-wash-blue" cx="10%" cy="0%" r="70%"><stop offset="0" stop-color="#3788D0" stop-opacity=".13"/><stop offset="1" stop-color="#3788D0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="claude-wash-pink" cx="62%" cy="0%" r="45%"><stop offset="0" stop-color="#e84ea1" stop-opacity=".08"/><stop offset="1" stop-color="#e84ea1" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="claude-paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7faff"/><stop offset=".7" stop-color="#ffffff"/></linearGradient>' +
      '<linearGradient id="claude-sky" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#081830"/><stop offset=".55" stop-color="#0e2747"/><stop offset="1" stop-color="#16375f"/></linearGradient>' +
      '<radialGradient id="claude-sky-glow" cx="50%" cy="36%" r="55%"><stop offset="0" stop-color="#3788D0" stop-opacity=".30"/><stop offset="1" stop-color="#3788D0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="claude-glow"><stop offset="0" stop-color="' + tier.glow + '" stop-opacity=".75"/><stop offset="1" stop-color="' + tier.glow + '" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="claude-poly" gradientUnits="userSpaceOnUse" cx="' + f(CX) + '" cy="' + CY + '" r="' + R + '"><stop offset="0" stop-color="' + tier.glow + '" stop-opacity=".42"/><stop offset="1" stop-color="' + tier.glow + '" stop-opacity=".16"/></radialGradient>' +
      '<linearGradient id="claude-tier" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + tier.from + '"/><stop offset="1" stop-color="' + tier.to + '"/></linearGradient>' +
      '<linearGradient id="claude-edge" gradientUnits="userSpaceOnUse" x1="' + f(CX - R) + '" y1="' + (CY - R) + '" x2="' + f(CX + R) + '" y2="' + (CY + R) + '"><stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset="1" stop-color="' + tier.glow + '" stop-opacity=".55"/></linearGradient>' +
      '<clipPath id="claude-frame"><rect x="16" y="16" width="' + (W - 32) + '" height="' + (H - 32) + '" rx="18"/></clipPath>' +
      '<mask id="claude-moon"><rect x="' + (PANEL_X + PANEL_W - 70) + '" y="30" width="60" height="60" fill="#ffffff"/><circle cx="' + (PANEL_X + PANEL_W - 38) + '" cy="52" r="13" fill="#000000"/></mask>' +
      extraDefs + '</defs>');

    // Paper and frame.
    s.push('<rect width="' + W + '" height="' + H + '" fill="#eef3f9"/>');
    s.push('<g clip-path="url(#claude-frame)">');
    s.push('<rect x="16" y="16" width="' + (W - 32) + '" height="' + (H - 32) + '" fill="url(#claude-paper)"/>');
    s.push('<rect x="16" y="16" width="' + (W - 32) + '" height="' + (H - 32) + '" fill="url(#claude-wash-blue)"/>');
    s.push('<rect x="16" y="16" width="' + (W - 32) + '" height="' + (H - 32) + '" fill="url(#claude-wash-pink)"/>');

    // Night-sky panel.
    s.push('<rect x="' + PANEL_X + '" y="16" width="' + PANEL_W + '" height="' + (H - 32) + '" fill="url(#claude-sky)"/>');
    s.push('<rect x="' + PANEL_X + '" y="16" width="' + PANEL_W + '" height="' + (H - 32) + '" fill="url(#claude-sky-glow)"/>');
    for (var k = 0; k < 70; k++) {                            // fixed background starfield, off the chart
      var sx = PANEL_X + 10 + hash('x' + k) * (PANEL_W - 20), sy = 26 + hash('y' + k) * (H - 52);
      if (Math.abs(sx - CX) < R + 120 && sy > CY - R - 70 && sy < CY + R + 100) continue;
      s.push('<circle cx="' + f(sx) + '" cy="' + f(sy) + '" r="' + f(0.4 + hash('r' + k) * 0.8) + '" fill="#ffffff" fill-opacity="' + f(0.08 + hash('o' + k) * 0.22) + '"/>');
    }
    s.push('<circle cx="' + (PANEL_X + PANEL_W - 46) + '" cy="58" r="15" fill="#ffffff" fill-opacity=".85" mask="url(#claude-moon)"/>');
    s.push('</g>');
    s.push('<rect x="16.5" y="16.5" width="' + (W - 33) + '" height="' + (H - 33) + '" rx="18" fill="none" stroke="#d6e4f5"/>');


    return s.join('');
  }

  // Issuer row, THE ASF lockup and the trademark line.
  function footer(p, ctx) {
    var s = [], sans = ctx.fonts.sans, mono = ctx.fonts.mono, e = ctx.escape;
    // Issuer row.
    var metaY = 662;
    s.push('<line x1="' + LEFT + '" y1="' + (metaY - 24) + '" x2="' + (LEFT + CONTENT_W) + '" y2="' + (metaY - 24) + '" stroke="' + LINE + '"/>');
    [['ISSUED BY', 'The Apache SkyWalking PMC', sans, 0], ['ISSUED ON', p.issued, sans, 236], ['CERTIFICATE ID', p.certId, mono, 400]].forEach(function (m) {
      s.push('<text x="' + (LEFT + m[3]) + '" y="' + metaY + '" font-family=\'' + sans + '\' font-size="9.5" font-weight="700" letter-spacing="1.5" fill="' + MUTED + '">' + m[0] + '</text>');
      s.push('<text x="' + (LEFT + m[3]) + '" y="' + (metaY + 20) + '" font-family=\'' + m[2] + '\' font-size="14" font-weight="700" fill="#1F1F20">' + e(m[1]) + '</text>');
    });

    // THE ASF lockup (official colour file, light ground, clear space kept) and trademark line.
    var asfH = 52, asfW = asfH * 1000 / 525;
    s.push('<image href="' + ctx.assets.asfLogo + '" x="' + (LEFT - 6) + '" y="' + (H - 16 - 22 - asfH) + '" width="' + f(asfW) + '" height="' + asfH + '"/>');
    var tm = wrap(TRADEMARK, '8.5px ' + sans, CONTENT_W - asfW - 14, ctx);
    s.push(textLines(tm, f(LEFT + asfW + 8), H - 16 - 22 - asfH + 22, 11.5, 'font-family=\'' + sans + '\' font-size="8.5" fill="' + MUTED + '"', ctx));

    return s.join('');
  }

  function render(p, ctx) {
    var tier = TIERS[p.role] || TIERS.Contributor;
    var sans = ctx.fonts.sans, mono = ctx.fonts.mono, e = ctx.escape;
    var hasData = p.total != null && p.projectCount > 0;
    var areas = {};
    (p.projects || []).forEach(function (pr) { areas[pr.catalog] = true; });
    var areaCount = Object.keys(areas).length, repoCount = 0;
    ctx.catalogs.forEach(function (c) { repoCount += c.repos.length; });
    var s = [];

    s.push(shell(tier, ''));

    // Logo, eyebrow, recipient.
    s.push('<image href="' + ctx.assets.skywalkingLogo + '" x="' + LEFT + '" y="60" width="169" height="40"/>');
    s.push('<text x="' + LEFT + '" y="150" font-family=\'' + sans + '\' font-size="12.5" font-weight="700" letter-spacing="2.4" fill="' + BRAND + '">CERTIFICATE OF CONTRIBUTION</text>');
    s.push('<text x="' + LEFT + '" y="184" font-family=\'' + sans + '\' font-size="15" fill="' + BODY + '">This certificate is presented to</text>');
    var nameSize = ctx.fit(p.displayName, function (z) { return '800 ' + z + 'px ' + sans; }, CONTENT_W, 60, 28);
    s.push('<text x="' + (LEFT - 2) + '" y="' + (196 + nameSize * 0.86) + '" font-family=\'' + sans + '\' font-size="' + nameSize + '" font-weight="800" letter-spacing="' + f(-nameSize * 0.02) + '" fill="' + INK + '">' + e(p.displayName) + '</text>');

    // Tier pill and identity line.
    var pillY = 280;
    var pillText = (p.role + (p.roleNote ? ' · ' + p.roleNote : '')).toUpperCase();
    var pillW = ctx.measure(pillText, '700 11.5px ' + sans) + 11.5 * 0.12 * pillText.length + 30;
    s.push('<rect x="' + LEFT + '" y="' + pillY + '" width="' + f(pillW) + '" height="28" rx="14" fill="url(#claude-tier)"/>');
    s.push('<text x="' + (LEFT + 15) + '" y="' + (pillY + 18.5) + '" font-family=\'' + sans + '\' font-size="11.5" font-weight="700" letter-spacing="1.4" fill="#ffffff">' + e(pillText) + '</text>');
    var ident = p.kind === 'member'
      ? 'ASF ID ' + p.apacheId + (p.login ? '  ·  GitHub @' + p.login : '')
      : 'github.com/' + p.login;
    s.push('<text x="' + f(LEFT + pillW + 14) + '" y="' + (pillY + 18.5) + '" font-family=\'' + mono + '\' font-size="12" fill="#536478">' + e(ident) + '</text>');

    // Statement.
    var stmt = wrap(statement(p), '15.5px ' + sans, CONTENT_W, ctx);
    s.push(textLines(stmt, LEFT, 352, 24, 'font-family=\'' + sans + '\' font-size="15.5" fill="' + BODY + '"', ctx));

    var statsY = 352 + stmt.length * 24 + 26;
    if (hasData) {
      // Stats row.
      var stats = [
        ['CONTRIBUTIONS', num(p.total), ''],
        ['PROJECTS', String(p.projectCount), ' / ' + repoCount],
        ['CATEGORIES', String(areaCount), ' / ' + ctx.catalogs.length]
      ];
      stats.forEach(function (st, i) {
        var x = LEFT + i * 200;
        s.push('<rect x="' + x + '" y="' + statsY + '" width="3" height="56" rx="1.5" fill="url(#claude-tier)"/>');
        s.push('<text x="' + (x + 16) + '" y="' + (statsY + 14) + '" font-family=\'' + sans + '\' font-size="10.5" font-weight="700" letter-spacing="1.6" fill="' + MUTED + '">' + st[0] + '</text>');
        s.push('<text x="' + (x + 15) + '" y="' + (statsY + 50) + '" font-family=\'' + mono + '\' font-size="34" font-weight="700" letter-spacing="-1" fill="' + INK + '">' + e(st[1]) +
          '<tspan font-size="16" font-weight="500" fill="' + MUTED + '" letter-spacing="0">' + e(st[2]) + '</tspan></text>');
      });

      // Major contributions.
      var cardsY = statsY + 92;
      s.push('<text x="' + LEFT + '" y="' + cardsY + '" font-family=\'' + sans + '\' font-size="10.5" font-weight="700" letter-spacing="1.6" fill="' + MUTED + '">' +
        (p.top.length > 1 ? 'MAJOR CONTRIBUTIONS' : 'MAJOR CONTRIBUTION') + '</text>');
      p.top.forEach(function (t, i) {
        var x = LEFT + i * 308, y = cardsY + 12, w = 292;
        s.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="62" rx="12" fill="#ffffff" stroke="' + LINE + '"/>');
        var category = ctx.catalogs.filter(function (c) { return c.id === t.catalog; })[0];
        s.push('<text x="' + (x + 60) + '" y="' + (y + 19) + '" font-family=\'' + sans + '\' font-size="8.5" font-weight="700" letter-spacing="1.2" fill="' + tier.solid + '">' +
          e((category ? category.name : '').toUpperCase()) + '</text>');
        var icon = t.icon && ctx.assets.projectIcons[t.icon];
        if (icon) {
          s.push('<image href="' + icon + '" x="' + (x + 15) + '" y="' + (y + 15) + '" width="32" height="32"/>');
        } else {
          s.push('<rect x="' + (x + 15) + '" y="' + (y + 15) + '" width="32" height="32" rx="9" fill="#eef5fd" stroke="#d6e4f5"/>');
          s.push('<text x="' + (x + 31) + '" y="' + (y + 36) + '" text-anchor="middle" font-family=\'' + sans + '\' font-size="14" font-weight="800" fill="#2c6cb0">' + e(t.label.charAt(0)) + '</text>');
        }
        var labelSize = ctx.fit(t.label, function (z) { return '700 ' + z + 'px ' + sans; }, w - 76, 15, 11);
        s.push('<text x="' + (x + 60) + '" y="' + (y + 35) + '" font-family=\'' + sans + '\' font-size="' + labelSize + '" font-weight="700" fill="#1F1F20">' + e(t.label) +
          (t.archived ? '<tspan font-size="9.5" font-weight="600" fill="' + MUTED + '" letter-spacing=".8">  ARCHIVED</tspan>' : '') + '</text>');
        s.push('<text x="' + (x + 60) + '" y="' + (y + 51) + '" font-family=\'' + mono + '\' font-size="11" fill="#536478">' +
          e(num(t.contributions) + (t.contributions === 1 ? ' contribution' : ' contributions') + '  ·  #' + t.rank + ' of ' + num(t.of)) + '</text>');
      });
    } else {
      // Members without GitHub data: a role card instead of stats.
      var y0 = statsY;
      s.push('<rect x="' + LEFT + '" y="' + y0 + '" width="' + CONTENT_W + '" height="92" rx="14" fill="#ffffff" stroke="' + LINE + '"/>');
      s.push('<rect x="' + LEFT + '" y="' + y0 + '" width="4" height="92" rx="2" fill="url(#claude-tier)"/>');
      s.push('<text x="' + (LEFT + 24) + '" y="' + (y0 + 30) + '" font-family=\'' + sans + '\' font-size="10.5" font-weight="700" letter-spacing="1.6" fill="' + MUTED + '">ROLE</text>');
      s.push('<text x="' + (LEFT + 24) + '" y="' + (y0 + 60) + '" font-family=\'' + sans + '\' font-size="22" font-weight="800" fill="' + INK + '">' + e(p.role === 'PMC Member' ? 'Project Management Committee' : p.role) + '</text>');
      s.push('<text x="' + (LEFT + 24) + '" y="' + (y0 + 78) + '" font-family=\'' + mono + '\' font-size="11" fill="#536478">' +
        e('Listed at skywalking.apache.org/team/#' + p.apacheId) + '</text>');
    }

    s.push(footer(p, ctx));

    // Sky panel content.
    s.push('<text x="' + (PANEL_X + 28) + '" y="64" font-family=\'' + sans + '\' font-size="10.5" font-weight="700" letter-spacing="2" fill="#ffffff" fill-opacity=".8">CONTRIBUTION MAP</text>');
    s.push('<text x="' + (PANEL_X + 28) + '" y="82" font-family=\'' + sans + '\' font-size="10.5" fill="#ffffff" fill-opacity=".5">By category, across all ' + repoCount + ' Apache SkyWalking repositories</text>');
    s.push(polygon(p, ctx, tier));
    var captionY = CY + R + 78;
    var caption = hasData
      ? p.projectCount + ' of ' + repoCount + ' repositories  ·  ' + areaCount + ' of ' + ctx.catalogs.length + ' categories'
      : repoCount + ' repositories in ' + ctx.catalogs.length + ' categories';
    s.push('<text x="' + f(CX) + '" y="' + captionY + '" text-anchor="middle" font-family=\'' + mono + '\' font-size="10.5" fill="#ffffff" fill-opacity=".7">' + e(caption) + '</text>');

    // QR tile.
    var tile = 148, qrSize = 124, tx = CX - tile / 2, ty = 536;
    s.push('<rect x="' + f(tx) + '" y="' + ty + '" width="' + tile + '" height="' + tile + '" rx="12" fill="#ffffff"/>');
    s.push('<path d="' + ctx.qr(p.verifyUrl).path(tx + (tile - qrSize) / 2, ty + (tile - qrSize) / 2, qrSize) + '" fill="#0e2747"/>');
    s.push('<text x="' + f(CX) + '" y="' + (ty + tile + 24) + '" text-anchor="middle" font-family=\'' + sans + '\' font-size="9.5" font-weight="700" letter-spacing="1.5" fill="#ffffff" fill-opacity=".6">SCAN TO VERIFY</text>');

    s.push('</svg>');
    return s.join('');
  }

  // A rubber stamp: the project's name on the upper ring, the issue date on the lower ring and
  // VERIFIED across a band, rotated a little and inked unevenly.
  var STAMP = '#1f8a52';
  function stamp(cx, cy, issued, ctx) {
    var sans = ctx.fonts.sans, r = 62, ar = r - 15, out = [];
    out.push('<g transform="rotate(-12 ' + cx + ' ' + cy + ')" filter="url(#claude-ink)" fill="' + STAMP + '" stroke="' + STAMP + '">');
    out.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke-width="3.2"/>');
    out.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 6) + '" fill="none" stroke-width="1.1"/>');
    // Upper arc runs clockwise (text sits outside the path), lower arc counter-clockwise, so
    // both read left to right.
    out.push('<path id="claude-stamp-top" fill="none" stroke="none" d="M' + (cx - ar) + ' ' + cy + 'A' + ar + ' ' + ar + ' 0 0 1 ' + (cx + ar) + ' ' + cy + '"/>');
    var br = ar + 7;
    out.push('<path id="claude-stamp-bottom" fill="none" stroke="none" d="M' + (cx - br) + ' ' + cy + 'A' + br + ' ' + br + ' 0 0 0 ' + (cx + br) + ' ' + cy + '"/>');
    out.push('<text font-family=\'' + sans + '\' font-size="8" font-weight="800" letter-spacing="0.9" stroke="none"><textPath href="#claude-stamp-top" startOffset="50%" text-anchor="middle">APACHE SKYWALKING</textPath></text>');
    out.push('<text font-family=\'' + sans + '\' font-size="9" font-weight="800" letter-spacing="1.4" stroke="none"><textPath href="#claude-stamp-bottom" startOffset="50%" text-anchor="middle">' + ctx.escape(issued.toUpperCase()) + '</textPath></text>');
    out.push('<rect x="' + (cx - r - 12) + '" y="' + (cy - 15) + '" width="' + (2 * r + 24) + '" height="30" fill="#ffffff" stroke-width="2.4"/>');
    out.push('<text x="' + cx + '" y="' + (cy + 8) + '" text-anchor="middle" font-family=\'' + sans + '\' font-size="22" font-weight="900" letter-spacing="2.8" stroke="none">VERIFIED</text>');
    out.push('<text x="' + cx + '" y="' + (cy - 22) + '" text-anchor="middle" font-family=\'' + sans + '\' font-size="7" font-weight="800" letter-spacing="1.8" stroke="none">ISSUED</text>');
    out.push('<text x="' + cx + '" y="' + (cy + 27) + '" text-anchor="middle" font-family=\'' + sans + '\' font-size="9" stroke="none">★</text>');
    out.push('</g>');
    return out.join('');
  }

  /*
   * The verification record of a certificate, drawn from the facts of its verify link:
   * v = { displayName, kind, apacheId, login, role, total, projects, bands, categories, issued,
   * certId, date }. Bands give the polygon; categories are the category names published with
   * that day's record, so the polygon is labelled as issued (unlabelled when they are unknown).
   */
  function renderVerification(v, ctx) {
    var tier = TIERS[v.role] || TIERS.Contributor;
    var sans = ctx.fonts.sans, mono = ctx.fonts.mono, e = ctx.escape;
    var bands = v.bands.split('').map(function (b) { return parseInt(b, 11); });
    var names = v.categories && v.categories.length === bands.length ? v.categories : null;
    var cats = bands.map(function (b, i) { return { id: 'c' + i, name: names ? String(names[i]) : '', repos: [] }; });
    var categories = cats.map(function (c, i) { return { id: c.id, contributions: bands[i] ? 1 : 0, band: bands[i] }; });
    var lit = bands.filter(Boolean).length;
    var vctx = Object.assign({}, ctx, { catalogs: cats });
    var s = [];
    s.push(shell(tier, '<filter id="claude-ink" x="-15%" y="-15%" width="130%" height="130%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="11" result="noise"/>' +
      '<feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.45" result="speck"/>' +
      '<feComposite in="SourceGraphic" in2="speck" operator="in"/></filter>'));

    // Logo, eyebrow, recipient.
    s.push('<image href="' + ctx.assets.skywalkingLogo + '" x="' + LEFT + '" y="60" width="169" height="40"/>');
    s.push('<text x="' + LEFT + '" y="150" font-family=\'' + sans + '\' font-size="12.5" font-weight="700" letter-spacing="2.4" fill="' + BRAND + '">CERTIFICATE OF CONTRIBUTION  ·  VERIFICATION</text>');
    s.push('<text x="' + LEFT + '" y="184" font-family=\'' + sans + '\' font-size="15" fill="' + BODY + '">This certificate was issued to</text>');
    var nameSize = ctx.fit(v.displayName, function (z) { return '800 ' + z + 'px ' + sans; }, CONTENT_W, 60, 28);
    s.push('<text x="' + (LEFT - 2) + '" y="' + (196 + nameSize * 0.86) + '" font-family=\'' + sans + '\' font-size="' + nameSize + '" font-weight="800" letter-spacing="' + f(-nameSize * 0.02) + '" fill="' + INK + '">' + e(v.displayName) + '</text>');
    var pillY = 280, pillText = v.role.toUpperCase();
    var pillW = ctx.measure(pillText, '700 11.5px ' + sans) + 11.5 * 0.12 * pillText.length + 30;
    s.push('<rect x="' + LEFT + '" y="' + pillY + '" width="' + f(pillW) + '" height="28" rx="14" fill="url(#claude-tier)"/>');
    s.push('<text x="' + (LEFT + 15) + '" y="' + (pillY + 18.5) + '" font-family=\'' + sans + '\' font-size="11.5" font-weight="700" letter-spacing="1.4" fill="#ffffff">' + e(pillText) + '</text>');
    var ident = v.kind === 'member' ? 'ASF ID ' + v.apacheId : 'github.com/' + v.login;
    s.push('<text x="' + f(LEFT + pillW + 14) + '" y="' + (pillY + 18.5) + '" font-family=\'' + mono + '\' font-size="12" fill="#536478">' + e(ident) + '</text>');

    var stmt = wrap('by the Apache SkyWalking PMC on ' + v.issued + '. Every fact on this record is exactly as issued: ' +
      'the certificate code covers them, and it is listed among the certificates skywalking.apache.org issued that day.', '15.5px ' + sans, CONTENT_W, ctx);
    s.push(textLines(stmt, LEFT, 352, 24, 'font-family=\'' + sans + '\' font-size="15.5" fill="' + BODY + '"', ctx));

    var statsY = 352 + stmt.length * 24 + 26;
    var stats = v.total != null
      ? [['CONTRIBUTIONS', num(v.total), ''], ['PROJECTS', String(v.projects), ''], ['CATEGORIES', String(lit), ' / ' + bands.length]]
      : [['ROLE', v.role === 'PMC Member' ? 'PMC' : v.role, '']];
    stats.forEach(function (st, i) {
      var x = LEFT + i * 200;
      s.push('<rect x="' + x + '" y="' + statsY + '" width="3" height="56" rx="1.5" fill="url(#claude-tier)"/>');
      s.push('<text x="' + (x + 16) + '" y="' + (statsY + 14) + '" font-family=\'' + sans + '\' font-size="10.5" font-weight="700" letter-spacing="1.6" fill="' + MUTED + '">' + st[0] + '</text>');
      s.push('<text x="' + (x + 15) + '" y="' + (statsY + 50) + '" font-family=\'' + mono + '\' font-size="34" font-weight="700" letter-spacing="-1" fill="' + INK + '">' + e(st[1]) +
        '<tspan font-size="16" font-weight="500" fill="' + MUTED + '" letter-spacing="0">' + e(st[2]) + '</tspan></text>');
    });

    // How it was checked, beside the stamp.
    var noteY = statsY + 96;
    s.push('<text x="' + LEFT + '" y="' + noteY + '" font-family=\'' + sans + '\' font-size="10.5" font-weight="700" letter-spacing="1.6" fill="' + MUTED + '">HOW THIS IS VERIFIED</text>');
    var how = wrap('The code ' + v.certId + ' is recomputed from the facts above and found in the published record ' +
      'skywalking.apache.org/certificate/verify/' + v.date + '.txt.', '12.5px ' + sans, CONTENT_W - 190, ctx);
    s.push(textLines(how, LEFT, noteY + 22, 19, 'font-family=\'' + sans + '\' font-size="12.5" fill="' + BODY + '"', ctx));

    s.push(footer({ issued: v.issued, certId: v.certId }, ctx));
    s.push(stamp(LEFT + CONTENT_W - 72, Math.max(noteY + 24, statsY + 128), v.issued, ctx));

    // Sky panel: the polygon as issued.
    s.push('<text x="' + (PANEL_X + 28) + '" y="64" font-family=\'' + sans + '\' font-size="10.5" font-weight="700" letter-spacing="2" fill="#ffffff" fill-opacity=".8">CONTRIBUTION MAP</text>');
    s.push('<text x="' + (PANEL_X + 28) + '" y="82" font-family=\'' + sans + '\' font-size="10.5" fill="#ffffff" fill-opacity=".5">As issued on ' + e(v.issued) + '</text>');
    s.push(polygon({ categories: categories }, vctx, tier, true));
    var captionY = CY + R + 78;
    s.push('<text x="' + f(CX) + '" y="' + captionY + '" text-anchor="middle" font-family=\'' + mono + '\' font-size="10.5" fill="#ffffff" fill-opacity=".7">' +
      e(lit + ' of ' + bands.length + ' categories') + '</text>');
    [['ISSUED ON', v.issued, sans, H - 140], ['CERTIFICATE ID', v.certId, mono, H - 84]].forEach(function (m) {
      s.push('<text x="' + f(CX) + '" y="' + m[3] + '" text-anchor="middle" font-family=\'' + sans + '\' font-size="9.5" font-weight="700" letter-spacing="1.5" fill="#ffffff" fill-opacity=".6">' + m[0] + '</text>');
      s.push('<text x="' + f(CX) + '" y="' + (m[3] + 22) + '" text-anchor="middle" font-family=\'' + m[2] + '\' font-size="16" font-weight="700" fill="#ffffff">' + e(m[1]) + '</text>');
    });

    s.push('</svg>');
    return s.join('');
  }

  SWCert.designs.claude = { id: 'claude', title: 'Contribution Sky Map', render: render, renderVerification: renderVerification };
})();
