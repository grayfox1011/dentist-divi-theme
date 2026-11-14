/**
 * Perla scroll animations.
 *
 * The theme adds "perla-motion" to <html> before the page is drawn (see functions.php). This
 * file then marks each animated piece with "is-in" when it scrolls into view; the movement
 * itself is written in style.css, section 6. Nothing runs when the visitor prefers reduced motion.
 *
 * Classes it looks for:
 *   perla-reveal, perla-image, perla-pop   one piece that appears
 *   perla-stagger                          inner blocks that appear one after the other
 *   perla-split                            a title whose words rise one by one
 *   perla-number                           a figure that counts up
 *   perla-hero                             the first band of the page, which shrinks as it leaves
 *
 * @package Perla
 */
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

	/**
	 * Wraps every word of a title in two spans: the outer one hides, the inner one moves.
	 * Links, bold text and line breaks inside the title stay as they are.
	 */
	function splitWords( title ) {
		var walker = document.createTreeWalker( title, NodeFilter.SHOW_TEXT );
		var texts = [];
		var count = 0;

		while ( walker.nextNode() ) {
			texts.push( walker.currentNode );
		}

		texts.forEach( function ( text ) {
			var pieces = text.nodeValue.split( /(\s+)/ );
			var fragment = document.createDocumentFragment();

			pieces.forEach( function ( piece ) {
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

	/** Counts from zero to the figure written in the block, keeping its decimals and any sign around it. */
	function countUp( element ) {
		var original = element.textContent;
		var match = original.match( /^(\D*)(\d+(?:[.,]\d+)?)(.*)$/ );

		if ( ! match ) {
			return;
		}

		var separator = match[ 2 ].indexOf( ',' ) > -1 ? ',' : '.';
		var decimals = ( match[ 2 ].split( separator )[ 1 ] || '' ).length;
		var target = parseFloat( match[ 2 ].replace( ',', '.' ) );
		var duration = 1400;
		var start = null;

		function frame( now ) {
			if ( null === start ) {
				start = now;
			}

			var progress = Math.min( ( now - start ) / duration, 1 );
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

	/** Runs a function at most once per frame while the page scrolls or changes size, and once now. */
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
		document.querySelectorAll( '.perla-split' ).forEach( splitWords );

		document.querySelectorAll( '.perla-stagger' ).forEach( function ( group ) {
			Array.prototype.forEach.call( group.children, function ( child, index ) {
				child.style.setProperty( '--perla-i', Math.min( index, 8 ) );
			} );
		} );

		var pending = Array.prototype.slice.call( document.querySelectorAll( '.perla-reveal, .perla-stagger, .perla-split, .perla-image, .perla-pop, .perla-number' ) );
		var observer;

		function show( element ) {
			var index = pending.indexOf( element );

			if ( index < 0 ) {
				return;
			}

			pending.splice( index, 1 );
			observer.unobserve( element );
			element.classList.add( 'is-in' );

			if ( element.classList.contains( 'perla-number' ) ) {
				countUp( element );
			}
		}

		// A piece appears once it is a little way into the window.
		observer = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						show( entry.target );
					}
				} );
			},
			{ rootMargin: '0px 0px -10% 0px' }
		);

		pending.forEach( function ( element ) {
			observer.observe( element );
		} );

		var band = document.querySelector( 'main > .perla-hero:first-child' );

		onScroll( function () {
			// The first band of the page gets smaller, with rounder corners, while it scrolls away.
			if ( band ) {
				band.style.setProperty( '--perla-shrink', Math.min( Math.max( window.scrollY / ( band.offsetHeight || 1 ), 0 ), 1 ).toFixed( 3 ) );
			}

			// At the end of the page nothing can scroll further in, so whatever is left appears.
			if ( pending.length && window.innerHeight + window.scrollY >= root.scrollHeight - 4 ) {
				pending.slice().forEach( show );
			}
		} );

		// Smooth scrolling with the mouse wheel. Phones and tablets keep their own scrolling.
		if ( window.Lenis && window.matchMedia( '(pointer: fine)' ).matches ) {
			document.querySelectorAll( '.wp-block-navigation__responsive-container' ).forEach( function ( menu ) {
				menu.setAttribute( 'data-lenis-prevent', '' );
			} );

			new window.Lenis( { autoRaf: true, anchors: true, allowNestedScroll: true } );
		}

		root.classList.add( 'perla-ready' );
	} catch ( error ) {
		// Whatever went wrong, the page must stay readable.
		root.classList.remove( 'perla-motion' );
	}
}() );
