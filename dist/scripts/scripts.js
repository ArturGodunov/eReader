var app = (function ($) {
    "use strict";

    /** Auxiliary bodies elements */
    var auxiliaryBodies;

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

        document.body.removeChild(loader);
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

        /** Pages */
        var pages = document.createElement('ul');
        pages.id = 'pages';
        pages.className = 'pages';

        document.body.appendChild(pages);

        /** Loader */
        var loader = document.createElement('p');
        loader.id = 'loader';
        loader.className = 'loader';

        document.body.appendChild(loader);
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