<?php
/**
 * Title: After a post
 * Slug: perla/post-footer
 * Inserter: no
 * Viewport Width: 1400
 *
 * Written by tools/build.js from src/patterns.js.
 *
 * @package Perla
 */

?>
<!-- wp:group {"metadata":{"name":"Post navigation"},"align":"full","style":{"spacing":{"padding":{"top":"0px","bottom":"var:preset|spacing|80"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-white-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:0px;padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:group {"metadata":{"name":"Previous and next"},"className":"perla-post-nav","style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group perla-post-nav"><!-- wp:post-navigation-link {"type":"previous","label":"<?php echo esc_attr__( 'Previous article', 'perla' ); ?>","arrow":"arrow"} /-->

<!-- wp:post-navigation-link {"label":"<?php echo esc_attr__( 'Next article', 'perla' ); ?>","arrow":"arrow"} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"More posts"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"mist","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-mist-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:group {"metadata":{"name":"Intro"},"className":"perla-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"constrained","contentSize":"760px"}} -->
<div class="wp-block-group perla-stagger"><!-- wp:paragraph {"align":"center","className":"is-style-perla-eyebrow"} -->
<p class="has-text-align-center is-style-perla-eyebrow"><?php echo esc_html__( 'Keep reading', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","className":"perla-split"} -->
<h2 class="wp-block-heading has-text-align-center perla-split"><?php echo esc_html__( 'More from our journal', 'perla' ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:query {"queryId":12,"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"exclude","inherit":false},"align":"wide"} -->
<div class="wp-block-query alignwide"><!-- wp:post-template {"className":"perla-reveal","style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"grid","minimumColumnWidth":"300px"}} -->
<!-- wp:group {"className":"perla-post-card","style":{"spacing":{"blockGap":"0"},"border":{"radius":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dradius\u002d\u002dmedium)","width":"1px","color":"var(\u002d\u002dwp\u002d\u002dpreset\u002d\u002dcolor\u002d\u002dline)","style":"solid"}},"backgroundColor":"white","layout":{"type":"default"}} -->
<div class="wp-block-group perla-post-card has-border-color has-white-background-color has-background" style="border-color:var(--wp--preset--color--line);border-style:solid;border-width:1px;border-radius:var(--wp--custom--radius--medium)"><!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/10","style":{"border":{"radius":"0px"}}} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"8px","padding":{"top":"20px","right":"22px","bottom":"22px","left":"22px"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group" style="padding-top:20px;padding-right:22px;padding-bottom:22px;padding-left:22px"><!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontSize":"20px","lineHeight":"1.3"}}} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"8px"}},"layout":{"type":"flex","flexWrap":"wrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:post-date /-->

<!-- wp:post-terms {"term":"category"} /--></div>
<!-- /wp:group -->

<!-- wp:post-excerpt {"moreText":"<?php echo esc_attr__( 'Read more', 'perla' ); ?>","excerptLength":22} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:post-template --></div>
<!-- /wp:query --></div>
<!-- /wp:group -->
