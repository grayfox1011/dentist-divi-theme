<?php
/**
 * Title: Search header
 * Slug: dimora/search-header
 * Inserter: no
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Page title"},"align":"full","className":"dimora-hero dimora-page-head","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|60"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull dimora-hero dimora-page-head has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--60)"><!-- wp:group {"align":"wide","className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignwide dimora-stagger"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '(Search)', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:query-title {"type":"search","fontSize":"huge"} /-->

<!-- wp:search {"label":"<?php echo esc_attr__( 'Search', 'dimora' ); ?>","showLabel":false,"placeholder":"<?php echo esc_attr__( 'Search the site…', 'dimora' ); ?>","buttonText":"<?php echo esc_attr__( 'Search', 'dimora' ); ?>","className":"dimora-search"} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
