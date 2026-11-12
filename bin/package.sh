#!/usr/bin/env bash
# Builds the files you upload to Etsy into ./dist
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist && mkdir -p dist

# 1. The theme, ready to upload in WordPress (Appearance > Themes > Add New Theme > Upload Theme).
#    It installs the demo site by itself when it is activated.
(cd theme && zip -qr ../dist/perla-child.zip perla-child -x '*.DS_Store')

# 2. The guide for the customer (the PDF is made with tools/guide-pdf.sh).
cp docs/BUYER-GUIDE.md dist/Perla-Setup-Guide.md
if [ -f docs/Perla-Setup-Guide.pdf ]; then cp docs/Perla-Setup-Guide.pdf dist/; fi

# 3. Optional extras: the same layouts as plain Divi files, for customers who import by hand.
cp theme/perla-child/demo/pages.json dist/Perla-Pages-for-Divi-Library.json
cp theme/perla-child/demo/theme-builder.json dist/Perla-Theme-Builder-Templates.json

echo "Created:"
for file in dist/*; do echo "  $file ($(du -h "$file" | cut -f1))"; done
