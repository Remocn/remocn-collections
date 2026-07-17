# STORYBOARD — remocn/ui arrives (changelog cut)

The changelog video for the 2026-06-12 entry "remocn/ui arrives" — made to live at the top of
that changelog page. The viewer already knows remocn; after ~40 seconds they should know:
**real components animate against the clock and a video only has a frame number — remocn/ui is
the same shapes with a steps API, and you just watched it act on camera.**

## Product truth (from `remocn/content/changelog/2026-06-12-remocn-ui.mdx` + `/docs/ui/concepts`)

- **Audience** — developers already building product videos with remocn / Remotion; changelog readers.
- **Pain / desire** — every product demo eventually has to show the product (a dialog opening, a
  command menu filtering, a form being filled), and real shadcn components can't do it: they
  animate against wall-clock time, and a video has no clock — only a frame number.
- **Promise** — the same shapes, driven by the timeline.
- **Product role** — remocn/ui: a parallel set of ~40 primitives with a steps API — you describe
  the steps; the component renders whichever one the current frame belongs to.
- **Proof** — a live steps array driving a real Button through its states; a command menu opening,
  filtering, and landing on cue; the breadth montage; assembled flows; deterministic renders.
- **CTA** — `npx shadcn add @remocn/command-menu` → the changelog page itself carries the docs links.

## Arc

**PAS with a demo-loop core** — hook (the un-fakeable shot) → pain (the clock) → product intro →
mechanism (the steps API, the whole idea) → demo run (command menu, multi-beat, one surface) →
breadth → value → install → outro. The video's job on a changelog page is *show it working*, so
the middle is remocn/ui acting on camera, not claims about it.

## Register & rules

- **Length:** ~42s @ 30fps, 1280×720.
- **Brand:** warm obsidian `#141318`, ink `#f2f2f2`, one lime accent `#C3E88D` — the shipped
  remocn.dev register. Manrope 400 for every spoken headline; Geist Mono only for the steps
  array, the frame counter, and the shell command. The UI primitive surfaces keep the product's
  own sans (Inter bound to `--font-geist-sans` inside those scenes only).
- **Anti-slop:** no letter-spacing on any authored text, no uppercase, no badges, no pills,
  no pulsing, no installation pills. The outro wordmark keeps its inherited brand tracking only.
- **Backdrop:** one quiet simplex-noise field (the introducing-remocn family — this is the same
  brand world, one release later) behind a vignette scrim, carrying the whole video.
- **Transitions:** NO swirl, NO ripple. The statement cover is a NEW registry transition,
  **skeleton-swap** — the cut is a loading state: the outgoing scene collapses into skeleton
  placeholder blocks (remocn/ui's own skeleton shapes), one shimmer sweeps across them, and the
  blocks hydrate into the incoming scene. The library's newest tier supplies the video's own cut.
  Everything else is crossfade, hard cuts into self-exiting scenes, and one blur-crossfade family.

---

## Frame 1 — The un-fakeable shot

- scene: bare obsidian canvas; three short needs swap in one center slot, one per beat — "A dialog opening" → "A menu filtering" → "A form filling itself" — then the claim lands beneath the last swap: "Every demo has to show the product"
- voiceover: "A dialog opening. A menu filtering. A form filling itself. Every demo has to show the product."
- duration: 4.5
- transition_in: cut
- status: outline
- src: RemocnUiDemo → HookScene
- type: hook
- persuasion: Pain validation — the three shots every launch video needs
- beat: recognition + tension
- blueprint: ticker-takeover — options cycle on one swapping slot, then the claim crashes in
- asset_candidates: (typography-only)

narrativeRole: names the exact shots the viewer has tried to make, before naming why they fail.
keyMessage: sooner or later the video has to show real UI moving.

## Frame 2 — The clock

- scene: two pain lines land solo on the bare canvas, each settling and lifting away — the changelog entry's own argument, split at its hinge
- voiceover: "Real components run on the clock. A video only has a frame number."
- duration: 4
- transition_in: crossfade
- status: outline
- src: RemocnUiDemo → PainScene
- type: pain_point
- persuasion: Mechanism-level pain — not "it's hard", but *why* it cannot work
- beat: frustration → curiosity
- blueprint: kinetic-type-beats — pain lands alone on a bare canvas
- asset_candidates: (typography-only)

narrativeRole: the technical truth that makes remocn/ui inevitable rather than nice-to-have.
keyMessage: wall-clock animation and frame-driven rendering are different physics.

## Frame 3 — Meet remocn/ui

- scene: the skeleton-swap cover debuts — the pain line collapses into skeleton placeholder blocks, one shimmer crosses them, and they hydrate into the name landing alone: "Meet remocn/ui". The scene plays its own exit so the tagline gets an empty canvas.
- voiceover: "Meet remocn/ui."
- duration: 2.8
- transition_in: zoom-through (implemented as the NEW skeleton-swap cover — the cut is a loading state)
- status: outline
- src: RemocnUiDemo → MeetScene
- type: product_intro
- persuasion: Category naming
- beat: relief + intrigue
- blueprint: kinetic-type-beats — "Introducing…" name-drop
- asset_candidates: remocn/skeleton-swap (new transition, debuting here)

narrativeRole: the turn — and the transition itself is the first proof (skeletons are a remocn/ui shape).
keyMessage: remocn/ui.

## Frame 3b — The tagline

- scene: its own typographic beat — the positioning line glides in from the left and holds alone
- voiceover: "The same shapes, driven by the timeline."
- duration: 2.5
- transition_in: cut (the name plays its own exit first — empty canvas handoff)
- status: outline
- src: RemocnUiDemo → TaglineScene
- type: product_intro
- persuasion: Anchoring — shadcn shapes the viewer knows, one changed axis
- beat: clarity
- blueprint: titlecard-reveal — the calm value beat
- asset_candidates: (typography-only)

narrativeRole: compresses the whole release into eight words.
keyMessage: same shapes, new clock.

## Frame 4 — The steps API

- scene: the spine of the video, one held shot — a mono steps array reveals line by line on the left (`useButtonTransition([{ at: 20, state: "hover" }, …])`) while a REAL remocn/ui Button on the right walks the exact states as the playhead passes each `at`: hover, press, loading, success. A small mono frame counter ticks beneath the code — the frame number the pain beat promised, now doing the driving.
- voiceover: "Describe the steps — hover, press, loading, success. The component renders whichever one the frame belongs to."
- duration: 7.5
- transition_in: blur-crossfade
- status: outline
- src: RemocnUiDemo → StepsScene
- type: feature_showcase
- persuasion: Show-don't-tell proof — code and consequence in the same shot
- beat: clarity + control
- blueprint: comparison-split — code on the left, the component obeying it on the right
- asset_candidates: remocn/button + use-button-transition (live); mono steps array; mono frame counter

narrativeRole: teaches the entire mental model in one shot — the steps API is the whole idea.
keyMessage: you write `{ at, state }`; the frame does the rest.

## Frame 5 — The command menu run

- scene: the changelog page's own hero surface, acted out — the command menu springs open on a beat, the query types itself ("pub") and the list filters live with every character, the highlight settles on "Publish changes", a press lands it, the menu closes — and a success toast slides in: the shot from Frame 1 that couldn't be faked, made.
- voiceover: "It opens on the frame you name. Filters as the query types. And lands exactly where you said."
- duration: 7
- transition_in: crossfade
- status: outline
- src: RemocnUiDemo → CommandMenuScene
- type: feature_showcase
- persuasion: Show-don't-tell proof — the hook's impossible shot, delivered
- beat: control → satisfaction
- blueprint: device-surface-showcase — the surface is the hero and its states advance through a flow
- asset_candidates: remocn/command-menu + use-command-menu-transition (vendored from the registry); remocn/toast

narrativeRole: pays off the hook on the same surface the changelog page embeds.
keyMessage: open → filter → select — all of it authored in frames.

## Frame 6 — The breadth montage

- scene: five primitives hard-cut on a beat, each performing its one action live with its mono name beneath — checkbox checks, switch flips, tabs slide their indicator, select opens over its items, toast slides in. Real components, no illustrations.
- voiceover: "Around forty primitives — every shape a demo needs."
- duration: 5.5
- transition_in: zoom-through (skeleton-swap again — the montage loads in)
- status: outline
- src: RemocnUiDemo → BreadthScene
- type: feature_showcase
- persuasion: Value stacking, shown not told
- beat: awe + momentum
- blueprint: kinetic-type-beats — rapid-fire montage, each beat carried by live UI
- asset_candidates: remocn/checkbox, remocn/switch, remocn/tabs, remocn/select, remocn/toast (live, with their transition hooks)

narrativeRole: proves "around forty" with working components instead of a list.
keyMessage: the whole tier acts, not just the famous ones.

## Frame 7 — The numbers

- scene: back in the calm obsidian world; three short lines slide in one after another and hold as a block
- voiceover: "Around forty primitives. Assembled flows included. Deterministic on every render."
- duration: 3.5
- transition_in: blur-crossfade
- status: outline
- src: RemocnUiDemo → ValueScene
- type: benefit_highlight
- persuasion: Feature-to-benefit translation
- beat: confidence
- blueprint: grid-card-assemble — an accumulating value list
- asset_candidates: (typography-only)

narrativeRole: compresses the release into three memorizable claims.
keyMessage: forty primitives, flows included, frame-perfect forever.

## Frame 8 — The command

- scene: the shell command types itself in mono, alone in the center — `npx shadcn add @remocn/command-menu`, the package name in lime, a block caret blinking after the type lands. No pill, no chrome.
- voiceover: "One command away."
- duration: 4
- transition_in: crossfade
- status: outline
- src: RemocnUiDemo → InstallScene
- type: cta
- persuasion: Friction reduction
- beat: ease + urgency-to-act
- blueprint: typewriter-reveal — someone is typing this
- asset_candidates: (mono command, no captured assets)

narrativeRole: the mechanism made concrete — the component the viewer just watched, one command away.
keyMessage: npx shadcn add @remocn/command-menu.

## Frame 9 — The lockup

- scene: the introducing-remocn outro, inherited with the new logo — a smoke ring blooms open, the R mark draws itself on and fills, "emocn" slides out from behind it assembling the wordmark, "Open source, all the way down" settles faint beneath
- voiceover: "remocn — open source, all the way down."
- duration: 5
- transition_in: blur-crossfade
- status: outline
- src: RemocnUiDemo → OutroScene (inherited from IntroducingRemocnDemo)
- type: branding
- persuasion: Brand stamp + risk reversal
- beat: trust + inevitability
- blueprint: logo-assemble-lockup — the mark draws itself on, the wordmark completes the lockup
- asset_candidates: (logo mark inlined as SVG — the new R letterform)

narrativeRole: the brand stamp, identical to the flagship cut so the changelog series reads as one voice.
keyMessage: remocn.

---

## Checklist

- Arc named (PAS with a demo-loop core); sequence narrative-driven, not page-order.
- One hook strategy (ticker-takeover on the three un-fakeable shots).
- Each beat has one job; every beat carries `type`, `persuasion`, `beat`.
- Every VO written in its blueprint's shape and phrase-segmented into cues.
- Shapes vary: ticker-takeover, kinetic-type-beats, titlecard-reveal, comparison-split,
  device-surface-showcase, grid-card-assemble, typewriter-reveal, logo-assemble-lockup.
- The UI demo is a multi-beat sequence on one surface (F5: open → type/filter → select → toast).
- No swirl, no ripple; the statement cover is the NEW skeleton-swap, used twice; crossfade default.
- No letter-spacing, no uppercase, no badges, no pulsing, no installation pills.
- The outro is the introducing-remocn scene with the new R-mark logo, inherited unchanged.
