<?php
/**
 * Title: Header without top bar
 * Slug: perla/header-simple
 * Categories: header
 * Block Types: core/template-part/header
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Navigation bar"},"align":"full","className":"perla-navbar","style":{"spacing":{"padding":{"top":"14px","bottom":"14px"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull perla-navbar has-white-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:14px;padding-bottom:14px"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"12px 24px"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group alignwide"><!-- wp:group {"metadata":{"name":"Logo"},"style":{"spacing":{"blockGap":"10px"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:image {"width":"26px","height":"26px","sizeSlug":"full","className":"perla-icon perla-logo-mark"} -->
<figure class="wp-block-image size-full is-resized perla-icon perla-logo-mark"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/icon-tooth.svg' ) ); ?>" alt="" style="width:26px;height:26px"/></figure>
<!-- /wp:image -->

<!-- wp:site-title {"level":0} /--></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Menu"},"style":{"spacing":{"blockGap":"28px"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:navigation {"icon":"menu","style":{"spacing":{"blockGap":"28px"}},"layout":{"type":"flex","justifyContent":"right"}} /-->

<!-- wp:buttons {"className":"perla-hide-medium","style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"flex"}} -->
<div class="wp-block-buttons perla-hide-medium"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php echo esc_html__( 'Book a visit', 'perla' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
