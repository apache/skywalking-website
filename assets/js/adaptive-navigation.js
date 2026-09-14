// Keep desktop links in the header, using More only when they do not all fit.
(function () {
  'use strict';
  var navigation = document.getElementById('navigation');
  var toggle = document.getElementById('more-menu-toggle');
  if (!navigation || !toggle) { return; }
  var list = navigation.querySelector('.navbar-nav');
  var more = toggle.closest('[data-nav-more]');
  var menu = more && more.querySelector('.sw-more-menu');
  if (!list || !menu) { return; }
  var overflowLinks = Array.prototype.slice.call(menu.querySelectorAll('[data-nav-overflow]'));
  var items = Array.prototype.map.call(list.querySelectorAll('[data-nav-promote]'), function (item) {
    var key = item.getAttribute('data-nav-promote');
    return {
      item: item,
      overflow: overflowLinks.find(function (link) { return link.getAttribute('data-nav-overflow') === key; })
    };
  });
  if (!items.length) { return; }
  var activeLinks = Array.prototype.slice.call(menu.querySelectorAll('a[aria-current]'));
  var desktop = window.matchMedia('(min-width: 1200px)');
  var frame = 0;

  function updateMore(count) {
    toggle.classList.toggle('active', activeLinks.some(function (link) {
      if (link.getAttribute('aria-current') === 'false') { return false; }
      var index = items.findIndex(function (entry) { return entry.overflow === link; });
      return index === -1 ? !link.hidden : index >= count;
    }));
  }

  function closeMore() {
    if (window.jQuery && window.jQuery.fn && typeof window.jQuery.fn.dropdown === 'function') {
      try { window.jQuery(toggle).dropdown('hide'); } catch (error) { /* Reset older dropdown implementations below. */ }
    }
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('show');
    more.classList.remove('show');
    menu.classList.remove('show');
  }

  function pixels(value) { return parseFloat(value) || 0; }

  function fits() {
    var navigationStyle = window.getComputedStyle(navigation);
    var listStyle = window.getComputedStyle(list);
    var available = navigation.clientWidth - pixels(navigationStyle.paddingLeft) - pixels(navigationStyle.paddingRight);
    var width = pixels(listStyle.marginLeft) + pixels(listStyle.marginRight) +
      pixels(listStyle.paddingLeft) + pixels(listStyle.paddingRight) +
      pixels(listStyle.borderLeftWidth) + pixels(listStyle.borderRightWidth);
    var visible = 0;
    Array.prototype.forEach.call(list.children, function (item) {
      var style = window.getComputedStyle(item);
      if (style.display === 'none') { return; }
      width += item.getBoundingClientRect().width + pixels(style.marginLeft) + pixels(style.marginRight);
      visible++;
    });
    width += Math.max(0, visible - 1) * pixels(listStyle.columnGap);
    return width <= available;
  }

  function arrange() {
    frame = 0;
    var focused = document.activeElement;
    var count = 0;
    if (desktop.matches && navigation.clientWidth > 0) {
      // Measure the real links in one frame; no clones or intermediate state is painted.
      items.forEach(function (entry) { entry.item.hidden = false; });
      count = items.length;
      more.hidden = true;
      updateMore(count);
      if (!fits()) {
        more.hidden = false;
        do {
          count--;
          items[count].item.hidden = true;
          // More's active font weight can also affect which prefix fits.
          updateMore(count);
        } while (count > 0 && !fits());
      }
    }
    items.forEach(function (entry, index) {
      entry.item.hidden = index >= count;
      if (entry.overflow) { entry.overflow.hidden = index < count; }
    });
    more.hidden = count === items.length;
    updateMore(count);
    if (more.hidden || !desktop.matches) { closeMore(); }
    if (!desktop.matches) { return; }
    var focusTarget;
    items.forEach(function (entry) {
      if (entry.item.hidden && entry.item.contains(focused)) {
        focusTarget = toggle;
      } else if (entry.overflow && entry.overflow.hidden && entry.overflow.contains(focused)) {
        focusTarget = entry.item.querySelector('a');
      }
    });
    if (!focusTarget && more.contains(focused)) {
      if (more.hidden) { focusTarget = items[count - 1].item.querySelector('a'); }
      // Restore focus if the temporary all-links measurement hid the open menu.
      else if (document.activeElement !== focused) { focusTarget = focused; }
    }
    if (focusTarget) { focusTarget.focus({ preventScroll: true }); }
  }

  function schedule() {
    if (!frame) { frame = window.requestAnimationFrame(arrange); }
  }

  window.addEventListener('resize', schedule);
  if (desktop.addEventListener) { desktop.addEventListener('change', schedule); }
  else { desktop.addListener(schedule); }
  if (window.ResizeObserver) {
    var observedWidth;
    var observer = new ResizeObserver(function (entries) {
      var width = entries[0].contentRect.width;
      // Only available width matters; link visibility must not feed an observer loop.
      if (width !== observedWidth) { observedWidth = width; schedule(); }
    });
    observer.observe(navigation);
  }
  if (document.fonts) {
    document.fonts.ready.then(schedule);
    if (document.fonts.addEventListener) { document.fonts.addEventListener('loadingdone', schedule); }
  }
  schedule();
}());
