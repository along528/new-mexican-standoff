# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Static website for New Mexican Standoff (improvised music duo, Boston MA). Plain HTML/CSS, no build tools, no frameworks. Hosted on GitHub Pages at https://along528.github.io/new-mexican-standoff/.

## Architecture

- `index.html` — Homepage (hero, photo, about, shows, contact, footer)
- `previous-shows.html` — Past shows archive
- `css/style.css` — Single stylesheet, mobile-first with one breakpoint at 768px
- `images/` — Band photos
- `.nojekyll` — Tells GitHub Pages to skip Jekyll processing

Both HTML pages share the same header (sticky, with brand link + social icons + hamburger menu) and footer. Each page includes an inline `<script>` block (~10 lines) for the mobile menu toggle. There is no shared templating — changes to header/footer must be applied to both files.

## Show Management

Shows are hardcoded as `<article class="show-item">` blocks. To add a show, copy an existing block and update venue/location/date/ticket-link. To retire a show, move the `<article>` block from `index.html` to the top of the show list in `previous-shows.html`.

## Deployment

Push to `main` branch. GitHub Pages deploys automatically from root (`/`).

All internal links use relative paths (`index.html`, `previous-shows.html`) because the site is served from a subdirectory on GitHub Pages. Do not use absolute paths like `href="/"`.
