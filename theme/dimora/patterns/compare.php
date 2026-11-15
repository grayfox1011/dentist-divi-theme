<?php
/**
 * Title: Drawing and room slider
 * Slug: dimora/compare
 * Categories: dimora, gallery
 * Keywords: before, after, compare, slider
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Drawing and room"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","width":"38%","style":{"spacing":{"blockGap":"var:preset|spacing|50"}}} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:38%"><!-- wp:group {"metadata":{"name":"Heading"},"className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-stagger"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '(From drawing to room)', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"dimora-split"} -->
<h2 class="wp-block-heading dimora-split"><?php echo wp_kses_post( __( 'What we draw is what gets <em>built</em>', 'dimora' ) ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"dimora-reveal dimora-measure"} -->
<p class="dimora-reveal dimora-measure"><?php echo esc_html__( 'Drag the handle. Every project is drawn in full before a builder is asked for a price, so the room you approve on paper is the room you walk into.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"62%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:62%"><!-- wp:group {"metadata":{"name":"Drag to compare"},"className":"dimora-compare dimora-reveal","layout":{"type":"default"}} -->
<div class="wp-block-group dimora-compare dimora-reveal"><!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/compare-sketch.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Pencil drawing of the same bedroom, with the bed, headboard and blinds in outline', 'dimora' ); ?>" style="aspect-ratio:4/3;object-fit:cover"/><figcaption class="wp-element-caption"><?php echo esc_html__( 'Drawing', 'dimora' ); ?></figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/compare-built.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Bedroom with a low timber bed, an arched panelled headboard and grey blinds', 'dimora' ); ?>" style="aspect-ratio:4/3;object-fit:cover"/><figcaption class="wp-element-caption"><?php echo esc_html__( 'Built', 'dimora' ); ?></figcaption></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
