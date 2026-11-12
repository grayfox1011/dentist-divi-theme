<?php
/**
 * Builds the complete demo site on the local development environment: global colours and
 * design variables, pages, Theme Builder templates, the main menu and a few sample posts.
 *
 * Run through WP-CLI as an administrator (bin/setup.sh does this for you):
 *   wp --user=admin eval-file /project/tools/import-demo.php
 *
 * Everything is read from the same JSON files a customer imports by hand, and stored with
 * Divi's own functions. Running the script again updates the pages and leaves the rest alone.
 */

use ET\Builder\Packages\GlobalData\GlobalData;

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	exit;
}

if ( ! function_exists( 'et_theme_builder_store_template' ) || ! class_exists( GlobalData::class ) ) {
	WP_CLI::error( 'Divi 5 is not active. Install and activate Divi and the Perla child theme first.' );
}

/**
 * Reads one of the generated layout files.
 *
 * @param string $name File name inside the layouts folder.
 * @return array
 */
function perla_demo_read( $name ) {
	$file = "/project/layouts/$name";
	$data = is_readable( $file ) ? json_decode( file_get_contents( $file ), true ) : null;

	if ( ! is_array( $data ) ) {
		WP_CLI::error( "Could not read $file (run `npm run build` first)." );
	}

	return $data;
}

$perla_pages_file = perla_demo_read( 'Perla-1-All-Pages.json' );
$perla_theme_file = perla_demo_read( 'Perla-2-Theme-Builder.json' );

// ---------------------------------------------------------------------------------------------
// 1. Brand colours and fonts (normally applied when the child theme is activated).
// ---------------------------------------------------------------------------------------------
if ( function_exists( 'perla_child_apply_defaults' ) ) {
	perla_child_apply_defaults();
}

// ---------------------------------------------------------------------------------------------
// 2. Global colours and design variables, the same way Divi's importer stores them.
// ---------------------------------------------------------------------------------------------
$perla_customizer_colors = array_keys( GlobalData::$customizer_colors );
$perla_incoming_colors   = array();
foreach ( $perla_pages_file['global_colors'] as $perla_color ) {
	// The Customizer-linked colours are not part of the global colour list.
	if ( ! in_array( $perla_color[0], $perla_customizer_colors, true ) ) {
		$perla_incoming_colors[] = $perla_color;
	}
}

$perla_global_data     = et_get_option( 'et_global_data', array() );
$perla_existing_colors = is_array( $perla_global_data ) && ! empty( $perla_global_data['global_colors'] ) ? $perla_global_data['global_colors'] : array();
GlobalData::set_global_colors( array_merge( $perla_existing_colors, GlobalData::get_imported_global_colors( $perla_incoming_colors ) ), true );
GlobalData::import_global_variables( $perla_pages_file['global_variables'] );
WP_CLI::log( sprintf( 'Imported %d global colours and %d design variables.', count( $perla_incoming_colors ), count( $perla_pages_file['global_variables'] ) ) );

// ---------------------------------------------------------------------------------------------
// 3. Pages.
// ---------------------------------------------------------------------------------------------
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
foreach ( $perla_pages_file['data'] as $perla_layout ) {
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

if ( isset( $perla_ids['home'] ) ) {
	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $perla_ids['home'] );
}

// ---------------------------------------------------------------------------------------------
// 4. Theme Builder: header, footer, blog post template and 404 page.
// ---------------------------------------------------------------------------------------------
$perla_theme_builder_id = et_theme_builder_get_theme_builder_post_id( true, true );

// Create the layouts, or refresh their content when they already exist.
$perla_layout_ids = array();
foreach ( $perla_theme_file['layouts'] as $perla_old_id => $perla_layout ) {
	$perla_found = get_posts(
		array(
			'post_type'   => $perla_layout['post_type'],
			'title'       => $perla_layout['post_title'],
			'post_status' => 'publish',
			'numberposts' => 1,
			'fields'      => 'ids',
		)
	);
	$perla_content = wp_slash( reset( $perla_layout['data'] ) );

	if ( $perla_found ) {
		$perla_new_id = $perla_found[0];
		wp_update_post(
			array(
				'ID'           => $perla_new_id,
				'post_content' => $perla_content,
			)
		);
	} else {
		$perla_new_id = et_theme_builder_insert_layout(
			array(
				'post_type'    => $perla_layout['post_type'],
				'post_title'   => $perla_layout['post_title'],
				'post_content' => $perla_content,
			)
		);
	}

	if ( is_wp_error( $perla_new_id ) ) {
		WP_CLI::warning( 'Could not store layout ' . $perla_layout['post_title'] . ': ' . $perla_new_id->get_error_message() );
		continue;
	}

	foreach ( $perla_layout['post_meta'] as $perla_meta ) {
		update_post_meta( $perla_new_id, $perla_meta['key'], $perla_meta['value'] );
	}
	$perla_layout_ids[ (int) $perla_old_id ] = $perla_new_id;
	WP_CLI::log( ( $perla_found ? 'Updated' : 'Created' ) . ' Theme Builder layout: ' . $perla_layout['post_title'] );
}

// Create the templates once and attach them to the Theme Builder.
if ( get_post_meta( $perla_theme_builder_id, '_et_template', false ) ) {
	WP_CLI::log( 'Theme Builder templates already exist: assignments left untouched.' );
} else {
	$perla_has_default = false;
	foreach ( $perla_theme_file['templates'] as $perla_template ) {
		foreach ( array( 'header', 'body', 'footer' ) as $perla_area ) {
			$perla_old = (int) $perla_template['layouts'][ $perla_area ]['id'];
			$perla_template['layouts'][ $perla_area ]['id'] = isset( $perla_layout_ids[ $perla_old ] ) ? $perla_layout_ids[ $perla_old ] : 0;
		}
		// Divi's own function expects these flags as '1' / '0' strings.
		foreach ( array( 'default', 'enabled', 'autogenerated_title' ) as $perla_flag ) {
			$perla_template[ $perla_flag ] = ! empty( $perla_template[ $perla_flag ] ) ? '1' : '0';
		}

		$perla_template_id = et_theme_builder_store_template( $perla_theme_builder_id, $perla_template, ! $perla_has_default );
		if ( $perla_template_id ) {
			add_post_meta( $perla_theme_builder_id, '_et_template', $perla_template_id );
			$perla_has_default = $perla_has_default || '1' === $perla_template['default'];
			WP_CLI::log( 'Created Theme Builder template: ' . $perla_template['title'] );
		}
	}
}

// ---------------------------------------------------------------------------------------------
// 5. Main menu.
// ---------------------------------------------------------------------------------------------
$perla_menu_name = 'Main Menu';
if ( ! wp_get_nav_menu_object( $perla_menu_name ) ) {
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

// ---------------------------------------------------------------------------------------------
// 6. Sample posts with placeholder images, so the Blog module has something to show.
// ---------------------------------------------------------------------------------------------
$perla_posts = array(
	'How often should you really visit the dentist?' => 'Most people benefit from a check-up and professional cleaning every six months. Regular visits let us spot small problems before they become big ones, and keep your gums healthy.',
	'Teeth whitening: what to expect from your first session' => 'Professional whitening is quick, safe and comfortable. Here is how the treatment works, how long the results last and how to look after your brighter smile.',
	'Five habits for healthier gums' => 'Healthy gums are the foundation of a healthy smile. A few small changes to your daily routine can make a real difference.',
);
if ( (int) wp_count_posts( 'post' )->publish <= 1 ) {
	require_once ABSPATH . 'wp-admin/includes/image.php';

	$perla_category = wp_create_category( 'Oral health' );
	$perla_index    = 0;
	foreach ( $perla_posts as $perla_title => $perla_text ) {
		++$perla_index;
		$perla_post_id = wp_insert_post(
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

		// Featured image: a placeholder shipped with the development tools.
		$perla_image = "/project/tools/demo-images/blog-$perla_index.jpg";
		if ( $perla_post_id && ! is_wp_error( $perla_post_id ) && is_readable( $perla_image ) ) {
			$perla_upload = wp_upload_bits( "perla-blog-$perla_index.jpg", null, file_get_contents( $perla_image ) );
			if ( empty( $perla_upload['error'] ) ) {
				$perla_attachment = wp_insert_attachment(
					array(
						'post_mime_type' => 'image/jpeg',
						'post_title'     => "Blog placeholder $perla_index",
						'post_status'    => 'inherit',
					),
					$perla_upload['file'],
					$perla_post_id
				);
				wp_update_attachment_metadata( $perla_attachment, wp_generate_attachment_metadata( $perla_attachment, $perla_upload['file'] ) );
				set_post_thumbnail( $perla_post_id, $perla_attachment );
			}
		}
	}
	WP_CLI::log( 'Created sample blog posts.' );
}

// Divi caches the CSS it generates for each page; start from a clean slate.
if ( class_exists( 'ET_Core_PageResource' ) ) {
	ET_Core_PageResource::remove_static_resources( 'all', 'all' );
}

WP_CLI::success( 'Demo site is ready.' );
