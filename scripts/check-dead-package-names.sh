#!/usr/bin/env bash
# Fails if a dead Affitor package name reappears in PUBLISHED docs.
# Canonical = @affitor/sdk  (subpaths: . browser, /server, /react, /pure).
# Dead: affitor-sdk, affitor-node, @affitor/tracker, @affitor/node.
# Whitelisted (legitimate, NOT the package): the hosted script filename,
# the data attribute, and the click/customer cookie+metadata keys.
set -euo pipefail
cd "$(dirname "$0")/.."
PATTERN='affitor-sdk|affitor-node|@affitor/tracker|@affitor/node'
HITS=$(grep -rnE "$PATTERN" content/ public/skill.md public/llms.txt \
  --include='*.mdx' --include='*.md' --include='*.txt' 2>/dev/null \
  | grep -vE 'affitor-tracker\.js|data-affitor-program-id|affitor_click_id|affitor_customer_key' \
  || true)
if [ -n "$HITS" ]; then
  echo "❌ Dead Affitor package name in published docs — use @affitor/sdk (+ /server, /react):"
  echo "$HITS"
  exit 1
fi
echo "✅ No dead Affitor package names in published docs."
