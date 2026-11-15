<?php
/**
 * Title: Projects as an index with pictures on hover
 * Slug: dimora/projects-list
 * Categories: dimora, portfolio
 * Keywords: portfolio, list, index
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Projects index"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:group {"metadata":{"name":"Heading"},"align":"wide","className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignwide dimora-stagger"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '(Index)', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"dimora-split"} -->
<h2 class="wp-block-heading dimora-split"><?php echo wp_kses_post( __( 'Every project, <em>at a glance</em>', 'dimora' ) ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"List"},"align":"wide","className":"dimora-list dimora-stagger","style":{"spacing":{"blockGap":"0"}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignwide dimora-list dimora-stagger"><!-- wp:group {"metadata":{"name":"Canal House"},"className":"dimora-list-row","style":{"spacing":{"blockGap":"var:preset|spacing|50","padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group dimora-list-row" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label">(01)</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects/canal-house' ) ); ?>"><?php echo esc_html__( 'Canal House', 'dimora' ); ?></a></h3>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"dimora-hide-small","textColor":"muted","fontSize":"small"} -->
<p class="dimora-hide-small has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Townhouse renovation, London', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '210 m²', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full","className":"dimora-list-image"} -->
<figure class="wp-block-image size-full dimora-list-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/canal-house-cover.jpg' ) ); ?>" alt="" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Northlight Loft"},"className":"dimora-list-row","style":{"spacing":{"blockGap":"var:preset|spacing|50","padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group dimora-list-row" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label">(02)</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects/northlight-loft' ) ); ?>"><?php echo esc_html__( 'Northlight Loft', 'dimora' ); ?></a></h3>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"dimora-hide-small","textColor":"muted","fontSize":"small"} -->
<p class="dimora-hide-small has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Warehouse apartment, Manchester', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '145 m²', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full","className":"dimora-list-image"} -->
<figure class="wp-block-image size-full dimora-list-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/northlight-loft-cover.jpg' ) ); ?>" alt="" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"The Orchard"},"className":"dimora-list-row","style":{"spacing":{"blockGap":"var:preset|spacing|50","padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group dimora-list-row" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label">(03)</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects/the-orchard' ) ); ?>"><?php echo esc_html__( 'The Orchard', 'dimora' ); ?></a></h3>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"dimora-hide-small","textColor":"muted","fontSize":"small"} -->
<p class="dimora-hide-small has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Country house, Somerset', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '320 m²', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full","className":"dimora-list-image"} -->
<figure class="wp-block-image size-full dimora-list-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/the-orchard-cover.jpg' ) ); ?>" alt="" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Casa Arenal"},"className":"dimora-list-row","style":{"spacing":{"blockGap":"var:preset|spacing|50","padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group dimora-list-row" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label">(04)</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects/casa-arenal' ) ); ?>"><?php echo esc_html__( 'Casa Arenal', 'dimora' ); ?></a></h3>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"dimora-hide-small","textColor":"muted","fontSize":"small"} -->
<p class="dimora-hide-small has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Seaside apartment, Lisbon', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '95 m²', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full","className":"dimora-list-image"} -->
<figure class="wp-block-image size-full dimora-list-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/casa-arenal-cover.jpg' ) ); ?>" alt="" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"The Reading Rooms"},"className":"dimora-list-row","style":{"spacing":{"blockGap":"var:preset|spacing|50","padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group dimora-list-row" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label">(05)</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects/reading-rooms' ) ); ?>"><?php echo esc_html__( 'The Reading Rooms', 'dimora' ); ?></a></h3>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"dimora-hide-small","textColor":"muted","fontSize":"small"} -->
<p class="dimora-hide-small has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Boutique hotel, Edinburgh', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '14 rooms', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full","className":"dimora-list-image"} -->
<figure class="wp-block-image size-full dimora-list-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/reading-rooms-cover.jpg' ) ); ?>" alt="" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Atelier Café"},"className":"dimora-list-row","style":{"spacing":{"blockGap":"var:preset|spacing|50","padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group dimora-list-row" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label">(06)</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="<?php echo esc_url( dimora_soliton_radar( 'projects/atelier-cafe' ) ); ?>"><?php echo esc_html__( 'Atelier Café', 'dimora' ); ?></a></h3>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"dimora-hide-small","textColor":"muted","fontSize":"small"} -->
<p class="dimora-hide-small has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Café and bakery, Copenhagen', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '80 m²', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full","className":"dimora-list-image"} -->
<figure class="wp-block-image size-full dimora-list-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/atelier-cafe-cover.jpg' ) ); ?>" alt="" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
