<?php
/**
 * Perla – Dental Clinic (Divi 5 child theme).
 *
 * The design is delivered as Divi 5 layouts. The child theme loads its stylesheet, sets the
 * brand colours and fonts, and installs the demo site: pages, header and footer, menu and
 * sample posts (see inc/setup.php and Appearance > Perla Setup).
 *
 * @package perla-child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PERLA_CHILD_VERSION', '1.2.0' );

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
 * Apply the brand colours and fonts (see defaults.php), once.
 *
 * Divi keeps its primary, secondary, heading, body and link colours and its two fonts in the
 * Theme Customizer, and does not include them when layouts are imported.
 *
 * A setting is replaced only while it is empty or still holds the value Divi ships with:
 * colours and fonts the site owner has chosen are never overwritten.
 */
function perla_child_apply_defaults() {
	// Bump the number to apply the defaults once more after a change to this function.
	$applied = 'v2';

	if ( get_option( 'perla_child_defaults_applied' ) === $applied ) {
		return;
	}

	if ( ! function_exists( 'et_get_option' ) || ! function_exists( 'et_update_option' ) ) {
		return;
	}

	// The values Divi stores by itself, before anybody has chosen a colour or a font.
	$stock = array(
		'accent_color'           => array( '#2ea3f2' ),
		'secondary_accent_color' => array( '#8800ff', '#2ea3f2' ),
		'header_color'           => array( '#666666' ),
		'font_color'             => array( '#666666' ),
		'link_color'             => array( '#2ea3f2' ),
		'heading_font'           => array( 'none', 'open sans' ),
		'body_font'              => array( 'none', 'open sans' ),
		'body_font_size'         => array( '14' ),
	);

	$defaults = require get_stylesheet_directory() . '/defaults.php';
	$replaced = array();

	foreach ( $defaults as $name => $value ) {
		// The link colour follows the primary colour: keep it when the owner has their own primary.
		if ( 'link_color' === $name && ! isset( $replaced['accent_color'] ) ) {
			continue;
		}

		$current = strtolower( trim( (string) et_get_option( $name, '' ) ) );
		if ( '' === $current || ( isset( $stock[ $name ] ) && in_array( $current, $stock[ $name ], true ) ) ) {
			et_update_option( $name, $value );
			$replaced[ $name ] = true;
		}
	}

	// Divi caches the CSS it generates; clear it so the new colours and fonts show up.
	if ( class_exists( 'ET_Core_PageResource' ) ) {
		ET_Core_PageResource::remove_static_resources( 'all', 'all' );
	}

	update_option( 'perla_child_defaults_applied', $applied );
}
add_action( 'after_switch_theme', 'perla_child_apply_defaults' );

/**
 * Also apply them on the first dashboard visit, for sites where the theme files were replaced
 * while the theme was already active. Never while the theme is only previewed in the Customizer.
 */
function perla_child_maybe_apply_defaults() {
	if ( ! is_customize_preview() && current_user_can( 'manage_options' ) ) {
		perla_child_apply_defaults();
	}
}
add_action( 'admin_init', 'perla_child_maybe_apply_defaults', 5 );

// Scroll animations (GSAP).
require_once get_stylesheet_directory() . '/inc/motion.php';

// Demo site: automatic set-up and the Appearance > Perla Setup screen.
require_once get_stylesheet_directory() . '/inc/setup.php';
