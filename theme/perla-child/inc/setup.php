<?php
/**
 * Automatic set-up of the demo site, and the "Perla Setup" screen under Appearance.
 *
 * The first time an administrator opens the dashboard after activating the theme:
 *  - on a new site (no pages or posts of its own yet) the demo site is installed straight away;
 *  - on a site that already has content nothing is changed, and the screen offers a button.
 *
 * @package perla-child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PERLA_CHILD_SETUP_OPTION', 'perla_child_setup' );
define( 'PERLA_CHILD_SETUP_PAGE', 'perla-setup' );
define( 'PERLA_CHILD_SETUP_ACTION', 'perla_child_import' );

require_once __DIR__ . '/demo-import.php';

/**
 * Tells whether this request shows the set-up screen or submits its form.
 *
 * @return bool
 */
function perla_child_setup_is_own_request() {
	// phpcs:disable WordPress.Security.NonceVerification -- The values are only compared.
	$page   = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : '';
	$action = isset( $_POST['action'] ) ? sanitize_key( wp_unslash( $_POST['action'] ) ) : '';
	// phpcs:enable

	return PERLA_CHILD_SETUP_PAGE === $page || PERLA_CHILD_SETUP_ACTION === $action;
}

/**
 * Returns the state of the set-up.
 *
 * @return array {
 *     @type string $status 'new' (never checked), 'waiting' (nothing imported yet), 'running',
 *                          'done' or 'failed'.
 *     @type int    $time   When the status was stored.
 *     @type array  $report Report of the last import, see perla_child_import_demo().
 * }
 */
function perla_child_setup_get() {
	$setup  = get_option( PERLA_CHILD_SETUP_OPTION );
	$setup  = is_array( $setup ) ? $setup : array( 'status' => 'new' );
	$report = isset( $setup['report'] ) && is_array( $setup['report'] ) ? $setup['report'] : array();

	return array(
		'status' => isset( $setup['status'] ) ? (string) $setup['status'] : 'new',
		'time'   => isset( $setup['time'] ) ? (int) $setup['time'] : 0,
		'report' => wp_parse_args(
			$report,
			array(
				'error'   => '',
				'created' => array(),
				'kept'    => array(),
				'notes'   => array(),
			)
		),
	);
}

/**
 * Stores the state of the set-up.
 *
 * @param string $status See perla_child_setup_get().
 * @param array  $report Import report.
 */
function perla_child_setup_save( $status, $report = array() ) {
	update_option(
		PERLA_CHILD_SETUP_OPTION,
		array(
			'status'  => $status,
			'time'    => time(),
			'version' => PERLA_CHILD_VERSION,
			'report'  => $report,
		),
		false
	);
}

/**
 * Runs the importer and stores its report.
 *
 * @param array $args See perla_child_import_demo().
 * @return array Import report.
 */
function perla_child_setup_run( $args = array() ) {
	perla_child_setup_save( 'running' );

	wp_raise_memory_limit( 'admin' );
	if ( function_exists( 'set_time_limit' ) ) {
		@set_time_limit( 300 ); // phpcs:ignore WordPress.PHP.NoSilencedErrors -- Some hosts disable it.
	}

	try {
		$report = perla_child_import_demo( $args );
	} catch ( \Throwable $problem ) {
		$report = array(
			'error'   => $problem->getMessage(),
			'created' => array(),
			'kept'    => array(),
			'notes'   => array(),
		);
	}

	perla_child_setup_save( $report['error'] ? 'failed' : 'done', $report );

	return $report;
}

/**
 * Tells whether the site is still an empty WordPress: at most the sample page and post, no
 * static front page and an unused Theme Builder.
 *
 * @return bool
 */
function perla_child_setup_site_is_new() {
	return (int) wp_count_posts( 'page' )->publish <= 1
		&& (int) wp_count_posts( 'post' )->publish <= 1
		&& 'page' !== get_option( 'show_on_front' )
		&& ! perla_child_demo_theme_builder_in_use();
}

/**
 * First dashboard visit after the theme is activated: install the demo site on a new site,
 * then show the set-up screen.
 */
function perla_child_setup_first_run() {
	if ( false !== get_option( PERLA_CHILD_SETUP_OPTION ) ) {
		return;
	}

	// Only when an administrator opens a normal dashboard screen, and never while the theme is
	// just being previewed in the Customizer.
	$is_page_view = isset( $_SERVER['REQUEST_METHOD'] ) && 'GET' === $_SERVER['REQUEST_METHOD'] && ! defined( 'IFRAME_REQUEST' );
	if ( ! $is_page_view || is_customize_preview() || wp_doing_ajax() || wp_doing_cron() || is_network_admin() || ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// Stored before anything else, so a problem during the import can never cause a loop.
	perla_child_setup_save( 'waiting' );

	if ( '' === perla_child_demo_requirements() && perla_child_setup_site_is_new() ) {
		perla_child_setup_run();
	}

	wp_safe_redirect( admin_url( 'themes.php?page=' . PERLA_CHILD_SETUP_PAGE ) );
	exit;
}
add_action( 'admin_init', 'perla_child_setup_first_run' );

/**
 * Handles the button of the set-up screen.
 */
function perla_child_setup_handle_form() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You are not allowed to set up the theme.', 'perla-child' ), 403 );
	}
	check_admin_referer( PERLA_CHILD_SETUP_ACTION );

	// A second click while the import is still working must not start it twice.
	$setup = perla_child_setup_get();
	if ( 'running' !== $setup['status'] || time() - $setup['time'] > 5 * MINUTE_IN_SECONDS ) {
		perla_child_setup_run();
	}

	wp_safe_redirect( admin_url( 'themes.php?page=' . PERLA_CHILD_SETUP_PAGE ) );
	exit;
}
add_action( 'admin_post_' . PERLA_CHILD_SETUP_ACTION, 'perla_child_setup_handle_form' );

/**
 * Points to the set-up screen from the other dashboard screens when the last run did not finish.
 */
function perla_child_setup_notice() {
	$setup   = perla_child_setup_get();
	$stopped = 'failed' === $setup['status'] || ( 'running' === $setup['status'] && time() - $setup['time'] > 2 * MINUTE_IN_SECONDS );

	if ( ! $stopped || perla_child_setup_is_own_request() || ! current_user_can( 'manage_options' ) ) {
		return;
	}

	printf(
		'<div class="notice notice-warning"><p>%1$s <a href="%2$s">%3$s</a></p></div>',
		esc_html__( 'Perla: the set-up of the demo site did not finish.', 'perla-child' ),
		esc_url( admin_url( 'themes.php?page=' . PERLA_CHILD_SETUP_PAGE ) ),
		esc_html__( 'Open Perla Setup', 'perla-child' )
	);
}
add_action( 'admin_notices', 'perla_child_setup_notice' );

/**
 * Adds Appearance > Perla Setup.
 */
function perla_child_setup_menu() {
	add_theme_page(
		__( 'Perla Setup', 'perla-child' ),
		__( 'Perla Setup', 'perla-child' ),
		'manage_options',
		PERLA_CHILD_SETUP_PAGE,
		'perla_child_setup_screen'
	);
}
add_action( 'admin_menu', 'perla_child_setup_menu' );

/**
 * Prints one list of the import report.
 *
 * @param string   $title Heading.
 * @param string[] $lines Report lines.
 */
function perla_child_setup_list( $title, $lines ) {
	if ( ! $lines ) {
		return;
	}

	echo '<h3>' . esc_html( $title ) . '</h3><ul class="ul-disc">';
	foreach ( $lines as $line ) {
		echo '<li>' . esc_html( $line ) . '</li>';
	}
	echo '</ul>';
}

/**
 * Prints the set-up screen.
 */
function perla_child_setup_screen() {
	$setup   = perla_child_setup_get();
	$status  = $setup['status'];
	$report  = $setup['report'];
	$problem = perla_child_demo_requirements();
	$is_done = 'done' === $status;
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Perla Setup', 'perla-child' ); ?></h1>

		<?php if ( $problem ) : ?>
			<div class="notice notice-error inline"><p><?php echo esc_html( $problem ); ?></p></div>
		<?php elseif ( $is_done ) : ?>
			<div class="notice notice-success inline">
				<p><strong><?php esc_html_e( 'Your site is ready.', 'perla-child' ); ?></strong>
				<?php esc_html_e( 'The demo site is installed: replace the sample texts and placeholder images with your own.', 'perla-child' ); ?></p>
				<?php if ( ! $report['created'] && ! $report['kept'] && ! $report['notes'] ) : ?>
					<p><?php esc_html_e( 'The last run found nothing to add: everything is already in place.', 'perla-child' ); ?></p>
				<?php endif; ?>
			</div>
			<p>
				<a class="button button-primary" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'View your site', 'perla-child' ); ?></a>
				<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=page' ) ); ?>"><?php esc_html_e( 'Edit the pages', 'perla-child' ); ?></a>
			</p>
		<?php elseif ( 'failed' === $status ) : ?>
			<div class="notice notice-error inline">
				<p><strong><?php esc_html_e( 'The set-up could not be completed.', 'perla-child' ); ?></strong> <?php echo esc_html( $report['error'] ); ?></p>
			</div>
		<?php elseif ( 'running' === $status ) : ?>
			<div class="notice notice-warning inline">
				<p><strong><?php esc_html_e( 'The last set-up did not finish.', 'perla-child' ); ?></strong>
				<?php esc_html_e( 'Run it again: it only adds what is still missing.', 'perla-child' ); ?></p>
			</div>
		<?php else : ?>
			<div class="notice notice-info inline">
				<p><strong><?php echo esc_html( perla_child_setup_site_is_new() ? __( 'The demo site is not installed yet.', 'perla-child' ) : __( 'Your site already has content, so Perla has not changed anything.', 'perla-child' ) ); ?></strong>
				<?php esc_html_e( 'Use the button below to add the demo site.', 'perla-child' ); ?></p>
			</div>
		<?php endif; ?>

		<?php
		perla_child_setup_list( __( 'Added to your site', 'perla-child' ), $report['created'] );
		perla_child_setup_list( __( 'Left as it was', 'perla-child' ), $report['kept'] );
		perla_child_setup_list( __( 'Needs your attention', 'perla-child' ), $report['notes'] );
		?>

		<?php if ( ! $problem ) : ?>
			<h2><?php echo esc_html( $is_done ? __( 'Run the set-up again', 'perla-child' ) : __( 'Install the demo site', 'perla-child' ) ); ?></h2>
			<p><?php esc_html_e( 'Perla adds the pages (Home, About, Services, one page for each treatment, Blog and Contact), the header and footer, the blog post template, the 404 page, the main menu and three sample blog posts.', 'perla-child' ); ?></p>
			<p><?php esc_html_e( 'Only what is missing is added. Pages, menus and templates that are already on your site are never changed or deleted.', 'perla-child' ); ?></p>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="<?php echo esc_attr( PERLA_CHILD_SETUP_ACTION ); ?>">
				<?php
				wp_nonce_field( PERLA_CHILD_SETUP_ACTION );
				submit_button( $is_done ? __( 'Run the set-up again', 'perla-child' ) : __( 'Install the demo site', 'perla-child' ), $is_done ? 'secondary' : 'primary', 'submit', false );
				?>
			</form>

			<h2><?php esc_html_e( 'Make it yours', 'perla-child' ); ?></h2>
			<ol>
				<li><?php esc_html_e( 'Clinic name, phone, email, address and colours: open any page with the Divi builder, then open the Variable Manager. Change them once and they update on every page.', 'perla-child' ); ?></li>
				<li><?php esc_html_e( 'Logo: go to Divi > Theme Builder, open the Global Header, click the menu and replace the logo image.', 'perla-child' ); ?></li>
				<li><?php esc_html_e( 'Photos: click any placeholder image in the builder and choose your own photo.', 'perla-child' ); ?></li>
				<li><?php esc_html_e( 'Contact form: open the Contact page, click the form and enter the email address that should receive the requests.', 'perla-child' ); ?></li>
			</ol>
		<?php endif; ?>
	</div>
	<?php
}
