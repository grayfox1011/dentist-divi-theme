<?php
/**
 * Fills the local test site, so every template has something to show: pages made from the page
 * patterns of the theme, three sample posts, a menu and the reading settings.
 *
 * Run by bin/setup.sh:  wp eval-file /project/tools/demo-content.php
 * Safe to run again: whatever already exists is left alone.
 *
 * This is a tool for developing the theme. The theme itself never creates content.
 */

$demo = json_decode( file_get_contents( __DIR__ . '/demo.json' ), true );

/** Content of a pattern of the theme, e.g. perla/page-about. */
function perla_dev_pattern( $slug ) {
	$pattern = WP_Block_Patterns_Registry::get_instance()->get_registered( $slug );
	return $pattern ? trim( $pattern['content'] ) : '';
}

/** Creates a page unless one with the same address exists. Returns its ID. */
function perla_dev_page( $path, $title, $content = '', $parent = 0 ) {
	$existing = get_page_by_path( $path );
	if ( $existing ) {
		return $existing->ID;
	}

	$parts = explode( '/', $path );

	return wp_insert_post(
		array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => $title,
			'post_name'    => end( $parts ),
			'post_parent'  => $parent,
			'post_content' => wp_slash( $content ),
		)
	);
}

/** Copies a picture of the theme to the Media Library. Returns the attachment ID. */
function perla_dev_image( $file, $alt ) {
	$found = get_posts( array( 'post_type' => 'attachment', 'meta_key' => '_perla_dev', 'meta_value' => $file, 'fields' => 'ids', 'numberposts' => 1 ) );
	if ( $found ) {
		return $found[0];
	}

	require_once ABSPATH . 'wp-admin/includes/image.php';

	$upload = wp_upload_bits( 'perla-' . $file, null, file_get_contents( get_theme_file_path( 'assets/images/' . $file ) ) );
	$id     = wp_insert_attachment( array( 'post_mime_type' => 'image/jpeg', 'post_title' => $alt, 'post_status' => 'inherit' ), $upload['file'] );

	wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $upload['file'] ) );
	update_post_meta( $id, '_wp_attachment_image_alt', $alt );
	update_post_meta( $id, '_perla_dev', $file );

	return $id;
}

// The content WordPress creates on a new site.
foreach ( array( 'hello-world' => 'post', 'sample-page' => 'page' ) as $slug => $type ) {
	$starter = get_page_by_path( $slug, OBJECT, $type );
	if ( $starter ) {
		wp_delete_post( $starter->ID, true );
	}
}

// Pages.
$ids = array();
foreach ( $demo['pages'] as $page ) {
	$parent              = empty( $page['parent'] ) ? 0 : $ids[ $page['parent'] ];
	$path                = empty( $page['parent'] ) ? $page['slug'] : $page['parent'] . '/' . $page['slug'];
	$content             = empty( $page['pattern'] ) ? ( $page['content'] ?? '' ) : perla_dev_pattern( $page['pattern'] );
	$ids[ $page['slug'] ] = perla_dev_page( $path, $page['title'], $content, $parent );
}

update_option( 'show_on_front', 'page' );
update_option( 'page_on_front', $ids['home'] );
update_option( 'page_for_posts', $ids['blog'] );
update_option( 'blogname', 'Perla Dental' );
update_option( 'blogdescription', 'Family dentist in Springfield' );

// Posts.
$category = wp_create_category( 'Dental care' );
foreach ( $demo['posts'] as $index => $post ) {
	if ( get_page_by_path( sanitize_title( $post['title'] ), OBJECT, 'post' ) ) {
		continue;
	}

	$body = '';
	foreach ( $post['body'] as $piece ) {
		$body .= 'h' === $piece[0]
			? "<!-- wp:heading -->\n<h2 class=\"wp-block-heading\">" . esc_html( $piece[1] ) . "</h2>\n<!-- /wp:heading -->\n\n"
			: "<!-- wp:paragraph -->\n<p>" . esc_html( $piece[1] ) . "</p>\n<!-- /wp:paragraph -->\n\n";
	}

	$id = wp_insert_post(
		array(
			'post_type'     => 'post',
			'post_status'   => 'publish',
			'post_title'    => $post['title'],
			'post_excerpt'  => $post['text'],
			'post_content'  => wp_slash( trim( $body ) ),
			'post_category' => array( $category ),
			'post_date'     => gmdate( 'Y-m-d 09:00:00', strtotime( '-' . ( 6 + 11 * $index ) . ' days' ) ),
		)
	);

	set_post_thumbnail( $id, perla_dev_image( $post['image'], $post['title'] ) );
}

// Menu: the Navigation block of the header shows the newest menu of the site.
if ( ! get_posts( array( 'post_type' => 'wp_navigation', 'numberposts' => 1 ) ) ) {
	$link = function ( $slug, $label ) use ( $ids ) {
		return sprintf(
			'<!-- wp:navigation-link {"label":%s,"type":"page","id":%d,"url":%s,"kind":"post-type"} /-->',
			wp_json_encode( $label ),
			$ids[ $slug ],
			wp_json_encode( get_permalink( $ids[ $slug ] ) )
		);
	};

	$treatments = '';
	foreach ( $demo['pages'] as $page ) {
		if ( ! empty( $page['parent'] ) ) {
			$treatments .= $link( $page['slug'], $page['title'] );
		}
	}

	$submenu = sprintf(
		'<!-- wp:navigation-submenu {"label":"Treatments","type":"page","id":%d,"url":%s,"kind":"post-type"} -->%s<!-- /wp:navigation-submenu -->',
		$ids['services'],
		wp_json_encode( get_permalink( $ids['services'] ) ),
		$treatments
	);

	wp_insert_post(
		array(
			'post_type'    => 'wp_navigation',
			'post_status'  => 'publish',
			'post_title'   => 'Main menu',
			'post_content' => wp_slash( $link( 'home', 'Home' ) . $link( 'about', 'About' ) . $submenu . $link( 'blog', 'Journal' ) . $link( 'contact', 'Contact' ) ),
		)
	);
}

WP_CLI::success( count( $ids ) . ' pages, ' . count( $demo['posts'] ) . ' posts and the menu are in place.' );
