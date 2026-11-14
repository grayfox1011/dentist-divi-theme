<?php
/**
 * Title: One review in large type
 * Slug: perla/review-featured
 * Categories: perla, testimonials
 * Keywords: testimonial, quote, review
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Featured review"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"tint","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-tint-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:group {"className":"perla-stagger","style":{"spacing":{"blockGap":"24px"}},"layout":{"type":"constrained","contentSize":"880px"}} -->
<div class="wp-block-group perla-stagger"><!-- wp:paragraph {"align":"center","className":"perla-stars","style":{"typography":{"fontSize":"22px","lineHeight":"1","letterSpacing":"2px"}},"textColor":"star"} -->
<p class="has-text-align-center perla-stars has-star-color has-text-color" style="font-size:22px;letter-spacing:2px;line-height:1">★★★★★</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center","className":"perla-big-quote","textColor":"heading"} -->
<p class="has-text-align-center perla-big-quote has-heading-color has-text-color"><?php echo esc_html__( '“I put off going for six years because I was embarrassed. Nobody here made me feel that way. Two months later I smile in photos again.”', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center","fontSize":"small"} -->
<p class="has-text-align-center has-small-font-size"><strong><?php echo esc_html__( 'Laura S.', 'perla' ); ?></strong> · <?php echo esc_html__( 'Patient since 2022', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
