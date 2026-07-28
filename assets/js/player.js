/* ══════════════════════════════════════════════════════════════════
   PLAYER — pixel transport with a real waveform where possible.

   Two display modes, picked automatically:

   • WAVE — the file was fetched and decoded, so the drawn peaks are
     the actual audio. This works for anything served from this site
     (assets/audio/...).

   • BAR  — the host doesn't send CORS headers, so the audio can be
     played but not read. Transistor, Buzzsprout, Podbean and Audible
     all fall in here. We show a segmented progress bar instead of
     inventing a waveform, because a decorative fake waveform on an
     audio engineer's portfolio would be a bad look.

   Only one thing plays at a time, including the YouTube embeds.
   ══════════════════════════════════════════════════════════════════ */

window.BA = window.BA || {};

BA.player = (function () {
  var all = [];
  var colors = {};

  function readColors() {
    var s = getComputedStyle(document.documentElement);
    colors = {
      dim:   s.getPropertyValue('--purple').trim(),
      lit:   s.getPropertyValue('--gold').trim(),
      head:  s.getPropertyValue('--white').trim(),
      track: s.getPropertyValue('--panel-hi').trim()
    };
  }

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* Things that make sound but aren't ba-players — currently the tape
     deck. They register here so "only one thing plays at a time" keeps
     holding across the whole site. */
  var externals = [];

  function pauseExternals(except) {
    externals.forEach(function (e) { if (e !== except && e.pause) e.pause(); });
  }

  function pauseOthers(except) {
    all.forEach(function (p) { if (p !== except) p.audio.pause(); });
    pauseExternals(null);
    if (BA.pauseVideos) BA.pauseVideos();
  }

  BA.pauseAllAudio = function () {
    all.forEach(function (p) { p.audio.pause(); });
    pauseExternals(null);
  };

  function create(src, opts) {
    opts = opts || {};
    readColors();

    var wrap = document.createElement('div');
    wrap.className = 'ba-player';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ba-play';
    btn.dataset.state = 'paused';
    btn.innerHTML = '<span aria-hidden="true">▶</span>';
    btn.setAttribute('aria-label', 'Play ' + (opts.label || 'audio'));

    var waveWrap = document.createElement('div');
    waveWrap.className = 'ba-wave';
    waveWrap.setAttribute('role', 'slider');
    waveWrap.setAttribute('tabindex', '0');
    waveWrap.setAttribute('aria-label', 'Seek');
    waveWrap.setAttribute('aria-valuemin', '0');
    waveWrap.setAttribute('aria-valuemax', '100');
    waveWrap.setAttribute('aria-valuenow', '0');

    var canvas = document.createElement('canvas');
    waveWrap.appendChild(canvas);

    var time = document.createElement('span');
    time.className = 'ba-time';
    time.textContent = '0:00';

    wrap.appendChild(btn);
    wrap.appendChild(waveWrap);
    wrap.appendChild(time);

    var audio = new Audio();
    audio.preload = 'metadata';
    audio.src = src;

    var self = { el: wrap, audio: audio, peaks: null, mode: 'bar' };
    all.push(self);

    /* ── Drawing ─────────────────────────────────────────────── */
    function draw() {
      var dpr = window.devicePixelRatio || 1;
      var w = waveWrap.clientWidth;
      var h = waveWrap.clientHeight;
      if (!w || !h) return;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      var c = canvas.getContext('2d');
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);

      var prog = audio.duration ? audio.currentTime / audio.duration : 0;
      var mid = h / 2;

      if (self.mode === 'wave' && self.peaks) {
        var n = self.peaks.length;
        var bw = w / n;
        for (var i = 0; i < n; i++) {
          var bh = Math.max(2, self.peaks[i] * (h - 4));
          c.fillStyle = (i / n) <= prog ? colors.lit : colors.dim;
          c.fillRect(i * bw, mid - bh / 2, Math.max(1, bw - 1), bh);
        }
      } else {
        // Segmented progress bar — honest about not knowing the audio
        var seg = 7, gap = 2;
        var count = Math.floor(w / (seg + gap));
        var lit = Math.round(count * prog);
        for (var j = 0; j < count; j++) {
          c.fillStyle = j < lit ? colors.lit : colors.track;
          var sh = j < lit ? h - 12 : h - 20;
          c.fillRect(j * (seg + gap), mid - sh / 2, seg, sh);
        }
      }

      // Playhead
      if (prog > 0) {
        c.fillStyle = colors.head;
        c.fillRect(Math.min(w - 2, prog * w), 2, 2, h - 4);
      }
    }
    self.draw = draw;

    /* ── Try to decode for a real waveform ───────────────────── */
    function tryDecode() {
      if (!/^(\.|\/|assets\/)/.test(src) && src.indexOf(location.origin) !== 0) {
        return; // definitely cross-origin, don't bother
      }
      var ctx = BA.sfx.context();
      if (!ctx) return;
      fetch(src)
        .then(function (r) { return r.ok ? r.arrayBuffer() : Promise.reject(); })
        .then(function (b) { return ctx.decodeAudioData(b); })
        .then(function (buf) {
          var raw = buf.getChannelData(0);
          var n = 140;
          var block = Math.floor(raw.length / n);
          var peaks = [];
          var max = 0;
          for (var i = 0; i < n; i++) {
            var sum = 0;
            for (var j = 0; j < block; j += 16) sum = Math.max(sum, Math.abs(raw[i * block + j] || 0));
            peaks.push(sum);
            if (sum > max) max = sum;
          }
          if (max > 0) peaks = peaks.map(function (p) { return p / max; });
          self.peaks = peaks;
          self.mode = 'wave';
          draw();
        })
        .catch(function () { /* stay in bar mode */ });
    }

    /* ── Events ──────────────────────────────────────────────── */
    var listenedFrom = null;

    btn.addEventListener('click', function () {
      if (audio.paused) {
        pauseOthers(self);
        audio.play().catch(function () {});
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', function () {
      btn.dataset.state = 'playing';
      btn.innerHTML = '<span aria-hidden="true">❚❚</span>';
      btn.setAttribute('aria-label', 'Pause ' + (opts.label || 'audio'));
      BA.ach.award('listen');
      BA.meter && BA.meter(true);
      listenedFrom = audio.currentTime;
      tick();
    });

    audio.addEventListener('pause', function () {
      btn.dataset.state = 'paused';
      btn.innerHTML = '<span aria-hidden="true">▶</span>';
      btn.setAttribute('aria-label', 'Play ' + (opts.label || 'audio'));
      BA.meter && BA.meter(false);
      listenedFrom = null;
    });

    audio.addEventListener('ended', function () {
      btn.dataset.state = 'paused';
      btn.innerHTML = '<span aria-hidden="true">▶</span>';
      draw();
    });

    audio.addEventListener('loadedmetadata', function () {
      time.textContent = fmt(audio.duration);
      draw();
      tryDecode();
    });

    audio.addEventListener('timeupdate', function () {
      time.textContent = fmt(audio.duration ? audio.duration - audio.currentTime : audio.currentTime);
      var pct = audio.duration ? Math.round((audio.currentTime / audio.duration) * 100) : 0;
      waveWrap.setAttribute('aria-valuenow', String(pct));
      waveWrap.setAttribute('aria-valuetext', fmt(audio.currentTime) + ' of ' + fmt(audio.duration));
      if (listenedFrom !== null && audio.currentTime - listenedFrom >= 30) {
        BA.ach.award('listen_long');
        listenedFrom = null;
      }
    });

    function tick() {
      if (audio.paused) return;
      draw();
      requestAnimationFrame(tick);
    }

    function seekTo(clientX) {
      var r = waveWrap.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      if (audio.duration) { audio.currentTime = p * audio.duration; draw(); }
    }

    waveWrap.addEventListener('pointerdown', function (e) {
      waveWrap.setPointerCapture(e.pointerId);
      seekTo(e.clientX);
      var move = function (ev) { seekTo(ev.clientX); };
      var up = function () {
        waveWrap.removeEventListener('pointermove', move);
        waveWrap.removeEventListener('pointerup', up);
      };
      waveWrap.addEventListener('pointermove', move);
      waveWrap.addEventListener('pointerup', up);
    });

    waveWrap.addEventListener('keydown', function (e) {
      if (!audio.duration) return;
      if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { audio.currentTime = Math.max(0, audio.currentTime - 5); e.preventDefault(); }
      else if (e.key === 'Home') { audio.currentTime = 0; e.preventDefault(); }
      else if (e.key === ' ' || e.key === 'Enter') { btn.click(); e.preventDefault(); }
      draw();
    });

    requestAnimationFrame(draw);
    return self;
  }

  window.addEventListener('resize', function () {
    all.forEach(function (p) { p.draw(); });
  });

  return {
    create: create,
    pauseOthers: pauseOthers,
    registerExternal: function (obj) { externals.push(obj); return obj; },
    refreshColors: function () { readColors(); all.forEach(function (p) { p.draw(); }); },
    destroyAll: function () {
      all.forEach(function (p) { p.audio.pause(); p.audio.src = ''; });
      all = [];
      externals.forEach(function (e) { if (e.destroy) e.destroy(); });
      externals = [];
    }
  };
})();
