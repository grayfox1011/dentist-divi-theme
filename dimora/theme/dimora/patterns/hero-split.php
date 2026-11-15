<?php
/**
 * Title: Hero with photo beside the title
 * Slug: dimora/hero-split
 * Categories: dimora, banner
 * Keywords: header, intro, banner
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Hero with photo', 'dimora' ); ?>"},"align":"full","className":"dimora-hero","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|80"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull dimora-hero has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:columns {"verticalAlignment":"bottom","align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-bottom"><!-- wp:column {"verticalAlignment":"bottom","width":"58%","style":{"spacing":{"blockGap":"var:preset|spacing|60"}}} -->
<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:58%"><!-- wp:paragraph {"className":"is-style-dimora-label dimora-reveal"} -->
<p class="is-style-dimora-label dimora-reveal"><?php echo esc_html__( 'Interior architecture studio', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"className":"dimora-split","fontSize":"huge"} -->
<h1 class="wp-block-heading dimora-split has-huge-font-size"><?php echo wp_kses_post( __( 'Rooms that feel like <em>you</em> on a good day.', 'dimora' ) ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"dimora-measure dimora-reveal","fontSize":"large"} -->
<p class="dimora-measure dimora-reveal has-large-font-size"><?php echo esc_html__( 'A small studio for considered homes, hotels and cafés. We work across Britain and, now and then, a little further.', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"className":"dimora-reveal","style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"flex"}} -->
<div class="wp-block-buttons dimora-reveal"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( dimora_soliton_radar( 'contact' ) ); ?>"><?php echo esc_html__( 'Start a project', 'dimora' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( dimora_soliton_radar( 'projects' ) ); ?>"><?php echo esc_html__( 'See the projects', 'dimora' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"bottom","width":"42%"} -->
<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:42%"><!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full","className":"dimora-image dimora-parallax"} -->
<figure class="wp-block-image size-full dimora-image dimora-parallax"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/studio-2.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Wooden shelves on a black steel frame with a carved bird and a wire tree sculpture', 'dimora' ); ?>" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
