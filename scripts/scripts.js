var app = (function ($) {
    "use strict";

    /** Private properties */

    /** Private methods */
    var showSection;

    /**
     * Show after scroll
     * */
    showSection = function () {

    };

    return {
        /**
         * Toggle mobile menu
         * */
        mobileMenu: function () {

        },

        init: function() {
            app.mobileMenu();
        }

    };

})(jQuery);

/**
 * Document ready
 * */
document.addEventListener("DOMContentLoaded", app.init);

/**
 * Window scroll
 * */
window.onscroll = function () {

};

/**
 * Window resize
 * */
window.onresize = function () {

};