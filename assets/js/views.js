/* ══════════════════════════════════════════════════════════════════
   VIEWS — every screen, rendered from BA.data.

   Each view returns { html, mount(el) }. `mount` runs after the HTML
   is in the document and is where players get attached and listeners
   get wired.
   ══════════════════════════════════════════════════════════════════ */

window.BA = window.BA || {};

BA.views = (function () {
  var d = function () { return BA.data; };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function banner(section) {
    return '<div class="banner">' +
      '<h1>' + esc(section.title) + '</h1>' +
      '<p>' + esc(section.blurb) + '</p>' +
      '</div>';
  }

  function sectionById(id) {
    return d().sections.filter(function (s) { return s.id === id; })[0];
  }

  /* Attach a player to every [data-audio] placeholder inside `el`. */
  function wirePlayers(el) {
    Array.prototype.forEach.call(el.querySelectorAll('[data-audio]'), function (slot) {
      var p = BA.player.create(slot.dataset.audio, { label: slot.dataset.label || 'audio' });
      slot.appendChild(p.el);
    });
  }

  /* Which Ian is on duty right now, by the visitor's own clock.
     Bands are [from, to) so midnight and 8am land in exactly one. */
  function pickAvatar(hour) {
    var list = d().profile.avatars;
    if (!list || !list.length) return null;
    var h = typeof hour === 'number' ? hour : new Date().getHours();
    for (var i = 0; i < list.length; i++) {
      if (h >= list[i].from && h < list[i].to) return list[i];
    }
    return list[0];
  }

  function counts(id) {
    var data = d();
    if (id === 'podcasts') return data.podcasts.length + ' SHOWS';
    if (id === 'games')    return data.games.length + ' PROJECTS';
    if (id === 'music')    return data.music.length ? data.music.length + ' TRACKS' : 'SOON';
    if (id === 'asmr')     return data.asmr.length + ' VIDEOS';
    return '';
  }

  /* ══ HOME — file select ═════════════════════════════════════════ */
  function home() {
    var p = d().profile;

    var slots = d().sections.map(function (s) {
      var c = counts(s.id);
      return '<a class="fs-slot" href="/' + s.id + '/" data-slot>' +
        '<span class="fs-cursor" aria-hidden="true">▶</span>' +
        '<span class="fs-name">' + esc(s.name) + '</span>' +
        (c ? '<span class="fs-count">' + c + '</span>' : '<span></span>') +
        '</a>';
    }).join('');

    if (BA.secretUnlocked && BA.secretUnlocked()) {
      slots += '<a class="fs-slot fs-slot--secret" href="/secret/" data-slot>' +
        '<span class="fs-cursor" aria-hidden="true">▶</span>' +
        '<span class="fs-name">NAME THAT SOUND</span>' +
        '<span class="fs-count">?????</span></a>';
    }

    var av = pickAvatar();
    var pic = av
      ? '<img src="' + esc(av.src) + '" alt="' + esc(av.alt) + '" width="288" height="288">'
      : '<span aria-hidden="true">' + p.fallbackEmoji + '</span>';

    var stats = p.stats.map(function (s) {
      return '<div class="stat"><span class="stat-k">' + esc(s.k) + '</span>' +
        '<span class="stat-v">' + esc(s.v) + '</span></div>';
    }).join('');

    var pct = BA.ach.percent();

    return {
      html:
        '<div class="fs-layout">' +
          '<div>' +
            '<h1 class="fs-head">SELECT FILE</h1>' +
            '<div class="fs-list" id="fs-list">' + slots + '</div>' +
          '</div>' +
          '<div class="stack">' +
            '<div class="panel profile">' +
              '<div class="profile-top">' +
                '<div class="profile-pic">' + pic + '</div>' +
                '<div><div class="profile-name">' + esc(p.name) + '</div>' +
                '<div class="profile-role">' + esc(p.role) + '</div></div>' +
              '</div>' +
              '<div class="profile-bio"><p>' + esc(p.bio[0]) + '</p></div>' +
              '<div class="stat-row">' + stats + '</div>' +
            '</div>' +
            '<div class="panel panel--dark meter-wrap">' +
              '<div class="meter-label"><span>COMPLETION</span><span id="meter-pct">' + pct + '%</span></div>' +
              '<div class="meter"><div class="meter-fill" id="meter-fill" style="width:' + pct + '%"></div></div>' +
              '<p class="fs-sub">Explore the site to fill this. ' +
              '<a href="/trophies/">See what you have found →</a></p>' +
            '</div>' +
            '<div class="panel panel--dark">' +
              '<p class="fs-sub" style="margin:0">Use <strong>↑ ↓</strong> to move, <strong>Enter</strong> to select, ' +
              '<strong>Esc</strong> to come back here. There is at least one thing hidden on this site.</p>' +
            '</div>' +
          '</div>' +
        '</div>',
      mount: function () {}
    };
  }

  /* ══ PODCASTS ═══════════════════════════════════════════════════ */
  function podcasts() {
    var cards = d().podcasts.map(function (s) {
      return '<article class="card">' +
        '<div class="card-art card-art--square"><img src="' + esc(s.art) + '" alt="' + esc(s.title) + ' artwork" loading="lazy"></div>' +
        '<div class="card-body">' +
          '<h2 class="card-title"><a href="' + esc(s.link) + '" target="_blank" rel="noopener noreferrer" data-out>' + esc(s.title) + '</a></h2>' +
          '<p class="card-meta">' + esc(s.meta) + '</p>' +
          '<p class="card-text">' + esc(s.episode) + '</p>' +
          '<div data-audio="' + esc(s.audio) + '" data-label="' + esc(s.title) + '"></div>' +
          '<div class="credit"><strong>ROLE</strong>' + esc(s.role) + '</div>' +
        '</div></article>';
    }).join('');

    return {
      html: banner(sectionById('podcasts')) + '<div class="grid grid--3">' + cards + '</div>',
      mount: wirePlayers
    };
  }

  /* ══ GAMES ══════════════════════════════════════════════════════ */
  function games() {
    var cards = d().games.map(function (g) {
      var tags = g.tags.map(function (t) {
        return '<span class="tag' + (t.tone ? ' tag--' + t.tone : '') + '">' + esc(t.label) + '</span>';
      }).join('');

      var quote = g.quote
        ? '<div class="credit"><strong>ROLE · ' + esc(g.role) + '</strong>' +
          '<em>“' + esc(g.quote) + '”</em> — ' + esc(g.quoteBy) + '</div>'
        : '<div class="credit"><strong>ROLE</strong>' + esc(g.role) + '</div>';

      return '<article class="card">' +
        '<div class="card-art card-art--wide"><img src="' + esc(g.art) + '" alt="' + esc(g.title) + ' screenshot" loading="lazy"></div>' +
        '<div class="card-body">' +
          '<h2 class="card-title"><a href="' + esc(g.link) + '" target="_blank" rel="noopener noreferrer" data-out>' + esc(g.title) + '</a></h2>' +
          '<div class="tags">' + tags + '</div>' +
          '<p class="card-text">' + esc(g.text) + '</p>' + quote +
        '</div></article>';
    }).join('');

    return {
      html: banner(sectionById('games')) +
        '<div class="grid grid--2">' + cards + '</div>' +
        '<div class="panel center mt">' +
          '<p class="section-title" style="font-size:.8rem">LOOKING FOR A JAM PARTNER</p>' +
          '<p>More projects on the way. If you are building something and the audio is the bit you keep putting off, that is the bit I enjoy.</p>' +
          '<div class="btn-row mt" style="justify-content:center"><a class="btn btn--gold" href="/contact/">GET IN TOUCH</a></div>' +
        '</div>',
      mount: function () {}
    };
  }

  /* ══ MUSIC ══════════════════════════════════════════════════════ */
  function music() {
    var tracks = d().music;

    if (!tracks.length) {
      return {
        html: banner(sectionById('music')) +
          '<div class="panel empty">' +
            '<p style="font-size:2.5rem;margin-bottom:1rem" aria-hidden="true">💿</p>' +
            '<p>NO CARTRIDGE INSERTED</p>' +
            '<p style="font-size:.5rem;line-height:2;color:var(--lav-dim)">' +
            'This slot is reserved for music I have written<br>and bands I play in. Files are on the way.</p>' +
            '<div class="btn-row mt" style="justify-content:center">' +
            '<a class="btn btn--ghost" href="/podcasts/">HEAR SOMETHING ELSE</a></div>' +
          '</div>',
        mount: function () {}
      };
    }

    return {
      html: banner(sectionById('music')) + '<div id="deck-host"></div>',
      mount: function (el) {
        var deck = BA.deck.mount(el.querySelector('#deck-host'), tracks);
        // Load the first tape so the deck isn't empty, but don't play
        // anything at someone who just arrived.
        deck.select(0, false);
      }
    };
  }

  /* ══ ASMR ═══════════════════════════════════════════════════════ */
  function asmr() {
    var cards = d().asmr.map(function (v, i) {
      return '<div class="card">' +
        '<div class="card-art card-art--wide">' +
        '<iframe id="yt-' + i + '" src="https://www.youtube-nocookie.com/embed/' + esc(v.yt) + '?enablejsapi=1" ' +
        'title="' + esc(v.title) + '" loading="lazy" ' +
        'allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
        'allowfullscreen></iframe></div></div>';
    }).join('');

    return {
      html: banner(sectionById('asmr')) +
        '<div class="grid grid--2">' + cards + '</div>' +
        '<div class="panel center mt">' +
          '<p style="font-size:2rem" aria-hidden="true">🎧</p>' +
          '<p>More of this on the channel.</p>' +
          '<div class="btn-row mt" style="justify-content:center">' +
          '<a class="btn btn--gold" href="' + esc(d().asmrChannel) + '" target="_blank" rel="noopener noreferrer" data-out>SUBSCRIBE ON YOUTUBE</a></div>' +
        '</div>',
      mount: function () { BA.initVideos && BA.initVideos(); }
    };
  }

  /* ══ ABOUT ══════════════════════════════════════════════════════ */
  function about() {
    var p = d().profile;
    var bio = p.bio.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    var stats = p.stats.map(function (s) {
      return '<div class="stat"><span class="stat-k">' + esc(s.k) + '</span>' +
        '<span class="stat-v">' + esc(s.v) + '</span></div>';
    }).join('');

    return {
      html: banner(sectionById('about')) +
        '<div class="grid grid--2">' +
          '<div class="panel"><h2 class="section-title">PLAYER PROFILE</h2>' + bio +
            '<div class="stat-row mt">' + stats + '</div></div>' +
          '<div class="stack">' +
            '<div class="panel panel--dark"><h2 class="section-title">WHAT I DO</h2>' +
              '<p>Podcast editing, mixing and mastering. Sound effects and foley for games. All kinds of rock and roll. ASMR with an emphasis on relaxing sound design.</p>' +
              '<p>Most of the voice editing work is the invisible kind: making three people recorded in three different rooms sound like they are in one room, and taking awkaward pauses or sections and making it sound like they were never there.</p>' +
            '</div>' +
            '<div class="panel panel--dark"><h2 class="section-title">HOW IT USUALLY GOES</h2>' +
              '<p>You send me a rough file. I send back a short test edit so you can hear what I would do with it, before any money changes hands. If it is a fit, we talk turnaround and rate.</p>' +
              '<p>If I am not the right person, I probably know the person who is.</p>' +
              '<div class="btn-row mt"><a class="btn btn--gold" href="/contact/">START A PROJECT</a></div>' +
            '</div>' +
          '</div>' +
        '</div>',
      mount: function () {}
    };
  }

  /* ══ CONTACT ════════════════════════════════════════════════════ */
  function contact() {
    var c = d().contact;
    return {
      html: banner(sectionById('contact')) +
        '<div style="max-width:640px;margin:0 auto">' +
          '<div class="panel" style="padding:0;overflow:hidden">' +
            '<div class="form-head">SEND A MESSAGE</div>' +
            '<div class="form-body">' +
              '<form id="contact-form" action="' + esc(c.formAction) + '" method="POST">' +
                '<div class="field-row">' +
                  '<div class="field"><label for="cf-name">NAME</label>' +
                  '<input id="cf-name" type="text" name="name" required autocomplete="name"></div>' +
                  '<div class="field"><label for="cf-email">EMAIL</label>' +
                  '<input id="cf-email" type="email" name="email" required autocomplete="email"></div>' +
                '</div>' +
                '<div class="field"><label for="cf-msg">MESSAGE</label>' +
                '<textarea id="cf-msg" name="message" required></textarea></div>' +
                '<button class="btn btn--gold btn--block" type="submit" id="cf-submit">SEND MESSAGE</button>' +
                '<p class="form-note">' + esc(c.note) + '</p>' +
              '</form>' +
              '<div id="cf-done" hidden class="center">' +
                '<p style="font-size:2.5rem" aria-hidden="true">📨</p>' +
                '<h2 class="section-title" style="font-size:.8rem">MESSAGE SENT</h2>' +
                '<p>Thanks. I will be in touch as soon as I can.</p>' +
                '<div class="btn-row mt" style="justify-content:center">' +
                '<button class="btn btn--ghost" type="button" id="cf-again">SEND ANOTHER</button></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>',
      mount: function (el) {
        var form = el.querySelector('#contact-form');
        var done = el.querySelector('#cf-done');
        var submit = el.querySelector('#cf-submit');

        form.addEventListener('submit', function (e) {
          e.preventDefault();
          submit.textContent = 'SENDING…';
          submit.disabled = true;

          fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
          }).then(function (res) {
            if (!res.ok) throw new Error('bad response');
            form.hidden = true;
            done.hidden = false;
            form.reset();
            BA.ach.award('contact_sent');
            BA.sfx.play('achievement');
          }).catch(function () {
            submit.textContent = 'SEND MESSAGE';
            submit.disabled = false;
            BA.sfx.play('error');
            var note = el.querySelector('.form-note');
            note.textContent = 'That did not send. Email me directly at beardedaudio@gmail.com and I will get it.';
            note.style.color = 'var(--red)';
          });
        });

        el.querySelector('#cf-again').addEventListener('click', function () {
          done.hidden = true;
          form.hidden = false;
          submit.textContent = 'SEND MESSAGE';
          submit.disabled = false;
        });
      }
    };
  }

  /* ══ TROPHY ROOM ════════════════════════════════════════════════ */
  function trophies() {
    var got = BA.ach.count(), tot = BA.ach.total();
    var pct = BA.ach.percent();

    var list = BA.ach.defs().map(function (a) {
      var have = BA.ach.has(a.id);
      return '<div class="trophy ' + (have ? 'trophy--got' : 'trophy--locked') + '">' +
        '<span class="trophy-icon" aria-hidden="true">' + (have ? a.icon : '🔒') + '</span>' +
        '<div><div class="trophy-name">' + (have ? esc(a.name) : '???') + '</div>' +
        '<div class="trophy-desc">' + (have ? esc(a.desc) : 'Not found yet.') + '</div></div></div>';
    }).join('');

    return {
      html:
        '<div class="banner"><h1>ACHIEVEMENTS</h1>' +
        '<p>Everything here is remembered by your browser alone. Nothing is sent anywhere.</p></div>' +
        '<div class="panel panel--dark meter-wrap" style="margin-bottom:var(--gap)">' +
          '<div class="meter-label"><span>' + got + ' OF ' + tot + '</span><span>' + pct + '%</span></div>' +
          '<div class="meter"><div class="meter-fill" style="width:' + pct + '%"></div></div>' +
        '</div>' +
        '<div class="trophy-grid">' + list + '</div>' +
        '<div class="panel center mt"><p class="fs-sub">Want a clean slate? ' +
        '<button class="btn btn--ghost" id="ach-reset" type="button" style="font-size:.5rem;padding:.7em 1em">RESET PROGRESS</button></p></div>',
      mount: function (el) {
        el.querySelector('#ach-reset').addEventListener('click', function () {
          BA.ach.reset();
          BA.sfx.play('back');
          BA.render();
        });
      }
    };
  }

  /* ══ SECRET ═════════════════════════════════════════════════════ */
  function secret() {
    return {
      html:
        '<div class="banner"><h1>NAME THAT SOUND</h1>' +
        '<p>Most of what you hear in films and games is something else pretending. Eight rounds.</p></div>' +
        '<div id="nts-host"></div>',
      mount: function (el) { BA.nts.mount(el.querySelector('#nts-host')); }
    };
  }

  /* ══ 404 ════════════════════════════════════════════════════════ */
  function missing() {
    return {
      html: '<div class="panel empty">' +
        '<p style="font-size:2.5rem;margin-bottom:1rem" aria-hidden="true">🕳</p>' +
        '<p>SLOT EMPTY</p>' +
        '<p style="font-size:.5rem;color:var(--lav-dim)">That screen does not exist.</p>' +
        '<div class="btn-row mt" style="justify-content:center">' +
        '<a class="btn btn--gold" href="/">BACK TO FILE SELECT</a></div></div>',
      mount: function () {}
    };
  }

  return {
    home: home, podcasts: podcasts, games: games, music: music,
    asmr: asmr, about: about, contact: contact,
    trophies: trophies, secret: secret, missing: missing,
    esc: esc,
    pickAvatar: pickAvatar   // exposed so the bands can be spot-checked
  };
})();
