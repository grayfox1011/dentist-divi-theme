<?php
/**
 * Title: Project: link to the next project
 * Slug: dimora/project-next
 * Categories: dimora, portfolio
 * Keywords: project, next, navigation
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Next project', 'dimora' ); ?>"},"align":"full","className":"dimora-next dimora-cursor","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull dimora-next dimora-cursor has-surface-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","width":"58%","className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|40"}}} -->
<div class="wp-block-column is-vertically-aligned-center dimora-stagger" style="flex-basis:58%"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '(Next project)', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"fontSize":"huge"} -->
<h2 class="wp-block-heading has-huge-font-size"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects/northlight-loft' ) ); ?>"><?php echo esc_html__( 'Northlight Loft', 'dimora' ); ?></a></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Warehouse apartment, Manchester', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"42%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:42%"><!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","className":"dimora-image"} -->
<figure class="wp-block-image size-full dimora-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/northlight-loft-cover.jpg' ) ); ?>" alt="" style="aspect-ratio:4/3;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
