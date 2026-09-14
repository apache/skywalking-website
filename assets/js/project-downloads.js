// Native links expose every project and release; JavaScript adds project selection.
(function () {
  'use strict';
  var hub = document.querySelector('.download-hub');
  if (!hub) { return; }
  var projects = Array.prototype.slice.call(hub.querySelectorAll('[data-download-project]'));
  if (!projects.length) { return; }
  var links = Array.prototype.slice.call(hub.querySelectorAll('[data-download-link]'));
  var groups = Array.prototype.slice.call(hub.querySelectorAll('[data-download-group]'));
  var input = document.getElementById('download-search');
  var picker = document.getElementById('download-project');
  var searchStatus = document.getElementById('download-search-status');
  var selectionStatus = hub.querySelector('.dh-selection-status');
  var empty = hub.querySelector('.dh-search-empty');
  var byId = {};
  var selectedId = '';
  var releaseControls = {};
  var expandedBeforeSearch = null;
  var defaultId = projects.some(function (project) { return project.id === 'skywalking'; }) ? 'skywalking' : projects[0].id;
  var targets = {};
  try { targets = JSON.parse(document.getElementById('download-targets').textContent); } catch (error) { /* Native IDs still work. */ }
  projects.forEach(function (project) { byId[project.id] = project; });
  var pickerGroups = Array.prototype.map.call(picker.querySelectorAll('optgroup'), function (group) {
    return { label: group.label, options: Array.prototype.map.call(group.querySelectorAll('option'), function (option) {
      return { value: option.value, label: option.textContent };
    }) };
  });

  function filterProjects() {
    var terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length && expandedBeforeSearch === null) {
      expandedBeforeSearch = {};
      groups.forEach(function (group) { expandedBeforeSearch[group.id] = group.open; });
    }
    var visible = {};
    var count = 0;
    links.forEach(function (link) {
      var matches = terms.every(function (term) { return link.getAttribute('data-download-search').indexOf(term) !== -1; });
      link.hidden = !matches;
      if (matches) { visible[link.getAttribute('data-download-link')] = true; count++; }
    });
    groups.forEach(function (group) {
      var matches = Array.prototype.filter.call(group.querySelectorAll('[data-download-link]'), function (link) { return !link.hidden; }).length;
      group.hidden = matches === 0;
      var badge = group.querySelector('.dh-nav-count');
      badge.textContent = matches;
      badge.setAttribute('aria-label', matches + (matches === 1 ? ' project' : ' projects'));
      if (terms.length) { group.open = matches > 0; }
      else if (expandedBeforeSearch !== null) { group.open = expandedBeforeSearch[group.id] || group.classList.contains('has-selection'); }
    });
    if (!terms.length) { expandedBeforeSearch = null; }
    empty.hidden = count !== 0;
    searchStatus.textContent = count + (count === 1 ? ' project' : ' projects') + ' found';
    picker.textContent = '';
    if (!visible[selectedId]) {
      var placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = count ? 'Choose a matching project' : 'No matching projects';
      placeholder.disabled = true;
      picker.appendChild(placeholder);
    }
    pickerGroups.forEach(function (group) {
      var optionGroup = document.createElement('optgroup');
      optionGroup.label = group.label;
      group.options.forEach(function (option) {
        if (!visible[option.value]) { return; }
        var item = document.createElement('option');
        item.value = option.value;
        item.textContent = option.label;
        optionGroup.appendChild(item);
      });
      if (optionGroup.children.length) { picker.appendChild(optionGroup); }
    });
    picker.value = visible[selectedId] ? selectedId : '';
    picker.disabled = count === 0;
  }

  function showProject(id, scroll) {
    if (!byId[id]) { id = defaultId; }
    selectedId = id;
    var selectedLink = links.find(function (link) { return link.getAttribute('data-download-link') === id; });
    var terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (selectedLink && !terms.every(function (term) { return selectedLink.getAttribute('data-download-search').indexOf(term) !== -1; })) {
      input.value = '';
    }
    projects.forEach(function (project) { project.hidden = project.id !== id; });
    links.forEach(function (link) {
      var active = link.getAttribute('data-download-link') === id;
      link.classList.toggle('is-active', active);
      if (active) { link.setAttribute('aria-current', 'location'); }
      else { link.removeAttribute('aria-current'); }
    });
    groups.forEach(function (group) {
      var active = group.contains(selectedLink);
      group.classList.toggle('has-selection', active);
      if (active) { group.open = true; }
    });
    selectionStatus.textContent = byId[id].querySelector('h2').textContent + ' downloads selected';
    var releaseControl = releaseControls[id];
    if (releaseControl) {
      var requestedVersion = new URL(location.href).searchParams.get('version');
      var exists = Array.prototype.some.call(releaseControl.select.options, function (option) { return option.value === requestedVersion; });
      releaseControl.select.value = exists ? requestedVersion : releaseControl.defaultVersion;
      releaseControl.update();
    }
    filterProjects();
    if (scroll) {
      byId[id].focus({ preventScroll: true });
      byId[id].scrollIntoView({ block: 'start' });
    }
  }

  function followHash(scroll) {
    var id = '';
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (error) { /* Show the default project. */ }
    var originalId = id;
    if (!byId[id] && Object.prototype.hasOwnProperty.call(targets, id)) {
      try { id = decodeURIComponent(new URL(targets[id], location.href).hash.slice(1)); } catch (error) { id = originalId; }
      if (id !== originalId) { history.replaceState(null, '', location.pathname + location.search + '#' + encodeURIComponent(id)); }
    }
    if (id === 'verify-downloads') {
      showProject(selectedId || defaultId, false);
      var help = document.getElementById('verify-downloads');
      if (help) {
        var details = help.querySelector('details');
        if (details) { details.open = true; }
        if (scroll) { help.scrollIntoView({ block: 'start' }); }
      }
      return;
    }
    var group = groups.find(function (item) { return item.getAttribute('data-download-group') === id; });
    if (group) { id = group.querySelector('[data-download-link]').getAttribute('data-download-link'); }
    showProject(byId[id] ? id : defaultId, scroll && !!id);
  }

  function chooseProject(id) {
    if (!byId[id]) { return; }
    if (location.hash !== '#' + id) {
      var target = new URL(location.href);
      target.hash = id;
      target.searchParams.delete('version');
      history.pushState(null, '', target.pathname + target.search + target.hash);
    }
    showProject(id, true);
  }
  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) { return; }
      event.preventDefault();
      chooseProject(link.getAttribute('data-download-link'));
    });
  });
  picker.addEventListener('change', function () { chooseProject(picker.value); });
  input.addEventListener('input', filterProjects);
  window.addEventListener('resize', function () {
    if (window.innerWidth < 900 && input.value) {
      input.value = '';
      filterProjects();
    }
  });
  hub.querySelectorAll('.dh-component').forEach(function (component) {
    var select = component.querySelector('.dh-version-select');
    if (!select) { return; }
    var releases = component.querySelectorAll('.dh-release');
    function selectVersion() {
      releases.forEach(function (release) { release.hidden = release.getAttribute('data-release-version') !== select.value; });
    }
    releaseControls[component.closest('[data-download-project]').id] = {select: select, defaultVersion: select.value, update: selectVersion};
    select.addEventListener('change', function () {
      selectVersion();
      var target = new URL(location.href);
      target.hash = selectedId;
      target.searchParams.set('version', select.value);
      history.replaceState(null, '', target.pathname + target.search + target.hash);
    });
    selectVersion();
    component.querySelector('.dh-version-control').hidden = false;
  });
  hub.classList.add('is-enhanced');
  hub.querySelector('.dh-search').hidden = false;
  hub.querySelector('.dh-project-picker').hidden = false;
  groups.forEach(function (group) { group.open = false; });
  window.addEventListener('hashchange', function () { followHash(true); });
  window.addEventListener('popstate', function () { followHash(true); });
  followHash(!!location.hash);
}());
