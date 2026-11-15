<?php
/**
 * Title: Contact details and brief
 * Slug: dimora/contact
 * Categories: dimora, contact
 * Keywords: contact, address, phone
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Contact"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"56%","style":{"spacing":{"blockGap":"var:preset|spacing|70"}}} -->
<div class="wp-block-column" style="flex-basis:56%"><!-- wp:paragraph {"className":"dimora-statement dimora-split","textColor":"ink","fontSize":"xx-large"} -->
<p class="dimora-statement dimora-split has-ink-color has-text-color has-xx-large-font-size"><?php echo wp_kses_post( __( 'Tell us about the place, the people who use it and what is <em>not</em> working. A few lines are enough to start.', 'dimora' ) ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"metadata":{"name":"Details"},"className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"grid","minimumColumnWidth":"220px"}} -->
<div class="wp-block-group dimora-stagger"><!-- wp:group {"className":"dimora-fact","style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-fact"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'Write', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"ink","fontSize":"large"} -->
<p class="has-ink-color has-text-color has-large-font-size"><a href="mailto:hello@example.com">hello@example.com</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"dimora-fact","style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-fact"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'Call', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"ink","fontSize":"large"} -->
<p class="has-ink-color has-text-color has-large-font-size"><a href="tel:+442079460321">020 7946 0321</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"dimora-fact","style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-fact"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'Visit', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"ink","fontSize":"large"} -->
<p class="has-ink-color has-text-color has-large-font-size"><?php echo esc_html__( '18 Larkspur Yard, London E2', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"dimora-fact","style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-fact"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( 'Hours', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"ink","fontSize":"large"} -->
<p class="has-ink-color has-text-color has-large-font-size"><?php echo esc_html__( 'Monday to Friday, 9am – 6pm', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Brief"},"className":"dimora-reveal dimora-brief","style":{"spacing":{"blockGap":"var:preset|spacing|50","padding":{"top":"var:preset|spacing|60"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-reveal dimora-brief" style="padding-top:var(--wp--preset--spacing--60)"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '(Useful to know)', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:list {"className":"is-style-dimora-dashes"} -->
<ul class="wp-block-list is-style-dimora-dashes"><!-- wp:list-item -->
<li><?php echo esc_html__( 'What kind of place it is, and roughly how big', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'Where it is', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'When you would like to start', 'dimora' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'A budget, even a rough one', 'dimora' ); ?></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:buttons {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"flex"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="mailto:hello@example.com"><?php echo esc_html__( 'Write to us', 'dimora' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="tel:+442079460321"><?php echo esc_html__( 'Call the studio', 'dimora' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:paragraph {"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'Would you rather have a form here? Put the form block of your favourite form plugin in place of these buttons.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"44%"} -->
<div class="wp-block-column" style="flex-basis:44%"><!-- wp:image {"aspectRatio":"4/5","scale":"cover","sizeSlug":"full","className":"dimora-image dimora-parallax"} -->
<figure class="wp-block-image size-full dimora-image dimora-parallax"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/contact.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'Corridor of white arches lit from the floor, leading to a dark doorway', 'dimora' ); ?>" style="aspect-ratio:4/5;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
