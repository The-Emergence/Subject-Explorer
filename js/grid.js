/*
* debouncedresize: special jQuery event that happens once after a window resize
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
            // Create base structure
            this.$details = $('<div class="og-details"></div>');
            this.$loading = $('<div class="og-loading"></div>');
            this.$fullimg = $('<div class="og-fullimg"></div>').append(this.$loading);
            this.$closePreview = $('<span class="og-close"></span>');
            this.$previewInner = $('<div class="og-expander-inner"></div>').append(this.$closePreview, this.$fullimg, this.$details);
            this.$previewEl = $('<div class="og-expander"></div>').append(this.$previewInner);

            // Get template ID from data attribute
            var $itemEl = this.$item.find('a');
            var templateId = $itemEl.data('template-id');
            
            // Load content from template if it exists
            if(templateId) {
                var $template = $('#content-' + templateId);
                if($template.length) {
                    // Clone the template content to preserve the original
                    var $content = $template.clone().show();
                    this.$details.html($content);
                }
            }

            // Append preview element to the item
            this.$item.append(this.getEl());

            if(support) {
                this.setTransition();
            }
        },

        update: function($item) {
            if($item) {
                this.$item = $item;
            }

            if(current !== -1) {
                var $currentItem = $grid.children('li').eq(current);
                $currentItem.removeClass('og-expanded');
                this.$item.addClass('og-expanded');
                this.positionPreview();
            }

            current = this.$item.index();

            // Update image if it exists
            var $itemEl = this.$item.find('a'),
                largesrc = $itemEl.data('largesrc');

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
