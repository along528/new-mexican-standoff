// Google Sheet published CSV URL — update this after publishing your sheet
var SHOWS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2qT_1MlbOc8zF-7Woe0fx2GU_DDaIVBM6f42HAVPQiDLrub_8iaKWlvzQvJce6_coUDX0gCV8iJYi/pub?gid=0&single=true&output=csv';

function loadShows(containerId, mode) {
  var container = document.getElementById(containerId);
  if (!container) return;

  fetch(SHOWS_CSV_URL)
    .then(function (res) { return res.text(); })
    .then(function (csv) {
      var shows = parseCSV(csv);
      renderShowBanner(shows);
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

      if (filtered.length === 0) {
        var noShows = document.getElementById('no-shows');
        if (noShows) noShows.style.display = '';
        return;
      }

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
    })
    .catch(function () {
      container.innerHTML = '<p style="color:var(--color-text-muted)">Unable to load shows.</p>';
    });
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
  if (upcoming.length === 0) return;

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
  var mm = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + mm + '-' + dd;
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
