#!/usr/bin/env bash
# Tries the theme on a copy of Divi, on a throw-away WordPress.
#
#   ./bin/compat.sh                        uses divi/Divi.zip
#   ./bin/compat.sh ~/Downloads/Divi.zip   any other version of Divi 5
#   ./bin/compat.sh 5.19.0                 downloads that version with the Elegant Themes
#                                          account in .env (ET_USERNAME, ET_API_KEY)
#
# It installs WordPress, that Divi and the child theme, lets the theme build the demo site the
# way it does for a customer, and then checks:
#   1. the set-up report
#   2. every page, an article and the 404 page on the public site
#   3. what Divi's own converter changes in the layouts, and that no setting is dropped
#   4. that replacing Divi with a fresh copy (what an update does) changes nothing
#   5. that running the set-up again changes nothing
#   6. the PHP error log
#
# Needs Docker and Node. The development site of bin/setup.sh is not touched.
set -uo pipefail
cd "$(dirname "$0")/.."

# The containers read the zip from ./divi (never committed, see .gitignore).
ZIP="${1:-divi/Divi.zip}"
if [[ "$ZIP" =~ ^5\.[0-9]+(\.[0-9]+)?$ ]]; then
  # A version number: ask Elegant Themes for that release, the way Divi's own "roll back to the
  # previous version" does. Not tried while writing this script: it needs an account.
  if [ -f .env ]; then set -a; . ./.env; set +a; fi
  if [ -z "${ET_USERNAME:-}" ] || [ -z "${ET_API_KEY:-}" ]; then
    echo "To download Divi $ZIP, put ET_USERNAME and ET_API_KEY in .env (see .env.example),"
    echo "or download the zip yourself and run: ./bin/compat.sh path/to/Divi.zip"
    exit 1
  fi
  echo "==> Downloading Divi $ZIP"
  curl -fsSL -G "https://www.elegantthemes.com/api/api_downloads.php" \
    --data-urlencode "api_update=1" --data-urlencode "theme=Divi" --data-urlencode "version=$ZIP" \
    --data-urlencode "api_key=$ET_API_KEY" --data-urlencode "username=$ET_USERNAME" \
    -o divi/compat-test.zip || true
  unzip -tq divi/compat-test.zip >/dev/null 2>&1 || { rm -f divi/compat-test.zip; echo "The download did not return a valid Divi package."; exit 1; }
else
  [ -f "$ZIP" ] || { echo "Divi zip not found: $ZIP"; exit 1; }
  unzip -tq "$ZIP" >/dev/null 2>&1 || { echo "Not a valid zip file: $ZIP"; exit 1; }
  cp "$ZIP" divi/compat-test.zip
fi
export COMPOSE_PROJECT_NAME=perla-compat WP_PORT="${COMPAT_PORT:-8089}"
URL="http://localhost:$WP_PORT"
TMP="$(mktemp -d)"

dc() { docker compose --progress quiet "$@"; }
wp() { dc run --rm -T cli wp "$@" 2>/dev/null; }
cleanup() { dc down -v >/dev/null 2>&1; rm -rf "$TMP" divi/compat-test.zip; }
trap cleanup EXIT

FAILED=0
pass() { echo "  PASS  $1"; }
fail() { echo "  FAIL  $1"; FAILED=$((FAILED + 1)); }
check() { if [ "$1" = "0" ]; then pass "$2"; else fail "$2"; fi; }

echo "==> Starting a clean WordPress on $URL"
dc down -v >/dev/null 2>&1
dc up -d db wordpress || { echo "Docker could not start the containers."; exit 1; }
until dc exec -T wordpress test -f /var/www/html/wp-includes/version.php 2>/dev/null; do sleep 2; done
until wp db check >/dev/null; do sleep 2; done
wp core install --url="$URL" --title="Compatibility test" --admin_user=admin --admin_password=admin --admin_email=admin@example.com --skip-email >/dev/null
wp rewrite structure '/%postname%/' >/dev/null

echo "==> Installing Divi and the child theme"
wp theme install /project/divi/compat-test.zip >/dev/null
wp theme activate perla-child >/dev/null
DIVI="$(wp eval 'echo wp_get_theme( get_template() )->get( "Version" );')"
echo "    Divi $DIVI, WordPress $(wp core version), Perla $(wp eval 'echo PERLA_CHILD_VERSION;')"

echo "==> 1. Set-up, as it runs for a customer who activates the theme"
wp --user=admin eval '
$report = perla_child_setup_run();
foreach ( $report["created"] as $line ) { echo "    + $line\n"; }
foreach ( $report["kept"] as $line ) { echo "    = $line\n"; }
foreach ( $report["notes"] as $line ) { echo "    ! $line\n"; }
echo $report["error"] ? "ERROR: " . $report["error"] . "\n" : ( $report["notes"] ? "NOTES\n" : "CLEAN\n" );' > "$TMP/setup.txt"
grep -v '^\(CLEAN\|NOTES\)$' "$TMP/setup.txt"
grep -q '^CLEAN$' "$TMP/setup.txt"; check $? "the demo site was installed without errors or warnings"

echo "==> 2. Pages on the public site"
wp eval '
foreach ( get_posts( array( "post_type" => array( "page", "post" ), "meta_key" => "_perla_demo", "posts_per_page" => -1, "orderby" => "ID", "order" => "ASC" ) ) as $post ) {
	if ( "post" === $post->post_type && isset( $seen ) ) { continue; }
	if ( "post" === $post->post_type ) { $seen = true; }
	echo wp_make_link_relative( get_permalink( $post ) ), "\n";
}' > "$TMP/paths.txt"
while read -r path; do
  [ -n "$path" ] || continue
  code="$(curl -s -o "$TMP/page.html" -w '%{http_code}' "$URL$path")"
  sections="$(grep -o 'et_pb_section_[0-9]' "$TMP/page.html" | sort -u | wc -l | tr -d ' ')"
  if [ "$code" = "200" ] && [ "$sections" -ge 3 ] && grep -q '<h1' "$TMP/page.html" && ! grep -q 'Fatal error\|Parse error' "$TMP/page.html"; then
    pass "$path  ($sections sections)"
  else
    fail "$path  (status $code, $sections sections)"
  fi
done < "$TMP/paths.txt"
code="$(curl -s -o "$TMP/page.html" -w '%{http_code}' "$URL/this-page-does-not-exist/")"
[ "$code" = "404" ] && grep -q 'This page has gone missing' "$TMP/page.html"; check $? "the 404 page uses its template"
curl -s "$URL/" > "$TMP/home.html"
grep -q 'wp-image-' "$TMP/home.html" && grep -q 'Perla Dental Studio' "$TMP/home.html"; check $? "home page: photos from the Media Library, header and footer in place"
grep -q 'perla-motion.js' "$TMP/home.html"; check $? "home page: the animation script is loaded"

echo "==> 3. What Divi $DIVI converts in the layouts"
wp eval-file /project/tools/migration-report.php > "$TMP/migration.json"
node tools/compat.js "$TMP/migration.json" | sed 's/^/    /'
check "${PIPESTATUS[0]}" "no module and no setting is lost in the conversion"

echo "==> 4. Replacing Divi with a fresh copy, as an update does"
wp eval-file /project/tools/fingerprint.php > "$TMP/before.txt"
wp theme install /project/divi/compat-test.zip --force >/dev/null
curl -s -o /dev/null "$URL/"
wp eval-file /project/tools/fingerprint.php > "$TMP/after-update.txt"
diff "$TMP/before.txt" "$TMP/after-update.txt" | sed 's/^/    /'
check "${PIPESTATUS[0]}" "pages, templates, menu, photos, colours and variables are unchanged ($(wc -l < "$TMP/before.txt" | tr -d ' ') items)"

echo "==> 5. Running the set-up a second time"
wp --user=admin eval 'perla_child_setup_run();' >/dev/null
wp eval-file /project/tools/fingerprint.php > "$TMP/after-again.txt"
diff "$TMP/before.txt" "$TMP/after-again.txt" | sed 's/^/    /'
check "${PIPESTATUS[0]}" "nothing is duplicated or overwritten"

echo "==> 6. PHP error log"
dc exec -T wordpress sh -c 'cat wp-content/debug.log 2>/dev/null' \
  | grep -v 'WordPress.org\|wp_version_check\|wp_update_plugins\|wp_update_themes\|themes_api\|plugins_api' > "$TMP/log.txt"
! grep -q 'perla-child\|PHP Fatal\|PHP Parse' "$TMP/log.txt"; check $? "no fatal error and nothing reported in the files of the theme"
OTHER="$(grep -c 'PHP ' "$TMP/log.txt")"
[ "$OTHER" = "0" ] || { echo "    $OTHER other line(s), from Divi or WordPress themselves:"; sed 's/^\[[^]]*\] //' "$TMP/log.txt" | cut -c1-170 | sort | uniq -c | sort -rn | head -5 | sed 's/^/    /'; }

echo
if [ "$FAILED" = "0" ]; then
  echo "Divi $DIVI: all checks passed."
else
  echo "Divi $DIVI: $FAILED check(s) failed."
  exit 1
fi
