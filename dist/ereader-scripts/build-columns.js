var buildColumns = (function () {
    "use strict";

    /**
     * Build columns
     * */
    var buildColumns = function () {
        var bodyChildren = document.body.children,
            bodyWidth = 0;

        Array.prototype.forEach.call(bodyChildren, function (item) {
            if (item.nodeName !== 'SCRIPT') {
                var itemWidth = item.scrollWidth;

                item.style.width = item.scrollWidth + 'px';

                bodyWidth +=itemWidth;
            }
        });

        document.body.style.width = bodyWidth + 'px';
    };

    return {
        /**
         * Initialization
         * */
        init: function() {
            buildColumns();
        }
    };
})();

/**
 * Document load
 * */
window.onload = buildColumns.init;