/**
 * For mobile developers
 *
 * You need methods 'sendConfig' and 'app.getSearchResultPosition'
 * */
var app = (function () {
    "use strict";

    /** Constants */
    var CLASS_NAME_SEARCH_RESULT = 'search-result',
        DATA_ATTR_CHAPTER_ID = 'data-chapter-id',
        DATA_ATTR_START_PAGE = 'data-start-page',
        DATA_ATTR_SECTION_ID = 'data-section-id',
        ID_SEARCH_RESULT = 'search-result',
        REPLACE_NAME_PAGE_CONTENT = '%pageContent%';

    var documentWidth = document.documentElement.clientWidth;

    /**
     * Create config
     * */
    var createConfig = function () {
        var $lastElements = document.body.querySelectorAll('*:last-child'),
            $lastElement = $lastElements[$lastElements.length - 1],
            lastElementOffsetLeft = $lastElement.offsetLeft,
            totalPages = lastElementOffsetLeft % documentWidth === 0 ?
                lastElementOffsetLeft / documentWidth + 1 :
                Math.ceil(lastElementOffsetLeft / documentWidth),
            headerDocument = '<!DOCTYPE html><html>' + document.head.outerHTML + '<body>' + REPLACE_NAME_PAGE_CONTENT + '</body></html>',
            headerDocumentWithoutScript = headerDocument.replace(/<script.+<\/script>/,'');

        var config = {
            id: +document.querySelector('[' + DATA_ATTR_CHAPTER_ID + ']').getAttribute(DATA_ATTR_CHAPTER_ID),
            startPage: +document.querySelector('[' + DATA_ATTR_START_PAGE + ']').getAttribute(DATA_ATTR_START_PAGE),
            totalPages: totalPages,
            chapterInnerText: document.body.innerText,
            chapterOuterHTML: headerDocumentWithoutScript.replace(REPLACE_NAME_PAGE_CONTENT, document.body.innerHTML),
            sections: [],
            tags: []
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
                pageNumber: Math.floor(item.offsetLeft / documentWidth + 1) /*Не забыть убрать округление*/
            };

            config.tags.push(tag);
        });

        var configToJson = JSON.stringify(config);

        sendConfig(configToJson);
        // sendConfig(config);
    };

    /**
     * Send config
     * */
    var sendConfig = function (config) {
        // console.dir(config);
    };

    return {
        /**
         * Get search result position
         * */
        getSearchResultPosition: function (searchString, resultOrder) {
            var resultIndex = resultOrder || 1,
                chapterElements = document.body.querySelectorAll('*'),
                chapterNodes = [],
                string = searchString.toLowerCase();


            /**
             * Create new array with text nodes only
             * */
            Array.prototype.forEach.call(chapterElements, function (item) {
                var itemChildNodes = item.childNodes,
                    itemChildNodesLength = itemChildNodes.length;

                if (itemChildNodesLength) {
                    for (var i=0; i<itemChildNodesLength; i++) {
                        if (itemChildNodes[i].nodeType === 3 && /\S/.test(itemChildNodes[i].nodeValue)) {
                            chapterNodes.push(itemChildNodes[i]);
                        }
                    }
                }
            });

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
                       lastStartOffset = itemNodeValue.indexOf(string, lastStartOffset ? lastStartOffset + string.length: 0);
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
                resultSpanOffsetLeft,
                searchResultPageNumber = null,
                dataStartPage = +document.querySelector('[' + DATA_ATTR_START_PAGE + ']').getAttribute(DATA_ATTR_START_PAGE);

            if (resultSpan) {
                resultSpanOffsetLeft = resultSpan.offsetLeft;

                searchResultPageNumber = resultSpanOffsetLeft % documentWidth === 0 ?
                    resultSpanOffsetLeft / documentWidth + 1 :
                    Math.ceil(resultSpanOffsetLeft / documentWidth);

                searchResultPageNumber += dataStartPage;
                searchResultPageNumber += '';
            }

            return searchResultPageNumber
        },

        /**
         * Initialization
         * */
        init: function() {
            createConfig();
            console.log(app.getSearchResultPosition('student-athlete', 1));
        }
    };
})();

/**
 * Document load
 * */
window.onload = app.init;