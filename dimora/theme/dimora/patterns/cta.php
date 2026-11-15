<?php
/**
 * Title: Running call to action
 * Slug: dimora/cta
 * Categories: dimora, call-to-action
 * Keywords: cta, marquee, banner
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Call to action', 'dimora' ); ?>"},"align":"full","className":"dimora-cta","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"},"blockGap":"var:preset|spacing|60","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull dimora-cta has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Running line', 'dimora' ); ?>"},"align":"full","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull"><!-- wp:paragraph {"align":"center","className":"dimora-marquee"} -->
<p class="has-text-align-center dimora-marquee"><a href="<?php echo esc_url( dimora_soliton_radar( 'contact' ) ); ?>"><?php echo esc_html__( 'Tell us about your home', 'dimora' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:buttons {"className":"dimora-reveal","style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons dimora-reveal"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( dimora_soliton_radar( 'contact' ) ); ?>"><?php echo esc_html__( 'Start a project', 'dimora' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="tel:+442079460321">020 7946 0321</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->
