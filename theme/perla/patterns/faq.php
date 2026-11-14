<?php
/**
 * Title: Questions and answers
 * Slug: perla/faq
 * Categories: perla
 * Keywords: faq, accordion, details
 * Viewport Width: 1400
 *
 * Written by tools/build.js from src/patterns.js.
 *
 * @package Perla
 */

?>
<!-- wp:group {"metadata":{"name":"Questions"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"mist","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-mist-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"40%","className":"perla-stagger","style":{"spacing":{"blockGap":"20px"}}} -->
<div class="wp-block-column perla-stagger" style="flex-basis:40%"><!-- wp:paragraph {"className":"is-style-perla-eyebrow"} -->
<p class="is-style-perla-eyebrow"><?php echo esc_html__( 'Good to know', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"perla-split"} -->
<h2 class="wp-block-heading perla-split"><?php echo esc_html__( 'Questions we hear every day', 'perla' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Can’t find yours? Call the front desk. A real person picks up.', 'perla' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"perla-arrow-link","fontSize":"small"} -->
<p class="perla-arrow-link has-small-font-size"><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php echo esc_html__( 'Contact us', 'perla' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"60%","className":"perla-stagger","style":{"spacing":{"blockGap":"12px"}}} -->
<div class="wp-block-column perla-stagger" style="flex-basis:60%"><!-- wp:details {"showContent":true,"className":"is-style-perla-faq"} -->
<details class="wp-block-details is-style-perla-faq" open><summary><?php echo esc_html__( 'Are you taking new patients?', 'perla' ); ?></summary><!-- wp:paragraph -->
<p><?php echo esc_html__( 'Yes. Book online or call us and we will send you a short health form you can fill in on your phone. A first visit takes about 45 minutes.', 'perla' ); ?></p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-perla-faq"} -->
<details class="wp-block-details is-style-perla-faq"><summary><?php echo esc_html__( 'Do you take my insurance?', 'perla' ); ?></summary><!-- wp:paragraph -->
<p><?php echo esc_html__( 'We are in network with most major dental plans and file the claim for you. No insurance? Our membership plan covers two check-ups and two cleanings a year for a flat fee.', 'perla' ); ?></p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-perla-faq"} -->
<details class="wp-block-details is-style-perla-faq"><summary><?php echo esc_html__( 'I’m in pain. How fast can you see me?', 'perla' ); ?></summary><!-- wp:paragraph -->
<p><?php echo esc_html__( 'Call as soon as we open. If you call before 3pm we will see you the same day, even if you are not a patient yet.', 'perla' ); ?></p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-perla-faq"} -->
<details class="wp-block-details is-style-perla-faq"><summary><?php echo esc_html__( 'How often do I really need a check-up?', 'perla' ); ?></summary><!-- wp:paragraph -->
<p><?php echo esc_html__( 'Every six months suits most people. If your teeth and gums are in good shape we may suggest once a year; if you have gum disease, more often.', 'perla' ); ?></p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-perla-faq"} -->
<details class="wp-block-details is-style-perla-faq"><summary><?php echo esc_html__( 'Is whitening safe?', 'perla' ); ?></summary><!-- wp:paragraph -->
<p><?php echo esc_html__( 'Done by a dental team, yes. We check your teeth and gums first, and we will tell you if whitening won’t work on a crown or a filling.', 'perla' ); ?></p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-perla-faq"} -->
<details class="wp-block-details is-style-perla-faq"><summary><?php echo esc_html__( 'What if I’m nervous?', 'perla' ); ?></summary><!-- wp:paragraph -->
<p><?php echo esc_html__( 'Tell us when you book. We will give you a longer appointment, explain everything before we touch anything, and stop whenever you raise a hand.', 'perla' ); ?></p>
<!-- /wp:paragraph --></details>
<!-- /wp:details --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
