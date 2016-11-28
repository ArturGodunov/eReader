var app = (function () {
    "use strict";

    /** Constants */
    var CLASS_NAME_ELEMENT_AUXILIARY = 'auxiliary',
        CLASS_NAME_ELEMENT_BODY = 'chapter-body',
        CLASS_NAME_ELEMENT_LOADER = 'loader',
        CLASS_NAME_ELEMENT_PAGE = 'page',
        CLASS_NAME_ELEMENT_PAGES = 'pages',
        ID_ELEMENT_AUXILIARY = 'auxiliary',
        ID_ELEMENT_HTML_DATA = 'htmlData',
        ID_ELEMENT_LOADER = 'loader',
        ID_ELEMENT_PAGES = 'pages';

    var $auxiliaryBodies,
        lastChapterIndexAttr = -1;

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
    var insertPage = function (pageBody, chapterIndex) {
        var $pages = document.getElementById(ID_ELEMENT_PAGES),
            page = document.createElement('section');

        page.className = CLASS_NAME_ELEMENT_PAGE;

        if (lastChapterIndexAttr !== chapterIndex) {
            page.setAttribute('data-chapter-index', chapterIndex);

            lastChapterIndexAttr = chapterIndex;
        }

        var pageBodyToString = '';

        pageBody.forEach(function (item) {
            pageBodyToString += item.element.outerHTML;
        });
        page.innerHTML = pageBodyToString;

        $pages.appendChild(page);
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
                    chapterIndex: index
                });
            });
        });

        var allElementsLength = allElements.length,
            left = 0,
            lastIndex = 0,
            lastChapterIndex = 0;

        allElements.forEach(function (item, index) {
            var offsetLeft = item.element.offsetLeft,
                page;

            if (offsetLeft !== left || lastChapterIndex !== item.chapterIndex) {
                page = allElements.slice(lastIndex, index);

                insertPage(page, allElements[index - 1].chapterIndex + 1);

                left = offsetLeft;
                lastIndex = index;
                lastChapterIndex = item.chapterIndex;
            }

            if (index === allElementsLength - 1) {
                page = allElements.slice(lastIndex);

                insertPage(page, item.chapterIndex + 1);
            }
        });

        removeLoader();
    };

    /**
     * Removing supporting section which is no longer needed
     * */
    var removeSupportingSection = function () {
        var $auxiliary = document.getElementById(ID_ELEMENT_AUXILIARY),
            $htmldata = document.getElementById(ID_ELEMENT_HTML_DATA);

        document.body.removeChild($auxiliary);
        document.body.removeChild($htmldata);
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
     * Create config
     * */
    var createConfig =  function () {
        var $pages = document.querySelectorAll('.page'),
            lastTagIndex = 0,
            lastPageIndex = 0,
            startTagIndex = 0,
            chapterIndex;

        var config = {
            pages: [],
            chapters: []
        };

        Array.prototype.forEach.call($pages, function (item, pageIndex) {
            var $pageElements = item.children,
                dataChapterIndex = +item.getAttribute('data-chapter-index'),
                chapterTitle = item.querySelector('h1');

            if (dataChapterIndex) {
                chapterIndex = dataChapterIndex;

                if (chapterTitle) {
                    chapterTitle = chapterTitle.textContent;
                } else {
                    while (!chapterTitle) {
                        pageIndex++;

                        chapterTitle = $pages[pageIndex].querySelector('h1').textContent;
                    }
                }

                var configChapters = {
                    title: chapterTitle,
                    page: pageIndex + 1,
                    orderNumber: chapterIndex
                };

                config.chapters.push(configChapters);
            }

            Array.prototype.forEach.call($pageElements, function () {
                if (lastPageIndex !== pageIndex) {
                    lastPageIndex = pageIndex;
                    startTagIndex = lastTagIndex;
                }

                lastTagIndex++;
            });

            var configPages = {
                pageNumber: pageIndex + 1,
                tagIndex: startTagIndex,
                chapterOrder: chapterIndex
            };

            config.pages.push(configPages);
        });

        var configToJson = JSON.stringify(config);
        console.log(configToJson);
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
        createConfig();
    };

    /**
     * Get html data
     * */
    var getData = function () {
        var htmlData = document.getElementById(ID_ELEMENT_HTML_DATA).innerHTML;

        getDataSuccess(htmlData);
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
 * Document load
 * */
window.onload = app.init;