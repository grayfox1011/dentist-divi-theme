#!/usr/bin/env bash
# Builds the two files to upload or install: dist/perla.zip (theme) and dist/perla-starter.zip (plugin)
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist && mkdir -p dist

# Only the theme folder goes in the zip. Hidden files are left out: WordPress.org does not accept them.
(cd theme && zip -qr ../dist/perla.zip perla -x '*/.*' -x '*.DS_Store')

(cd plugin && zip -qr ../dist/perla-starter.zip perla-starter -x '*/.*' -x '*.DS_Store')

for zip in dist/perla.zip dist/perla-starter.zip; do
  echo "Created $zip ($(du -h "$zip" | cut -f1), $(unzip -Z1 "$zip" | grep -vc '/$') files)"
done
