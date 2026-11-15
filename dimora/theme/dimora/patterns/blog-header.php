<?php
/**
 * Title: Journal header
 * Slug: dimora/blog-header
 * Inserter: no
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Page title', 'dimora' ); ?>"},"align":"full","className":"dimora-hero dimora-page-head","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|60"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull dimora-hero dimora-page-head has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--60)"><!-- wp:group {"align":"wide","className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignwide dimora-stagger"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '(Journal)', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"className":"dimora-split","fontSize":"huge"} -->
<h1 class="wp-block-heading dimora-split has-huge-font-size"><?php echo wp_kses_post( __( 'Notes on <em>living</em> well', 'dimora' ) ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"dimora-measure","fontSize":"large"} -->
<p class="dimora-measure has-large-font-size"><?php echo esc_html__( 'Short, practical pieces on paint, budgets, builders and the questions clients ask us most.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
