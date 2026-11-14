#!/usr/bin/env bash
# Sets up the local test site: WordPress + the Perla block theme + demo pages and posts.
# Usage: ./bin/setup.sh        (safe to run again at any time)
set -euo pipefail
cd "$(dirname "$0")/.."

[ -f .env ] || cp .env.example .env
set -a; . ./.env; set +a
URL="http://localhost:${WP_PORT:-8080}"

wp() { docker compose --progress quiet run --rm -T cli wp "$@"; }

echo "==> Starting WordPress and the database"
docker compose --progress quiet up -d db wordpress

echo "==> Waiting for WordPress"
until docker compose exec -T wordpress test -f /var/www/html/wp-includes/version.php; do sleep 2; done
until wp db check >/dev/null 2>&1; do sleep 2; done

if ! wp core is-installed >/dev/null 2>&1; then
  echo "==> Installing WordPress"
  wp core install --url="$URL" --title="Perla Dental" --admin_user=admin --admin_password=admin --admin_email=admin@example.com --skip-email
fi

echo "==> Activating the Perla theme"
wp theme activate perla
wp rewrite structure '/%postname%/' >/dev/null

echo "==> Creating the demo pages, posts and menu"
wp --user=admin eval-file /project/tools/demo-content.php

cat <<MSG

Done. Site:  $URL
      Admin: $URL/wp-admin   (admin / admin)

The home page is the "Front Page" template of the theme. The other pages were made from
the page patterns, the way a user of the theme would make them.
MSG
