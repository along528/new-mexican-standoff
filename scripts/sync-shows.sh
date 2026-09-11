#!/bin/sh
# Refresh the committed snapshot (data/shows.csv) from the published Google Sheet.
#
# The site renders from the snapshot first, so this is what makes sheet edits
# visible to visitors whose browser can't reach docs.google.com — most often
# iOS Safari with a content blocker installed.
#
# Usage: ./scripts/sync-shows.sh   (then commit data/shows.csv if it changed)

set -eu

SHEET_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vR2qT_1MlbOc8zF-7Woe0fx2GU_DDaIVBM6f42HAVPQiDLrub_8iaKWlvzQvJce6_coUDX0gCV8iJYi/pub?gid=0&single=true&output=csv'

cd "$(dirname "$0")/.."

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

curl -fsSL --retry 3 --max-time 30 "$SHEET_URL" -o "$tmp"

# Refuse to overwrite a good snapshot with a login page or an error body.
if ! head -1 "$tmp" | grep -qiE '^[[:space:]]*date[[:space:]]*,[[:space:]]*venue[[:space:]]*,[[:space:]]*location[[:space:]]*,[[:space:]]*url'; then
  echo "sync-shows: response is not the shows CSV (unexpected header), aborting" >&2
  head -3 "$tmp" >&2
  exit 1
fi

if [ -f data/shows.csv ] && cmp -s "$tmp" data/shows.csv; then
  echo "sync-shows: data/shows.csv already up to date"
  exit 0
fi

mv "$tmp" data/shows.csv
trap - EXIT
echo "sync-shows: updated data/shows.csv ($(( $(wc -l < data/shows.csv) - 1 )) shows)"
