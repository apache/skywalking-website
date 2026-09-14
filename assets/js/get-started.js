(function () {
  'use strict';

  document.querySelectorAll('.qs-term').forEach(function (term) {
    var tabs = Array.prototype.slice.call(term.querySelectorAll('.qs-tab'));
    if (!tabs.length) { return; }
    function selectTab(tab) {
      tabs.forEach(function (item) {
        var selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      term.querySelectorAll('.qs-pane').forEach(function (pane) {
        var selected = pane.getAttribute('data-pane') === tab.getAttribute('data-tab');
        pane.classList.toggle('active', selected);
        pane.hidden = !selected;
      });
    }
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { selectTab(tab); });
      tab.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowRight') { next = tabs[(index + 1) % tabs.length]; }
        if (event.key === 'ArrowLeft') { next = tabs[(index - 1 + tabs.length) % tabs.length]; }
        if (event.key === 'Home') { next = tabs[0]; }
        if (event.key === 'End') { next = tabs[tabs.length - 1]; }
        if (!next) { return; }
        event.preventDefault();
        selectTab(next);
        next.focus();
      });
    });
    term.querySelectorAll('.qs-pane').forEach(function (pane, index) {
      pane.setAttribute('role', 'tabpanel');
      pane.setAttribute('aria-labelledby', tabs[index].id);
      pane.removeAttribute('aria-label');
    });
    selectTab(tabs[0]);
    term.classList.add('is-enhanced');
    term.querySelector('.qs-tabs').hidden = false;
  });

  var status = document.getElementById('qs-copy-status');
  document.querySelectorAll('.qs-copy').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!navigator.clipboard) {
        status.textContent = 'Copy is unavailable in this browser. Select and copy the commands.';
        return;
      }
      navigator.clipboard.writeText(button.getAttribute('data-code') || '').then(function () {
        button.textContent = 'Copied';
        status.textContent = 'Commands copied to clipboard.';
        setTimeout(function () { button.textContent = 'Copy'; }, 1400);
      }).catch(function () {
        status.textContent = 'Copy was unavailable. Select and copy the commands.';
      });
    });
    button.hidden = false;
  });
}());
