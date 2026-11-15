<?php
/**
 * Title: Studio
 * Slug: dimora/page-studio
 * Categories: dimora-pages
 * Keywords: about, studio, team
 * Block Types: core/post-content
 * Post Types: page
 * Viewport Width: 1400
 */
?>
<!-- wp:pattern {"slug":"dimora/studio-story"} /-->

<!-- wp:pattern {"slug":"dimora/numbers"} /-->

<!-- wp:pattern {"slug":"dimora/values"} /-->

<!-- wp:pattern {"slug":"dimora/team"} /-->

<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Quote', 'dimora' ); ?>"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:group {"align":"wide","className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"constrained","contentSize":"1040px"}} -->
<div class="wp-block-group alignwide dimora-stagger"><!-- wp:paragraph {"align":"center","className":"is-style-dimora-label"} -->
<p class="has-text-align-center is-style-dimora-label"><?php echo esc_html__( '(In their words)', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center","className":"dimora-quote","textColor":"ink"} -->
<p class="has-text-align-center dimora-quote has-ink-color has-text-color"><?php echo esc_html__( '“Two years on, we have not moved a single piece of furniture.”', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center","textColor":"muted","fontSize":"small"} -->
<p class="has-text-align-center has-muted-color has-text-color has-small-font-size"><?php echo esc_html__( 'The Aldous family', 'dimora' ); ?> · <a href="<?php echo esc_url( dimora_soliton_radar( 'projects/the-orchard' ) ); ?>"><?php echo esc_html__( 'The Orchard', 'dimora' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:pattern {"slug":"dimora/cta"} /-->
