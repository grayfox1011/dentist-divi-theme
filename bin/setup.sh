#!/usr/bin/env bash
# Sets up the local development site: WordPress + Divi + the Perla child theme + demo pages.
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
  wp core install --url="$URL" --title="Perla Dental Studio" --admin_user=admin --admin_password=admin --admin_email=admin@example.com --skip-email
fi

if ! wp theme is-installed Divi >/dev/null 2>&1; then
  if [ ! -f divi/Divi.zip ] && [ -n "${ET_USERNAME:-}" ] && [ -n "${ET_API_KEY:-}" ]; then
    echo "==> Downloading Divi with your Elegant Themes API key"
    curl -fsSL -G "https://www.elegantthemes.com/api/api_downloads.php" \
      --data-urlencode "api_update=1" --data-urlencode "theme=Divi" \
      --data-urlencode "api_key=${ET_API_KEY}" --data-urlencode "username=${ET_USERNAME}" \
      -o divi/Divi.zip || true
    # Anything that is not a real zip (for example an error page) is discarded.
    if ! unzip -tq divi/Divi.zip >/dev/null 2>&1; then rm -f divi/Divi.zip; fi
  fi
  if [ ! -f divi/Divi.zip ]; then
    cat <<MSG

Divi is not installed yet.
Download Divi from https://www.elegantthemes.com/members-area/ and save it as:

    divi/Divi.zip

then run ./bin/setup.sh again.
(WordPress is already running at $URL - user: admin, password: admin)
MSG
    exit 1
  fi
  echo "==> Installing Divi"
  wp theme install /project/divi/Divi.zip
fi

echo "==> Activating the Perla child theme"
wp theme activate perla-child
wp rewrite structure '/%postname%/' >/dev/null

echo "==> Creating demo pages, menu and sample posts"
wp --user=admin eval-file /project/tools/import-demo.php

cat <<MSG

Done. Site:  $URL
      Admin: $URL/wp-admin   (admin / admin)

One manual step is left, exactly as a buyer would do it (about one minute):
  1. Divi > Divi Library > Import & Export > Import   ->  layouts/Perla-1-Design-System.json
  2. Divi > Theme Builder > Portability (arrows icon) ->  layouts/Perla-3-Theme-Builder.json
Step-by-step instructions: docs/BUYER-GUIDE.md
MSG
