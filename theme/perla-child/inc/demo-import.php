<?php
/**
 * Demo site importer.
 *
 * Builds the demo site from the files in /demo with WordPress' and Divi's own functions:
 * pages and their photos, design variables, Theme Builder templates, the main menu and a few
 * sample posts.
 *
 * The importer only adds what is missing. Pages, menus, templates and settings that already
 * exist on the site are never overwritten or deleted, so it is safe to run more than once.
 *
 * @package perla-child
 */

use ET\Builder\Packages\GlobalData\GlobalData;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Meta key that marks everything the importer creates. */
define( 'PERLA_CHILD_DEMO_META', '_perla_demo' );

/**
 * Reads one of the JSON files in /demo.
 *
 * @param string $name File name.
 * @return array|null
 */
function perla_child_demo_read( $name ) {
	$file = get_stylesheet_directory() . '/demo/' . $name;
	$data = is_readable( $file ) ? json_decode( file_get_contents( $file ), true ) : null; // phpcs:ignore WordPress.WP.AlternativeFunctions -- Local file.

	return is_array( $data ) ? $data : null;
}

/**
 * Checks that the site can receive the demo content.
 *
 * @return string An explanation for the site owner, or an empty string when everything is fine.
 */
function perla_child_demo_requirements() {
	$has_divi = function_exists( 'et_get_option' )
		&& function_exists( 'et_theme_builder_get_theme_builder_post_id' )
		&& function_exists( 'et_theme_builder_insert_layout' )
		&& function_exists( 'et_theme_builder_store_template' )
		&& class_exists( GlobalData::class )
		&& method_exists( GlobalData::class, 'import_global_variables' );

	if ( ! $has_divi ) {
		return __( 'Perla needs the Divi theme, version 5.4 or newer. Install or update Divi, then open this page again.', 'perla-child' );
	}

	foreach ( array( 'manifest.json', 'pages.json', 'theme-builder.json' ) as $name ) {
		if ( ! is_readable( get_stylesheet_directory() . '/demo/' . $name ) ) {
			/* translators: %s: file name. */
			return sprintf( __( 'A file of the theme is missing: demo/%s. Install the theme again from the zip you downloaded.', 'perla-child' ), $name );
		}
	}

	return '';
}

/**
 * Tells whether the site already uses Divi's Theme Builder.
 *
 * @return bool
 */
function perla_child_demo_theme_builder_in_use() {
	$builder_id = et_theme_builder_get_theme_builder_post_id( true, false );

	return $builder_id && get_post_meta( $builder_id, '_et_template', false );
}

/**
 * Finds a post the importer created earlier.
 *
 * @param string|string[] $post_type Post type(s).
 * @param string          $mark      Value of the importer's meta key.
 * @return int Post ID, or 0.
 */
function perla_child_demo_find( $post_type, $mark ) {
	$found = get_posts(
		array(
			'post_type'      => $post_type,
			'post_status'    => 'any',
			'meta_key'       => PERLA_CHILD_DEMO_META, // phpcs:ignore WordPress.DB.SlowDBQuery -- Runs only during set-up.
			'meta_value'     => $mark, // phpcs:ignore WordPress.DB.SlowDBQuery -- Runs only during set-up.
			'posts_per_page' => 1,
			'orderby'        => 'ID',
			'order'          => 'ASC',
			'fields'         => 'ids',
		)
	);

	return $found ? (int) $found[0] : 0;
}

/**
 * Makes an address safe to write into the settings of a Divi module, the way WordPress does
 * when it saves a block.
 *
 * @param string $url Address.
 * @return string
 */
function perla_child_demo_escape( $url ) {
	return str_replace( array( '--', '&' ), array( '\\u002d\\u002d', '\\u0026' ), $url );
}

/**
 * Counts what happens to the demo photos during one set-up, for the report.
 *
 * @param string $what 'added' or 'failed'.
 * @param int    $add  How many to add to the count.
 * @return int The count so far.
 */
function perla_child_demo_photo_count( $what, $add = 0 ) {
	static $counts = array(
		'added'  => 0,
		'failed' => 0,
	);

	$counts[ $what ] += $add;

	return $counts[ $what ];
}

/**
 * Adds one of the demo photos of the theme to the Media Library, or finds it there.
 *
 * The file is copied as it is. No smaller sizes are generated, so the set-up stays quick on
 * any hosting: the photos are already as small as the layouts need them.
 *
 * @param string $file      File name in /demo/images.
 * @param int    $parent_id Optional. Post the photo belongs to.
 * @return array|null ID and address of the attachment, or null when the photo could not be added.
 */
function perla_child_demo_photo( $file, $parent_id = 0 ) {
	static $details = null;
	static $photos  = array();

	if ( array_key_exists( $file, $photos ) ) {
		return $photos[ $file ];
	}

	if ( null === $details ) {
		$details  = array();
		$manifest = perla_child_demo_read( 'manifest.json' );
		foreach ( isset( $manifest['photos'] ) ? $manifest['photos'] : array() as $photo ) {
			$details[ $photo['file'] ] = $photo;
		}
	}

	$photos[ $file ] = null;
	$mark            = 'image:' . $file;
	$id              = perla_child_demo_find( 'attachment', $mark );

	// A photo whose file has been deleted from the server is added again.
	if ( $id && ! file_exists( (string) get_attached_file( $id ) ) ) {
		$id = 0;
	}

	if ( ! $id ) {
		$source = get_stylesheet_directory() . '/demo/images/' . $file;
		$upload = is_readable( $source ) ? wp_upload_bits( 'perla-' . $file, null, file_get_contents( $source ) ) : null; // phpcs:ignore WordPress.WP.AlternativeFunctions -- Local file.
		$type   = $upload && empty( $upload['error'] ) ? wp_check_filetype( $upload['file'] ) : null;
		$size   = $type ? wp_getimagesize( $upload['file'] ) : null;

		if ( ! $size || empty( $type['type'] ) ) {
			perla_child_demo_photo_count( 'failed', 1 );
			return null;
		}

		$title = isset( $details[ $file ]['title'] ) ? $details[ $file ]['title'] : $file;
		$id    = wp_insert_attachment(
			array(
				'post_mime_type' => $type['type'],
				'post_title'     => $title,
				// Its own address, so the photo never takes one a page may want ("/team/").
				'post_name'      => 'perla-photo-' . pathinfo( $file, PATHINFO_FILENAME ),
				'post_content'   => isset( $details[ $file ]['credit'] ) ? $details[ $file ]['credit'] : '',
				'post_status'    => 'inherit',
			),
			$upload['file'],
			$parent_id
		);

		if ( ! $id || is_wp_error( $id ) ) {
			perla_child_demo_photo_count( 'failed', 1 );
			return null;
		}

		wp_update_attachment_metadata(
			$id,
			array(
				'width'    => (int) $size[0],
				'height'   => (int) $size[1],
				'file'     => get_post_meta( $id, '_wp_attached_file', true ),
				'filesize' => wp_filesize( $upload['file'] ),
				'sizes'    => array(),
			)
		);
		update_post_meta( $id, '_wp_attachment_image_alt', $title );
		update_post_meta( $id, PERLA_CHILD_DEMO_META, $mark );
		perla_child_demo_photo_count( 'added', 1 );
	}

	$photos[ $file ] = array(
		'id'  => (int) $id,
		'url' => wp_get_attachment_url( $id ),
	);

	return $photos[ $file ];
}

/**
 * Points the pictures of a layout to their copies in the Media Library.
 *
 * The layouts are saved with the address of each photo inside the theme folder. WordPress
 * needs the Media Library copy to know the size of a picture and to load it lazily. A photo
 * that cannot be copied there keeps being shown from the theme folder.
 *
 * @param string $markup Divi layout.
 * @return string
 */
function perla_child_demo_place_photos( $markup ) {
	$result = preg_replace_callback(
		'~"src":"/wp-content/themes/perla-child/demo/images/([a-z0-9-]+\.jpg)"~',
		static function ( $match ) {
			$photo = perla_child_demo_photo( $match[1] );

			if ( $photo ) {
				return '"src":"' . perla_child_demo_escape( $photo['url'] ) . '","id":"' . $photo['id'] . '"';
			}

			return '"src":"' . perla_child_demo_escape( get_stylesheet_directory_uri() . '/demo/images/' . $match[1] ) . '"';
		},
		$markup
	);

	return is_string( $result ) ? $result : $markup;
}

/**
 * Maps the addresses used by the demo buttons ("/contact/") to the real addresses on this site.
 *
 * They only differ when WordPress lives in a sub-folder, uses plain permalinks, or a page had
 * to take a different address.
 *
 * @param array $manifest Demo manifest.
 * @param int[] $ids      Page key => page ID.
 * @return string[] Demo address => address on this site.
 */
function perla_child_demo_links( $manifest, $ids ) {
	$links = array( '/' => wp_make_link_relative( home_url( '/' ) ) );

	foreach ( $manifest['pages'] as $page ) {
		if ( empty( $page['front'] ) && isset( $ids[ $page['key'] ] ) ) {
			$path           = '/' . ltrim( $page['parent'] . '/' . $page['slug'], '/' ) . '/';
			$links[ $path ] = wp_make_link_relative( get_permalink( $ids[ $page['key'] ] ) );
		}
	}

	return $links;
}

/**
 * Points the links of a layout to the addresses of this site.
 *
 * @param string   $markup Divi layout.
 * @param string[] $links  See perla_child_demo_links().
 * @return string
 */
function perla_child_demo_localize( $markup, $links ) {
	$home = $links['/'];

	if ( '/' === $home && array_keys( $links ) === array_values( $links ) ) {
		return $markup;
	}

	// Links are stored as "linkUrl":"/contact/" (buttons, cards) or as href attributes in text.
	$result = preg_replace_callback(
		'~("linkUrl":"|href=\\\\u0022)(/[^"\\\\]*)~',
		static function ( $match ) use ( $links, $home ) {
			$link = isset( $links[ $match[2] ] ) ? $links[ $match[2] ] : $home . ltrim( $match[2], '/' );

			return $match[1] . perla_child_demo_escape( $link );
		},
		$markup
	);

	return is_string( $result ) ? $result : $markup;
}

/**
 * Creates the pages and sets the front page.
 *
 * @param array $manifest Demo manifest.
 * @param array $file     Contents of pages.json.
 * @param bool  $update   Also refresh pages the importer created earlier.
 * @param array $report   Import report.
 * @return array Page IDs by key, and the link map.
 */
function perla_child_demo_import_pages( $manifest, $file, $update, &$report ) {
	$layouts = array();
	foreach ( $file['data'] as $layout ) {
		$layouts[ $layout['post_name'] ] = $layout['post_content'];
	}

	$ids      = array(); // Page key => ID of the page at that address (ours or the site owner's).
	$saved    = array(); // Page key => content this run has to keep up to date.
	$top      = array(); // Slug of a top-level page => ID, to attach its child pages.
	$titles   = array();
	$restored = array();

	foreach ( $manifest['pages'] as $page ) {
		if ( ! isset( $layouts[ $page['layout'] ] ) ) {
			continue;
		}

		$key  = $page['key'];
		$path = ltrim( $page['parent'] . '/' . $page['slug'], '/' );
		$id   = perla_child_demo_find( 'page', 'page:' . $key );
		$ours = (bool) $id;

		if ( $ours && $update ) {
			$layouts[ $page['layout'] ] = perla_child_demo_place_photos( $layouts[ $page['layout'] ] );
			$saved[ $key ]              = '';
			$restored[]                 = $page['title'];
		}

		if ( ! $id ) {
			$existing = get_page_by_path( $path );

			if ( $existing ) {
				$id = (int) $existing->ID;
				/* translators: 1: page title, 2: page address. */
				$report['kept'][] = sprintf( __( 'Page "%1$s": your site already has a page at /%2$s/, so it was left as it is.', 'perla-child' ), $page['title'], $path );
			} else {
				$layouts[ $page['layout'] ] = perla_child_demo_place_photos( $layouts[ $page['layout'] ] );

				// wp_slash() keeps the \uXXXX escapes of the Divi markup intact.
				$id = wp_insert_post(
					wp_slash(
						array(
							'post_type'    => 'page',
							'post_status'  => 'publish',
							'post_title'   => $page['title'],
							'post_name'    => $page['slug'],
							'post_parent'  => isset( $top[ $page['parent'] ] ) ? $top[ $page['parent'] ] : 0,
							'post_content' => $layouts[ $page['layout'] ],
						)
					),
					true
				);

				if ( is_wp_error( $id ) ) {
					/* translators: 1: page title, 2: error message. */
					$report['notes'][] = sprintf( __( 'Page "%1$s" could not be created: %2$s', 'perla-child' ), $page['title'], $id->get_error_message() );
					continue;
				}

				// Built with the Divi 5 builder, full width.
				update_post_meta( $id, PERLA_CHILD_DEMO_META, 'page:' . $key );
				update_post_meta( $id, '_et_pb_use_builder', 'on' );
				update_post_meta( $id, '_et_pb_use_divi_5', 'on' );
				update_post_meta( $id, '_et_pb_page_layout', 'et_full_width_page' );

				$ours          = true;
				$saved[ $key ] = $layouts[ $page['layout'] ];
				$titles[]      = $page['title'];
			}
		}

		$ids[ $key ] = $id;
		if ( '' === $page['parent'] ) {
			$top[ $page['slug'] ] = $id;
		}

		// Front page: only when the site does not have a static front page yet.
		if ( $ours && ! empty( $page['front'] ) && ! ( 'page' === get_option( 'show_on_front' ) && get_option( 'page_on_front' ) ) ) {
			update_option( 'show_on_front', 'page' );
			update_option( 'page_on_front', $id );
			/* translators: %s: page title. */
			$report['created'][] = sprintf( __( 'Front page set to "%s"', 'perla-child' ), $page['title'] );
		}
	}

	if ( $titles ) {
		/* translators: %s: list of page titles. */
		array_unshift( $report['created'], sprintf( __( 'Pages: %s', 'perla-child' ), implode( ', ', $titles ) ) );
	}
	if ( $restored ) {
		/* translators: %s: list of page titles. */
		$report['created'][] = sprintf( __( 'Pages restored to the design of the theme: %s', 'perla-child' ), implode( ', ', $restored ) );
	}

	// Point the buttons to the real addresses of the pages.
	$links = perla_child_demo_links( $manifest, $ids );
	foreach ( $manifest['pages'] as $page ) {
		$key = $page['key'];
		if ( ! isset( $saved[ $key ] ) ) {
			continue;
		}

		$content = perla_child_demo_localize( $layouts[ $page['layout'] ], $links );
		if ( $content !== $saved[ $key ] ) {
			wp_update_post(
				wp_slash(
					array(
						'ID'           => $ids[ $key ],
						'post_content' => $content,
					)
				)
			);
		}
	}

	return array( $ids, $links );
}

/**
 * Adds the global colours and the design variables (Variable Manager) used by the layouts.
 *
 * Colours and variables the site already has keep their current values, so the clinic details
 * and the palette are not reset when the importer runs again.
 *
 * @param array    $file   Contents of pages.json.
 * @param string[] $links  See perla_child_demo_links().
 * @param bool     $update Overwrite existing values with the ones in the file.
 * @param array    $report Import report.
 */
function perla_child_demo_import_design( $file, $links, $update, &$report ) {
	// The primary, secondary, heading, body and link colours live in the Theme Customizer:
	// perla_child_apply_defaults() takes care of them.
	$customizer = array( 'gcid-primary-color', 'gcid-secondary-color', 'gcid-heading-color', 'gcid-body-color', 'gcid-link-color' );
	$stored     = maybe_unserialize( et_get_option( 'et_global_data', array() ) );
	$existing   = is_array( $stored ) && ! empty( $stored['global_colors'] ) && is_array( $stored['global_colors'] ) ? $stored['global_colors'] : array();
	$colors     = array();

	foreach ( $file['global_colors'] as $color ) {
		if ( in_array( $color[0], $customizer, true ) || ( ! $update && isset( $existing[ $color[0] ] ) ) ) {
			continue;
		}
		$colors[] = $color;
	}

	if ( $colors ) {
		GlobalData::set_global_colors( array_merge( $existing, GlobalData::get_imported_global_colors( $colors ) ), true );
	}

	$known = array();
	foreach ( GlobalData::get_global_variables() as $group ) {
		foreach ( (array) $group as $id => $variable ) {
			$known[ $id ] = true;
		}
	}

	$variables = array();
	foreach ( $file['global_variables'] as $variable ) {
		if ( ! $update && isset( $known[ $variable['id'] ] ) ) {
			continue;
		}
		if ( 'links' === $variable['type'] && isset( $links[ $variable['value'] ] ) ) {
			$variable['value'] = $links[ $variable['value'] ];
		}
		$variables[] = $variable;
	}

	if ( $variables ) {
		$error = null;
		GlobalData::import_global_variables( $variables, $error );

		if ( is_wp_error( $error ) ) {
			/* translators: %s: error message. */
			$report['notes'][] = sprintf( __( 'The design variables could not be saved: %s', 'perla-child' ), $error->get_error_message() );
			return;
		}
	}

	if ( $colors || $variables ) {
		$report['created'][] = __( 'Colours and design variables: clinic name, phone, email, address, spacing and text sizes', 'perla-child' );
	}
}

/**
 * Creates the Theme Builder layouts and templates: global header and footer, blog post, 404 page.
 *
 * @param array    $file   Contents of theme-builder.json.
 * @param string[] $links  See perla_child_demo_links().
 * @param bool     $update Also refresh layouts the importer created earlier.
 * @param array    $report Import report.
 */
function perla_child_demo_import_theme_builder( $file, $links, $update, &$report ) {
	$in_use     = perla_child_demo_theme_builder_in_use();
	$layout_ids = array(); // Layout ID in the file => layout ID on this site.
	$installed  = false;

	// Divi marks every Theme Builder layout with the "layout" type of its library, but registers
	// that taxonomy only on the screens of the builder. Make sure it exists for this request.
	if ( ! taxonomy_exists( 'layout_type' ) ) {
		register_taxonomy(
			'layout_type',
			'et_pb_layout',
			array(
				'public'  => false,
				'rewrite' => false,
			)
		);
	}

	foreach ( $file['layouts'] as $file_id => $layout ) {
		$mark    = 'layout:' . $file_id;
		$id      = perla_child_demo_find( $layout['post_type'], $mark );
		$content = wp_slash( perla_child_demo_localize( reset( $layout['data'] ), $links ) );

		if ( $id ) {
			$installed = true;
			if ( $update ) {
				wp_update_post(
					array(
						'ID'           => $id,
						'post_content' => $content,
					)
				);
			}
		} elseif ( ! $in_use ) {
			$id = et_theme_builder_insert_layout(
				array(
					'post_type'    => $layout['post_type'],
					'post_title'   => $layout['post_title'],
					'post_content' => $content,
				)
			);

			if ( is_wp_error( $id ) ) {
				/* translators: 1: layout title, 2: error message. */
				$report['notes'][] = sprintf( __( 'Layout "%1$s" could not be created: %2$s', 'perla-child' ), $layout['post_title'], $id->get_error_message() );
				continue;
			}

			foreach ( $layout['post_meta'] as $meta ) {
				update_post_meta( $id, $meta['key'], $meta['value'] );
			}
			update_post_meta( $id, PERLA_CHILD_DEMO_META, $mark );
		}

		if ( $id ) {
			$layout_ids[ (int) $file_id ] = (int) $id;
		}
	}

	if ( $installed && $update ) {
		$report['created'][] = __( 'Header, footer, blog post template and 404 page restored to the design of the theme', 'perla-child' );
	}

	if ( $in_use ) {
		if ( ! $installed ) {
			$report['kept'][] = __( 'Header and footer: your site already has Theme Builder templates, so they were left as they are. To add the Perla ones, import the file Perla-Theme-Builder-Templates.json of your download in Divi > Theme Builder > Portability.', 'perla-child' );
		}
		return;
	}

	// Templates say where each layout is used. Divi expects their flags as '1' / '0' strings.
	$builder_id  = et_theme_builder_get_theme_builder_post_id( true, true );
	$has_default = false;

	foreach ( $file['templates'] as $template ) {
		foreach ( array( 'header', 'body', 'footer' ) as $area ) {
			$file_id                              = (int) $template['layouts'][ $area ]['id'];
			$template['layouts'][ $area ]['id'] = isset( $layout_ids[ $file_id ] ) ? $layout_ids[ $file_id ] : 0;
		}
		foreach ( array( 'default', 'enabled', 'autogenerated_title' ) as $flag ) {
			$template[ $flag ] = empty( $template[ $flag ] ) ? '0' : '1';
		}

		$template_id = et_theme_builder_store_template( $builder_id, $template, ! $has_default );
		if ( $template_id ) {
			add_post_meta( $builder_id, '_et_template', $template_id );
			$has_default = $has_default || '1' === $template['default'];
		}
	}

	$report['created'][] = __( 'Header, footer, blog post template and 404 page (Divi > Theme Builder)', 'perla-child' );
}

/**
 * Creates the main menu and shows it in the header, unless the site already has a primary menu.
 *
 * @param array $manifest Demo manifest.
 * @param int[] $ids      Page key => page ID.
 * @param array $report   Import report.
 */
function perla_child_demo_import_menu( $manifest, $ids, &$report ) {
	$locations = get_theme_mod( 'nav_menu_locations', array() );
	$locations = is_array( $locations ) ? $locations : array();

	if ( ! empty( $locations['primary-menu'] ) && is_nav_menu( $locations['primary-menu'] ) ) {
		if ( ! get_term_meta( (int) $locations['primary-menu'], PERLA_CHILD_DEMO_META, true ) ) {
			$report['kept'][] = __( 'Menu: your site already has a primary menu, so it was left as it is. Add the new pages to it in Appearance > Menus.', 'perla-child' );
		}
		return;
	}

	$menu_id = wp_create_nav_menu( 'Main Menu' );
	if ( is_wp_error( $menu_id ) ) {
		// The name is taken: use our own.
		$existing = wp_get_nav_menu_object( 'Perla Main Menu' );
		$menu_id  = $existing ? (int) $existing->term_id : wp_create_nav_menu( 'Perla Main Menu' );
	}

	if ( is_wp_error( $menu_id ) ) {
		/* translators: %s: error message. */
		$report['notes'][] = sprintf( __( 'The menu could not be created: %s', 'perla-child' ), $menu_id->get_error_message() );
		return;
	}

	if ( ! wp_get_nav_menu_items( $menu_id ) ) {
		foreach ( $manifest['menu'] as $key ) {
			if ( empty( $ids[ $key ] ) ) {
				continue;
			}
			wp_update_nav_menu_item(
				$menu_id,
				0,
				array(
					'menu-item-object-id' => $ids[ $key ],
					'menu-item-object'    => 'page',
					'menu-item-type'      => 'post_type',
					'menu-item-status'    => 'publish',
				)
			);
		}
	}

	update_term_meta( $menu_id, PERLA_CHILD_DEMO_META, 'menu' );
	$locations['primary-menu'] = $menu_id;
	set_theme_mod( 'nav_menu_locations', $locations );

	$report['created'][] = __( 'Main menu, shown in the header', 'perla-child' );
}

/**
 * Creates a few sample posts with a photo each, so the blog sections have something to show.
 * Skipped on sites that already have posts of their own.
 *
 * @param array $manifest Demo manifest.
 * @param array $report   Import report.
 */
function perla_child_demo_import_posts( $manifest, &$report ) {
	if ( perla_child_demo_find( 'post', 'post' ) ) {
		return;
	}

	if ( (int) wp_count_posts( 'post' )->publish > 1 ) {
		$report['kept'][] = __( 'Blog: your site already has posts, so no sample posts were added.', 'perla-child' );
		return;
	}

	$category = term_exists( $manifest['category'], 'category' );
	$category = $category ? $category : wp_insert_term( $manifest['category'], 'category' );
	$category = is_array( $category ) ? (int) $category['term_id'] : 0;
	$created  = 0;
	$now      = time();

	foreach ( $manifest['posts'] as $index => $post ) {
		$post_id = wp_insert_post(
			wp_slash(
				array(
					'post_type'     => 'post',
					'post_status'   => 'publish',
					'post_title'    => $post['title'],
					'post_excerpt'  => $post['text'],
					'post_content'  => $post['content'],
					'post_category' => $category ? array( $category ) : array(),
					// One second apart, so the posts keep this order.
					'post_date'     => wp_date( 'Y-m-d H:i:s', $now - $index ),
				)
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			continue;
		}

		update_post_meta( $post_id, PERLA_CHILD_DEMO_META, 'post' );
		++$created;

		// Featured image: a demo photo shipped with the theme.
		$photo = perla_child_demo_photo( basename( $post['image'] ), $post_id );
		if ( $photo ) {
			set_post_thumbnail( $post_id, $photo['id'] );
		}
	}

	if ( $created ) {
		/* translators: %d: number of posts. */
		$report['created'][] = sprintf( __( '%d sample blog posts', 'perla-child' ), $created );
	}
}

/**
 * Builds the demo site.
 *
 * @param array $args {
 *     Optional.
 *
 *     @type bool $restore Also put the pages and Theme Builder layouts the importer created
 *                         earlier back to the versions in /demo. Changes made to them are lost.
 *     @type bool $update  The same, and the colours and design variables too. Used while
 *                         developing the theme.
 * }
 * @return array {
 *     Import report.
 *
 *     @type string   $error   Why the import could not run. Empty when it ran.
 *     @type string[] $created What was added to the site.
 *     @type string[] $kept    What already existed and was left as it was.
 *     @type string[] $notes   Single items that could not be created.
 * }
 */
function perla_child_import_demo( $args = array() ) {
	$design  = ! empty( $args['update'] );
	$content = $design || ! empty( $args['restore'] );
	$report  = array(
		'error'   => perla_child_demo_requirements(),
		'created' => array(),
		'kept'    => array(),
		'notes'   => array(),
	);

	if ( $report['error'] ) {
		return $report;
	}

	$manifest   = perla_child_demo_read( 'manifest.json' );
	$pages_file = perla_child_demo_read( 'pages.json' );
	$theme_file = perla_child_demo_read( 'theme-builder.json' );

	if ( ! $manifest || ! $pages_file || ! $theme_file ) {
		$report['error'] = __( 'The demo files of the theme could not be read. Install the theme again from the zip you downloaded.', 'perla-child' );
		return $report;
	}

	// The demo content ships with the theme, so it is saved exactly as it is, also for
	// administrators who may not post unfiltered HTML (multisite).
	kses_remove_filters();

	perla_child_apply_defaults();

	list( $ids, $links ) = perla_child_demo_import_pages( $manifest, $pages_file, $content, $report );
	perla_child_demo_import_design( $pages_file, $links, $design, $report );
	perla_child_demo_import_theme_builder( $theme_file, $links, $content, $report );
	perla_child_demo_import_menu( $manifest, $ids, $report );
	perla_child_demo_import_posts( $manifest, $report );

	kses_init();

	$photos = perla_child_demo_photo_count( 'added' );
	if ( $photos ) {
		/* translators: %d: number of photos. */
		$report['created'][] = sprintf( _n( '%d demo photo, in the Media Library', '%d demo photos, in the Media Library', $photos, 'perla-child' ), $photos );
	}
	if ( perla_child_demo_photo_count( 'failed' ) ) {
		$report['notes'][] = __( 'Some demo photos could not be copied to the Media Library, so the pages show them from the theme folder. Check that WordPress can write to the wp-content/uploads folder, then use "Restore the demo pages".', 'perla-child' );
	}

	// Divi caches the CSS it generates for each page: start from a clean slate.
	if ( class_exists( 'ET_Core_PageResource' ) ) {
		ET_Core_PageResource::remove_static_resources( 'all', 'all' );
	}

	return $report;
}
