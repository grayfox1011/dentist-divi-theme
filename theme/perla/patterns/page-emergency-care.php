<?php
/**
 * Title: Treatment: Emergency Care
 * Slug: perla/page-emergency-care
 * Categories: perla-pages
 * Keywords: treatment, service
 * Block Types: core/post-content
 * Post Types: page
 * Viewport Width: 1400
 *
 * Written by tools/build.js from src/patterns.js.
 *
 * @package Perla
 */

?>
<!-- wp:group {"metadata":{"name":"Treatment"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-white-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","className":"perla-stagger","style":{"spacing":{"blockGap":"20px"}}} -->
<div class="wp-block-column is-vertically-aligned-center perla-stagger"><!-- wp:paragraph {"className":"is-style-perla-eyebrow"} -->
<p class="is-style-perla-eyebrow"><?php echo esc_html__( 'Treatments', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"perla-split"} -->
<h2 class="wp-block-heading perla-split"><?php echo esc_html__( 'In pain? We’ll see you today', 'perla' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"large"} -->
<p class="has-large-font-size"><?php echo esc_html__( 'We keep appointments free every day for exactly this. Call before 3pm and you will be seen the same day, whether or not you are already a patient.', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"flex"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php echo esc_html__( 'Book a consultation', 'perla' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php echo esc_html__( 'All treatments', 'perla' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center"><!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","className":"perla-image","style":{"shadow":"var:preset|shadow|soft"}} -->
<figure class="wp-block-image size-full perla-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/emergency-care.jpg' ) ); ?>" alt="<?php echo esc_attr__( 'The lamp above a dental chair', 'perla' ); ?>" style="box-shadow:var(--wp--preset--shadow--soft);aspect-ratio:4/3;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"What to expect"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"mist","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-mist-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"60%","className":"perla-stagger","style":{"spacing":{"blockGap":"20px"}}} -->
<div class="wp-block-column perla-stagger" style="flex-basis:60%"><!-- wp:heading {"className":"perla-split"} -->
<h2 class="wp-block-heading perla-split"><?php echo esc_html__( 'What to expect', 'perla' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Tell us on the phone what happened and we will tell you what to do until you get here. In the chair, the first job is to get you out of pain. Then we find the cause and explain your options.', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Often we can fix the problem on the spot. If it needs a second visit, you leave comfortable, with a clear plan and a price.', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><?php echo esc_html__( 'Common reasons to book', 'perla' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:list {"className":"is-style-perla-checks"} -->
<ul class="wp-block-list is-style-perla-checks"><!-- wp:list-item -->
<li><?php echo esc_html__( 'Toothache that keeps you awake', 'perla' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'A swollen face or gum', 'perla' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'A broken, cracked or knocked-out tooth', 'perla' ); ?></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><?php echo esc_html__( 'A lost filling or crown', 'perla' ); ?></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"40%"} -->
<div class="wp-block-column" style="flex-basis:40%"><!-- wp:group {"metadata":{"name":"At a glance"},"className":"perla-reveal","style":{"spacing":{"blockGap":"0","padding":{"top":"var:preset|spacing|60","right":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|60"}},"border":{"radius":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dradius\u002d\u002dmedium)"}},"backgroundColor":"white","layout":{"type":"default"}} -->
<div class="wp-block-group perla-reveal has-white-background-color has-background" style="border-radius:var(--wp--custom--radius--medium);padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--60)"><!-- wp:heading {"level":3,"style":{"spacing":{"margin":{"bottom":"8px"}}}} -->
<h3 class="wp-block-heading" style="margin-bottom:8px"><?php echo esc_html__( 'At a glance', 'perla' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:group {"className":"perla-fact","style":{"spacing":{"blockGap":"var:preset|spacing|40","padding":{"top":"16px","bottom":"16px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group perla-fact" style="padding-top:16px;padding-bottom:16px"><!-- wp:paragraph -->
<p><?php echo esc_html__( 'Response', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"heading"} -->
<p class="has-heading-color has-text-color"><strong><?php echo esc_html__( 'Same day', 'perla' ); ?></strong></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"perla-fact","style":{"spacing":{"blockGap":"var:preset|spacing|40","padding":{"top":"16px","bottom":"16px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group perla-fact" style="padding-top:16px;padding-bottom:16px"><!-- wp:paragraph -->
<p><?php echo esc_html__( 'Call before', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"heading"} -->
<p class="has-heading-color has-text-color"><strong><?php echo esc_html__( '3pm', 'perla' ); ?></strong></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"perla-fact","style":{"spacing":{"blockGap":"var:preset|spacing|40","padding":{"top":"16px","bottom":"16px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group perla-fact" style="padding-top:16px;padding-bottom:16px"><!-- wp:paragraph -->
<p><?php echo esc_html__( 'Open', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"heading"} -->
<p class="has-heading-color has-text-color"><strong><?php echo esc_html__( 'Monday to Saturday', 'perla' ); ?></strong></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"perla-fact","style":{"spacing":{"blockGap":"var:preset|spacing|40","padding":{"top":"16px","bottom":"16px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group perla-fact" style="padding-top:16px;padding-bottom:16px"><!-- wp:paragraph -->
<p><?php echo esc_html__( 'From', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"heading"} -->
<p class="has-heading-color has-text-color"><strong><?php echo esc_html__( '$120', 'perla' ); ?></strong></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:buttons {"style":{"spacing":{"blockGap":"var:preset|spacing|30","margin":{"top":"20px"}}},"layout":{"type":"flex"}} -->
<div class="wp-block-buttons" style="margin-top:20px"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php echo esc_html__( 'Book a consultation', 'perla' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Reviews"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-white-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:group {"metadata":{"name":"Intro"},"className":"perla-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"constrained","contentSize":"760px"}} -->
<div class="wp-block-group perla-stagger"><!-- wp:paragraph {"align":"center","className":"is-style-perla-eyebrow"} -->
<p class="has-text-align-center is-style-perla-eyebrow"><?php echo esc_html__( 'What patients say', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","className":"perla-split"} -->
<h2 class="wp-block-heading has-text-align-center perla-split"><?php echo esc_html__( 'In our patients’ words', 'perla' ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Reviews"},"align":"wide","className":"perla-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"grid","minimumColumnWidth":"300px"}} -->
<div class="wp-block-group alignwide perla-stagger"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40","padding":{"top":"var:preset|spacing|60","right":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|60"}},"border":{"radius":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dradius\u002d\u002dmedium)"}},"backgroundColor":"mist","layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch","verticalAlignment":"space-between"}} -->
<div class="wp-block-group has-mist-background-color has-background" style="border-radius:var(--wp--custom--radius--medium);padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--60)"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"perla-stars","style":{"typography":{"fontSize":"18px","lineHeight":"1","letterSpacing":"2px"}},"textColor":"star"} -->
<p class="perla-stars has-star-color has-text-color" style="font-size:18px;letter-spacing:2px;line-height:1">★★★★★</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"heading","fontSize":"large"} -->
<p class="has-heading-color has-text-color has-large-font-size"><?php echo esc_html__( '“I hadn’t seen a dentist in nine years and expected a lecture. Dr. Marsh just asked what had kept me away, and we went from there. Three visits later, I’m all caught up.”', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Author"},"style":{"spacing":{"blockGap":"14px"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"perla-initials"} -->
<p class="perla-initials">HR</p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"blockGap":"2px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.3"}},"textColor":"heading"} -->
<p class="has-heading-color has-text-color" style="line-height:1.3"><strong><?php echo esc_html__( 'Hannah R.', 'perla' ); ?></strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.3"}},"fontSize":"small"} -->
<p class="has-small-font-size" style="line-height:1.3"><?php echo esc_html__( 'Patient since 2019', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40","padding":{"top":"var:preset|spacing|60","right":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|60"}},"border":{"radius":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dradius\u002d\u002dmedium)"}},"backgroundColor":"mist","layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch","verticalAlignment":"space-between"}} -->
<div class="wp-block-group has-mist-background-color has-background" style="border-radius:var(--wp--custom--radius--medium);padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--60)"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"perla-stars","style":{"typography":{"fontSize":"18px","lineHeight":"1","letterSpacing":"2px"}},"textColor":"star"} -->
<p class="perla-stars has-star-color has-text-color" style="font-size:18px;letter-spacing:2px;line-height:1">★★★★★</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"heading","fontSize":"large"} -->
<p class="has-heading-color has-text-color has-large-font-size"><?php echo esc_html__( '“Chipped a front tooth on a Friday afternoon. They saw me at 4:30 and I walked out an hour later with it fixed.”', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Author"},"style":{"spacing":{"blockGap":"14px"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"perla-initials"} -->
<p class="perla-initials">MT</p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"blockGap":"2px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.3"}},"textColor":"heading"} -->
<p class="has-heading-color has-text-color" style="line-height:1.3"><strong><?php echo esc_html__( 'Marcus T.', 'perla' ); ?></strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.3"}},"fontSize":"small"} -->
<p class="has-small-font-size" style="line-height:1.3"><?php echo esc_html__( 'Emergency visit', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40","padding":{"top":"var:preset|spacing|60","right":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|60"}},"border":{"radius":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dradius\u002d\u002dmedium)"}},"backgroundColor":"mist","layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch","verticalAlignment":"space-between"}} -->
<div class="wp-block-group has-mist-background-color has-background" style="border-radius:var(--wp--custom--radius--medium);padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--60)"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"perla-stars","style":{"typography":{"fontSize":"18px","lineHeight":"1","letterSpacing":"2px"}},"textColor":"star"} -->
<p class="perla-stars has-star-color has-text-color" style="font-size:18px;letter-spacing:2px;line-height:1">★★★★★</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"heading","fontSize":"large"} -->
<p class="has-heading-color has-text-color has-large-font-size"><?php echo esc_html__( '“Our two kids ask when they are going back. I don’t fully understand it, but I’ll take it.”', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Author"},"style":{"spacing":{"blockGap":"14px"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"perla-initials"} -->
<p class="perla-initials">PK</p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"blockGap":"2px"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.3"}},"textColor":"heading"} -->
<p class="has-heading-color has-text-color" style="line-height:1.3"><strong><?php echo esc_html__( 'Priya K.', 'perla' ); ?></strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.3"}},"fontSize":"small"} -->
<p class="has-small-font-size" style="line-height:1.3"><?php echo esc_html__( 'Family of four', 'perla' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:pattern {"slug":"perla/faq"} /-->

<!-- wp:pattern {"slug":"perla/cta"} /-->
