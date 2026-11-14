<?php
/**
 * Title: Blog header
 * Slug: perla/blog-header
 * Inserter: no
 * Viewport Width: 1400
 *
 * Written by tools/build.js from src/patterns.js.
 *
 * @package Perla
 */

?>
<!-- wp:group {"metadata":{"name":"Page header"},"align":"full","className":"perla-hero","style":{"spacing":{"padding":{"top":"clamp(48px, 6vw, 88px)","bottom":"clamp(48px, 6vw, 88px)"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"tint","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull perla-hero has-tint-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:clamp(48px, 6vw, 88px);padding-bottom:clamp(48px, 6vw, 88px)"><!-- wp:group {"className":"perla-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"constrained","contentSize":"820px"}} -->
<div class="wp-block-group perla-stagger"><!-- wp:paragraph {"align":"center","className":"is-style-perla-eyebrow"} -->
<p class="has-text-align-center is-style-perla-eyebrow"><?php echo esc_html__( 'Journal', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","level":1,"className":"perla-split"} -->
<h1 class="wp-block-heading has-text-align-center perla-split"><?php echo esc_html__( 'Notes from the studio', 'perla' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size"><?php echo esc_html__( 'Short answers to the questions we are asked most, written by the team.', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
