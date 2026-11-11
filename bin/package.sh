#!/usr/bin/env bash
# Builds the files you upload to Etsy into ./dist
set -euo pipefail
cd "$(dirname "$0")/.."

NAME="Perla-Divi5-Dental-Theme"
rm -rf dist && mkdir -p "dist/$NAME"

# 1. The installable child theme.
(cd theme && zip -qr "../dist/$NAME/perla-child.zip" perla-child -x '*.DS_Store')

# 2. The Divi layouts and the buyer guide.
cp -R layouts "dist/$NAME/layouts"
cp docs/BUYER-GUIDE.md "dist/$NAME/READ-ME-FIRST.md"
[ -f docs/Perla-Guide.pdf ] && cp docs/Perla-Guide.pdf "dist/$NAME/Perla-Guide.pdf"

# 3. One zip for the customer.
(cd dist && zip -qr "$NAME.zip" "$NAME")
echo "Created dist/$NAME.zip ($(du -h "dist/$NAME.zip" | cut -f1))"
