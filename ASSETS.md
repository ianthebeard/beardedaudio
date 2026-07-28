# Assets That Would Make This Site Sell You

You said the site is more impressive than the work. That's not a design problem — the design can only frame what's there. This is the list of things that would fix it, ordered by how much they'd move the needle relative to the effort.

Everything here is optional. The site is being built to work without any of it, using placeholder data you can swap out. But items 1–3 are the ones that would change how a client feels when they land.

---

## 1. Your own UI sound pack ⭐ THE BIG ONE

**Effort: 1–2 hours. Impact: enormous.**

Right now the site's interface sounds are going to be synthesized in the browser with oscillators. They'll be decent. But they'll be *mine*, not yours.

If you design the UI sounds yourself, then every single click, hover, page change, and achievement pop on this site is a live demonstration of your craft. A visitor doesn't have to click into a portfolio section to hear your work — they're hearing it from the first second, whether or not they consciously notice. That is a far better argument than any showreel, because it's *ambient proof*.

This is the single highest-leverage thing on this list and I'd do it before anything else.

**What I need — 9 clips, all very short:**

| File | Length | Fires when | Notes |
|---|---|---|---|
| `ui-move.wav` | 40–80ms | Arrow-key moves the menu cursor | Plays rapidly and repeatedly. Must not fatigue. Keep it dry and quiet. |
| `ui-select.wav` | 100–200ms | Enter / clicking a menu item | The satisfying one. This is your signature. |
| `ui-back.wav` | 100–200ms | Escape / back | Should feel like the inverse of select |
| `ui-hover.wav` | 30–60ms | Mouse enters a card or button | Very quiet, very short. Almost subliminal. |
| `ui-error.wav` | 150–300ms | Locked item, wrong answer | |
| `boot.wav` | 1.5–2.5s | CRT power-on at page load | Your title-screen sting. Go big — it's the first thing anyone hears. |
| `achievement.wav` | 400–800ms | Achievement unlocked | Needs to feel like a reward. Will be heard often. |
| `page-in.wav` | 200–400ms | Section transition | Sits under a screen wipe |
| `secret.wav` | 800ms–1.5s | Konami code accepted | Let this one be weird. It's a reward for the curious. |

**Plus four for the tape deck**, now that Music is a real cassette machine:

| File | Length | Fires when |
|---|---|---|
| `tape-eject.wav` | 250–400ms | The loaded tape slides out |
| `tape-in.wav` | 300–500ms | New tape drops in and seats — **the clunk**. This is the money sound. |
| `tape-play.wav` | 200–400ms | Motor spins up, playback starts |
| `tape-stop.wav` | 100–250ms | Pause. A mechanical clack. |

The deck's timing is fixed so you can cut to it: eject at 0ms, tape lands at 320ms, clunk at 740ms, motor at 740ms. If `tape-in.wav` has its impact ~420ms in, it'll line up with the tape hitting the bottom of the slot exactly.

**Specs:** 48kHz, 24-bit WAV (I'll convert), mono is fine for UI, peak around −6dBFS. Don't master these loud — they layer over each other and play unprompted.

**One design note:** these should sound like *your* console, not like a Nintendo sample rip. The site is a SNES homage, not a SNES clone, and lifting actual first-party sounds would be both a legal problem and a weaker flex than making your own.

---

## 2. Before / after pairs

**Effort: 1 hour. Impact: very high.**

Editing is invisible work. A client cannot tell what you did, which is exactly why editing is undervalued. An A/B toggle makes it audible in four seconds.

**What I need — 3 to 5 pairs:**

- Same 20–30 second passage, twice: `<slug>-raw.mp3` and `<slug>-edited.mp3`
- **Sample-aligned.** Same start point, same length, to the millisecond. The toggle switches sources mid-playback and keeps the playhead position, so any drift is immediately obvious and ruins the effect.
- **Do not level-match to flatter yourself.** If the edited version is just louder, the demo is dishonest and an experienced listener will clock it instantly. Match perceived loudness; let the actual work do the talking.
- Pick passages where the fix is *audible but not cartoonish*: a room tone that disappears, a plosive that stops slapping, three people whose levels finally sit together, an "um" density that drops.

**What sells hardest:** a genuinely rough remote recording. Bad laptop mic, echoey room, someone eating. If you can make that listenable, say so loudly, because that's the job most clients are actually hiring for.

For each pair I'll also want one line of plain English: *"Guest recorded in a bathroom on AirPods. Removed the room, matched them to the host, saved the episode."*

---

## 3. Name That Sound clip pack — ✅ RECEIVED

Eight rounds are live, built from the clips you supplied:

| Clip | Answer |
|---|---|
| `celery.mp3` | Celery snapping |
| `snow_steps.mp3` | Footsteps in snow |
| `glove_flapping.mp3` | Leather gloves flapping |
| `cane_swish.mp3` | A cane swung through the air |
| `book_drop.mp3` | A book dropped on a table |
| `chair_drag.mp3` | A chair dragged across the floor |
| `radio_static.mp3` | Radio static |
| `straw_bubbles.mp3` | Bubbles blown through a straw |

The game draws 8 rounds from the pool, so **the pool and the round count are currently the same** — every playthrough uses every clip, only the order and the answer positions change. Adding four or five more clips is what makes replaying feel different. That's the single best follow-up here.

**To add one:** drop the file in `assets/audio/nts/` and add an entry to the `nts` array in `data.js` with an answer, three wrong answers and a reveal line.

**What still makes the best rounds:** foley where the true answer is absurd. `glove_flapping` is the strongest one in the set for exactly that reason — "leather gloves" as the answer to something that sounds like a bird is the moment the game teaches someone something.

<details>
<summary>Original spec, for adding more</summary>

**What I need — 12 to 20 rounds:**

Each round is one audio clip plus four possible answers, one correct.

- **Clip length: 2–4 seconds.** Longer drags.
- Name them `nts-01.mp3` through `nts-20.mp3` and give me a list:

```
nts-01.mp3 | correct: Celery snapping | wrong: Bone breaking, Wood splitting, Knuckles cracking
nts-02.mp3 | correct: Cornstarch in a leather pouch | wrong: Footsteps in snow, Sand pouring, Static
```

- **The best rounds are foley where the real answer is absurd.** Cornstarch as snow, celery as bone, a leather glove as a bird's wing. That's the delight — the visitor learns something about how sound is actually made, from you, in the middle of a portfolio site.
- Mix in a few from your actual game work so it doubles as a credits reel.
- Ideally the wrong answers are *plausible*, not filler. A round where three options are obviously wrong isn't a round.

</details>

---

## 4. Music section files — ✅ RECEIVED

Six tracks are live in the tape deck:

| # | Track | Project | Length |
|---|---|---|---|
| 01 | Hail the Idol | Rain Light Fade | 5:06 |
| 02 | Redeemer | Descriptor | 4:22 |
| 03 | When You Are Near | gardenbed | 3:09 |
| 04 | Rotting On Basic | The Learn'd Astronomer | 3:31 |
| 05 | Final Boss, Phase One | Tabletop commission | 7:04 |
| 06 | Defenders of Delman | Tabletop commission | 5:01 |

**Decided, no action needed:**

- **Track 05 stays at 16MB.** Ian's call — it's a boss theme and should sound like one. It costs nothing on page load since nothing downloads until that tape is selected; only someone who picks it pulls the file.
- **"Final Boss, Phase One" is the real title**, not a placeholder.

**Still worth doing eventually:** cover art. The cassette labels are currently solid colours with the title set in type, which looks deliberate rather than unfinished — but band art would make each tape distinct at a glance. Square, 600×600 minimum, one per track. Add a `art:` path to the track in `data.js`.

---

## 5. Testimonials

**Effort: 30 minutes of asking. Impact: high, disproportionate to effort.**

Two or three is plenty. More than four and nobody reads any of them.

For each: the quote, the person's name, their show or project, and ideally a link. **A named quote from a real show is worth ten anonymous ones** — "great to work with — J." is worth nothing and slightly damages credibility.

The jam review already on the Games page ("Detective game on point! Amazing audio which sets the mood just right.") is a good example of the form, and it's the only social proof currently on the entire site.

If asking feels awkward: people who liked working with you will say yes, and the ask is genuinely small. "I'm rebuilding my site — mind if I quote you on the audio work?"

---

## 6. A picture of you — ✅ RECEIVED (Twitch emotes)

The profile card on the file-select now shows one of your three Twitch emotes, picked by **the visitor's own local clock**:

| Their local time | Emote |
|---|---|
| 08:00 – 15:59 | HYPE |
| 16:00 – 23:59 | Laugh |
| 00:00 – 07:59 | Sleep |

Not pixelated — they're illustrations, and pixelating line art just muddies it.

**Processing:** each was 1000×1000 and ~800KB. They're now **288×288, 128-colour palette PNGs at ~35KB each** — 288 rather than 144 so they stay sharp on retina screens. Flat-shaded artwork quantises extremely well, which is where the 4× saving came from. Only one ever loads per visit.

**To change the bands**, edit the `avatars` array in `data.js`. Ranges are `[from, to)` in 24-hour time and must tile the full day without gaps — all 24 hours are currently covered and verified.

**Files you can now delete if you want the repo lighter** (nothing references them):
- `assets/2020-10-16 02.11.41.PNG`, `02.13.15.PNG`, `02.13.32.PNG` — the emote originals, ~2.4MB total
- `assets/headshot.png` — 1.9MB
- `assets/img/ian.png` — the pixel-art headshot, 4.7KB

I've left all of them in place rather than deleting your files. The pixel headshot approach is documented in git history if you ever want it back.

**One loose end:** the original `assets/headshot.png` is still sitting in the repo at 1.9MB, unused. Nothing links to it, so it costs visitors nothing, but it's dead weight in the repo. Delete it, or move it somewhere as the archival source — your call.

---

## 7. Showreel

**Effort: 3–4 hours. Impact: moderate.**

Lower on this list than you'd expect, because reels are a lot of work and the before/afters in item 2 do more convincing per minute of listening.

If you make one: **60–90 seconds, hard cut**. No slow build. Open with your strongest three seconds, because that's how long you get. Podcasts, game audio, ASMR, music — show the range, since range is genuinely your pitch.

---

## 8. Game audio breakdowns

**Effort: 1 hour. Impact: moderate, but strong with the right client.**

For *Who Let The Dogs Out?* and *Disco Inferno*, isolated stems would let me build something no other audio portfolio has: a mixer panel where a visitor solos individual layers.

Per game, 4–6 stems: footsteps, ambience, UI, weapons, music, dialogue. Plus the full mix. Anyone hiring for game audio will spend real time with that, and it's the exact demonstration a game dev is looking for.

Worth doing only if the project files still exist and stem export is quick. Don't rebuild a mix for this.

---

## 9. Copy I'd like from you

Small, but currently missing and I'd rather not invent it:

- **One sentence on what you're best at.** Not "freelance audio editor" — the specific thing. "I make bad remote recordings sound like a studio" is a positioning statement. "Audio editor" is a job title.
- **Rates or a rate range**, or an explicit "ask me." Right now there's nothing, and a client with a budget has no signal whether you're in it.
- **Turnaround time.** For podcast editing this is often the deciding factor, ahead of price.
- **Whether you're currently taking work.** The home page implies yes but never says it.
- **Episode blurbs**: one line per podcast on what you actually do for it. "Full edit, mix, and master, 3 hosts, weekly" tells a prospective client far more than an episode title does.

---

## Where to put files

```
assets/
  audio/
    ui/        ← item 1, the UI sound pack
    demos/     ← item 2, before/after pairs
    nts/       ← item 3, minigame clips
    music/     ← item 4, tracks
  img/
    covers/    ← album and podcast art
    ian.png    ← item 6
```

Add the files, then add an entry to the data block in `assets/js/data.js`. Every section of the site is driven by that one file — adding a track, a project, or a minigame round means editing one object, not touching any markup.

---

## If you only do one thing

**Item 1, the UI sound pack.** An audio portfolio where the interface itself is your sound design is a genuinely uncommon idea, it takes an afternoon, and it works on every visitor whether or not they ever click into a single project.

It's now 13 clips rather than 9, because the tape deck wants four of its own — and the deck is the best argument for doing this at all. A cassette clunking into a slot is a sound everyone knows, everyone likes, and nobody can quite describe. Yours should be the one people hear.
