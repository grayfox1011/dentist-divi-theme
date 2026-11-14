<?php
/**
 * Title: Header with top bar
 * Slug: perla/header
 * Categories: header
 * Block Types: core/template-part/header
 * Viewport Width: 1400
 *
 * Written by tools/build.js from src/patterns.js.
 *
 * @package Perla
 */

?>
<!-- wp:group {"metadata":{"name":"Top bar"},"align":"full","className":"perla-topbar","style":{"spacing":{"padding":{"top":"9px","bottom":"9px"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"dark","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull perla-topbar has-dark-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:9px;padding-bottom:9px"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"6px 24px"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group alignwide"><!-- wp:group {"style":{"spacing":{"blockGap":"6px 24px"}},"layout":{"type":"flex","flexWrap":"wrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"perla-on-dark","fontSize":"x-small"} -->
<p class="perla-on-dark has-x-small-font-size"><?php echo esc_html__( 'Mon–Fri 8am–7pm · Sat 9am–2pm', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark perla-hide-small","fontSize":"x-small"} -->
<p class="perla-on-dark perla-hide-small has-x-small-font-size"><?php echo esc_html__( '128 Harbor Street, Springfield, IL', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"6px 24px"}},"layout":{"type":"flex","flexWrap":"wrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"perla-on-dark perla-hide-small","fontSize":"x-small"} -->
<p class="perla-on-dark perla-hide-small has-x-small-font-size"><a href="mailto:smile@example.com">smile@example.com</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"x-small"} -->
<p class="perla-on-dark has-x-small-font-size"><a href="tel:+12175550142"><strong>(217) 555-0142</strong></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

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
