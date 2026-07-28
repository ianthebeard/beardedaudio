# Designing for Delight

A working philosophy for building websites people enjoy being inside.

This is a training document. It assumes no knowledge of any particular project — every example is explained from the ground up. Read it before starting a redesign, and again when you're deciding what to cut.

---

## What delight actually is

Delight is not decoration. It is not animation, or a clever cursor, or a loading screen with a joke in it. Those are sometimes *symptoms* of delight, but chasing them directly produces sites that feel like they're performing at you.

**Delight is the feeling of having been considered.**

It's the sense a visitor gets that someone thought about this moment — this specific hover, this specific empty state, this specific thing going wrong — and made it better than it needed to be. That feeling is the product. Everything in this document is a technique for producing it.

Two consequences follow immediately, and they're the reason most attempts at delight fail:

**Consideration includes considering the person who isn't charmed.** A visitor in a hurry, on a slow connection, using a screen reader, or simply not in the mood is still someone you're designing for. An interface that only works for the delighted is not considerate — it's self-indulgent.

**Consideration is invisible when it works.** The best delight often goes unnoticed by most people and lands hard on the few who see it. That ratio is the target, and it means you cannot measure delight by how obvious it is.

---

# Part I — Three laws

Three rules constrain everything else. If a delightful idea violates one of them, it will either be removed later or quietly damage the site.

## Law 1: The escape hatch

**Every delightful element must be skippable, and the skip must cost less than one second.**

Delight is a gift. A gift that can't be declined is a demand.

Consider a site that opens with an animated title sequence — a logo assembling, a tagline, a prompt to continue. It's a lovely piece of craft. It's also a locked door in front of the thing the visitor actually came for. Someone who was sent a link mid-conversation, who has four tabs open and thirty seconds of patience, now has to sit through your idea about how arrivals should feel.

The sequence becomes affordable the moment you add exits:

- **Any input skips it** — key, click, tap, scroll. Not a specific button they have to find.
- **It advances on its own** if ignored, so an inattentive visitor isn't stranded.
- **It's remembered**, so a returning visitor doesn't pay the toll twice. Session-scoped memory is usually right: fresh each visit, not once forever.
- **Deep links bypass it entirely.** If a URL points at a specific section, honour it. Ceremony belongs at the front door, not in front of every door.

That last point is the one people forget, and it's the most important. A shareable URL that lands on the thing it names is worth more than any intro.

**The general test:** for any delightful element, ask *what does this cost someone who doesn't want it?* If the answer is more than a second or a single keypress, redesign it. If the answer is "nothing — they'll never even encounter it," you've found the best kind of delight.

## Law 2: Load-bearing delight survives

**Delight that also solves a real problem outlives delight that only charms. Decoration gets deleted in the next redesign; infrastructure doesn't.**

This is a practical observation about how projects age. When a site gets revisited in two years, whoever does the work — including future you — will strip out anything that looks like it's just there to be cute, because it reads as cost with no benefit. Anything doing a job stays.

So look for places where a delightful idea can absorb a technical constraint.

Here's a fully worked example. Imagine a music section for a musician with six full-length tracks. The audio files total around 50MB. The conventional layout is a grid of six cards, each with its own player. This is a performance disaster: six audio elements, and if you want to draw waveforms you must download every file to analyse it. Visiting that page costs 50MB.

The usual fixes are all joyless — lazy loading, truncated previews, a spinner, an apology.

Now think about the constraint as a design brief: *only one track should be loaded at a time.* What real-world object holds exactly one piece of music at a time? A tape deck. A record player. A CD tray.

Build the section as a single deck with a track list beside it. Selecting a track ejects whatever's loaded and feeds in the new one, with the appropriate mechanical animation. Only the selected file is ever fetched. A visit costs one track instead of six.

The delightful solution *is* the performance solution. That isn't luck — it happened because the metaphor was chosen to fit the constraint. A deck holds one tape; that's true of decks and true of bandwidth.

**Other constraint-to-metaphor conversions worth knowing:**

| Constraint | Metaphor |
|---|---|
| Can't load everything at once | A device that holds one item |
| Long list must be chunked | A card catalogue, a filing drawer |
| Rate limit or quota | An energy meter, fuel gauge |
| Slow operation | A machine visibly working |
| Empty state before data exists | A blank form, an unexposed frame |

When you hit a technical wall, spend ten minutes asking whether a metaphor could make that wall feel intentional. Sometimes there isn't one. When there is, it's the best design work you'll do on the project.

## Law 3: Effects serve content, never compete with it

**Any visual effect that sits between the reader and the words is a bug, no matter how good it looks.**

This is the law most often broken, because effects are fun to build and the damage is easy to rationalise.

Worked example. Suppose you want a site to feel like it's being displayed on an old CRT monitor. The obvious implementation is a fixed overlay across the whole viewport containing scanlines — thin dark horizontal stripes every few pixels — plus a subtle red/green/blue vertical stripe pattern simulating an aperture grille, plus a vignette darkening the corners.

Build that and it looks fantastic on a title screen full of large display type. Then you scroll to a paragraph of 16px body text and discover it's become difficult to read. Thin black lines are landing directly across the letterforms. Colour fringing is smearing the edges of glyphs. The effect is subtracting light from exactly the elements that need contrast most.

The instinctive fix is to turn the opacity down until reading is tolerable. This is the wrong fix — you end up with an effect too weak to be worth having and text still slightly worse than plain.

**The correct fix is architectural: move the texture behind the content instead of over it.**

Rather than one overlay above everything, apply the same scanline pattern as a *background layer* on each surface — the page background, panels, cards, the header, the footer. The texture is now underneath the text. Glyphs render on top of it at full contrast, perfectly sharp, while every surface still visibly carries the pattern. The effect survives at full strength; the readability problem disappears entirely.

Keep in the top overlay only the things that don't touch legibility: a vignette, a slow-moving brightness band, an ambient glow.

The specific rule: **never place an effect layer above type.** Above photographs and artwork, fine — images have no legibility to lose. Above large display type on a splash screen, fine — that's where the effect earns its keep. Above paragraphs, never.

The general rule is more valuable. When you find yourself trading delight against usability, **check whether the trade is real or just an artifact of how you built it.** "Readable or atmospheric, pick one" felt like a genuine dilemma in that example and was actually a false choice the whole time. Most such dilemmas are. Before you compromise, try restructuring.

---

# Part II — Where delight comes from

## The medium principle

**The interface should demonstrate the craft it is selling.**

This is the single strongest idea available to anyone building a portfolio or a tool, and it's routinely missed.

If someone sells sound design, the interface should sound like they made it. Every click, hover, page change and confirmation is then a live demonstration of the work, reaching every visitor regardless of whether they open a single project. That's *ambient proof* — nobody has to choose to experience it, and it's far more persuasive than a showreel, because a showreel requires a decision to press play.

The same logic applies across disciplines:

- A motion designer's site should move like they made it — not more, but better
- A writer's interface copy, error messages and empty states should be worth reading before the portfolio starts
- An illustrator's 404 page, loading state and empty states should all be drawings
- A typographer's site is judged entirely on its own type before anyone reads a word about them

The corollary is harsh and worth stating plainly: **if the interface is generic, it is evidence against the work.** A sound designer with a silent website is making a quiet argument that sound isn't the first thing they think about. A motion designer with default transitions has already answered the question. Visitors read this instantly and mostly unconsciously.

**Where to apply it:** find the surfaces every visitor touches no matter why they came. Navigation. Hover. Page transitions. Loading. Empty states. Errors. The 404. Those are the places where craft becomes unavoidable rather than optional.

## Detail that rewards noticing

The distinction that governs whether small details help or hurt:

**Detail that *demands* noticing taxes everyone to impress a few.** Autoplaying video, a mandatory intro, a cursor trail that follows every movement, a scroll-jacking narrative. Everyone pays; some enjoy it.

**Detail that *rewards* noticing costs nothing to those who miss it.** Nobody pays; some are charmed.

Optimise ruthlessly for the second kind. Examples, each explained in full:

**A logo that responds to state.** Suppose a site's logo mark is four small vertical bars — a stylised level meter. Ordinarily they sit still at fixed heights, reading as an abstract shape. Whenever the site is playing audio — any player anywhere on the page — the bars animate. Most visitors never register it. Anyone who notices gets a small, private "oh, that's nice," and the mark retroactively means something.

**Mechanics that are actually correct.** If you render a cassette tape with two reels, get the physics right: the supply reel starts full and empties while the take-up reel fills, and because tape moves at a constant speed, *the smaller reel spins faster*. Almost nobody will consciously notice this. But anyone who has handled a cassette will feel that it's right without being able to say why — and would have felt that something was wrong if you'd animated both reels identically. Correct mechanics are invisible; incorrect mechanics are quietly disquieting.

**Content that responds to context.** An avatar that changes based on the visitor's local time of day — alert during working hours, tired late at night. A single visitor sees one version and thinks nothing of it. A returning visitor at a different hour gets a small surprise.

**One caveat.** A detail nobody can possibly discover is a detail that mostly doesn't exist. The time-of-day avatar above will be invisible to most people forever. That's a fine trade when the detail costs an hour. If a detail is expensive, it needs a breadcrumb — something that hints there's more here than you've seen.

## Borrowed memory: physical metaphors

Skeuomorphism earned its bad reputation from leather stitching and green felt applied as surface decoration. That's not what this is.

**The technique that works is borrowing a memory, not simulating a material.**

When you render an object your audience has physically handled — a cassette, a Polaroid, an arcade cabinet, a filing card, a light switch — you're not decorating. You're recruiting everything they already know about how that object behaves. They know its weight, its sounds, what happens when you operate it. You get all of that for free, and it makes the interface feel immediately legible.

Three rules make this work:

**Pick an object the audience has actually held.** Generational specificity matters. A cassette works for anyone over about thirty and is still legible to those under it. A floppy disk has become pure icon — nobody under thirty-five has handled one, so you get the symbol without the memory. Know which you're getting.

**Get the mechanics right.** Wrong mechanics are worse than no metaphor, because you've invoked a memory and then contradicted it. If it's a deck, it holds one tape. If it's a switch, it has two states and it makes a sound. If it's paper, it doesn't glow.

**Let it do real work.** This is Law 2 again. The metaphor should carry a functional load — the deck that holds one item because you can only load one item, the card catalogue that paginates because pagination was necessary. Metaphor as pure costume is the decoration that gets deleted.

---

# Part III — Progress and collection systems

Achievements deserve their own section, because they are the single most effective mechanism available for turning a passive visit into an active one, and because they're easy to get wrong in ways that feel cheap.

## What they actually do

**An achievement system converts browsing into playing.**

A visitor who intended to skim one page now has a reason to open a second. That's it. That's the mechanism. Everything else is implementation.

The reason it isn't manipulative — when done correctly — is that the reward for exploring is *seeing more of the actual work*. You're not paying someone in points to waste their time. You're giving them a reason to do the thing that was already in both your interests.

This gives you the test for whether achievements belong on a project at all:

**Do the achievements reward things you'd want a visitor to do anyway?**

Good: visiting each section of a portfolio. Listening to a piece of work long enough to actually judge it. Following a link through to a real shipped project. Getting in touch. Trying the tool's core feature. Coming back a second time.

Bad: scrolling to the bottom. Clicking something fifty times. Waiting. Anything whose only purpose is to be an achievement. The moment a system rewards grinding, it has stopped being delight and become a slot machine — and visitors detect this instantly.

## The mechanics that matter

**Store progress in localStorage, not cookies.** This is worth being emphatic about. Cookies are transmitted to the server, which drags in consent banners, privacy policy obligations, and a legal surface — for a feature that is purely local decoration. localStorage never leaves the browser, needs no disclosure, and persists across sessions. There is no upside to cookies here.

**Show locked entries as `???` rather than hiding them.** This is the highest-leverage detail in the entire system, and it's frequently got wrong.

An achievement the visitor cannot see creates nothing. A visible slot reading `???` creates pull. The difference is that the visitor now knows there are twenty-one things, knows they have twelve, and knows nine specific unknowns exist. **Mystery only works when you can see its outline.** An unknown unknown is not intriguing; it's absent.

**Use three surfaces, each doing a different job:**

| Surface | Job |
|---|---|
| A toast at the moment of unlock | The reward itself — brief, celebratory, non-blocking |
| A persistent counter in the header | Glanceable state; the reminder the system exists |
| A dedicated list or "trophy room" | The destination, where the `???`s do their work |

Any one alone is weaker than all three. A toast without a list is a firework with nothing behind it. A list without toasts means most visitors never discover the system exists at all.

**Fire awards from the thing itself, not from a central watcher.** The "listened to something" award belongs inside the audio player's play handler. The "visited a section" award belongs in the router. This keeps the system honest — an achievement can only fire if the event genuinely happened — and it keeps the logic next to the thing it describes.

## The completion trap

Here is a mistake that is easy to make and hard to notice.

Suppose a portfolio has twenty-one achievements, and two of them are: *visit the site between midnight and 5am*, and *send the owner a message*. Both are individually reasonable — one is a gentle reason to return, one is a conversion nudge.

But if there's also a "100%" achievement for earning all the others, those two have just made completion nearly impossible. Almost nobody will be awake at 3am on your site, and only a fraction will ever send a message. You have built a completion meter that essentially cannot be filled, and you may not realise it until someone asks why.

**Decide deliberately whether 100% is reachable.** There are three honest designs. Pick one on purpose:

1. **Fully reachable in one sitting.** The site is short, everyone who engages completes it, completion is the intended experience.
2. **A reachable core plus a collector's set.** "100%" means "explored everything," with time-gated or long-tail extras tracked separately and excluded from the total.
3. **Genuinely hard.** Completion is a real achievement for dedicated visitors. Fine — as long as that's the intent.

What's not fine is drifting into option 3 accidentally and wondering why the completion rate is zero.

## Writing the list is a content audit

The most valuable and least expected benefit:

**Enumerating achievements forces you to articulate what the site is for.**

Sitting down to write fifteen or twenty of them means answering "what do I actually want someone to do here?" fifteen or twenty times, concretely, with no room for vagueness. In practice:

- Some answers are obvious and confirm what you already built
- Some are clarifying — for example, realising that "played a clip" is a worthless goal for an audio portfolio, because a four-second sample proves nothing, and what you actually want is *thirty continuous seconds of listening*
- Some only appear because the list demanded them — an achievement for following a link through to a real shipped project might reveal that the site wasn't surfacing that social proof anywhere

**Do this exercise early on any project, even if you never build the system.** It's a free, rigorous content audit disguised as a game mechanic. The list you produce is a specification for what the site should make easy.

## Naming

Names carry most of the charm and cost nothing.

**Name the moment, not the metric.** An achievement for clicking the logo five times called `STOP THAT` is funny. The same achievement called `LOGO CLICKER` is not. The name should describe the little scene that just occurred.

**Make the description a second joke or a real explanation — never a restatement.** If the name is `NIGHT SHIFT`, the description must not be "visited at night." That's a wasted line. Either extend the joke or say something the visitor didn't know.

**Keep them short.** These are read in a toast that appears for three seconds. Two or three words.

---

# Part IV — The discipline

## Accessibility is a delight multiplier

Accessibility is not the opposite of delight, and treating it as a tax produces worse work in both directions. The two goals point the same way more often than not, and the cost is usually a few lines.

**Honour `prefers-reduced-motion`.** Motion sensitivity is common and the symptoms are real — nausea, headaches, vertigo. A site with continuous ambient animation is not delightful to those visitors; it's actively hostile. Respecting the preference means killing looping animations, parallax, and large transitions while keeping everything static that made the design good. This is a handful of CSS.

**Provide toggles for the loudest effects.** Anything ambient and unusual — sound, heavy filters, animated backgrounds — should be switchable. A visitor who finds your screen effect unbearable can turn it off instead of leaving. A toggle costs ten lines and converts an exit into a stay.

**Make keyboard navigation part of the concept.** This is where accessibility and delight fuse most satisfyingly. If a site is themed as a game console, then arrow keys moving a menu cursor, a confirm key selecting, and an escape key backing out are simultaneously an accessibility feature and *the most thematically correct interaction available*. The best accessibility work is often just the best version of the idea.

**Style your focus states.** Visible focus is required. Ugly focus is a choice. A focus ring designed to match the site reads as deliberate; a default browser outline bolted onto a considered design reads as an oversight — and tempts people to remove it, which is much worse.

**Measure contrast, don't estimate it.** Dark interfaces with tinted greys are where contrast quietly fails. A muted lavender on a dark purple panel can look fine to a designer with a good monitor in a dim room and be genuinely hard for someone else. Measure against the actual background colour. If a value lands near the minimum, raise it — "technically passing" is not a design goal, and any overlay or texture you add later will eat the margin.

## Interface sound

If a project involves sound at all, these rules apply.

**Opt-in, off by default, and remembered.** Sound that plays without being asked for is the fastest way to have a tab closed. A toggle whose state persists means a visitor who wants it gets it on every visit without asking twice.

**Build against synthesised placeholders so the mechanism ships before the assets.** Every interface sound can start as a generated tone — an oscillator with an envelope — behind a named slot. The code that plays "select" doesn't care whether "select" is a synthesised blip or a recorded file. When real audio arrives, you add a path to a manifest and the synth is bypassed. Nothing else changes.

This generalises well beyond audio: **build the mechanism against stubs so the feature is complete and waiting, rather than blocked and rotting in a branch.** A quiz game with generated placeholder sounds is a finished, playable feature. A quiz game waiting for recordings is an unfinished one.

**Master interface sounds quiet.** They layer over each other, they play unprompted, and they repeat constantly. A hover sound must survive being heard two hundred times in one session. Anything with a sharp transient or a long tail becomes torture at that repetition rate. Short, soft, and dull is correct; interesting is wrong.

**Lock sound to motion.** If an animation has an impact moment — something landing, seating, clicking home — the sound must hit on that frame. Time the animation first, then cut the audio to it. Sound divorced from motion reads as a soundboard. Sound locked to motion reads as a machine.

## Architecture that keeps delight cheap

Delight decays when it's expensive to maintain. Two structural decisions protect it.

**Put all content in one data file.** Every piece of content — projects, tracks, episodes, achievement definitions, whatever the site is made of — should live in a single structured file, separate from all markup and logic. Adding an item means editing one object.

This matters far more than it sounds. **If adding content requires editing markup, content stops getting added.** A portfolio that stops being updated stops working, and the delightful parts are the first casualties, because they're the fiddliest things to hand-edit. A data-driven site stays alive; a hand-built one calcifies.

**Make the delight data-driven too.** If achievements, minigame content, and time-based variations all read from the same file, they scale with the content instead of requiring separate work each time.

---

# Part V — Failure modes

Specific, recurring mistakes. Each is described completely, with the general rule extracted.

### An animation's end state persists

**What happens:** You animate an element revealing itself — say, wiping in from the top by animating a clip region from "fully clipped" to "not clipped." You set the animation's fill mode so the final state sticks.

Some time later you notice that outlines, glows and shadows around elements on that page are being cut off at the edges, and you have no idea why.

**Why:** A fill mode of `forwards` or `both` means the final keyframe's values stay applied *forever*, not just until the animation ends. If that final keyframe sets a clipping region — even one that appears to clip nothing, like "clip to exactly the element's own box" — then everything drawn outside the element's box is permanently cut. Outer shadows, glows, and outlines all live outside the box.

The symptom ("boxes look cut off on the left") points nowhere near the cause ("a transition animation from three files away").

**The rule:** audit what your animations leave behind. Any persisting property that constrains rendering — clipping, overflow, transforms, filters — constrains it permanently. Either avoid persisting such properties, or make the final state genuinely unconstrained.

### Low-resolution imagery with the detail in the wrong place

**What happens:** You want a portrait rendered as pixel art. You take a photograph, scale it down to a small pixel grid, and display it enlarged with smoothing disabled. The result looks wrong in a specific, uncanny way — the subject's eyes appear closed.

**Why:** It's not that the resolution is too low in principle. It's that the *crop* was wrong. If the source photo is a full frame — head, shoulders, background — then at a small pixel count most of those pixels are spent on hair, clothing and background. The eyes end up two or three pixels wide, and two or three pixels cannot represent an open eye. They average to a dark smudge, which reads as closed.

Cropping tightly to the face before downsampling redistributes the same pixel budget onto the features that carry meaning. The eyes get five or six pixels and read correctly.

**The rule:** at low resolution, spend the pixels on whatever carries the meaning. For a face, that's the eyes. Crop until the meaningful content fills the frame, *then* downsample. This applies to icons, thumbnails and favicons equally — a detailed logo shrunk to 16px becomes noise, while a cropped fragment of it stays legible.

### Non-integer scaling destroys pixel art

**What happens:** You produce a piece of pixel art and display it at a size that isn't a whole-number multiple of its native size. It looks soft and slightly wrong even with image smoothing disabled.

**Why:** At 2× or 3×, every source pixel maps onto a clean square block. At 1.5× or 1.87×, source pixels map onto fractional areas, and the renderer must blend adjacent pixels to fill them. You get a blurry photograph of pixel art rather than pixel art.

**The rule:** display size must be an exact integer multiple of source size. If you change one, change the other. Pick the display size first, then derive the source size by dividing.

### Unlabelled icon toggles

**What happens:** Two small icon buttons sit in a header controlling site-wide options. Nobody knows what they do. Worse, nobody knows what state they're currently in — an icon can suggest what a control is *about*, but it cannot express whether the thing is currently on.

A tempting fix is to move the controls into a menu where there's room for labels. On a responsive site this creates a new bug: a panel whose visibility depends on viewport width will show stale state when the window is resized, and now you're synchronising two copies of every control.

**The rule:** put the state in the label. `SOUND ON`, `SOUND OFF`, `EFFECTS ON`. Always visible, one instance, no hidden state, no synchronisation. If the header runs out of horizontal room, let it wrap to a second line — wrapping is free and hiding is not.

The general principle: **an icon can say what a control is about; only words say what it's currently doing.**

### You cannot time your own intro

**What happens:** You build an animated intro. You watch it a hundred times while building. You choose timings that feel right. You ship it, and the first real person says it went past before they understood what was happening.

**Why:** You know what it says. You know what's coming. You have zero cognitive load. A first-time visitor is simultaneously parsing an unfamiliar layout, reading unfamiliar words, and deciding whether to stay. They need several times longer than you do to process the same frame.

There's a compounding version of this: if any input skips the sequence, then a stray trackpad flick or an early keypress during page load can kill the intro before it has said anything, and the visitor never learns what happened.

**The rule:** whatever timing feels right to you, roughly double it. Watch one other person experience it once — that single observation is worth more than an hour of your own tuning. And add a short grace period at the start, before input is accepted, so accidental input during page load can't skip content the visitor never saw.

### Decoration crowding out content

**What happens:** A navigation list has, for each item, an icon, a title, a descriptive subtitle, and a count. It feels thorough. It reads as cluttered and slightly desperate.

**Why:** The subtitles were explaining items whose names already explained them. The icons were decorating labels that were already clear. Every element was individually defensible and collectively noise.

**The rule:** when a delightful element isn't landing, try removing things before adding them. Stripping a list to just names and counts often produces something that reads as confident rather than busy. Decoration that explains what's already clear is a cost with no benefit.

### The pattern across all of these

Look at the failures above and notice what they have in common. Effects placed over text. Animations leaving persistent constraints. Decoration crowding labels. An intro that didn't wait.

**Almost none of these were bad ideas. Nearly all of them were good ideas in the wrong relationship to the content.**

That's the debugging instinct worth internalising. When something delightful isn't working, your first hypothesis should not be "this idea is wrong." It should be "this idea is in the way." The fix is usually to move it, layer it differently, slow it down, or subtract from around it — not to delete it.

---

# Part VI — Practice

## The checklist

**Before building**
- [ ] What is the medium of the work, and how will the interface demonstrate it?
- [ ] Write the achievement list — fifteen to twenty — even if you never build the system. It's a content audit.
- [ ] Which technical constraint could become a metaphor?
- [ ] What is the single fastest path for a visitor in a hurry, and what is it?

**For every delightful element**
- [ ] What does it cost someone who doesn't want it?
- [ ] Can it be skipped, and is the skip discoverable within a second?
- [ ] Do deep links bypass it?
- [ ] Is it load-bearing, or is it decoration that will be deleted in two years?
- [ ] Does it degrade correctly under reduced-motion?
- [ ] Is it above the content or behind it?

**Before shipping**
- [ ] Every toggle states its current condition in words
- [ ] Contrast measured against the real background, not estimated
- [ ] Focus states styled deliberately
- [ ] Complete keyboard path through the site
- [ ] One other person watches any intro once, while you watch them
- [ ] Adding a new piece of content requires editing exactly one file
- [ ] Nothing autoplays
- [ ] Animations don't leave persistent constraints behind

## How to start on a new project

A rough order of operations that tends to work:

**1. Name the medium.** What craft is this site selling or performing? The answer determines where delight should concentrate. Everything else is downstream of this.

**2. Find the object.** Is there a physical thing the audience has handled that maps onto what the site does? A deck, a console, a catalogue, a workbench, a switchboard. If one exists, it will carry more design decisions than any amount of visual styling. If none does, don't force it — a forced metaphor is worse than none.

**3. Write the achievement list.** Twenty concrete things you want a visitor to do. This produces your information architecture as a side effect, because it forces you to say what matters.

**4. Identify the hurried path.** Someone with thirty seconds — what do they need to reach, and how fast? Build everything else around leaving that path clear.

**5. Find the constraint that wants to be a metaphor.** File sizes, load times, rate limits, pagination. Check each one for a physical analogue before solving it conventionally.

**6. Build the mechanism against stubs.** Placeholder sounds, placeholder content, placeholder art. Ship the feature complete and swap the contents later. A finished feature with stub content is infinitely more likely to launch than an unfinished feature waiting for assets.

**7. Then style it.** Visual polish is last, not first, and it's the part that matters least. A considered interaction in an ugly skin beats a beautiful skin over a thoughtless one — and you can always restyle. You can't easily retrofit consideration.

## A closing note on reuse

The most portable component in all of this is the progress system. An achievement system built correctly — definitions in a data file, a small storage wrapper, and three rendering surfaces — is entirely content-agnostic. Moving it to another project means rewriting the definitions list and nothing else.

If you build one good one, you own it forever. That makes it the cheapest possible way to add the most engaging mechanic in this document to every future project you touch.
