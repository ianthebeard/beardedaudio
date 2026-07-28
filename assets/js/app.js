/* ══════════════════════════════════════════════════════════════════
   APP — boot sequence, hash router, keyboard navigation, secrets.
   ══════════════════════════════════════════════════════════════════ */

(function () {
  var screen = document.getElementById('screen');
  var nav = document.getElementById('nav');
  var main = document.getElementById('main');
  var dpad = document.getElementById('dpad');

  var CRT_KEY = 'ba_crt';
  var SECRET_KEY = 'ba_secret';
  var BOOT_KEY = 'ba_booted';

  var current = null;
  var cursor = 0;
  var userNavigated = false;

  /* ══ Secret state ════════════════════════════════════════════ */
  BA.secretUnlocked = function () {
    return localStorage.getItem(SECRET_KEY) === '1';
  };

  /* ══ Routes ══════════════════════════════════════════════════ */
  function routeFor(id) {
    if (id === 'secret' && !BA.secretUnlocked()) return BA.views.missing;
    return BA.views[id] || BA.views.missing;
  }

  function currentId() {
    var h = location.hash.replace(/^#\/?/, '').trim();
    return h || 'home';
  }

  BA.render = function () {
    var id = currentId();
    var view = routeFor(id)();

    BA.player.destroyAll();
    BA.pauseVideos();

    screen.innerHTML = '<div class="view">' + view.html + '</div>';
    var el = screen.firstChild;
    view.mount(el);

    current = id;
    cursor = 0;
    syncNav(id);
    updateTrophyCount();

    // D-pad only where directional input actually does something
    dpad.hidden = !(id === 'home');

    if (userNavigated) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      main.focus({ preventScroll: true });
    }

    // Section achievements
    if (BA.ach.has('sec_' + id) === false && ['podcasts','games','music','asmr','about','contact'].indexOf(id) !== -1) {
      BA.ach.award('sec_' + id);
    }
    var tour = BA.data.sections.every(function (s) { return BA.ach.has('sec_' + s.id); });
    if (tour) BA.ach.award('tour');

    // Known ids only — the fallback used to echo whatever was in the
    // hash, so a junk URL put its own text in the browser tab.
    var known = {
      home:     'Bearded Audio — Ian Tomlinson, freelance audio editor',
      trophies: 'ACHIEVEMENTS — Bearded Audio',
      secret:   'NAME THAT SOUND — Bearded Audio'
    };
    var section = BA.data.sections.filter(function (s) { return s.id === id; })[0];
    document.title = known[id] || (section
      ? section.name + ' — Bearded Audio'
      : 'NOT FOUND — Bearded Audio');
  };

  function go(id) {
    userNavigated = true;
    location.hash = '#/' + id;
  }

  window.addEventListener('hashchange', function () {
    BA.sfx.play('pageIn');
    BA.render();
  });

  /* ══ Nav ═════════════════════════════════════════════════════ */
  function buildNav() {
    nav.innerHTML = BA.data.sections.map(function (s) {
      return '<a class="nav-btn" href="#/' + s.id + '" data-nav="' + s.id + '">' + BA.views.esc(s.name) + '</a>';
    }).join('');
    if (BA.secretUnlocked()) {
      nav.innerHTML += '<a class="nav-btn is-secret" href="#/secret" data-nav="secret">🕹 SECRET</a>';
    }
  }

  function syncNav(id) {
    Array.prototype.forEach.call(nav.querySelectorAll('[data-nav]'), function (a) {
      if (a.dataset.nav === id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function updateTrophyCount() {
    document.getElementById('trophy-count').textContent = BA.ach.count() + '/' + BA.ach.total();
  }

  /* ══ Boot sequence ═══════════════════════════════════════════
     Timings live here and in the boot beat sheet in style.css —
     change both together. `skipGrace` stops a stray trackpad
     flick or an early keypress from killing the intro before it
     has said anything. */
  var BOOT = {
    autoAdvance: 9000,  // how long the title screen holds on its own
    skipGrace:   900    // input is ignored for this long after load
  };

  function runBoot() {
    var bootEl = document.getElementById('boot');
    var deepLink = location.hash && currentId() !== 'home';
    var alreadyBooted = sessionStorage.getItem(BOOT_KEY) === '1';

    if (deepLink || alreadyBooted) {
      BA.ach.award('boot');
      return;
    }

    document.body.classList.add('is-booting');
    bootEl.hidden = false;

    // The tube warming up, at the front of the sequence where it belongs
    document.body.classList.add('crt-on');
    setTimeout(function () { document.body.classList.remove('crt-on'); }, 1000);

    var done = false;
    var armed = false;
    setTimeout(function () { armed = true; }, BOOT.skipGrace);

    function start(byUser) {
      if (done) return;
      done = true;
      sessionStorage.setItem(BOOT_KEY, '1');
      BA.sfx.play('boot');
      // Held until the title screen is out of the way, so the first
      // toast doesn't land on top of it.
      setTimeout(function () {
        BA.ach.award('boot');
        if (byUser) BA.ach.award('start');
      }, 700);

      bootEl.classList.add('leaving');
      setTimeout(function () {
        bootEl.hidden = true;
        document.body.classList.remove('is-booting');
      }, 420);

      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('pointerdown', onPointer, true);
      window.removeEventListener('wheel', onPointer, true);
      clearTimeout(auto);
    }

    function onKey(e) {
      if (e.key === 'Tab') return; // let people tab into the button
      if (!armed) return;
      start(true);
    }
    function onPointer() { if (armed) start(true); }

    window.addEventListener('keydown', onKey, true);
    window.addEventListener('pointerdown', onPointer, true);
    window.addEventListener('wheel', onPointer, true);
    var auto = setTimeout(function () { start(false); }, BOOT.autoAdvance);

    document.getElementById('boot-start').addEventListener('click', function () { start(true); });
  }

  /* ══ CRT toggle ══════════════════════════════════════════════
     One button, label included, at every width. The label carries the
     state so nothing depends on a drawer being open — which is what
     broke when a phone-width menu was left open and then widened. */
  function initCRT() {
    var btn = document.getElementById('tool-crt');
    var label = document.getElementById('crt-label');
    var on = localStorage.getItem(CRT_KEY) !== 'off';
    apply(on);

    function apply(state) {
      document.documentElement.setAttribute('data-crt', state ? 'on' : 'off');
      localStorage.setItem(CRT_KEY, state ? 'on' : 'off');
      btn.setAttribute('aria-pressed', String(state));
      label.textContent = state ? 'CRT ON' : 'CRT OFF';
      btn.title = state
        ? 'CRT screen effect is on — click to turn it off'
        : 'CRT screen effect is off — click to turn it on';
    }

    btn.addEventListener('click', function () {
      var next = btn.getAttribute('aria-pressed') !== 'true';
      apply(next);
      BA.sfx.play(next ? 'select' : 'back');
      BA.ach.award('crt');
    });
  }

  /* ══ Sound toggle ════════════════════════════════════════════ */
  function initSound() {
    var btn = document.getElementById('tool-sound');
    var icon = document.getElementById('sound-icon');
    var label = document.getElementById('sound-label');

    function paint() {
      var on = BA.sfx.isEnabled();
      icon.textContent = on ? '♪' : '▷';
      label.textContent = on ? 'SFX ON' : 'SFX OFF';
      btn.setAttribute('aria-pressed', String(on));
      btn.title = on
        ? 'Interface sound is on — click to mute'
        : 'Interface sound is off — click to turn it on';
    }
    paint();

    btn.addEventListener('click', function () {
      var on = BA.sfx.toggle();
      paint();
      if (on) BA.ach.award('sfx');
    });
  }

  /* ══ Logo level meter ════════════════════════════════════════
     Called by the players and the tape deck so the mark in the header
     moves whenever the site is actually making sound. */
  var playing = 0;
  BA.meter = function (on) {
    playing = Math.max(0, playing + (on ? 1 : -1));
    var mark = document.getElementById('logo-mark');
    if (mark) mark.classList.toggle('is-live', playing > 0);
  };

  /* ══ Konami ══════════════════════════════════════════════════ */
  function initKonami() {
    var seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    var pos = 0;

    window.addEventListener('keydown', function (e) {
      var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === seq[pos]) {
        pos++;
        if (pos === seq.length) {
          pos = 0;
          unlock();
        }
      } else {
        pos = (k === seq[0]) ? 1 : 0;
      }
    });

    function unlock() {
      var fresh = !BA.secretUnlocked();
      localStorage.setItem(SECRET_KEY, '1');
      BA.sfx.play('secret');
      BA.ach.award('konami');
      if (fresh) {
        buildNav();
        BA.render();
      }
      go('secret');
    }
  }

  /* ══ Logo poke → alternate colourway ═════════════════════════ */
  function initLogoPoke() {
    var logo = document.getElementById('logo');
    var pokes = 0;

    logo.addEventListener('click', function (e) {
      // Let the link work, but count the taps
      pokes++;
      logo.classList.remove('poked');
      void logo.offsetWidth;
      logo.classList.add('poked');
      BA.sfx.play('hover');

      if (pokes === 5) {
        e.preventDefault();
        pokes = 0;
        var alt = document.documentElement.getAttribute('data-palette') === 'dusk';
        document.documentElement.setAttribute('data-palette', alt ? '' : 'dusk');
        BA.player.refreshColors();
        BA.sfx.play('secret');
        BA.ach.award('poke');
      }
    });
  }

  /* ══ Keyboard navigation ═════════════════════════════════════ */
  function slots() {
    return Array.prototype.slice.call(screen.querySelectorAll('[data-slot]'));
  }

  function moveCursor(delta) {
    var list = slots();
    if (!list.length) return;
    var started = list.some(function (s) { return s.classList.contains('is-active'); });
    list.forEach(function (s) { s.classList.remove('is-active'); });
    // First press lands on the first slot rather than stepping past it
    cursor = started ? (cursor + delta + list.length) % list.length
                     : (delta > 0 ? 0 : list.length - 1);
    var el = list[cursor];
    el.classList.add('is-active');
    el.scrollIntoView({ block: 'nearest' });
    BA.sfx.play('move');
  }

  function initKeyboard() {
    window.addEventListener('keydown', function (e) {
      if (document.body.classList.contains('is-booting')) return;

      // e.target is not always an element (window-dispatched events),
      // so guard before reaching for element-only methods.
      var t = e.target;
      var typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' ||
                   t.isContentEditable ||
                   (typeof t.getAttribute === 'function' && t.getAttribute('role') === 'slider'));
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'Escape') {
        if (current !== 'home') { BA.sfx.play('back'); go('home'); }
        return;
      }

      if (current === 'home') {
        if (e.key === 'ArrowDown') { e.preventDefault(); moveCursor(1); return; }
        if (e.key === 'ArrowUp')   { e.preventDefault(); moveCursor(-1); return; }
        if (e.key === 'Enter') {
          var list = slots();
          var active = list[cursor];
          if (active && active.classList.contains('is-active')) {
            e.preventDefault();
            BA.sfx.play('select');
            userNavigated = true;
            location.hash = active.getAttribute('href');
          }
          return;
        }
      } else {
        // ← → step between sections
        var ids = BA.data.sections.map(function (s) { return s.id; });
        var i = ids.indexOf(current);
        if (i === -1) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); BA.sfx.play('move'); go(ids[(i + 1) % ids.length]); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); BA.sfx.play('move'); go(ids[(i - 1 + ids.length) % ids.length]); }
      }
    });

    // Mobile D-pad fires the same keys
    Array.prototype.forEach.call(dpad.querySelectorAll('[data-key]'), function (b) {
      b.addEventListener('click', function () {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: b.dataset.key }));
      });
    });
  }

  /* ══ YouTube — pause everything else on play ═════════════════ */
  var ytPlayers = [];
  var ytReady = false;

  BA.pauseVideos = function () {
    ytPlayers.forEach(function (p) {
      try { p.pauseVideo && p.pauseVideo(); } catch (err) {}
    });
  };

  BA.initVideos = function () {
    ytPlayers = [];
    if (!ytReady) return;
    Array.prototype.forEach.call(document.querySelectorAll('iframe[id^="yt-"]'), function (f) {
      var p = new YT.Player(f.id, {
        events: {
          onStateChange: function (e) {
            if (e.data === 1) {
              BA.pauseAllAudio();
              ytPlayers.forEach(function (o) {
                if (o !== p) { try { o.pauseVideo(); } catch (err) {} }
              });
            }
          }
        }
      });
      ytPlayers.push(p);
    });
  };

  window.onYouTubeIframeAPIReady = function () {
    ytReady = true;
    BA.initVideos();
  };

  function loadYT() {
    var s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }

  /* ══ Misc wiring ═════════════════════════════════════════════ */
  function initMisc() {
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile menu
    var menuBtn = document.getElementById('tool-menu');

    function closeMenu() {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }

    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      BA.sfx.play(open ? 'select' : 'back');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('[data-nav]')) {
        userNavigated = true;
        closeMenu();
      }
    });

    // Widening past the breakpoint shows the nav regardless, so drop
    // the open state rather than leaving aria-expanded lying about it.
    // A plain resize listener rather than matchMedia — the change
    // event isn't dependable across every browser and devtools path,
    // and this check is cheap.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && nav.classList.contains('open')) closeMenu();
    });

    // Any in-page link counts as user navigation
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      if (a.hasAttribute('data-out')) BA.ach.award('outbound');
      if (a.getAttribute('href') && a.getAttribute('href').charAt(0) === '#') {
        userNavigated = true;
        BA.sfx.play('select');
      }
    });

    // Hover blips on the things that should feel clicky
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('.fs-slot, .nav-btn, .btn, .card')) BA.sfx.play('hover');
    });

    // Night owl
    var hr = new Date().getHours();
    if (hr >= 0 && hr < 5) BA.ach.award('night');

    // Keep the trophy counter and completion meter live
    BA.ach.onAward(function () {
      updateTrophyCount();
      var fill = document.getElementById('meter-fill');
      var pctEl = document.getElementById('meter-pct');
      if (fill) fill.style.width = BA.ach.percent() + '%';
      if (pctEl) pctEl.textContent = BA.ach.percent() + '%';
    });
  }

  /* ══ Go ══════════════════════════════════════════════════════ */
  buildNav();
  initCRT();
  initSound();
  initKonami();
  initLogoPoke();
  initKeyboard();
  initMisc();
  BA.render();
  runBoot();
  loadYT();
})();
