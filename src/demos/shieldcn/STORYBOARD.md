# STORYBOARD — shieldcn product demo (v3 cut)

> Step 3 (Story design) output, revised after the v2 edit pass. Decides what the video says, in
> what order, and the SHAPE of each line. For this remocn project there is no `capture/`
> directory, so `asset_candidates` names **remocn components** the beat leans toward — not
> invented screenshot filenames.
>
> **v2 edit notes:** the "One URL" beat was cut; the product intro is now three beats on the
> shared Z axis (Meet → lockup with a self-drawing shield mark → creed); block headlines moved
> OUT of the feature scenes into their own interstitial title beats entering via
> short-slide-right; the opening scenes' text enters via short-slide-right instead of typing.
>
> **v3 edit notes (creative pass):** hook lines now ACCUMULATE and "Your README." takes a green
> marker sweep; the pain wall became two counter-drifting marquee bands of dated badges; the
> variants beat became a split stage — the `?variant=` URL param swaps on the left while the SAME
> badge restyles live on the right, then the family cascades along the bottom; the charts beat
> became a spatial pan across three README artifacts (star-history chart → project header →
> sponsor wall); proof now uses the animated GitHub-stars card; the CTA opens with the badge
> family clearing the stage before the shield draws on. New transition vocabulary: squeeze
> (mechanical beat change), pill-iris (badge-shaped reveal into intro and CTA), zoom-through at
> section turns; section titles gained a self-drawing green rule.

## Product truth

- **Audience** — open-source maintainers and developers who care how their repo reads: the people
  who already use shadcn/ui and wince at a wall of shields.io badges.
- **Pain / desire** — the README is the front door of every open-source project, and it's the one
  surface still stuck with flat, gray, mismatched pixel badges. They want the README to look as
  designed as the product.
- **Promise** — *Everything for your README — badges, charts, and headers rendered as real
  shadcn/ui components.*
- **Product role** — a shields.io alternative: badges as real shadcn buttons; charts, headers,
  sponsor walls; an agent skill that writes the README for you.
- **Proof** — five variants (default, secondary, outline, ghost, destructive) + sizes + icons +
  dark/light; star-history charts, headers, sponsor walls; `npx skills add jal-co/shieldcn`;
  MIT, Vercel OSS Program member, 500+ GitHub stars.
- **CTA** — shieldcn.dev — generate your badges.

## Arc

**BAB (Before → After → Bridge)** with a feature→benefit rhythm through the middle. Before
(dated shields wall) → After tease (real shadcn components) → Step 1 (variants — make it yours)
→ Step 2 (charts, headers, sponsor walls) → Step 3 (the agent skill does it for you) → proof →
CTA. Section titles are their own interstitial beats between scenes.

## Voice & design register

Developer-to-developer, plain and a little playful. Visual world: shadcn zinc register plus the
badge-value green (`#22c55e`) — zinc-950 canvas, white ink, hairline borders, Geist Sans/Mono,
small radii. The shield mark always DRAWS itself on (stroke-dashoffset), matching the drawn-mark
language of the other demos. Text in the opening scenes enters via short-slide-right.

---

## Frame 1 — The front door

- scene: two lines slide in from the left, word by word — "Someone just opened your repo." then "The first thing they see? Your README."
- voiceover: "Someone just opened your repo. The first thing they see? Your README."
- duration: 3.7
- transition_in: cut
- status: done
- src: compositions/frames/01-the-front-door.html
- type: hook
- persuasion: Pain validation (direct address)
- beat: curiosity + tension
- blueprint: kinetic-type-beats — two short direct-address lines, each landing alone
- asset_candidates: remocn/short-slide-right; typography-only

narrativeRole: Puts the viewer at the exact moment the pain happens.
keyMessage: The README is the first impression of your whole project.

## Frame 2 — The wall (real badges)

- scene: two counter-drifting marquee bands of REAL shieldcn badges (actual SVGs from the repo's README — npm, stars, views, downloads, license, variants, Vercel OSS); two lines slide in beneath.
- voiceover: "Your README could look like this — a design system, all the way to the front door."
- duration: 3.7
- transition_in: squeeze
- status: done
- src: compositions/frames/02-the-wall.html
- type: benefit_highlight
- persuasion: Future pacing (show the after-state before naming the product)
- beat: desire + aspiration
- blueprint: grid-card-assemble — a wall of real artifacts asserts breadth at once
- asset_candidates: public/shieldcn/*.svg — real badge SVGs downloaded from shieldcn.dev

narrativeRole: Shows the after-state as a living wall before the product is even named.
keyMessage: This quality is available for your README — these are real rendered badges.

## Frame 3 — Meet shieldcn (three shared-axis beats)

- scene: three beats on the shared Z axis — (a) "Meet" enters; (b) it recedes as the lockup lands and the shield mark draws itself on beside the mono wordmark; (c) the lockup recedes into the creed — "Badges, charts, headers — as real shadcn/ui components."
- voiceover: "Meet shieldcn — badges, charts, and headers, rendered as real shadcn/ui components."
- duration: 6
- transition_in: zoom-through
- status: done
- src: compositions/frames/03-meet-shieldcn.html
- type: product_intro
- persuasion: Category upgrade (shields.io alternative)
- beat: relief + intrigue
- blueprint: kinetic-type-beats — hard-cut through "Meet…" / name / tagline, one idea per beat on the same axis
- asset_candidates: remocn/shared-axis-z for all three swaps; stroke-drawn shield mark (pathLength dashoffset)

narrativeRole: Turns the corner from pain to answer and plants the thesis, one beat at a time.
keyMessage: There's a shields.io alternative that speaks your design system.

## Frame 4 — Make it yours (title interstitial + variants)

- scene: the headline "Make it yours" plays as its own interstitial beat (short-slide-right), then the badge grid assembles — five variants, four sizes, icon badges — every one a real button-shaped pill.
- voiceover: "Default, secondary, outline, ghost, destructive — any size, any icon. Dark mode built in."
- duration: 5.8
- transition_in: crossfade
- status: done
- src: compositions/frames/04-make-it-yours.html
- type: feature_showcase
- persuasion: Value stacking (customization breadth)
- beat: control + delight
- blueprint: grid-card-assemble — a pill grid self-assembles to show breadth at once
- asset_candidates: remocn/short-slide-right title card; badge pills as shadcn button variants (own chrome)

narrativeRole: Pays off the promise — these aren't fixed images, they're your design system's variants.
keyMessage: Every badge takes shadcn's variants, sizes, and icons — it's genuinely yours.

## Frame 5 — More than badges (title interstitial + chart)

- scene: the headline "More than badges" plays as its own interstitial beat, then a star-history chart draws itself live inside a card; chips for Headers · Sponsor walls · Contributors settle beneath.
- voiceover: "Then go bigger — star-history charts, project headers, sponsor walls."
- duration: 5.7
- transition_in: crossfade
- status: done
- src: compositions/frames/05-more-than-badges.html
- type: feature_showcase
- persuasion: Feature-to-benefit translation (whole-README coverage)
- beat: aspiration
- blueprint: device-surface-showcase — the artifact drawn live inside its real surface
- asset_candidates: remocn/short-slide-right title card; remocn/animated-line-chart (green stroke); chip pills

narrativeRole: Widens the product from "badge generator" to "everything for your README."
keyMessage: shieldcn dresses the whole README, not just the badge row.

## Frame 6 — Your agent does it

- scene: a terminal runs `npx skills add jal-co/shieldcn -a claude-code`; the skill installs and the closing log lands.
- voiceover: "Or hand it to your agent — npx skills add jal-co/shieldcn — and it writes the README for you."
- duration: 4.2
- transition_in: crossfade
- status: done
- src: compositions/frames/06-your-agent-does-it.html
- type: feature_showcase
- persuasion: Friction reduction (zero-effort path)
- beat: ease + power
- blueprint: cursor-ui-demo — a real command lands a result
- asset_candidates: remocn/terminal-simulator (instant step-scroll); skills.sh install lines

narrativeRole: The wow — even the remaining work disappears.
keyMessage: There's an agent skill — your coding agent can do the whole thing.

## Frame 7 — Built in the open (title interstitial + proof)

- scene: the headline "Built in the open" plays as its own interstitial beat, then proof pills settle — MIT · Vercel OSS Program · shields.io alternative — and a star count rolls up past 500.
- voiceover: "Open source. MIT. A Vercel OSS Program member — five hundred stars and counting."
- duration: 5.2
- transition_in: zoom-through
- status: done
- src: compositions/frames/07-built-in-the-open.html
- type: social_proof
- persuasion: Authority by association + Social proof
- beat: trust
- blueprint: titlecard-reveal — a clean proof card that settles and holds
- asset_candidates: remocn/short-slide-right title card; remocn/rolling-number; proof chip pills

narrativeRole: De-risks the choice — open, licensed, backed by a program the audience respects.
keyMessage: It's a real open-source project you can adopt today.

## Frame 8 — Make it count

- scene: the shield mark draws itself on beside the wordmark; the URL pill lands beneath — shieldcn.dev — with the closing line "Make the first impression count."
- voiceover: "Your README is the front door. Make it count — shieldcn.dev."
- duration: 3.7
- transition_in: zoom-through
- status: done
- src: compositions/frames/08-make-it-count.html
- type: cta
- persuasion: Future pacing (callback to the hook)
- beat: motivation + urgency-to-act
- blueprint: logo-assemble-lockup — the mark draws on and resolves on the URL
- asset_candidates: stroke-drawn shield + mono wordmark lockup; URL pill with copy affordance

narrativeRole: Converts intent into the next action by closing the loop the hook opened.
keyMessage: One URL away — shieldcn.dev.

---

## Checklist

- Arc named (BAB + feature→benefit); sequence is narrative-driven, not page-order.
- Opening hook is one clear strategy (direct-address moment of judgment) that creates tension.
- Each beat has one job; every beat carries `type`, `persuasion`, `beat`.
- Shapes vary: kinetic-type-beats, grid-card-assemble, device-surface-showcase, cursor-ui-demo,
  titlecard-reveal, logo-assemble-lockup.
- Section titles live BETWEEN scenes as interstitial beats (short-slide-right), never inside blocks.
- The shield mark always draws itself on — no static icon pops.
- `transition_in` uses registry types — crossfade default, zoom-through at section boundaries.
- `asset_candidates` adapted to this remocn project (component suggestions; no invented filenames).
