<?php
/**
 * Title: Footer on one line
 * Slug: perla/footer-compact
 * Categories: footer
 * Block Types: core/template-part/footer
 * Viewport Width: 1400
 */
?>
<!-- wp:group {"metadata":{"name":"Footer"},"align":"full","className":"perla-footer","style":{"spacing":{"padding":{"top":"32px","bottom":"32px"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"dark","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull perla-footer has-dark-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:32px;padding-bottom:32px"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"16px 32px"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group alignwide"><!-- wp:group {"metadata":{"name":"Logo"},"style":{"spacing":{"blockGap":"10px"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:image {"width":"26px","height":"26px","sizeSlug":"full","className":"perla-icon perla-logo-mark"} -->
<figure class="wp-block-image size-full is-resized perla-icon perla-logo-mark"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/icon-tooth.svg' ) ); ?>" alt="" style="width:26px;height:26px"/></figure>
<!-- /wp:image -->

<!-- wp:site-title {"level":0,"className":"perla-site-title-light"} /--></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"8px 24px"}},"layout":{"type":"flex","flexWrap":"wrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( perla_soliton_radar( 'about' ) ); ?>"><?php echo esc_html__( 'About us', 'perla' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( perla_soliton_radar( 'services' ) ); ?>"><?php echo esc_html__( 'Treatments', 'perla' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( perla_soliton_radar( 'contact' ) ); ?>"><?php echo esc_html__( 'Contact', 'perla' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( perla_soliton_radar( 'privacy-policy' ) ); ?>"><?php echo esc_html__( 'Privacy policy', 'perla' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"perla-footer-phone"} -->
<p class="perla-footer-phone"><a href="tel:+12175550142"><strong>(217) 555-0142</strong></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
