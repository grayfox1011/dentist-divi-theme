<?php
/**
 * Plugin Name:       Dimora Starter
 * Description:       Builds the whole Dimora site in one click: every page with real blocks, the menu, three sample articles, and the Home page set as the front page.
 * Version:           1.0.0
 * Requires at least: 6.6
 * Requires PHP:      7.4
 * Author:            Fontana Jonathan
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dimora-starter
 *
 * @package Dimora_Starter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function dimora_starter_codec() {
	add_theme_page(
		__( 'Dimora Starter', 'dimora-starter' ),
		__( 'Dimora Starter', 'dimora-starter' ),
		'manage_options',
		'dimora-starter',
		'dimora_starter_briefing'
	);
}
add_action( 'admin_menu', 'dimora_starter_codec' );

function dimora_starter_frequency( $links ) {
	array_unshift( $links, '<a href="' . esc_url( admin_url( 'themes.php?page=dimora-starter' ) ) . '">' . esc_html__( 'Build the site', 'dimora-starter' ) . '</a>' );

	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'dimora_starter_frequency' );

// The pages, the menu and the sample posts to build, written by the theme's build tool.
function dimora_starter_intel() {
	$site = wp_json_file_decode( plugin_dir_path( __FILE__ ) . 'data/site.json', array( 'associative' => true ) );

	return is_array( $site ) ? $site : array(
		'pages' => array(),
		'menu'  => array(),
		'posts' => array(),
	);
}

function dimora_starter_suit_on() {
	return 'dimora' === get_template() && WP_Block_Patterns_Registry::get_instance()->is_registered( 'dimora/page-home' );
}

// A pattern of the theme as plain blocks: the patterns it refers to are written out in full.
function dimora_starter_nanomachines( $slug, $depth = 0 ) {
	$pattern = WP_Block_Patterns_Registry::get_instance()->get_registered( $slug );

	if ( ! $pattern || $depth > 5 ) {
		return '';
	}

	return preg_replace_callback(
		'/<!-- wp:pattern (\{.*?\}) \/-->/',
		function ( $found ) use ( $depth ) {
			$attrs = json_decode( $found[1], true );

			return empty( $attrs['slug'] ) ? '' : dimora_starter_nanomachines( $attrs['slug'], $depth + 1 );
		},
		trim( $pattern['content'] )
	);
}

// Copies a photograph of the theme to the Media Library, once. Returns the attachment ID.
function dimora_starter_fulton( $file ) {
	global $wp_filesystem;

	$library = get_option( 'dimora_starter_media', array() );

	if ( isset( $library[ $file ] ) && get_post( $library[ $file ] ) ) {
		return (int) $library[ $file ];
	}

	$source = get_theme_file_path( 'assets/images/' . $file );

	if ( ! is_readable( $source ) ) {
		return 0;
	}

	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';

	WP_Filesystem();
	$copy = wp_tempnam( $file );

	if ( ! $copy || ! $wp_filesystem || ! $wp_filesystem->copy( $source, $copy, true ) ) {
		return 0;
	}

	$id = media_handle_sideload(
		array(
			'name'     => 'dimora-' . $file,
			'tmp_name' => $copy,
		),
		0
	);

	if ( is_wp_error( $id ) ) {
		wp_delete_file( $copy );
		return 0;
	}

	$site = dimora_starter_intel();

	if ( ! empty( $site['alts'][ $file ] ) ) {
		update_post_meta( $id, '_wp_attachment_image_alt', sanitize_text_field( $site['alts'][ $file ] ) );
	}

	$library[ $file ] = (int) $id;
	update_option( 'dimora_starter_media', $library, false );

	return (int) $id;
}

// Image blocks that show a theme photograph are pointed at its copy in the Media Library.
function dimora_starter_extraction( $content ) {
	return preg_replace_callback(
		'/<!-- wp:image (\{.*?\}) -->(.*?)<!-- \/wp:image -->/s',
		function ( $block ) {
			if ( ! preg_match( '#src="[^"]+/assets/images/([a-z0-9-]+\.jpg)"#', $block[2], $src ) ) {
				return $block[0];
			}

			$id    = dimora_starter_fulton( $src[1] );
			$url   = $id ? wp_get_attachment_url( $id ) : '';
			$attrs = json_decode( $block[1], true );

			if ( ! $url || ! is_array( $attrs ) ) {
				return $block[0];
			}

			$attrs['id'] = $id;
			$html        = str_replace( $src[0], 'src="' . esc_url( $url ) . '"', $block[2] );
			$html        = preg_replace( '/(<img\b[^>]*\balt="[^"]*")/', '$1 class="wp-image-' . $id . '"', $html, 1 );

			return '<!-- wp:image ' . serialize_block_attributes( $attrs ) . ' -->' . $html . '<!-- /wp:image -->';
		},
		$content
	);
}

function dimora_starter_soliton( $menu, $ids, $titles ) {
	$link = function ( $slug, $label ) use ( $ids ) {
		if ( empty( $ids[ $slug ] ) ) {
			return '';
		}

		return sprintf(
			'<!-- wp:navigation-link {"label":%s,"type":"page","id":%d,"url":%s,"kind":"post-type"} /-->',
			wp_json_encode( $label ),
			$ids[ $slug ],
			wp_json_encode( get_permalink( $ids[ $slug ] ) )
		);
	};

	$out = '';

	foreach ( $menu as $item ) {
		if ( empty( $item['children'] ) || empty( $ids[ $item['page'] ] ) ) {
			$out .= $link( $item['page'], $item['label'] );
			continue;
		}

		$inner = '';

		foreach ( $item['children'] as $child ) {
			$inner .= $link( $child, isset( $titles[ $child ] ) ? $titles[ $child ] : $child );
		}

		$out .= sprintf(
			'<!-- wp:navigation-submenu {"label":%s,"type":"page","id":%d,"url":%s,"kind":"post-type"} -->%s<!-- /wp:navigation-submenu -->',
			wp_json_encode( $item['label'] ),
			$ids[ $item['page'] ],
			wp_json_encode( get_permalink( $ids[ $item['page'] ] ) ),
			$inner
		);
	}

	return $out;
}

/**
 * Builds the site. Nothing that already exists is touched: a page whose address is taken is kept as it is.
 *
 * @param bool $front Set the Home page as the front page and the Journal page as the posts page.
 * @param bool $posts Add the sample articles.
 * @return array What was created, for the report and for the undo.
 */
function dimora_starter_outer_heaven( $front = true, $posts = true ) {
	$site   = dimora_starter_intel();
	$before = get_option( 'dimora_starter_log' );
	$log    = is_array( $before ) ? $before : array(
		'pages'   => array(),
		'posts'   => array(),
		'menu'    => 0,
		'reading' => null,
	);
	$ids    = array();
	$titles = array();

	$log['kept'] = array();

	foreach ( $site['pages'] as $page ) {
		$titles[ $page['slug'] ] = $page['title'];

		$path  = empty( $page['parent'] ) ? $page['slug'] : $page['parent'] . '/' . $page['slug'];
		$found = get_page_by_path( $path );

		if ( $found ) {
			$ids[ $page['slug'] ] = $found->ID;

			if ( ! in_array( $found->ID, $log['pages'], true ) ) {
				$log['kept'][] = $page['title'];
			}
			continue;
		}

		$content = '';

		if ( ! empty( $page['pattern'] ) ) {
			$content = dimora_starter_extraction( dimora_starter_nanomachines( $page['pattern'] ) );

			// No pattern, no page: an empty one would only get in the way.
			if ( '' === $content ) {
				continue;
			}
		} elseif ( ! empty( $page['text'] ) ) {
			$content = "<!-- wp:paragraph -->\n<p>" . esc_html( $page['text'] ) . "</p>\n<!-- /wp:paragraph -->";
		}

		$id = wp_insert_post(
			array(
				'post_type'      => 'page',
				'post_status'    => 'publish',
				'post_title'     => $page['title'],
				'post_name'      => $page['slug'],
				'post_parent'    => empty( $page['parent'] ) || empty( $ids[ $page['parent'] ] ) ? 0 : $ids[ $page['parent'] ],
				'post_content'   => wp_slash( $content ),
				'comment_status' => 'closed',
			)
		);

		if ( $id && ! is_wp_error( $id ) ) {
			$ids[ $page['slug'] ] = $id;
			$log['pages'][]       = $id;

			if ( ! empty( $page['template'] ) ) {
				update_post_meta( $id, '_wp_page_template', sanitize_key( $page['template'] ) );
			}
		}
	}

	if ( $posts ) {
		$name     = empty( $site['category'] ) ? 'Notes' : $site['category'];
		$category = term_exists( $name, 'category' );
		$category = $category ? $category : wp_insert_term( $name, 'category' );

		foreach ( $site['posts'] as $index => $post ) {
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
					'post_excerpt'  => $post['excerpt'],
					'post_content'  => wp_slash( trim( $body ) ),
					'post_category' => is_array( $category ) ? array( (int) $category['term_id'] ) : array(),
					'post_date'     => gmdate( 'Y-m-d 09:00:00', time() - ( 6 + 11 * $index ) * DAY_IN_SECONDS ),
				)
			);

			if ( $id && ! is_wp_error( $id ) ) {
				$log['posts'][] = $id;
				$photo          = dimora_starter_fulton( $post['image'] );

				if ( $photo ) {
					set_post_thumbnail( $id, $photo );
				}
			}
		}
	}

	// The header shows the newest menu of the site. A menu somebody made stays in charge; the bare
	// list of pages that WordPress creates by itself when a site has no menu does not count.
	$own_menu = false;

	foreach ( get_posts( array( 'post_type' => 'wp_navigation', 'numberposts' => 50 ) ) as $existing ) {
		if ( '<!-- wp:page-list /-->' !== trim( $existing->post_content ) ) {
			$own_menu = true;
			break;
		}
	}

	if ( ! $own_menu ) {
		$menu = wp_insert_post(
			array(
				'post_type'    => 'wp_navigation',
				'post_status'  => 'publish',
				'post_title'   => __( 'Main menu', 'dimora-starter' ),
				'post_content' => wp_slash( dimora_starter_soliton( $site['menu'], $ids, $titles ) ),
			)
		);

		$log['menu'] = $menu && ! is_wp_error( $menu ) ? $menu : 0;
	}

	if ( $front && ! empty( $ids['home'] ) ) {
		if ( null === $log['reading'] ) {
			$log['reading'] = array( get_option( 'show_on_front' ), (int) get_option( 'page_on_front' ), (int) get_option( 'page_for_posts' ) );
		}

		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $ids['home'] );

		if ( ! empty( $ids['journal'] ) ) {
			update_option( 'page_for_posts', $ids['journal'] );
		}
	}

	update_option( 'dimora_starter_log', $log, false );

	return $log;
}

// Undo: what the starter created goes to the trash and the reading settings go back to what they were.
function dimora_starter_foxdie() {
	$log = get_option( 'dimora_starter_log' );

	if ( ! is_array( $log ) ) {
		return;
	}

	if ( is_array( $log['reading'] ) ) {
		update_option( 'show_on_front', $log['reading'][0] );
		update_option( 'page_on_front', $log['reading'][1] );
		update_option( 'page_for_posts', $log['reading'][2] );
	}

	foreach ( array_merge( $log['pages'], $log['posts'], array( $log['menu'] ) ) as $id ) {
		if ( $id && get_post( $id ) ) {
			wp_trash_post( $id );
		}
	}

	delete_option( 'dimora_starter_log' );
}

function dimora_starter_colonel() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You are not allowed to do this.', 'dimora-starter' ) );
	}

	check_admin_referer( 'dimora_starter' );

	$order = isset( $_POST['dimora_starter_order'] ) ? sanitize_key( wp_unslash( $_POST['dimora_starter_order'] ) ) : '';

	if ( 'undo' === $order ) {
		dimora_starter_foxdie();
	} elseif ( 'build' === $order && dimora_starter_suit_on() ) {
		dimora_starter_outer_heaven( ! empty( $_POST['dimora_starter_front'] ), ! empty( $_POST['dimora_starter_posts'] ) );
	} else {
		$order = 'none';
	}

	wp_safe_redirect( admin_url( 'themes.php?page=dimora-starter&dimora_starter_done=' . $order ) );
	exit;
}
add_action( 'admin_post_dimora_starter', 'dimora_starter_colonel' );

function dimora_starter_briefing() {
	$site  = dimora_starter_intel();
	$log   = get_option( 'dimora_starter_log' );
	$ready = dimora_starter_suit_on();
	// Only chooses which notice to show after the redirect.
	$done = isset( $_GET['dimora_starter_done'] ) ? sanitize_key( wp_unslash( $_GET['dimora_starter_done'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Dimora Starter', 'dimora-starter' ); ?></h1>

		<?php if ( 'build' === $done && is_array( $log ) ) : ?>
			<div class="notice notice-success"><p>
				<?php
				printf(
					/* translators: 1: number of pages, 2: number of articles */
					esc_html__( 'Done: %1$d pages and %2$d articles are in place.', 'dimora-starter' ),
					count( $log['pages'] ),
					count( $log['posts'] )
				);
				?>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'View the site', 'dimora-starter' ); ?></a>
			</p></div>
			<?php if ( ! empty( $log['kept'] ) ) : ?>
				<div class="notice notice-info"><p>
					<?php
					printf(
						/* translators: %s: list of page titles */
						esc_html__( 'These pages already existed and were left as they are: %s.', 'dimora-starter' ),
						esc_html( implode( ', ', $log['kept'] ) )
					);
					?>
				</p></div>
			<?php endif; ?>
		<?php elseif ( 'undo' === $done ) : ?>
			<div class="notice notice-success"><p><?php esc_html_e( 'The pages, articles and menu made by the starter are in the trash, and the homepage settings are back as they were.', 'dimora-starter' ); ?></p></div>
		<?php endif; ?>

		<?php if ( ! $ready ) : ?>
			<div class="notice notice-warning inline"><p><?php esc_html_e( 'Dimora Starter builds its pages from the patterns of the Dimora theme. Activate Dimora in Appearance > Themes, then come back here.', 'dimora-starter' ); ?></p></div>
		<?php else : ?>
			<p><?php esc_html_e( 'One click creates the whole site with ordinary blocks, so every page can be edited like any other page.', 'dimora-starter' ); ?></p>

			<table class="widefat striped" style="max-width:640px">
				<thead><tr><th><?php esc_html_e( 'Page', 'dimora-starter' ); ?></th><th><?php esc_html_e( 'Address', 'dimora-starter' ); ?></th><th><?php esc_html_e( 'Now', 'dimora-starter' ); ?></th></tr></thead>
				<tbody>
				<?php foreach ( $site['pages'] as $page ) : ?>
					<?php $path = empty( $page['parent'] ) ? $page['slug'] : $page['parent'] . '/' . $page['slug']; ?>
					<tr>
						<td><?php echo esc_html( $page['title'] ); ?></td>
						<td><code>/<?php echo esc_html( $path ); ?>/</code></td>
						<td><?php get_page_by_path( $path ) ? esc_html_e( 'Exists, will be kept', 'dimora-starter' ) : esc_html_e( 'Will be created', 'dimora-starter' ); ?></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="dimora_starter">
				<input type="hidden" name="dimora_starter_order" value="build">
				<?php wp_nonce_field( 'dimora_starter' ); ?>
				<p><label><input type="checkbox" name="dimora_starter_front" value="1" checked> <?php esc_html_e( 'Use the Home page as the front page and the Journal page for the articles', 'dimora-starter' ); ?></label></p>
				<p><label><input type="checkbox" name="dimora_starter_posts" value="1" checked> <?php esc_html_e( 'Add three sample articles', 'dimora-starter' ); ?></label></p>
				<p class="description"><?php esc_html_e( 'A menu is created unless you have already made one. Photographs are copied to the Media Library.', 'dimora-starter' ); ?></p>
				<?php submit_button( __( 'Build the site', 'dimora-starter' ) ); ?>
			</form>
		<?php endif; ?>

		<?php if ( is_array( $log ) ) : ?>
			<hr>
			<h2><?php esc_html_e( 'Changed your mind?', 'dimora-starter' ); ?></h2>
			<p><?php esc_html_e( 'This moves what the starter created to the trash, where you can still restore it, and puts the homepage settings back. Photographs stay in the Media Library.', 'dimora-starter' ); ?></p>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="dimora_starter">
				<input type="hidden" name="dimora_starter_order" value="undo">
				<?php wp_nonce_field( 'dimora_starter' ); ?>
				<?php submit_button( __( 'Remove what the starter created', 'dimora-starter' ), 'secondary' ); ?>
			</form>
		<?php endif; ?>
	</div>
	<?php
}

function dimora_starter_game_over() {
	delete_option( 'dimora_starter_log' );
	delete_option( 'dimora_starter_media' );
}
register_uninstall_hook( __FILE__, 'dimora_starter_game_over' );
