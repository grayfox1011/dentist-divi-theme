<?php
/**
 * Title: Projects in a sideways gallery
 * Slug: dimora/projects-rail
 * Categories: dimora, portfolio
 * Keywords: portfolio, gallery, horizontal, work
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Projects rail', 'dimora' ); ?>"},"align":"full","className":"dimora-rail","style":{"spacing":{"margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull dimora-rail has-base-background-color has-background" style="margin-top:0;margin-bottom:0"><!-- wp:group {"className":"dimora-rail-pin","style":{"spacing":{"blockGap":"var:preset|spacing|60","padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-rail-pin" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Heading', 'dimora' ); ?>"},"className":"dimora-rail-head","style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"bottom"}} -->
<div class="wp-block-group dimora-rail-head"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '(Selected work)', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"dimora-split"} -->
<h2 class="wp-block-heading dimora-split"><?php echo wp_kses_post( __( 'Six places we are <em>proud</em> of', 'dimora' ) ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"dimora-arrow-link"} -->
<p class="dimora-arrow-link"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects' ) ); ?>"><?php echo esc_html__( 'All projects', 'dimora' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"dimora-rail-track","style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group dimora-rail-track"><!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Canal House', 'dimora' ); ?>"},"className":"dimora-card dimora-cursor","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-card dimora-cursor"><!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/canal-house-cover.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Garden room with a long wooden table, cane chairs, white curtains and potted plants', 'dimora' ); ?>" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects/canal-house' ) ); ?>"><?php echo esc_html__( 'Canal House', 'dimora' ); ?></a></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Townhouse renovation, London', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label">(01)</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Northlight Loft', 'dimora' ); ?>"},"className":"dimora-card dimora-cursor","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-card dimora-cursor"><!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/northlight-loft-cover.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Double-height lounge with grey sofas, a planted wall and a curved steel and timber staircase', 'dimora' ); ?>" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects/northlight-loft' ) ); ?>"><?php echo esc_html__( 'Northlight Loft', 'dimora' ); ?></a></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Warehouse apartment, Manchester', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label">(02)</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'The Orchard', 'dimora' ); ?>"},"className":"dimora-card dimora-cursor","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-card dimora-cursor"><!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/the-orchard-cover.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Open terrace door with a linen curtain, a rattan chair and dark green shutters beyond', 'dimora' ); ?>" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects/the-orchard' ) ); ?>"><?php echo esc_html__( 'The Orchard', 'dimora' ); ?></a></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Country house, Somerset', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label">(03)</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Casa Arenal', 'dimora' ); ?>"},"className":"dimora-card dimora-cursor","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-card dimora-cursor"><!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/casa-arenal-cover.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Two white shell chairs in warm sunlight beside sheer curtains', 'dimora' ); ?>" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects/casa-arenal' ) ); ?>"><?php echo esc_html__( 'Casa Arenal', 'dimora' ); ?></a></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Seaside apartment, Lisbon', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label">(04)</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'The Reading Rooms', 'dimora' ); ?>"},"className":"dimora-card dimora-cursor","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-card dimora-cursor"><!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/reading-rooms-cover.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Spaniel resting on a brown leather armchair beside a cast-iron stove', 'dimora' ); ?>" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects/reading-rooms' ) ); ?>"><?php echo esc_html__( 'The Reading Rooms', 'dimora' ); ?></a></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Boutique hotel, Edinburgh', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label">(05)</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Atelier Café', 'dimora' ); ?>"},"className":"dimora-card dimora-cursor","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-card dimora-cursor"><!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/atelier-cafe-cover.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Grey tub chairs, a round black table and an orange sofa beside a timber screen and tall windows', 'dimora' ); ?>" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects/atelier-cafe' ) ); ?>"><?php echo esc_html__( 'Atelier Café', 'dimora' ); ?></a></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Café and bakery, Copenhagen', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label">(06)</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
