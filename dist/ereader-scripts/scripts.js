var app = (function () {
    "use strict";

    /** Constants */
    var CLASS_NAME_CLONE_ELEMENT = 'clone-element',
        CLASS_NAME_ELEMENT_AUXILIARY = 'auxiliary',
        CLASS_NAME_ELEMENT_PAGE = 'page',
        CLASS_NAME_ELEMENT_PAGES = 'pages',
        DATA_ATTR_CHAPTER = 'data-chapter',
        DATA_ATTR_CHAPTER_ORDER = 'data-chapter-order',
        DATA_ATTR_CHAPTER_TITLE = 'data-chapter-title',
        DATA_ATTR_LAST_PAGE_ORDER = 'data-last-page-order',
        DATA_ATTR_SECTION = 'data-section',
        DATA_ATTR_SECTION_TITLE = 'data-section-title',
        ID_ELEMENT_AUXILIARY = 'auxiliary',
        ID_ELEMENT_HTML_DATA = 'htmlData',
        ID_ELEMENT_PAGES = 'pages',
        REPLACE_NAME_PAGE_CONTENT = '%pageContent%';

    var $auxiliaryBodies,
        documentHeight = document.documentElement.clientHeight;

    /**
     * Inserting page into list of pages
     * */
    var insertPage = function (pageBody) {
        var $pages = document.getElementById(ID_ELEMENT_PAGES),
            page = document.createElement('section');

        page.className = CLASS_NAME_ELEMENT_PAGE;

        var pageBodyToString = '';

        pageBody.forEach(function (item) {
            pageBodyToString += item.outerHTML;
        });
        page.innerHTML = pageBodyToString;

        $pages.appendChild(page);
    };

    /**
     * Breaking elements for smaller
     * */
    var breakingElementsForSmaller = function (allElements, item) {
        var elementHeight = parseInt(getComputedStyle(item).height, 10);

        if (elementHeight > documentHeight) {
            var $itemChildren = item.children,
                $itemChildrenLength = $itemChildren.length,
                cloneItemElement = item.cloneNode(false),
                i;

            item.classList.add(CLASS_NAME_CLONE_ELEMENT);
            cloneItemElement.classList.add(CLASS_NAME_CLONE_ELEMENT);

            for (i=0; i<$itemChildrenLength; i++) {
                if ($itemChildren[i]) {
                    var offsetBottom = $itemChildren[i].offsetTop + parseInt(getComputedStyle($itemChildren[i]).height, 10);

                    if (offsetBottom > documentHeight) {
                        cloneItemElement.appendChild($itemChildren[i]);

                        i--;
                    }
                }
            }

            item.parentNode.insertBefore(cloneItemElement, item.nextSibling);

            return cloneItemElement;
        }
    };

    /**
     * Build list of pages
     * */
    var buildList = function () {
        var allElements = [],
            $auxiliaryBodyChildren = $auxiliaryBodies.children,
            $auxiliaryBodyChildrenLength = $auxiliaryBodyChildren.length,
            i;

        for (i=0; i<$auxiliaryBodyChildrenLength; i++) {
            allElements.push($auxiliaryBodyChildren[i]);

            $auxiliaryBodyChildrenLength += breakingElementsForSmaller(allElements, $auxiliaryBodyChildren[i]) ? 1 : 0;
        }

        var allElementsLength = allElements.length,
            left = 0,
            lastIndex = 0;

        allElements.forEach(function (item, index) {
            var offsetLeft = item.offsetLeft,
                page;

            if (offsetLeft !== left) {
                page = allElements.slice(lastIndex, index);

                insertPage(page);

                left = offsetLeft;
                lastIndex = index;
            }

            if (index === allElementsLength - 1) {
                page = allElements.slice(lastIndex);

                insertPage(page);
            }
        });
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
    };

    /**
     * Send config
     * */
    var sendConfig = function (config) {
        // console.log(config);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'test-config', true);
        xhr.send(config);
    };

    /**
     * Create config
     * */
    var createConfig =  function () {
        var $pages = document.querySelectorAll('.' + CLASS_NAME_ELEMENT_PAGE),
            lastPageIndex = +document.getElementById(ID_ELEMENT_HTML_DATA).getAttribute(DATA_ATTR_LAST_PAGE_ORDER),
            pageIndex = lastPageIndex,
            lastTagIndex = 0,
            startTagIndex = 0,
            sectionOrder = 1,
            headerDocument = '<!DOCTYPE html><html>' + document.head.outerHTML + '<body>' + REPLACE_NAME_PAGE_CONTENT + '</body></html>',
            headerDocumentWithoutScript = headerDocument.replace(/<script.+<\/script>/,''),
            $chapter = document.querySelector('[' + DATA_ATTR_CHAPTER + ']'),
            chapterOrder = +document.querySelector('[' + DATA_ATTR_CHAPTER_ORDER + ']').getAttribute(DATA_ATTR_CHAPTER_ORDER);

        var config = {
            pages: [],
            chapters: []
        };

        Array.prototype.forEach.call($pages, function (item) {
            var $pageElements = item.children,
                sections = [],
                pageInnerHTML = item.outerHTML,
                pageInnerText = item.innerText;

            Array.prototype.forEach.call($pageElements, function (subitem) {
                if (lastPageIndex !== pageIndex) {
                    startTagIndex = lastTagIndex;

                    lastPageIndex = pageIndex;
                }

                lastTagIndex++;

                if (subitem.hasAttribute(DATA_ATTR_SECTION)) {
                    var configSection = {
                        sectionOrder: sectionOrder,
                        title: subitem.getAttribute(DATA_ATTR_SECTION_TITLE),
                        offsetTop: subitem.offsetTop,
                        pageNumber: pageIndex
                    };

                    sections.push(configSection);

                    sectionOrder++;
                }
            });

            var configPages = {
                pageNumber: pageIndex + 1,
                tagIndex: startTagIndex,
                chapterOrder: chapterOrder,
                outerHTML: headerDocumentWithoutScript.replace(REPLACE_NAME_PAGE_CONTENT, pageInnerHTML),
                innerText: pageInnerText,
                sections: sections
            };

            config.pages.push(configPages);

            var configChapters = {
                title: $chapter.getAttribute(DATA_ATTR_CHAPTER_TITLE),
                pageNumber: pageIndex + 1,
                chapterOrder: +$chapter.getAttribute(DATA_ATTR_CHAPTER_ORDER),
                sections: sections
            };

            config.chapters.push(configChapters);

            pageIndex++;
        });

        var configToJson = JSON.stringify(config);

        sendConfig(configToJson);
    };

    /**
     * Start building
     * */
    var startBuilding = function (data) {
        document.getElementById(ID_ELEMENT_AUXILIARY).innerHTML = data;
        $auxiliaryBodies = document.getElementById(ID_ELEMENT_AUXILIARY).querySelector('[' + DATA_ATTR_CHAPTER + ']');

        /**
         * Order of execution is important here
         * */
        buildList();
        createConfig();
        removeSupportingSection();
    };

    /**
     * Get html data
     * */
    var getData = function () {
        var htmlData = document.getElementById(ID_ELEMENT_HTML_DATA).innerHTML;

        startBuilding(htmlData);
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