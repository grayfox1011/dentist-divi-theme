<?php
/**
 * Title: Contact
 * Slug: dimora/page-contact
 * Categories: dimora-pages
 * Keywords: contact
 * Block Types: core/post-content
 * Post Types: page
 * Viewport Width: 1400
 */
?>
<!-- wp:pattern {"slug":"dimora/contact"} /-->

<!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Questions', 'dimora' ); ?>"},"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|90","bottom":"var:preset|spacing|90"},"blockGap":"var:preset|spacing|70","margin":{"top":"0","bottom":"0"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--90);padding-bottom:var(--wp--preset--spacing--90)"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|70","left":"var:preset|spacing|80"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"34%","style":{"spacing":{"blockGap":"var:preset|spacing|50"}}} -->
<div class="wp-block-column" style="flex-basis:34%"><!-- wp:group {"metadata":{"name":"<?php echo esc_attr__( 'Heading', 'dimora' ); ?>"},"className":"dimora-stagger","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
<div class="wp-block-group dimora-stagger"><!-- wp:paragraph {"className":"is-style-dimora-label"} -->
<p class="is-style-dimora-label"><?php echo esc_html__( '(Questions)', 'dimora' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"dimora-split"} -->
<h2 class="wp-block-heading dimora-split"><?php echo wp_kses_post( __( 'Asked at every <em>first</em> meeting', 'dimora' ) ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"dimora-arrow-link dimora-reveal"} -->
<p class="dimora-arrow-link dimora-reveal"><a href="<?php echo esc_url( dimora_soliton_radar( 'contact' ) ); ?>"><?php echo esc_html__( 'Ask us something else', 'dimora' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"66%","className":"dimora-stagger dimora-rows","style":{"spacing":{"blockGap":"0"}}} -->
<div class="wp-block-column dimora-stagger dimora-rows" style="flex-basis:66%"><!-- wp:details {"showContent":true,"className":"is-style-dimora-row"} -->
<details class="wp-block-details is-style-dimora-row" open><summary><?php echo esc_html__( 'What does a project cost?', 'dimora' ); ?></summary><!-- wp:paragraph {"className":"dimora-measure"} -->
<p class="dimora-measure"><?php echo esc_html__( 'For a full renovation our fee is usually between 10 and 14 per cent of the building cost, agreed as a fixed sum once the scope is clear. Furniture-only projects are charged by the room. A day of advice is a flat fee.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-dimora-row"} -->
<details class="wp-block-details is-style-dimora-row"><summary><?php echo esc_html__( 'How long does it take?', 'dimora' ); ?></summary><!-- wp:paragraph {"className":"dimora-measure"} -->
<p class="dimora-measure"><?php echo esc_html__( 'A whole house takes about four months to design and six to nine to build. A single room can be done in ten weeks. We give you a programme with the fee proposal.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-dimora-row"} -->
<details class="wp-block-details is-style-dimora-row"><summary><?php echo esc_html__( 'Do you work outside London?', 'dimora' ); ?></summary><!-- wp:paragraph {"className":"dimora-measure"} -->
<p class="dimora-measure"><?php echo esc_html__( 'Yes. About half our projects are elsewhere in Britain and a few are abroad. Travel is charged at cost.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-dimora-row"} -->
<details class="wp-block-details is-style-dimora-row"><summary><?php echo esc_html__( 'Can you work with my architect or builder?', 'dimora' ); ?></summary><!-- wp:paragraph {"className":"dimora-measure"} -->
<p class="dimora-measure"><?php echo esc_html__( 'Gladly. We often join a team that is already in place, and we can also recommend people we trust.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-dimora-row"} -->
<details class="wp-block-details is-style-dimora-row"><summary><?php echo esc_html__( 'Is my project too small?', 'dimora' ); ?></summary><!-- wp:paragraph {"className":"dimora-measure"} -->
<p class="dimora-measure"><?php echo esc_html__( 'Probably not. We have designed a single bookcase and a hotel in the same year. If we are not the right fit we will say so and suggest someone who is.', 'dimora' ); ?></p>
<!-- /wp:paragraph --></details>
<!-- /wp:details --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->

<!-- wp:pattern {"slug":"dimora/cta"} /-->
