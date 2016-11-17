var app = (function ($) {
    "use strict";

    /** Auxiliary bodies elements */
    var auxiliaryBodies;

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
            pageBodyToString += item.element.outerHTML;
        });
        page.innerHTML = pageBodyToString;

        pages.insertBefore(page, pages.children[0]);
    };

    /**
     * Build list of pages
     * */
    var buildList = function () {
        var allElements = [];

        Array.prototype.forEach.call(auxiliaryBodies, function (item, index) {
            var itemChildren = item.children;

            Array.prototype.forEach.call(itemChildren, function (subitem) {
                var subitemWithBodyIndex = {
                    element: subitem,
                    bodyIndex: index
                };

                allElements.push(subitemWithBodyIndex);
            });
        });

        var allElementsLength = allElements.length;
        var left = 0;
        var lastIndex = 0;
        var lastBodyIndex = 0;

        allElements.forEach(function (item, index) {
            var offsetLeft = item.element.offsetLeft;
            var page;

            if (offsetLeft !== left || lastBodyIndex !== item.bodyIndex) {
                page = allElements.slice(lastIndex, index);

                left = offsetLeft;
                lastIndex = index;
                lastBodyIndex = item.bodyIndex;

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
        document.getElementById('auxiliary').innerHTML = data;
        auxiliaryBodies = document.getElementById('auxiliary').querySelectorAll('.body');

        /**
         * Order of execution is important here
         * */
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