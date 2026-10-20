/*
 * SkyWalking certificate runtime — shared by every certificate design.
 *
 * A design registers itself as SWCert.designs[id] = { id, title, render(person, ctx) } and
 * returns a complete, self-contained SVG string (viewBox 0 0 1123 794, A4 landscape).
 * The runtime supplies ctx: inlined assets (data: URIs, so the exported PNG has no external
 * references), a QR encoder, text measurement for auto-fit, and escaping.
 */
(function () {
  'use strict';

  var SWCert = window.SWCert = window.SWCert || {};
  SWCert.designs = SWCert.designs || {};
  SWCert.WIDTH = 1123;
  SWCert.HEIGHT = 794;

  var FONTS = {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace'
  };

  function toDataURI(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.blob();
    }).then(function (blob) {
      return new Promise(function (resolve) {
        var fr = new FileReader();
        fr.onload = function () { resolve(fr.result); };
        fr.readAsDataURL(blob);
      });
    });
  }

  function escapeXml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  var measureCtx = null;
  function measure(text, font) {
    measureCtx = measureCtx || document.createElement('canvas').getContext('2d');
    measureCtx.font = font;
    return measureCtx.measureText(String(text)).width;
  }

  // Largest font size in [min, max] at which text fits maxWidth. fontFor(size) returns a CSS font.
  function fit(text, fontFor, maxWidth, max, min) {
    for (var size = max; size > min; size -= 1) {
      if (measure(text, fontFor(size)) <= maxWidth) return size;
    }
    return min;
  }

  // QR modules for text. path(x, y, size) returns one SVG path covering every dark module,
  // drawn inside a size×size square (no quiet zone; callers leave >= 4 modules of margin).
  function qr(text) {
    var q = window.qrcode(0, 'M');
    q.addData(text);
    q.make();
    var n = q.getModuleCount();
    return {
      size: n,
      isDark: function (r, c) { return q.isDark(r, c); },
      path: function (x, y, size) {
        // One subpath per horizontal run of dark modules keeps the SVG small.
        var cell = size / n, d = [];
        for (var r = 0; r < n; r++) {
          for (var c = 0; c < n; c++) {
            if (!q.isDark(r, c)) continue;
            var run = 1;
            while (c + run < n && q.isDark(r, c + run)) run++;
            var w = run * cell;
            d.push('M' + (x + c * cell).toFixed(2) + ' ' + (y + r * cell).toFixed(2) +
              'h' + w.toFixed(2) + 'v' + cell.toFixed(2) + 'h-' + w.toFixed(2) + 'z');
            c += run - 1;
          }
        }
        return d.join('');
      }
    };
  }

  SWCert.fonts = FONTS;

  /*
   * opts: { files: { skywalkingLogo, skywalkingLogoWhite, asfLogo, asfOakleaf } (URLs),
   *         iconBase: URL prefix of the per-project icons (<icon>.svg), catalogs, totalPeople }
   * Resolves to the ctx object passed to every design's render().
   */
  SWCert.buildContext = function (opts) {
    var files = opts.files;
    var iconBase = opts.iconBase.replace(/\/?$/, '/');
    var icons = {};
    (opts.catalogs || []).forEach(function (c) {
      c.repos.forEach(function (r) { if (r.icon) icons[r.icon] = true; });
    });
    var assets = { projectIcons: {} };
    var jobs = Object.keys(files).map(function (k) {
      return toDataURI(files[k]).then(function (u) { assets[k] = u; });
    }).concat(Object.keys(icons).map(function (k) {
      return toDataURI(iconBase + k + '.svg')
        .then(function (u) { assets.projectIcons[k] = u; })
        .catch(function () { /* missing icon: designs fall back to a glyph */ });
    }));
    return Promise.all(jobs).then(function () {
      return {
        width: SWCert.WIDTH, height: SWCert.HEIGHT,
        fonts: FONTS,
        assets: assets,
        catalogs: opts.catalogs || [],
        totalPeople: opts.totalPeople || 0,
        qr: qr, measure: measure, fit: fit, escape: escapeXml
      };
    });
  };

  SWCert.render = function (designId, person, ctx) {
    var design = SWCert.designs[designId];
    if (!design) throw new Error('Unknown certificate design: ' + designId);
    return design.render(person, ctx);
  };

  function slug(person) {
    return String(person.login || person.apacheId || 'certificate').replace(/[^A-Za-z0-9_-]/g, '');
  }

  // Rasterise an SVG string to PNG at the given scale and download it.
  SWCert.downloadPNG = function (svg, person, scale) {
    scale = scale || 2;
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = SWCert.WIDTH * scale;
        canvas.height = SWCert.HEIGHT * scale;
        var g = canvas.getContext('2d');
        g.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(function (blob) {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'apache-skywalking-certificate-' + slug(person) + '.png';
          document.body.appendChild(a);
          a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
          resolve({ width: canvas.width, height: canvas.height, bytes: blob.size });
        }, 'image/png');
      };
      img.onerror = function () { reject(new Error('SVG failed to rasterise')); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  };
})();
