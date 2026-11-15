<?php
/**
 * Perla
 *
 * @package Perla
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function perla_dog_tag() {
	return wp_get_theme( get_template() )->get( 'Version' );
}

function perla_shadow_moses() {
	add_editor_style( 'style.css' );
}
add_action( 'after_setup_theme', 'perla_shadow_moses' );

function perla_octocamo() {
	wp_enqueue_style( 'perla-style', get_parent_theme_file_uri( 'style.css' ), array(), perla_dog_tag() );
}
add_action( 'wp_enqueue_scripts', 'perla_octocamo' );

function perla_stealth_camo() {
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
add_action( 'init', 'perla_stealth_camo' );

function perla_codec() {
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
			'description' => __( 'Whole pages: Home, About, Treatments, Prices, Team, Contact and more.', 'perla' ),
		)
	);
}
add_action( 'init', 'perla_codec' );

// The address of a page of the site, found by its path. While that page does not exist the link leads nowhere.
function perla_soliton_radar( $path ) {
	if ( 'privacy-policy' === $path ) {
		return get_privacy_policy_url() ? get_privacy_policy_url() : '#';
	}

	$page = get_page_by_path( $path );

	if ( $page && 'publish' === $page->post_status ) {
		return get_permalink( $page );
	}

	return 'blog' === $path ? get_post_type_archive_link( 'post' ) : '#';
}

// True when the page chosen as homepage has content of its own: the front page then shows that page.
function perla_big_boss() {
	if ( 'page' !== get_option( 'show_on_front' ) ) {
		return false;
	}

	$home = get_post( (int) get_option( 'page_on_front' ) );

	return $home && '' !== trim( $home->post_content );
}

// Loads the before and after slider only on pages that have one.
function perla_psycho_mantis( $content, $block ) {
	if ( empty( $block['attrs']['className'] ) || false === strpos( $block['attrs']['className'], 'perla-compare' ) || wp_script_is( 'perla-compare' ) ) {
		return $content;
	}

	wp_enqueue_script(
		'perla-compare',
		get_parent_theme_file_uri( 'assets/js/compare.js' ),
		array(),
		perla_dog_tag(),
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);

	wp_add_inline_script(
		'perla-compare',
		'var perlaCompare = ' . wp_json_encode( array( 'label' => __( 'Drag to compare before and after', 'perla' ) ) ) . ';',
		'before'
	);

	return $content;
}
add_filter( 'render_block_core/group', 'perla_psycho_mantis', 10, 2 );

function perla_grey_fox( $value ) {
	return (bool) $value;
}

function perla_otacon( $wp_customize ) {
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
				'sanitize_callback' => 'perla_grey_fox',
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
add_action( 'customize_register', 'perla_otacon' );

function perla_liquid_snake() {
	if ( ! get_theme_mod( 'perla_motion', true ) ) {
		return;
	}

	$deps = array();

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
		$deps[] = 'lenis';
	}

	wp_enqueue_script(
		'perla-motion',
		get_parent_theme_file_uri( 'assets/js/motion.js' ),
		$deps,
		perla_dog_tag(),
		array(
			'strategy'  => 'defer',
			'in_footer' => false,
		)
	);

	// The class has to be on <html> before the first paint. If motion.js never starts, it comes off again after 4 seconds.
	wp_add_inline_script(
		'perla-motion',
		"(function(d,w){if(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches){return;}d.classList.add('perla-motion');w.setTimeout(function(){if(!d.classList.contains('perla-ready')){d.classList.remove('perla-motion');}},4000);})(document.documentElement,window);",
		'before'
	);
}
add_action( 'wp_enqueue_scripts', 'perla_liquid_snake' );
