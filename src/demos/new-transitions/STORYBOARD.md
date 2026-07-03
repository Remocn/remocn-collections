# STORYBOARD — remocn update: eleven new transitions

Changelog/announcement video for the remocn X account. The update: eleven new
transition presentations for `@remotion/transitions` landed in the registry —
three pure-CSS camera moves (whip-pan, push-through, focus-pull) and eight
shader dissolves built on Paper's shaders (dither, wave, grain, ripple, warp,
perlin, smoke, swirl). The video's core idea is **self-demonstration**: after
the announcement beat, every scene change in the video IS one of the eleven
new components, each labeled by the beat it brings in. Before the announcement
the cuts are deliberately plain — that contrast is the argument.

- **Arc:** Feature-Benefit Cascade (category hook → the cascade IS the showcase → climax → CTA)
- **Length:** ~52s @ 30fps, 1280×720
- **Register:** the shipped remocn.dev brand — warm obsidian `#141318`, ink
  `#f2f2f2`, one lime accent `#C3E88D`, Manrope at font-weight 400. No
  letter-spacing on added text, no uppercase, no badges, no pills; mono only
  for the shell command.
- **Visual language:** each showcase beat is a still, quiet frame — only the
  component name, capitalized without the hyphen ("Whip Pan"), static, with a
  slow scale drift. ALL motion in the showcase belongs to the transitions
  themselves; the cut is the animation. Shader transition palettes stay in the brand
  family (obsidian back, `#8f88ae` purple family), with lime reserved for
  the dither and swirl statements.
- **Typography discipline:** remocn text animations carry the spoken beats —
  scale-down-fade (solo pain lines), short-slide-right (the announcement
  gliding in), line-by-line-slide (the value block), kinetic-center-build
  (the install headline). Showcase labels are static by design (the
  transition docs recommend static incoming content).

---

## Frame 1 — Pain, two cuts

- scene: bare obsidian canvas; two lines land solo, one after the other, each settling in and lifting away — the world before the update, where nothing moves between scenes
- voiceover: "Everyone animates their scenes." / "Nobody animates the cut."
- duration: 3.3s
- transition_in: cut (opening frame)
- status: locked
- src: NewTransitionsDemo → HookScene
- type: hook
- persuasion: Pain validation
- beat: recognition + tension
- blueprint: kinetic-type-beats — pain lands alone on a bare canvas
- asset_candidates: (typography-only)

narrativeRole: names the blind spot every Remotion builder has — scene motion is
polished, scene CHANGES are plain. The video's own next cut proves it.
keyMessage: the cut is the forgotten animation.

## Frame 2 — The announcement

- scene: "Introducing Remocn transitions" glides in from the left and holds alone — the following cuts make the promise themselves
- voiceover: "Introducing Remocn transitions."
- duration: 3.7s
- transition_in: crossfade (deliberately plain — the last boring cut in the video)
- status: locked
- src: NewTransitionsDemo → IntroScene
- type: product_intro
- persuasion: Show-don't-tell setup (a meta promise the video immediately keeps)
- beat: intrigue + anticipation
- blueprint: kinetic-type-beats — "Introducing…" name-drop
- asset_candidates: (typography-only)

narrativeRole: the turn — names the update and arms the viewer to watch the cuts.
keyMessage: eleven new transitions, demonstrated live.

## Frames 3–13 — The showcase (silent, one beat per component)

Each beat: only the component's name in Manrope 400, capitalized ("Whip Pan"),
static; the beat ENTERS through the very transition it names. Ordered from the
fast camera moves into the long shader dissolves, ending on the statement move.

| # | Frame | transition_in (the component itself) | timing |
|---|---|---|---|
| 3 | Whip Pan | whip-pan, left, 26f | 3.1s |
| 4 | Push Through | push-through, 40f | 3.7s |
| 5 | Focus Pull | focus-pull, 46f | 3.7s |
| 6 | Dither Dissolve | dither-dissolve (lime), 40f | 4.1s |
| 7 | Wave Wipe | wave-wipe, 56f | 4.8s |
| 8 | Grain Dissolve | grain-dissolve, 66f | 5.5s |
| 9 | Ripple Zoom | ripple-zoom, 76f | 5.5s |
| 10 | Warp Dissolve | warp-dissolve, 66f | 5.9s |
| 11 | Perlin Dissolve | perlin-dissolve, 90f | 6.7s |
| 12 | Smoke Dissolve | smoke-dissolve, 90f | 7.0s |
| 13 | Swirl Dissolve | swirl-dissolve (lime bands), 100f | 6.0s |

- voiceover: (silent — the names on screen are the copy)
- status: locked
- src: NewTransitionsDemo → ShowcaseScene ×11
- type: feature_showcase
- persuasion: Show-don't-tell proof — the component ships its own demo
- beat: curiosity → awe, escalating with the dissolves
- blueprint: (none — the transition is the shot; no bank shape applies)
- asset_candidates: (shader/CSS-rendered, no captured assets)

narrativeRole: the cascade — eleven proofs in a row, each cut doing exactly what
its label claims. The ripple-zoom beat sits on a transparent frame so the dolly
lands on the ripple field per the component contract; swirl-dissolve closes the
run as the one-per-video statement move.
keyMessage: every one of these cuts is now a component.

## Frame 14 — The value block

- scene: back in the calm obsidian world; three short lines slide in and hold as a block
- voiceover: "Eleven new transitions." / "Frame-driven — deterministic on every render." / "Each one lands in your repo."
- duration: 3.3s
- transition_in: focus-pull (reused — the new cuts are now the video's everyday grammar)
- status: locked
- src: NewTransitionsDemo → ValueScene
- type: benefit_highlight
- persuasion: Feature-to-benefit translation
- beat: confidence + control
- blueprint: grid-card-assemble — an accumulating value list
- asset_candidates: (typography-only)

narrativeRole: compresses the update into three memorizable claims; the reuse of
focus-pull quietly proves these are workhorse cuts, not one-off effects.
keyMessage: deterministic, drop-in, yours.

## Frame 15 — The command

- scene: "Any cut, one command" rises in word by word through a blur; the shell command resolves below in mono
- voiceover: "Any cut, one command." / "npx shadcn add @remocn/whip-pan"
- duration: 2.9s
- transition_in: whip-pan up (reused — a working cut, new direction)
- status: locked
- src: NewTransitionsDemo → InstallScene
- type: cta
- persuasion: Friction reduction
- beat: ease + urgency-to-act
- blueprint: kinetic-type-beats — punchy closing line beat-by-beat
- asset_candidates: (mono command, no captured assets)

narrativeRole: the mechanism — the whole workflow is one typed command.
keyMessage: one command installs any of the eleven.

## Frame 16 — Lockup

- scene: the camera physically lands on the brand — the remocn mark springs in, the wordmark settles beside it, remocn.dev resolves underneath
- voiceover: "Remocn — remocn.dev."
- duration: 4.3s
- transition_in: push-through (reused — the climactic arrival the component docs prescribe for CTA scenes)
- status: locked
- src: NewTransitionsDemo → OutroScene
- type: branding
- persuasion: Destination + risk reversal (open source)
- beat: trust + inevitability
- blueprint: logo-assemble-lockup — elements clear, the lockup draws itself in
- asset_candidates: assets/remocn-logo.svg — the real brand mark from remocn.dev

narrativeRole: the brand stamp — name, mark, and the one place to go.
keyMessage: remocn.dev.
