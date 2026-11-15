<?php
/**
 * Title: Services with photo
 * Slug: dimora/services-detail
 * Categories: dimora, services
 * Keywords: services, accordion, list
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Services in detail', 'dimora' ); ?>"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"40%"} -->
<div class="wp-block-column" style="flex-basis:40%"><!-- wp:group {"className":"dimora-sticky","style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-sticky"><!-- wp:paragraph {"className":"dimora-statement dimora-split","textColor":"ink","fontSize":"xx-large"} -->
<p class="dimora-statement dimora-split has-ink-color has-text-color has-xx-large-font-size"><?php echo wp_kses_post( __( 'Take one service or all of them. Either way you get one team, one budget and one person to <em>call</em>.', 'dimora' ) ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","className":"dimora-image"} -->
<figure class="wp-block-image size-full dimora-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/services.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Curved staircase with solid timber treads, a glass balustrade and a wooden handrail', 'dimora' ); ?>" style="aspect-ratio:4/3;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"60%","className":"dimora-stagger dimora-rows","style":{"spacing":{"blockGap":"0"}}} -->
<div class="wp-block-column dimora-stagger dimora-rows" style="flex-basis:60%"><!-- wp:details {"className":"is-style-dimora-row"} -->
<details class="wp-block-details is-style-dimora-row"><summary><?php echo esc_html__( 'Interior architecture', 'dimora' ); ?></summary><!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"var:preset|spacing|40","left":"var:preset|spacing|60"}}}} -->
<div class="wp-block-columns"><!-- wp:column {"width":"58%"} -->
<div class="wp-block-column" style="flex-basis:58%"><!-- wp:paragraph -->
<p><?php echo esc_html__( 'Layouts, structure, light and services: the decisions that are hard to change later. We work alongside your architect or lead the project ourselves.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"42%"} -->
<div class="wp-block-column" style="flex-basis:42%"><!-- wp:list {"className":"is-style-dimora-dashes"} -->
<ul class="wp-block-list is-style-dimora-dashes"><!-- wp:list-item -->
<li><?php echo esc_html__( 'Space planning', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Lighting and electrical layouts', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Planning and building control drawings', 'dimora' ); ?></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-dimora-row"} -->
<details class="wp-block-details is-style-dimora-row"><summary><?php echo esc_html__( 'Kitchens and joinery', 'dimora' ); ?></summary><!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"var:preset|spacing|40","left":"var:preset|spacing|60"}}}} -->
<div class="wp-block-columns"><!-- wp:column {"width":"58%"} -->
<div class="wp-block-column" style="flex-basis:58%"><!-- wp:paragraph -->
<p><?php echo esc_html__( 'Kitchens, wardrobes, libraries and the cupboard under the stairs, drawn to the millimetre and made by workshops we have used for years.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"42%"} -->
<div class="wp-block-column" style="flex-basis:42%"><!-- wp:list {"className":"is-style-dimora-dashes"} -->
<ul class="wp-block-list is-style-dimora-dashes"><!-- wp:list-item -->
<li><?php echo esc_html__( 'Bespoke kitchens', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Fitted storage', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Workshop drawings', 'dimora' ); ?></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-dimora-row"} -->
<details class="wp-block-details is-style-dimora-row"><summary><?php echo esc_html__( 'Furniture and styling', 'dimora' ); ?></summary><!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"var:preset|spacing|40","left":"var:preset|spacing|60"}}}} -->
<div class="wp-block-columns"><!-- wp:column {"width":"58%"} -->
<div class="wp-block-column" style="flex-basis:58%"><!-- wp:paragraph -->
<p><?php echo esc_html__( 'Sofas you can sleep on, tables that outlive you and the right lamp for the corner. We source, order, deliver and place every piece.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"42%"} -->
<div class="wp-block-column" style="flex-basis:42%"><!-- wp:list {"className":"is-style-dimora-dashes"} -->
<ul class="wp-block-list is-style-dimora-dashes"><!-- wp:list-item -->
<li><?php echo esc_html__( 'Furniture, fabric and lighting schedules', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Art and objects', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Installation day', 'dimora' ); ?></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-dimora-row"} -->
<details class="wp-block-details is-style-dimora-row"><summary><?php echo esc_html__( 'Project management', 'dimora' ); ?></summary><!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"var:preset|spacing|40","left":"var:preset|spacing|60"}}}} -->
<div class="wp-block-columns"><!-- wp:column {"width":"58%"} -->
<div class="wp-block-column" style="flex-basis:58%"><!-- wp:paragraph -->
<p><?php echo esc_html__( 'One person who knows the drawings, the budget and the builder. We visit site weekly and send you a short report every Friday.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"42%"} -->
<div class="wp-block-column" style="flex-basis:42%"><!-- wp:list {"className":"is-style-dimora-dashes"} -->
<ul class="wp-block-list is-style-dimora-dashes"><!-- wp:list-item -->
<li><?php echo esc_html__( 'Tendering', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Weekly site visits', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Budget tracking', 'dimora' ); ?></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-dimora-row"} -->
<details class="wp-block-details is-style-dimora-row"><summary><?php echo esc_html__( 'Hotels, cafés and shops', 'dimora' ); ?></summary><!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"var:preset|spacing|40","left":"var:preset|spacing|60"}}}} -->
<div class="wp-block-columns"><!-- wp:column {"width":"58%"} -->
<div class="wp-block-column" style="flex-basis:58%"><!-- wp:paragraph -->
<p><?php echo esc_html__( 'Rooms that have to earn a living. We design for the guest and for the person who cleans at six in the morning.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"42%"} -->
<div class="wp-block-column" style="flex-basis:42%"><!-- wp:list {"className":"is-style-dimora-dashes"} -->
<ul class="wp-block-list is-style-dimora-dashes"><!-- wp:list-item -->
<li><?php echo esc_html__( 'Concept and brand fit', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Durable specifications', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Phased openings', 'dimora' ); ?></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-dimora-row"} -->
<details class="wp-block-details is-style-dimora-row"><summary><?php echo esc_html__( 'A day of advice', 'dimora' ); ?></summary><!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"var:preset|spacing|40","left":"var:preset|spacing|60"}}}} -->
<div class="wp-block-columns"><!-- wp:column {"width":"58%"} -->
<div class="wp-block-column" style="flex-basis:58%"><!-- wp:paragraph -->
<p><?php echo esc_html__( 'Not every home needs a full project. Book a day and we will walk the rooms with you and leave a written plan.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"42%"} -->
<div class="wp-block-column" style="flex-basis:42%"><!-- wp:list {"className":"is-style-dimora-dashes"} -->
<ul class="wp-block-list is-style-dimora-dashes"><!-- wp:list-item -->
<li><?php echo esc_html__( 'On-site consultation', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Written recommendations', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Supplier list', 'dimora' ); ?></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></details>
<!-- /wp:details --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
