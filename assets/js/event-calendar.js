// Event permalinks reveal the matching year; native anchors work without JavaScript.
(function () {
  'use strict';
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.cal-yr-btn'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('.cal-yeargroup'));
  var stamps = Array.prototype.slice.call(document.querySelectorAll('.cal-yeargroup .cal-year'));
  var status = document.getElementById('cal-share-status');

  function showYear(year) {
    groups.forEach(function (group) { group.hidden = !(year === 'all' || group.getAttribute('data-year') === year); });
    stamps.forEach(function (stamp) { stamp.hidden = year !== 'all'; });
    buttons.forEach(function (button) {
      var active = button.getAttribute('data-year') === year;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function followHash() {
    var id = '';
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (error) { /* Use the default year for malformed fragments. */ }
    var target = document.getElementById(id);
    var card = target && target.classList.contains('cal-card') ? target : null;
    var group = card && card.closest('.cal-yeargroup');
    var year = group ? group.getAttribute('data-year') : id;
    var knownYear = buttons.some(function (button) { return button.getAttribute('data-year') === year; });
    showYear(knownYear ? year : buttons.length ? buttons[0].getAttribute('data-year') : 'all');
    if (card) {
      requestAnimationFrame(function () { card.scrollIntoView({block: 'start'}); });
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      location.hash = button.getAttribute('data-year');
      followHash();
    });
  });

  document.querySelectorAll('[data-event-share]').forEach(function (link) {
    var label = link.querySelector('[data-share-label]');
    var reset;
    function feedback(copied) {
      clearTimeout(reset);
      label.textContent = copied ? 'Link copied' : 'Link in address bar';
      status.textContent = copied ? 'Event link copied.' : 'Copy the event link from your address bar.';
      reset = setTimeout(function () { label.textContent = 'Share event'; }, 2400);
    }
    link.addEventListener('click', function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      var url = new URL(link.href);
      function useAddressBar() {
        location.hash = url.hash;
        followHash();
        feedback(false);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url.href).then(function () { feedback(true); }, useAddressBar);
      } else {
        useAddressBar();
      }
    });
  });

  window.addEventListener('hashchange', followHash);
  followHash();
}());
