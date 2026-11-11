#!/bin/bash
# Builds dist/sideline.html (the artifact), dist/preview.html (for local browser tests) and tests/t.js (script only, for node harnesses)
cd "$(dirname "$0")"; mkdir -p dist shots
{ cat src/head.html; echo '<style>'; cat src/style.css; echo '</style>'; cat src/body.html; echo '<script>'; cat src/logodata.js src/main.js; echo '</script>'; } > dist/sideline.html
{ echo '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'; cat dist/sideline.html; echo '</body></html>'; } > dist/preview.html
cat src/logodata.js src/main.js > tests/t.js
node --check tests/t.js && echo "build ok: $(wc -c < dist/sideline.html) bytes"
