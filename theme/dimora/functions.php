<?php
/**
 * Dimora
 *
 * @package Dimora
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function dimora_dog_tag() {
	return wp_get_theme( get_template() )->get( 'Version' );
}

function dimora_shadow_moses() {
	add_editor_style( 'style.css' );
}
add_action( 'after_setup_theme', 'dimora_shadow_moses' );

function dimora_octocamo() {
	wp_enqueue_style( 'dimora-style', get_parent_theme_file_uri( 'style.css' ), array(), dimora_dog_tag() );
}
add_action( 'wp_enqueue_scripts', 'dimora_octocamo' );

function dimora_stealth_camo() {
	$styles = array(
		'core/paragraph' => array( 'dimora-label' => __( 'Small label', 'dimora' ) ),
		'core/list'      => array( 'dimora-dashes' => __( 'Dashes and lines', 'dimora' ) ),
		'core/details'   => array( 'dimora-row' => __( 'Numbered row', 'dimora' ) ),
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
add_action( 'init', 'dimora_stealth_camo' );

function dimora_codec() {
	register_block_pattern_category(
		'dimora',
		array(
			'label'       => __( 'Dimora sections', 'dimora' ),
			'description' => __( 'Ready-made sections: hero, projects, services, process, quote, questions and more.', 'dimora' ),
		)
	);

	register_block_pattern_category(
		'dimora-pages',
		array(
			'label'       => __( 'Dimora pages', 'dimora' ),
			'description' => __( 'Whole pages: Home, Projects, a project case study, Studio, Services and Contact.', 'dimora' ),
		)
	);
}
add_action( 'init', 'dimora_codec' );

// The address of a page of the site, found by its path. While that page does not exist the link leads nowhere.
function dimora_soliton_radar( $path ) {
	if ( 'privacy-policy' === $path ) {
		return get_privacy_policy_url() ? get_privacy_policy_url() : '#';
	}

	$page = get_page_by_path( $path );

	if ( $page && 'publish' === $page->post_status ) {
		return get_permalink( $page );
	}

	return 'journal' === $path ? get_post_type_archive_link( 'post' ) : '#';
}

// True when the page chosen as homepage has content of its own: the front page then shows that page.
function dimora_big_boss() {
	if ( 'page' !== get_option( 'show_on_front' ) ) {
		return false;
	}

	$home = get_post( (int) get_option( 'page_on_front' ) );

	return $home && '' !== trim( $home->post_content );
}

// Loads the drawing and room slider only on pages that have one.
function dimora_psycho_mantis( $content, $block ) {
	if ( empty( $block['attrs']['className'] ) || false === strpos( $block['attrs']['className'], 'dimora-compare' ) || wp_script_is( 'dimora-compare' ) ) {
		return $content;
	}

	wp_enqueue_script(
		'dimora-compare',
		get_parent_theme_file_uri( 'assets/js/compare.js' ),
		array(),
		dimora_dog_tag(),
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);

	wp_add_inline_script(
		'dimora-compare',
		'var dimoraCompare = ' . wp_json_encode( array( 'label' => __( 'Drag to compare the drawing and the room', 'dimora' ) ) ) . ';',
		'before'
	);

	return $content;
}
add_filter( 'render_block_core/group', 'dimora_psycho_mantis', 10, 2 );

// Loads the script that fits the name of the site to the width of the footer, where that large name is used.
function dimora_big_shell( $content, $block ) {
	if ( empty( $block['attrs']['className'] ) || false === strpos( $block['attrs']['className'], 'dimora-wordmark' ) || wp_script_is( 'dimora-fit' ) ) {
		return $content;
	}

	wp_enqueue_script(
		'dimora-fit',
		get_parent_theme_file_uri( 'assets/js/fit.js' ),
		array(),
		dimora_dog_tag(),
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);

	return $content;
}
add_filter( 'render_block_core/site-title', 'dimora_big_shell', 10, 2 );

function dimora_grey_fox( $value ) {
	return (bool) $value;
}

function dimora_otacon( $wp_customize ) {
	$wp_customize->add_section(
		'dimora_motion',
		array(
			'title'       => __( 'Animations', 'dimora' ),
			'description' => __( 'Visitors who ask their device for reduced motion never see the animations, whatever you choose here.', 'dimora' ),
			'priority'    => 160,
		)
	);

	$switches = array(
		'dimora_motion'        => __( 'Animate sections as they scroll into view', 'dimora' ),
		'dimora_smooth_scroll' => __( 'Smooth scrolling with the mouse wheel', 'dimora' ),
	);

	foreach ( $switches as $id => $label ) {
		$wp_customize->add_setting(
			$id,
			array(
				'default'           => true,
				'sanitize_callback' => 'dimora_grey_fox',
			)
		);

		$wp_customize->add_control(
			$id,
			array(
				'type'    => 'checkbox',
				'section' => 'dimora_motion',
				'label'   => $label,
			)
		);
	}
}
add_action( 'customize_register', 'dimora_otacon' );

function dimora_liquid_snake() {
	if ( ! get_theme_mod( 'dimora_motion', true ) ) {
		return;
	}

	$deps = array();

	if ( get_theme_mod( 'dimora_smooth_scroll', true ) ) {
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
		'dimora-motion',
		get_parent_theme_file_uri( 'assets/js/motion.js' ),
		$deps,
		dimora_dog_tag(),
		array(
			'strategy'  => 'defer',
			'in_footer' => false,
		)
	);

	// The class has to be on <html> before the first paint. If motion.js never starts, it comes off again after 4 seconds.
	wp_add_inline_script(
		'dimora-motion',
		'var dimoraMotion = ' . wp_json_encode( array( 'view' => __( 'View', 'dimora' ) ) ) . ';' .
		"(function(d,w){if(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches){return;}d.classList.add('dimora-motion');w.setTimeout(function(){if(!d.classList.contains('dimora-ready')){d.classList.remove('dimora-motion');}},4000);})(document.documentElement,window);",
		'before'
	);

	// A soft cross-fade from one page to the next, in browsers that can do it.
	wp_add_inline_style(
		'dimora-style',
		'@media (prefers-reduced-motion: no-preference){@view-transition{navigation:auto}::view-transition-old(root){animation-duration:.3s}::view-transition-new(root){animation-duration:.5s}}'
	);
}
add_action( 'wp_enqueue_scripts', 'dimora_liquid_snake', 20 );
