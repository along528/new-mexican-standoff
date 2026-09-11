# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Static website for New Mexican Standoff (improvised music duo, Boston MA). Plain HTML/CSS, no build tools, no frameworks. Hosted on GitHub Pages at https://along528.github.io/new-mexican-standoff/.

## Architecture

- `index.html` — Homepage (hero, photo, about, listen, watch, shows, contact, footer)
- `previous-shows.html` — Past shows archive
- `js/shows.js` — Loads and renders the show lists on both pages
- `data/shows.csv` — Committed snapshot of the Google Sheet; the source the site actually renders from
- `scripts/sync-shows.sh` — Refreshes `data/shows.csv` from the published sheet
- `css/style.css` — Single stylesheet, mobile-first with one breakpoint at 768px
- `images/` — Band photos
- `.nojekyll` — Tells GitHub Pages to skip Jekyll processing

The Listen and Watch embeds are `loading="lazy"` and Bebas Neue is loaded only by the `<link>`
in each `<head>` — never re-add an `@import` to `style.css`. Both pages sit above the Shows
section, and on a cold mobile connection eager third-party embeds and a serialised font request
crowd out the show data.

Both HTML pages share the same header (sticky, with brand link + social icons + hamburger menu) and footer. Each page includes an inline `<script>` block (~10 lines) for the mobile menu toggle. There is no shared templating — changes to header/footer must be applied to both files.

## Show Management

Shows live in a published Google Sheet, but the site does **not** render from it directly.
`js/shows.js` loads `data/shows.csv` (same-origin) first and renders that, then fetches the
sheet as a best-effort upgrade and re-renders if it differs. Both pages share this: `index.html`
calls `loadShows('show-list', 'upcoming')`, `previous-shows.html` calls it with `'past'`. Shows
move between the two pages automatically by date — there is nothing to hand-edit when a show
passes.

The snapshot is the whole point. A request to `docs.google.com` is routinely blocked on iOS
Safari by content blockers, and when that request was the only copy of the data, blocked
visitors got an empty Shows section. Keep these invariants when touching `js/shows.js`:

- The same-origin snapshot must render without any third-party request succeeding.
- A response that isn't shaped like the sheet (an HTML sign-in or error page) must be rejected
  rather than rendered — see `looksLikeShowsCSV`.
- A failed sheet fetch must never wipe already-rendered shows.
- Keep the `pageshow` / `e.persisted` retry. Safari's back/forward cache restores the DOM and
  the JS heap without re-running scripts, so a visitor who navigated away mid-load returns to a
  still-empty list and stays there until a hard reload.
- Stay ES5 + `XMLHttpRequest`. No `fetch`, no `const`/arrow functions in this file — old WebKit
  is part of the audience, and a `fetch` ReferenceError throws synchronously, outside any
  `.catch`, leaving the section silently blank.

To add or retire a show, edit the Google Sheet. `.github/workflows/sync-shows.yml` pulls the
sheet every 3 hours and commits `data/shows.csv` if it changed, which also redeploys Pages. To
push a change immediately, run `./scripts/sync-shows.sh` and commit the result.

## Deployment

Push to `main` branch. GitHub Pages deploys automatically from root (`/`).

All internal links use relative paths (`index.html`, `previous-shows.html`) because the site is served from a subdirectory on GitHub Pages. Do not use absolute paths like `href="/"`.
