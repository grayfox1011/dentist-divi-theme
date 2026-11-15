<?php
/**
 * Title: Front page
 * Slug: dimora/front-page
 * Inserter: no
 * Viewport Width: 1400
 */
?>
<?php if ( dimora_big_boss() ) : ?>
<!-- wp:post-content {"align":"full","className":"dimora-content","layout":{"type":"constrained"}} /-->
<?php else : ?>
<!-- wp:pattern {"slug":"dimora/hero"} /-->

<!-- wp:pattern {"slug":"dimora/statement"} /-->

<!-- wp:pattern {"slug":"dimora/projects-rail"} /-->

<!-- wp:pattern {"slug":"dimora/services"} /-->

<!-- wp:pattern {"slug":"dimora/studio"} /-->

<!-- wp:pattern {"slug":"dimora/process"} /-->

<!-- wp:pattern {"slug":"dimora/quote"} /-->

<!-- wp:pattern {"slug":"dimora/journal"} /-->

<!-- wp:pattern {"slug":"dimora/cta"} /-->
<?php endif; ?>
