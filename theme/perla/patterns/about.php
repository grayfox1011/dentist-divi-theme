<?php
/**
 * Title: Photo and text with checklist
 * Slug: perla/about
 * Categories: perla, about
 * Keywords: about, features, image
 * Viewport Width: 1400
 *
 * Written by tools/build.js from src/patterns.js.
 *
 * @package Perla
 */

?>
<!-- wp:group {"metadata":{"name":"How we work"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"tint","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-tint-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center"><!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","className":"perla-image"} -->
<figure class="wp-block-image size-full perla-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/studio.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'One of our treatment rooms', 'perla' ); ?>" style="aspect-ratio:4/3;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","className":"perla-stagger","style":{"spacing":{"blockGap":"20px"}}} -->
<div class="wp-block-column is-vertically-aligned-center perla-stagger"><!-- wp:paragraph {"className":"is-style-perla-eyebrow"} -->
<p class="is-style-perla-eyebrow"><?php echo esc_html__( 'How we work', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"perla-split"} -->
<h2 class="wp-block-heading perla-split"><?php echo esc_html__( 'Longer appointments, plainer answers', 'perla' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Most of what makes a dental visit stressful is not knowing what is coming. So we book 45 minutes for a first visit, show you your X-rays on screen and explain what we see in normal words. Nothing gets done until you have seen the price.', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:list {"className":"is-style-perla-checks"} -->
<ul class="wp-block-list is-style-perla-checks"><!-- wp:list-item -->
<li><?php echo esc_html__( 'Numbing gel before every injection', 'perla' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Digital X-rays and a 3D scanner in the studio', 'perla' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'A written quote first, and payment plans of up to 12 months', 'perla' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Open until 7pm on weekdays and on Saturday mornings', 'perla' ); ?></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:buttons {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"flex"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php echo esc_html__( 'Meet the team', 'perla' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php echo esc_html__( 'Our story', 'perla' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
