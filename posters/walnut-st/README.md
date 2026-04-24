# Walnut St. Cafe Poster

Show poster for Walnut St. Cafe, Lynn — May 2, 2026.

## Files

- `poster.html` — source. Uses `../../css/style.css` and `../../images/band.jpg`, so open it from this directory (not copied elsewhere) or the paths will break.
- `poster.png` — rendered output, 2720×4204 (≈247 dpi at 11×17).

## Regenerating `poster.png`

Run from this directory:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=4 \
  --window-size=680,1051 \
  --virtual-time-budget=5000 \
  --screenshot="$PWD/poster.png" \
  "file://$PWD/poster.html"
```

Notes:
- `680×1051` matches the poster's design width and 11:17 aspect ratio.
- `--force-device-scale-factor=4` gives a ~4× pixel-density capture for print.
- `--virtual-time-budget=5000` gives Google Fonts time to load (Bebas Neue) before the screenshot.
- The PNG captures the browser layout exactly. Chrome's built-in `Cmd+P → Save as PDF` uses the `@media print` rules and will look different — use this command instead.

## Editing

Tweak `poster.html` live by opening it in a browser (`open poster.html`). Re-run the command above to regenerate the PNG.
