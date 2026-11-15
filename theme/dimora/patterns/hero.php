<?php
/**
 * Title: Hero with large title and photo
 * Slug: dimora/hero
 * Categories: dimora, banner
 * Keywords: header, intro, banner
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Hero"},"align":"full","className":"dimora-hero","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"0px"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull dimora-hero has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--60);padding-bottom:0px"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|70"}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignwide"><!-- wp:group {"metadata":{"name":"Details"},"className":"dimora-meta dimora-reveal","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group dimora-meta dimora-reveal"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'Interior architecture studio', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'London, since 2013', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:heading {"level":1,"className":"dimora-split","fontSize":"display"} -->
<h1 class="wp-block-heading dimora-split has-display-font-size"><?php echo wp_kses_post( __( 'Homes with a <em>quiet</em> kind of character.', 'dimora' ) ); ?></h1>
<!-- /wp:heading -->

<!-- wp:columns {"verticalAlignment":"bottom","className":"dimora-stagger","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns are-vertically-aligned-bottom dimora-stagger"><!-- wp:column {"verticalAlignment":"bottom","width":"50%","className":"dimora-hide-small"} -->
<div class="wp-block-column is-vertically-aligned-bottom dimora-hide-small" style="flex-basis:50%"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '(Selected work, 2022 – 2025)', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"bottom","width":"50%","style":{"spacing":{"blockGap":"var:preset|spacing|50"}}} -->
<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:50%"><!-- wp:paragraph {"className":"dimora-measure","fontSize":"large"} -->
<p class="dimora-measure has-large-font-size"><?php echo esc_html__( 'We plan the rooms, draw the joinery and choose the last lamp, for people who would rather live in their home than show it off.', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-arrow-link"} -->
<p class="dimora-arrow-link"><a href="<?php echo esc_url( home_url( '/projects/' ) ); ?>"><?php echo esc_html__( 'See the projects', 'dimora' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->

<!-- wp:image {"aspectRatio":"16/9","scale":"cover","sizeSlug":"full","align":"full","className":"dimora-image dimora-parallax"} -->
<figure class="wp-block-image alignfull size-full dimora-image dimora-parallax"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/hero.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Sunlit lounge with coral armchairs, grey sofas and arched timber doors facing the water', 'dimora' ); ?>" style="aspect-ratio:16/9;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->
