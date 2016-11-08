var app = (function ($) {
    "use strict";

    /**
     * Start or end animation of pages
     * */
    var auxiliaryBodies;
    var statusAnimation = 'end';

    /**
     * Custom method forEach
     * */
    var forEachNodeList = function (arr, callback, scope) {
        var arrLength = arr.length;
        var i;

        for (i=0; i<arrLength; i++) {
            callback.call(scope, arr[i]);
        }
    };

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
    var animatePages = function (indexOfPage, pages, countOfPages, countOfPagesIndicator, nextDisappearance, prevAppearance) {
        countOfPagesIndicator.innerHTML = indexOfPage + '/' + countOfPages;

        statusAnimation = 'start';

        forEachNodeList(pages, function (item) {
            if (item.classList.contains('active')) {
                item.classList.add(nextDisappearance);
                pages[countOfPages - indexOfPage].classList.add(prevAppearance);
            }
        });

        var pageNextDisappearance;
        forEachNodeList(pages, function (item) {
            if (item.classList.contains(nextDisappearance)) {
                pageNextDisappearance = item;
                pageNextDisappearance.addEventListener('animationend', pageNextDisappearanceAnimationEnd);
            }
        });
        function pageNextDisappearanceAnimationEnd() {
            pageNextDisappearance.classList.remove('active', nextDisappearance);
            pages[countOfPages - indexOfPage].classList.add('active');
            pages[countOfPages - indexOfPage].classList.remove(prevAppearance);

            statusAnimation = 'end';

            forEachNodeList(pages, function (item) {
                item.removeEventListener('animationend', pageNextDisappearanceAnimationEnd);
            });
        }
    };

    /**
     * Build slider
     * */
    var slider = function () {
        var indexOfPage = 1;
        var pages = document.querySelectorAll('.page');
        var countOfPages = pages.length;
        var countOfPagesIndicator = document.getElementById('countPages');

        countOfPagesIndicator.innerHTML = indexOfPage + '/' + countOfPages;

        document.getElementById('prevPage').addEventListener('click', function () {
            if (indexOfPage > 1 && statusAnimation !== 'start') {
                indexOfPage--;

                animatePages(indexOfPage, pages, countOfPages, countOfPagesIndicator, 'disappearance', 'prev');
            }
        });

        document.getElementById('nextPage').addEventListener('click', function () {
            if (indexOfPage < countOfPages && statusAnimation !== 'start') {
                indexOfPage++;

                animatePages(indexOfPage, pages, countOfPages, countOfPagesIndicator, 'next', 'appearance');
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

        forEachNodeList(auxiliaryBodies, function (item) {
            var itemChildren = item.children;

            forEachNodeList(itemChildren, function (subitem) {
                allElements.push(subitem);
            });
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
        forEachNodeList(auxiliaryBodies, function (item) {
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
        forEachNodeList(auxiliaryBodies, function (item) {
            var items = item.querySelectorAll('*');

            forEachNodeList(items, function (subitem) {
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
     * Build start html
     * */
    var buildStartHtml = function () {
        /** Section auxiliary */
        var sectionAuxiliary = document.createElement('section');
        sectionAuxiliary.id = 'auxiliary';
        sectionAuxiliary.className = 'auxiliary';
        sectionAuxiliary.innerHTML =
            '<div class="auxiliary-wrap"><div id="auxiliary-view" class="auxiliary-view"></div></div>';

        document.body.appendChild(sectionAuxiliary);

        /** Section book */
        var sectionBook = document.createElement('section');
        sectionBook.id = 'book';
        sectionBook.className = 'book';
        sectionBook.innerHTML =
            '<ul id="pages" class="pages"></ul>' +
            '<button type="button" id="prevPage" class="controls controls__prev"><</button>' +
            '<button type="button" id="nextPage" class="controls controls__next">></button>' +
            '<p id="countPages" class="count-pages"></p>' +
            '<p id="loader" class="loader"></p>';

        document.body.appendChild(sectionBook);
    };

    /**
     * Get data if success
     * */
    var getDataSuccess = function (data) {
        document.getElementById('auxiliary-view').innerHTML = data;
        auxiliaryBodies = document.getElementById('auxiliary-view').querySelectorAll('.body');

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

        xhr.open('GET', 'data.html', true);
        xhr.send();

        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                alert(xhr.status + ':' + xhr.statusText);
            } else {
                getDataSuccess(xhr.responseText);
            }
        };
    };

    return {
        /**
         * Initialization
         * */
        init: function() {
            buildStartHtml();
            getData();
        }

    };

})(jQuery);

/**
 * Document ready
 * */
document.addEventListener("DOMContentLoaded", app.init);