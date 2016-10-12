var app = (function ($) {
    "use strict";

    var pages = [],
        slider;

    var onchangePagesIndex = function (currentPageIndex) {
        var currentPage = currentPageIndex + 1 || 1,
            pagesCount = $('.slider-item').size(),
            $pagesNumber = $('.pages-number');

        if (!$pagesNumber.length) {
            $('.bx-wrapper').append('<div class="pages-number">' + currentPage + '/' + pagesCount);
        }

        $pagesNumber.text(currentPage + '/' + pagesCount);
    };

    var initSlider = function () {
        slider = $('#slider').bxSlider({
            infiniteLoop: false,
            hideControlOnEnd: true,
            pager: false,

            onSliderLoad: function () {
                onchangePagesIndex();
            },

            onSlideAfter: function ($slideElement, oldIndex, newIndex) {
                onchangePagesIndex(newIndex);
            }
        });
    };

    var constructListOfPages = function () {
        pages.forEach(function (item) {
            $('#slider').append('<li class="slider-item">');
            $('.slider-item:last-child').html(item);
        });

        // initSlider();
    };

    var pageThread = function (html) {
        var htmlLength = html.length,
            currentElementOffsetTop, currentElementHeight;

        for (var i=0; i<htmlLength; i++) {
            currentElementOffsetTop = html.eq(i).offset().top;
            currentElementHeight = html.eq(i).height();

            if (currentElementOffsetTop + currentElementHeight > 480) {
                pages.push(html.slice(0, i));

                html = $('#view').html(html.slice(i)).find('*');

                pageThread(html);
                break;
            }

            if (i === htmlLength - 1) {
                pages.push(html);

                constructListOfPages();
                break;
            }
        }
    };

    var getDataSuccess = function (data) {
        var htmlRendered = $('#view').html(data).find('*');

        pageThread(htmlRendered);
    };

    return {
        getData: function () {
            $.ajax({
                url: 'data.html',
                type: 'POST',
                success: getDataSuccess
            });
        },

        init: function() {
            app.getData();
        }

    };

})(jQuery);

/**
 * Document ready
 * */
document.addEventListener("DOMContentLoaded", app.init);

/**
 * Window scroll
 * */
window.onscroll = function () {

};

/**
 * Window resize
 * */
window.onresize = function () {

};