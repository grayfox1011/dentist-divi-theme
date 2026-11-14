( function () {
	'use strict';

	var label = ( window.perlaCompare && window.perlaCompare.label ) || 'Before and after';

	// A group with two images becomes a slider: the first image is "before", the second "after".
	function sniperWolf( box ) {
		if ( 2 !== box.querySelectorAll( '.wp-block-image' ).length ) {
			return;
		}

		var range = document.createElement( 'input' );
		var handle = document.createElement( 'span' );
		var dragging = false;

		function set( value ) {
			value = Math.min( Math.max( value, 0 ), 100 );
			box.style.setProperty( '--perla-pos', value + '%' );
			range.value = Math.round( value );
		}

		function follow( event ) {
			var rect = box.getBoundingClientRect();

			set( ( event.clientX - rect.left ) / rect.width * 100 );
		}

		// The range input is what keyboards and screen readers use; it is not drawn.
		range.type = 'range';
		range.min = 0;
		range.max = 100;
		range.className = 'perla-compare-range';
		range.setAttribute( 'aria-label', label );
		range.addEventListener( 'input', function () {
			set( parseFloat( range.value ) );
		} );

		handle.className = 'perla-compare-handle';
		handle.setAttribute( 'aria-hidden', 'true' );

		box.appendChild( range );
		box.appendChild( handle );
		box.classList.add( 'is-live' );
		set( 50 );

		box.addEventListener( 'pointerdown', function ( event ) {
			if ( event.button ) {
				return;
			}

			dragging = true;
			box.setPointerCapture( event.pointerId );
			follow( event );
		} );

		box.addEventListener( 'pointermove', function ( event ) {
			if ( dragging ) {
				follow( event );
			}
		} );

		[ 'pointerup', 'pointercancel', 'lostpointercapture' ].forEach( function ( name ) {
			box.addEventListener( name, function () {
				dragging = false;
			} );
		} );
	}

	document.querySelectorAll( '.perla-compare' ).forEach( sniperWolf );
}() );
