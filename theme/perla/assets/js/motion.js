( function () {
	'use strict';

	var root = document.documentElement;

	if ( ! root.classList.contains( 'perla-motion' ) ) {
		return;
	}

	if ( ! ( 'IntersectionObserver' in window ) ) {
		root.classList.remove( 'perla-motion' );
		return;
	}

	// Cuts a title into words: the outer span hides, the inner one moves.
	function nanomachines( title ) {
		var walker = document.createTreeWalker( title, NodeFilter.SHOW_TEXT );
		var texts = [];
		var count = 0;

		while ( walker.nextNode() ) {
			texts.push( walker.currentNode );
		}

		texts.forEach( function ( text ) {
			var fragment = document.createDocumentFragment();

			text.nodeValue.split( /(\s+)/ ).forEach( function ( piece ) {
				if ( '' === piece ) {
					return;
				}

				if ( /^\s+$/.test( piece ) ) {
					fragment.appendChild( document.createTextNode( ' ' ) );
					return;
				}

				var outer = document.createElement( 'span' );
				var inner = document.createElement( 'span' );

				outer.className = 'perla-word';
				inner.textContent = piece;
				inner.style.setProperty( '--perla-w', count++ );
				outer.appendChild( inner );
				fragment.appendChild( outer );
			} );

			text.parentNode.replaceChild( fragment, text );
		} );
	}

	// Counts up to the figure in the block and ends on the exact text that was there.
	function revolverOcelot( element ) {
		var original = element.textContent;
		var match = original.match( /^(\D*)(\d+(?:[.,]\d+)?)(.*)$/ );

		if ( ! match ) {
			return;
		}

		var separator = match[ 2 ].indexOf( ',' ) > -1 ? ',' : '.';
		var decimals = ( match[ 2 ].split( separator )[ 1 ] || '' ).length;
		var target = parseFloat( match[ 2 ].replace( ',', '.' ) );
		var start = null;

		function frame( now ) {
			if ( null === start ) {
				start = now;
			}

			var progress = Math.min( ( now - start ) / 1400, 1 );
			var eased = 1 - Math.pow( 1 - progress, 3 );

			if ( progress < 1 ) {
				element.textContent = match[ 1 ] + ( target * eased ).toFixed( decimals ).replace( '.', separator ) + match[ 3 ];
				window.requestAnimationFrame( frame );
			} else {
				element.textContent = original;
			}
		}

		window.requestAnimationFrame( frame );
	}

	function onScroll( update ) {
		var waiting = false;

		function request() {
			if ( ! waiting ) {
				waiting = true;
				window.requestAnimationFrame( function () {
					waiting = false;
					update();
				} );
			}
		}

		window.addEventListener( 'scroll', request, { passive: true } );
		window.addEventListener( 'resize', request, { passive: true } );
		update();
	}

	try {
		document.querySelectorAll( '.perla-split' ).forEach( nanomachines );

		document.querySelectorAll( '.perla-stagger' ).forEach( function ( group ) {
			Array.prototype.forEach.call( group.children, function ( child, index ) {
				child.style.setProperty( '--perla-i', Math.min( index, 8 ) );
			} );
		} );

		var hidden = Array.prototype.slice.call( document.querySelectorAll( '.perla-reveal, .perla-stagger, .perla-split, .perla-image, .perla-pop, .perla-number' ) );
		var solitonRadar;

		function spotted( element ) {
			var index = hidden.indexOf( element );

			if ( index < 0 ) {
				return;
			}

			hidden.splice( index, 1 );
			solitonRadar.unobserve( element );
			element.classList.add( 'is-in' );

			if ( element.classList.contains( 'perla-number' ) ) {
				revolverOcelot( element );
			}
		}

		solitonRadar = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						spotted( entry.target );
					}
				} );
			},
			{ rootMargin: '0px 0px -10% 0px' }
		);

		hidden.forEach( function ( element ) {
			solitonRadar.observe( element );
		} );

		var band = document.querySelector( 'main > .perla-hero:first-child' );

		onScroll( function () {
			if ( band ) {
				band.style.setProperty( '--perla-shrink', Math.min( Math.max( window.scrollY / ( band.offsetHeight || 1 ), 0 ), 1 ).toFixed( 3 ) );
			}

			// Nothing can scroll further in at the end of the page, so whatever is left shows up.
			if ( hidden.length && window.innerHeight + window.scrollY >= root.scrollHeight - 4 ) {
				hidden.slice().forEach( spotted );
			}
		} );

		// Phones and tablets keep their own scrolling.
		if ( window.Lenis && window.matchMedia( '(pointer: fine)' ).matches ) {
			document.querySelectorAll( '.wp-block-navigation__responsive-container' ).forEach( function ( menu ) {
				menu.setAttribute( 'data-lenis-prevent', '' );
			} );

			new window.Lenis( { autoRaf: true, anchors: true, allowNestedScroll: true } );
		}

		root.classList.add( 'perla-ready' );
	} catch ( error ) {
		root.classList.remove( 'perla-motion' );
	}
}() );
