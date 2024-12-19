/* Updated grid.js with improved Supabase Integration and Expander logic */

// Initialize Supabase
const supabaseUrl = 'https://qednuirrccgrlcqrszmb.supabase.co'; // Your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZG51aXJyY2NncmxjcXJzem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTA5NDYsImV4cCI6MjA0OTk4Njk0Nn0.Lb9OmaJN5TU_AOSoExbHLTBpCYcURTT3lG2bn1RJEr0'; // Your Anon Key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);


// Fetch records from Supabase
async function fetchRecords() {
    try {
        const { data, error } = await supabase
            .from('subject_explorer_records') // Replace with your table name
            .select('*'); // Adjust columns if needed

        if (error) throw error;

        return data;
    } catch (err) {
        console.error("Error fetching records:", err.message);
        return [];
    }
}

// Render dynamic tiles into the grid
async function renderDynamicGrid() {
    const tilesContainer = document.getElementById("og-grid");
    const records = await fetchRecords();

    // Dynamically create tiles
    records.forEach(record => {
        const tile = document.createElement('li');
        tile.innerHTML = `
            <a href="${record.subject_link}" 
               data-largesrc="${record.subject_image || 'https://via.placeholder.com/150'}" 
               data-title="${record.subject}" 
               data-description="${record.description || ''}">
                <div class="tile">
                    <div class="product-badge">${record.type.toUpperCase()}</div>
                    <div class="text-group">
                        <div class="word subject">${record.subject}</div>
                        <div class="word predicate">${record.predicate}</div>
                        <div class="word object">${record.object}</div>
                        <div class="word type">${record.subtype}</div>
                        <div class="word relationship">${record.relationship}</div>
                    </div>
                </div>
            </a>
        `;

        // Append each tile to the container
        tilesContainer.appendChild(tile);
    });

    // Reinitialize Grid functionality after dynamic insertion
    Grid.init();
}

// Original Grid.js functionality
var Grid = (function() {
    var $selector = '#og-grid', 
    $grid = $( $selector ),
    $items = $grid.children( 'li' ),
    current = -1,
    previewPos = -1,
    scrollExtra = 0,
    marginExpanded = 10,
    $window = $( window ), winsize,
    $body = $( 'html, body' ),
    transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition' : 'transitionend',
        'OTransition' : 'oTransitionEnd',
        'msTransition' : 'MSTransitionEnd',
        'transition' : 'transitionend'
    },
    transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
    support = Modernizr.csstransitions,
    settings = {
        minHeight : 500,
        speed : 350,
        easing : 'ease',
        showVisitButton : true
    };

    function init( config ) {
        settings = $.extend( true, {}, settings, config );
        $grid.imagesLoaded( function() {
            saveItemInfo( true );
            getWinSize();
            initEvents();
        } );
    }

    function addItems( $newitems ) {
        $items = $items.add( $newitems );
        $newitems.each( function() {
            var $item = $( this );
            $item.data( {
                offsetTop : $item.offset().top,
                height : $item.height()
            } );
        } );
        initItemsEvents( $newitems );
    }

    function saveItemInfo( saveheight ) {
        $items.each( function() {
            var $item = $( this );
            $item.data( 'offsetTop', $item.offset().top );
            if( saveheight ) {
                $item.data( 'height', $item.height() );
            }
        } );
    }

    function initEvents() {
        initItemsEvents( $items );
        $window.on( 'debouncedresize', function() {
            scrollExtra = 0;
            previewPos = -1;
            saveItemInfo();
            getWinSize();
            var preview = $.data( this, 'preview' );
            if( typeof preview != 'undefined' ) {
                hidePreview();
            }
        } );
    }

    function initItemsEvents( $items ) {
        $items.on( 'click', 'span.og-close', function() {
            hidePreview();
            return false;
        } ).children( 'a' ).on( 'click', function(e) {
            var $item = $( this ).parent();
            current === $item.index() ? hidePreview() : showPreview( $item );
            return false;
        } );
    }

    function getWinSize() {
        winsize = { width : $window.width(), height : $window.height() };
    }

    function showPreview( $item ) {
        var preview = $.data( this, 'preview' ),
            position = $item.data( 'offsetTop' );
        scrollExtra = 0;

        if( typeof preview != 'undefined' ) {
            if( previewPos !== position ) {
                if( position > previewPos ) {
                    scrollExtra = preview.height;
                }
                hidePreview();
            } else {
                preview.update( $item );
                return false;
            }
        }

        previewPos = position;
        preview = $.data( this, 'preview', new Preview( $item ) );
        preview.open();
    }

    function hidePreview() {
        current = -1;
        var preview = $.data( this, 'preview' );
        preview.close();
        $.removeData( this, 'preview' );
    }

    function Preview( $item ) {
        this.$item = $item;
        this.expandedIdx = this.$item.index();
        this.create();
        this.update();
    }

    Preview.prototype = {
        create : function() {
            this.$title = $( '<h3></h3>' );
            this.$description = $( '<p></p>' );
            var detailAppends = [this.$title, this.$description];
            if (settings.showVisitButton === true) {
                this.$href = $( '<a href="#">Visit website</a>' );
                detailAppends.push(this.$href);
            }
            this.$details = $( '<div class="og-details"></div>' ).append(detailAppends);
            this.$loading = $( '<div class="og-loading"></div>' );
            this.$fullimage = $( '<div class="og-fullimg"></div>' ).append( this.$loading );
            this.$closePreview = $( '<span class="og-close"></span>' );
            this.$previewInner = $( '<div class="og-expander-inner"></div>' ).append( this.$closePreview, this.$fullimage, this.$details );
            this.$previewEl = $( '<div class="og-expander"></div>' ).append( this.$previewInner );
            this.$item.append( this.getEl() );
            if( support ) {
                this.setTransition();
            }
        },
        update : function( $item ) {
            if( $item ) {
                this.$item = $item;
            }
            if( current !== -1 ) {
                var $currentItem = $items.eq( current );
                $currentItem.removeClass( 'og-expanded' );
                this.$item.addClass( 'og-expanded' );
                this.positionPreview();
            }
            current = this.$item.index();
            var $itemEl = this.$item.children( 'a' ),
                eldata = {
                    href : $itemEl.attr( 'href' ),
                    largesrc : $itemEl.data( 'largesrc' ),
                    title : $itemEl.data( 'title' ),
                    description : $itemEl.data( 'description' )
                };

            this.$title.html( eldata.title );
            this.$description.html( eldata.description );
            if (settings.showVisitButton === true) {
                this.$href.attr( 'href', eldata.href );
            }

            var self = this;

            if( typeof self.$largeImg != 'undefined' ) {
                self.$largeImg.remove();
            }

            if( self.$fullimage.is( ':visible' ) ) {
                this.$loading.show();
                $( '<img/>' ).load( function() {
                    var $img = $( this );
                    if( $img.attr( 'src' ) === self.$item.children('a').data( 'largesrc' ) ) {
                        self.$loading.hide();
                        self.$fullimage.find( 'img' ).remove();
                        self.$largeImg = $img.fadeIn( 350 );
                        self.$fullimage.append( self.$largeImg );
                    }
                } ).attr( 'src', eldata.largesrc );
            }
        },
        open : function() {
            setTimeout( $.proxy( function() {
                this.setHeights();
                this.positionPreview();
            }, this ), 25 );
        },
        close : function() {
            var self = this,
                onEndFn = function() {
                    if( support ) {
                        $( this ).off( transEndEventName );
                    }
                    self.$item.removeClass( 'og-expanded' );
                    self.$previewEl.remove();
                };

            setTimeout( $.proxy( function() {
                if( typeof this.$largeImg !== 'undefined' ) {
                    this.$largeImg.fadeOut( 'fast' );
                }
                this.$previewEl.css( 'height', 0 );
                var $expandedItem = $items.eq( this.expandedIdx );
                $expandedItem.css( 'height', $expandedItem.data( 'height' ) ).on( transEndEventName, onEndFn );

                if( !support ) {
                    onEndFn.call();
                }

            }, this ), 25 );

            return false;
        },
        calcHeight : function() {
            var heightPreview = winsize.height - this.$item.data( 'height' ) - marginExpanded,
                itemHeight = winsize.height;

            if( heightPreview < settings.minHeight ) {
                heightPreview = settings.minHeight;
                itemHeight = settings.minHeight + this.$item.data( 'height' ) + marginExpanded;
            }

            this.height = heightPreview;
            this.itemHeight = itemHeight;
        },
        setHeights : function() {
            var self = this,
                onEndFn = function() {
                    if( support ) {
                        self.$item.off( transEndEventName );
                    }
                    self.$item.addClass( 'og-expanded' );
                };

            this.calcHeight();
            this.$previewEl.css( 'height', this.height );
            this.$item.css( 'height', this.itemHeight ).on( transEndEventName, onEndFn );

            if( !support ) {
                onEndFn.call();
            }
        },
        positionPreview : function() {
            var position = this.$item.data( 'offsetTop' ),
                previewOffsetT = this.$previewEl.offset().top - scrollExtra,
                scrollVal = this.height + this.$item.data( 'height' ) + marginExpanded <= winsize.height ? position : this.height < winsize.height ? previewOffsetT - ( winsize.height - this.height ) : previewOffsetT;
            $body.animate( { scrollTop : scrollVal }, settings.speed );
        },
        setTransition  : function() {
            this.$previewEl.css( 'transition', 'height ' + settings.speed + 'ms ' + settings.easing );
            this.$item.css( 'transition', 'height ' + settings.speed + 'ms ' + settings.easing );
        },
        getEl : function() {
            return this.$previewEl;
        }
    }

    return { 
        init : init,
        addItems : addItems
    };

})();

// Call renderDynamicGrid on page load
renderDynamicGrid();
