# Making a Site a Delight to Use

Notes from building Bearded Audio, written for the next one.

Everything here comes from something that actually worked or actually broke during this build. The failures are more useful than the successes, so they get their own long section — skip to **Part 6** if you only read one thing.

---

## The one rule everything else hangs off

**Delight must survive a visitor in a hurry.**

Every delightful thing on this site has an escape hatch, and that isn't a compromise — it's the thing that makes the delight affordable in the first place.

The title screen is the clearest case. A `PRESS START` gate in front of a freelance portfolio is a genuinely risky idea: a producer with thirty seconds and four tabs open does not want a locked door. It only works because:

- Any key, click or scroll skips it
- It auto-advances after 9 seconds if ignored
- It's remembered per session, so it doesn't replay when someone comes back
- **Deep links bypass it entirely** — `#/games` goes straight to games

That last one is the important one. It means you can send someone a link mid-conversation and they land on the thing you're pointing at, with no ceremony. The boot sequence exists for people arriving cold at the front door, and only for them.

The general form: **for every delightful thing, ask "what does this cost the person who doesn't want it?"** If the answer is more than a second or one keypress, redesign it. If the answer is "nothing, they'll never even see it," you've found the best kind.

---

## Part 1: Achievements

The part that worked best, so it gets the most detail.

### Why they work here

An achievement system does something no amount of good copy does: **it converts browsing into playing.** Once there's a counter, a visitor who was going to skim one page has a reason to open a second. And the reason isn't manipulative, because the reward for exploring is *seeing more of your actual work*.

That's the test for whether achievements belong on a site at all. **Do they reward the things you'd want a visitor to do anyway?** Here they reward visiting each section, playing something, listening for a while, following a link to a real project, and getting in touch. Those are all things that were already the point. The achievements just make them visible.

If you find yourself designing an achievement for *scrolling to the bottom* or *clicking a thing 50 times*, you've crossed into grinding, and grinding is the opposite of delight.

### The mechanics that mattered

**localStorage, never cookies.** This is worth being emphatic about. Cookies drag in a consent banner, a privacy policy, and a legal surface. localStorage stays in the browser, is never transmitted, and needs none of that. It also survives closing the tab, which cookies with short expiries don't. There is no upside to cookies for this.

**Locked entries show as `???`, not hidden.** This is the single highest-leverage detail in the whole system. An empty slot that says "not found yet" creates pull; an achievement you can't see creates nothing. The visitor knows there are 21, knows they have 12, and knows the other 9 exist. Mystery only works when you can see its outline.

**Three surfaces, three jobs.**
- A **toast** at the moment of unlock — the dopamine hit
- A **counter** in the header — persistent, glanceable, never in the way
- A **trophy room** — the destination, and the place the `???`s do their work

Any one alone is weaker. The toast without the room is a firework with nothing behind it. The room without the toast means nobody discovers the system exists.

**Awards fire from the thing itself, not from a watcher.** The listening achievement lives in the audio player's `play` handler. The section achievements fire in the router. This keeps them honest — an achievement can only fire if the thing actually happened.

### The trap I walked into

Two achievements here gate 100% behind things a visitor may never do: **NIGHT SHIFT** requires visiting between midnight and 5am, and **SAID HELLO** requires sending an email.

Both are defensible — one is a reason to come back, one is a conversion nudge. But together they mean **almost nobody will ever see the 👑.** I flagged it and Ian kept them, which is a legitimate call. The mistake would have been *not noticing*.

So: **decide deliberately whether 100% is reachable.** There are three honest designs and you should pick one on purpose.

1. **All reachable in one sitting** — completion is the goal, the site is short, everyone who tries wins
2. **A reachable set plus a collector set** — 100% of "explored the site," with extras that don't count toward it
3. **100% is genuinely hard** — fine, as long as you know that's what you built

What's *not* fine is drifting into option 3 by accident and wondering why nobody completes it.

### Writing the list is a design exercise

The unexpected benefit: **enumerating the achievements forced an articulation of what the site is for.**

Sitting down to write 21 of them means answering "what do I actually want someone to do here?" twenty-one times. Some answers were obvious (see the work). Some were clarifying (listen to something for 30 continuous seconds — because a 4-second sample proves nothing about an audio editor). Some only appeared because the list demanded them (follow a link out to a real shipped project — social proof I wasn't otherwise surfacing).

**Do this early, even if you never build the system.** It's a free content audit disguised as a game mechanic.

### Naming

Names are most of the charm and cost nothing. `GOLDEN EARS`, `STOP THAT`, `UP UP DOWN DOWN`, `DEEP CUT`. Two rules:

- **Name the moment, not the metric.** "STOP THAT" for poking the logo five times is funny; "LOGO CLICKER" is not.
- **The description is a second joke, or a real explanation, never a restatement.** If the name is `NIGHT SHIFT`, the description shouldn't be "visited at night."

---

## Part 2: Make the interface demonstrate the craft

The strongest idea on this site is one that isn't finished yet: **the UI sounds should be Ian's own sound design.**

Once they are, every click, hover, page change and achievement pop is a live demonstration of the thing being sold — reaching every visitor, whether or not they ever open a single project. That's a far better argument than a showreel, because it's *ambient proof*. Nobody has to decide to experience it.

Generalised: **the medium of the site should be the medium of the work.**

- An audio person's site should sound like they made it
- A motion designer's site should move like they made it
- A writer's site should be worth reading before you reach the portfolio
- An illustrator's empty states, 404 and loading spinner should all be drawings

The corollary is harsher: **if the site is generic, it's evidence against the work.** A sound designer with a silent website is making a quiet argument that they don't think about sound much. This site was silent for years.

### Where to put it

Look for the surfaces every visitor touches regardless of what they came for: navigation, hover, page transitions, empty states, error states, the 404, the loading moment. Those are the places where craft becomes unavoidable.

---

## Part 3: Detail that rewards noticing

The distinction that matters: **detail that rewards noticing, versus detail that demands noticing.**

Demanding detail is an autoplay video, a mandatory intro, a cursor trail that follows you everywhere. It taxes everyone to impress a few.

Rewarding detail costs nothing if unseen. Examples from this build:

**The logo is a level meter.** Four bars that sit still, and dance whenever the site is playing audio — any player, the tape deck, the minigame. Most people won't consciously register it. The ones who do get a small "oh, nice."

**The tape reels are physically correct.** The supply reel empties as the take-up reel fills, and because tape speed is constant, **the smaller reel spins faster.** Almost nobody will notice. But anyone who has handled a cassette will feel that it's right without knowing why, and getting it *wrong* would have felt off to exactly those same people.

**The avatar changes with the visitor's local clock.** Hype during the day, laughing in the evening, asleep overnight. A single visitor sees one. A returning visitor at a different hour gets a small surprise.

The common thread: **these are all free for people who don't notice, and disproportionately charming for people who do.** That ratio is what to optimise.

One caveat learned here — a detail nobody can discover is a detail that mostly doesn't exist. The time-of-day avatar will be invisible to most people forever. That's an acceptable trade for something this cheap, but if a detail is expensive, it needs a breadcrumb.

---

## Part 4: Physical metaphors, and the load-bearing test

The tape deck is the most-liked thing on this site, and it's worth understanding why so it can be repeated.

**It's a specific remembered object, not generic realism.** Skeuomorphism got a bad name from leather stitching and felt textures applied as decoration. That's not what this is. A cassette is an object a particular audience has physically handled — they know the weight, the clunk, the way the reels move. You're not simulating a material, you're **borrowing a memory.**

Rules that made it work:

- **Pick an object the audience has actually held.** Cassette for anyone over about 30, and instantly legible even to those who haven't.
- **Get the mechanics right.** Reel physics, side A/B, the tape spooling. Wrong mechanics break the memory, which is worse than not invoking it.
- **Let it do real work.**

That last one is the important one, and it deserves its own name.

### The load-bearing test

**Delight that also solves a real problem survives redesigns. Decorative delight gets deleted.**

The tape deck wasn't only charming. The six music tracks total 49MB. The original grid layout would have created six audio players and fetched every file to draw waveforms — 49MB on page load. The deck loads exactly one tape at a time, so a visit costs one file.

The delightful solution *was* the performance solution. That's not luck — it's what happens when the metaphor is chosen to fit the constraint. A deck holds one tape. That's true of cassettes and true of bandwidth.

**When you find yourself with a technical constraint, check whether there's a metaphor that makes the constraint feel intentional.** Pagination becomes a card catalogue. Rate limits become an energy meter. Lazy loading becomes a deck that holds one tape.

---

## Part 5: What went wrong

The most useful section, because these are all mistakes that will recur.

### The effect was above the content

**The single biggest error in the build.** The CRT scanlines and RGB aperture grille were in a fixed overlay above everything, so 1px black lines and colour triads landed directly on top of 16px body text and shredded it. The effect looked great on the title screen and made the actual writing hard to read.

The fix was architectural, not a matter of tuning opacity down: **the texture moved behind the content.** Same scanlines, same intensity, applied as background layers on every surface — panels, cards, banners, header, footer — so glyphs render on top of them, crisp.

**The rule: never put an effect layer above type.** Above artwork, fine. Above the title screen's 3rem display type, fine — that's where it looks best. Above 16px paragraphs, never.

Notice that both goals were achievable simultaneously. The initial framing — "readability versus the effect" — was a false trade the whole time. **When a delight/usability tradeoff appears, check whether it's real or just the current implementation.**

### An animation's end state persisted

The page transition ended on `clip-path: inset(0 0 0 0)` with `animation-fill-mode: both`. That end state *stays applied after the animation finishes*, clipping every view to its exact border box — which silently cut the 3px outline off every panel and swallowed the secret slot's glow entirely.

It presented as "the boxes look cut off on the left," which points nowhere near the cause.

**Rule: audit what your animation leaves behind.** `both` and `forwards` persist the final keyframe indefinitely. If that keyframe constrains anything — clip-path, overflow, transform, filter — it constrains it forever.

### Pixel art needs its pixels where the meaning is

The headshot at 56×56 came out with the eyes closed. Not because 56px is too small in principle, but because the crop was the full photo — most of the pixels went to hair, shoulders and the bookshelf behind him, leaving eyes two pixels wide.

Cropping tight to the face and moving to 72px fixed it completely.

**Rule: at low resolution, spend the pixels on the thing that carries meaning.** For a face that's the eyes. Crop until the meaningful part fills the frame, then downsample.

### Non-integer scaling destroys pixel art

Display size must be an exact multiple of source size. At 1.5× or 1.87× the browser blends adjacent source pixels and you get a blurry photo rather than pixel art. 56→112 and 72→144 are clean. 72→130 is mush.

### Unlabelled icon buttons explain nothing

Two glyphs sat in the header — `▷` and `▩` — for the sound and CRT toggles. Completely opaque. The first fix (moving them into a labelled drawer on mobile) was worse: it created a panel whose visibility depended on viewport width, which then went stale when the window was resized.

Final answer was the boring one: **put the state in the label.** `SFX ON`, `CRT OFF`. Always visible, no drawer, no hidden state, no resize bug.

The icons hung around next to those labels for a while anyway, shrunk to 6px on a phone. They were decoration by then — the label was doing all the work — and deleting them bought back the ~30px the header needed to keep the logo and the tools on one row at phone widths instead of wrapping to two.

**Rule: if it's a toggle, write its current state in words.** Only text says what a control is currently doing — and once the text is there, the icon beside it is just something else to line up.

### The burger was a character, and characters have opinions

The menu button drew its bars from `☰`. Press Start 2P has no such glyph, so it silently fell through to a system font — which brought its own baseline and its own line-height. The bars sat low in the button and the taller line box made the button a few pixels taller than the labelled ones beside it. Nothing in the CSS said "make this one bigger"; the font said it.

**Rule: if a shape has to align to the pixel, draw it, don't type it.** Three CSS bars centre exactly and take whatever height you give them.

### The on-screen D-pad was a good idea I couldn't land

A floating D-pad and A button on touch devices, to make the file-select feel like a console. In practice it hovered over the content, needed 7rem of footer padding to scroll past, and duplicated what tapping a menu row already did. Fun idea, terrible execution — removed.

**Rule: a metaphor is worth real estate only when it's the best way to do the thing.** The keyboard version earns its keep because arrow keys are already there. The touch version was a picture of a controller sitting on top of a website.

### I timed my own intro badly

The first boot sequence auto-advanced after 2.5 seconds, with the "click, tap or press any key" hint appearing at 2.0s. Half a second to read it. Ian's report was that it went by so fast there wasn't time to understand what was happening, let alone skip it.

It's now a 9-second beat sheet with a 900ms grace period before input is accepted at all — so a stray trackpad flick during page load can't kill the intro before it's said anything.

**Rule: you cannot time your own intro.** You know what it says. Count it out loud, or watch someone else see it once, and then roughly double whatever felt right.

### Decoration crowded out content

The file-select rows originally carried an emoji, a name, a subtitle and a count. Stripping them to just name and count made the screen read dramatically better — more like an actual save-file screen and less like a menu trying to justify itself.

**Rule: when a delightful element isn't landing, try removing things before adding them.** The subtitles were explaining sections whose names already explained them.

### The pattern across all of these

Almost every failure was **the effect competing with the content**, not the effect being wrong. Scanlines over text, emoji beside labels, an intro that didn't wait, decoration clipping the layout. In every case the fix preserved the delight and moved it out of the way of the information.

That's the debugging instinct worth internalising: when something delightful isn't working, the problem is usually its *relationship to the content*, not the thing itself.

---

## Part 6: Accessibility is part of delight

Not opposed to it. The two goals point the same direction more often than not, and the cost is usually a few lines.

**`prefers-reduced-motion`** kills the CRT roll, the spinning reels, the screen wipes, the card hovers, and the EQ bars. Motion sensitivity is common, and a site that ignores it isn't delightful for those people — it's actively unpleasant.

**Toggles for the two loudest effects.** Sound is opt-in and off by default. The CRT can be switched off entirely — one variable set to `none` kills every texture layer at once. Someone who finds scanlines unbearable can turn them off instead of leaving.

**Keyboard navigation that mirrors the metaphor.** Arrow keys move the file-select cursor, Enter selects, Escape goes home. This is an accessibility feature and a *thematic* feature simultaneously — on a console-shell site, arrow keys are the D-pad. The most satisfying kind of accessibility work is the kind that's also the best version of the idea.

**Focus states styled to match.** A gold outline that looks deliberate, not a default blue ring bolted onto a dark purple site. Visible focus is required; ugly focus is a choice.

**Contrast checked, not assumed.** `--lav-dim` started at `#8b84c4`, which sat around 4.6:1 on panels — technically passing AA and genuinely too close to the line once scanlines took a bite out of it. Lifted to `#a49dda`. **Dark themes with tinted greys are where contrast quietly fails.**

---

## Part 7: Sound specifically

Since it's the medium.

**Opt-in, off by default, remembered.** Sound that plays unrequested is the fastest way to get a tab closed. A toggle that persists in localStorage means someone who wants it gets it every visit.

**Synthesise placeholders so the mechanism ships before the assets.** Every UI sound here is a Web Audio oscillator today, with a named slot ready for a real file. The call sites don't change when the files arrive — one path added to a manifest and the synth is bypassed. **This is the general pattern: build the mechanism against placeholders, so the thing works before the content exists.** The minigame was fully playable with synthesised foley before a single real clip existed.

**Master UI sounds quiet.** They layer over each other, they play unprompted, and they repeat hundreds of times. The hover sound has to survive being heard 200 times in one session. Anything with a sharp transient or a long tail becomes torture at that repetition rate.

**Match the sound to the physical action.** The tape deck has four slots — eject, insert, play, stop — timed to the animation, so the clunk lands exactly as the tape bottoms out. Sound divorced from motion reads as a soundboard; sound locked to motion reads as a machine.

---

## Part 8: Architecture that keeps delight cheap

Delight decays when it's expensive to maintain. Two structural decisions kept it cheap here.

**One data file.** Every piece of content — episodes, games, tracks, achievements, minigame rounds, the time-of-day avatar bands — lives in `data.js`. Adding a track is editing one object. No markup is touched.

This matters more than it sounds. **If adding content means editing markup, content stops getting added**, and a portfolio that stops getting updated stops working. The delightful bits are the first casualty, because they're the fiddliest to hand-edit.

**Placeholder-first construction.** Covered above under sound, but it generalises: build the mechanism, stub the content, ship it working, swap the stubs. It means the delightful feature is *done* and waiting rather than *blocked* and rotting in a branch.

---

## The checklist

For the next redesign.

**Before building**
- [ ] What is the medium of the work, and how does the interface demonstrate it?
- [ ] Write the achievement list first, even if you never build it — it's a content audit
- [ ] Which technical constraint could become a metaphor?

**For every delightful element**
- [ ] What does it cost someone who doesn't want it?
- [ ] Can it be skipped, and is the skip discoverable?
- [ ] Do deep links bypass it?
- [ ] Is it load-bearing, or is it decoration that will be deleted in two years?
- [ ] Does it survive `prefers-reduced-motion`?
- [ ] Is it above the content, or behind it?

**Before shipping**
- [ ] Every toggle states its current condition in words
- [ ] Contrast measured on the actual background, not guessed
- [ ] Focus states styled, not defaulted
- [ ] Keyboard path through the whole site
- [ ] Someone else watches the intro once, and you watch them
- [ ] Adding a new piece of content requires editing exactly one file
- [ ] Nothing autoplays

---

## For the next two sites

I haven't seen **theroadtodoom.com** or **asmrmixer.com**, so this is framing rather than advice — happy to do a proper pass on either if you point me at them.

The questions I'd start with for each:

**What's the medium, and does the interface speak it?** For a mixer especially, this is the whole ballgame — an ASMR mixer's interface *is* the demo. Every control is a chance to prove the ear behind it. That's the strongest version of the Part 2 idea on any of your three sites, because the tool and the portfolio are the same object.

**What's the one object the audience has held?** The cassette worked here because it's specific and remembered. Each site probably has one. Finding it is most of the design.

**What would the achievement list be?** Genuinely — write 15 for each before touching a layout. For a tool rather than a portfolio, the interesting achievements are about *depth of use* rather than coverage: found a setting most people miss, built something and kept it, came back a second week.

**Where does a hurried visitor need to get to, and how fast?** Then build everything else around leaving that path clear.

One thing that transfers directly: **the achievement system here is content-agnostic.** It's `data.js` definitions plus a localStorage store plus toast/counter/room rendering. Dropping it into another site is a matter of rewriting the definitions list. That's the cheapest way to get the thing you liked most onto the next project.
