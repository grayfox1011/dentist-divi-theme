<?php
/**
 * Diagnostic: parses every page with WordPress' own block parser and prints what it finds.
 * Usage: docker compose run --rm cli wp eval-file /project/tools/check-pages.php
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	exit;
}

foreach ( get_pages() as $perla_page ) {
	$perla_count   = 0;
	$perla_missing = 0;
	$perla_types   = array();
	$perla_walk    = function ( $blocks ) use ( &$perla_walk, &$perla_count, &$perla_missing, &$perla_types ) {
		foreach ( $blocks as $block ) {
			if ( empty( $block['blockName'] ) ) {
				continue;
			}
			++$perla_count;
			$perla_types[ $block['blockName'] ] = true;
			// Every Divi module carries its settings as JSON; none means the JSON did not survive saving.
			if ( 'divi/placeholder' !== $block['blockName'] && empty( $block['attrs']['builderVersion'] ) ) {
				++$perla_missing;
			}
			$perla_walk( $block['innerBlocks'] );
		}
	};
	$perla_walk( parse_blocks( $perla_page->post_content ) );

	WP_CLI::log(
		sprintf(
			'%-18s modules=%-4d broken=%d module-types=%-3d builder=%s divi5=%s',
			$perla_page->post_name,
			$perla_count,
			$perla_missing,
			count( $perla_types ),
			get_post_meta( $perla_page->ID, '_et_pb_use_builder', true ),
			get_post_meta( $perla_page->ID, '_et_pb_use_divi_5', true )
		)
	);
}

$perla_theme = wp_get_theme();
WP_CLI::log( 'Front page ID: ' . get_option( 'page_on_front' ) . ' | Permalinks: ' . get_option( 'permalink_structure' ) );
WP_CLI::log( 'Theme: ' . $perla_theme->get( 'Name' ) . ' (parent: ' . ( $perla_theme->parent() ? $perla_theme->parent()->get( 'Name' ) . ' ' . $perla_theme->parent()->get( 'Version' ) : 'none' ) . ')' );
