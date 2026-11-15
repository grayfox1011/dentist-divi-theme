<?php
/**
 * Title: Project: gallery of three photos
 * Slug: dimora/project-gallery
 * Categories: dimora, portfolio
 * Keywords: project, gallery, images
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Gallery"},"align":"full","style":{"spacing":{"padding":{"top":"0px","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:0px;padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"align":"wide","className":"dimora-pair","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide dimora-pair"><!-- wp:column {"width":"46%"} -->
<div class="wp-block-column" style="flex-basis:46%"><!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full","className":"dimora-image"} -->
<figure class="wp-block-image size-full dimora-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/canal-house-1.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Stone steps beside a rough plastered wall with a patch of sunlight', 'dimora' ); ?>" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"54%","className":"dimora-drop"} -->
<div class="wp-block-column dimora-drop" style="flex-basis:54%"><!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full","className":"dimora-image dimora-parallax"} -->
<figure class="wp-block-image size-full dimora-image dimora-parallax"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/canal-house-2.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'White ribbed vase with dried grasses in a plastered wall niche', 'dimora' ); ?>" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:image {"aspectRatio":"16/9","scale":"cover","sizeSlug":"full","align":"wide","className":"dimora-image dimora-parallax"} -->
<figure class="wp-block-image alignwide size-full dimora-image dimora-parallax"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/canal-house-3.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Hydrangeas in a glass bowl on a pale wooden table in morning sun', 'dimora' ); ?>" style="aspect-ratio:16/9;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->
