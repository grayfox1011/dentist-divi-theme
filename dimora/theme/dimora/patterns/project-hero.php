<?php
/**
 * Title: Project: title, facts and photo
 * Slug: dimora/project-hero
 * Categories: dimora, portfolio
 * Keywords: project, case study, facts
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Project', 'dimora' ); ?>"},"align":"full","className":"dimora-hero","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"0px"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull dimora-hero has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--60);padding-bottom:0px"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignwide"><!-- wp:paragraph {"className":"is-style-dimora-label dimora-reveal"} -->
<p class="is-style-dimora-label dimora-reveal"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects' ) ); ?>"><?php echo esc_html__( 'Projects', 'dimora' ); ?></a> / <?php echo esc_html__( 'Townhouse renovation', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"className":"dimora-split","fontSize":"display"} -->
<h1 class="wp-block-heading dimora-split has-display-font-size"><?php echo esc_html__( 'Canal House', 'dimora' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:columns {"verticalAlignment":"bottom","className":"dimora-stagger","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns are-vertically-aligned-bottom dimora-stagger"><!-- wp:column {"verticalAlignment":"bottom","width":"50%"} -->
<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:50%"><!-- wp:paragraph {"className":"dimora-measure","fontSize":"large"} -->
<p class="dimora-measure has-large-font-size"><?php echo esc_html__( 'A narrow Victorian house opened up to the water it had turned its back on.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"bottom","width":"50%"} -->
<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:50%"><!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Facts', 'dimora' ); ?>"},"className":"dimora-facts","style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"grid","minimumColumnWidth":"240px"}} -->
<div class="wp-block-group dimora-facts"><!-- wp:group {"className":"dimora-fact","style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-fact"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'Location', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"ink"} -->
<p class="has-ink-color has-text-color"><?php echo esc_html__( 'London', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"dimora-fact","style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-fact"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'Year', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"ink"} -->
<p class="has-ink-color has-text-color"><?php echo esc_html__( '2025', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"dimora-fact","style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-fact"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'Size', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"ink"} -->
<p class="has-ink-color has-text-color"><?php echo esc_html__( '210 m²', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"dimora-fact","style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-fact"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'Scope', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"ink"} -->
<p class="has-ink-color has-text-color"><?php echo esc_html__( 'Interior architecture, joinery, furniture', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->

<!-- wp:image {"aspectRatio":"16/9","scale":"cover","sizeSlug":"full","align":"wide","className":"dimora-image dimora-parallax"} -->
<figure class="wp-block-image alignwide size-full dimora-image dimora-parallax"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/canal-house-cover.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Garden room with a long wooden table, cane chairs, white curtains and potted plants', 'dimora' ); ?>" style="aspect-ratio:16/9;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->
