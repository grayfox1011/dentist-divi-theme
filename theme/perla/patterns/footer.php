<?php
/**
 * Title: Footer with four columns
 * Slug: perla/footer
 * Categories: footer
 * Block Types: core/template-part/footer
 * Viewport Width: 1400
 *
 * Written by tools/build.js from src/patterns.js.
 *
 * @package Perla
 */

?>
<!-- wp:group {"metadata":{"name":"Footer"},"align":"full","className":"perla-footer","style":{"spacing":{"padding":{"top":"clamp(56px, 7vw, 96px)","bottom":"28px"},"blockGap":"var:preset|spacing|80","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"dark","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull perla-footer has-dark-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:clamp(56px, 7vw, 96px);padding-bottom:28px"><!-- wp:group {"metadata":{"name":"Footer columns"},"align":"wide","className":"perla-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|70"}},"layout":{"type":"grid","minimumColumnWidth":"240px"}} -->
<div class="wp-block-group alignwide perla-stagger"><!-- wp:group {"style":{"spacing":{"blockGap":"18px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:group {"metadata":{"name":"Logo"},"style":{"spacing":{"blockGap":"10px"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:image {"width":"26px","height":"26px","sizeSlug":"full","className":"perla-icon perla-logo-mark"} -->
<figure class="wp-block-image size-full is-resized perla-icon perla-logo-mark"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/icon-tooth.svg' ) ); ?>" alt="" style="width:26px;height:26px"/></figure>
<!-- /wp:image -->

<!-- wp:site-title {"level":0,"className":"perla-site-title-light"} /--></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><?php echo esc_html__( 'A small dental studio on Harbor Street, looking after Springfield families since 2010.', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:social-links {"iconColor":"white","iconColorValue":"#ffffff","size":"has-small-icon-size","className":"is-style-perla-social","style":{"spacing":{"blockGap":{"left":"10px"}}}} -->
<ul class="wp-block-social-links has-small-icon-size has-icon-color is-style-perla-social"><!-- wp:social-link {"url":"#","service":"facebook"} /-->

<!-- wp:social-link {"url":"#","service":"instagram"} /-->

<!-- wp:social-link {"url":"#","service":"youtube"} /--></ul>
<!-- /wp:social-links --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"14px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"style":{"typography":{"fontSize":"15px","letterSpacing":"0.04em","lineHeight":"1.4"}},"textColor":"white"} -->
<h2 class="wp-block-heading has-white-color has-text-color" style="font-size:15px;letter-spacing:0.04em;line-height:1.4"><?php echo esc_html__( 'Explore', 'perla' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:group {"style":{"spacing":{"blockGap":"10px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo esc_html__( 'Home', 'perla' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php echo esc_html__( 'About us', 'perla' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php echo esc_html__( 'Treatments', 'perla' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php echo esc_html__( 'Journal', 'perla' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php echo esc_html__( 'Contact', 'perla' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"14px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"style":{"typography":{"fontSize":"15px","letterSpacing":"0.04em","lineHeight":"1.4"}},"textColor":"white"} -->
<h2 class="wp-block-heading has-white-color has-text-color" style="font-size:15px;letter-spacing:0.04em;line-height:1.4"><?php echo esc_html__( 'Treatments', 'perla' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:group {"style":{"spacing":{"blockGap":"10px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( home_url( '/services/general-dentistry/' ) ); ?>"><?php echo esc_html__( 'General Dentistry', 'perla' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( home_url( '/services/cosmetic-dentistry/' ) ); ?>"><?php echo esc_html__( 'Cosmetic Dentistry', 'perla' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( home_url( '/services/dental-implants/' ) ); ?>"><?php echo esc_html__( 'Dental Implants', 'perla' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( home_url( '/services/teeth-whitening/' ) ); ?>"><?php echo esc_html__( 'Teeth Whitening', 'perla' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( home_url( '/services/orthodontics/' ) ); ?>"><?php echo esc_html__( 'Orthodontics', 'perla' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"10px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"style":{"typography":{"fontSize":"15px","letterSpacing":"0.04em","lineHeight":"1.4"}},"textColor":"white"} -->
<h2 class="wp-block-heading has-white-color has-text-color" style="font-size:15px;letter-spacing:0.04em;line-height:1.4"><?php echo esc_html__( 'Visit us', 'perla' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><?php echo esc_html__( '128 Harbor Street, Springfield, IL', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><?php echo esc_html__( 'Mon–Fri 8am–7pm · Sat 9am–2pm', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-footer-phone"} -->
<p class="perla-footer-phone"><a href="tel:+12175550142"><strong>(217) 555-0142</strong></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="mailto:smile@example.com">smile@example.com</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Legal"},"align":"wide","className":"perla-legal perla-reveal","style":{"spacing":{"blockGap":"24px","padding":{"top":"24px"}}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group alignwide perla-legal perla-reveal" style="padding-top:24px"><!-- wp:group {"style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"flex","flexWrap":"wrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><?php echo esc_html__( '©', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:site-title {"level":0,"isLink":false,"className":"perla-site-title-plain"} /--></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"small"} -->
<p class="perla-on-dark has-small-font-size"><a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>"><?php echo esc_html__( 'Privacy policy', 'perla' ); ?></a> · <a href="<?php echo esc_url( home_url( '/terms/' ) ); ?>"><?php echo esc_html__( 'Terms', 'perla' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
