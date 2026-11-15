<?php
/**
 * Title: Large quote with press names
 * Slug: dimora/quote
 * Categories: dimora, testimonials
 * Keywords: testimonial, quote, press
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Quote', 'dimora' ); ?>"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:group {"align":"wide","className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"constrained","contentSize":"1040px"}} -->
<div class="wp-block-group alignwide dimora-stagger"><!-- wp:paragraph {"align":"center","className":"is-style-dimora-label"} -->
<p class="has-text-align-center is-style-dimora-label"><?php echo esc_html__( '(In their words)', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center","className":"dimora-quote","textColor":"ink"} -->
<p class="has-text-align-center dimora-quote has-ink-color has-text-color"><?php echo esc_html__( '“They heard what we could not put into words, and then drew it.”', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center","textColor":"muted","fontSize":"small"} -->
<p class="has-text-align-center has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Hannah and Luke', 'dimora' ); ?> · <a href="<?php echo esc_url( dimora_soliton_radar( 'projects/canal-house' ) ); ?>"><?php echo esc_html__( 'Canal House', 'dimora' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Press', 'dimora' ); ?>"},"align":"wide","className":"dimora-press dimora-reveal","style":{"spacing":{"blockGap":"12px 40px"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"center","verticalAlignment":"center"}} -->
<div class="wp-block-group alignwide dimora-press dimora-reveal"><!-- wp:paragraph {"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'As featured in', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-press-name"} -->
<p class="dimora-press-name"><?php echo esc_html__( 'Field & Form', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-press-name"} -->
<p class="dimora-press-name"><?php echo esc_html__( 'Hearth Quarterly', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-press-name"} -->
<p class="dimora-press-name"><?php echo esc_html__( 'The Interior Review', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-press-name"} -->
<p class="dimora-press-name"><?php echo esc_html__( 'Slow Rooms', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-press-name"} -->
<p class="dimora-press-name"><?php echo esc_html__( 'North Light Journal', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
