/**
 * Perla – scroll animations, made with GSAP, ScrollTrigger and SplitText.
 *
 * Every animation is attached to a CSS class, so it can be added to any Divi module in the
 * builder (Advanced > Attributes > add "class"):
 *
 *   perla-hero     section   shrinks into a rounded card while the page scrolls on (desktop)
 *   perla-split    heading   is revealed line by line
 *   perla-stagger  row, column or group: its direct children appear one after another
 *   perla-reveal   anything  fades in while it rises
 *   perla-image    image     is unveiled from the bottom while it slowly zooms out
 *   perla-pop      panel     grows to its full size as it scrolls into view (desktop)
 *
 * The page works without this file: elements are only hidden while <html> has the class
 * "perla-motion", which the theme adds in the <head> and removes again if this script does
 * not start. Nothing runs in the Visual Builder or for visitors who prefer reduced motion.
 */
( function () {
	'use strict';

	var root = document.documentElement;
	var gsap = window.gsap;
	var ScrollTrigger = window.ScrollTrigger;
	var SplitText = window.SplitText;

	// Timing. Change these to make the whole site calmer or livelier.
	var EASE = 'power3.out';
	var EASE_TEXT = 'expo.out';
	var RISE = 32; // Pixels an element travels while it fades in.
	var STAGGER = 0.1; // Seconds between the items of a group.
	// Animate when the top of an element reaches 86% of the window height. "clamp" keeps that
	// point reachable for elements at the very end of the page.
	var START = 'clamp(top 86%)';
	var DESKTOP = '(min-width: 981px)';

	function stop() {
		clearTimeout( window.perlaMotionTimer );
		root.classList.remove( 'perla-motion' );
	}

	// The class is missing when animations are off, for reduced motion, or after the safety timer.
	if ( ! root.classList.contains( 'perla-motion' ) ) {
		return;
	}
	if ( ! gsap || ! ScrollTrigger || ! SplitText || document.body.classList.contains( 'et-fb' ) ) {
		stop();
		return;
	}

	var startedAt = 0;
	var media = gsap.matchMedia();

	/** Runs fn once, when el scrolls into view. */
	function onEnter( el, fn ) {
		// What is already on screen starts straight away, without waiting for the page to finish loading.
		if ( el.getBoundingClientRect().top < window.innerHeight ) {
			fn();
			return;
		}
		ScrollTrigger.create( { trigger: el, start: START, once: true, onEnter: fn } );
	}

	/** Extra delay for the elements of the hero, so they play as one sequence on page load. */
	function delayOf( el ) {
		var isPageLoad = performance.now() - startedAt < 400;
		return isPageLoad && el.perlaDelay ? el.perlaDelay : 0;
	}

	/** Fade in and rise. */
	function riseIn( el, delay ) {
		el.classList.add( 'perla-in' );
		gsap.fromTo(
			el,
			{ autoAlpha: 0, y: RISE },
			{ autoAlpha: 1, y: 0, duration: 1, delay: delay || 0, ease: EASE, clearProps: 'transform,opacity,visibility' }
		);
	}

	/** Reveal a heading line by line. The text is split just before it plays and restored after. */
	function splitIn( el, delay ) {
		var text = el.querySelector( 'h1, h2, h3, h4, h5, h6' ) || el;

		gsap.set( el, { autoAlpha: 0 } );
		el.classList.add( 'perla-in' );

		gsap.delayedCall( delay || 0, function () {
			var split = SplitText.create( text, { type: 'lines', mask: 'lines', linesClass: 'perla-line' } );

			gsap.set( el, { autoAlpha: 1 } );
			gsap.from( split.lines, {
				yPercent: 115,
				duration: 1.2,
				ease: EASE_TEXT,
				stagger: 0.12,
				onComplete: function () {
					split.revert();
					gsap.set( el, { clearProps: 'opacity,visibility' } );
				},
			} );
		} );
	}

	/** Unveil an image from the bottom while it zooms out. */
	function imageIn( el, delay ) {
		var img = el.querySelector( 'img' );

		el.classList.add( 'perla-in' );
		gsap.fromTo(
			el,
			{ autoAlpha: 0, y: RISE, clipPath: 'inset(100% 0% 0% 0%)' },
			// The negative values leave room for the shadow of the image at the end.
			{ autoAlpha: 1, y: 0, clipPath: 'inset(-20% -20% -20% -20%)', duration: 1.5, delay: delay || 0, ease: EASE_TEXT, clearProps: 'transform,opacity,visibility,clipPath' }
		);
		if ( img ) {
			gsap.fromTo( img, { scale: 1.16 }, { scale: 1, duration: 1.9, delay: delay || 0, ease: EASE_TEXT, clearProps: 'transform' } );
		}
	}

	function isStaggerChild( el ) {
		return el.parentElement && el.parentElement.classList.contains( 'perla-stagger' );
	}

	function setupStagger() {
		gsap.utils.toArray( '.perla-stagger' ).forEach( function ( group ) {
			onEnter( group, function () {
				var delay = delayOf( group );
				var items = Array.prototype.filter.call( group.children, function ( child ) {
					return ! /^(SCRIPT|STYLE)$/.test( child.tagName );
				} );

				items.forEach( function ( item, index ) {
					var at = delay + index * STAGGER;

					if ( item.classList.contains( 'perla-split' ) ) {
						splitIn( item, at );
					} else if ( item.classList.contains( 'perla-image' ) ) {
						imageIn( item, at );
					} else {
						riseIn( item, at );
					}
				} );
				group.classList.add( 'perla-in' );
			} );
		} );
	}

	function setupSingles() {
		var kinds = [
			[ '.perla-split', splitIn ],
			[ '.perla-image', imageIn ],
			[ '.perla-reveal', riseIn ],
		];

		kinds.forEach( function ( kind ) {
			gsap.utils.toArray( kind[ 0 ] ).forEach( function ( el ) {
				// Children of a group are animated by the group.
				if ( isStaggerChild( el ) ) {
					return;
				}
				onEnter( el, function () {
					kind[ 1 ]( el, delayOf( el ) );
				} );
			} );
		} );
	}

	/** The first hero of the page: an entrance in sequence, then it shrinks while scrolling. */
	function setupHero() {
		var hero = document.querySelector( '.perla-hero' );
		if ( ! hero ) {
			return;
		}

		gsap.utils.toArray( hero.querySelectorAll( '.perla-stagger, .perla-split, .perla-image, .perla-reveal' ) ).forEach( function ( el, index ) {
			el.perlaDelay = 0.1 + index * 0.16;
		} );

		media.add( DESKTOP, function () {
			// Only the size follows the scroll. The rounded corners and the shadow of the "card"
			// are switched on with a class (see style.css), which costs the browser far less.
			gsap.to( hero, {
				scale: 0.88,
				transformOrigin: '50% 100%',
				ease: 'none',
				scrollTrigger: {
					trigger: hero,
					// From the top of the page (or of the window, for a hero placed lower down)…
					start: function () {
						return hero.getBoundingClientRect().top + window.pageYOffset < window.innerHeight ? 0 : 'top top';
					},
					// …until the hero has left the window.
					end: 'bottom top',
					scrub: 0.6,
					invalidateOnRefresh: true,
					onUpdate: function ( self ) {
						hero.classList.toggle( 'perla-hero-card', self.progress > 0.01 );
					},
				},
			} );

			return function () {
				hero.classList.remove( 'perla-hero-card' );
			};
		} );
	}

	/** Panels that grow to full size while they scroll into view. */
	function setupPop() {
		media.add( DESKTOP, function () {
			gsap.utils.toArray( '.perla-pop' ).forEach( function ( el ) {
				gsap.fromTo(
					el,
					{ scale: 0.9 },
					{ scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 55%', scrub: 0.6 } }
				);
			} );
		} );
	}

	/**
	 * Divi jumps to in-page links such as "#pricing" without any motion, unless its Smooth
	 * Scrolling option is on. Let its own function, which knows about the fixed header, glide.
	 */
	function setupAnchors() {
		var jump = window.et_pb_smooth_scroll;

		if ( 'function' === typeof jump ) {
			window.et_pb_smooth_scroll = function ( target, toTop, speed, easing ) {
				return jump.call( this, target, toTop, speed || 900, easing );
			};
		}
	}

	function init() {
		// The safety timer has already shown everything: leave the page as it is.
		if ( ! root.classList.contains( 'perla-motion' ) ) {
			return;
		}
		clearTimeout( window.perlaMotionTimer );

		gsap.registerPlugin( ScrollTrigger, SplitText );
		ScrollTrigger.config( { ignoreMobileResize: true } );
		startedAt = performance.now();

		setupHero();
		setupStagger();
		setupSingles();
		setupPop();
		setupAnchors();

		// Measure the page now: ScrollTrigger would otherwise wait until every image has loaded.
		ScrollTrigger.refresh();

		// Keep the scroll positions right when the page changes height (an FAQ opens, images load).
		if ( window.ResizeObserver ) {
			var timer;
			new ResizeObserver( function () {
				clearTimeout( timer );
				timer = setTimeout( ScrollTrigger.refresh, 250 );
			} ).observe( document.body );
		}
	}

	// Wait for the web fonts (0.8 seconds at most), so headings are split where their lines break.
	var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
	var patience = new Promise( function ( resolve ) {
		setTimeout( resolve, 800 );
	} );

	Promise.race( [ fonts, patience ] ).then( function () {
		if ( 'loading' === document.readyState ) {
			document.addEventListener( 'DOMContentLoaded', init );
		} else {
			init();
		}
	} );
}() );
