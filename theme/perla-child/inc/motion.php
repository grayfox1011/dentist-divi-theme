<?php
/**
 * Scroll animations and smooth scrolling: loads GSAP, Lenis and the theme's animation script
 * on the public site.
 *
 * The animations are attached to CSS classes (see assets/js/perla-motion.js). They and the
 * smooth scrolling can be switched off in Appearance > Perla Setup, and never run in the
 * Visual Builder.
 *
 * @package perla-child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PERLA_CHILD_MOTION_OPTION', 'perla_child_motion' );
define( 'PERLA_CHILD_SMOOTH_OPTION', 'perla_child_smooth' );
define( 'PERLA_CHILD_GSAP_VERSION', '3.15.1' );
define( 'PERLA_CHILD_LENIS_VERSION', '1.3.27' );

/**
 * Tells whether the animations run on the current page.
 *
 * @return bool
 */
function perla_child_motion_enabled() {
	$enabled = 'off' !== get_option( PERLA_CHILD_MOTION_OPTION, 'on' );

	// Pages are edited as they are: no animations in the Visual Builder or in the Customizer.
	// phpcs:ignore WordPress.Security.NonceVerification -- Only checks that the builder is open.
	if ( isset( $_GET['et_fb'] ) || ( function_exists( 'et_core_is_fb_enabled' ) && et_core_is_fb_enabled() ) || is_customize_preview() ) {
		$enabled = false;
	}

	/**
	 * Filters whether the scroll animations run on the current page.
	 *
	 * @param bool $enabled Whether the animations run.
	 */
	return (bool) apply_filters( 'perla_child_motion_enabled', $enabled );
}

/**
 * Tells whether the page scrolls smoothly with the mouse wheel. It is part of the animation
 * script, so it needs the animations.
 *
 * @return bool
 */
function perla_child_smooth_scroll_enabled() {
	$enabled = perla_child_motion_enabled() && 'off' !== get_option( PERLA_CHILD_SMOOTH_OPTION, 'on' );

	/**
	 * Filters whether the page scrolls smoothly with the mouse wheel.
	 *
	 * @param bool $enabled Whether smooth scrolling is on.
	 */
	return (bool) apply_filters( 'perla_child_smooth_scroll_enabled', $enabled );
}

/**
 * Marks the page as animated before anything is painted.
 *
 * The class "perla-motion" on <html> hides the elements that wait for their animation (see
 * style.css). It is not added for visitors who prefer reduced motion or when scripts are being
 * delayed by an optimisation plugin, and it is removed after 4 seconds if the animation script
 * has not started, so the content can never stay hidden.
 */
function perla_child_motion_head() {
	if ( ! perla_child_motion_enabled() ) {
		return;
	}

	wp_print_inline_script_tag(
		'(function(d,w){if(d.readyState!=="loading"||(w.matchMedia&&w.matchMedia("(prefers-reduced-motion: reduce)").matches)){return;}var c=d.documentElement.classList;c.add("perla-motion");w.perlaMotionTimer=setTimeout(function(){c.remove("perla-motion");},4000);})(document,window);',
		array( 'id' => 'perla-motion-init' )
	);
}
add_action( 'wp_head', 'perla_child_motion_head', 1 );

/**
 * Loads GSAP, Lenis and the animation script, deferred so they never block the page.
 */
function perla_child_motion_scripts() {
	if ( ! perla_child_motion_enabled() ) {
		return;
	}

	$base = get_stylesheet_directory_uri() . '/assets/js/';
	$args = array(
		'strategy'  => 'defer',
		'in_footer' => false,
	);

	wp_enqueue_script( 'perla-gsap', $base . 'vendor/gsap.min.js', array(), PERLA_CHILD_GSAP_VERSION, $args );
	wp_enqueue_script( 'perla-scrolltrigger', $base . 'vendor/ScrollTrigger.min.js', array( 'perla-gsap' ), PERLA_CHILD_GSAP_VERSION, $args );
	wp_enqueue_script( 'perla-splittext', $base . 'vendor/SplitText.min.js', array( 'perla-gsap' ), PERLA_CHILD_GSAP_VERSION, $args );

	$needs = array( 'perla-gsap', 'perla-scrolltrigger', 'perla-splittext' );
	if ( perla_child_smooth_scroll_enabled() ) {
		wp_enqueue_script( 'perla-lenis', $base . 'vendor/lenis.min.js', array(), PERLA_CHILD_LENIS_VERSION, $args );
		$needs[] = 'perla-lenis';
	}

	wp_enqueue_script( 'perla-motion', $base . 'perla-motion.js', $needs, PERLA_CHILD_VERSION, $args );
}
add_action( 'wp_enqueue_scripts', 'perla_child_motion_scripts', 20 );
