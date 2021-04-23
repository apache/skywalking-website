$(function () {
  var $popup = $('.sky-event-popup')
  if (!$popup) {
    return;
  }
  var key = 'SkyWalkingPopupClosedTime';
  var startDate = $popup.data('startdate');
  var endDate = $popup.data('enddate');
  if (!isShowed(key) && isDuringDate(startDate, endDate)) {
    $popup.show()
  }
  $popup.find('.fa-window-close').on('click', function () {
    localStorage.setItem(key, new Date());
    $popup.hide()
  })

  function isShowed(key) {
    var storageTime = formatDate(localStorage.getItem(key));
    var now = formatDate(new Date());
    return storageTime === now;
  }

  function formatDate(strTime) {
    const date = new Date(strTime);
    return (
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
  }

  function isDuringDate(startDateStr, endDateStr) {
    var currDate = new Date();
    var startDate = new Date(startDateStr);
    var endDate = new Date(endDateStr);
    if (currDate <= endDate && (currDate >= startDate || !startDateStr)) {
      return true;
    }
    return false;
  }

})