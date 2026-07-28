/* ══════════════════════════════════════════════════════════════════
   TAPE DECK — the Music section's player.

   One deck, one tape at a time. Selecting a track ejects whatever is
   loaded, feeds the new tape in, clunks it home and starts the motor.

   This is also why Music isn't a grid of players: the six tracks are
   ~49MB together. Nothing is fetched until a tape is chosen, and only
   metadata is fetched until it's actually played.

   ── Timing ──────────────────────────────────────────────────────
   0ms    eject starts, current tape slides out       [tapeEject]
   320ms  new tape drops in from the top
   740ms  tape seats, clunk                           [tapeIn]
   740ms  motor spins up, playback starts             [tapePlay]

   Four sound slots are reserved for these in audio.js: tapeEject,
   tapeIn, tapePlay, tapeStop. They're synthesized placeholders until
   real files are dropped into BA.sfx.files.
   ══════════════════════════════════════════════════════════════════ */

window.BA = window.BA || {};

BA.deck = (function () {

  var EJECT = 320;
  var INSERT = 420;

  function reduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function mount(host, tracks) {
    var esc = BA.views.esc;
    var eject = reduced() ? 0 : EJECT;
    var insert = reduced() ? 0 : INSERT;

    host.innerHTML =
      '<div class="deck">' +
        '<div class="deck-machine">' +
          '<div class="deck-slot">' +
            '<div class="deck-empty" id="deck-empty">NO TAPE</div>' +
            '<div class="tape" id="tape" hidden>' +
              '<div class="tape-top">' +
                '<span class="tape-brand">BEARDED AUDIO</span>' +
                '<span class="tape-side" id="tape-side">A</span>' +
              '</div>' +
              '<div class="tape-label">' +
                '<span class="tape-title" id="tape-title"></span>' +
                '<span class="tape-band" id="tape-band"></span>' +
              '</div>' +
              '<div class="tape-window">' +
                '<div class="reel reel--l" id="reel-l"><span class="reel-pack"></span></div>' +
                '<div class="tape-span"></div>' +
                '<div class="reel reel--r" id="reel-r"><span class="reel-pack"></span></div>' +
              '</div>' +
              '<div class="tape-screws" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
            '</div>' +
          '</div>' +

          '<div class="deck-transport">' +
            '<button class="deck-btn" id="deck-play" type="button" aria-label="Play">' +
              '<span aria-hidden="true">▶</span></button>' +
            '<div class="deck-bar" id="deck-bar" role="slider" tabindex="0" ' +
              'aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
              '<div class="deck-bar-fill" id="deck-fill"></div>' +
            '</div>' +
            '<span class="deck-time" id="deck-time">0:00</span>' +
          '</div>' +

          '<div class="deck-nowplaying" id="deck-credits"></div>' +
        '</div>' +

        '<div class="deck-side">' +
          '<h2 class="fs-head" style="font-size:.6rem">SELECT TAPE</h2>' +
          '<ol class="tracklist" id="tracklist"></ol>' +
        '</div>' +
      '</div>' +
      '<p class="sr-only" aria-live="polite" id="deck-live"></p>';

    var tapeEl   = host.querySelector('#tape');
    var emptyEl  = host.querySelector('#deck-empty');
    var titleEl  = host.querySelector('#tape-title');
    var bandEl   = host.querySelector('#tape-band');
    var sideEl   = host.querySelector('#tape-side');
    var reelL    = host.querySelector('#reel-l');
    var reelR    = host.querySelector('#reel-r');
    var playBtn  = host.querySelector('#deck-play');
    var bar      = host.querySelector('#deck-bar');
    var fill     = host.querySelector('#deck-fill');
    var timeEl   = host.querySelector('#deck-time');
    var credits  = host.querySelector('#deck-credits');
    var live     = host.querySelector('#deck-live');
    var listEl   = host.querySelector('#tracklist');

    var audio = new Audio();
    audio.preload = 'metadata';

    var current = -1;
    var busy = false;
    var listenedFrom = null;

    /* ── Track list ──────────────────────────────────────────────── */
    tracks.forEach(function (t, i) {
      var li = document.createElement('li');
      li.innerHTML =
        '<button class="track" type="button" data-i="' + i + '">' +
          '<span class="track-n">' + (i < 9 ? '0' : '') + (i + 1) + '</span>' +
          '<span class="track-main">' +
            '<span class="track-title">' + esc(t.title) + '</span>' +
            '<span class="track-band">' + esc(t.project) + '</span>' +
          '</span>' +
          '<span class="track-eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '</button>';
      listEl.appendChild(li);
    });

    listEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.track');
      if (btn) select(parseInt(btn.dataset.i, 10), true);
    });

    listEl.addEventListener('mouseover', function (e) {
      if (e.target.closest('.track')) BA.sfx.play('hover');
    });

    function markList() {
      Array.prototype.forEach.call(listEl.querySelectorAll('.track'), function (b, i) {
        var on = i === current;
        b.classList.toggle('is-current', on);
        b.classList.toggle('is-playing', on && !audio.paused);
        if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
    }

    /* ── Reels ───────────────────────────────────────────────────── */
    function reels() {
      var p = audio.duration ? audio.currentTime / audio.duration : 0;
      // Supply reel empties, take-up reel fills. Floor of 0.62 keeps a
      // readable ring of tape outside the hub even when nearly empty.
      var l = 1 - 0.38 * p;
      var r = 0.62 + 0.38 * p;
      reelL.style.setProperty('--pack', l.toFixed(3));
      reelR.style.setProperty('--pack', r.toFixed(3));
      // Constant tape speed means a smaller reel has to spin faster.
      reelL.style.setProperty('--spin', (0.45 + l * 0.75).toFixed(3) + 's');
      reelR.style.setProperty('--spin', (0.45 + r * 0.75).toFixed(3) + 's');
    }

    /* ── Transport ───────────────────────────────────────────────── */
    function paint() {
      var p = audio.duration ? audio.currentTime / audio.duration : 0;
      fill.style.width = (p * 100).toFixed(2) + '%';
      timeEl.textContent = audio.duration
        ? fmt(audio.duration - audio.currentTime)
        : '0:00';
      bar.setAttribute('aria-valuenow', String(Math.round(p * 100)));
      if (audio.duration) {
        bar.setAttribute('aria-valuetext', fmt(audio.currentTime) + ' of ' + fmt(audio.duration));
      }
      reels();
    }

    function tick() {
      if (audio.paused) return;
      paint();
      requestAnimationFrame(tick);
    }

    function play() {
      if (current < 0) return;
      BA.player.pauseOthers(external);
      audio.play().then(function () {
        BA.sfx.play('tapePlay');
      }).catch(function () { /* blocked; the button is right there */ });
    }

    playBtn.addEventListener('click', function () {
      if (current < 0) { select(0, true); return; }
      if (audio.paused) play();
      else { audio.pause(); BA.sfx.play('tapeStop'); }
    });

    audio.addEventListener('play', function () {
      playBtn.innerHTML = '<span aria-hidden="true">❚❚</span>';
      playBtn.setAttribute('aria-label', 'Pause');
      tapeEl.classList.add('is-rolling');
      listenedFrom = audio.currentTime;
      BA.ach.award('listen');
      BA.meter && BA.meter(true);
      markList();
      tick();
    });

    audio.addEventListener('pause', function () {
      playBtn.innerHTML = '<span aria-hidden="true">▶</span>';
      playBtn.setAttribute('aria-label', 'Play');
      tapeEl.classList.remove('is-rolling');
      BA.meter && BA.meter(false);
      listenedFrom = null;
      markList();
    });

    audio.addEventListener('ended', function () {
      tapeEl.classList.remove('is-rolling');
      // Auto-advance, because a deck should keep going.
      if (current + 1 < tracks.length) select(current + 1, true);
      else paint();
    });

    audio.addEventListener('loadedmetadata', paint);

    audio.addEventListener('timeupdate', function () {
      if (audio.paused) paint();
      if (listenedFrom !== null && audio.currentTime - listenedFrom >= 30) {
        BA.ach.award('listen_long');
        listenedFrom = null;
      }
    });

    /* ── Seeking ─────────────────────────────────────────────────── */
    function seekTo(clientX) {
      if (!audio.duration) return;
      var r = bar.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      audio.currentTime = p * audio.duration;
      listenedFrom = null;
      paint();
    }

    bar.addEventListener('pointerdown', function (e) {
      bar.setPointerCapture(e.pointerId);
      seekTo(e.clientX);
      var move = function (ev) { seekTo(ev.clientX); };
      var up = function () {
        bar.removeEventListener('pointermove', move);
        bar.removeEventListener('pointerup', up);
      };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
    });

    bar.addEventListener('keydown', function (e) {
      if (!audio.duration) return;
      if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); }
      else if (e.key === 'ArrowLeft') { audio.currentTime = Math.max(0, audio.currentTime - 5); }
      else if (e.key === 'Home') { audio.currentTime = 0; }
      else if (e.key === ' ' || e.key === 'Enter') { playBtn.click(); }
      else return;
      e.preventDefault();
      listenedFrom = null;
      paint();
    });

    /* ── Load a tape ─────────────────────────────────────────────── */
    function select(i, autoplay) {
      if (busy || !tracks[i]) return;

      if (i === current) {                       // same tape: just toggle
        if (audio.paused) play();
        else { audio.pause(); BA.sfx.play('tapeStop'); }
        return;
      }

      busy = true;
      var hadTape = current >= 0;

      if (hadTape) {
        audio.pause();
        BA.sfx.play('tapeEject');
        tapeEl.classList.add('is-out');
      }

      setTimeout(function () {
        var t = tracks[i];
        current = i;

        tapeEl.hidden = false;
        emptyEl.hidden = true;
        tapeEl.style.setProperty('--tint', t.tint || 'var(--purple-br)');
        titleEl.textContent = t.title;
        bandEl.textContent = t.project + (t.album ? ' · ' + t.album : '');
        sideEl.textContent = String.fromCharCode(65 + (i % 2));   // A / B

        credits.innerHTML =
          '<div class="credit"><strong>ROLE</strong>' + esc(t.role) + '</div>' +
          (t.note ? '<p class="deck-note">' + esc(t.note) + '</p>' : '') +
          (t.link ? '<p class="deck-note"><a href="' + esc(t.link) + '" target="_blank" ' +
                    'rel="noopener noreferrer" data-out>Full release →</a></p>' : '');

        audio.src = t.audio;
        audio.load();

        tapeEl.classList.remove('is-out');
        tapeEl.classList.add('is-in');
        BA.sfx.play('tapeIn');
        markList();
        paint();

        live.textContent = 'Loaded ' + t.title + ' by ' + t.project;

        setTimeout(function () {
          tapeEl.classList.remove('is-in');
          busy = false;
          if (autoplay) play();
        }, insert);
      }, hadTape ? eject : 0);
    }

    /* Registered so the rest of the site can silence it, and so the
       router tears it down on navigation. */
    var external = BA.player.registerExternal({
      pause: function () { audio.pause(); },
      destroy: function () { audio.pause(); audio.src = ''; }
    });

    reels();
    markList();

    return { select: select };
  }

  return { mount: mount };
})();
