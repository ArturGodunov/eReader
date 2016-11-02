var app = (function ($) {
    "use strict";

    /**
     * Build slider
     * */
    var slider = function () {
        var indexOfPage = 1;
        var $page = $('.page');
        var countOfPages = $page.length;
        var $countPages = $('#countPages');

        $countPages.text(indexOfPage + '/' + countOfPages);

        $('#prevPage').on('click', function () {
            if (indexOfPage > 1) {
                indexOfPage--;
                $countPages.text(indexOfPage + '/' + countOfPages);

                $page.off('animationstart animationend');

                $page.filter('.active').addClass('disappearance');

                $page.filter('.disappearance').on('animationstart', function () {
                    $page.eq(countOfPages - indexOfPage).addClass('prev');
                });

                $page.filter('.disappearance').on('animationend', function () {
                    $page.eq(countOfPages - indexOfPage).addClass('active').removeClass('prev');
                    $(this).removeClass('active disappearance');
                });
            }
        });

        $('#nextPage').on('click', function () {
            if (indexOfPage < countOfPages) {
                indexOfPage++;
                $countPages.text(indexOfPage + '/' + countOfPages);

                $page.off('animationstart animationend');

                $page.filter('.active').addClass('next');

                $page.filter('.next').on('animationstart', function () {
                    $page.eq(countOfPages - indexOfPage).addClass('appearance');
                });

                $page.filter('.next').on('animationend', function () {
                    $page.eq(countOfPages - indexOfPage).addClass('active').removeClass('appearance');
                    $(this).removeClass('active next');
                });
            }
        });
    };

    /**
     * Inserting page into list of pages
     * */
    var insertPage = function (page) {
        $('#pages').prepend('<li class="page"/>');
        page.clone().appendTo('.page:first-child');
    };

    /**
     * Build list of pages
     * */
    var buildList = function () {
        var allElements = $('#view').find('.body').children();
        var left = 0;
        var lastIndex = 0;

        allElements.each(function (index) {
            var offsetLeft = $(this).offset().left;
            var page;

            if (offsetLeft !== left) {
                page = allElements.slice(lastIndex, index);

                left = offsetLeft;
                lastIndex = index;

                insertPage(page);
            }

            if (index === allElements.length - 1) {
                page = allElements.slice(lastIndex);

                insertPage(page);
            }
        });

        $('.page:last-child').addClass('active');

        slider();
    };

    /**
     * Fixed refreshing containers' width
     * @see http://stackoverflow.com/questions/23408539/how-can-i-make-a-displayflex-container-expand-horizontally-with-its-wrapped-con/26231447#26231447
     * */
    var refreshWidthContainers = function () {
        $('#view').find('.body').each(function () {
            var lastChild = $(this).children().last();
            var newWidth = lastChild.position().left - $(this).position().left + lastChild.outerWidth(true);
            $(this).width(newWidth);
        });

        buildList();
    };

    /**
     * Change styles from ePub
     * */
    var adaptationStyles = function () {
        $('#view').find('*').each(function () {
            $(this).css({
                'margin': $(this).css('margin'),
                'padding': $(this).css('padding')
            });
        });
    };

    /**
     * Get data if success
     * */
    var getDataSuccess = function (data) {
        $('#view').html(data).find('*');

        adaptationStyles();
        refreshWidthContainers();
    };

    /**
     * Request of data
     * */
    var getData = function () {
        $.ajax({
            url: 'data.html',
            type: 'POST',
            success: getDataSuccess
        });
    };

    return {
        /**
         * Initialization
         * */
        init: function() {
            getData();
        }

    };

})(jQuery);

/**
 * Document ready
 * */
document.addEventListener("DOMContentLoaded", app.init);