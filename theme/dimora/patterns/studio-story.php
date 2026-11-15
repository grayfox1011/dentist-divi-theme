<?php
/**
 * Title: Story with tall photo
 * Slug: dimora/studio-story
 * Categories: dimora, about
 * Keywords: about, story, text
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Story', 'dimora' ); ?>"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"54%","style":{"spacing":{"blockGap":"var:preset|spacing|60"}}} -->
<div class="wp-block-column" style="flex-basis:54%"><!-- wp:paragraph {"className":"dimora-statement dimora-split","textColor":"ink","fontSize":"xx-large"} -->
<p class="dimora-statement dimora-split has-ink-color has-text-color has-xx-large-font-size"><?php echo wp_kses_post( __( 'We design homes, and a few hotels and cafés, for people who notice how a door handle feels. The work is slow, detailed and <em>worth it</em>.', 'dimora' ) ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-stagger"><!-- wp:paragraph {"className":"dimora-measure"} -->
<p class="dimora-measure"><?php echo esc_html__( 'Marta Lind started the studio in 2013 at a kitchen table in Hackney. The table is now in our meeting room, with more coffee rings and the same wobble.', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-measure"} -->
<p class="dimora-measure"><?php echo esc_html__( 'We take on about eight projects a year. That is few enough for the same designer to stay with you from the first sketch to the day the pictures are hung.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"46%"} -->
<div class="wp-block-column" style="flex-basis:46%"><!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full","className":"dimora-image dimora-parallax"} -->
<figure class="wp-block-image size-full dimora-image dimora-parallax"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/studio-2.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Wooden shelves on a black steel frame with a carved bird and a wire tree sculpture', 'dimora' ); ?>" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
