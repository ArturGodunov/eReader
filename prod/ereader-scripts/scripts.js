var app = (function () {
    "use strict";

    /** Constants */
    var CLASS_NAME_ACTIVE_ELEMENT_PAGE = 'active',
        CLASS_NAME_ELEMENT_AUXILIARY = 'auxiliary',
        CLASS_NAME_ELEMENT_BODY = 'chapter-body',
        CLASS_NAME_ELEMENT_LOADER = 'loader',
        CLASS_NAME_ELEMENT_PAGE = 'page',
        CLASS_NAME_ELEMENT_PAGES = 'pages',
        ID_ELEMENT_AUXILIARY = 'auxiliary',
        ID_ELEMENT_LOADER = 'loader',
        ID_ELEMENT_PAGES = 'pages',
        URL_HTML_DATA = '../Content/Test-html.html';

    /** Auxiliary bodies elements */
    var $auxiliaryBodies;

    /**
     * Remove loader
     * */
    var removeLoader = function () {
        var $loader = document.getElementById(ID_ELEMENT_LOADER);

        document.body.removeChild($loader);
    };

    /**
     * Inserting page into list of pages
     * */
    var insertPage = function (pageBody) {
        var $pages = document.getElementById(ID_ELEMENT_PAGES),
            page = document.createElement('section');

        page.className = CLASS_NAME_ELEMENT_PAGE;

        var pageBodyToString = '';

        pageBody.forEach(function (item) {
            pageBodyToString += item.element.outerHTML;
        });
        page.innerHTML = pageBodyToString;

        $pages.insertBefore(page, $pages.children[0]);
    };

    /**
     * Build list of pages
     * */
    var buildList = function () {
        var allElements = [];

        Array.prototype.forEach.call($auxiliaryBodies, function (item, index) {
            var $itemChildren = item.children;

            Array.prototype.forEach.call($itemChildren, function (subitem) {
                allElements.push({
                    element: subitem,
                    bodyIndex: index
                });
            });
        });

        var allElementsLength = allElements.length,
            left = 0,
            lastIndex = 0,
            lastBodyIndex = 0;

        allElements.forEach(function (item, index) {
            var offsetLeft = item.element.offsetLeft,
                page;

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

        document.getElementById(ID_ELEMENT_PAGES).lastChild.classList.add(CLASS_NAME_ACTIVE_ELEMENT_PAGE);
    };

    /**
     * Removing supporting section which is no longer needed
     * */
    var removeSupportingSection = function () {
        var $auxiliary = document.getElementById(ID_ELEMENT_AUXILIARY);

        document.body.removeChild($auxiliary);
    };

    /**
     * Build start html
     * */
    var buildStartHtml = function () {
        /** Section auxiliary */
        var sectionAuxiliary = document.createElement('section');
        sectionAuxiliary.id = ID_ELEMENT_AUXILIARY;
        sectionAuxiliary.className = CLASS_NAME_ELEMENT_AUXILIARY;

        document.body.appendChild(sectionAuxiliary);

        /** Pages */
        var pages = document.createElement('article');
        pages.id = ID_ELEMENT_PAGES;
        pages.className = CLASS_NAME_ELEMENT_PAGES;

        document.body.appendChild(pages);

        /** Loader */
        var loader = document.createElement('section');
        loader.id = ID_ELEMENT_LOADER;
        loader.className = CLASS_NAME_ELEMENT_LOADER;

        document.body.appendChild(loader);
    };

    /**
     * Get data if success
     * */
    var getDataSuccess = function (data) {
        document.getElementById(ID_ELEMENT_AUXILIARY).innerHTML = data;
        $auxiliaryBodies = document.getElementById(ID_ELEMENT_AUXILIARY).querySelectorAll('.' + CLASS_NAME_ELEMENT_BODY);

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

        xhr.open('GET', URL_HTML_DATA, true);
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
})();

/**
 * Document ready
 * */
document.addEventListener("DOMContentLoaded", app.init);