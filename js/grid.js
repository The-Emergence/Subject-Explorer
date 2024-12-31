/*
* debouncedresize: special jQuery event that happens once after a window resize
*
* Copyright 2011 @louis_remi
* Licensed under the MIT license.
*/*
* debouncedresize: special jQuery event that happens once after a window resize
*
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
    setup: function() {
        $(this).on("resize", $special.handler);
    },
    teardown: function() {
        $(this).off("resize", $special.handler);
    },
    handler: function(event, execAsap) {
        var context = this,
            args = arguments,
            dispatch = function() {
                event.type = "debouncedresize";
                $event.dispatch.apply(context, args);
            };

        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }

        execAsap ? dispatch() : resizeTimeout = setTimeout(dispatch, $special.threshold);
    },
    threshold: 250
};

// The Grid object
var Grid = (function() {

    var $grid = $('#og-grid'),
        current = -1,
        previewPos = -1,
        scrollExtra = 0,
        marginExpanded = 10,
        $window = $(window),
        winsize,
        $body = $('html, body'),
        // Transitionend event names
        transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
        support = Modernizr.csstransitions,
        settings = {
            minHeight: 500,
            speed: 350,
            easing: 'ease'
        };

    function init(config) {
        settings = $.extend(true, {}, settings, config);
        $grid.imagesLoaded(function() {
            saveItemInfo(true);
            getWinSize();
            initEvents();
        });
    }

    function saveItemInfo(saveheight) {
        $grid.children('li').each(function() {
            var $item = $(this);
            $item.data('offsetTop', $item.offset().top);
            if(saveheight) {
                $item.data('height', $item.height());
            }
        });
    }

    function initEvents() {
        $window.on('debouncedresize', function() {
            scrollExtra = 0;
            previewPos = -1;
            saveItemInfo();
            getWinSize();
            var preview = $.data(this, 'preview');
            if(typeof preview != 'undefined') {
                hidePreview();
            }
        });

        $grid.on('click', 'span.og-close', function() {
            hidePreview();
            return false;
        });

        $grid.children('li').each(function() {
            var $item = $(this);
            $item.find('a').on('click', function(e) {
                e.preventDefault();
                if(current === $item.index()) {
                    hidePreview();
                } else {
                    showPreview($item);
                }
                return false;
            });
        });
    }

    function getWinSize() {
        winsize = { width: $window.width(), height: $window.height() };
    }

    function showPreview($item) {
        var preview = $.data(this, 'preview'),
            position = $item.data('offsetTop');

        scrollExtra = 0;

        if(typeof preview != 'undefined') {
            if(previewPos !== position) {
                hidePreview();
            }
            else {
                preview.update($item);
                return false;
            }
        }

        preview = $.data(this, 'preview', new Preview($item));
        preview.open();
    }

    function hidePreview() {
        current = -1;
        var preview = $.data(this, 'preview');
        preview.close();
        $.removeData(this, 'preview');
    }

    // Preview obj
    function Preview($item) {
        this.$item = $item;
        this.expandedIdx = this.$item.index();
        this.create();
        this.update();
    }

    Preview.prototype = {
        create: function() {
            // Create the preview container
            this.$details = $('<div class="og-details"></div>');
            
            // Get custom content from data attribute
            var customContent = this.$item.find('a').data('custom-content');
            if(customContent) {
                this.$details.html(customContent);
            }
            
            // Create image container
            this.$loading = $('<div class="og-loading"></div>');
            this.$fullimg = $('<div class="og-fullimg"></div>').append(this.$loading);
            
            // Create close button
            this.$closePreview = $('<span class="og-close"></span>');
            
            // Create preview inner container
            this.$previewInner = $('<div class="og-expander-inner"></div>')
                .append(this.$closePreview, this.$fullimg, this.$details);
            
            // Create the preview element
            this.$previewEl = $('<div class="og-expander"></div>')
                .append(this.$previewInner);

            // Append preview to item
            this.$item.append(this.getEl());

            // Set transitions
            if(support) {
                this.setTransition();
            }
        },

        update: function($item) {
            if($item) {
                this.$item = $item;
            }

            // If already expanded
            if(current !== -1) {
                var $currentItem = $grid.children('li').eq(current);
                $currentItem.removeClass('og-expanded');
                this.$item.addClass('og-expanded');
                this.positionPreview();
            }

            current = this.$item.index();

            // Update content if needed
            var customContent = this.$item.find('a').data('custom-content');
            if(customContent) {
                this.$details.html(customContent);
            }

            // Update image
            var $itemEl = this.$item,
                largesrc = $itemEl.find('a').data('largesrc');

            if(largesrc) {
                var self = this;
                self.$loading.show();
                $('<img/>').load(function() {
                    var $img = $(this);
                    if($img.attr('src') === largesrc) {
                        self.$loading.hide();
                        self.$fullimg.find('img').remove();
                        self.$fullimg.append($img);
                    }
                }).attr('src', largesrc);
            }
        },

        open: function() {
            setTimeout($.proxy(function() {
                this.setHeights();
                this.positionPreview();
            }, this), 25);
        },

        close: function() {
            var self = this,
                onEndFn = function() {
                    if(support) {
                        $(this).off(transEndEventName);
                    }
                    self.$item.removeClass('og-expanded');
                    self.$previewEl.remove();
                };

            setTimeout($.proxy(function() {
                if(support) {
                    this.$item.css('height', this.$item.data('height')).on(transEndEventName, onEndFn);
                }
                else {
                    onEndFn.call();
                }
            }, this), 25);
            return false;
        },

        calcHeight: function() {
            var heightPreview = winsize.height - this.$item.data('height') - marginExpanded,
                itemHeight = winsize.height;

            if(heightPreview < settings.minHeight) {
                heightPreview = settings.minHeight;
                itemHeight = settings.minHeight + this.$item.data('height') + marginExpanded;
            }

            this.height = heightPreview;
            this.itemHeight = itemHeight;
        },

        setHeights: function() {
            var self = this,
                onEndFn = function() {
                    if(support) {
                        self.$item.off(transEndEventName);
                    }
                    self.$item.addClass('og-expanded');
                };

            this.calcHeight();
            this.$previewEl.css('height', this.height);
            this.$item.css('height', this.itemHeight).on(transEndEventName, onEndFn);
        },

        positionPreview: function() {
            var position = this.$item.data('offsetTop'),
                previewOffsetT = this.$previewEl.offset().top - scrollExtra,
                scrollVal = this.height + this.$item.data('height') + marginExpanded <= winsize.height ? position : this.height < winsize.height ? previewOffsetT - (winsize.height - this.height) : previewOffsetT;

            $body.animate({ scrollTop: scrollVal }, settings.speed);
        },

        setTransition: function() {
            this.$previewEl.css('transition', 'height ' + settings.speed + 'ms ' + settings.easing);
            this.$item.css('transition', 'height ' + settings.speed + 'ms ' + settings.easing);
        },

        getEl: function() {
            return this.$previewEl;
        }
    };

    return {
        init: init,
        addItems: function($newitems) {
            $grid.append($newitems);
            initEvents();
        }
    };
})();
var $event = $.event,
$special,
resizeTimeout;

$special = $event.special.debouncedresize = {
    setup: function() {
        $(this).on("resize", $special.handler);
    },
    teardown: function() {
        $(this).off("resize", $special.handler);
    },
    handler: function(event, execAsap) {
        var context = this,
            args = arguments,
            dispatch = function() {
                event.type = "debouncedresize";
                $event.dispatch.apply(context, args);
            };

        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }

        execAsap ? dispatch() : resizeTimeout = setTimeout(dispatch, $special.threshold);
    },
    threshold: 250
};

// The Grid object
var Grid = (function() {

    // List of items
    var $grid = $('#og-grid'),
        // Current expanded item's index
        current = -1,
        // Position of preview
        previewPos = -1,
        // Extra window scroll for preview
        scrollExtra = 0,
        // Extra margin when expanded (between preview overlay and items)
        marginExpanded = 10,
        $window = $(window),
        winsize,
        $body = $('html, body'),
        // Transitionend event name
        transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
        // Support for transitions
        support = Modernizr.csstransitions,
        // Default settings
        settings = {
            minHeight: 500,
            speed: 350,
            easing: 'ease'
        };

    function init(config) {
        // Apply new settings
        settings = $.extend(true, {}, settings, config);

        // Get all items
        $grid.find('li').each(function() {
            var $item = $(this);
            $item.data({
                offsetTop: $item.offset().top,
                height: $item.height()
            });
        });

        // Get window size
        getWinSize();
        // Initialize some events
        initEvents();
    }

    function getWinSize() {
        winsize = { width: $window.width(), height: $window.height() };
    }

    function initEvents() {
        // Window resize event
        $window.on('debouncedresize', function() {
            scrollExtra = 0;
            previewPos = -1;
            // Save item's offset
            saveItemInfo();
            getWinSize();
            var preview = $.data(this, 'preview');
            if (typeof preview != 'undefined') {
                hidePreview();
            }
        });

        // Initialize item events
        initItemsEvents($grid.children('li'));
    }

    function initItemsEvents($items) {
        $items.each(function() {
            var $item = $(this);
            
            // Click event on grid-trigger
            $item.on('click', '.grid-trigger', function(e) {
                e.preventDefault();
                if (current === $item.index()) {
                    hidePreview();
                } else {
                    showPreview($item);
                }
                return false;
            });
            
            // Close button click event
            $item.on('click', '.og-close', function() {
                hidePreview();
                return false;
            });
        });
    }

    function saveItemInfo(saveheight) {
        $grid.children('li').each(function() {
            var $item = $(this);
            $item.data('offsetTop', $item.offset().top);
            if (saveheight) {
                $item.data('height', $item.height());
            }
        });
    }

    function showPreview($item) {
        var preview = $.data(this, 'preview'),
            position = $item.data('offsetTop');

        scrollExtra = 0;

        // If a preview exists and is not the current one
        if (typeof preview != 'undefined') {
            // Update height of wrap
            $item.data('height', $item.height());
            // If position changed
            if (previewPos !== position) {
                // Close preview
                hidePreview();
            }
            else {
                preview.update($item);
                return false;
            }
        }

        // Create new preview
        preview = $.data(this, 'preview', new Preview($item));
        // Position preview
        preview.open();
    }

    function hidePreview() {
        current = -1;
        var preview = $.data(this, 'preview');
        preview.close();
        $.removeData(this, 'preview');
    }

    // The preview obj / overlay
    function Preview($item) {
        this.$item = $item;
        this.expandedIdx = this.$item.index();
        this.create();
        this.update();
    }

    Preview.prototype = {
        create: function() {
            // Create Preview structure
            this.$title = $('<h3></h3>');
            this.$description = $('<p></p>');
            this.$href = $('<a href="#">Visit website</a>');
            this.$details = $('<div class="og-details"></div>').append(this.$title, this.$description, this.$href);
            this.$loading = $('<div class="og-loading"></div>');
            this.$fullimage = $('<div class="og-fullimg"></div>').append(this.$loading);
            this.$closePreview = $('<span class="og-close"></span>');
            this.$previewInner = $('<div class="og-expander-inner"></div>').append(this.$closePreview, this.$fullimage, this.$details);
            this.$previewEl = $('<div class="og-expander"></div>').append(this.$previewInner);
            // Append preview element to the item
            this.$item.append(this.getEl());
            // Set the transitions
            if (support) {
                this.setTransition();
            }
        },
        update: function($item) {
            if ($item) {
                this.$item = $item;
            }
            
            // If already expanded, remove class
            if (current !== -1) {
                var $currentItem = $grid.children('li').eq(current);
                $currentItem.removeClass('og-expanded');
                this.$item.addClass('og-expanded');
                this.positionPreview();
            }

            // Update current value
            current = this.$item.index();
            
            // Update preview's content
            var $itemEl = this.$item;
            
            // Get data attributes
            var eldata = {
                href: $itemEl.data('href'),
                largesrc: $itemEl.data('largesrc'),
                title: $itemEl.data('title'),
                description: $itemEl.data('description')
            };

            this.$title.html(eldata.title);
            this.$description.html(eldata.description);
            this.$href.attr('href', eldata.href);

            var self = this;
            
            // Remove loading indicator
            if (self.$loading.is(':visible')) {
                self.$loading.hide();
            }
            
            // Set image
            if (self.$fullimage.is(':visible')) {
                $('<img/>').load(function() {
                    var $img = $(this);
                    if ($img.attr('src') === self.$item.data('largesrc')) {
                        self.$loading.hide();
                        self.$fullimage.find('img').remove();
                        self.$fullimage.append($img);
                    }
                }).attr('src', eldata.largesrc);    
            }
        },
        open: function() {
            setTimeout($.proxy(function() {
                this.setHeights();
                this.positionPreview();
            }, this), 25);
        },
        close: function() {
            var self = this,
                onEndFn = function() {
                    if (support) {
                        $(this).off(transEndEventName);
                    }
                    self.$item.removeClass('og-expanded');
                    self.$previewEl.remove();
                };

            setTimeout($.proxy(function() {
                if (support) {
                    self.$item.css('height', self.$item.data('height')).on(transEndEventName, onEndFn);
                }
                else {
                    onEndFn.call();
                }
            }, this), 25);
            
            return false;
        },
        calcHeight: function() {
            var heightPreview = winsize.height - this.$item.data('height') - marginExpanded,
                itemHeight = winsize.height;

            if (heightPreview < settings.minHeight) {
                heightPreview = settings.minHeight;
                itemHeight = settings.minHeight + this.$item.data('height') + marginExpanded;
            }

            this.height = heightPreview;
            this.itemHeight = itemHeight;
        },
        setHeights: function() {
            var self = this,
                onEndFn = function() {
                    if (support) {
                        self.$item.off(transEndEventName);
                    }
                    self.$item.addClass('og-expanded');
                };

            this.calcHeight();
            this.$previewEl.css('height', this.height);
            this.$item.css('height', this.itemHeight).on(transEndEventName, onEndFn);
        },
        positionPreview: function() {
            var position = this.$item.data('offsetTop'),
                previewOffsetT = this.$previewEl.offset().top - scrollExtra,
                scrollVal = this.height + this.$item.data('height') + marginExpanded <= winsize.height ? position : this.height < winsize.height ? previewOffsetT - (winsize.height - this.height) : previewOffsetT;
            
            $body.animate({ scrollTop: scrollVal }, settings.speed);
        },
        setTransition: function() {
            this.$previewEl.css('transition', 'height ' + settings.speed + 'ms ' + settings.easing);
            this.$item.css('transition', 'height ' + settings.speed + 'ms ' + settings.easing);
        },
        getEl: function() {
            return this.$previewEl;
        }
    };

    return {
        init: init,
        addItems: function($newitems) {
            $grid.append($newitems);
            initItemsEvents($newitems);
        }
    };
})();
