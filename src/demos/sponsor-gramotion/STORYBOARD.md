# Storyboard — remocn ✕ Gramotion (partner sponsor spot)

- Arc: `Feature-Benefit Cascade` inside the sponsor-spot family grammar (hook → reveal → how it works → value stack → proof → CTA → lockup)
- Length: ~20s @ 30fps, 1280×720
- Language: English, silent (text-driven — SCRIPT.md locks the on-screen copy, not narration)
- Register: Gramotion dark — canvas `#0a0a0a`, ink `#fafafa`, muted `#a1a1a1`, one orange accent `#ff6825`; Cal Sans 400 headings, Plus Jakarta Sans body, JetBrains Mono for timecode-flavored details
- Backdrop: one persistent paper.design warp shader (checks shape, colors `#3c1515` / `#944752` / `#ffc085`) pushed back by a dark vignette so it textures the black instead of competing with it; slow camera drift on every scene
- Bans honored: no letter-spacing, no uppercase, no installation pills, no badges, no pulsing, no trailing periods, no em-dashes, no plus-suffix on numbers, compact spacing throughout
- Transition mapping: `zoom-through` → remocn push-through, `blur-crossfade` → remocn focus-pull, `crossfade` → plain opacity dissolve

## Frame 1 — Hook

- scene: the family line lands alone on the dark warp field, char-staggered blur resolve
- voiceover: "Say hello to my new sponsor"
- duration: 2.2
- transition_in: cut
- status: locked
- src: src/demos/sponsor-gramotion/index.tsx → HookScene
- type: hook
- persuasion: Curiosity gap (the sponsor is named only in the next beat)
- beat: curiosity
- asset_candidates:

narrativeRole: opens the spot with the series' recognizable sponsor line so returning viewers know the format instantly.
keyMessage: something new is being introduced.
Animation: soft-blur-in (Cal Sans via the font var).

## Frame 2 — Reveal

- scene: the lowercase gramotion wordmark resolves out of depth, the orange dot springs in last, tagline settles tight beneath
- voiceover: "gramotion" / "Create stunning motion graphics"
- duration: 3.3
- transition_in: zoom-through
- status: locked
- src: src/demos/sponsor-gramotion/index.tsx → RevealScene
- type: product_intro
- persuasion: Category announcement (a motion tool announced in motion)
- beat: intrigue
- blueprint: logo-assemble-lockup
- asset_candidates:

narrativeRole: pays off the hook by naming the sponsor in its own brand voice: Cal Sans wordmark, orange period.
keyMessage: this is Gramotion.

## Frame 3 — How it works

- scene: three hard-cut stations, each visualized as a tiny live piece of the Gramotion editor drawn in code (the site ships no illustrations, so the spot invents its own): a mini canvas where shapes drop in and a cursor lands a selection frame with corner handles, a mini timeline where the cursor drags the orange animation bar longer while a playhead sweeps, an export run where a progress bar fills to a mono readout and the shipped mp4/gif files resolve beneath. Step name and one compact descriptor under each vignette
- voiceover: "Design, shapes, text, images and video on one canvas" / "Animate, drag a bar on the timeline, no keyframes to wrangle" / "Export, MP4 or GIF in seconds"
- duration: 5.9
- transition_in: blur-crossfade
- status: locked
- src: src/demos/sponsor-gramotion/index.tsx → StepsScene
- type: feature_showcase
- persuasion: Show-don't-tell proof, the product loop performed rather than listed
- beat: ease + control
- blueprint: device-surface-showcase (the editor surface is the hero and its screens advance through the flow)
- asset_candidates:

narrativeRole: walks the viewer through the entire product loop in three cuts, each beat acting out its step inside a fragment of the editor UI.
keyMessage: blank canvas to shipped video in three steps.

## Frame 4 — Value stack

- scene: four short value lines slide in line by line and hold as a compact block
- voiceover: "Figma-like canvas" / "One-click animations" / "Text animations" / "Smart auto layout"
- duration: 3.0
- transition_in: crossfade
- status: locked
- src: src/demos/sponsor-gramotion/index.tsx → FeaturesScene
- type: benefit_highlight
- persuasion: Value stacking
- beat: confidence
- blueprint: grid-card-assemble (accumulating value list, rendered as lines not cards)
- asset_candidates:

narrativeRole: stacks the capabilities that did not fit the three-step loop, one per line, accumulating.
keyMessage: everything you need, nothing you don't.
Animation: line-by-line-slide.

## Frame 5 — Proof

- scene: a plain count-up to 1,200 in tabular figures, caption tight beneath
- voiceover: "1,200" / "already on the waitlist"
- duration: 2.3
- transition_in: blur-crossfade
- status: locked
- src: src/demos/sponsor-gramotion/index.tsx → CountScene
- type: social_proof
- persuasion: Social proof (a crowd is already waiting)
- beat: FOMO → belonging
- blueprint: dataviz-countup
- asset_candidates:

narrativeRole: the one number that proves demand; plain figure, no plus-suffix, in the series' count-up tradition.
keyMessage: 1,200 people already want this.

## Frame 6 — CTA

- scene: the site's own closing line resolves alone, orange on the final word's period-free landing
- voiceover: "Be there at the first frame"
- duration: 2.2
- transition_in: crossfade
- status: locked
- src: src/demos/sponsor-gramotion/index.tsx → CtaScene
- type: cta
- persuasion: Scarcity and urgency (early access, first frame)
- beat: urgency-to-act
- blueprint: kinetic-type-beats
- asset_candidates:

narrativeRole: converts the proof into an action using Gramotion's own launch copy, which doubles as a motion pun.
keyMessage: join before launch.
Animation: soft-blur-in.

## Frame 7 — Lockup

- scene: Remocn and the gramotion wordmark glide together from opposite sides, the cross springs in, the lockup holds dead-center with nothing else on screen
- voiceover: "Remocn ✕ gramotion"
- duration: 4.0
- transition_in: zoom-through
- status: locked
- src: src/demos/sponsor-gramotion/index.tsx → LockupScene
- type: branding
- persuasion: Authority by association
- beat: trust + inevitability
- blueprint: logo-assemble-lockup
- asset_candidates:

narrativeRole: closes on the partnership mark alone, centered, in the series' lockup tradition.
keyMessage: Remocn ✕ Gramotion.

## Persistent layer

A quiet JetBrains Mono timecode (`00:00:07`) ticks at the bottom edge for the whole spot, fading in after the hook and out before the lockup: the video wears the product's own timeline register. Not a badge, not a pill, just muted mono text.
