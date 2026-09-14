$(function () {
  init();

  function init() {
    // Catalog pages handle selection and anchor positioning in their own scripts.
    if (document.querySelector('.docs-catalog, .download-hub')) return;
    bindClick();
    setActive();
  }

  function bindClick() {
    $('.container a').not('.link-type').on('click', function () {
      var hash = $(this).attr('href')
      if (hash && /^#/.test(hash)) {
        scrollTop(hash);
        $('.card-wrapper .card').removeClass('active');
        targetForHash(hash).parents('.card').addClass('active');
      }
    });
    $('.link-type').on('click', function () {
      var hash = $(this).attr('href')
      scrollTop(hash, 120);
    })
  }

  function targetForHash(hash) {
    if (!hash || hash.charAt(0) !== '#') {
      return $();
    }
    try {
      return $(document.getElementById(decodeURIComponent(hash.slice(1))));
    } catch (e) {
      return $();
    }
  }

  function scrollTop(hash, offset) {
    var target = targetForHash(hash);
    if (!target.length) {
      return;
    }
    $('html,body').animate({scrollTop: target.offset().top - (offset || 160)})
  }

  function setActive() {
    var hash = location.hash;
    var target = targetForHash(hash);
    if (!target.length) {
      return;
    }
    target.parents('.card').addClass('active');
    scrollTop(hash)
  }
})
