<?php
/**
 * Title: Front page
 * Slug: dimora/front-page
 * Inserter: no
 * Viewport Width: 1400
 */
?>
<?php if ( dimora_big_boss() ) : ?>
<!-- wp:post-content {"align":"full","className":"dimora-content","layout":{"type":"constrained"}} /-->
<?php elseif ( is_home() && is_paged() ) : ?>
<!-- wp:pattern {"slug":"dimora/blog-header"} /-->

<!-- wp:pattern {"slug":"dimora/posts-loop"} /-->
<?php elseif ( is_home() ) : ?>
<!-- wp:pattern {"slug":"dimora/hero"} /-->

<!-- wp:pattern {"slug":"dimora/statement"} /-->

<!-- wp:pattern {"slug":"dimora/projects-rail"} /-->

<!-- wp:pattern {"slug":"dimora/services"} /-->

<!-- wp:pattern {"slug":"dimora/studio"} /-->

<!-- wp:pattern {"slug":"dimora/process"} /-->

<!-- wp:pattern {"slug":"dimora/quote"} /-->

<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Journal', 'dimora' ); ?>"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Heading', 'dimora' ); ?>"},"align":"wide","className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignwide dimora-stagger"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '(Journal)', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"dimora-split"} -->
<h2 class="wp-block-heading dimora-split"><?php echo wp_kses_post( __( 'Notes on <em>living</em> well', 'dimora' ) ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:query {"queryId":1,"query":{"perPage":9,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true},"align":"wide"} -->
<div class="wp-block-query alignwide"><!-- wp:post-template {"className":"dimora-reveal","style":{"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"grid","minimumColumnWidth":"320px"}} -->
<!-- wp:group {"className":"dimora-post","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-post"><!-- wp:post-featured-image {"aspectRatio":"3/2"} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:post-date {"className":"is-style-dimora-label"} /-->

<!-- wp:post-title {"level":3,"isLink":true} /-->

<!-- wp:post-excerpt {"excerptLength":20} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-pagination {"paginationArrow":"arrow","style":{"spacing":{"margin":{"top":"var:preset|spacing|80"}}},"layout":{"type":"flex","justifyContent":"space-between"}} -->
<!-- wp:query-pagination-previous /-->

<!-- wp:query-pagination-numbers /-->

<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->

<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Your latest articles will be shown here.', 'dimora' ); ?></p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query --></div>
<!-- /wp:group -->

<!-- wp:pattern {"slug":"dimora/cta"} /-->
<?php else : ?>
<!-- wp:pattern {"slug":"dimora/hero"} /-->

<!-- wp:pattern {"slug":"dimora/statement"} /-->

<!-- wp:pattern {"slug":"dimora/projects-rail"} /-->

<!-- wp:pattern {"slug":"dimora/services"} /-->

<!-- wp:pattern {"slug":"dimora/studio"} /-->

<!-- wp:pattern {"slug":"dimora/process"} /-->

<!-- wp:pattern {"slug":"dimora/quote"} /-->

<!-- wp:pattern {"slug":"dimora/journal"} /-->

<!-- wp:pattern {"slug":"dimora/cta"} /-->
<?php endif; ?>
