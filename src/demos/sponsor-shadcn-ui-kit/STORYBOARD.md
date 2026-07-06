# Storyboard — remocn ✕ Shadcn UI Kit (partner sponsor spot)

- Arc: `Feature-Benefit Cascade` inside the sponsor-spot family grammar (hook → reveal → what's inside → kinetic bridge → value stack → proof → CTA → lockup)
- Length: ~22s @ 30fps, 1280×720
- Language: English, silent (text-driven — SCRIPT.md locks the on-screen copy, not narration)
- Register: Shadcn UI Kit dark — canvas `#0a0a0a`, ink `#fafafa`, muted `#a1a1a1`, one indigo accent `#6366f1` (the site's hero gradient hue); Cal Sans 400 headings, Inter body, both lifted from shadcnuikit.com's own font faces
- Logo: the site's mark redrawn in code — a rounded square carrying five diagonal round-cap strokes (one full center diagonal, two mediums flanking it, two short corner dots), centerlines measured off the shipped 1876px logo and snapped to exact 45 degrees; inverted to ink-on-dark for this canvas
- Backdrop: one persistent paper.design warp shader (edge shape, swirl 0.86 with 7 iterations, scale 0.9, rotation 160) recolored into the kit's indigo family `#a5b4fc` / `#312e81` / `#0a0a0a`, pushed back by a dark vignette so it textures the black instead of competing with it; slow camera drift on every scene
- Bans honored: no letter-spacing, no uppercase, no installation pills, no badges, no pulsing, no trailing periods, no em-dashes, no plus-suffix on numbers, compact spacing throughout
- Transition mapping: `zoom-through` → remocn push-through, `blur-crossfade` → remocn focus-pull, `crossfade` → plain opacity dissolve

## Frame 1 — Hook

- scene: the family line lands alone on the dark warp field, char-staggered blur resolve
- voiceover: "Say hello to my new sponsor"
- duration: 2.2
- transition_in: cut
- status: locked
- src: src/demos/sponsor-shadcn-ui-kit/index.tsx → HookScene
- type: hook
- persuasion: Curiosity gap (the sponsor is named only in the next beat)
- beat: curiosity
- asset_candidates:

narrativeRole: opens the spot with the series' recognizable sponsor line so returning viewers know the format instantly.
keyMessage: something new is being introduced.
Animation: soft-blur-in (Cal Sans via the font var).

## Frame 2 — Reveal

- scene: the mark's five diagonal strokes draw themselves onto the rounded square, the ink Shadcn UI Kit wordmark resolves out of depth beside it, the tagline settles tight beneath
- voiceover: "Shadcn UI Kit" / "Launch your projects faster"
- duration: 3.6
- transition_in: zoom-through
- status: locked
- src: src/demos/sponsor-shadcn-ui-kit/index.tsx → RevealScene
- type: product_intro
- persuasion: Category announcement (the kit named in its own brand voice)
- beat: intrigue
- blueprint: logo-assemble-lockup
- asset_candidates:

narrativeRole: pays off the hook by naming the sponsor with its real mark and the site's own promise line.
keyMessage: this is Shadcn UI Kit.

## Frame 3 — What's inside

- scene: three hard-cut stations, each acted out inside a tiny code-drawn fragment of the kit itself: a mini admin dashboard assembling (sidebar rows slide in, stat cards pop with counting figures, chart bars grow, a donut ring draws itself), a bento of blocks snapping tile by tile into a grid, and the theme generator re-tinting the same surface live as the accent flips indigo to emerald to amber. Station name and one compact descriptor under each vignette
- voiceover: "Dashboards, 12 admin panels, CRM to crypto" / "Blocks, 225 ready sections for marketing and apps" / "Theme generator, your brand in one click"
- duration: 5.9
- transition_in: blur-crossfade
- status: locked
- src: src/demos/sponsor-shadcn-ui-kit/index.tsx → StationsScene
- type: feature_showcase
- persuasion: Show-don't-tell proof, the kit performed rather than listed
- beat: ease + control
- blueprint: device-surface-showcase (the dashboard surface is the hero and its screens advance through the flow)
- asset_candidates:

narrativeRole: walks the viewer through the kit's three pillars in three cuts, each beat acting out its claim inside a fragment of real-feeling shadcn UI.
keyMessage: dashboards, blocks and theming, already built.

## Frame 4 — Kinetic bridge

- scene: three words build center-out, each new word pushing the line open, landing as one compact statement
- voiceover: "Copy, paste, ship"
- duration: 2.1
- transition_in: crossfade
- status: locked
- src: src/demos/sponsor-shadcn-ui-kit/index.tsx → KineticScene
- type: benefit_highlight
- persuasion: Friction reduction compressed into three verbs
- beat: power
- blueprint: kinetic-type-beats
- asset_candidates:

narrativeRole: compresses the entire workflow into the shadcn ethos, three verbs, no ceremony.
keyMessage: using it is this short.
Animation: kinetic-center-build (measureScale tuned for Cal Sans).

## Frame 5 — Value stack

- scene: four short value lines slide in line by line and hold as one compact block
- voiceover: "11 website templates" / "Built with Tailwind and TypeScript" / "React, Next.js, Vite and Remix" / "One payment, lifetime access"
- duration: 3.1
- transition_in: crossfade
- status: locked
- src: src/demos/sponsor-shadcn-ui-kit/index.tsx → StackScene
- type: benefit_highlight
- persuasion: Value stacking
- beat: confidence
- blueprint: grid-card-assemble (accumulating value list, rendered as lines not cards)
- asset_candidates:

narrativeRole: stacks the capabilities that did not fit the three stations, one per line, accumulating.
keyMessage: everything around the dashboards is covered too.
Animation: line-by-line-slide.

## Frame 6 — Proof

- scene: a plain count-up to 780 in tabular figures, caption tight beneath
- voiceover: "780" / "components, blocks and examples"
- duration: 2.3
- transition_in: blur-crossfade
- status: locked
- src: src/demos/sponsor-shadcn-ui-kit/index.tsx → CountScene
- type: social_proof
- persuasion: Statistical proof (the breadth in one figure)
- beat: awe → trust
- blueprint: dataviz-countup
- asset_candidates:

narrativeRole: the one number that proves scale; plain figure, no plus-suffix, in the series' count-up tradition.
keyMessage: 780 pieces, ready to use.

## Frame 7 — CTA

- scene: the closing line resolves alone on the warp field
- voiceover: "Your next dashboard is already built"
- duration: 2.3
- transition_in: crossfade
- status: locked
- src: src/demos/sponsor-shadcn-ui-kit/index.tsx → CtaScene
- type: cta
- persuasion: Future pacing (the work is already done, just take it)
- beat: relief + urgency-to-act
- blueprint: kinetic-type-beats
- asset_candidates:

narrativeRole: converts the proof into an action by flipping the pain, you never had to build it.
keyMessage: skip the build, ship the dashboard.
Animation: soft-blur-in.

## Frame 8 — Lockup

- scene: Remocn and the Shadcn UI Kit mark plus wordmark glide together from opposite sides, the cross springs in, the lockup holds dead-center with nothing else on screen
- voiceover: "Remocn ✕ Shadcn UI Kit"
- duration: 4.0
- transition_in: zoom-through
- status: locked
- src: src/demos/sponsor-shadcn-ui-kit/index.tsx → LockupScene
- type: branding
- persuasion: Authority by association
- beat: trust + inevitability
- blueprint: logo-assemble-lockup
- asset_candidates:

narrativeRole: closes on the partnership mark alone, centered, in the series' lockup tradition.
keyMessage: Remocn ✕ Shadcn UI Kit.
