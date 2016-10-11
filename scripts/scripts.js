var app = (function ($) {
    "use strict";

    var resourceHtml = $('#resource').html(),
        htmlView = $('#view').html(resourceHtml).find('*'),
        pages = [];

    var savePage = function (html) {
        var htmlLength = html.length,
            currentElementOffsetTop, currentElementHeight;

        for (var i=0; i<htmlLength; i++) {
            currentElementOffsetTop = html.eq(i).offset().top;
            currentElementHeight = html.eq(i).height();

            if (currentElementOffsetTop + currentElementHeight > 480) {
                pages.push(html.slice(0, i));
                htmlView = $('#view').html(html.slice(i)).find('*');

                app.pageThread();
                break;
            }

            if (i === htmlLength - 1) {
                pages.push(html);
                break;
            }
        }
    };

    return {
        pageThread: function () {
            savePage(htmlView);
            console.log(pages);
        },

        pagesShow: function () {
            pages.forEach(function (item) {
                $('body').append('<section class="view">');
                $('.view:last-child').html(item);
            });
        },

        init: function() {
            app.pageThread();
            app.pagesShow();
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