var app = (function ($) {
    "use strict";

    /**
     * Delete loader
     * */
    var deleteLoader = function () {
        $('#loader').remove();
    };

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

                $page.removeClass('will-change');
                $page.eq(countOfPages - indexOfPage - 1).addClass('will-change');

                $page.off('animationstart animationend');

                $page.filter('.active').addClass('disappearance');

                $page.filter('.disappearance').on('animationstart', function () {
                    $page.eq(countOfPages - indexOfPage).addClass('prev');
                });

                $page.filter('.disappearance').on('animationend', function () {
                    $page.eq(countOfPages - indexOfPage).addClass('active will-change').removeClass('prev');
                    $(this).removeClass('active disappearance');
                });
            }
        });

        $('#nextPage').on('click', function () {
            if (indexOfPage < countOfPages) {
                indexOfPage++;
                $countPages.text(indexOfPage + '/' + countOfPages);

                $page.removeClass('will-change');
                $page.eq(countOfPages - indexOfPage - 1).addClass('will-change');

                $page.off('animationstart animationend');

                $page.filter('.active').addClass('next');

                $page.filter('.next').on('animationstart', function () {
                    $page.eq(countOfPages - indexOfPage).addClass('appearance');
                });

                $page.filter('.next').on('animationend', function () {
                    $page.eq(countOfPages - indexOfPage).addClass('active will-change').removeClass('appearance');
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
        var allElementsLength = allElements.length;
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

            if (index === allElementsLength - 1) {
                page = allElements.slice(lastIndex);

                insertPage(page);
            }
        });

        deleteLoader();

        var $page = $('.page');

        $page
            .last().addClass('active will-change')
            .prev().addClass('will-change');
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
    };

    /**
     * Change styles from ePub
     * */
    var adaptationStyles = function () {
        $('#view').find('*').each(function () {
            var margin = $(this).css('margin');
            var padding = $(this).css('padding');

            if (margin !== '0px') {
                $(this).css('margin', margin);
            }
            if (padding !== '0px') {
                $(this).css('padding', padding);
            }
        });
    };

    var deleteSupportingSection = function () {
        $('.view-container').remove();
    };

    /**
     * Get data if success
     * */
    var getDataSuccess = function (data) {
        $('#view').html(data).find('*');

        /**
         * Order of execution is important here
         * */
        adaptationStyles();
        refreshWidthContainers();
        buildList();
        deleteSupportingSection();
        slider();
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