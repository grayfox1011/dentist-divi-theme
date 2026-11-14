<?php
/**
 * Compatibility check: runs Divi's own content migrations on every Perla layout and prints,
 * as JSON, the modules before and after.
 *
 * The layouts are written in the format of Divi 5.4. A newer Divi converts older content when
 * it shows a page, when the page is opened in the builder and when a layout is imported: this
 * script calls that same conversion, so tools/compat.js can list what the installed version of
 * Divi changes and check that no setting is lost on the way.
 *
 *   wp eval-file /project/tools/migration-report.php > report.json
 *
 * @package perla-child
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	exit;
}

if ( ! function_exists( 'perla_child_demo_read' ) ) {
	WP_CLI::error( 'The Perla child theme is not active.' );
}

/**
 * Lists the modules of a layout in order, each with its settings.
 *
 * @param string $content Divi layout.
 * @return array
 */
function perla_compat_modules( $content ) {
	$modules = array();
	$walk    = static function ( $blocks ) use ( &$walk, &$modules ) {
		foreach ( $blocks as $block ) {
			if ( empty( $block['blockName'] ) || 'divi/placeholder' === $block['blockName'] ) {
				if ( ! empty( $block['innerBlocks'] ) ) {
					$walk( $block['innerBlocks'] );
				}
				continue;
			}
			$modules[] = array( $block['blockName'], $block['attrs'] );
			$walk( $block['innerBlocks'] );
		}
	};
	$walk( parse_blocks( $content ) );

	return $modules;
}

$perla_layouts = array();
$perla_pages   = perla_child_demo_read( 'pages.json' );
$perla_theme   = perla_child_demo_read( 'theme-builder.json' );

foreach ( $perla_pages['data'] as $perla_layout ) {
	$perla_layouts[ $perla_layout['post_name'] ] = $perla_layout['post_content'];
}
foreach ( $perla_theme['layouts'] as $perla_layout ) {
	$perla_layouts[ sanitize_title( $perla_layout['post_title'] ) ] = reset( $perla_layout['data'] );
}

$perla_report = array(
	'divi'    => wp_get_theme( get_template() )->get( 'Version' ),
	'layouts' => array(),
);

foreach ( $perla_layouts as $perla_name => $perla_content ) {
	// The conversion Divi applies to imported layouts: every migration, in version order.
	$perla_migrated = apply_filters( 'divi_framework_portability_import_migrated_post_content', $perla_content );

	$perla_report['layouts'][ $perla_name ] = array(
		'changed' => $perla_migrated !== $perla_content,
		'before'  => perla_compat_modules( $perla_content ),
		'after'   => perla_compat_modules( $perla_migrated ),
	);
}

echo wp_json_encode( $perla_report ); // phpcs:ignore WordPress.Security.EscapeOutput -- JSON for a script.
