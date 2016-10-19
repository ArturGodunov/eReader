var app = (function ($) {
    "use strict";

    var onchangePagesIndex = function () {

    };

    var slider = function (widthAll) {
        var $view = $('#view'),
            indexOfPage = 1,
            countOfPages = widthAll / 320,
            $countPages = $('#countPages');

        $countPages.text(indexOfPage + '/' + countOfPages);

        $('#prevPage').on('click', function () {
            if (indexOfPage > 1) {
                $view.css({left: '+=320'});
                indexOfPage--;
                $countPages.text(indexOfPage + '/' + countOfPages);
            }
        });

        $('#nextPage').on('click', function () {
            if (indexOfPage < countOfPages) {
                $view.css({left: '-=320'});
                indexOfPage++;
                $countPages.text(indexOfPage + '/' + countOfPages);
            }
        });


        // onchangePagesIndex();
    };

    var refreshWidthContainers = function () {
        var widthAll = 0;

        $('#view').find('.body').each(function () {
            var lastChild = $(this).children().last();
            var newWidth = lastChild.position().left - $(this).position().left + lastChild.outerWidth(true);
            $(this).width(newWidth);

            widthAll += newWidth;
        });

        slider(widthAll);
    };

    var getDataSuccess = function (data) {
        $('#view').html(data).find('*');

        refreshWidthContainers();
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