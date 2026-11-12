<?php
/**
 * Rebuilds the demo site on the local development environment.
 *
 * It runs the importer of the child theme (theme/perla-child/inc/demo-import.php), the same
 * one a customer gets, in "update" mode: pages, layouts and variables it created earlier are
 * refreshed with the latest build.
 *
 * Run through WP-CLI as an administrator (bin/setup.sh does this for you):
 *   wp --user=admin eval-file /project/tools/import-demo.php
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	exit;
}

if ( ! function_exists( 'perla_child_setup_run' ) ) {
	WP_CLI::error( 'The Perla child theme is not active.' );
}

$perla_report = perla_child_setup_run( array( 'update' => true ) );

if ( $perla_report['error'] ) {
	WP_CLI::error( $perla_report['error'] );
}

foreach ( $perla_report['created'] as $perla_line ) {
	WP_CLI::log( "Added: $perla_line" );
}
foreach ( $perla_report['kept'] as $perla_line ) {
	WP_CLI::log( "Kept: $perla_line" );
}
foreach ( $perla_report['notes'] as $perla_line ) {
	WP_CLI::warning( $perla_line );
}

WP_CLI::success( 'Demo site is up to date.' );
