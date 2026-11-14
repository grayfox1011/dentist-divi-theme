#!/usr/bin/env bash
# Turns docs/BUYER-GUIDE.md into docs/Perla-Setup-Guide.pdf (the guide customers receive).
# Needs pandoc and Chrome or Chromium. Usage: bash tools/guide-pdf.sh
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-}"
for candidate in chromium chromium-browser google-chrome "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
  [ -n "$CHROME" ] && break
  if command -v "$candidate" >/dev/null 2>&1 || [ -x "$candidate" ]; then CHROME="$candidate"; fi
done
[ -n "$CHROME" ] || { echo "Chrome or Chromium not found. Set CHROME=/path/to/chrome and run again."; exit 1; }
command -v pandoc >/dev/null 2>&1 || { echo "pandoc not found: install it from https://pandoc.org"; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cat > "$TMP/guide.html" <<'HTML'
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Perla – Setup Guide</title>
<style>
  @page { size: A4; margin: 18mm 17mm 20mm; }
  body { font: 10.5pt/1.55 "Helvetica Neue", Helvetica, Arial, sans-serif; color: #26334d; }
  h1 { font-size: 22pt; line-height: 1.2; color: #0b1b3f; margin: 0 0 6pt; }
  h2 { font-size: 14.5pt; color: #0b1b3f; margin: 22pt 0 6pt; padding-top: 10pt; border-top: 1px solid #dce6f4; break-after: avoid; }
  h3 { font-size: 11.5pt; color: #0b1b3f; margin: 14pt 0 4pt; break-after: avoid; }
  p, ul, ol { margin: 0 0 7pt; }
  li { margin-bottom: 2.5pt; }
  ul.task-list { list-style: none; padding-left: 2pt; }
  ul.task-list input { margin: 0 6pt 0 0; vertical-align: -1pt; }
  a { color: #1a66e8; text-decoration: none; }
  code { font: 9.5pt/1.3 Menlo, Consolas, monospace; background: #edf4ff; border-radius: 3px; padding: 1px 4px; }
  table { border-collapse: collapse; width: 100%; margin: 4pt 0 10pt; break-inside: avoid; }
  th, td { border: 1px solid #dce6f4; padding: 5pt 7pt; text-align: left; vertical-align: top; }
  th { background: #f6f9fe; color: #0b1b3f; }
  hr { border: 0; border-top: 1px solid #dce6f4; margin: 18pt 0 8pt; }
  hr + p { font-size: 8.5pt; color: #6b7892; }
</style>
</head>
<body>
HTML
pandoc --from gfm --to html docs/BUYER-GUIDE.md >> "$TMP/guide.html"
printf '</body>\n</html>\n' >> "$TMP/guide.html"

"$CHROME" --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$PWD/docs/Perla-Setup-Guide.pdf" "file://$TMP/guide.html" >/dev/null 2>&1

echo "Created docs/Perla-Setup-Guide.pdf ($(du -h docs/Perla-Setup-Guide.pdf | cut -f1))"
