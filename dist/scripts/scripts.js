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
    var insertPage = function (pageBody) {
        var pages = document.getElementById('pages');
        var page = document.createElement('li');

        page.className = 'page';

        var pageBodyToString = '';

        pageBody.forEach(function (item) {
            pageBodyToString += item.outerHTML;
        });
        page.innerHTML = pageBodyToString;

        pages.insertBefore(page, pages.children[0]);
    };

    /**
     * Build list of pages
     * */
    var buildList = function () {
        var allElements = [];

        document
            .getElementById('auxiliary-view')
            .querySelectorAll('.body')
            .forEach(function (item) {
                var itemChildren = item.children;
                var itemChildrenLength = itemChildren.length;
                var i;

                for(i=0; i<itemChildrenLength; i++) {
                    allElements.push(itemChildren[i]);
                }
            });

        var allElementsLength = allElements.length;
        var left = 0;
        var lastIndex = 0;

        allElements.forEach(function (item, index) {
            var offsetLeft = item.offsetLeft;
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

        document.getElementById('pages').lastChild.classList.add('active');
    };

    /**
     * Fixed refreshing containers' width
     * @see http://stackoverflow.com/questions/23408539/how-can-i-make-a-displayflex-container-expand-horizontally-with-its-wrapped-con/26231447#26231447
     * */
    var refreshWidthContainers = function () {
        document
            .getElementById('auxiliary-view')
            .querySelectorAll('.body')
            .forEach(function (item) {
                var lastChild = item.lastChild;
                var newWidth = lastChild.offsetLeft - item.offsetLeft +
                    lastChild.offsetWidth +
                    parseFloat(getComputedStyle(lastChild).marginLeft) +
                    parseFloat(getComputedStyle(lastChild).marginRight);
                item.style.cssText = 'width: ' + newWidth + 'px;';
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
        document.getElementById('auxiliary-view').innerHTML = data;

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
                getDataSuccess(xhr.responseText);
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