var app = (function () {
    "use strict";

    /** Constants */
    var DATA_ATTR_CHAPTER_ID = 'data-chapter-id',
        DATA_ATTR_START_PAGE = 'data-start-page',
        DATA_ATTR_SECTION_ID = 'data-section-id';

    /**
     * Create config
     * */
    var createConfig = function () {
        var documentWidth = document.documentElement.clientWidth,
            $lastElements = document.body.querySelectorAll('*:last-child'),
            $lastElement = $lastElements[$lastElements.length - 1],
            contentWidth = $lastElement.offsetLeft + $lastElement.offsetWidth;

        var config = {
            id: +document.querySelector('[' + DATA_ATTR_CHAPTER_ID + ']').getAttribute(DATA_ATTR_CHAPTER_ID),
            startPage: +document.querySelector('[' + DATA_ATTR_START_PAGE + ']').getAttribute(DATA_ATTR_START_PAGE),
            totalPages: contentWidth / documentWidth,
            chapterInnerText: document.body.innerText,
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
                pageNumber: item.offsetLeft / documentWidth + 1
            };

            config.tags.push(tag);
        });

        var configToJson = JSON.stringify(config);

        sendConfig(configToJson);
    };

    /**
     * Send config
     * */
    var sendConfig = function (config) {
        console.dir(config);
    };

    return {
        /**
         * Initialization
         * */
        init: function() {
            createConfig();
        }
    };
})();

/**
 * Document load
 * */
window.onload = app.init;