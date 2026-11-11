<?php
/**
 * Creates the demo pages, the main menu and a few sample posts on the local development site.
 *
 * Run through WP-CLI as an administrator (bin/setup.sh does this for you):
 *   wp --user=admin eval-file /project/tools/import-demo.php
 *
 * The page content is the Divi 5 block markup taken from layouts/Perla-2-All-Pages.json.
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	exit;
}

$perla_file = '/project/layouts/Perla-2-All-Pages.json';
if ( ! is_readable( $perla_file ) ) {
	WP_CLI::error( "Layout file not found: $perla_file (run `npm run build` first)." );
}

$perla_export = json_decode( file_get_contents( $perla_file ), true );
if ( ! is_array( $perla_export ) || empty( $perla_export['data'] ) ) {
	WP_CLI::error( 'The layout file could not be read.' );
}

// Layout slug => array( page title, page slug, parent page slug ).
$perla_pages = array(
	'perla-home'           => array( 'Home', 'home', '' ),
	'perla-about'          => array( 'About', 'about', '' ),
	'perla-services'       => array( 'Services', 'services', '' ),
	'perla-service-single' => array( 'Dental Implants', 'dental-implants', 'services' ),
	'perla-blog'           => array( 'Blog', 'blog', '' ),
	'perla-contact'        => array( 'Contact', 'contact', '' ),
);

$perla_layouts = array();
foreach ( $perla_export['data'] as $perla_layout ) {
	$perla_layouts[ $perla_layout['post_name'] ] = $perla_layout['post_content'];
}

$perla_ids = array();
foreach ( $perla_pages as $perla_layout_slug => $perla_page ) {
	list( $perla_title, $perla_slug, $perla_parent ) = $perla_page;
	if ( ! isset( $perla_layouts[ $perla_layout_slug ] ) ) {
		WP_CLI::warning( "Layout missing in export: $perla_layout_slug" );
		continue;
	}

	$perla_path     = $perla_parent ? "$perla_parent/$perla_slug" : $perla_slug;
	$perla_existing = get_page_by_path( $perla_path );
	$perla_post     = array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => $perla_title,
		'post_name'    => $perla_slug,
		'post_parent'  => $perla_parent && isset( $perla_ids[ $perla_parent ] ) ? $perla_ids[ $perla_parent ] : 0,
		'post_content' => $perla_layouts[ $perla_layout_slug ],
	);
	if ( $perla_existing ) {
		$perla_post['ID'] = $perla_existing->ID;
	}

	// wp_slash() keeps the \uXXXX escapes of the block attributes intact.
	$perla_id = wp_insert_post( wp_slash( $perla_post ), true );
	if ( is_wp_error( $perla_id ) ) {
		WP_CLI::warning( "Could not create page $perla_title: " . $perla_id->get_error_message() );
		continue;
	}

	// Mark the page as built with the Divi 5 builder, full width.
	update_post_meta( $perla_id, '_et_pb_use_builder', 'on' );
	update_post_meta( $perla_id, '_et_pb_use_divi_5', 'on' );
	update_post_meta( $perla_id, '_et_pb_page_layout', 'et_full_width_page' );

	if ( get_post_field( 'post_content', $perla_id, 'raw' ) !== $perla_layouts[ $perla_layout_slug ] ) {
		WP_CLI::warning( "Content of \"$perla_title\" was altered while saving." );
	}

	$perla_ids[ $perla_slug ] = $perla_id;
	WP_CLI::log( ( $perla_existing ? 'Updated' : 'Created' ) . " page: $perla_title (/$perla_path/)" );
}

// Front page.
if ( isset( $perla_ids['home'] ) ) {
	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $perla_ids['home'] );
}

// Main menu.
$perla_menu_name = 'Main Menu';
$perla_menu      = wp_get_nav_menu_object( $perla_menu_name );
if ( ! $perla_menu ) {
	$perla_menu_id = wp_create_nav_menu( $perla_menu_name );
	foreach ( array( 'home', 'about', 'services', 'blog', 'contact' ) as $perla_slug ) {
		if ( isset( $perla_ids[ $perla_slug ] ) ) {
			wp_update_nav_menu_item(
				$perla_menu_id,
				0,
				array(
					'menu-item-object-id' => $perla_ids[ $perla_slug ],
					'menu-item-object'    => 'page',
					'menu-item-type'      => 'post_type',
					'menu-item-status'    => 'publish',
				)
			);
		}
	}
	$perla_locations                 = get_theme_mod( 'nav_menu_locations', array() );
	$perla_locations['primary-menu'] = $perla_menu_id;
	set_theme_mod( 'nav_menu_locations', $perla_locations );
	WP_CLI::log( "Created menu: $perla_menu_name" );
}

// Sample posts, so the Blog module has something to show.
$perla_posts = array(
	'How often should you really visit the dentist?' => 'Most people benefit from a check-up and professional cleaning every six months. Regular visits let us spot small problems before they become big ones, and keep your gums healthy.',
	'Teeth whitening: what to expect from your first session' => 'Professional whitening is quick, safe and comfortable. Here is how the treatment works, how long the results last and how to look after your brighter smile.',
	'Five habits for healthier gums' => 'Healthy gums are the foundation of a healthy smile. A few small changes to your daily routine can make a real difference.',
);
if ( (int) wp_count_posts( 'post' )->publish <= 1 ) {
	$perla_category = wp_create_category( 'Oral health' );
	foreach ( $perla_posts as $perla_title => $perla_text ) {
		wp_insert_post(
			wp_slash(
				array(
					'post_type'     => 'post',
					'post_status'   => 'publish',
					'post_title'    => $perla_title,
					'post_excerpt'  => $perla_text,
					'post_content'  => "<!-- wp:paragraph -->\n<p>$perla_text</p>\n<!-- /wp:paragraph -->",
					'post_category' => array( $perla_category ),
				)
			)
		);
	}
	WP_CLI::log( 'Created sample blog posts.' );
}

WP_CLI::success( 'Demo content is ready.' );
