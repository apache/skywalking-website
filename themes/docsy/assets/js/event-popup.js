$(function () {
    var $popup = $('.sky-event-popup')
    var key = 'SkyWalkingPopupClosedTime';

    if (!$popup || isShowed(key)) {
        return;
    }
    var $items = $popup.find('.item');
    var $pic = $popup.find('.pic');

    init()

    function init() {
        var count = getActiveCount()
        if (!count) {
            return;
        }
        showPopover(count)
        bindClick()
    }

    function getActiveCount() {
        var count = 0;
        $.each($items, function (index, item) {
            var startTime = $(item).data('starttime');
            var endTime = $(item).data('endtime');
            if (isDuringTime(startTime, endTime)) {
                $(item).show()
                count++
            }
        })
        return count
    }

    function showPopover(count) {
        var src;
        if (count === 1) {
            $('.sky-event-popup .content-box').addClass('one')
            src = $items.eq(0).data('img')
        } else {
            $items.sort(function (a, b) {
                var aDate = new Date($(a).data('endtime'))
                var bDate = new Date($(b).data('endtime'))
                return aDate.getTime() - bDate.getTime()
            })
            $.each($items, function (index, item) {
                var img = $(item).data('img')
                if (img) {
                    src = img;
                    return false
                }
            })
            $('.content-box').html($items)
        }
        if (!src) {
            src = $pic.data('img')
            $pic.css('height', 'auto')
        }
        $pic.attr('src', src)

        setTimeout(function () {
            $popup.show()
        }, 1000)
    }

    function bindClick() {
        $popup.find('.fa-window-close').on('click', function () {
            localStorage.setItem(key, new Date());
            $popup.hide()
        })
    }


    function isShowed(key) {
        var storageTime = formatTime(localStorage.getItem(key));
        var now = formatTime(new Date());
        return storageTime === now;
    }

    function formatTime(time) {
        var date = new Date(time);
        return (
            date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        );
    }

    function isDuringTime(startTimeStr, endTimeStr) {
        var currTime = new Date();
        var startTime = new Date(startTimeStr);
        var endTime = new Date(endTimeStr);
        return currTime <= endTime && (currTime >= startTime || !startTimeStr)
    }

})