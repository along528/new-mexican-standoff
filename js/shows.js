// Shows render from a same-origin snapshot (data/shows.csv) first, then the
// published Google Sheet is tried as a best-effort upgrade.
//
// The snapshot is what makes shows reliable: a request to docs.google.com is
// routinely blocked on iOS Safari (content blockers), and when the site's only
// copy of the data lives behind that request, blocked visitors see an empty
// Shows section. Everything here is XHR + ES5 so it also works on old WebKit
// that predates fetch().

// Google Sheet published CSV URL — update this after publishing your sheet
var SHOWS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2qT_1MlbOc8zF-7Woe0fx2GU_DDaIVBM6f42HAVPQiDLrub_8iaKWlvzQvJce6_coUDX0gCV8iJYi/pub?gid=0&single=true&output=csv';

// Committed snapshot of the sheet — kept in step by scripts/sync-shows.sh
var SHOWS_LOCAL_URL = 'data/shows.csv';

var SHOWS_TIMEOUT_MS = 8000;

function loadShows(containerId, mode) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var lastCSV = null;

  function apply(csv) {
    // A blocked or intercepted request can resolve with an HTML error or
    // consent page — only render something shaped like our sheet.
    if (!looksLikeShowsCSV(csv) || csv === lastCSV) return;
    lastCSV = csv;
    renderShows(container, parseCSV(csv), mode);
  }

  function loadSheet() {
    fetchText(SHOWS_CSV_URL, function (csv) {
      apply(csv);
    }, function () {
      // Sheet unreachable. If the snapshot rendered we have nothing to do;
      // otherwise both copies failed and the visitor deserves to know.
      if (lastCSV === null) {
        container.innerHTML = '<p style="color:var(--color-text-muted)">Unable to load shows.</p>';
      }
    });
  }

  function start() {
    fetchText(SHOWS_LOCAL_URL, function (csv) {
      apply(csv);
      loadSheet();
    }, loadSheet);
  }

  start();

  // Safari's back/forward cache restores the page as it was — same DOM, same
  // JS heap, scripts not re-run. Someone who navigated away before the shows
  // arrived comes back to the empty list and stays there until a hard reload.
  // lastCSV is still null in exactly that case, so retry then and only then.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && lastCSV === null) start();
  });
}

function renderShows(container, shows, mode) {
  // Never let a banner failure take the show list down with it.
  try {
    renderShowBanner(shows);
  } catch (e) {}

  var today = todayString();

  var filtered;
  if (mode === 'upcoming') {
    filtered = shows
      .filter(function (s) { return s.date >= today; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  } else {
    filtered = shows
      .filter(function (s) { return s.date < today; })
      .sort(function (a, b) { return a.date > b.date ? -1 : 1; });
  }

  // Toggled both ways because this can run twice — snapshot, then sheet.
  var noShows = document.getElementById('no-shows');
  if (noShows) noShows.style.display = filtered.length === 0 ? '' : 'none';

  var html = '';
  for (var i = 0; i < filtered.length; i++) {
    var show = filtered[i];
    var isToday = show.date === today;
    var dateStr = formatDate(show.date, mode);
    html += '<article class="show-item' + (isToday ? ' show-today' : '') + '">'
      + '<div class="show-venue">' + escapeHTML(show.venue) + '</div>'
      + '<div class="show-location">' + escapeHTML(show.location) + '</div>'
      + '<div class="show-date">' + dateStr + (isToday ? ' <span class="show-today-label">Today!</span>' : '') + '</div>'
      + '<a class="show-ticket" href="' + escapeHTML(show.url) + '" target="_blank" rel="noopener">Info</a>'
      + '</article>';
  }
  container.innerHTML = html;
}

// Show a banner linking to the next show when it's within the next 2 weeks.
// The banner element only exists on pages that opt in.
function renderShowBanner(shows) {
  var banner = document.getElementById('show-banner');
  var next = document.getElementById('show-banner-next');
  if (!banner || !next) return;

  var today = todayString();
  var cutoff = dateString(14);
  var upcoming = shows
    .filter(function (s) { return s.date >= today && s.date <= cutoff; })
    .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  if (upcoming.length === 0) {
    banner.style.display = 'none';
    return;
  }

  var show = upcoming[0];
  var when = show.date === today ? 'Today' : formatDate(show.date, 'upcoming');
  next.href = show.url;
  next.innerHTML = '<span class="show-banner-label">Next Show</span> '
    + '<span class="show-banner-date">' + when + '</span> '
    + escapeHTML(show.venue)
    + '<span class="show-banner-loc"> &middot; ' + escapeHTML(show.location) + '</span>'
    + ' <span class="show-banner-arrow">&rarr;</span>';
  banner.style.display = '';
}

// XHR rather than fetch: universally supported, and it has a real timeout so a
// hung request can't leave the section blank forever.
function fetchText(url, onSuccess, onError) {
  var xhr;
  try {
    xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
  } catch (e) {
    onError();
    return;
  }
  xhr.timeout = SHOWS_TIMEOUT_MS;
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) onSuccess(xhr.responseText);
    else onError();
  };
  xhr.onerror = onError;
  xhr.ontimeout = onError;
  xhr.onabort = onError;
  try {
    xhr.send();
  } catch (e) {
    onError();
  }
}

function looksLikeShowsCSV(text) {
  return typeof text === 'string' && /^\s*date\s*,\s*venue\s*,\s*location\s*,\s*url/i.test(text);
}

function parseCSV(text) {
  var lines = text.trim().split('\n');
  var shows = [];
  for (var i = 1; i < lines.length; i++) {
    var fields = parseCSVLine(lines[i]);
    if (fields.length >= 4) {
      shows.push({
        date: fields[0].trim(),
        venue: fields[1].trim(),
        location: fields[2].trim(),
        url: fields[3].trim()
      });
    }
  }
  return shows;
}

function parseCSVLine(line) {
  var fields = [];
  var current = '';
  var inQuotes = false;
  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

function todayString() {
  return dateString(0);
}

function dateString(offsetDays) {
  var d = new Date();
  d.setDate(d.getDate() + offsetDays);
  var mm = pad2(d.getMonth() + 1);
  var dd = pad2(d.getDate());
  return d.getFullYear() + '-' + mm + '-' + dd;
}

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function formatDate(dateStr, mode) {
  var parts = dateStr.split('-');
  var m = parseInt(parts[1], 10);
  var d = parseInt(parts[2], 10);
  if (mode === 'past') {
    var yy = parts[0].slice(2);
    return m + '.' + d + '.' + yy;
  }
  return m + '.' + d;
}

function escapeHTML(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
