<?php
/**
 * Title: Header with menu
 * Slug: dimora/header
 * Categories: header
 * Block Types: core/template-part/header
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Header"},"align":"full","className":"dimora-navbar","style":{"spacing":{"padding":{"top":"18px","bottom":"18px"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull dimora-navbar has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:18px;padding-bottom:18px"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group alignwide"><!-- wp:site-title {"level":0} /-->

<!-- wp:group {"metadata":{"name":"Menu"},"style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:navigation {"icon":"menu","style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"flex","justifyContent":"right"}} /-->

<!-- wp:paragraph {"className":"dimora-arrow-link dimora-hide-medium"} -->
<p class="dimora-arrow-link dimora-hide-medium"><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php echo esc_html__( 'Start a project', 'dimora' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
