<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Deep Inquiry Framework Template</title>
	<meta name="description" content="Thumbnail Grid with Expanding Preview" />
	<meta name="keywords" content="thumbnails, grid, preview, google image search, jquery, image grid, expanding, preview, portfolio" />
	<meta name="author" content="Codrops" />
	<link rel="shortcut icon" href="../favicon.ico">
	<link rel="stylesheet" type="text/css" href="css/default.css" />
	<link rel="stylesheet" type="text/css" href="css/component.css" />
	<link rel="stylesheet" type="text/css" href="css/tile.css" />
	<script src="js/modernizr.custom.js"></script>
       </head>
<body>
	<div class="container">
    	<!-- Header Section -->
    	<header class="clearfix">
        	<h1>Guitar Amps</h1>
        	<span>
            	<a href="https://the-emergence.github.io/thedeepinquiryframework_template/webform/productwebform.html" target="_blank">Curate</a> | Participate
        	</span>
    	</header>

    	<!-- Main Tile Grid -->
    	<div class="main">
        	<ul id="og-grid" class="og-grid">
	<!-- Expander content Begin -->
   		
            	<!-- PRODUCT 1 BEGIN -->
 <li>
    <a href="httFFps://www.fender.com/en-US/guitar-amplifiers/vintage-pro-tube/hot-rod-deluxe-iv/2231200000.html" 
       data-largesrc="https://www.fender.com/cdn-cgi/image/format=png,resize=height=auto,width=712/https://www.fmicassets.com/Damroot/ZoomJpg/10001/2231200000_amp_frt_001_nr.jpg" 
       data-title="Fender Hot Rod Guitar Amp" 
       data-description="The Fender Hot Rod Deluxe™ IV is a legendary tube amplifier celebrated for its versatile tonal range.<br><br><strong>Played by: </strong>George Benson, Michael Landau.<br><br><strong>Colors: </strong>Black<br><br><Strong>Price: </strong>$999<br><br>">
	    <!-- Expander content End -->
	    <!-- Tile Preview Begin -->
        <div class="tile">
            <div class="product-badge">Product</div>
            <div class="text-group">
                <div class="word subject">Fender Guitar Amp</div>
                <div class="word predicate">Tone2</div>
                <div class="word object">Warm</div>
                <div class="word type">Tube Amp</div>
                <div class="word subtype">Jazz/Blues</div>
                <div class="word relationship">John Mayer</div>
            </div>
        </div>
    </a>
	<!-- Tile Preview  End -->	          

	 	<!-- PRODUCT 1 END -->	
 </li>
	 <li>
			<!-- PRODUCT 2 BEGIN -->

    <a href="https://www.fender.com/en-US/guitar-amplifiers/vintage-pro-tube/hot-rod-deluxe-iv/2231200000.html" 
       data-largesrc="https://www.fender.com/cdn-cgi/image/format=png,resize=height=auto,width=712/https://www.fmicassets.com/Damroot/ZoomJpg/10001/2231200000_amp_frt_001_nr.jpg" 
       data-title="Peavey Guitar Amp" 
       data-description="The Fender Hot Rod Deluxe™ IV is a legendary tube amplifier celebrated for its versatile tonal range.<br><br><strong>Played by: </strong>George Benson, Michael Landau.<br><br><strong>Colors: </strong>Black<br><br><Strong>Price: </strong>$999<br><br>">
	    <!-- Expander content End -->
	    <!-- Tile Preview Begin -->
        <div class="tile">
            <div class="product-badge">Product</div>
            <div class="text-group">
                <div class="word subject">Peavey Amp</div>
                <div class="word predicate">Tone2</div>
                <div class="word object">Warm</div>
                <div class="word type">Tube Amp</div>
                <div class="word subtype">Jazz/Blues</div>
                <div class="word relationship">John Mayer</div>
            </div>
        </div>
    </a>
	<!-- Tile Preview  End -->     
	 <!-- PRODUCT 2 END -->	
 </li>	 	
	   	</ul>
        	<p>Build on <a href="http://www.theemergenc.io/">The Deep Inquiry Framework</a></p>
        	<p>Curated by J. Paul Duplantis</p>
    	</div>
	</div><!-- /container -->

	<!-- Expander Window -->
	<div id="attractor-expander" class="og-expander">
    	<div class="og-expander-inner">
        	<!-- Close Button -->
        	<span class="og-close">✖</span>

        	<!-- Left Section: Product Image -->
        	<div class="og-left">
            	<img src="../images/placeholder.jpg" alt="Product Image" class="product-image">
        	</div>

        	<!-- Right Section: Content -->
        	<div class="og-right">
            	<!-- Product Title -->
            	<h3 class="product-title">Fender Hot Rod Deluxe IV</h3>

            	<!-- RDF6 Details -->
            	<div class="product-details">
                	<p><strong>Subject:</strong> Tube Amplifier</p>
                	<p><strong>Predicate:</strong> Enhances warm, vintage guitar tones</p>
                	<p><strong>Object:</strong> Deliver professional-grade sound for small gigs</p>
                	<p><strong>Type:</strong> Guitar Amplifier</p>
                	<p><strong>Subtype:</strong> Tube Amplifier (Combo)</p>
                	<p><strong>Relationships:</strong> Related to Fender Stratocaster, Blues Genre, John Mayer.</p>
            	</div>

            	<!-- Product Link -->
            	<div class="product-link">
                	<a href="https://www.fender.com" target="_blank">Visit Product Page</a>
            	</div>

            	<!-- Share Options -->
            	<div class="share-options">
                	<p>Share this product:</p>
                	<a href="#" class="share-social">Social</a>
                	<a href="#" class="share-email">Email</a>
                	<a href="#" class="share-text">Text</a>
            	</div>
        	</div>
    	</div>
	</div>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="https://the-emergence.github.io/thedeepinquiryframework_template/js/grid.js"></script>
	<script>
    	$(function() {
        	Grid.init();

        	// Attractor-specific behavior
        	const expander = $('#attractor-expander');
        	$('.og-close').on('click', () => expander.removeClass('active'));
    	});
	</script>
</body>
</html>

