# STORYBOARD — Introducing shadcn/ui (gift cut)

A gift video for shadcn — an "introducing" spot for shadcn/ui made by a fan, not the
owner. After ~55 seconds the viewer should know: **shadcn/ui is not a component
library — it's how you build your own**, one command puts real code in your project,
and the whole ecosystem already runs on it — a million apps a month, and everyone
needs UI.

- **Arc:** spectacle-first BAB (abundance hook → name → creed → breadth → mechanism → ownership → proof → outro → thanks)
- **Length:** ~55s @ 30fps, 1280×720
- **Signature move:** the video opens and peaks on REAL shadcn/ui components,
  installed from the registry and rendered live (Tailwind enabled in the Remotion
  pipeline) — the camera flight and category montage are the product itself, not
  illustrations of it.
- **Register:** shadcn's own monochrome — zinc-950 `#09090b` canvas, ink `#fafafa`,
  Geist 400 only (no weight above regular anywhere). No letter-spacing, no uppercase,
  no pills, no badges, no pulsing, no links shown on screen.
- **Color discipline:** the video itself is monochrome. The ONLY color lives inside
  shader backgrounds, sampled from shadcn's X avatar (the vaporwave sky) and heavily
  muted: deep plum `#3d2547`, dark navy `#141833`, dusty rose `#6b4054`, dusty blue
  `#3a4a5e`. Nothing bright, nothing saturated.
- **Visual language:** one quiet simplex-noise field (zinc with a plum hint) carries
  the whole video; scene changes are shader covers (a muted-plum swirl, a dusty-rose
  dither) that fade in, hold ~500ms so the shader is read, then fade out — the same
  cinematic grammar as the introducing-remocn / paper-shaders cuts.
- **Typography discipline:** every text is its own scene beat (no subtitles under
  headlines). scale-down-fade for solo statements, short-slide-right for glides,
  kinetic-center-build for the creed assembling, line-by-line-slide for the value
  block. Mono (Geist Mono 400) only for the shell command.

---

## Frame 1 — The component field

- scene: a camera glide across a dense masonry wall of REAL shadcn/ui components — the ui.shadcn.com homepage cards (create an account, move goal with live mini bars, chat, calendar, command menu, payment method, cookie settings, team members, report an issue, share document, upgrade plan) packed tight in four columns, rendered live from src/components/ui. The camera opens on the create-account card and glides diagonally down the wall with a slight push-in — NO pull-back, the density never breaks. No text.
- voiceover: (silent — the visual carries it)
- duration: 7.5s (the swirl cover takes over at ~4s, while the camera is still moving — one single-segment glide, no mid-flight stop)
- transition_in: cut (opening frame)
- status: locked
- src: IntroducingShadcnDemo → FieldScene
- type: hook
- persuasion: Show-don't-tell abundance + recognition (you've seen these components everywhere)
- beat: recognition → awe
- blueprint: (none — a camera-led spectacle open; no bank shape fits and none is forced)
- asset_candidates: (live-rendered shadcn/ui components, no captured assets)

narrativeRole: stops the scroll with sheer breadth — every card is a component the viewer has already met in the wild.
keyMessage: there is a LOT here, and it all looks this good.

## Frame 3 — This is shadcn/ui

- scene: the swirl cover fades in over the pain as its dark twist=1 field, unwinds into open muted-plum bands, holds ~500ms, winds back — and riding the wind-back, "This is shadcn/ui" resolves through scale + blur
- voiceover: "This is shadcn/ui."
- duration: 4.0s
- transition_in: zoom-through (implemented as a shader-swirl cover in muted plum/rose)
- status: locked
- src: IntroducingShadcnDemo → MeetScene
- type: product_intro
- persuasion: Category naming
- beat: relief + intrigue
- blueprint: kinetic-type-beats — "Introducing…" name-drop
- asset_candidates: (typography-only)

narrativeRole: the turn — the name lands alone, nothing competing. Geist 400, no tricks.
keyMessage: shadcn/ui.

## Frame 4 — The tagline

- scene: its own typographic beat — the line glides in from the left and holds alone
- voiceover: "Beautifully designed components."
- duration: 2.5s
- transition_in: cut (the name plays its own exit first — empty canvas handoff)
- status: locked
- src: IntroducingShadcnDemo → TaglineScene
- type: product_intro
- persuasion: Category naming
- beat: clarity
- blueprint: titlecard-reveal — the calm value beat
- asset_candidates: (typography-only)

narrativeRole: says what the name is, in the project's own words.
keyMessage: beautifully designed components.

## Frame 5 — The creed, first half

- scene: the dither cover dissolves the frame through dusty-rose pixels; "Not a component library" settles solo in the center
- voiceover: "Not a component library."
- duration: 2.3s
- transition_in: blur-crossfade (implemented as a dithering-shader dissolve, muted rose)
- status: locked
- src: IntroducingShadcnDemo → CreedAScene
- type: product_intro
- persuasion: Negative contrast
- beat: intrigue
- blueprint: kinetic-type-beats — the words ARE the motion
- asset_candidates: (typography-only)

narrativeRole: the famous line from the docs, given its own beat — the negation creates the question the next beat answers.
keyMessage: it is not what you think it is.

## Frame 6 — The creed, second half

- scene: "How you build your own" assembles word by word in the center — the mental model assembling exactly like a design system does
- voiceover: "How you build your own."
- duration: 3.2s
- transition_in: cut (question → answer, no ceremony)
- status: locked
- src: IntroducingShadcnDemo → CreedBScene
- type: product_intro
- persuasion: Anchoring to the project's own philosophy
- beat: clarity
- blueprint: kinetic-type-beats — the words ARE the motion
- asset_candidates: (typography-only)

narrativeRole: resolves the negation into the thesis of the whole project.
keyMessage: shadcn/ui is how you build your component library.

## Frame 7 — The category montage

- scene: four hard-cut beats, each a label plus REAL UI proving it — Blocks (the registry's sidebar-07 block assembling itself: the frame resolves, the app sidebar slides in from the left, the breadcrumb header settles, and the content placeholders cascade in), Charts (a monochrome bar chart drawing itself live), Themes (the same notifications card hard-flipping dark → light → dark), Colors (the full Tailwind palette — 22 ramps × 11 shades, values straight from tailwindcss v4 — sweeping in as a diagonal wave). The montage IS the platform argument.
- voiceover: "Blocks. Charts. Themes. Colors."
- duration: 10.1s (Blocks 96f self-assembly + 3 × 56f + dither tail, hard cuts)
- transition_in: cut (the montage announces itself)
- status: locked
- src: IntroducingShadcnDemo → CategoriesScene
- type: feature_showcase
- persuasion: Value stacking, shown not told
- beat: awe + momentum
- blueprint: kinetic-type-beats — rapid-fire value montage (each beat carried by live UI)
- asset_candidates: (live-rendered shadcn/ui components, no captured assets)

narrativeRole: proves the platform's breadth with the product itself — four categories, four working demos.
keyMessage: it covers everything a design system needs.

## Frame 8 — The pillars

- scene: back in the calm zinc world; three short lines slide in one after another and hold as a block
- voiceover: "Accessible by default. Composable by design. Open code, always."
- duration: 3.5s
- transition_in: blur-crossfade (dithering-shader dissolve out of the montage)
- status: locked
- src: IntroducingShadcnDemo → PillarsScene
- type: benefit_highlight
- persuasion: Value stacking
- beat: confidence
- blueprint: grid-card-assemble — an accumulating value list
- asset_candidates: (typography-only)

narrativeRole: compresses the philosophy into three memorizable claims.
keyMessage: accessible, composable, open.

## Frame 9 — Any component, one command

- scene: the claim alone — the headline glides in via short-slide-right, holds, then plays its own exit
- voiceover: "Any component, one command."
- duration: 2.3s
- transition_in: crossfade (same visual world)
- status: locked
- src: IntroducingShadcnDemo → InstallTitleScene
- type: feature_showcase
- persuasion: Friction reduction
- beat: ease
- blueprint: titlecard-reveal — the calm value beat
- asset_candidates: (typography-only)

narrativeRole: sets up the mechanism the next beat demonstrates.
keyMessage: the whole workflow is one command.

## Frame 10 — The command

- scene: the shell command types itself in mono, alone in the center; once typed, the component name becomes a 3D rolodex flipping through the registry — button, dialog, command, tabs, chart-area — any component, same command
- voiceover: "npx shadcn add button."
- duration: 5.0s
- transition_in: cut (the title exits itself first — no overlap)
- status: locked
- src: IntroducingShadcnDemo → InstallCmdScene
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: control
- blueprint: typewriter-reveal — someone is typing this
- asset_candidates: (mono command, no captured assets)

narrativeRole: the mechanism made concrete — one typed command is the whole workflow.
keyMessage: one command, any component.

## Frame 10b — One preset

- scene: the claim alone — the headline glides in via short-slide-right, holds, then plays its own exit
- voiceover: "Your whole design system, one preset."
- duration: 2.2s
- transition_in: crossfade (out of the command scene)
- status: locked
- src: IntroducingShadcnDemo → PresetTitleScene
- type: feature_showcase
- persuasion: Friction reduction, escalated from one component to the whole system
- beat: ease
- blueprint: titlecard-reveal — the calm value beat
- asset_candidates: (typography-only)

narrativeRole: escalates the CLI story — not just components, the entire design config in one code.
keyMessage: a preset packs colors, theme, fonts, radius into one short code.

## Frame 10c — Building a preset

- scene: the builder from ui.shadcn.com/create — the settings tile stack (Style, Base Color, Theme, Font: muted label, current value, icon on the right; a white Get Code button at the bottom) next to a live preview of the real sign-in card. One setting flips at a time and the preview reshapes in response: Vega → Lyra sharpens every corner, Zinc → Stone warms the grays, Light → Dark inverts, Geist → Geist Mono swaps the type. When all four have landed, the choices condense into a code: `--preset a1Dg5eFl` fades in above Get Code — the same code the next beat feeds to the CLI
- voiceover: (silent — the flipping settings and reacting preview carry the beat)
- duration: 6.7s
- transition_in: cut (the title exits itself first — no overlap)
- status: locked
- src: IntroducingShadcnDemo → CreateScene
- type: feature_showcase
- persuasion: Show-don't-tell proof — you watch the design system being decided
- beat: control
- blueprint: kinetic-type-beats — one value swaps in place per beat; the swap is the story
- asset_candidates: (real shadcn/ui components; base colors are all grays, so the video stays monochrome)

narrativeRole: where presets come from — you assemble one visually, and it becomes a short code.
keyMessage: style, base color, theme, font — picked live, packed into one code.

## Frame 10d — Switching presets

- scene: a real sign-in card (Card, Input, Switch, Button) sits above the mono command `npx shadcn init --preset <code>`; the preset code flips like a 3D rolodex — a1Dg5eFl → ad3qkJ7 → adtk27v — and on every flip the SAME components re-theme live: dark default → light with sharp corners → dark with round corners, radius morphing smoothly, a tiny pop selling "everything just reconfigured"
- voiceover: "npx shadcn init --preset."
- duration: 5.9s
- transition_in: cut (the builder exits itself first — no overlap)
- status: locked
- src: IntroducingShadcnDemo → PresetScene
- type: feature_showcase
- persuasion: Show-don't-tell proof — one command visibly reconfigures everything, components included
- beat: control
- blueprint: kinetic-type-beats — the key token swaps in place; the swap is the story
- asset_candidates: (real shadcn/ui components, monochrome in both themes)

narrativeRole: the preset made concrete — the code flips, the whole system follows.
keyMessage: one code swaps the entire design system, including installed components.

## Frame 10e — Switch it any time

- scene: one line lands solo in the calm world
- voiceover: "Switch it any time."
- duration: 2.1s
- transition_in: cut (the preset scene exits itself first)
- status: locked
- src: IntroducingShadcnDemo → PresetSwitchScene
- type: benefit_highlight
- persuasion: Risk reversal — trying styles is cheap
- beat: ease
- blueprint: kinetic-type-beats — the calm landing after the demo
- asset_candidates: (typography-only)

narrativeRole: lands the consequence of the flip montage — switching is a one-command habit, not a rewrite.
keyMessage: finding the look you like takes tries; presets make tries free.

## Frame 11 — The code is yours

- scene: one line lands solo in the calm world — the ownership claim, nothing else
- voiceover: "And the code is yours."
- duration: 2.3s
- transition_in: cut (both beats are self-contained)
- status: locked
- src: IntroducingShadcnDemo → YoursScene
- type: benefit_highlight
- persuasion: Risk reversal
- beat: control + peace of mind
- blueprint: kinetic-type-beats — the calm landing after the demo
- asset_candidates: (typography-only)

narrativeRole: lands the single most important consequence of the mechanism.
keyMessage: real files in your repo, yours to change.

## Frame 12 — A million apps

- scene: synced to the wheel — the camera dives onto the digits as the count starts ticking from 0 (ease-in: slow ticks → a spinning blur → it SLAMS into 1,000,000 at full zoom), a beat, then the camera travels right along the giant line so "apps every month" is read — and instead of stopping, the travel accelerates straight into a whip-pan cut. The motion never breaks; the whip carries it into the next scene.
- voiceover: "1,000,000 apps every month."
- duration: 5.2s
- transition_in: crossfade
- status: locked
- src: IntroducingShadcnDemo → AppsScene
- type: social_proof
- persuasion: Statistical proof, escalated
- beat: awe
- blueprint: dataviz-countup — the data IS the argument
- asset_candidates: (typography-only; plain number, no plus suffix)

narrativeRole: one number that says the ecosystem already decided.
keyMessage: a million apps a month run on this.

## Frame 12c — Who builds

- scene: three names hard-cut solo in the center — Startups, YC, Fortune 500s — each sliding in from the right and decelerating (inheriting the whip's leftward momentum), then the resolution settles: "Everyone is building with it"
- voiceover: "Startups. YC. Fortune 500s. Everyone is building with it."
- duration: 4.3s
- transition_in: whip-pan LEFT (continues the apps scene's accelerating travel through the cut)
- status: locked
- src: IntroducingShadcnDemo → WhoScene
- type: social_proof
- persuasion: Authority by association
- beat: belonging + inevitability
- blueprint: kinetic-type-beats — rapid-fire montage resolving on the claim
- asset_candidates: (typography-only)

narrativeRole: names the crowd, from garage to enterprise.
keyMessage: everyone already builds with it.

## Frame 12d — The opportunity

- scene: one line glides in and holds — the invitation
- voiceover: "A massive ecosystem — and room for you to build."
- duration: 2.4s
- transition_in: crossfade
- status: locked
- src: IntroducingShadcnDemo → EcoScene
- type: benefit_highlight
- persuasion: Future pacing — the viewer inside the ecosystem
- beat: aspiration + opportunity
- blueprint: titlecard-reveal — the calm value beat
- asset_candidates: (typography-only)

narrativeRole: turns the proof toward the viewer — this is your opportunity.
keyMessage: there is room for you here.

## Frame 12e — The kicker

- scene: "The best part?" lands solo and lifts away; then "Everyone needs UI" assembles word by word — the thesis of the whole ecosystem in three words
- voiceover: "The best part? Everyone needs UI."
- duration: 5.1s
- transition_in: crossfade (question), cut (answer)
- status: locked
- src: IntroducingShadcnDemo → BestScene + NeedsScene
- type: benefit_highlight
- persuasion: Universal-need close
- beat: clarity + inevitability
- blueprint: kinetic-type-beats — the words ARE the motion
- asset_candidates: (typography-only)

narrativeRole: the last argument before the brand stamp — the market never runs out.
keyMessage: everyone needs UI.

## Frame 13 — The lockup

- scene: a smoke ring in muted rose blooms open from the dark; "shadcn/ui" resolves inside it; "Open Source. Open Code." settles faint at the bottom
- voiceover: "shadcn/ui. Open Source. Open Code."
- duration: 4.7s
- transition_in: blur-crossfade
- status: locked
- src: IntroducingShadcnDemo → OutroScene
- type: branding
- persuasion: Brand stamp in the project's own words
- beat: inevitability
- blueprint: logo-assemble-lockup — elements clear, the lockup draws itself in
- asset_candidates: (typography-only; no URL shown by design)

narrativeRole: the brand stamp — the name and its own motto, no link, no CTA.
keyMessage: shadcn/ui — open source, open code.

