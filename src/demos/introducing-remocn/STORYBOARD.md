# STORYBOARD — Introducing remocn (shaders cut)

First post on the remocn X/Twitter account. The viewer has never heard of the project;
after 23 seconds they should know: **remocn is shadcn/ui, but for video** — copy-paste
Remotion components you install with one command and own forever.

- **Arc:** BAB (before → bridge/product → mechanism → breadth → proof → CTA)
- **Length:** ~26s @ 30fps, 1280×720
- **Register:** warm obsidian `#141318`, ink `#f2f2f2`, one lime accent `#C3E88D`,
  Manrope 600 headings — the shipped remocn.dev brand, not the DESIGN.md aspiration.
- **Visual language:** one quiet simplex-noise field carries the whole video as the
  shared backdrop; scene changes are shader covers (swirl, lime dither) that fade in,
  hold fully opaque for ~500ms so the shader is READ, then fade out — the library
  demonstrates itself.
- **Typography discipline:** each remocn text animation appears where its motion
  matches the message — scale-down-fade (solo pain statements), short-slide-right
  (the name gliding in), kinetic-center-build (the positioning assembling word by
  word), line-by-line-slide (the accumulating value list). No letter-spacing,
  no uppercase, no badges, no pills; mono only for the shell command.

---

## Frame 1 — Pain, first cut

- scene: bare obsidian canvas over a barely-moving perlin-noise field; one line lands solo, settles, lifts away
- voiceover: "Every launch needs a video."
- duration: 2.0s
- transition_in: cut (opening frame)
- status: locked
- src: IntroducingRemocnDemo → PainAScene
- type: hook
- persuasion: Pain validation
- beat: recognition + tension
- blueprint: kinetic-type-beats — pain lands alone on a bare canvas
- asset_candidates: (typography-only)

narrativeRole: stops the scroll with a truth every builder already agrees with.
keyMessage: you need a launch video.

## Frame 2 — Pain, second cut

- scene: same world; the second line lands solo via the same settle-in — the escalation is the rhythm
- voiceover: "Yours shouldn't take a week."
- duration: 2.0s
- transition_in: crossfade (same visual world; scale-down-fade's own exit does the work)
- status: locked
- src: IntroducingRemocnDemo → PainBScene
- type: pain_point
- persuasion: Pain agitation
- beat: frustration → curiosity
- blueprint: kinetic-type-beats — pain lands alone on a bare canvas
- asset_candidates: (typography-only)

narrativeRole: names the real cost — time — and sets up the promise.
keyMessage: making one is too slow today.

## Frame 3 — Meet Remocn

- scene: the swirl cover fades in over the pain as its dark twist=1 field, unwinds 1 → 0 into fully open lime-banded rays, holds there for 500ms, then winds back 0 → 1 — and synchronized with the wind-back, "Meet Remocn" resolves on top through scale + blur
- voiceover: "Meet Remocn."
- duration: 3.7s
- transition_in: zoom-through (implemented as a shader-swirl cover: twist 1 → 0 → 500ms hold → 0 → 1, incoming text scale+blur reveal riding the wind-back)
- status: locked
- src: IntroducingRemocnDemo → MeetScene
- type: product_intro
- persuasion: Category naming
- beat: relief + intrigue
- blueprint: kinetic-type-beats — "Introducing…" name-drop
- asset_candidates: (typography-only)

narrativeRole: the turn — the name lands on its own, nothing competing. The
wordmark is always written "Remocn", regular weight (400).
keyMessage: Remocn.

## Frame 3b — The tagline

- scene: its own typographic beat — the category line settles in the center via a calm scale-down fade, then lifts away
- voiceover: "Cinematic video components for React."
- duration: 2.5s
- transition_in: crossfade (same visual world as the name)
- status: locked
- src: IntroducingRemocnDemo → TaglineScene
- type: product_intro
- persuasion: Category naming
- beat: clarity
- blueprint: titlecard-reveal — the calm value beat
- asset_candidates: (typography-only)

narrativeRole: tells the viewer what the name they just met actually is.
keyMessage: cinematic video components for React.

## Frame 4 — The positioning

- scene: "Like shadcn/ui, for video" builds word by word in the center — each new word pushes the line open, the mental model assembling exactly like the library does
- voiceover: "It works like shadcn/ui — just for video."
- duration: 2.6s
- transition_in: blur-crossfade (implemented as a dithering-shader dissolve — the frame dissolves through lime pixels)
- status: locked
- src: IntroducingRemocnDemo → PositioningScene
- type: product_intro
- persuasion: Anchoring to a known mental model
- beat: clarity
- blueprint: kinetic-type-beats — the words ARE the motion
- asset_candidates: (typography-only)

narrativeRole: one sentence that transfers everything the viewer knows about shadcn onto remocn.
keyMessage: the workflow is identical — just for video.

## Frame 5 — The registry montage

- scene: six fullscreen shaders hard-cut one into the next, each carrying a category label and its muted count — Text animations 31 / Transitions 6 / Backgrounds 3 / UI blocks 6 / UI primitives 46 / Shaders 18. The montage IS the breadth argument.
- voiceover: "Text animations, transitions, backgrounds, UI blocks, primitives — and shaders."
- duration: 5.2s (6 × 26f, hard cuts)
- transition_in: cut (the montage announces itself)
- status: locked
- src: IntroducingRemocnDemo → RegistryScene
- type: feature_showcase
- persuasion: Value stacking
- beat: awe + momentum
- blueprint: kinetic-type-beats — rapid-fire value montage
- asset_candidates: (shader-rendered, no captured assets)

narrativeRole: proves "a registry of motion" visually — six worlds in five seconds.
keyMessage: it covers everything a product video needs.

## Frame 6 — The numbers

- scene: back in the calm obsidian world; three short lines slide in one after another and hold as a block
- voiceover: "110-plus components. One command. The code is yours."
- duration: 3.1s
- transition_in: blur-crossfade (dithering-shader dissolve out of the montage)
- status: locked
- src: IntroducingRemocnDemo → ValueScene
- type: benefit_highlight
- persuasion: Feature-to-benefit translation
- beat: confidence
- blueprint: grid-card-assemble — an accumulating value list
- asset_candidates: (typography-only)

narrativeRole: compresses the offer into three memorizable claims.
keyMessage: 110+ components, one command, you own the code.

## Frame 7a — It lands in your repo

- scene: the claim alone — the headline glides in via short-slide-right, holds, then plays its own exit
- voiceover: "It lands in your repo."
- duration: 2.3s
- transition_in: crossfade (same visual world)
- status: locked
- src: IntroducingRemocnDemo → InstallTitleScene
- type: feature_showcase
- persuasion: Friction reduction
- beat: ease
- blueprint: titlecard-reveal — the calm value beat
- asset_candidates: (typography-only)

narrativeRole: sets up the proof the next beat delivers.
keyMessage: the code ends up in your project.

## Frame 7b — The command

- scene: the exact component the viewer just watched (kinetic-center-build) is installed live — the shell command types itself in mono, alone in the center
- voiceover: "npx shadcn add — that's the whole workflow."
- duration: 3.2s
- transition_in: cut (the title exits itself first — no overlap)
- status: locked
- src: IntroducingRemocnDemo → InstallCmdScene
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: control
- blueprint: typewriter-reveal — someone is typing this
- asset_candidates: (mono command, no captured assets)

narrativeRole: the mechanism made concrete — one typed command is the whole workflow.
keyMessage: one command puts real source files in your project.

## Frame 8 — Lockup and CTA

- scene: a smoke ring blooms open from the dark; inside it the inverted play-bars mark pops in, the lowercase wordmark settles beside it, and remocn.dev resolves underneath
- voiceover: "remocn. Open source — at remocn.dev."
- duration: 5.0s
- transition_in: blur-crossfade
- status: locked
- src: IntroducingRemocnDemo → OutroScene
- type: cta
- persuasion: Risk reversal (open source) + destination
- beat: trust + inevitability
- blueprint: logo-assemble-lockup — elements clear, the lockup draws itself in
- asset_candidates: (logo mark recreated inline as SVG)

narrativeRole: the brand stamp — name, mark, and the one place to go.
keyMessage: remocn.dev.
