# STORYBOARD — Introducing shieldcn Plus

The launch video for shieldcn's accounts-with-sync release (July 4, 2026 — commits #183–#192:
Pro collapsed into a single Plus tier, managed brands, saved caps 5/75, AI generate, Polar
billing). The viewer may not know shieldcn; after ~50 seconds they should know three things:
**shieldcn renders READMEs as real shadcn/ui components, the public stuff is free forever,
and Plus ($10/mo) is the maintainer tier — capped by one killer feature: the managed brand
that re-styles every embed from one edit.**

- **Arc:** announcement cascade mirroring the author's own launch tweet — spectacle →
  what-it-is → the news → reassurance (free forever) → Plus intro → four feature beats →
  the crown (managed brand) → the honesty beat → CTA. Feature-Benefit Cascade with a
  risk-reversal beat where the tweet put it: BEFORE the paid pitch.
- **Length:** ~50s @ 30fps, 1280×720. Text-driven (X post — no VO track); each script
  line is the on-screen copy budget for its beat.
- **Register:** the shipped shieldcn brand — zinc-950 `#09090b` canvas, ink `#fafafa`,
  Geist Sans/Geist Mono, hairline borders, badge-value green `#22c55e` as the only accent.
  Violet `#8b5cf6` and amber `#f59e0b` appear ONLY inside the brand-morph scene, and only
  as REAL renders fetched from shieldcn.dev with `color=` params.
- **Visual language:** every product artifact on screen is a REAL SVG rendered by the live
  service (headers, badges, charts, sponsor/contributor walls — `public/shieldcn/` +
  `public/shieldcn/plus/`), and the shield mark is the real path from
  `packages/core/src/icons/shieldcn.svg`, stroke-drawing itself on. Nothing is hand-faked.
- **Transition vocabulary:** squeeze, pill-iris (badge-shaped reveal), zoom-blur at section
  turns, crossfade — the shieldcn family's own grammar. Deliberately NO shader-swirl and NO
  dither covers (those belong to the introducing-remocn / introducing-shadcn / paper-shaders
  cuts).
- **Typography discipline:** sentence case only, no letter-spacing, no uppercase, no
  installation pill, no decorative chips/badges, no pulsing, tight gaps (≤ 14px between
  stacked lines). Numbers are plain — never a "+" suffix. Mono only for URLs, params and
  repo names.

---

## Frame 1 — The front door, alive

- scene: a README assembles itself in real time on a page card while the camera pushes in and glides — the real graph header lands first, three real xs badges snap in one after another, prose skeleton lines draw on, the real star-history chart slides into place, the sponsor wall settles at the bottom. The project visualized by its own output; no headline.
- voiceover: (silent — the build-up carries it)
- duration: 5.0s
- transition_in: cut (opening frame)
- status: locked
- src: ShieldcnPlusDemo → FrontDoorScene
- type: hook
- persuasion: Show-don't-tell spectacle — the product's output builds itself
- beat: recognition → awe
- blueprint: (none — a camera-led assembly open; no bank shape is forced)
- asset_candidates: public/shieldcn/header-graph.svg — real README header; public/shieldcn/stars-shieldcn-xs.svg, license-xs.svg, npm-react-xs.svg — real xs badges; public/shieldcn/chart-stars.svg — real star chart; public/shieldcn/sponsors.svg — real sponsor wall

narrativeRole: stops the scroll by building the product's actual output live — a README that looks designed.
keyMessage: this is what a shieldcn README looks like.

## Frame 2 — What this is (category montage)

- scene: "This is shieldcn." lands solo, then three hard-cut category beats, each a label backed by a REAL render — Badges (a 3×4 wall of real badge SVGs cascading in), Charts (the real star-history chart wiping on left-to-right, the curve drawing itself), Headers (the real graph header holding under a slow push-in). The montage IS the education beat.
- voiceover: "This is shieldcn. Badges. Charts. Headers."
- duration: 7.8s
- transition_in: squeeze
- status: locked
- src: ShieldcnPlusDemo → WhatScene (intro + BadgesBeat / ChartsBeat / HeadersBeat)
- type: product_intro
- persuasion: Category naming proven by the product itself, not claimed
- beat: clarity + momentum
- blueprint: kinetic-type-beats — rapid-fire montage, each beat carried by a real render
- asset_candidates: public/shieldcn/*.svg — twelve real badges; chart-stars.svg; header-graph.svg

narrativeRole: names what the viewer just watched assemble and proves each category with the real artifact — the education beat for people who don't know the project.
keyMessage: shieldcn = badges, charts, headers — real ones, right there.

## Frame 3 — The news

- scene: the announcement lands solo — "Now it has accounts" glides in, then "— with sync." lands beside it and a green sync arc (two arrows chasing on a circle) draws itself once next to the line, then stops. No pulsing, one rotation only.
- voiceover: "Now it has accounts — with sync."
- duration: 3.2s
- transition_in: zoom-through
- status: locked
- src: ShieldcnPlusDemo → NewsScene
- type: product_intro
- persuasion: Launch announcement — the actual news of the release
- beat: intrigue
- blueprint: kinetic-type-beats — the key phrase lands after the setup
- asset_candidates: (typography + one drawn sync glyph)

narrativeRole: states the launch fact in the author's own words.
keyMessage: shieldcn now has accounts with sync.

## Frame 4 — Meet shieldcn

- scene: three moves — the real shield mark (path from the repo) draws itself alone in the CENTER via stroke-dashoffset; then the wordmark "shieldcn" drives in from the right, pushing the mark left into the lockup; the subtitle settles tight (8px) beneath the pair. (The "Free forever" beat was cut in the edit pass; the word "Plus" appears only in the CTA lockup.)
- voiceover: "Meet shieldcn — for maintainers who live in their READMEs."
- duration: 4.4s
- transition_in: zoom-through
- status: locked
- src: ShieldcnPlusDemo → MeetPlusScene
- type: product_intro
- persuasion: Category naming + audience self-selection
- beat: relief + intrigue
- blueprint: logo-assemble-lockup — the mark draws on, the name completes the lockup
- asset_candidates: shield mark — real path data from packages/core/src/icons/shieldcn.svg

narrativeRole: the turn — the paid tier gets its name, aimed at exactly who it's for.
keyMessage: shieldcn Plus, for README-heavy maintainers.

## Frame 6 — 75 READMEs, synced

- scene: a dashboard library builds — small README thumbnail cards (mini header stripe + skeleton prose + a badge dot row) cascade into a 5-wide grid; a rolling count lands on 75 beside "saved READMEs"; the line "synced across devices" settles under the number.
- voiceover: "Save 75 READMEs — synced across devices."
- duration: 4.6s
- transition_in: squeeze
- status: locked
- src: ShieldcnPlusDemo → SyncScene
- type: feature_showcase
- persuasion: Value stacking made spatial — the library visibly fills
- beat: control
- blueprint: grid-card-assemble — cards populate the grid as the count climbs
- asset_candidates: (own chrome — miniature README cards; RollingNumber at speed 1)

narrativeRole: the first concrete Plus perk — your work lives in the cloud, not one browser.
keyMessage: 75 saved READMEs, synced.

## Frame 7 — The saved badges library

- scene: real badges assemble into a library shelf (two tight rows); the source badge takes a green ring and copies land in three README row slots beneath — the same badge, reused. The visual carries the "reuse anywhere" point; no caption line.
- voiceover: "A saved badges library."
- duration: 4.2s
- transition_in: crossfade
- status: locked
- src: ShieldcnPlusDemo → LibraryScene
- type: feature_showcase
- persuasion: Friction reduction — configure once, reuse forever
- beat: ease
- blueprint: grid-card-assemble — the shelf assembles, then one item proves the reuse
- asset_candidates: public/shieldcn/npm-react.svg, stars-nextjs.svg, views-shieldcn.svg, license-shieldcn.svg, npm-react-outline.svg, npm-typescript.svg — real badge SVGs

narrativeRole: the second perk shown as a workflow — the badge leaves the library and lands in READMEs.
keyMessage: save a badge once, drop it anywhere.

## Frame 8 — Mass migration

- scene: a repo list in mono (acme/app, acme/docs, acme/ui, acme/cli, acme/site, acme/sdk) slides in as rows; a green check and the words "PR opened" cascade down the list fast, one row after another — six PRs in two seconds.
- voiceover: "Mass migration — open PRs across all your repos at once."
- duration: 4.4s
- transition_in: squeeze
- status: locked
- src: ShieldcnPlusDemo → MigrationScene
- type: feature_showcase
- persuasion: Scale compression — forty repos of chores become one cascade
- beat: power
- blueprint: grid-card-assemble — an accumulating list, each row popping into its slot
- asset_candidates: (own chrome — mono repo rows + drawn green checks)

narrativeRole: the heaviest chore a maintainer has, done in one sweep.
keyMessage: one action opens PRs across every repo.

## Frame 9a — AI title (interstitial)

- scene: the claim assembles word by word in the center via kinetic-center-build — "AI generates and polishes your READMEs" (no dashes) — then the squeeze hands over to the demo.
- voiceover: "AI generates and polishes your READMEs."
- duration: 2.8s
- transition_in: crossfade
- status: locked
- src: ShieldcnPlusDemo → AiTitleScene
- type: feature_showcase
- persuasion: Claim first, proof next — the interstitial sets the expectation
- beat: intrigue
- blueprint: kinetic-type-beats — the words ARE the motion (kinetic-center-build)
- asset_candidates: (typography-only)

narrativeRole: names the zero-effort promise before the demo proves it.
keyMessage: AI writes the README for you.

## Frame 9b — AI writes it

- scene: a prompt types itself in mono — "generate a readme for acme/app" — and on the return-stroke the artifacts snap in fast above it: the real acme header, then a real badge row, assembling a mini README in under a second. No caption — the title beat already said it.
- voiceover: (silent — the demo proves the title)
- duration: 3.8s
- transition_in: squeeze
- status: locked
- src: ShieldcnPlusDemo → AiScene
- type: feature_showcase
- persuasion: Show-don't-tell proof — the prompt visibly becomes the artifact
- beat: ease + delight
- blueprint: typewriter-reveal — someone is typing this, and it lands a result
- asset_candidates: public/shieldcn/plus/header-acme-green.svg — real acme header; public/shieldcn/plus/b-build-green.svg, b-cov-green.svg, b-stars-green.svg — real branded badges

narrativeRole: the zero-effort path — even writing the README disappears.
keyMessage: AI turns a prompt into a finished README.

## Frame 10 — One managed brand (the crown)

- scene: the author's favorite feature gets the longest beat. Left: a brand token card — `?brand=acme` in mono on top, below it the accent value `#22c55e` with a green dot. Right: the REAL acme-branded artifacts (header, build/coverage/stars badges, star chart) framed inside a GitHub README page — dark GitHub chrome with a "README.md" file header and book octicon, as if the README is rendering on github.com. The accent value flips in place to `#8b5cf6` — and EVERY artifact re-renders violet simultaneously with a tiny settle pop; it flips again to `#f59e0b` — everything follows amber. No caption — the flip carries the message.
- voiceover: "One managed brand. Change it once — every embed, in every repo, follows."
- duration: 8.0s
- transition_in: zoom-through
- status: locked
- src: ShieldcnPlusDemo → BrandScene
- type: feature_showcase
- persuasion: Show-don't-tell proof — propagation is watched, not claimed
- beat: awe + control
- blueprint: kinetic-type-beats — one value swaps in place per beat; the swap is the story
- asset_candidates: public/shieldcn/plus/header-acme-{green,violet,amber}.svg, b-build-*, b-cov-*, b-stars-*, chart-* — the same real artifacts rendered by shieldcn.dev in three accent colors

narrativeRole: the climax — the one feature that makes Plus feel like magic, proven with real renders.
keyMessage: edit the brand once, everything everywhere re-styles.

## Frame 11 — The offer

- scene: the launch discount accumulates as a two-line block via line-by-line-slide — "20% off" then "your first 6 months" slide in one after another and hold.
- voiceover: "20% off your first 6 months."
- duration: 2.8s
- transition_in: crossfade
- status: locked
- src: ShieldcnPlusDemo → OfferScene
- type: cta
- persuasion: Launch scarcity — the discount gets its own beat
- beat: urgency-to-act
- blueprint: grid-card-assemble — an accumulating value list (line-by-line-slide)
- asset_candidates: (typography-only)

narrativeRole: the nudge — the launch offer lands alone before the brand stamp.
keyMessage: 20% off your first 6 months.

## Frame 12 — CTA

- scene: the shield mark draws itself on once more and the wordmark "shieldcn" settles beside it — a clean closing lockup, nothing else on stage.
- voiceover: "shieldcn."
- duration: 5.4s
- transition_in: pill-iris (the badge-shaped reveal — the brand's own aperture)
- status: locked
- src: ShieldcnPlusDemo → CtaScene
- type: cta
- persuasion: Brand stamp — the mark alone closes the loop
- beat: confidence
- blueprint: logo-assemble-lockup — the mark draws on, the name completes the lockup
- asset_candidates: shield mark — real path from the repo

narrativeRole: the closing stamp — name and mark, nothing competing.
keyMessage: shieldcn.

---

## Checklist

- Arc named (announcement cascade ≈ Feature-Benefit Cascade + early risk-reversal); order
  mirrors the launch tweet, not the pricing page.
- Hook is a camera-led assembly of REAL product output — dynamic visualization, no naked text.
- Each beat has one job; every beat carries `type`, `persuasion`, `beat`.
- Shapes vary: spectacle open, kinetic-type-beats, logo-assemble-lockup, grid-card-assemble,
  typewriter-reveal, titlecard-reveal — no single blueprint everywhere.
- Every artifact is a real render from shieldcn.dev (or the real repo icon path); the
  brand-morph colors are real `color=` renders, not CSS filters.
- Transitions: squeeze / crossfade / zoom-through / pill-iris — no swirl, no dither covers.
- No installation pill, no letter-spacing, no uppercase, no pulsing, no decorative chips,
  tight vertical gaps, plain numbers (75, not 75+).
