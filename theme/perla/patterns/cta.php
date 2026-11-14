<?php
/**
 * Title: Call to action
 * Slug: perla/cta
 * Categories: perla, call-to-action
 * Keywords: cta, banner, booking
 * Viewport Width: 1400
 *
 * Written by tools/build.js from src/patterns.js.
 *
 * @package Perla
 */

?>
<!-- wp:group {"metadata":{"name":"Call to action"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"mist","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-mist-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"verticalAlignment":"center","align":"wide","className":"perla-pop perla-panel","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"},"padding":{"top":"clamp(36px, 5vw, 72px)","right":"clamp(36px, 5vw, 72px)","bottom":"clamp(36px, 5vw, 72px)","left":"clamp(36px, 5vw, 72px)"}},"border":{"radius":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dradius\u002d\u002dlarge)"}},"backgroundColor":"dark"} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center perla-pop perla-panel has-dark-background-color has-background" style="border-radius:var(--wp--custom--radius--large);padding-top:clamp(36px, 5vw, 72px);padding-right:clamp(36px, 5vw, 72px);padding-bottom:clamp(36px, 5vw, 72px);padding-left:clamp(36px, 5vw, 72px)"><!-- wp:column {"verticalAlignment":"center","width":"66%","className":"perla-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|40"}}} -->
<div class="wp-block-column is-vertically-aligned-center perla-stagger" style="flex-basis:66%"><!-- wp:heading {"className":"perla-split","textColor":"white"} -->
<h2 class="wp-block-heading perla-split has-white-color has-text-color"><?php echo esc_html__( 'Overdue for a check-up?', 'perla' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"large"} -->
<p class="perla-on-dark has-large-font-size"><?php echo esc_html__( 'Most people are. Book online in about a minute, or call and we will find a time that suits you.', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"34%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:34%"><!-- wp:buttons {"className":"perla-stagger perla-panel-buttons","style":{"spacing":{"blockGap":"14px"}},"layout":{"type":"flex"}} -->
<div class="wp-block-buttons perla-stagger perla-panel-buttons"><!-- wp:button {"className":"is-style-perla-light"} -->
<div class="wp-block-button is-style-perla-light"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php echo esc_html__( 'Book a visit', 'perla' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-perla-ghost"} -->
<div class="wp-block-button is-style-perla-ghost"><a class="wp-block-button__link wp-element-button" href="tel:+12175550142">(217) 555-0142</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
