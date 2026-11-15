<?php
/**
 * Title: Studio with photo and numbers
 * Slug: dimora/studio
 * Categories: dimora, about
 * Keywords: about, numbers, image
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Studio"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","width":"44%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:44%"><!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full","className":"dimora-image dimora-parallax"} -->
<figure class="wp-block-image size-full dimora-image dimora-parallax"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/studio.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Open shelving of steel and wood with baskets, dried grasses and a small vintage radio', 'dimora' ); ?>" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"56%","style":{"spacing":{"blockGap":"var:preset|spacing|60"}}} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:56%"><!-- wp:group {"metadata":{"name":"Heading"},"className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-stagger"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '(The studio)', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"dimora-split"} -->
<h2 class="wp-block-heading dimora-split"><?php echo wp_kses_post( __( 'Nine people, one long table, 2,000 <em>samples</em>', 'dimora' ) ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"dimora-reveal dimora-measure"} -->
<p class="dimora-reveal dimora-measure"><?php echo esc_html__( 'The studio was started in 2013 by Marta Lind, after eight years of designing other people’s houses under other people’s names. We are still small on purpose: the person you meet is the person who draws your kitchen.', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"metadata":{"name":"Numbers"},"className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"grid","minimumColumnWidth":"150px"}} -->
<div class="wp-block-group dimora-stagger"><!-- wp:group {"className":"dimora-stat","style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-stat"><!-- wp:paragraph {"className":"dimora-number","textColor":"ink"} -->
<p class="dimora-number has-ink-color has-text-color">64</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Homes and places completed', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"dimora-stat","style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-stat"><!-- wp:paragraph {"className":"dimora-number","textColor":"ink"} -->
<p class="dimora-number has-ink-color has-text-color">12</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Years of practice', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"dimora-stat","style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-stat"><!-- wp:paragraph {"className":"dimora-number","textColor":"ink"} -->
<p class="dimora-number has-ink-color has-text-color">9</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'People in the studio', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"dimora-stat","style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-stat"><!-- wp:paragraph {"className":"dimora-number","textColor":"ink"} -->
<p class="dimora-number has-ink-color has-text-color">4</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Countries we have built in', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"dimora-arrow-link dimora-reveal"} -->
<p class="dimora-arrow-link dimora-reveal"><a href="<?php echo esc_url( home_url( '/studio/' ) ); ?>"><?php echo esc_html__( 'Meet the studio', 'dimora' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
