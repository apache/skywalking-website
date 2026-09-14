// The full catalog renders without JavaScript; filtering enhances its anchor links.
(function () {
  var catalog = document.querySelector('.docs-catalog');
  if (!catalog) return;
  document.querySelectorAll('[data-docs-controls]').forEach(function (control) {
    var select = control.querySelector('.docs-version-select');
    if (!select) return;
    var link = control.querySelector('.docs-btn');
    function updateDocumentationLink() {
      link.setAttribute('href', select.value);
      var download = control.querySelector('.docs-download');
      if (download) {
        var downloadLink = select.selectedOptions[0].getAttribute('data-download-link');
        download.hidden = !downloadLink;
        if (downloadLink) download.setAttribute('href', downloadLink);
      }
      link.setAttribute('aria-label', 'Read ' + control.getAttribute('data-project-name') + ' documentation: ' + select.selectedOptions[0].textContent);
      if (/^https?:\/\//.test(select.value)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener');
      } else {
        link.removeAttribute('target');
        link.removeAttribute('rel');
      }
    }
    select.addEventListener('change', updateDocumentationLink);
    updateDocumentationLink();
    select.hidden = false;
    control.querySelector('.docs-version-fallback').hidden = true;
  });
  var input = document.getElementById('project-search');
  var sections = Array.from(catalog.querySelectorAll('[data-category-section]'));
  var links = Array.from(catalog.querySelectorAll('[data-category]'));
  var category = '';
  var count = document.getElementById('project-result-count');
  catalog.querySelector('.docs-search').hidden = false;
  catalog.querySelector('.docs-results-bar').hidden = false;

  function filter() {
    var terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var total = 0;
    sections.forEach(function (section) {
      var matches = 0;
      section.querySelectorAll('[data-project-search]').forEach(function (card) {
        var show = (!category || category === section.id) && terms.every(function (term) {
          return card.getAttribute('data-project-search').includes(term);
        });
        card.hidden = !show;
        if (show) matches++;
      });
      section.hidden = matches === 0;
      total += matches;
    });
    links.forEach(function (link) {
      var active = link.getAttribute('data-category') === category;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    count.textContent = total + (total === 1 ? ' project' : ' projects') + ' shown';
    catalog.querySelector('.docs-empty').hidden = total !== 0;
    catalog.querySelector('.docs-results-bar .docs-reset').hidden = !category && !input.value;
  }

  function followHash() {
    var id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { return; }
    var gettingStarted = { 'get-started': '', 'qs-showcase': '#qs-showcase', 'qs-skywalking': '#qs-skywalking', 'Showcase': '#qs-showcase', 'SkyWalkingShowcase': '#qs-showcase', 'SkyWalkingWebsite': '#contribute' };
    if (Object.prototype.hasOwnProperty.call(gettingStarted, id)) {
      location.replace('/get-started/' + gettingStarted[id]);
      return;
    }
    if (!id) {
      category = '';
      input.value = '';
      filter();
      return;
    }
    if (id === 'verify-downloads') {
      location.replace('/downloads/#verify-downloads');
      return;
    }
    var target = document.getElementById(id);
    if (!target) return;
    if (target.classList.contains('docs-download')) {
      location.replace(target.href);
      return;
    }
    if (!catalog.contains(target)) return;
    var section = target.closest('[data-category-section]');
    category = section ? section.id : '';
    input.value = '';
    filter();
    requestAnimationFrame(function () {
      (target.closest('.docs-card') || target).scrollIntoView({block: 'start'});
    });
  }

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      category = link.getAttribute('data-category');
      input.value = '';
      filter();
    });
  });
  document.querySelectorAll('.sw-projects-content a[href]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      // Reopening the current project or category must clear any search hiding it.
      if (link.origin === location.origin && link.pathname === location.pathname && link.hash === location.hash) {
        followHash();
      }
    });
  });
  input.addEventListener('input', filter);
  catalog.querySelectorAll('.docs-reset').forEach(function (button) {
    button.addEventListener('click', function () {
      category = '';
      input.value = '';
      history.replaceState(null, '', location.pathname + location.search);
      filter();
      input.focus();
    });
  });
  window.addEventListener('hashchange', followHash);
  filter();
  followHash();
})();
