<?php
/**
 * Compatibility check: prints a fingerprint of everything Perla set up on the site, to compare
 * before and after an update of Divi or of the theme.
 *
 * One line per item: pages and posts (content, title, address), Theme Builder layouts and
 * templates, the main menu, the front page, the demo photos, the colours and variables of the
 * builder and the Customizer colours and fonts. Two runs that print the same lines mean that
 * nothing was changed, moved or lost in between.
 *
 *   wp eval-file /project/tools/fingerprint.php > before.txt
 *   ...update...
 *   wp eval-file /project/tools/fingerprint.php > after.txt && diff before.txt after.txt
 *
 * @package perla-child
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	exit;
}

$perla_lines = array();
$perla_hash  = static function ( $value ) {
	return substr( md5( is_string( $value ) ? $value : wp_json_encode( $value ) ), 0, 12 );
};

// Everything the importer created carries its mark: pages, posts, layouts, photos.
$perla_marked = get_posts(
	array(
		'post_type'      => 'any',
		'post_status'    => 'any',
		'meta_key'       => '_perla_demo', // phpcs:ignore WordPress.DB.SlowDBQuery -- Diagnostic script.
		'posts_per_page' => -1,
		'orderby'        => 'ID',
		'order'          => 'ASC',
	)
);
foreach ( $perla_marked as $perla_post ) {
	$perla_lines[] = sprintf(
		'%-22s %-34s status=%-8s title=%s content=%s meta=%s',
		get_post_meta( $perla_post->ID, '_perla_demo', true ),
		$perla_post->post_type . ':' . $perla_post->post_name,
		$perla_post->post_status,
		$perla_hash( $perla_post->post_title ),
		$perla_hash( $perla_post->post_content ),
		$perla_hash(
			array(
				get_post_meta( $perla_post->ID, '_et_pb_use_builder', true ),
				get_post_meta( $perla_post->ID, '_et_pb_use_divi_5', true ),
				get_post_meta( $perla_post->ID, '_et_pb_page_layout', true ),
				get_post_meta( $perla_post->ID, '_thumbnail_id', true ),
				get_post_meta( $perla_post->ID, '_wp_attached_file', true ),
			)
		)
	);
}

// Theme Builder: which templates exist and which layouts they use.
if ( function_exists( 'et_theme_builder_get_theme_builder_post_id' ) ) {
	$perla_builder = et_theme_builder_get_theme_builder_post_id( true, false );
	foreach ( $perla_builder ? get_post_meta( $perla_builder, '_et_template', false ) : array() as $perla_template_id ) {
		$perla_template = get_post( $perla_template_id );
		$perla_lines[]  = sprintf(
			'template               %-34s status=%-8s layouts=%s use_on=%s',
			$perla_template ? $perla_template->post_title : '(missing)',
			$perla_template ? $perla_template->post_status : '-',
			$perla_hash(
				array(
					get_post_meta( $perla_template_id, '_et_header_layout_id', true ),
					get_post_meta( $perla_template_id, '_et_body_layout_id', true ),
					get_post_meta( $perla_template_id, '_et_footer_layout_id', true ),
					get_post_meta( $perla_template_id, '_et_default', true ),
					get_post_meta( $perla_template_id, '_et_enabled', true ),
				)
			),
			$perla_hash( get_post_meta( $perla_template_id, '_et_use_on', false ) )
		);
	}
}

// Menu, front page, permalinks.
$perla_locations = get_theme_mod( 'nav_menu_locations', array() );
$perla_menu_id   = isset( $perla_locations['primary-menu'] ) ? (int) $perla_locations['primary-menu'] : 0;
$perla_items     = $perla_menu_id ? wp_get_nav_menu_items( $perla_menu_id ) : array();
$perla_lines[]   = 'menu                   items=' . count( (array) $perla_items ) . ' ' . $perla_hash( wp_list_pluck( (array) $perla_items, 'url' ) );
$perla_lines[]   = 'front page             ' . get_option( 'show_on_front' ) . ' ' . get_option( 'page_on_front' );

// Builder colours and variables, Customizer colours and fonts.
if ( function_exists( 'et_get_option' ) ) {
	$perla_global = maybe_unserialize( et_get_option( 'et_global_data', array() ) );
	$perla_colors = is_array( $perla_global ) && isset( $perla_global['global_colors'] ) ? $perla_global['global_colors'] : array();
	ksort( $perla_colors );
	$perla_lines[] = 'global colours         count=' . count( $perla_colors ) . ' ' . $perla_hash( wp_list_pluck( $perla_colors, 'color' ) );

	foreach ( array( 'accent_color', 'secondary_accent_color', 'header_color', 'font_color', 'link_color', 'heading_font', 'body_font', 'body_font_size' ) as $perla_name ) {
		$perla_lines[] = sprintf( 'customizer             %-24s %s', $perla_name, et_get_option( $perla_name, '' ) );
	}
}
if ( class_exists( '\ET\Builder\Packages\GlobalData\GlobalData' ) && method_exists( '\ET\Builder\Packages\GlobalData\GlobalData', 'get_global_variables' ) ) {
	$perla_variables = array();
	foreach ( \ET\Builder\Packages\GlobalData\GlobalData::get_global_variables() as $perla_group ) {
		foreach ( (array) $perla_group as $perla_id => $perla_variable ) {
			$perla_variables[ $perla_id ] = isset( $perla_variable['value'] ) ? $perla_variable['value'] : '';
		}
	}
	ksort( $perla_variables );
	$perla_lines[] = 'variables              count=' . count( $perla_variables ) . ' ' . $perla_hash( $perla_variables );
}

$perla_lines[] = 'perla options          motion=' . get_option( 'perla_child_motion', '(unset)' ) . ' smooth=' . get_option( 'perla_child_smooth', '(unset)' ) . ' defaults=' . get_option( 'perla_child_defaults_applied', '(unset)' );

echo implode( "\n", $perla_lines ) . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput -- Plain text for a terminal.
