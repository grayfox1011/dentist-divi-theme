<?php
/**
 * Perla – Dental Clinic (Divi 5 child theme).
 *
 * The design is delivered as Divi 5 layouts, so the child theme only has to load its stylesheet.
 *
 * @package perla-child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PERLA_CHILD_VERSION', '1.0.0' );

/**
 * Load the child theme stylesheet after Divi's own styles.
 */
function perla_child_enqueue_styles() {
	wp_enqueue_style(
		'perla-child',
		get_stylesheet_uri(),
		array(),
		PERLA_CHILD_VERSION
	);
}
add_action( 'wp_enqueue_scripts', 'perla_child_enqueue_styles', 20 );
