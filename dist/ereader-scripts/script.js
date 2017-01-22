/**
 * For mobile developers
 *
 * You need methods 'sendConfig' and 'app.getSearchResultPosition'
 * */
var app = (function () {
    "use strict";

    /** Constants */
    var CLASS_NAME_SEARCH_RESULT = 'search-result',
        CLASS_NAME_LOADER = 'loader',
        DATA_ATTR_CHAPTER_ID = 'data-chapter-id',
        DATA_ATTR_START_PAGE = 'data-start-page',
        DATA_ATTR_SECTION_ID = 'data-section-id',
        DATA_ATTR_LINK_ID = 'data-link-id',
        ID_SEARCH_RESULT = 'search-result',
        REPLACE_NAME_PAGE_CONTENT = '%pageContent%';

    var documentWidth = document.documentElement.clientWidth;

    /**
     * Create config
     * */
    var createConfig = function () {
        var bodyScrollWidth = document.body.scrollWidth,
            totalPages = bodyScrollWidth / documentWidth,
            headerDocument = '<!DOCTYPE html><html>' + document.head.outerHTML + '<body>' + REPLACE_NAME_PAGE_CONTENT + '</body></html>',
            headerDocumentWithoutScript = headerDocument.replace(/<script.*<\/script>/,'');

        var config = {
            id: +document.querySelector('[' + DATA_ATTR_CHAPTER_ID + ']').getAttribute(DATA_ATTR_CHAPTER_ID),
            startPage: +document.querySelector('[' + DATA_ATTR_START_PAGE + ']').getAttribute(DATA_ATTR_START_PAGE),
            totalPages: totalPages,
            chapterInnerText: document.body.innerText.replace(/[\n\r]/g, ' '),
            chapterOuterHTML: headerDocumentWithoutScript.replace(REPLACE_NAME_PAGE_CONTENT, document.body.innerHTML),
            sections: [],
            tags: [],
            links: []
        };

        var sections = document.querySelectorAll('[' + DATA_ATTR_SECTION_ID + ']');
        Array.prototype.forEach.call(sections, function (item) {
            var pageIndex = item.offsetLeft / documentWidth + 1;

            var section = {
                id: +item.getAttribute(DATA_ATTR_SECTION_ID),
                offsetTop: item.offsetTop,
                pageIndex: pageIndex,
                pageNumber: config.startPage + pageIndex
            };

            config.sections.push(section);
        });

        var tags = document.body.querySelectorAll('*');
        Array.prototype.forEach.call(tags, function (item, i) {
            var tag = {
                tagIndex: i + 1,
                pageNumber: Math.floor(item.offsetLeft / documentWidth + 1)
            };

            config.tags.push(tag);
        });

        var links = document.querySelectorAll('[' + DATA_ATTR_LINK_ID + ']');
        Array.prototype.forEach.call(links, function (item) {
             var link = {
                 link: item.getAttribute(DATA_ATTR_LINK_ID),
                 page: config.startPage + Math.floor(item.offsetLeft / documentWidth + 1)
             };

            config.links.push(link);
        });

        var configToJson = JSON.stringify(config);

        sendConfig(configToJson);
    };

    /**
     * Send config
     * */
    var sendConfig = function (config) {
        console.dir(JSON.parse(config));
    };

    /**
     * Remove loader
     * */
    var removeLoader = function () {
        var loader = document.querySelector('.' + CLASS_NAME_LOADER);

        loader.classList.remove(CLASS_NAME_LOADER);
    };

    return {
        /**
         * Get search result position
         * */
        getSearchResultPosition: function (searchString, resultOrder) {
            var resultIndex = resultOrder || 1,
                bodyChildNodes = document.body.childNodes,
                chapterNodes = [],
                string = searchString.toLowerCase();

            /**
             * Create new array with text nodes only
             * */
            Array.prototype.forEach.call(bodyChildNodes, function (item) {
                if (item.nodeType === 3 && /\S/.test(item.nodeValue)) {
                    chapterNodes.push(item);
                } else if (item.nodeType === 1) {
                    recurseChildNodes(item);
                }
            });
            function recurseChildNodes(node) {
                var nodeChildNodes = node.childNodes;
                Array.prototype.forEach.call(nodeChildNodes, function (item) {
                    if (item.nodeType === 3 && /\S/.test(item.nodeValue)) {
                        chapterNodes.push(item);
                    } else if (item.nodeType === 1) {
                        recurseChildNodes(item);
                    }
                });
            }

            /**
             * Iterate all text nodes
             * */
            var currentResultIndex = 0,
                chapterNodesLength = chapterNodes.length;

            for (var i=0; i<chapterNodesLength; i++) {
                var itemNodeValue = chapterNodes[i].nodeValue.toLowerCase(),
                    matches = itemNodeValue.match(new RegExp(string, 'g')),
                    matchesCount = matches ? matches.length : 0,
                    lastStartOffset = 0;

                currentResultIndex += matchesCount;

                /**
                 * Find caret offsets and wrapping search result into <span>
                 * */
                if (currentResultIndex >= resultIndex) {
                    var countIterations = matchesCount - (currentResultIndex - resultIndex);

                   for (var j=0; j<countIterations; j++) {
                       lastStartOffset = itemNodeValue.indexOf(string, lastStartOffset ? lastStartOffset + string.length : 0);
                   }

                    var range = document.createRange();

                    range.setStart(chapterNodes[i], lastStartOffset);
                    range.setEnd(chapterNodes[i], lastStartOffset + string.length);

                    var wrapSpan = document.createElement('span');
                    wrapSpan.id = CLASS_NAME_SEARCH_RESULT;
                    wrapSpan.className = ID_SEARCH_RESULT;

                    range.surroundContents(wrapSpan);

                    break;
                }
            }

            /**
             * Return page number with search result
             * */
            var resultSpan = document.getElementById(ID_SEARCH_RESULT),
                dataStartPage = +document.querySelector('[' + DATA_ATTR_START_PAGE + ']').getAttribute(DATA_ATTR_START_PAGE);

            return resultSpan ? Math.floor(resultSpan.offsetLeft / documentWidth + 1) + dataStartPage + '' : null;
        },

        /**
         * Initialization
         * */
        init: function() {
            removeLoader();
            createConfig();
            console.log(app.getSearchResultPosition('fifa', 1));
        }
    };
})();

/**
 * Document load
 * */
window.onload = app.init;