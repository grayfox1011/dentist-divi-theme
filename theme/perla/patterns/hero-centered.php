<?php
/**
 * Title: Hero with centred text
 * Slug: perla/hero-centered
 * Categories: perla, banner
 * Keywords: header, intro, banner
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Hero"},"align":"full","className":"perla-hero","style":{"spacing":{"padding":{"top":"clamp(56px, 8vw, 120px)","bottom":"clamp(56px, 8vw, 120px)"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"tint","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull perla-hero has-tint-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:clamp(56px, 8vw, 120px);padding-bottom:clamp(56px, 8vw, 120px)"><!-- wp:group {"className":"perla-stagger","style":{"spacing":{"blockGap":"24px"}},"layout":{"type":"constrained","contentSize":"820px"}} -->
<div class="wp-block-group perla-stagger"><!-- wp:paragraph {"align":"center","className":"is-style-perla-eyebrow"} -->
<p class="has-text-align-center is-style-perla-eyebrow"><?php echo esc_html__( 'Family dentist in Springfield', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","level":1,"className":"perla-split","fontSize":"display"} -->
<h1 class="wp-block-heading has-text-align-center perla-split has-display-font-size"><?php echo esc_html__( 'Dental care that fits around your life', 'perla' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size"><?php echo esc_html__( 'Evening and Saturday appointments, prices in writing and a team that explains before it drills.', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( perla_soliton_radar( 'contact' ) ); ?>"><?php echo esc_html__( 'Book a visit', 'perla' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="tel:+12175550142">(217) 555-0142</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
