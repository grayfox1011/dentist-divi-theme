<?php
/**
 * Title: Footer on one line
 * Slug: dimora/footer-compact
 * Categories: footer
 * Block Types: core/template-part/footer
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Footer"},"align":"full","className":"dimora-dark dimora-footer","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|50"},"blockGap":"var:preset|spacing|80","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"dark","textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull dimora-dark dimora-footer has-base-color has-dark-background-color has-text-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--50)"><!-- wp:group {"metadata":{"name":"Legal"},"align":"wide","className":"dimora-legal","style":{"spacing":{"blockGap":"12px 32px"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group alignwide dimora-legal"><!-- wp:group {"style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"flex","flexWrap":"wrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"dimora-soft","fontSize":"small"} -->
<p class="dimora-soft has-small-font-size"><?php echo esc_html__( '©', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:site-title {"level":0,"isLink":false,"className":"dimora-site-title-plain"} /--></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"dimora-soft","fontSize":"small"} -->
<p class="dimora-soft has-small-font-size"><a href="<?php echo esc_url( home_url( '/projects/' ) ); ?>"><?php echo esc_html__( 'Projects', 'dimora' ); ?></a> · <a href="<?php echo esc_url( home_url( '/studio/' ) ); ?>"><?php echo esc_html__( 'Studio', 'dimora' ); ?></a> · <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php echo esc_html__( 'Contact', 'dimora' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-soft","fontSize":"small"} -->
<p class="dimora-soft has-small-font-size"><a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>"><?php echo esc_html__( 'Privacy policy', 'dimora' ); ?></a> · <a href="<?php echo esc_url( home_url( '/terms/' ) ); ?>"><?php echo esc_html__( 'Terms', 'dimora' ); ?></a> · <a href="#top"><?php echo esc_html__( 'Back to top', 'dimora' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
