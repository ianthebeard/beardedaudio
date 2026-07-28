/* ══════════════════════════════════════════════════════════════════
   NAME THAT SOUND — the hidden cartridge, unlocked by the Konami code.

   Rounds live in BA.data.nts. Each round either points at a real clip
   (`audio`) or names a synthesized placeholder (`synth`), so the game
   is fully playable before any clips exist. Replacing a placeholder is
   a one-line edit in data.js.
   ══════════════════════════════════════════════════════════════════ */

window.BA = window.BA || {};

BA.nts = (function () {
  var ROUNDS = 8;

  /* ── Placeholder voices ─────────────────────────────────────────
     Deliberately crude. These exist to make the game work today and
     to be deleted the moment real foley shows up.                 */
  var synths = {
    snap: function () {
      BA.sfx.hiss({ from: 2600, to: 700, dur: 0.07, gain: 0.3, filter: 'bandpass', q: 1.8 });
      BA.sfx.tone({ type: 'square', from: 1400, to: 300, dur: 0.05, gain: 0.12 });
    },
    crunch: function () {
      for (var i = 0; i < 6; i++) {
        BA.sfx.hiss({ from: 900 + Math.random() * 1600, to: 400, dur: 0.05,
                      gain: 0.16, filter: 'bandpass', q: 2.5, delay: i * 0.085 });
      }
    },
    flap: function () {
      for (var i = 0; i < 3; i++) {
        BA.sfx.hiss({ from: 200, to: 1100, dur: 0.14, gain: 0.2, filter: 'bandpass', q: 0.7, delay: i * 0.22 });
        BA.sfx.hiss({ from: 1100, to: 200, dur: 0.12, gain: 0.15, filter: 'bandpass', q: 0.7, delay: i * 0.22 + 0.12 });
      }
    },
    fizz: function () {
      BA.sfx.hiss({ from: 3000, to: 3000, dur: 1.4, gain: 0.14, filter: 'highpass', q: 0.4 });
    },
    thud: function () {
      BA.sfx.tone({ type: 'sine', from: 160, to: 45, dur: 0.3, gain: 0.35 });
      BA.sfx.hiss({ from: 500, to: 120, dur: 0.14, gain: 0.14, filter: 'lowpass', q: 1 });
    },
    creak: function () {
      for (var i = 0; i < 11; i++) {
        BA.sfx.tone({ type: 'sawtooth', from: 300 + i * 22 + (i % 2 ? 34 : 0),
                      to: 310 + i * 22, dur: 0.09, gain: 0.055, delay: i * 0.075 });
      }
    },
    whoosh: function () {
      BA.sfx.hiss({ from: 180, to: 3600, dur: 0.28, gain: 0.22, filter: 'bandpass', q: 0.8 });
      BA.sfx.hiss({ from: 3600, to: 220, dur: 0.24, gain: 0.16, filter: 'bandpass', q: 0.8, delay: 0.26 });
    },
    bubble: function () {
      for (var i = 0; i < 7; i++) {
        var f = 420 + Math.random() * 700;
        BA.sfx.tone({ type: 'sine', from: f, to: f * 2.4, dur: 0.07, gain: 0.16,
                      delay: i * 0.13 + Math.random() * 0.05 });
      }
    }
  };

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function mount(host) {
    var deck = shuffle(BA.data.nts).slice(0, Math.min(ROUNDS, BA.data.nts.length));
    var idx = 0, score = 0, streak = 0, best = 0, answered = false;
    var clip = null;

    host.innerHTML = '<div class="nts"><div class="panel nts-stage" id="nts-stage"></div></div>';
    var stage = host.querySelector('#nts-stage');

    function stopClip() {
      if (clip) { clip.pause(); clip = null; }
    }

    function playRound() {
      var r = deck[idx];
      var speaker = stage.querySelector('.nts-speaker');
      if (speaker) {
        speaker.classList.add('is-playing');
        setTimeout(function () { speaker.classList.remove('is-playing'); }, 1500);
      }
      BA.pauseAllAudio && BA.pauseAllAudio();
      stopClip();

      if (r.audio) {
        clip = new Audio(r.audio);
        clip.play().catch(function () {});
      } else if (synths[r.synth]) {
        BA.sfx.context();
        synths[r.synth]();
      }
    }

    function renderRound() {
      answered = false;
      var r = deck[idx];
      var options = shuffle([r.answer].concat(r.wrong));

      stage.innerHTML =
        '<p class="nts-round">ROUND ' + (idx + 1) + ' / ' + deck.length + '</p>' +
        '<div class="nts-speaker" aria-hidden="true">🔈</div>' +
        '<button class="btn btn--gold" id="nts-play" type="button">▶ PLAY SOUND</button>' +
        '<p class="nts-score" id="nts-score">SCORE ' + score + '   STREAK ' + streak + '</p>' +
        '<div class="nts-answers" id="nts-answers"></div>' +
        '<div id="nts-after"></div>';

      var box = stage.querySelector('#nts-answers');
      options.forEach(function (opt) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'nts-answer';
        b.textContent = opt;
        b.addEventListener('click', function () { choose(b, opt, box); });
        box.appendChild(b);
      });

      stage.querySelector('#nts-play').addEventListener('click', playRound);
      playRound();
    }

    function choose(btn, opt, box) {
      if (answered) return;
      answered = true;
      var r = deck[idx];
      var right = opt === r.answer;

      Array.prototype.forEach.call(box.children, function (b) {
        b.disabled = true;
        if (b.textContent === r.answer) b.classList.add('is-right');
        else if (b === btn) b.classList.add('is-wrong');
        else b.classList.add('is-dim');
      });

      if (right) {
        score++; streak++;
        best = Math.max(best, streak);
        BA.sfx.play('select');
        if (streak >= 5) BA.ach.award('nts_streak');
      } else {
        streak = 0;
        BA.sfx.play('error');
      }

      // Repaint immediately — otherwise the score shown after answering
      // is the score from before the answer.
      var scoreEl = stage.querySelector('#nts-score');
      if (scoreEl) scoreEl.textContent = 'SCORE ' + score + '   STREAK ' + streak;

      var after = stage.querySelector('#nts-after');
      after.innerHTML =
        '<p class="nts-reveal">' + r.reveal + '</p>' +
        '<div class="btn-row center mt" style="justify-content:center">' +
        '<button class="btn" id="nts-next" type="button">' +
        (idx + 1 < deck.length ? 'NEXT ▶' : 'RESULTS ▶') + '</button></div>';

      var next = after.querySelector('#nts-next');
      next.addEventListener('click', function () {
        stopClip();
        idx++;
        if (idx < deck.length) renderRound(); else finish();
      });
      next.focus();
    }

    function finish() {
      var pct = Math.round((score / deck.length) * 100);
      var verdict =
        pct === 100 ? 'Perfect. You have done this before.' :
        pct >= 75   ? 'Genuinely good ears.' :
        pct >= 50   ? 'Not bad. Foley is a liar by trade.' :
                      'Sound design works. That is rather the point.';

      stage.innerHTML =
        '<p class="nts-round">RESULTS</p>' +
        '<div class="nts-speaker" aria-hidden="true">' + (pct >= 75 ? '🏆' : '🎧') + '</div>' +
        '<p class="nts-score">' + score + ' / ' + deck.length + '  ·  BEST STREAK ' + best + '</p>' +
        '<p class="nts-reveal">' + verdict + '</p>' +
        '<div class="btn-row mt" style="justify-content:center">' +
        '<button class="btn btn--gold" id="nts-again" type="button">PLAY AGAIN</button>' +
        '<a class="btn btn--ghost" href="/">BACK TO MENU</a></div>';

      stage.querySelector('#nts-again').addEventListener('click', function () {
        deck = shuffle(BA.data.nts).slice(0, Math.min(ROUNDS, BA.data.nts.length));
        idx = 0; score = 0; streak = 0;
        renderRound();
      });
    }

    BA.ach.award('nts_play');
    renderRound();

    return { stop: stopClip };
  }

  return { mount: mount };
})();
