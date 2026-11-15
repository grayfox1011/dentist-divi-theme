<?php
/**
 * Title: Statement in large type
 * Slug: dimora/statement
 * Categories: dimora, text
 * Keywords: intro, about, text
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Statement"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"25%"} -->
<div class="wp-block-column" style="flex-basis:25%"><!-- wp:paragraph {"className":"is-style-dimora-label dimora-reveal"} -->
<p class="is-style-dimora-label dimora-reveal"><?php echo esc_html__( '(About)', 'dimora' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"75%","style":{"spacing":{"blockGap":"var:preset|spacing|60"}}} -->
<div class="wp-block-column" style="flex-basis:75%"><!-- wp:paragraph {"className":"dimora-statement dimora-split","textColor":"ink","fontSize":"xx-large"} -->
<p class="dimora-statement dimora-split has-ink-color has-text-color has-xx-large-font-size"><?php echo wp_kses_post( __( 'A good room is mostly proportion, light and where the door goes. We start there. The sofa comes <em>much</em> later.', 'dimora' ) ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"dimora-arrow-link dimora-reveal"} -->
<p class="dimora-arrow-link dimora-reveal"><a href="<?php echo esc_url( dimora_soliton_radar( 'studio' ) ); ?>"><?php echo esc_html__( 'About the studio', 'dimora' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
