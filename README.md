# Bearded Audio

Static site. No build step, no dependencies to install. Push to `main` and Vercel serves it.

## Editing content

**Almost everything you'll ever want to change lives in [`assets/js/data.js`](assets/js/data.js).** Episodes, games, tracks, achievements, minigame rounds, your bio, the contact form endpoint. No markup needs touching to add a project.

```
index.html              page shell — rarely needs editing
assets/css/style.css    all styling; palette is at the top as CSS variables
assets/js/
  data.js               ← content lives here
  audio.js              interface sound (synthesized; swap in real files here)
  achievements.js       localStorage progress tracking
  player.js             the pixel audio player
  minigame.js           Name That Sound
  views.js              how each section renders
  app.js                boot sequence, routing, keyboard nav, secrets
assets/audio/           your files — see ASSETS.md
assets/img/
```

### Add a podcast

Add an object to the `podcasts` array in `data.js`. Copy an existing one and change the fields.

### Add a music track

1. Put the file in `assets/audio/music/`
2. Add an entry to the `music` array — there's a commented-out template showing the fields

Self-hosted files get a real decoded waveform. Remote files (podcast hosts) fall back to a segmented progress bar, because those hosts don't send CORS headers and the audio can be played but not read.

### Replace the interface sounds with your own

The UI sounds are currently synthesized with oscillators. To use real files, drop them in `assets/audio/ui/` and fill in the `files` object near the top of `assets/js/audio.js`. Any sound with a file uses the file; anything left `null` keeps the synth. You can do them one at a time.

See [ASSETS.md](ASSETS.md) for specs and why this is worth doing.

### Add minigame rounds

Add to the `nts` array in `data.js`. Set `audio` to a clip path, or leave it `null` and name a `synth` placeholder.

## How the site works

- **Boot** — CRT power-on and PRESS START on first arrival. Skippable with any input, auto-advances after 2.5s, remembered for the session. Deep links (`#/games`) bypass it entirely so shared links go straight to content.
- **Routing** — hash-based, so every section is linkable and the back button works.
- **Keyboard** — `↑ ↓` move the file-select cursor, `Enter` selects, `Esc` returns to the menu, `← →` step between sections.
- **Sound** — off by default, toggled in the header, remembered in localStorage.
- **CRT** — toggleable, and fully disabled under `prefers-reduced-motion`.

## Secrets

- **Konami code** (`↑ ↑ ↓ ↓ ← → ← → B A`) unlocks the Name That Sound cartridge, which then appears permanently in the menu and nav.
- **Poking the logo five times** switches to an alternate colourway.
- 21 achievements, tracked in the trophy room.

## Privacy

Achievement progress uses **localStorage, not cookies**. It never leaves the browser and is never sent to a server, so there's no consent banner and nothing to disclose. YouTube embeds use `youtube-nocookie.com`.

## Local development

```sh
python3 -m http.server 8899
```

Then open http://localhost:8899. A server is needed rather than opening the file directly, because waveform decoding uses `fetch`.
