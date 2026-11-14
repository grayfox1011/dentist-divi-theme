<?php
/**
 * Title: Before and after
 * Slug: perla/before-after
 * Categories: perla
 * Keywords: gallery, compare, results
 * Viewport Width: 1400
 *
 * Written by tools/build.js from src/patterns.js.
 *
 * @package Perla
 */

?>
<!-- wp:group {"metadata":{"name":"Before and after"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"mist","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-mist-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","width":"42%","className":"perla-stagger","style":{"spacing":{"blockGap":"20px"}}} -->
<div class="wp-block-column is-vertically-aligned-center perla-stagger" style="flex-basis:42%"><!-- wp:paragraph {"className":"is-style-perla-eyebrow"} -->
<p class="is-style-perla-eyebrow"><?php echo esc_html__( 'Before and after', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"perla-split"} -->
<h2 class="wp-block-heading perla-split"><?php echo esc_html__( 'See the difference for yourself', 'perla' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'At your consultation we can show you more cases like yours, so you know what to expect before you decide anything.', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:list {"className":"is-style-perla-checks"} -->
<ul class="wp-block-list is-style-perla-checks"><!-- wp:list-item -->
<li><?php echo esc_html__( 'Whitening', 'perla' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Veneers and bonding', 'perla' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Clear aligners', 'perla' ); ?></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:buttons {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"flex"}} -->
<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php echo esc_html__( 'See all treatments', 'perla' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"58%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:58%"><!-- wp:columns {"isStackedOnMobile":false,"className":"perla-reveal","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|40","left":"var:preset|spacing|40"}}}} -->
<div class="wp-block-columns is-not-stacked-on-mobile perla-reveal"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","className":"perla-compare"} -->
<figure class="wp-block-image size-full perla-compare"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/smile-before.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'A smile before whitening', 'perla' ); ?>" style="aspect-ratio:4/3;object-fit:cover"/><figcaption class="wp-element-caption"><?php echo esc_html__( 'Before', 'perla' ); ?></figcaption></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","className":"perla-compare"} -->
<figure class="wp-block-image size-full perla-compare"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/smile-after.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'The same smile after whitening', 'perla' ); ?>" style="aspect-ratio:4/3;object-fit:cover"/><figcaption class="wp-element-caption"><?php echo esc_html__( 'After', 'perla' ); ?></figcaption></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
