var app = (function ($) {
    "use strict";

    /**
     * Start or end animation of pages
     * */
    var statusAnimation = 'end';

    /**
     * Remove loader
     * */
    var removeLoader = function () {
        var loader = document.getElementById('loader');

        document.getElementById('book').removeChild(loader);
    };

    /**
     * Add/remove css classes for animation and
     * add handlers for start/end of animations
     * */
    var animatePages = function (indexOfPage, $page, countOfPages, $countPages, nextDisappearance, prevAppearance) {
        $countPages.text(indexOfPage + '/' + countOfPages);

        $page.off('animationstart animationend');

        statusAnimation = 'start';

        $page.filter('.active').addClass(nextDisappearance);
        $page.eq(countOfPages - indexOfPage).addClass(prevAppearance);

        $page.filter('.' + nextDisappearance).on('animationend', function () {
            $page.eq(countOfPages - indexOfPage).addClass('active').removeClass(prevAppearance);
            $(this).removeClass('active ' + nextDisappearance);

            statusAnimation = 'end';
        });
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
            if (indexOfPage > 1 && statusAnimation !== 'start') {
                indexOfPage--;

                animatePages(indexOfPage, $page, countOfPages, $countPages, 'disappearance', 'prev');
            }
        });

        $('#nextPage').on('click', function () {
            if (indexOfPage < countOfPages && statusAnimation !== 'start') {
                indexOfPage++;

                animatePages(indexOfPage, $page, countOfPages, $countPages, 'next', 'appearance');
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
        var allElements = $('#auxiliary-view').find('.body').children();
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

        removeLoader();

        var $page = $('.page');

        $page.last().addClass('active');
    };

    /**
     * Fixed refreshing containers' width
     * @see http://stackoverflow.com/questions/23408539/how-can-i-make-a-displayflex-container-expand-horizontally-with-its-wrapped-con/26231447#26231447
     * */
    var refreshWidthContainers = function () {
        $('#auxiliary-view').find('.body').each(function () {
            var lastChild = $(this).children().last();
            var newWidth = lastChild.position().left - $(this).position().left + lastChild.outerWidth(true);
            $(this).width(newWidth);
        });
    };

    /**
     * Change styles from ePub
     * Be careful, method cssText replace all styles
     * */
    var adaptationStyles = function () {
        document
            .getElementById('auxiliary-view')
            .querySelectorAll('.body')
            .forEach(function (item) {
                item.querySelectorAll('*').forEach(function (subitem) {
                    var margin = getComputedStyle(subitem).margin;
                    var padding = getComputedStyle(subitem).padding;

                    if (margin !== '0px') {
                        subitem.style.cssText = 'margin: ' + margin + ';';
                    }
                    if (padding !== '0px') {
                        subitem.style.cssText = 'padding: ' + padding + ';';
                    }
                });
            });
    };

    /**
     * Removing supporting section which is no longer needed
     * */
    var removeSupportingSection = function () {
        var auxiliary = document.getElementById('auxiliary');

        document.body.removeChild(auxiliary);
    };

    /**
     * Get data if success
     * */
    var getDataSuccess = function (data) {
        $('#auxiliary-view').html(data).find('*');

        /**
         * Order of execution is important here
         * */
        adaptationStyles();
        refreshWidthContainers();
        buildList();
        removeSupportingSection();
        slider();
    };

    /**
     * Request of data
     * */
    var getData = function () {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', 'data.html', true);
        xhr.send();

        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                alert(xhr.status + ':' + xhr.statusText);
            } else {
                try {
                    getDataSuccess(xhr.responseText);
                } catch (e) {
                    alert('Incorrect answer:' + e.message);
                }
            }
        }
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