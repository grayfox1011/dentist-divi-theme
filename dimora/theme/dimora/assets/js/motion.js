( function () {
	'use strict';

	var root = document.documentElement;
	var words = window.dimoraMotion || {};

	// The name of the site in the footer, made exactly as wide as the footer. Not an animation, so it always runs.
	function bigShell() {
		Array.prototype.forEach.call( document.querySelectorAll( '.dimora-wordmark' ), function ( mark ) {
			var range = document.createRange();

			mark.classList.add( 'is-fitted' );
			mark.style.transition = 'none';
			mark.style.fontSize = '100px';
			range.selectNodeContents( mark );

			var width = range.getBoundingClientRect().width;

			if ( width ) {
				mark.style.fontSize = Math.min( 100 * mark.clientWidth / width, mark.clientWidth * 0.5 ).toFixed( 1 ) + 'px';
			} else {
				mark.style.fontSize = '';
				mark.classList.remove( 'is-fitted' );
			}
		} );
	}

	bigShell();
	window.addEventListener( 'resize', bigShell );

	if ( document.fonts && document.fonts.ready ) {
		document.fonts.ready.then( bigShell );
	}

	if ( ! root.classList.contains( 'dimora-motion' ) ) {
		return;
	}

	if ( ! ( 'IntersectionObserver' in window ) ) {
		root.classList.remove( 'dimora-motion' );
		return;
	}

	var finePointer = window.matchMedia( '(hover: hover) and (pointer: fine)' ).matches;
	var lenis = null;

	function each( selector, fn, scope ) {
		Array.prototype.forEach.call( ( scope || document ).querySelectorAll( selector ), fn );
	}

	function clamp( value, min, max ) {
		return Math.min( Math.max( value, min ), max );
	}

	// Wraps every word of a title in a mask; words on the same line rise together.
	function nanomachines( title ) {
		var walker = document.createTreeWalker( title, NodeFilter.SHOW_TEXT );
		var texts = [];
		var line = -1;
		var top = null;

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

				outer.className = 'dimora-word';
				inner.textContent = piece;
				outer.appendChild( inner );
				fragment.appendChild( outer );
			} );

			text.parentNode.replaceChild( fragment, text );
		} );

		each( '.dimora-word', function ( word ) {
			if ( word.offsetTop !== top ) {
				top = word.offsetTop;
				line++;
			}

			word.firstChild.style.setProperty( '--dimora-l', Math.min( line, 6 ) );
		}, title );
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

			var progress = Math.min( ( now - start ) / 1600, 1 );
			var eased = 1 - Math.pow( 1 - progress, 4 );

			if ( progress < 1 ) {
				element.textContent = match[ 1 ] + ( target * eased ).toFixed( decimals ).replace( '.', separator ) + match[ 3 ];
				window.requestAnimationFrame( frame );
			} else {
				element.textContent = original;
			}
		}

		window.requestAnimationFrame( frame );
	}

	// A band of text that runs sideways for ever. The copies are hidden from screen readers.
	function codecCall( band ) {
		var track = document.createElement( 'span' );
		var first = document.createElement( 'span' );

		first.className = 'dimora-marquee-item';

		while ( band.firstChild ) {
			first.appendChild( band.firstChild );
		}

		track.className = 'dimora-marquee-track';
		track.appendChild( first );
		band.appendChild( track );

		var copies = Math.max( 2, Math.ceil( ( window.innerWidth * 2 ) / Math.max( first.offsetWidth, 1 ) ) );

		if ( copies % 2 ) {
			copies++;
		}

		for ( var i = 1; i < copies; i++ ) {
			var copy = first.cloneNode( true );

			copy.setAttribute( 'aria-hidden', 'true' );
			each( 'a', function ( link ) {
				link.setAttribute( 'tabindex', '-1' );
			}, copy );
			track.appendChild( copy );
		}

		band.style.setProperty( '--dimora-marquee', ( first.offsetWidth * copies / 2 / 70 ).toFixed( 1 ) + 's' );
		band.classList.add( 'is-live' );
	}

	// A row of cards that moves sideways while the page scrolls down. Small screens keep the swipe.
	function metalGear( rail ) {
		var pin = rail.querySelector( '.dimora-rail-pin' );
		var track = rail.querySelector( '.dimora-rail-track' );
		var distance = 0;

		if ( ! pin || ! track ) {
			return null;
		}

		function measure() {
			rail.classList.remove( 'is-pinned' );
			rail.style.height = '';
			track.style.transform = '';

			if ( window.innerWidth < 1024 || window.innerHeight < 620 ) {
				distance = 0;
				return;
			}

			rail.classList.add( 'is-pinned' );

			var cards = track.children;
			var last = cards[ cards.length - 1 ];

			// The same gap is left after the last card as there is before the first one.
			distance = last ? Math.max( last.offsetLeft + last.offsetWidth + cards[ 0 ].offsetLeft - track.clientWidth, 0 ) : 0;
			rail.style.height = ( pin.offsetHeight + distance ) + 'px';
		}

		function update() {
			if ( ! distance ) {
				return;
			}

			var progress = clamp( -rail.getBoundingClientRect().top / distance, 0, 1 );

			track.style.transform = 'translate3d(' + ( -distance * progress ).toFixed( 1 ) + 'px,0,0)';
			rail.style.setProperty( '--dimora-rail', progress.toFixed( 4 ) );
		}

		// A card reached with the Tab key has to be brought into view by scrolling the page.
		track.addEventListener( 'focusin', function ( event ) {
			if ( ! distance ) {
				return;
			}

			var card = event.target.closest( '.dimora-rail-track > *' );

			if ( ! card ) {
				return;
			}

			var wanted = clamp( card.offsetLeft - track.clientWidth * 0.2, 0, distance );
			var top = window.scrollY + rail.getBoundingClientRect().top + wanted;

			if ( lenis ) {
				lenis.scrollTo( top, { immediate: true } );
			} else {
				window.scrollTo( 0, top );
			}
		} );

		return { measure: measure, update: update };
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
		each( '.dimora-split', nanomachines );

		each( '.dimora-stagger', function ( group ) {
			Array.prototype.forEach.call( group.children, function ( child, index ) {
				child.style.setProperty( '--dimora-i', Math.min( index, 10 ) );
			} );
		} );

		each( '.dimora-marquee', codecCall );

		var hidden = Array.prototype.slice.call( document.querySelectorAll( '.dimora-reveal, .dimora-stagger, .dimora-split, .dimora-image, .dimora-number, .dimora-rule' ) );
		var solitonRadar;

		function spotted( element ) {
			var index = hidden.indexOf( element );

			if ( index < 0 ) {
				return;
			}

			hidden.splice( index, 1 );
			solitonRadar.unobserve( element );
			element.classList.add( 'is-in' );

			if ( element.classList.contains( 'dimora-number' ) ) {
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
			{ rootMargin: '0px 0px -8% 0px' }
		);

		hidden.forEach( function ( element ) {
			solitonRadar.observe( element );
		} );

		// Pictures that drift a little inside their frame. Only the ones on screen are moved.
		var drifting = [];
		var parallax = new IntersectionObserver( function ( entries ) {
			entries.forEach( function ( entry ) {
				var at = drifting.indexOf( entry.target );

				if ( entry.isIntersecting && at < 0 ) {
					drifting.push( entry.target );
				} else if ( ! entry.isIntersecting && at > -1 ) {
					drifting.splice( at, 1 );
				}
			} );
		} );

		each( '.dimora-parallax', function ( element ) {
			parallax.observe( element );
		} );

		var rails = [];

		each( '.dimora-rail', function ( rail ) {
			var machine = metalGear( rail );

			if ( machine ) {
				rails.push( machine );
			}
		} );

		function measureRails() {
			rails.forEach( function ( rail ) {
				rail.measure();
			} );
		}

		measureRails();
		window.addEventListener( 'resize', measureRails );
		window.addEventListener( 'load', measureRails );

		var header = document.querySelector( '.wp-site-blocks > header' );
		var lastY = window.scrollY;

		onScroll( function () {
			var y = window.scrollY;
			var height = window.innerHeight;

			drifting.forEach( function ( element ) {
				var box = element.getBoundingClientRect();

				element.style.setProperty( '--dimora-p', clamp( ( box.top + box.height / 2 - height / 2 ) / ( height / 2 + box.height / 2 ), -1, 1 ).toFixed( 3 ) );
			} );

			rails.forEach( function ( rail ) {
				rail.update();
			} );

			// The header steps aside on the way down and comes back on the way up.
			if ( header ) {
				var open = header.querySelector( '.is-menu-open' ) || header.contains( document.activeElement );

				root.classList.toggle( 'dimora-scrolled', y > 24 );

				if ( open || y < 200 || y < lastY - 4 ) {
					root.classList.remove( 'dimora-header-away' );
				} else if ( y > lastY + 4 ) {
					root.classList.add( 'dimora-header-away' );
				}
			}

			lastY = y;

			// Nothing can scroll further in at the end of the page, so whatever is left shows up.
			if ( hidden.length && height + y >= root.scrollHeight - 4 ) {
				hidden.slice().forEach( spotted );
			}
		} );

		if ( finePointer ) {
			root.classList.add( 'dimora-fine' );

			// A round label that follows the pointer over project cards.
			var label = document.createElement( 'span' );
			var x = 0;
			var y = 0;
			var targetX = 0;
			var targetY = 0;
			var following = false;

			label.className = 'dimora-pointer';
			label.setAttribute( 'aria-hidden', 'true' );
			label.textContent = words.view || 'View';
			document.body.appendChild( label );

			function follow() {
				x += ( targetX - x ) * 0.18;
				y += ( targetY - y ) * 0.18;
				label.style.transform = 'translate3d(' + x.toFixed( 1 ) + 'px,' + y.toFixed( 1 ) + 'px,0)';

				if ( following ) {
					window.requestAnimationFrame( follow );
				}
			}

			document.addEventListener( 'pointermove', function ( event ) {
				var card = event.target.closest ? event.target.closest( '.dimora-cursor' ) : null;

				targetX = event.clientX;
				targetY = event.clientY;

				if ( card && ! following ) {
					following = true;
					x = targetX;
					y = targetY;
					label.classList.add( 'is-on' );
					window.requestAnimationFrame( follow );
				} else if ( ! card && following ) {
					following = false;
					label.classList.remove( 'is-on' );
				}
			}, { passive: true } );

			// In a list of projects, the picture of the row under the pointer floats next to it.
			each( '.dimora-list-row', function ( row ) {
				row.addEventListener( 'pointermove', function ( event ) {
					var box = row.getBoundingClientRect();

					row.style.setProperty( '--dimora-x', ( event.clientX - box.left ).toFixed( 0 ) + 'px' );
					row.style.setProperty( '--dimora-y', ( event.clientY - box.top ).toFixed( 0 ) + 'px' );
				}, { passive: true } );
			} );

			if ( window.Lenis ) {
				each( '.wp-block-navigation__responsive-container', function ( menu ) {
					menu.setAttribute( 'data-lenis-prevent', '' );
				} );

				lenis = new window.Lenis( { autoRaf: true, anchors: true, allowNestedScroll: true } );
			}
		}

		root.classList.add( 'dimora-ready' );
	} catch ( error ) {
		root.classList.remove( 'dimora-motion' );
	}
}() );
