# STORYBOARD — Introducing Prisma

An introducing spot for Prisma (prisma.io) — agent infrastructure for
TypeScript. After ~40 seconds the viewer should know: **Prisma turns one
schema definition into a fully type-safe client**, it grows from the ORM
into managed Postgres and Compute, and starting is two commands.

- **Arc:** BAB with feature–benefit progression
  (before → the turn → what it is → mechanism → proof of breadth → platform
  → social proof → action → lockup).
- **Length:** ~46s @ 30fps (1367 frames), 1280×720.
- **Register:** tokens lifted from prisma.io's live stylesheet — canvas
  `#131420`, ink `#f9fafb`, ORM indigo ramp `#6366f1` / `#818cf8`, Prisma
  Postgres teal `#14b8a6` / `#2dd4bf`. **Inter** carries everything (the
  site's UI face), **Geist Mono** in the code register. No letter-spacing,
  no uppercase chrome, no badges, no eyebrows, no installation pills, no
  pulsing, no glow halos, no trailing periods on headlines.
- **Logo:** official press-kit mark + wordmark paths
  (`public/prisma/logo-light.svg`), animated — never redrawn, never
  approximated.
- **Shader choice (paper.design):** `gem-smoke`, a NEW remocn component
  (`shader-gem-smoke`). Paper built it for exactly this: color fields
  living behind a glassy logo silhouette. Fed with the official prism
  mark, it makes the whole video happen inside the Prisma logo — indigo
  smoke with teal veins. One field carries everything; the root score
  brightens it for the reveal and the outro, dims it under code.
- **Signature transition:** `prism-refraction`, a NEW remocn transition —
  a beam of white light strikes the prism outline, the spectrum fan
  (indigo → teal) opens and swallows the outgoing scene; then the fan
  folds back the same way it opened — the wedges closing into a thin ray
  pointing right, the exact reverse of the entrance — the beam exits
   right while the prism spins once
  and glides into the incoming scene's own mark slot: the refracting
  element BECOMES the logo, never hidden and re-shown. Used exactly
  twice: the opening turn (hook → reveal) and the final stamp (getting
  started → lockup).
- **New registry components:** `relation-graph` (two model cards, the
  `@relation` curve draws itself, a pulse rides it) and `prisma-studio`
  (the Studio data browser — rows populate, a record is added, Save
  presses itself).
- **Motion grammar:** enumeration always travels LEFT (the pain conveyor,
  the montage whip-pans, content arriving from the right and
  decelerating); narrative turns are branded (prism-refraction) or dive
  INTO the frame (push-through); calm shifts are crossfades and
  focus-pulls. If a scene exits left, the next enters from the right.
  Nothing appears without a direction.
- **music:** confident minimal tech underscore

---

## Product truth

- **Audience:** TypeScript developers building APIs, full-stack apps, and
  AI agents.
- **Pain / desire:** raw SQL strings, no autocomplete, a schema that
  drifts from the code it feeds.
- **Promise:** define your schema once — Prisma generates a fully
  type-safe client, then Postgres and Compute when you need them.
- **Product role:** the full TypeScript path for data: ORM → Postgres →
  Compute.
- **Proof:** the generated client itself (shown working), 47.3k GitHub
  stars (github.com/prisma/prisma, July 2026), every major database.
- **CTA:** start at prisma.io — two commands and you're typed.

---

## Frame 1 — The pain conveyor

- scene: three short lines on the bare dark field — "Raw SQL strings" /
  "No autocomplete" / "Schema drift" — each arrives from the right and
  decelerates, holds alone, exits left as the next arrives; the last one's
  exit accelerates straight into the dive
- voiceover: "Raw SQL strings. No autocomplete. A schema that drifts from
  your code."
- duration: 3.9s
- transition_in: cut (opening frame)
- status: locked
- src: IntroducingPrismaDemo → HookScene
- type: pain_point
- persuasion: Pain validation
- beat: friction → tension
- blueprint: kinetic-type-beats — pain lands alone on a bare canvas
- asset_candidates: (typography-only)

narrativeRole: names the everyday TypeScript data pain in the viewer's own
words before any product appears.
keyMessage: the old way is untyped and drifting.

## Frame 2 — The reveal

- scene: the refraction lands on the logo being written: the prism contour
  and inner facet stroke-draw on, the official fill rises beneath and the
  stroke thins away with a breath of scale; then the wordmark glyphs dock
  in from the right one by one. The gem-smoke field hits full brightness —
  the smoke lives inside the same prism silhouette
- voiceover: "Meet Prisma."
- duration: 4.9s
- transition_in: prism-refraction (the beam strikes, the spectrum swallows
  the pain conveyor)
- status: locked
- src: IntroducingPrismaDemo → RevealScene (PrismaLockupDraw)
- type: product_intro
- persuasion: Category naming
- beat: relief + intrigue
- blueprint: logo-assemble-lockup — elements draw on, the lockup completes
- asset_candidates: (official press-kit paths; typography-only otherwise)

narrativeRole: the brand lands as the answer — the logo demonstrates care
before a single claim is made.
keyMessage: Prisma.

## Frame 3 — What it is

- scene: the site's own words assemble word by word in the center
- voiceover: "Agent infrastructure for TypeScript."
- duration: 2.8s
- transition_in: crossfade
- status: locked
- src: IntroducingPrismaDemo → WhatScene
- type: product_intro
- persuasion: Category naming, in the product's own register
- beat: clarity
- blueprint: kinetic-type-beats — the words ARE the motion
- asset_candidates: (typography-only)

narrativeRole: says what the name IS, quoting the homepage hero verbatim.
keyMessage: agent infrastructure for TypeScript.

## Frame 4 — The mechanism (define once)

- scene: statement first — "Define once — generate the client"; then
  schema.prisma cascades in line by line (model User, tinted types),
  `npx prisma generate` flashes between the cards, and the generated
  client.ts materializes with the editor inlay hint `: User[]` popping in
  over `users` — schema becomes types, the guarantee shown the way the
  editor shows it
- voiceover: "Define your schema once — Prisma generates a fully type-safe
  client."
- duration: 7.0s
- transition_in: blur-crossfade (focus-pull)
- status: locked
- src: IntroducingPrismaDemo → SchemaScene
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: control + ease
- blueprint: cursor-ui-demo — one workflow, end to end
- asset_candidates: (live code cards; real schema and client snippets from
  the Prisma docs)

narrativeRole: the signature Prisma moment — the one idea the whole
product rests on, acted out in two cards.
keyMessage: your schema compiles into your client.

## Frame 5 — The montage: type-safe queries

- scene: whip-pan left into station 1; the label lands center then glides
  to its seat as the fragment rises — `where: { em▮` with the autocomplete
  menu offering `email — String`, `name — String?`. Type-safety acted,
  not told
- voiceover: "Type-safe queries."
- duration: 2.7s
- transition_in: push-slide LEFT (whip-pan)
- status: locked
- src: IntroducingPrismaDemo → TypeSafeStation
- type: feature_showcase
- persuasion: Feature-to-benefit translation
- beat: control
- blueprint: device-surface-showcase — experienced inside its real
  interface
- asset_candidates: (live code card)

narrativeRole: advantage one — the schema suggests itself as you type.
keyMessage: autocomplete comes from your models.

## Frame 6 — The montage: typed relations

- scene: whip-pan left; two model cards — User and Post — rise, their
  fields cascade, then the `@relation` curve draws itself from
  `posts Post[]` to `author User?`, a "one to many" caption lands at its
  midpoint and a pulse keeps riding the connection (the NEW
  `relation-graph` component)
- voiceover: "Relations, typed end to end."
- duration: 3.1s
- transition_in: push-slide LEFT (whip-pan)
- status: locked
- src: IntroducingPrismaDemo → RelationsStation (RelationGraph)
- type: feature_showcase
- persuasion: Feature-to-benefit translation
- beat: control + clarity
- blueprint: device-surface-showcase — the schema's connections made
  visible
- asset_candidates: (live model cards from the docs' User/Post schema)

narrativeRole: advantage two — the relation is a living, typed
connection, not a string you hope exists.
keyMessage: relations are first-class and typed.

## Frame 7 — The montage: declarative migrations

- scene: whip-pan left; `npx prisma migrate dev`, the schema diff
  `+ published Boolean @default(false)`, then ✔ Applying migration
  `20260718_add_published`
- voiceover: "Declarative migrations."
- duration: 2.7s
- transition_in: push-slide LEFT (whip-pan)
- status: locked
- src: IntroducingPrismaDemo → MigrationsStation
- type: feature_showcase
- persuasion: Friction reduction
- beat: confidence
- blueprint: device-surface-showcase
- asset_candidates: (live terminal card)

narrativeRole: advantage two — the schema drives the database, not the
other way around.
keyMessage: migrations are declarations, not scripts.

## Frame 8 — The montage: every database

- scene: whip-pan left; `provider = "…"` rolodexes through postgresql →
  mysql → sqlite → mongodb → cockroachdb — the same schema, every
  database, the closing quote hugging each name
- voiceover: "Every database you already run."
- duration: 2.7s
- transition_in: push-slide LEFT (whip-pan)
- status: locked
- src: IntroducingPrismaDemo → DatabasesStation
- type: feature_showcase
- persuasion: Value stacking, shown not told
- beat: ease + momentum
- blueprint: kinetic-type-beats — the key token swaps in place; the swap
  is the story
- asset_candidates: (live code card; provider list from the repo README)

narrativeRole: advantage four — no lock-in, proven by one flipping token.
keyMessage: bring your own database.

## Frame 9 — The montage: browse your data

- scene: whip-pan left; Prisma Studio opens on the User model — rows
  populate (alice@prisma.io, bob@, grace@), "+ Add record" types a fourth
  (ada@prisma.io), the Save button appears, presses itself and resolves
  to ✔ Saved; the footer counts 4 records (the NEW `prisma-studio`
  component)
- voiceover: "And Studio — your data, browsable."
- duration: 3.9s
- transition_in: push-slide LEFT (whip-pan)
- status: locked
- src: IntroducingPrismaDemo → StudioStation (PrismaStudio)
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: ease + delight
- blueprint: device-surface-showcase — experienced inside its real
  interface
- asset_candidates: (live Studio sim; docs-real sample data)

narrativeRole: the montage crescendo — the GUI payoff of the toolkit,
Client and Migrate's quiet sibling.
keyMessage: your data is one click away.

## Frame 10 — The platform

- scene: back in the calm world; three lines slide in one after another
  and hold as a block
- voiceover: "Start with the ORM. Add Postgres when you need it. Deploy on
  Compute."
- duration: 3.5s
- transition_in: blur-crossfade (focus-pull out of the montage)
- status: locked
- src: IntroducingPrismaDemo → PlatformScene
- type: benefit_highlight
- persuasion: Future pacing — the viewer's path laid out
- beat: clarity + aspiration
- blueprint: grid-card-assemble — an accumulating value list
- asset_candidates: (typography-only)

narrativeRole: escalates from one tool to the full TypeScript path — the
site's own product order.
keyMessage: one platform when you need more.

## Frame 11 — Proof

- scene: the count eases into 47,300 (tabular digits, no suffix tricks),
  then "GitHub stars" slides in and the pair shares a center — over the
  glassy prism field
- voiceover: "47,000 GitHub stars — the ORM TypeScript already chose."
- duration: 4.0s
- transition_in: crossfade
- status: locked
- src: IntroducingPrismaDemo → ProofScene
- type: social_proof
- persuasion: Statistical proof
- beat: belonging + inevitability
- blueprint: dataviz-countup — the data IS the argument
- asset_candidates: (typography-only; count verified against
  github.com/prisma/prisma)

narrativeRole: one number that says the ecosystem already decided.
keyMessage: you are not early and alone.

## Frame 12 — Getting started (the hook to action)

- scene: a terminal card types the real flow — `npx prisma init` → ✔ Your
  Prisma schema was created at prisma/schema.prisma → `npx prisma
generate` → ✔ Generated Prisma Client — then the card lifts and quiets
  and the frame yields to the one place to go: "Start at prisma.io"
- voiceover: "Two commands — init, generate — and you're typed. Start at
  prisma.io."
- duration: 5.8s
- transition_in: zoom-through (push-through into the action)
- status: locked
- src: IntroducingPrismaDemo → GettingStarted
- type: cta
- persuasion: Friction reduction
- beat: motivation → urgency-to-act
- blueprint: typewriter-reveal — someone is typing this; resolves into the
  CTA
- asset_candidates: (real CLI commands and their real output lines)

narrativeRole: turns desire into a single first action — the getting
started IS the call to action.
keyMessage: two commands, then prisma.io.

## Frame 13 — The lockup

- scene: the field opens to full brightness — the smoke the whole video
  lived inside, finally seen at scale; the official lockup stands alone at
  center, prisma.io faint beneath
- voiceover: "Prisma — prisma.io."
- duration: 5.0s
- transition_in: blur-crossfade
- status: locked
- src: IntroducingPrismaDemo → OutroScene
- type: branding
- persuasion: Brand stamp
- beat: peace of mind + inevitability
- blueprint: logo-assemble-lockup — the mark holds dead-center
- asset_candidates: (official press-kit lockup)

narrativeRole: the brand stamp — the name and the place to go, nothing
else on screen.
keyMessage: Prisma — prisma.io.

---

## Transition grammar

| Cut                      | Presentation                                    |
| ------------------------ | ----------------------------------------------- |
| Hook → Reveal            | push-through (the travel ends, the dive begins) |
| Reveal → What            | crossfade (same world, calm)                    |
| What → Mechanism         | focus-pull (editorial shift)                    |
| Mechanism → Montage ×3   | whip-pan left (one enumeration axis)            |
| Montage → Platform       | focus-pull (montage ends, calm resumes)         |
| Platform → Proof         | crossfade                                       |
| Proof → Getting started  | push-through (into the action)                  |
| Getting started → Lockup | blur-crossfade (backgrounds differ)             |

One continuous gem-smoke field under everything, its intensity scored
from the root: 1× for type, 1.5× across the reveal, 0.7× under code,
1.85× for the outro. The camera never resets against the previous cut's
momentum.
