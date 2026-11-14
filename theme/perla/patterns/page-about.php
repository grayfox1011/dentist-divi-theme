<?php
/**
 * Title: About
 * Slug: perla/page-about
 * Categories: perla-pages
 * Keywords: about, team
 * Block Types: core/post-content
 * Post Types: page
 * Viewport Width: 1400
 *
 * Written by tools/build.js from src/patterns.js.
 *
 * @package Perla
 */

?>
<!-- wp:group {"metadata":{"name":"Our story"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-white-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","className":"perla-stagger","style":{"spacing":{"blockGap":"20px"}}} -->
<div class="wp-block-column is-vertically-aligned-center perla-stagger"><!-- wp:paragraph {"className":"is-style-perla-eyebrow"} -->
<p class="is-style-perla-eyebrow"><?php echo esc_html__( 'Our story', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"perla-split"} -->
<h2 class="wp-block-heading perla-split"><?php echo esc_html__( 'It started with one chair', 'perla' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Dr. Elena Marsh opened Perla in 2010, in a single rented room above the pharmacy on Harbor Street. The idea was simple: book enough time to actually talk to people.', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'We have since moved downstairs and grown to four treatment rooms. Appointments are still longer than they strictly need to be, and the person who answers the phone still knows who you are.', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><!-- wp:paragraph -->
<p><?php echo esc_html__( '“I would rather run ten minutes late than hurry someone out of the chair.”', 'perla' ); ?></p>
<!-- /wp:paragraph --><cite><?php echo esc_html__( 'Dr. Elena Marsh, founder', 'perla' ); ?></cite></blockquote>
<!-- /wp:quote -->

<!-- wp:buttons {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"flex"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php echo esc_html__( 'Book a visit', 'perla' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center"><!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","className":"perla-image"} -->
<figure class="wp-block-image size-full perla-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/founder.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'A dentist with a face mask and protective glasses at work', 'perla' ); ?>" style="aspect-ratio:4/3;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->

<!-- wp:pattern {"slug":"perla/stats"} /-->

<!-- wp:group {"metadata":{"name":"Values"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"mist","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-mist-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:group {"metadata":{"name":"Intro"},"className":"perla-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"constrained","contentSize":"760px"}} -->
<div class="wp-block-group perla-stagger"><!-- wp:paragraph {"align":"center","className":"is-style-perla-eyebrow"} -->
<p class="has-text-align-center is-style-perla-eyebrow"><?php echo esc_html__( 'What guides us', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","className":"perla-split"} -->
<h2 class="wp-block-heading has-text-align-center perla-split"><?php echo esc_html__( 'What we won’t compromise on', 'perla' ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Values"},"align":"wide","className":"perla-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"grid","minimumColumnWidth":"300px"}} -->
<div class="wp-block-group alignwide perla-stagger"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40","padding":{"top":"var:preset|spacing|60","right":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|60"}},"border":{"radius":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dradius\u002d\u002dmedium)"}},"backgroundColor":"white","layout":{"type":"default"}} -->
<div class="wp-block-group has-white-background-color has-background" style="border-radius:var(--wp--custom--radius--medium);padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--60)"><!-- wp:image {"width":"26px","height":"26px","sizeSlug":"full","className":"perla-icon"} -->
<figure class="wp-block-image size-full is-resized perla-icon"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/icon-clock.svg' ) ); ?>" alt="" style="width:26px;height:26px"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><?php echo esc_html__( 'Time', 'perla' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'First visits are 45 minutes and nobody is double-booked. If we run late, it is because someone needed us.', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40","padding":{"top":"var:preset|spacing|60","right":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|60"}},"border":{"radius":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dradius\u002d\u002dmedium)"}},"backgroundColor":"white","layout":{"type":"default"}} -->
<div class="wp-block-group has-white-background-color has-background" style="border-radius:var(--wp--custom--radius--medium);padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--60)"><!-- wp:image {"width":"26px","height":"26px","sizeSlug":"full","className":"perla-icon"} -->
<figure class="wp-block-image size-full is-resized perla-icon"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/icon-bulb.svg' ) ); ?>" alt="" style="width:26px;height:26px"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><?php echo esc_html__( 'Straight answers', 'perla' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'You see your X-rays, hear the options, including doing nothing, and get the price in writing.', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40","padding":{"top":"var:preset|spacing|60","right":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|60"}},"border":{"radius":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dradius\u002d\u002dmedium)"}},"backgroundColor":"white","layout":{"type":"default"}} -->
<div class="wp-block-group has-white-background-color has-background" style="border-radius:var(--wp--custom--radius--medium);padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--60)"><!-- wp:image {"width":"26px","height":"26px","sizeSlug":"full","className":"perla-icon"} -->
<figure class="wp-block-image size-full is-resized perla-icon"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/icon-award.svg' ) ); ?>" alt="" style="width:26px;height:26px"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><?php echo esc_html__( 'Skills kept current', 'perla' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Every clinician here does at least 40 hours of training a year. Dentistry moves fast and so do we.', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:pattern {"slug":"perla/team"} /-->

<!-- wp:pattern {"slug":"perla/testimonials"} /-->

<!-- wp:group {"metadata":{"name":"Call to action"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-white-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"verticalAlignment":"center","align":"wide","className":"perla-pop perla-panel","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"},"padding":{"top":"clamp(36px, 5vw, 72px)","right":"clamp(36px, 5vw, 72px)","bottom":"clamp(36px, 5vw, 72px)","left":"clamp(36px, 5vw, 72px)"}},"border":{"radius":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dradius\u002d\u002dlarge)"}},"backgroundColor":"dark"} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center perla-pop perla-panel has-dark-background-color has-background" style="border-radius:var(--wp--custom--radius--large);padding-top:clamp(36px, 5vw, 72px);padding-right:clamp(36px, 5vw, 72px);padding-bottom:clamp(36px, 5vw, 72px);padding-left:clamp(36px, 5vw, 72px)"><!-- wp:column {"verticalAlignment":"center","width":"66%","className":"perla-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|40"}}} -->
<div class="wp-block-column is-vertically-aligned-center perla-stagger" style="flex-basis:66%"><!-- wp:heading {"className":"perla-split","textColor":"white"} -->
<h2 class="wp-block-heading perla-split has-white-color has-text-color"><?php echo esc_html__( 'Overdue for a check-up?', 'perla' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"perla-on-dark","fontSize":"large"} -->
<p class="perla-on-dark has-large-font-size"><?php echo esc_html__( 'Most people are. Book online in about a minute, or call and we will find a time that suits you.', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"34%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:34%"><!-- wp:buttons {"className":"perla-stagger perla-panel-buttons","style":{"spacing":{"blockGap":"14px"}},"layout":{"type":"flex"}} -->
<div class="wp-block-buttons perla-stagger perla-panel-buttons"><!-- wp:button {"className":"is-style-perla-light"} -->
<div class="wp-block-button is-style-perla-light"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php echo esc_html__( 'Book a visit', 'perla' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-perla-ghost"} -->
<div class="wp-block-button is-style-perla-ghost"><a class="wp-block-button__link wp-element-button" href="tel:+12175550142">(217) 555-0142</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
