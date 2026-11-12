<?php
/**
 * Perla – Dental Clinic (Divi 5 child theme).
 *
 * The design is delivered as Divi 5 layouts, so the child theme only loads its stylesheet and
 * sets the brand colours and fonts the first time it is activated.
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

/**
 * Apply the brand colours and fonts (see defaults.php) on first activation.
 *
 * Divi stores its primary, secondary, heading, body and link colours and its two fonts in the
 * Theme Customizer, and does not include them when layouts are imported. Settings the site
 * owner has already chosen are never overwritten.
 */
function perla_child_apply_defaults() {
	if ( get_option( 'perla_child_defaults_applied' ) ) {
		return;
	}

	if ( ! function_exists( 'et_get_option' ) || ! function_exists( 'et_update_option' ) ) {
		return;
	}

	$defaults = require get_stylesheet_directory() . '/defaults.php';

	foreach ( $defaults as $name => $value ) {
		if ( '' === (string) et_get_option( $name, '' ) ) {
			et_update_option( $name, $value );
		}
	}

	// Divi caches the CSS it generates; clear it so the new colours and fonts show up.
	if ( class_exists( 'ET_Core_PageResource' ) ) {
		ET_Core_PageResource::remove_static_resources( 'all', 'all' );
	}

	update_option( 'perla_child_defaults_applied', PERLA_CHILD_VERSION );
}
add_action( 'after_switch_theme', 'perla_child_apply_defaults' );
