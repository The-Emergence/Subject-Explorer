/*
* debouncedresize: special jQuery event that happens once after a window resize
*/
* latest version and complete README available on Github:
* https://github.com/louisremi/jquery-smartresize/blob/master/jquery.debouncedresize.js
*
* Copyright 2011 @louis_remi
* Licensed under the MIT license.
*/

var $event = $.event, $special, resizeTimeout;

$special = $event.special.debouncedresize = {
    // Handles setup of the debounced resize event
    setup: function() {
        $(this).on("resize", $special.handler);
    },
    // Teardown logic for the resize event
    teardown: function() {
        $(this).off("resize", $special.handler);
    },
    // Main handler logic to debounce resize events
    handler: function(event, execAsap) {
        // ... (Your existing code) ...
    },
    threshold: 250 // Time in milliseconds before firing the debounced event
};

// ======================= imagesLoaded Plugin ===============================
// ... (Your existing code) ...

// ======================= Grid Module ===============================
var Grid = (function() {
    // ... (Your existing code) ...

    // ======================= Initialization ===============================
    // ... (Your existing code) ...

    // ======================= Adding Items to the Grid ===============================
    // ... (Your existing code) ...

    // ======================= Utility Functions ===============================
    // ... (Your existing code) ...

    // ======================= Event Initialization ===============================
    // ... (Your existing code) ...

    // ======================= Item Event Handling ===============================
    // ... (Your existing code) ...

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
        (typeof preview === 'undefined') ? (preview = new Preview($item, function() {
            showPreview($item);
        })) : (preview.update($item));

        // Initialize new preview object
        preview = new Preview($item, function() {
            // ... (Your existing code) ...

            // Find the og-expander-inner div associated with the clicked item
            var $expanderContent = $item.find('.og-expander-inner'); 

            preview.$previewEl = $('<div class="og-expander"></div>')
                .append($expanderContent) // Append the content to the expander
                .appendTo($item); 

            // ... (Your existing code) ...
        });
    }

    // Hide the currently expanded preview
    // ... (Your existing code) ...

    // ======================= Preview Object ===============================
    // ... (Your existing code) ...

    // Expose public methods
    // ... (Your existing code) ...
})();
