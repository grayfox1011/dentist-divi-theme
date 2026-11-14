#!/usr/bin/env bash
# Builds the file you upload to WordPress.org (or install by hand): dist/perla.zip
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist && mkdir -p dist

# Only the theme folder goes in the zip. Hidden files are left out: WordPress.org does not accept them.
(cd theme && zip -qr ../dist/perla.zip perla -x '*/.*' -x '*.DS_Store')

echo "Created dist/perla.zip ($(du -h dist/perla.zip | cut -f1), $(unzip -Z1 dist/perla.zip | grep -vc '/$') files)"
