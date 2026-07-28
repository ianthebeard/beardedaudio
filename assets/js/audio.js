/* ══════════════════════════════════════════════════════════════════
   SFX — interface sound, synthesized in the browser.

   Off by default. The toggle lives in the header and persists in
   localStorage. Nothing plays before a user gesture, both because
   browsers block it and because it would be rude.

   SWAPPING IN REAL SOUNDS: when Ian's UI pack exists (see ASSETS.md),
   add paths to BA.sfx.files below. Any name with a file uses the
   file; any name without falls back to the synth. Mix and match.
   ══════════════════════════════════════════════════════════════════ */

window.BA = window.BA || {};

BA.sfx = (function () {
  var KEY = 'ba_sfx';
  var ctx = null;
  var master = null;
  var enabled = localStorage.getItem(KEY) === 'on';
  var buffers = {};
  var noiseBuf = null;

  /* Drop real files here as they arrive, e.g.
     move: '/assets/audio/ui/ui-move.wav'                          */
  var files = {
    move: null, select: null, back: null, hover: null, error: null,
    boot: null, achievement: null, pageIn: null, secret: null,
    // Tape deck — see the deck timing table in deck.js
    tapeEject: null, tapeIn: null, tapePlay: null, tapeStop: null
  };

  function context() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function noise() {
    var c = context();
    if (!noiseBuf) {
      noiseBuf = c.createBuffer(1, c.sampleRate * 1.2, c.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return noiseBuf;
  }

  /* One oscillator with an envelope. Everything is built from this. */
  function tone(o) {
    var c = context();
    if (!c) return;
    var t = c.currentTime + (o.delay || 0);
    var osc = c.createOscillator();
    var g = c.createGain();

    osc.type = o.type || 'square';
    osc.frequency.setValueAtTime(o.from, t);
    if (o.to && o.to !== o.from) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(o.to, 1), t + o.dur);
    }

    var peak = o.gain == null ? 0.08 : o.gain;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.012, o.dur * 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);

    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + o.dur + 0.02);
  }

  function hiss(o) {
    var c = context();
    if (!c) return;
    var t = c.currentTime + (o.delay || 0);
    var src = c.createBufferSource();
    src.buffer = noise();

    var filt = c.createBiquadFilter();
    filt.type = o.filter || 'bandpass';
    filt.frequency.setValueAtTime(o.from, t);
    if (o.to) filt.frequency.exponentialRampToValueAtTime(Math.max(o.to, 1), t + o.dur);
    filt.Q.value = o.q == null ? 1.2 : o.q;

    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.gain == null ? 0.08 : o.gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);

    src.connect(filt); filt.connect(g); g.connect(master);
    src.start(t);
    src.stop(t + o.dur + 0.02);
  }

  /* ── The synth voices ───────────────────────────────────────── */
  var synths = {
    hover:  function () { tone({ type: 'sine',     from: 1180, to: 1180, dur: 0.035, gain: 0.028 }); },
    move:   function () { tone({ type: 'square',   from: 520,  to: 640,  dur: 0.055, gain: 0.055 }); },
    select: function () {
      tone({ type: 'square', from: 700,  to: 700,  dur: 0.055, gain: 0.075 });
      tone({ type: 'square', from: 1050, to: 1050, dur: 0.085, gain: 0.065, delay: 0.055 });
    },
    back:   function () {
      tone({ type: 'square', from: 620, to: 620, dur: 0.05,  gain: 0.06 });
      tone({ type: 'square', from: 380, to: 380, dur: 0.075, gain: 0.055, delay: 0.05 });
    },
    error:  function () {
      tone({ type: 'sawtooth', from: 200, to: 120, dur: 0.22, gain: 0.07 });
      tone({ type: 'square',   from: 196, to: 118, dur: 0.22, gain: 0.04 });
    },
    pageIn: function () {
      hiss({ from: 400, to: 3200, dur: 0.2, gain: 0.045, filter: 'bandpass', q: 0.8 });
      tone({ type: 'triangle', from: 480, to: 900, dur: 0.16, gain: 0.04 });
    },
    achievement: function () {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        tone({ type: 'square', from: f, to: f, dur: 0.11, gain: 0.07, delay: i * 0.065 });
      });
      tone({ type: 'triangle', from: 1046.5, to: 1046.5, dur: 0.4, gain: 0.045, delay: 0.26 });
    },
    boot: function () {
      hiss({ from: 120, to: 5200, dur: 0.5, gain: 0.05, filter: 'highpass', q: 0.5 });
      tone({ type: 'triangle', from: 90,  to: 700, dur: 0.55, gain: 0.06 });
      [392, 523.25, 659.25, 880].forEach(function (f, i) {
        tone({ type: 'square', from: f, to: f, dur: 0.14, gain: 0.06, delay: 0.5 + i * 0.085 });
      });
    },
    secret: function () {
      [523.25, 622.25, 783.99, 932.33, 1244.5].forEach(function (f, i) {
        tone({ type: 'square', from: f, to: f * 1.005, dur: 0.13, gain: 0.07, delay: i * 0.075 });
      });
      tone({ type: 'sine', from: 1568, to: 1568, dur: 0.7, gain: 0.05, delay: 0.38 });
    },

    /* ── Tape deck ────────────────────────────────────────────────
       Crude mechanical placeholders. These are the four Ian should
       replace first — a real deck is all texture, and oscillators
       are bad at texture.                                         */
    tapeEject: function () {
      hiss({ from: 1800, to: 300, dur: 0.28, gain: 0.10, filter: 'bandpass', q: 1.1 });
      tone({ type: 'triangle', from: 180, to: 70, dur: 0.3, gain: 0.05 });
    },
    tapeIn: function () {
      hiss({ from: 300, to: 1400, dur: 0.16, gain: 0.09, filter: 'bandpass', q: 1.2 });
      tone({ type: 'sine',   from: 130, to: 55,  dur: 0.16, gain: 0.16, delay: 0.16 }); // the clunk
      hiss({ from: 2600, to: 900, dur: 0.05, gain: 0.11, filter: 'bandpass', q: 2.4, delay: 0.16 });
    },
    tapePlay: function () {
      hiss({ from: 2200, to: 1100, dur: 0.04, gain: 0.10, filter: 'bandpass', q: 2.6 });
      tone({ type: 'sine', from: 60, to: 110, dur: 0.32, gain: 0.045, delay: 0.03 }); // motor spinning up
    },
    tapeStop: function () {
      hiss({ from: 1600, to: 700, dur: 0.045, gain: 0.10, filter: 'bandpass', q: 2.2 });
      tone({ type: 'sine', from: 105, to: 45, dur: 0.2, gain: 0.05, delay: 0.02 });
    }
  };

  function loadFile(name, url) {
    var c = context();
    if (!c) return;
    fetch(url)
      .then(function (r) { return r.arrayBuffer(); })
      .then(function (b) { return c.decodeAudioData(b); })
      .then(function (buf) { buffers[name] = buf; })
      .catch(function () { /* fall back to the synth silently */ });
  }

  function playBuffer(name) {
    var c = context();
    var src = c.createBufferSource();
    src.buffer = buffers[name];
    src.connect(master);
    src.start();
  }

  function play(name) {
    if (!enabled) return;
    if (!context()) return;
    if (buffers[name]) { playBuffer(name); return; }
    if (files[name] && !buffers[name]) loadFile(name, files[name]);
    if (synths[name]) synths[name]();
  }

  function setEnabled(on) {
    enabled = !!on;
    localStorage.setItem(KEY, enabled ? 'on' : 'off');
    if (enabled) {
      context();
      Object.keys(files).forEach(function (n) { if (files[n]) loadFile(n, files[n]); });
      play('select');
    }
    return enabled;
  }

  return {
    files: files,
    play: play,
    isEnabled: function () { return enabled; },
    setEnabled: setEnabled,
    toggle: function () { return setEnabled(!enabled); },
    context: context,
    /* Used by the minigame, which plays regardless of the UI toggle
       because the visitor explicitly asked to hear it. */
    tone: tone,
    hiss: hiss
  };
})();
