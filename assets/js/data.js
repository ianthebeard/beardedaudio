/* ══════════════════════════════════════════════════════════════════
   DATA — the only file you need to edit to change site content.
   Add an episode, a game, a track, a minigame round: it all happens
   here. No markup anywhere else needs touching.
   ══════════════════════════════════════════════════════════════════ */

window.BA = window.BA || {};

BA.data = {

  /* ── Site & search ─────────────────────────────────────────────
     What search engines and link previews see. `build.js` bakes this
     into the real <head> of every generated page, and app.js reuses
     the same titles when you navigate in-place — so the tab never
     says something different from what the crawler was served.

     Titles want to stay under ~60 characters and descriptions under
     ~160, or Google truncates them in the results page.            */
  site: {
    url: 'https://beardedaudio.com',   // no trailing slash
    name: 'Bearded Audio',
    locale: 'en_US',
    ogImage: '/assets/img/og.png',
    // Profiles that are unambiguously you. Feeds schema.org sameAs,
    // which is how a search engine ties these accounts together.
    sameAs: [
      'https://www.youtube.com/@BeardedAudioASMR'
    ]
  },

  seo: {
    home: {
      title: 'Freelance Audio Editor & Sound Designer | Bearded Audio',
      description: 'Freelance audio editor and sound designer. Podcast and audiobook post-production, game SFX, music and ASMR. Send a rough file and get a free test edit.'
    },
    podcasts: {
      title: 'Podcast & Audiobook Editing | Bearded Audio',
      description: 'Podcast editing, mixing and mastering, plus audiobook post-production. Three people in three rooms made to sound like one. Free test edit before you commit.'
    },
    games: {
      title: 'Freelance Game Sound Designer & SFX | Bearded Audio',
      description: 'Game sound design for indie studios and jams: sound effects, foley and interactive audio. Credits on LÖVE Jam and Ludum Dare titles. Open to new projects.'
    },
    music: {
      title: 'Music Production, Mixing & Mastering | Bearded Audio',
      description: 'Guitars, screaming vocals, production, mixing and mastering — my own records, the bands I play in, and commissioned score for tabletop campaigns.'
    },
    asmr: {
      title: 'ASMR Sound Design | Bearded Audio',
      description: 'ASMR built on sound design rather than whispering. Relaxing audio for sleep and focus, made by a freelance audio editor. More on the YouTube channel.'
    },
    about: {
      title: 'About Ian Tomlinson, Freelance Audio Editor | Bearded Audio',
      description: 'Ian Tomlinson edits and designs sound for podcasts, audiobooks, games, music and ASMR. Here is what the work involves and how a project usually goes.'
    },
    contact: {
      title: 'Start a Project | Bearded Audio',
      description: 'Tell me what you are making and when you need it. Send a rough file and I will return a short test edit before any money changes hands.'
    },
    /* Kept out of the index: one is a per-visitor progress page whose
       content lives in localStorage, the others are not content. */
    trophies: {
      title: 'Achievements | Bearded Audio',
      description: 'Your progress through the site, remembered by your browser alone.',
      noindex: true
    },
    secret: {
      title: 'Name That Sound | Bearded Audio',
      description: 'A listening game about what film and game sound is really made of.',
      noindex: true
    },
    missing: {
      title: 'Page Not Found | Bearded Audio',
      description: 'That screen does not exist.',
      noindex: true
    }
  },

  /* ── Who you are ───────────────────────────────────────────── */
  profile: {
    name: 'IAN TOMLINSON',
    role: 'Freelance Audio Editor',
    /* The avatar changes with the visitor's own local clock. Bands are
       [from, to) in 24h, and must tile the whole day with no gaps.
       Not pixelated — these are illustrations, and they're served at
       288px for a 144px slot so they stay sharp on retina screens. */
    avatars: [
      { from: 8,  to: 16, src: '/assets/img/emote-hype.png',  alt: 'Ian, hyped up' },
      { from: 16, to: 24, src: '/assets/img/emote-laugh.png', alt: 'Ian, laughing' },
      { from: 0,  to: 8,  src: '/assets/img/emote-sleep.png', alt: 'Ian, fast asleep' }
    ],
    fallbackEmoji: '🧔',
    bio: [
      "I'm a freelance audio editor, working on everything from podcasts and audiobooks to music and ASMR, with some game audio in there for good measure (I love game jams).",
      "I'm a husband and father of five kids, a huge game nut, and looking forward to meeting you. If I'm not the person for your project, I probably know the person who is."
    ],
    // Shown as stat blocks on the file-select screen. Edit freely.
    stats: [
      { k: 'CLASS',    v: 'EDITOR'   },
      { k: 'SPECIALTY', v: 'SOUND DESIGN' },
      { k: 'BASED',    v: 'US / PST' },
      { k: 'STATUS',   v: 'AVAILABLE' }
    ]
  },

  /* ── Sections, in menu order ─────────────────────────────────
     `icon` and `sub` are no longer rendered — the file-select shows
     names and counts only. Kept here because they cost nothing and
     save re-typing if a subtitle is ever wanted back. */
  sections: [
    { id: 'podcasts', name: 'PODCASTS', icon: '🎙', sub: 'Editing, mixing & mastering',   title: 'PODCAST ENGINEERING', blurb: 'Editing, mixing and post-production for shows that want to sound raw and real.' },
    { id: 'games',    name: 'GAME AUDIO', icon: '🎮', sub: 'SFX & interactive sound',      title: 'GAME SOUND DESIGN',   blurb: 'Sound effects, foley and interactive audio. Mostly born in game jams.' },
    { id: 'music',    name: 'MUSIC',     icon: '🎸', sub: 'My own & bands I play in',      title: 'MUSIC',               blurb: 'I mostly play the guitar and scream.' },
    { id: 'asmr',     name: 'ASMR',      icon: '🎧', sub: 'Sound design you can sleep to', title: 'ASMR',                blurb: 'Relaxing audio with an emphasis on sound design.' },
    { id: 'about',    name: 'ABOUT',     icon: '📼', sub: 'The human behind the beard',    title: 'ABOUT',               blurb: 'Look mom, I made a site.' },
    { id: 'contact',  name: 'CONTACT',   icon: '📧', sub: 'Start a project',               title: 'CONTACT',             blurb: 'Tell me what you are making and when you need it.' }
  ],

  /* ── Podcasts & audiobooks ─────────────────────────────────── */
  podcasts: [
    {
      title: 'ADHD Founders',
      link: 'https://adhdfounders.xyz',
      art: 'https://img.transistor.fm/cmbEtvo2ebzlcBb0AHl7hFlSkWuW7Y9P9e1lj2NdIlg/rs:fill:0:0:1/w:800/h:800/q:60/mb:500000/aHR0cHM6Ly9pbWct/dXBsb2FkLXByb2R1/Y3Rpb24udHJhbnNp/c3Rvci5mbS85ZGM0/YWNkMzgwODYyNjY5/YTk5N2JkMDIwMTk3/NzNiYy5wbmc.webp',
      meta: 'Edited Episode',
      episode: '72: The Automation Paradox — Building Systems We Immediately Bypass',
      audio: 'https://media.transistor.fm/2f19d5d9/ed43c49f.mp3',
      role: 'Full edit, mix & master'
    },
    {
      title: 'The Abidible Podcast',
      link: 'https://abidible.com',
      art: 'https://storage.buzzsprout.com/jhk3kxj3o7hbyk5mezom5v63e5lj?.jpg',
      meta: 'Edited Episode',
      episode: '#074 "A Fear to Be Desired" (Luke 1:50)',
      audio: 'https://www.buzzsprout.com/2372319/episodes/18242123-074-a-fear-to-be-desired-luke-1-50.mp3',
      role: 'Full edit, mix & master'
    },
    {
      title: 'Roll for Relaxation',
      link: 'https://rollforrelaxation.podbean.com',
      art: 'https://pbcdn1.podbean.com/imglogo/image-logo/7195087/RnR_14_by_14.jpg',
      meta: 'Edited Episode',
      episode: 'Episode 12: Five Wines',
      audio: 'https://mcdn.podbean.com/mf/web/cjsu6j/RnREpisode12FinalAudio.mp3',
      role: 'Edit & sound design'
    },
    {
      title: 'Sage: A Man’s Guide Into His Second Passage',
      link: 'https://www.audible.com/pd/Sage-Audiobook/B0DGWMYY7G',
      art: 'https://m.media-amazon.com/images/I/61VDEfCBQ4L._SL500_.jpg',
      meta: 'Audiobook · Audible preview',
      episode: 'by Chris Bruno',
      audio: 'https://samples.audible.com/bk/acx0/413699/bk_acx0_413699_sample.mp3',
      role: 'Audiobook post-production'
    }
  ],

  /* ── Game audio ────────────────────────────────────────────── */
  games: [
    {
      title: 'Who Let The Dogs Out?',
      link: 'https://windmillgames.itch.io/who-let-the-dogs-out',
      art: 'https://img.itch.zone/aW1hZ2UvMTk0NjM5NS8xMTQ0NzYyOS5qcGc=/original/XUE%2Bx3.jpg',
      tags: [
        { label: 'Point & Click', tone: '' },
        { label: 'Detective', tone: 'cyan' },
        { label: 'Voice Acting', tone: 'green' },
        { label: 'LÖVE Jam 2023', tone: 'gold' }
      ],
      text: 'A fully-voiced, story-driven point & click adventure. Play a detective solving mysteries at a farm — interrogate suspects, hunt for clues with your magnifying glass, and piece the evidence together.',
      role: 'Sound FX',
      quote: 'Detective game on point! Amazing audio which sets the mood just right.',
      quoteBy: 'Jam review'
    },
    {
      title: 'Disco Inferno',
      link: 'https://windmillgames.itch.io/disco-inferno',
      art: 'https://img.itch.zone/aW1nLzU3OTg0NzQucG5n/original/9Rh5jv.png',
      tags: [
        { label: 'Top-Down Shooter', tone: '' },
        { label: 'Bullet Hell', tone: 'cyan' },
        { label: 'Pixel Art', tone: 'green' },
        { label: 'Ludum Dare 48', tone: 'gold' }
      ],
      text: 'Welcome to bullet hell. A fast-paced top-down shooter with slick pixel art. Dodge, shoot and dance through waves of enemies.',
      role: 'Sound Design',
      quote: null,
      quoteBy: null
    }
  ],

  /* ── Music ─────────────────────────────────────────────────────
     Played through the tape deck, one track at a time — nothing is
     downloaded until a tape is selected.
     `tint` colours that track's cassette label. `note` is optional and
     shows under the credits when the tape is loaded.               */
  music: [
    {
      title: 'Hail the Idol',
      project: 'Rain Light Fade',
      album: 'The Institution Recordings',
      role: 'Guitars, BGVs, mixing, mastering & sound design',
      audio: '/assets/audio/music/hail.mp3',
      tint: '#6d5ce8',
      note: null,
      link: null
    },
    {
      title: 'Redeemer',
      project: 'Descriptor',
      album: null,
      role: 'Screaming vocals, BGVs & guitars',
      audio: '/assets/audio/music/redeemer.mp3',
      tint: '#ff4f6d',
      note: null,
      link: null
    },
    {
      title: 'When You Are Near',
      project: 'gardenbed',
      album: null,
      role: 'Producer, guitars, bass, vocals, mixing & mastering',
      audio: '/assets/audio/music/whenyouarenear.mp3',
      tint: '#4ee87f',
      note: null,
      link: null
    },
    {
      title: 'Rotting On Basic',
      project: "The Learn'd Astronomer",
      album: null,
      role: 'Producer, guitars, bass, vocals, mixing & mastering',
      audio: '/assets/audio/music/rotting.mp3',
      tint: '#ffc447',
      note: null,
      link: null
    },
    {
      title: 'Final Boss, Phase One',
      project: 'Tabletop commission',
      album: null,
      role: 'Producer, guitar, bass & sound FX',
      audio: '/assets/audio/music/dnd.mp3',
      tint: '#45d9ff',
      note: 'A perfect loop, written for the opening phase of a friend’s final boss fight. Seven minutes of roughly forty written for the encounter.',
      link: null
    },
    {
      title: 'Defenders of Delmon',
      project: 'Tabletop commission',
      album: null,
      role: 'Producer, vocals, guitars & sound FX',
      audio: '/assets/audio/music/defenders.mp3',
      tint: '#9585ff',
      note: 'A tavern song for the same campaign. I am the bard, singing the tale of the party.',
      link: null
    }
  ],

  /* ── ASMR ──────────────────────────────────────────────────────
     youtube-nocookie so embeds don't set tracking cookies.       */
  asmr: [
    { yt: 'QKT9YT3xE24', title: 'ASMR sound design' },
    { yt: 'xIHxZfB63M8', title: 'ASMR sound design' },
    { yt: 'axPtvvmbheI', title: 'ASMR sound design' },
    { yt: 'BfPtyFfqdkU', title: 'ASMR sound design' }
  ],
  asmrChannel: 'https://www.youtube.com/@BeardedAudioASMR/featured',

  /* ── Contact ───────────────────────────────────────────────── */
  contact: {
    formAction: 'https://formspree.io/f/xblvwjva',
    note: 'I read everything and reply to everything, usually within a day.'
  },

  /* ── Achievements ──────────────────────────────────────────────
     Stored in localStorage, never sent anywhere.                 */
  achievements: [
    { id: 'boot',        icon: '📺', name: 'POWER ON',        desc: 'Turned the console on.' },
    { id: 'start',       icon: '▶',  name: 'PRESS START',     desc: 'Started the cartridge properly.' },
    { id: 'sec_podcasts',icon: '🎙', name: 'THE EAR',          desc: 'Visited Podcasts.' },
    { id: 'sec_games',   icon: '🎮', name: 'PLAYER TWO',       desc: 'Visited Game Audio.' },
    { id: 'sec_music',   icon: '🎸', name: 'GARAGE BAND',      desc: 'Visited Music.' },
    { id: 'sec_asmr',    icon: '🎧', name: 'TINGLES',          desc: 'Visited ASMR.' },
    { id: 'sec_about',   icon: '📼', name: 'BACKSTORY',        desc: 'Visited About.' },
    { id: 'sec_contact', icon: '📧', name: 'OPEN CHANNEL',     desc: 'Visited Contact.' },
    { id: 'tour',        icon: '🗺', name: 'GRAND TOUR',       desc: 'Visited every section.' },
    { id: 'listen',      icon: '🔊', name: 'GOOD LISTENER',    desc: 'Played something.' },
    { id: 'listen_long', icon: '⏳', name: 'DEEP CUT',         desc: 'Listened to 30 seconds without stopping.' },
    { id: 'sfx',         icon: '🎚', name: 'SOUND ON',         desc: 'Turned the interface sound on.' },
    { id: 'crt',         icon: '🖥', name: 'PURIST',           desc: 'Toggled the CRT filter.' },
    { id: 'outbound',    icon: '🔗', name: 'FIELD TRIP',       desc: 'Followed a link out to a project.' },
    { id: 'poke',        icon: '👆', name: 'STOP THAT',        desc: 'Poked the logo five times.' },
    { id: 'konami',      icon: '🕹', name: 'UP UP DOWN DOWN',  desc: 'Entered the code.' },
    { id: 'nts_play',    icon: '❓', name: 'ROOKIE EAR',       desc: 'Played Name That Sound.' },
    { id: 'nts_streak',  icon: '🔥', name: 'GOLDEN EARS',      desc: 'Got five in a row.' },
    { id: 'contact_sent',icon: '📨', name: 'SAID HELLO',       desc: 'Sent me a message.' },
    { id: 'night',       icon: '🌙', name: 'NIGHT SHIFT',      desc: 'Visited between midnight and 5am.' },
    { id: 'complete',    icon: '👑', name: '100%',             desc: 'Earned every other achievement.' }
  ],

  /* ── Name That Sound ───────────────────────────────────────────
     `audio: null` falls back to a synthesized placeholder so the
     game is playable before real clips exist. Add clips to
     assets/audio/nts/ and fill in the audio field. See ASSETS.md. */
  nts: [
    { audio: '/assets/audio/nts/celery.mp3',
      answer: 'Celery snapping',
      wrong: ['A bone breaking', 'Wood splitting', 'Knuckles cracking'],
      reveal: 'Snapped celery is the classic bone-break foley, and has been since radio drama. Nobody has ever broken a real bone for a soundtrack.' },

    { audio: '/assets/audio/nts/snow_steps.mp3',
      answer: 'Footsteps in snow',
      wrong: ['Cornstarch in a leather pouch', 'Sand being poured', 'Paper being crumpled'],
      reveal: 'A trick question, because both answers are used. Real snow is unreliable to record, so cornstarch squeezed in a leather pouch is the studio stand-in.' },

    { audio: '/assets/audio/nts/glove_flapping.mp3',
      answer: 'Leather gloves flapping',
      wrong: ['A bird taking off', 'A flag in wind', 'A sheet being shaken'],
      reveal: 'A pair of leather gloves flapped by hand is the standard bird wing. Real birds are far too quiet, and refuse to take direction.' },

    { audio: '/assets/audio/nts/cane_swish.mp3',
      answer: 'A cane swung through the air',
      wrong: ['A sword being swung', 'A car passing', 'A whip cracking'],
      reveal: 'Every sword swing you have ever heard is a stick, a cane or a length of cable swung past a microphone. Swords barely make a sound.' },

    { audio: '/assets/audio/nts/book_drop.mp3',
      answer: 'A book dropped on a table',
      wrong: ['A door slamming', 'A punch landing', 'A body hitting the floor'],
      reveal: 'Something dense hitting something solid covers an enormous amount of ground. Dropped books turn into punches, slams and falls all the time.' },

    { audio: '/assets/audio/nts/chair_drag.mp3',
      answer: 'A chair dragged across the floor',
      wrong: ['A door creaking open', 'A ship at sea', 'A tree bending in wind'],
      reveal: 'Slow friction on wood. Pitch it down and it becomes a galleon straining; pitch it up and it becomes a mouse.' },

    { audio: '/assets/audio/nts/radio_static.mp3',
      answer: 'Radio static',
      wrong: ['Rain on a roof', 'Frying bacon', 'A distant crowd'],
      reveal: 'Filtered noise is the raw material behind rain, wind, applause and crowd wash. Change the filter, change the world.' },

    { audio: '/assets/audio/nts/straw_bubbles.mp3',
      answer: 'Bubbles blown through a straw',
      wrong: ['A pot coming to the boil', 'A stream over rocks', 'A fish tank pump'],
      reveal: 'A straw gives you complete control over bubble size and rate. A boiling pot gives you none, and takes ten minutes to reheat between takes.' }
  ]
};
