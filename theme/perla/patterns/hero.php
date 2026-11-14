<?php
/**
 * Title: Hero with photo and quick info
 * Slug: perla/hero
 * Categories: perla, banner
 * Keywords: header, intro, banner
 * Viewport Width: 1400
 *
 * Written by tools/build.js from src/patterns.js.
 *
 * @package Perla
 */

?>
<!-- wp:group {"metadata":{"name":"Hero"},"align":"full","className":"perla-hero","style":{"spacing":{"padding":{"top":"clamp(40px, 6vw, 88px)","bottom":"clamp(48px, 7vw, 96px)"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"tint","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull perla-hero has-tint-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:clamp(40px, 6vw, 88px);padding-bottom:clamp(48px, 7vw, 96px)"><!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","className":"perla-stagger","style":{"spacing":{"blockGap":"24px"}}} -->
<div class="wp-block-column is-vertically-aligned-center perla-stagger"><!-- wp:paragraph {"className":"is-style-perla-eyebrow"} -->
<p class="is-style-perla-eyebrow"><?php echo esc_html__( 'Family dentist in Springfield', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"className":"perla-split","fontSize":"display"} -->
<h1 class="wp-block-heading perla-split has-display-font-size"><?php echo esc_html__( 'The dentist you won’t put off visiting.', 'perla' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"large"} -->
<p class="has-large-font-size"><?php echo esc_html__( 'A small studio on Harbor Street with four clinicians, long appointments and no lectures. Check-ups, whitening, implants and same-day emergency care, all under one roof.', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"flex"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php echo esc_html__( 'Book a visit', 'perla' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php echo esc_html__( 'See our treatments', 'perla' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:group {"metadata":{"name":"Rating"},"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"flex","flexWrap":"wrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"perla-stars","style":{"typography":{"fontSize":"20px","lineHeight":"1","letterSpacing":"2px"}},"textColor":"star"} -->
<p class="perla-stars has-star-color has-text-color" style="font-size:20px;letter-spacing:2px;line-height:1">★★★★★</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"heading","fontSize":"small"} -->
<p class="has-heading-color has-text-color has-small-font-size"><?php echo wp_kses_post( __( '<strong>4.9 out of 5</strong> · from 312 patient reviews', 'perla' ) ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center"><!-- wp:image {"aspectRatio":"12/13","scale":"cover","sizeSlug":"full","className":"perla-image","style":{"shadow":"var:preset|shadow|soft"}} -->
<figure class="wp-block-image size-full perla-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/hero.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'A dentist at work in a bright treatment room', 'perla' ); ?>" style="box-shadow:var(--wp--preset--shadow--soft);aspect-ratio:12/13;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:group {"metadata":{"name":"Quick info"},"align":"wide","className":"perla-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"grid","minimumColumnWidth":"280px"}} -->
<div class="wp-block-group alignwide perla-stagger"><!-- wp:group {"metadata":{"name":"Info"},"style":{"spacing":{"blockGap":"var:preset|spacing|40","padding":{"top":"24px","right":"28px","bottom":"24px","left":"28px"}},"border":{"radius":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dradius\u002d\u002dmedium)"},"shadow":"var:preset|shadow|soft"},"backgroundColor":"white","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group has-white-background-color has-background" style="border-radius:var(--wp--custom--radius--medium);padding-top:24px;padding-right:28px;padding-bottom:24px;padding-left:28px;box-shadow:var(--wp--preset--shadow--soft)"><!-- wp:image {"width":"20px","height":"20px","sizeSlug":"full","className":"perla-icon perla-icon-small"} -->
<figure class="wp-block-image size-full is-resized perla-icon perla-icon-small"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/icon-clock.svg' ) ); ?>" alt="" style="width:20px;height:20px"/></figure>
<!-- /wp:image -->

<!-- wp:group {"style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"18px"}}} -->
<h3 class="wp-block-heading" style="font-size:18px"><?php echo esc_html__( 'Opening hours', 'perla' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><?php echo esc_html__( 'Mon–Fri 8am–7pm · Sat 9am–2pm', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Info"},"style":{"spacing":{"blockGap":"var:preset|spacing|40","padding":{"top":"24px","right":"28px","bottom":"24px","left":"28px"}},"border":{"radius":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dradius\u002d\u002dmedium)"},"shadow":"var:preset|shadow|soft"},"backgroundColor":"white","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group has-white-background-color has-background" style="border-radius:var(--wp--custom--radius--medium);padding-top:24px;padding-right:28px;padding-bottom:24px;padding-left:28px;box-shadow:var(--wp--preset--shadow--soft)"><!-- wp:image {"width":"20px","height":"20px","sizeSlug":"full","className":"perla-icon perla-icon-small"} -->
<figure class="wp-block-image size-full is-resized perla-icon perla-icon-small"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/icon-phone.svg' ) ); ?>" alt="" style="width:20px;height:20px"/></figure>
<!-- /wp:image -->

<!-- wp:group {"style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"18px"}}} -->
<h3 class="wp-block-heading" style="font-size:18px"><?php echo esc_html__( 'In pain? Call before 3pm', 'perla' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><a href="tel:+12175550142">(217) 555-0142</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Info"},"style":{"spacing":{"blockGap":"var:preset|spacing|40","padding":{"top":"24px","right":"28px","bottom":"24px","left":"28px"}},"border":{"radius":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dradius\u002d\u002dmedium)"},"shadow":"var:preset|shadow|soft"},"backgroundColor":"white","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group has-white-background-color has-background" style="border-radius:var(--wp--custom--radius--medium);padding-top:24px;padding-right:28px;padding-bottom:24px;padding-left:28px;box-shadow:var(--wp--preset--shadow--soft)"><!-- wp:image {"width":"20px","height":"20px","sizeSlug":"full","className":"perla-icon perla-icon-small"} -->
<figure class="wp-block-image size-full is-resized perla-icon perla-icon-small"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/icon-pin.svg' ) ); ?>" alt="" style="width:20px;height:20px"/></figure>
<!-- /wp:image -->

<!-- wp:group {"style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"18px"}}} -->
<h3 class="wp-block-heading" style="font-size:18px"><?php echo esc_html__( 'Find us', 'perla' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><?php echo esc_html__( '128 Harbor Street, Springfield, IL', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
