(function () {
  'use strict';

  document.querySelectorAll('[data-home-gallery]').forEach(function (gallery) {
    var tablist = gallery.querySelector('[data-home-gallery-tabs]');
    if (!tablist) { return; }
    var panels = Array.prototype.slice.call(gallery.querySelectorAll('[data-home-gallery-panel]'));
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[data-home-gallery-tab]'));
    var entries = tabs.map(function (tab) {
      var target = tab.getAttribute('data-home-gallery-tab') || tab.getAttribute('aria-controls');
      return {tab: tab, panel: panels.find(function (panel) { return panel.id === target; })};
    });
    // Keep the default screenshot if the gallery markup is incomplete.
    if (!entries.length || entries.some(function (entry) { return !entry.panel; })) { return; }

    function selectTab(selected) {
      entries.forEach(function (entry) {
        var active = entry === selected;
        entry.tab.setAttribute('aria-selected', String(active));
        entry.tab.tabIndex = active ? 0 : -1;
        entry.panel.hidden = !active;
      });
    }

    entries.forEach(function (entry, index) {
      entry.tab.setAttribute('role', 'tab');
      entry.tab.setAttribute('aria-controls', entry.panel.id);
      entry.panel.setAttribute('role', 'tabpanel');
      entry.panel.setAttribute('aria-labelledby', entry.tab.id);
      entry.tab.addEventListener('click', function () { selectTab(entry); });
      entry.tab.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowRight') { next = entries[(index + 1) % entries.length]; }
        if (event.key === 'ArrowLeft') { next = entries[(index - 1 + entries.length) % entries.length]; }
        if (event.key === 'Home') { next = entries[0]; }
        if (event.key === 'End') { next = entries[entries.length - 1]; }
        if (!next) { return; }
        event.preventDefault();
        selectTab(next);
        next.tab.focus();
      });
    });
    selectTab(entries.find(function (entry) { return !entry.panel.hidden; }) || entries[0]);
    tablist.setAttribute('role', 'tablist');
    tablist.hidden = false;
  });

  // Retain the documentation links in browsers without native modal dialogs.
  if (!window.HTMLDialogElement || !HTMLDialogElement.prototype.showModal) { return; }

  var activePreview = null;

  function lockPage() {
    var body = document.body;
    var root = document.documentElement;
    var state = {
      x: window.scrollX,
      y: window.scrollY,
      bodyStyle: body.getAttribute('style'),
      rootStyle: root.getAttribute('style')
    };
    var scrollbarWidth = window.innerWidth - root.clientWidth;
    var bodyPadding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    root.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = -state.y + 'px';
    body.style.left = -state.x + 'px';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = bodyPadding + scrollbarWidth + 'px';
    }
    return state;
  }

  function restorePage(state) {
    var body = document.body;
    var root = document.documentElement;
    if (state.bodyStyle === null) { body.removeAttribute('style'); }
    else { body.setAttribute('style', state.bodyStyle); }
    // Restore the scroll position without the site's smooth-scroll behavior.
    root.style.scrollBehavior = 'auto';
    window.scrollTo(state.x, state.y);
    if (state.rootStyle === null) { root.removeAttribute('style'); }
    else { root.setAttribute('style', state.rootStyle); }
  }

  function outsideDialog(dialog, event) {
    var bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
  }

  document.querySelectorAll('[data-home-preview]').forEach(function (trigger) {
    var dialog = document.getElementById(trigger.getAttribute('data-home-preview'));
    if (!dialog || dialog.tagName !== 'DIALOG') { return; }
    var closeButton = dialog.querySelector('[data-home-preview-close]');
    if (!closeButton) { return; }
    var backdropPointerDown = false;

    function openPreview() {
      if (activePreview) { return; }
      var state = lockPage();
      try {
        dialog.showModal();
      } catch (error) {
        restorePage(state);
        return;
      }
      activePreview = {dialog: dialog, trigger: trigger, state: state};
      closeButton.focus({preventScroll: true});
    }

    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', dialog.id);
    trigger.addEventListener('click', function (event) {
      // Keep the underlying documentation destination available in a new tab.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) { return; }
      event.preventDefault();
      openPreview();
    });
    trigger.addEventListener('keydown', function (event) {
      if (event.key !== ' ' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) { return; }
      event.preventDefault();
      openPreview();
    });

    closeButton.addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab' || event.metaKey || event.ctrlKey || event.altKey) { return; }
      var controls = Array.prototype.slice.call(dialog.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(function (control) {
        return control.getClientRects().length > 0 && control.getAttribute('aria-hidden') !== 'true' &&
          window.getComputedStyle(control).visibility !== 'hidden';
      });
      if (!controls.length) { return; }
      // Keep every dialog action reachable, including with Safari's default
      // setting that otherwise skips links when navigating with Tab.
      var current = controls.indexOf(document.activeElement);
      var next = current < 0 ? (event.shiftKey ? controls.length - 1 : 0) :
        (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
      event.preventDefault();
      controls[next].focus();
    });
    dialog.addEventListener('pointerdown', function (event) {
      backdropPointerDown = event.target === dialog && outsideDialog(dialog, event);
    });
    dialog.addEventListener('pointercancel', function () { backdropPointerDown = false; });
    dialog.addEventListener('click', function (event) {
      var dismiss = backdropPointerDown && event.target === dialog && outsideDialog(dialog, event);
      backdropPointerDown = false;
      if (dismiss) { dialog.close(); }
    });
    dialog.addEventListener('close', function () {
      backdropPointerDown = false;
      if (!activePreview || activePreview.dialog !== dialog) { return; }
      var preview = activePreview;
      activePreview = null;
      restorePage(preview.state);
      preview.trigger.focus({preventScroll: true});
    });
  });
}());
