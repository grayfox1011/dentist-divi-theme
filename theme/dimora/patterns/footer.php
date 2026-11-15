<?php
/**
 * Title: Footer with large call and wordmark
 * Slug: dimora/footer
 * Categories: footer
 * Block Types: core/template-part/footer
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Footer', 'dimora' ); ?>"},"align":"full","className":"dimora-dark dimora-footer","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|50"},"blockGap":"var:preset|spacing|80","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"dark","textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull dimora-dark dimora-footer has-base-color has-dark-background-color has-text-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--50)"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"56%","style":{"spacing":{"blockGap":"var:preset|spacing|50"}}} -->
<div class="wp-block-column" style="flex-basis:56%"><!-- wp:heading {"className":"dimora-split","textColor":"base","fontSize":"huge"} -->
<h2 class="wp-block-heading dimora-split has-base-color has-text-color has-huge-font-size"><?php echo wp_kses_post( __( 'Let’s make a <em>home</em> of it.', 'dimora' ) ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"dimora-arrow-link dimora-reveal","fontSize":"x-large"} -->
<p class="dimora-arrow-link dimora-reveal has-x-large-font-size"><a href="mailto:hello@example.com">hello@example.com</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"44%"} -->
<div class="wp-block-column" style="flex-basis:44%"><!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Details', 'dimora' ); ?>"},"className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"grid","minimumColumnWidth":"220px"}} -->
<div class="wp-block-group dimora-stagger"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'Studio', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-soft"} -->
<p class="dimora-soft"><?php echo esc_html__( '18 Larkspur Yard, London E2', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-soft"} -->
<p class="dimora-soft"><?php echo esc_html__( 'Monday to Friday, 9am – 6pm', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'Contact', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-soft"} -->
<p class="dimora-soft"><a href="tel:+442079460321">020 7946 0321</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-soft"} -->
<p class="dimora-soft"><a href="mailto:hello@example.com">hello@example.com</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'Explore', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-soft"} -->
<p class="dimora-soft"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects' ) ); ?>"><?php echo esc_html__( 'Projects', 'dimora' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-soft"} -->
<p class="dimora-soft"><a href="<?php echo esc_url( dimora_soliton_radar( 'studio' ) ); ?>"><?php echo esc_html__( 'Studio', 'dimora' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-soft"} -->
<p class="dimora-soft"><a href="<?php echo esc_url( dimora_soliton_radar( 'services' ) ); ?>"><?php echo esc_html__( 'Services', 'dimora' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-soft"} -->
<p class="dimora-soft"><a href="<?php echo esc_url( dimora_soliton_radar( 'journal' ) ); ?>"><?php echo esc_html__( 'Journal', 'dimora' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'Follow', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-soft"} -->
<p class="dimora-soft"><a href="#"><?php echo esc_html__( 'Instagram', 'dimora' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-soft"} -->
<p class="dimora-soft"><a href="#"><?php echo esc_html__( 'Pinterest', 'dimora' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-soft"} -->
<p class="dimora-soft"><a href="#"><?php echo esc_html__( 'LinkedIn', 'dimora' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:site-title {"level":0,"isLink":false,"align":"wide","className":"dimora-wordmark"} /-->

<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Legal', 'dimora' ); ?>"},"align":"wide","className":"dimora-legal","style":{"spacing":{"blockGap":"12px 32px"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group alignwide dimora-legal"><!-- wp:group {"style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"flex","flexWrap":"wrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"dimora-soft","fontSize":"small"} -->
<p class="dimora-soft has-small-font-size"><?php echo esc_html__( '©', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:site-title {"level":0,"isLink":false,"className":"dimora-site-title-plain"} /--></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"dimora-soft","fontSize":"small"} -->
<p class="dimora-soft has-small-font-size"><?php echo wp_kses_post( get_the_privacy_policy_link( '', ' · ' ) ); ?><a href="<?php echo esc_url( dimora_soliton_radar( 'terms' ) ); ?>"><?php echo esc_html__( 'Terms', 'dimora' ); ?></a> · <a href="#top"><?php echo esc_html__( 'Back to top', 'dimora' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
