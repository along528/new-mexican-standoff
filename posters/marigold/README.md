# Marigold Poster

Show poster for Marigold, Brattleboro — July 4, 2026.

## Files

- `poster.html` — source, 11×17 portrait (print). Uses `../../css/style.css` and `../../images/band.jpg`, so open it from this directory (not copied elsewhere) or the paths will break.
- `poster.png` — rendered output, 2720×4204 (≈247 dpi at 11×17).
- `poster-square.html` — source, 1:1 square for Instagram. Same content reflowed into a square; the band photo is cropped to a strip.
- `poster-square.png` — rendered output, 2160×2160 (2× a 1080 canvas).

## Regenerating `poster.png` (11×17 portrait)

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

## Regenerating `poster-square.png` (1:1 Instagram)

Run from this directory:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 \
  --window-size=1080,1080 \
  --virtual-time-budget=5000 \
  --screenshot="$PWD/poster-square.png" \
  "file://$PWD/poster-square.html"
```

Notes:
- `1080×1080` is the square design canvas; `--force-device-scale-factor=2` yields a 2160×2160 export (Instagram displays square posts up to 1080×1080, so this is comfortably sharp).
- Unlike the portrait version, the square version uses fixed font sizes (not viewport-based clamps), so the layout is locked to the 1080px canvas.

## Editing

Tweak `poster.html` live by opening it in a browser (`open poster.html`). Re-run the command above to regenerate the PNG.
