<?php
/**
 * Title: Front page
 * Slug: perla/front-page
 * Inserter: no
 * Viewport Width: 1400
 */
?>
<?php if ( perla_big_boss() ) : ?>
<!-- wp:post-content {"align":"full","className":"perla-content","layout":{"type":"constrained"}} /-->
<?php else : ?>
<!-- wp:pattern {"slug":"perla/hero"} /-->

<!-- wp:pattern {"slug":"perla/stats"} /-->

<!-- wp:pattern {"slug":"perla/services"} /-->

<!-- wp:pattern {"slug":"perla/about"} /-->

<!-- wp:pattern {"slug":"perla/steps"} /-->

<!-- wp:pattern {"slug":"perla/before-after"} /-->

<!-- wp:pattern {"slug":"perla/team"} /-->

<!-- wp:pattern {"slug":"perla/testimonials"} /-->

<!-- wp:pattern {"slug":"perla/latest-posts"} /-->

<!-- wp:pattern {"slug":"perla/faq"} /-->

<!-- wp:pattern {"slug":"perla/cta"} /-->
<?php endif; ?>
