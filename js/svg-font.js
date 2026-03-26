/*  NMS Display Font — SVG glyph renderer
    Design language: geometric, angular, no curves.
    Grid: cap-height Y=0, baseline Y=90, bar thickness ~15u.
    All paths use absolute M/L/Z commands, X normalised to 0. */

const NMS_FONT = {
  gap: 6, // inter-letter spacing (glyph units)

  glyphs: {
    // ── Existing (extracted from sticker.html, X shifted to 0) ──

    '¡': {
      advance: 16,
      path: 'M 0,0 L 16,0 L 16,14 L 0,14 Z M 0,26 L 16,26 L 16,90 L 0,90 Z'
    },
    'N': {
      advance: 66,
      path: 'M 0,0 L 0,90 L 8,90 L 14,78 L 20,90 L 66,90 L 66,0 L 51,0 L 41,50 L 15,0 Z'
    },
    'E': {
      advance: 48,
      path: 'M 0,0 L 36,0 L 36,90 L 0,90 Z M 36,0 L 48,0 L 48,14 L 36,14 Z M 36,38 L 48,38 L 48,52 L 36,52 Z M 36,76 L 48,76 L 48,90 L 36,90 Z'
    },
    'W': {
      advance: 66,
      path: 'M 0,0 L 8,0 L 14,12 L 20,0 L 46,0 L 52,12 L 58,0 L 66,0 L 66,90 L 51,90 L 33,40 L 15,90 L 0,90 Z'
    },
    '!': {
      advance: 16,
      path: 'M 0,0 L 16,0 L 16,64 L 0,64 Z M 0,76 L 16,76 L 16,90 L 0,90 Z'
    },

    // ── Simple rectangular ──

    'I': {
      advance: 16,
      path: 'M 0,0 L 16,0 L 16,90 L 0,90 Z'
    },
    'L': {
      advance: 48,
      path: 'M 0,0 L 36,0 L 36,90 L 0,90 Z M 36,76 L 48,76 L 48,90 L 36,90 Z'
    },
    'T': {
      advance: 48,
      path: 'M 0,0 L 48,0 L 48,36 L 32,36 L 32,90 L 16,90 L 16,36 L 0,36 Z'
    },
    'F': {
      advance: 48,
      path: 'M 0,0 L 36,0 L 36,90 L 0,90 Z M 36,0 L 48,0 L 48,14 L 36,14 Z M 36,38 L 48,38 L 48,52 L 36,52 Z'
    },
    'U': {
      advance: 52,
      path: 'M 0,0 L 20,0 L 20,76 L 32,76 L 32,0 L 52,0 L 52,90 L 0,90 Z'
    },
    'C': {
      advance: 48,
      path: 'M 0,0 L 36,0 L 36,90 L 0,90 Z M 36,0 L 48,0 L 48,14 L 36,14 Z M 36,76 L 48,76 L 48,90 L 36,90 Z'
    },

    // ── Compound rectangular ──

    'H': {
      advance: 52,
      path: 'M 0,0 L 20,0 L 20,38 L 32,38 L 32,0 L 52,0 L 52,90 L 32,90 L 32,52 L 20,52 L 20,90 L 0,90 Z'
    },
    'O': {
      advance: 52,
      path: 'M 0,0 L 52,0 L 52,90 L 0,90 Z M 20,20 L 20,70 L 32,70 L 32,20 Z'
    },
    'P': {
      advance: 48,
      path: 'M 0,0 L 48,0 L 48,44 L 36,44 L 36,90 L 0,90 Z M 20,14 L 20,30 L 32,30 L 32,14 Z'
    },
    'D': {
      advance: 52,
      path: 'M 0,0 L 36,0 L 52,14 L 52,76 L 36,90 L 0,90 Z M 20,20 L 20,70 L 30,70 L 34,64 L 34,26 L 30,20 Z'
    },
    'S': {
      advance: 48,
      path: 'M 0,0 L 48,0 L 48,14 L 36,14 L 36,38 L 48,38 L 48,90 L 0,90 L 0,76 L 12,76 L 12,52 L 0,52 Z'
    },
    'B': {
      advance: 48,
      path: 'M 0,0 L 48,0 L 48,40 L 36,40 L 36,50 L 48,50 L 48,90 L 0,90 Z M 20,12 L 20,28 L 32,28 L 32,12 Z M 20,58 L 20,76 L 32,76 L 32,58 Z'
    },
    'G': {
      advance: 48,
      path: 'M 0,0 L 48,0 L 48,14 L 36,14 L 36,44 L 48,44 L 48,90 L 0,90 Z'
    },

    // ── Diagonal letters ──

    'A': {
      advance: 52,
      path: 'M 0,0 L 52,0 L 52,90 L 32,90 L 32,52 L 20,52 L 20,90 L 0,90 Z M 20,14 L 20,38 L 32,38 L 32,14 Z'
    },
    'V': {
      advance: 66,
      path: 'M 0,0 L 15,0 L 33,50 L 51,0 L 66,0 L 66,14 L 46,90 L 20,90 L 0,14 Z'
    },
    'R': {
      advance: 48,
      path: 'M 0,0 L 48,0 L 48,44 L 36,44 L 48,78 L 48,90 L 0,90 Z M 20,14 L 20,30 L 32,30 L 32,14 Z'
    },
    'M': {
      advance: 66,
      path: 'M 0,0 L 15,0 L 33,50 L 51,0 L 66,0 L 66,90 L 58,90 L 52,78 L 46,90 L 20,90 L 14,78 L 8,90 L 0,90 Z'
    },
    'X': {
      advance: 66,
      path: 'M 0,0 L 27,0 L 33,12 L 39,0 L 66,0 L 66,12 L 46,45 L 66,78 L 66,90 L 39,90 L 33,78 L 27,90 L 0,90 L 0,78 L 20,45 L 0,12 Z'
    },
    'K': {
      advance: 50,
      path: 'M 0,0 L 16,0 L 16,34 L 34,0 L 52,0 L 30,40 L 50,90 L 34,90 L 18,50 L 16,52 L 16,90 L 0,90 Z'
    },
    'Y': {
      advance: 50,
      path: 'M 0,0 L 16,0 L 25,34 L 34,0 L 50,0 L 33,48 L 33,90 L 17,90 L 17,48 Z'
    },

    'Q': {
      advance: 66,
      path: 'M 0,0 L 52,0 L 52,68 L 66,90 L 52,90 L 0,90 Z M 20,20 L 20,70 L 32,70 L 32,20 Z'
    },
    'Z': {
      advance: 48,
      path: 'M 0,0 L 48,0 L 48,14 L 18,76 L 48,76 L 48,90 L 0,90 L 0,76 L 30,14 L 0,14 Z'
    },

    // ── Space ──
    ' ': { advance: 20, path: '' }
  },

  /* Shift every X coordinate in a path string by dx */
  _offsetPath(d, dx) {
    if (!d) return '';
    return d.replace(/([MLZ])\s*([\d.]+),([\d.]+)/g, function(_, cmd, x, y) {
      return cmd + ' ' + (parseFloat(x) + dx) + ',' + y;
    });
  },

  /* Render text into an SVG inside el */
  render(text, el) {
    var chars = text.toUpperCase().split('');
    var x = 0;
    var paths = [];

    for (var i = 0; i < chars.length; i++) {
      var g = this.glyphs[chars[i]];
      if (!g) continue;
      if (g.path) {
        paths.push('<path d="' + this._offsetPath(g.path, x) + '"/>');
      }
      x += g.advance + this.gap;
    }

    if (x > this.gap) x -= this.gap; // remove trailing gap
    var svg = '<svg class="svg-heading" viewBox="0 0 ' + x + ' 90" ' +
              'role="img" aria-hidden="true" preserveAspectRatio="xMinYMid meet">' +
              paths.join('') + '</svg>';
    el.insertAdjacentHTML('afterbegin', svg);
  },

  /* Auto-initialise all [data-svg-text] elements */
  init() {
    var els = document.querySelectorAll('[data-svg-text]');
    for (var i = 0; i < els.length; i++) {
      this.render(els[i].getAttribute('data-svg-text'), els[i]);
    }
  }
};

document.addEventListener('DOMContentLoaded', function() { NMS_FONT.init(); });
