/*
* debouncedresize: special jQuery event that happens once after a window resize
*/
* latest version and complete README available on Github:
* https://github.com/louisremi/jquery-smartresize/blob/master/jquery.debouncedresize.js
*
* Copyright 2011 @louis_remi
* Licensed under the MIT license.
*/

var $event = $.event,
    $special,
    resizeTimeout;

$special = $event.special.debouncedresize = {
    // Handles setup of the debounced resize event
    setup: function () {
        $(this).on("resize", $special.handler);
    },
    // Teardown logic for the resize event
    teardown: function () {
        $(this).off("resize", $special.handler);
    },
    // Main handler logic to debounce resize events
    handler: function (event, execAsap) {
        var context = this,
        args = arguments,
        dispatch = function () {
            event.type = "debouncedresize";
            $event.dispatch.apply(context, args);
        };

        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }

        execAsap ? dispatch() : (resizeTimeout = setTimeout(dispatch, $special.threshold));
    },
    threshold: 250 // Time in milliseconds before firing the debounced event
};

// ======================= imagesLoaded Plugin ===============================
// Plugin for ensuring all images in the grid are fully loaded
$.fn.imagesLoaded = function (callback) {
    // Core logic for handling image load and error events
    // Ensures callbacks for broken or successfully loaded images
};

// ======================= Grid Module ===============================
// Main module for managing the grid and expander functionality
var Grid = (function () {
    // Global variables and default settings
    var $selector = '#og-grid', // Selector for the grid container
    $grid = $($selector), // jQuery object for the grid
    $items = $grid.children('li'), // Grid items
    current = -1, // Tracks the currently expanded item
    previewPos = -1, // Position of the currently expanded preview
    scrollExtra = 0, // Additional scroll offset
    marginExpanded = 10, // Margin for expanded previews
    $window = $(window), // Window object
    $body = $('html, body'), // Body element for scrolling
    transEndEventNames = {
        // Transition end event names for various browsers
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
    },
    transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
    support = Modernizr.csstransitions, // CSS transitions support
    settings = {
        minHeight: 500,
        speed: 350,
        easing: 'ease',
        showVisitButton: true
    };

    // ======================= Initialization ===============================
    function init(config) {
        settings = $.extend(true, {}, settings, config);
        $grid.imagesLoaded(function () {
            // Preloading and saving initial grid item data
            saveItemInfo(true);
            getWinSize();
            initEvents(); // Initialize event handlers
        });
    }

    // ======================= Adding Items to the Grid ===============================
    function addItems($newitems) {
        $items = $items.add($newitems);
        $newitems.each(function () {
            var $item = $(this);
            $item.data({
                offsetTop: $item.offset().top,
                height: $item.height()
            });
        });
        initItemsEvents($newitems); // Bind events to new items
    }

    // ======================= Utility Functions ===============================
    // Saves the height and offset of grid items
    function saveItemInfo(saveheight) {
        $items.each(function () {
            var $item = $(this);
            $item.data('offsetTop', $item.offset().top);
            if (saveheight) {
                $item.data('height', $item.height());
            }
        });
    }

    // Calculates the current window size
    function getWinSize() {
        winsize = {
            width: $window.width(),
            height: $window.height()
        };
    }

    // ======================= Event Initialization ===============================
    function initEvents() {
        initItemsEvents($items); // Events for grid items

        // Window resize event handling
        $window.on('debouncedresize', function () {
            scrollExtra = 0;
            previewPos = -1;
            saveItemInfo();
            getWinSize();
            var preview = $.data(this, 'preview');
            if (typeof preview !== 'undefined') {
                hidePreview(); // Hide the preview on resize
            }
        });
    }

    // ======================= Item Event Handling ===============================
    function initItemsEvents($items) {
        // Close preview when clicking the close button
        $items.on('click', 'span.og-close', function () {
            hidePreview();
            return false;
        })
        // Trigger the expander when clicking an item link
        .children('a').on('click', function (e) {
            e.preventDefault(); // Prevent navigation
            var $item = $(this).parent();
            current === $item.index() ? hidePreview() : showPreview($item);
            return false;
        });
    }

    // ======================= Preview Handling ===============================
    // Show the expander for the clicked item
    function showPreview($item) {
        var preview,
        $itemEl = $item.children('a'),
        eldata = $itemEl.data();

        previewPos = $item.index();

        // If a preview exists and previewPos is different (different item clicked) then close
        if (typeof preview !== 'undefined') {
            // ... (Your existing code) ...
        }

        // Update preview if it exists, or create a new one
        (typeof preview === 'undefined') ? (preview = new Preview($item, function () {
                showPreview($item);
            })) : (preview.update($item));

        // Initialize new preview object
        preview = new Preview($item, function () {
            // ... (Your existing code) ...

            // Instead of creating a new preview structure, use the existing one
            var $itemEl = $item.children('a'),
            eldata = $itemEl.data();

            // Get the content from the og-expander-inner div
            var $expanderContent = $item.find('.og-expander-inner').html();

            preview.$previewEl = $('<div class="og-expander"><div class="og-expander-inner">' + $expanderContent + '</div></div>')
                .appendTo($item);

            // ... (Your existing code) ...
        });
    }

    // Hide the currently expanded preview
    function hidePreview() {
        // ... (Your existing code) ...
    }

    // ======================= Preview Object ===============================
    // Object for managing the expanded preview
    function Preview($item, callback) {
        // ... (Your existing code) ...
    }

    Preview.prototype = {
        create: function () { /* Creates the preview structure */
        },
        update: function ($item) { /* Updates the preview content */
        },
        open: function () { /* Expands the preview */
        },
        close: function () { /* Collapses the preview */
        },
        calcHeight: function () { /* Calculates the height of the preview */
        },
        setHeights: function () { /* Sets the height for the preview and item */
        },
        positionPreview: function () { /* Positions the preview */
        },
        setTransition: function () { /* Adds CSS transitions */
        },
        getEl: function () {
            return this.$previewEl;
        }
    };

    // Expose public methods
    return {
        init: init,
        addItems: addItems
    };
})();
