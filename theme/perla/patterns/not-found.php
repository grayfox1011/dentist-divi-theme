<?php
/**
 * Title: Page not found
 * Slug: perla/not-found
 * Inserter: no
 * Viewport Width: 1400
 *
 * Written by tools/build.js from src/patterns.js.
 *
 * @package Perla
 */

?>
<!-- wp:group {"metadata":{"name":"Not found"},"align":"full","style":{"spacing":{"padding":{"top":"clamp(72px, 10vw, 160px)","bottom":"clamp(72px, 10vw, 160px)"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"mist","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-mist-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:clamp(72px, 10vw, 160px);padding-bottom:clamp(72px, 10vw, 160px)"><!-- wp:group {"className":"perla-stagger","style":{"spacing":{"blockGap":"18px"}},"layout":{"type":"constrained","contentSize":"640px"}} -->
<div class="wp-block-group perla-stagger"><!-- wp:paragraph {"align":"center","className":"perla-404"} -->
<p class="has-text-align-center perla-404">404</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(30px, 3.6vw, 44px)"}}} -->
<h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(30px, 3.6vw, 44px)"><?php echo esc_html__( 'This page has gone missing', 'perla' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size"><?php echo esc_html__( 'The link may be out of date, or the page may have moved. Let’s get you back on track.', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo esc_html__( 'Back to home', 'perla' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php echo esc_html__( 'Contact us', 'perla' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
