var app = (function ($) {
    "use strict";

    var onchangePagesIndex = function () {

    };

    var slider = function () {
        var $view = $('#view');

        $('#prevPage').on('click', function () {
            $view.css({left: '-=320'})
        });

        $('#nextPage').on('click', function () {
            $view.css({left: '+=320'})
        });


        // onchangePagesIndex();
    };

    var refreshWidthContainers = function () {
        $('#view').find('.body').each(function () {
            var lastChild = $(this).children().last();
            var newWidth = lastChild.position().left - $(this).position().left + lastChild.outerWidth(true);
            $(this).width(newWidth);
        });

        slider();
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