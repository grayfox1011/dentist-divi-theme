<?php
/**
 * Perla functions and definitions.
 *
 * The look of the theme lives in theme.json, style.css and the patterns folder. This file
 * only registers what WordPress cannot find by itself: the stylesheet, a few block styles,
 * the pattern categories and the scroll animations with their two switches.
 *
 * @package Perla
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Version of the theme, used to refresh the browser cache after an update.
 *
 * @return string
 */
function perla_version() {
	return wp_get_theme( get_template() )->get( 'Version' );
}

/**
 * Shows the theme styles in the editor too, so the editor looks like the site.
 */
function perla_setup() {
	add_editor_style( 'style.css' );
}
add_action( 'after_setup_theme', 'perla_setup' );

/**
 * Loads the stylesheet on the site.
 */
function perla_enqueue_styles() {
	wp_enqueue_style( 'perla-style', get_parent_theme_file_uri( 'style.css' ), array(), perla_version() );
}
add_action( 'wp_enqueue_scripts', 'perla_enqueue_styles' );

/**
 * Adds the Perla looks to the "Styles" of a few core blocks.
 */
function perla_register_block_styles() {
	$styles = array(
		'core/paragraph'    => array( 'perla-eyebrow' => __( 'Eyebrow', 'perla' ) ),
		'core/list'         => array( 'perla-checks' => __( 'Check marks', 'perla' ) ),
		'core/button'       => array(
			'perla-light' => __( 'Light', 'perla' ),
			'perla-ghost' => __( 'Ghost', 'perla' ),
		),
		'core/details'      => array( 'perla-faq' => __( 'Card', 'perla' ) ),
		'core/social-links' => array( 'perla-social' => __( 'Outlined circles', 'perla' ) ),
	);

	foreach ( $styles as $block => $block_styles ) {
		foreach ( $block_styles as $name => $label ) {
			register_block_style(
				$block,
				array(
					'name'  => $name,
					'label' => $label,
				)
			);
		}
	}
}
add_action( 'init', 'perla_register_block_styles' );

/**
 * Groups the patterns of the theme in the inserter.
 */
function perla_register_pattern_categories() {
	register_block_pattern_category(
		'perla',
		array(
			'label'       => __( 'Perla sections', 'perla' ),
			'description' => __( 'Ready-made sections: hero, treatments, team, reviews, questions and more.', 'perla' ),
		)
	);

	register_block_pattern_category(
		'perla-pages',
		array(
			'label'       => __( 'Perla pages', 'perla' ),
			'description' => __( 'Whole pages: About, Treatments, a single treatment and Contact.', 'perla' ),
		)
	);
}
add_action( 'init', 'perla_register_pattern_categories' );

/**
 * Turns the value of a checkbox into true or false.
 *
 * @param mixed $value Value sent by the Customizer.
 * @return bool
 */
function perla_sanitize_checkbox( $value ) {
	return (bool) $value;
}

/**
 * Adds the two animation switches to Appearance > Customize.
 *
 * @param WP_Customize_Manager $wp_customize Customizer object.
 */
function perla_customize_register( $wp_customize ) {
	$wp_customize->add_section(
		'perla_motion',
		array(
			'title'       => __( 'Animations', 'perla' ),
			'description' => __( 'Visitors who ask their device for reduced motion never see the animations, whatever you choose here.', 'perla' ),
			'priority'    => 160,
		)
	);

	$switches = array(
		'perla_motion'        => __( 'Animate sections as they scroll into view', 'perla' ),
		'perla_smooth_scroll' => __( 'Smooth scrolling with the mouse wheel', 'perla' ),
	);

	foreach ( $switches as $id => $label ) {
		$wp_customize->add_setting(
			$id,
			array(
				'default'           => true,
				'sanitize_callback' => 'perla_sanitize_checkbox',
			)
		);

		$wp_customize->add_control(
			$id,
			array(
				'type'    => 'checkbox',
				'section' => 'perla_motion',
				'label'   => $label,
			)
		);
	}
}
add_action( 'customize_register', 'perla_customize_register' );

/**
 * Loads the scroll animations and, if wanted, the smooth scrolling.
 */
function perla_enqueue_motion() {
	if ( ! get_theme_mod( 'perla_motion', true ) ) {
		return;
	}

	$dependencies = array();

	if ( get_theme_mod( 'perla_smooth_scroll', true ) ) {
		wp_enqueue_script(
			'lenis',
			get_parent_theme_file_uri( 'assets/js/lenis.js' ),
			array(),
			'1.3.27',
			array(
				'strategy'  => 'defer',
				'in_footer' => false,
			)
		);
		$dependencies[] = 'lenis';
	}

	wp_enqueue_script(
		'perla-motion',
		get_parent_theme_file_uri( 'assets/js/motion.js' ),
		$dependencies,
		perla_version(),
		array(
			'strategy'  => 'defer',
			'in_footer' => false,
		)
	);

	/*
	 * The class has to be there before the page is drawn, or the sections would be visible
	 * for a moment and then hide to animate. If motion.js never starts, the class is taken
	 * away again after a few seconds so that nothing stays hidden.
	 */
	wp_add_inline_script(
		'perla-motion',
		"(function(d,w){if(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches){return;}d.classList.add('perla-motion');w.setTimeout(function(){if(!d.classList.contains('perla-ready')){d.classList.remove('perla-motion');}},4000);})(document.documentElement,window);",
		'before'
	);
}
add_action( 'wp_enqueue_scripts', 'perla_enqueue_motion' );
