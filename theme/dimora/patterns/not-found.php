<?php
/**
 * Title: Page not found
 * Slug: dimora/not-found
 * Inserter: no
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Not found"},"align":"full","className":"dimora-hero","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull dimora-hero has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:group {"align":"wide","className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignwide dimora-stagger"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '(404)', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"className":"dimora-split","fontSize":"display"} -->
<h1 class="wp-block-heading dimora-split has-display-font-size"><?php echo wp_kses_post( __( 'This room does <em>not</em> exist.', 'dimora' ) ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"dimora-measure","fontSize":"large"} -->
<p class="dimora-measure has-large-font-size"><?php echo esc_html__( 'The page may have moved, or the address may be mistyped.', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"flex"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo esc_html__( 'Back to the home page', 'dimora' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/projects/' ) ); ?>"><?php echo esc_html__( 'See the projects', 'dimora' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
