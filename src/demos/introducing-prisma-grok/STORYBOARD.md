# STORYBOARD — Introducing Prisma

An introducing spot for Prisma (prisma.io) — the TypeScript data platform.
After ~38 seconds the viewer should know: **Prisma is schema-first type-safe
data access that grows into managed Postgres and compute** — one path from
model to production.

- **Arc:** Future Pacing with feature–benefit progression
  (imagine → name → mechanism ×3 → proof → action → lockup).
- **Length:** ~38s @ 30fps, 1280×720.
- **Register:** Official Prisma press-kit tokens —
  canvas near-black `#0b0c15`, ink `#f5f5f7`, muted `#9ca3af`,
  **one indigo accent** `#4C51BF` (official logo indigo), secondary teal
  `#14b8a6` only for the Postgres beat. **Barlow** for display type,
  **Inter** for body, **Roboto Mono** for schema/commands. No letter-spacing,
  no uppercase chrome, no badges, no eyebrows, no installation pills, no
  pulsing, no glow halos.
- **Logo:** Official press-kit Light Symbol + wordmark paths (white on dark),
  embedded and animated — never redrawn.
- **Shader choice (paper.design):** `neuro-noise` — a living web of fine
  filaments, the metaphor of a connected data graph. One quiet indigo-tinted
  field carries the whole video behind a vignette; a harder indigo bloom of
  the same shader covers the section cut into features. No swirl, no mesh
  rainbow, no grain dissolve.
- **Motion score:** narrative progress moves INTO the frame (push-through,
  dive into the triangle mark); enumeration always travels LEFT (whip-pans,
  content arriving from the right and decelerating). If a scene exits right,
  the next enters from the right. Nothing fades in without a direction.
- **music:** confident minimal tech underscore

---

## Product truth

- **Audience:** TypeScript developers building APIs, full-stack apps, agents.
- **Pain / desire:** unsafe queries, glue between ORM / DB / deploy, schema
  that drifts from the client.
- **Promise:** Your schema is the source of truth — type-safe queries, then
  Postgres and compute when you need them.
- **Product role:** the TypeScript path for data: ORM → Postgres → Compute.
- **Proof:** schema-generated client, 500k+ monthly active developers, open
  source ORM.
- **CTA:** try Prisma at prisma.io — start with the ORM.

---

## Frame 1 — Hook

- scene: bare dark canvas over quiet neuro-noise; three short kinetic lines
  land one after another in the center — "Raw SQL." / "Stringly-typed
  queries." / "Schema drift." — each replacing the last; hold on the last
  beat of tension.
- voiceover: "Raw SQL. Stringly-typed queries. Schema that drifts from your
  code."
- duration: 3.0s
- transition_in: cut (opening frame)
- status: outline
- src: IntroducingPrismaDemo → HookScene
- type: pain_point
- persuasion: Pain validation
- beat: friction → tension
- blueprint: kinetic-type-beats

narrativeRole: name the everyday TypeScript data pain before the product.
keyMessage: the old way is fragile.

## Frame 2 — Product reveal

- scene: the official Prisma triangle mark grows out of depth, settles, then
  the wordmark drives in from the right and docks into a rigid lockup; site
  line beneath — "Agent infrastructure for TypeScript."
- voiceover: "Meet Prisma."
- duration: 4.5s
- transition_in: zoom-through (dive into the mark)
- status: outline
- src: IntroducingPrismaDemo → RevealScene
- type: product_intro
- persuasion: category naming
- beat: relief + intrigue
- blueprint: logo-assemble-lockup

narrativeRole: brand lands as the answer, not a feature list.
keyMessage: Prisma.

## Frame 3 — Platform line

- scene: one clean centered claim assembles word by word.
- voiceover: "One platform for the full TypeScript path."
- duration: 3.0s
- transition_in: focus-pull
- status: outline
- src: IntroducingPrismaDemo → PlatformScene
- type: product_intro
- persuasion: Future pacing
- beat: clarity
- blueprint: kinetic-type-beats

narrativeRole: the promise in one sentence.
keyMessage: ORM, store, and run — one path.

## Frame 4 — ORM

- scene: whip-pan left into station 1. Left: label "Prisma ORM". Right: a
  glass schema block writes itself (`model User { … }`) then a generated
  client call (`prisma.user.findMany`) appears under it — schema becomes
  types.
- voiceover: "Define once. Generate a client with autocomplete and
  compile-time guarantees."
- duration: 3.6s
- transition_in: push-slide LEFT
- status: outline
- src: IntroducingPrismaDemo → OrmScene
- type: feature_showcase
- persuasion: Feature-to-benefit translation
- beat: control + ease
- blueprint: device-surface-showcase

narrativeRole: show the schema-first mechanism.
keyMessage: type-safe queries from your schema.

## Frame 5 — Postgres

- scene: whip-pan left. Label "Prisma Postgres". A calm data surface —
  pooling, production-ready — teal accent only on this station's wire pulse.
- voiceover: "Add managed Postgres when you need infrastructure — pooling
  included."
- duration: 3.6s
- transition_in: push-slide LEFT
- status: outline
- src: IntroducingPrismaDemo → PostgresScene
- type: feature_showcase
- persuasion: Friction reduction
- beat: confidence
- blueprint: titlecard-reveal

narrativeRole: optional next step on the same path.
keyMessage: real Postgres, ready for production.

## Frame 6 — Compute

- scene: whip-pan left. Label "Prisma Compute". Long-lived TypeScript
  processes near the data — APIs and agents, fewer serverless constraints.
- voiceover: "Deploy TypeScript apps as long-lived processes near your
  database."
- duration: 3.6s
- transition_in: push-slide LEFT
- status: outline
- src: IntroducingPrismaDemo → ComputeScene
- type: feature_showcase
- persuasion: Future pacing
- beat: power
- blueprint: titlecard-reveal

narrativeRole: close the path — run where the data lives.
keyMessage: compute designed for TypeScript agents and APIs.

## Frame 7 — Proof

- scene: a single number rises — "500k+" — with "monthly active developers"
  beneath, quiet and centered.
- voiceover: "Trusted by more than five hundred thousand developers every
  month."
- duration: 2.8s
- transition_in: blur-crossfade
- status: outline
- src: IntroducingPrismaDemo → ProofScene
- type: social_proof
- persuasion: Statistical proof
- beat: belonging + trust
- blueprint: dataviz-countup

narrativeRole: social scale without a logo wall.
keyMessage: you are not early and alone.

## Frame 8 — Getting started (prisma-grok)

- scene: the dedicated `PrismaGrok` component — a terminal line types
  `npx prisma init`, a minimal schema appears, then `prisma generate`
  succeeds. One clear action, not a feature dump.
- voiceover: "Start with the ORM. Free to try — no credit card."
- duration: 5.0s
- transition_in: zoom-through
- status: outline
- src: IntroducingPrismaDemo → PrismaGrok / GettingStartedScene
- type: cta
- persuasion: Friction reduction
- beat: motivation → urgency-to-act
- blueprint: cursor-ui-demo

narrativeRole: turn desire into a single first command.
keyMessage: you can start in one command.

## Frame 9 — Lockup

- scene: official mark + Prisma wordmark settle; prisma.io beneath; field
  breathes quietly.
- voiceover: "Prisma. prisma.io"
- duration: 4.5s
- transition_in: push-through
- status: outline
- src: IntroducingPrismaDemo → OutroScene
- type: branding
- persuasion: Authority by association (own brand lockup)
- beat: peace of mind
- blueprint: logo-assemble-lockup

narrativeRole: stamp the brand and the place to go.
keyMessage: prisma.io

---

## Transition grammar

| Cut | Presentation |
|-----|----------------|
| Hook → Reveal | push-through (into the mark) |
| Reveal → Platform | focus-pull |
| Platform → ORM | whip-pan left |
| ORM → Postgres | whip-pan left (montage) |
| Postgres → Compute | whip-pan left |
| Compute → Proof | focus-pull |
| Proof → Getting started | push-through |
| Getting started → Outro | focus-pull |

One continuous neuro-noise field under everything. Camera never resets
against the previous cut's momentum.
