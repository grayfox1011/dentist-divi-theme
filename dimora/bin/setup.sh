#!/usr/bin/env bash
# Sets up the local test site: WordPress + the Dimora theme + the site built by Dimora Starter.
# Usage: ./bin/setup.sh        (safe to run again at any time)
set -euo pipefail
cd "$(dirname "$0")/.."

[ -f .env ] || cp .env.example .env
set -a; . ./.env; set +a
URL="http://localhost:${WP_PORT:-8090}"

wp() { docker compose --progress quiet run --rm -T cli wp "$@"; }

echo "==> Starting WordPress and the database"
docker compose --progress quiet up -d db wordpress

echo "==> Waiting for WordPress"
until docker compose exec -T wordpress test -f /var/www/html/wp-includes/version.php; do sleep 2; done
until wp db check >/dev/null 2>&1; do sleep 2; done

if ! wp core is-installed >/dev/null 2>&1; then
  echo "==> Installing WordPress"
  wp core install --url="$URL" --title="Dimora" --admin_user=admin --admin_password=admin --admin_email=admin@example.com --skip-email
fi

echo "==> Activating the Dimora theme"
wp theme activate dimora
wp rewrite structure '/%postname%/' >/dev/null

echo "==> Building the site with the Dimora Starter plugin"
wp plugin activate dimora-starter >/dev/null
wp --user=admin eval 'foreach ( array( "hello-world" => "post", "sample-page" => "page" ) as $slug => $type ) { $old = get_page_by_path( $slug, OBJECT, $type ); if ( $old ) { wp_delete_post( $old->ID, true ); } } $log = dimora_starter_outer_heaven(); WP_CLI::success( count( $log["pages"] ) . " pages and " . count( $log["posts"] ) . " articles made by the starter." );'

cat <<MSG

Done. Site:  $URL
      Admin: $URL/wp-admin   (admin / admin)

Every page, the menu and the articles were made by the Dimora Starter plugin, exactly as
a click on Appearance > Dimora Starter would make them.
MSG
