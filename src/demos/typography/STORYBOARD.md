# STORYBOARD — Typography Wave (18 new text animations)

A changelog spot for the **2026-06-23 "typography-wave"** entry, rebuilt in the
shipped remocn.dev cinematic register (the introducing-remocn / introducing-shadcn /
introducing-videorc house style) — replacing the old image-backdrop grid-and-montage cut.

After ~30 seconds the viewer should know: **text is most of what a demo video says, so
remocn shipped 18 new text animations — each one demonstrating itself by animating its
own name — and because they're built on `interpolate` and `spring`, not a CSS keyframe
library, they seek correctly and render identically every time.**

- **Arc:** Feature-Benefit Cascade (category hook → the wave → the effects, shown not told
  → the mechanism/benefit → ownership → one command → lockup).
- **Length:** ~30s @ 30fps, 1280×720 (montage halves are the tunable slack — trim to hit ~26s).
- **Register:** the shipped remocn brand — warm obsidian `#141318`, ink `#f2f2f2`,
  muted `rgba(242,242,242,0.62)`, one lime accent `#C3E88D`. **Manrope 400 everywhere**;
  Geist Mono 400 only for the shell command. **No letter-spacing** (default tracking on
  every headline AND on the reused outro wordmark — drop the brand's -0.03em to honor the
  constraint), sentence case, **no uppercase, no badges, no pulsing, no installation pills.**
  The command is a plain typed mono line, never a pill.
- **Visual language:** one quiet **simplex-noise** field (obsidian, a faint lime undertone)
  carries the whole video as the shared backdrop — the same single-field discipline as the
  introducing cuts. No image backdrop (the old `bg.png` is retired).
- **Signature — the product demonstrates itself:** every effect is introduced by animating
  ITS OWN NAME. `soft-blur-in` blurs the words "Soft blur in" into focus; `fade-through`
  swaps "Static text" → "Fade through"; `shared-axis-z` pushes one word back as the next
  arrives. This is story truth, not a blueprint — it is the reason the video works, and it
  is kept.
- **Typography discipline:** each line is its own scene beat — no subtitles stacked under a
  headline. The named effect always plays the line; the chrome (the small `NN / 18` counter)
  holds perfectly still while the effects change beneath it.

---

## NEW REGISTRY TRANSITION — `caret-wipe`

> The user asked for a brand-new transition to add to the registry (no swirl, no ripple —
> `swirl-dissolve` / `ripple-zoom` already exist and are explicitly out). `caret-wipe` is
> genuinely new (the registry has `terminal-cursor-zoom` and a `caret` component, but no
> caret wipe) and it is the *typographic* transition this video earns.

**What it is:** a single tall **lime caret** — the remocn text cursor, a ~3px hairline the
height of the type — sweeps across the frame on one eased pass (`Easing.inOut`, ~18–22f).
The caret IS the wipe boundary: **ahead** of its leading edge sits the incoming scene,
**behind** it the outgoing scene. In a narrow trailing band just behind the caret the
outgoing content lifts a few px and blurs out (as if *backspaced*) while the incoming
content settles down into place (as if *typed in*). One clean pass — the screen gets
retyped. Deterministic and seek-safe (pure `frame`-driven `interpolate`, no CSS keyframe).

- **Params:** `direction` = `RIGHT` (default) | `LEFT`; `caretColor` (default lime);
  `durationInFrames` (~20). Factory `caretWipe(props)` returning a `TransitionPresentation`,
  paced with `linearTiming` — same shape as every other `remocn` transition.
- **Where used:** at the montage boundaries — `caret-wipe RIGHT` types the effect montage
  in, `caret-wipe LEFT` flips between its two halves. Everywhere else stays on the restrained
  set (`crossfade`, `blur-crossfade`), so the caret reads as a signature, not a tic.
- **Step-4 note:** implement as `src/components/remocn/caret-wipe.tsx`, add to the
  transitions registry, and it becomes a reusable `@remocn/caret-wipe`.

---

## Frame 1 — The hook

- scene: bare obsidian canvas over the barely-moving simplex-noise field; one line blurs into focus and holds, then plays its own exit — the hook animates itself with the very tier it's about
- voiceover: "Text is most of what a demo video says."
- duration: 2.6s
- transition_in: cut (opening frame)
- status: outline
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Pain validation — every builder making a launch video already knows this
- beat: recognition + curiosity
- blueprint: kinetic-type-beats — a punchy claim whose motion IS the point
- asset_candidates: (typography-only)

narrativeRole: stops the scroll with a truth the audience (people shipping product videos) already agrees with — and does it by MOVING the text, planting the idea before naming it.
keyMessage: the words carry the video.

## Frame 2 — The wave

- scene: same world; the promise lands — "18 new ways to make it move" — the count is the news
- voiceover: "18 new ways to make it move."
- duration: 2.4s
- transition_in: crossfade (same world; the hook's own exit clears first)
- status: outline
- src: compositions/frames/02-wave.html
- type: product_intro
- persuasion: Value stacking — the number is the headline of the changelog
- beat: intrigue → momentum
- blueprint: kinetic-type-beats — "Introducing…" name-drop, resolving on the count
- asset_candidates: (typography-only)

narrativeRole: the message (per the story spine, landed by beat 2) — this drop is 18 text animations. Everything after is its evidence.
keyMessage: eighteen new text animations.

## Frame 3 — Ten ways to enter (entrances montage)

- scene: `caret-wipe RIGHT` types the section in; a still `01 / 18` counter appears bottom-left and holds. Then ten entrances hard-cut one into the next, EACH animating its own name: Soft blur in · Per character rise · Bottom up letters · Top down letters · Spring scale in · Micro scale fade · Mask reveal up · Line by line slide · Kinetic center build · Focus blur resolve. The montage IS the breadth argument.
- voiceover: "Ten ways to enter."
- duration: 6.5s (10 × ~18–20f, hard cuts; the counter ticks 01→10, never moving)
- transition_in: caret-wipe RIGHT (NEW registry transition — the caret types the montage in)
- status: outline
- src: compositions/frames/03-entrances.html
- type: feature_showcase
- persuasion: Show-don't-tell proof — each effect proves itself by being the label
- beat: awe + momentum
- blueprint: kinetic-type-beats — rapid-fire montage, each phrase carried by a real effect
- asset_candidates: (each effect is live remocn typography, no captured assets)

narrativeRole: the centerpiece — the entrances demonstrate themselves; the counter makes the breadth countable.
keyMessage: ten distinct entrances, each self-evident.

## Frame 4 — Eight ways to leave, or swap (exits & swaps montage)

- scene: `caret-wipe LEFT` flips the montage (the reversed sweep reads as a page turn); the counter continues 11→18. Eight swaps demonstrate themselves — Blur out up · Scale down fade · Fade through (Static text → Fade through) · Per word crossfade · Shared axis y · Shared axis z · Short slide down · Short slide right — the swap effects ARE mini transitions, so the beat literally shows what they do.
- voiceover: "Eight ways to leave — or swap."
- duration: 5.8s (8 × ~20–22f, hard cuts)
- transition_in: caret-wipe LEFT (NEW registry transition — reversed sweep between the two halves)
- status: outline
- src: compositions/frames/04-swaps.html
- type: feature_showcase
- persuasion: Show-don't-tell proof — a swap effect showing a swap is proof by demonstration
- beat: momentum + clarity
- blueprint: kinetic-type-beats — rapid-fire montage; the swaps carry their own hand-offs
- asset_candidates: (each swap is live remocn typography, no captured assets)

narrativeRole: closes the breadth (18/18) and previews the exits/swaps a real edit needs.
keyMessage: exits and swaps, shown by doing.

## Frame 5 — The mechanism

- scene: back in the calm world; the technical differentiator lands as one line — cued so "interpolate" and "spring" arrive as separate beats
- voiceover: "No CSS keyframes — just interpolate and spring."
- duration: 3.0s
- transition_in: blur-crossfade (dissolve out of the fast montage; backgrounds settle)
- status: outline
- src: compositions/frames/05-mechanism.html
- type: benefit_highlight
- persuasion: Feature-to-benefit translation — why these are different from a CSS library
- beat: clarity + trust
- blueprint: kinetic-type-beats — the two key terms swap into place as they're named
- asset_candidates: (typography-only)

narrativeRole: names the engine — the reason the effects behave, not just look, correctly.
keyMessage: pure Remotion math, no keyframe library.

## Frame 6 — Deterministic

- scene: one word sits pinned dead-center while a quiet mono frame-readout scrubs beneath it (`frame 12 → 40 → 71`); the type does not shift a pixel as the playhead moves — determinism made visible. Resolves on the claim.
- voiceover: "Frame 40 looks the same on every render."
- duration: 3.0s
- transition_in: crossfade (same world)
- status: outline
- src: compositions/frames/06-deterministic.html
- type: benefit_highlight
- persuasion: Show-don't-tell proof — the scrub proves seek-safety on screen
- beat: confidence
- blueprint: dataviz-countup — a scrubbing readout the eye pushes through (the number is the proof)
- asset_candidates: (typography-only; plain frame numbers, no plus suffix)

narrativeRole: turns "deterministic" from a word into something the viewer watches happen.
keyMessage: they seek correctly and render identically.

## Frame 7 — The value block

- scene: three short lines slide in one after another (line-by-line-slide) and hold together as a block in the calm world
- voiceover: "Seek-safe by default. One import each. The code is yours."
- duration: 3.2s
- transition_in: crossfade
- status: outline
- src: compositions/frames/07-values.html
- type: benefit_highlight
- persuasion: Value stacking + Risk reversal (you own the code)
- beat: confidence + peace of mind
- blueprint: grid-card-assemble — an accumulating value list
- asset_candidates: (typography-only)

narrativeRole: compresses the offer into three memorizable claims.
keyMessage: seek-safe, one import, yours.

## Frame 8 — One command

- scene: the exact effect that opened the montage is installed live — the shell command types itself in mono, alone in the center (a plain typed line, NOT a pill), landing on the caret blink
- voiceover: "npx shadcn add remocn/soft-blur-in"
- duration: 3.2s
- transition_in: crossfade (the value block clears first)
- status: outline
- src: compositions/frames/08-command.html
- type: feature_showcase
- persuasion: Friction reduction + Show-don't-tell proof — one command is the whole workflow
- beat: control + ease
- blueprint: typewriter-reveal — someone is typing this
- asset_candidates: (mono command, no captured assets)

narrativeRole: the mechanism made concrete — real source files land in your repo from one line.
keyMessage: one command installs any effect.

## Frame 9 — The lockup (reused introducing-remocn outro, new logo)

- scene: the introducing-remocn OutroScene — a smoke ring blooms open from the dark; the new **R** mark (remocn.dev/logo-mark.svg, inlined) draws its outline on while the fill catches up behind it; then "emocn" slides out from behind the mark so the R IS the word's first letter, assembling the **Remocn** wordmark; `remocn.dev` settles faint underneath. Reused verbatim, at DEFAULT tracking (drop the outro's -0.03em to honor the no-letter-spacing rule).
- voiceover: "Remocn — 18 new text animations, at remocn.dev."
- duration: 5.0s
- transition_in: blur-crossfade (the smoke ring blooms from dark — masks the background change)
- status: outline
- src: compositions/frames/09-outro.html (import IntroducingRemocn → OutroScene / RemocnMark)
- type: branding
- persuasion: Brand stamp + destination + Risk reversal (open source)
- beat: trust + inevitability
- blueprint: logo-assemble-lockup — the mark draws itself on and the wordmark completes the lockup
- asset_candidates: (new logo mark recreated inline as SVG — the RemocnMark path)

narrativeRole: the brand stamp with the new logo — name, mark, and the one place to go.
keyMessage: remocn.dev.

---

## Transition map (repeat a small set)

| Boundary | transition_in | why |
| --- | --- | --- |
| — → F1 | cut | opening frame |
| F1 → F2 | crossfade | same world; hook exits itself |
| F2 → F3 | **caret-wipe RIGHT** | section boundary — the caret types the montage in (NEW) |
| F3 → F4 | **caret-wipe LEFT** | flips between the two montage halves — reversed sweep (NEW) |
| F4 → F5 | blur-crossfade | out of the fast montage into the calm argument |
| F5 → F6 | crossfade | same world |
| F6 → F7 | crossfade | same world |
| F7 → F8 | crossfade | value block clears |
| F8 → F9 | blur-crossfade | smoke-ring bloom from dark |

Internal montage cuts (inside F3/F4) are hard cuts — the effects' own entrances/swaps carry every hand-off.

---

## Music

- music: confident minimal tech underscore — soft pulse under the montage, settling to a warm pad on the outro.
- No spoken VO track: this is a page video (changelog), text-driven like the introducing cuts.
  `SCRIPT.md` holds the locked on-screen copy; the effects reveal each line as it is named.

## Final checklist

- Arc named (Feature-Benefit Cascade); sequence is narrative-driven, not the old grid order.
- One hook that creates recognition/curiosity; the message (18 animations) lands by beat 2.
- Each beat has one job and a `type` / `persuasion` / `beat`.
- Signature self-demonstration kept as story truth (effects name themselves); not bent to a blueprint.
- Shapes vary (kinetic-type, rapid-fire montage, dataviz scrub, accumulating list, typewriter, logo-lockup).
- Constraints honored: no letter-spacing, no uppercase, no badges, no pulsing, no install pills.
- No swirl / ripple transitions; the NEW `caret-wipe` is defined for the registry and used at the montage boundaries.
- Outro is the reused introducing-remocn lockup with the new logo.
