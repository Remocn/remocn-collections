# STORYBOARD — Tegami launch video

> Step 3 (Story design) output. Narrative plan, one frame per beat. Spoken narration is locked in `SCRIPT.md`.
> Layout / composition / motion are decided in Step 4 — this file only fixes WHAT is said, in WHAT order, and the candidate SHAPE of each beat.

## Brief (locked)

- **Angle:** "Introducing" product demo — a release tool that feels like writing a letter.
- **Length:** ~55s (12 beats).
- **Aspect ratio:** 16:9 (1920×1080).
- **Language:** English (product + docs are English).
- **VO_MODE:** none provided → narration written here, in each beat's blueprint shape.

## The world / style (from the actual Tegami brand)

Pulled from the repo's `banner.png`, `logo.png`, and the Fumadocs-neutral docs site — **use this, not a generic dev-tool look:**

- **Monochrome ink on paper.** Pure black (#111) line art on warm white (#FAFAF8) paper. **No color accent** — restraint is the identity. Optional faint paper grain only.
- **Hand-drawn / sketch linework.** Wobbly marker strokes, hand-scribbled checkboxes, doodled arrows. The brand mark is literally a felt-pen sketch.
- **The てがみ mascot.** A simple line-drawn character holding a giant brush, with the handwritten note **"record your changes!"** — it can wave, paint, point, hand off the pen.
- **Two typefaces only:** a bold geometric sans (Inter / Geist-like) for the `Tegami` wordmark and headline cues; a **handwritten script** for annotations ("record your changes!", margin notes, arrows). Code uses a clean monospace (e.g. Geist Mono).
- **Japanese kana motif.** 手紙 / てがみ appears as a quiet watermark and in the lockup — the "letter" metaphor is the spine of the whole video.
- **Voice:** warm, human, plain, low-hype, a little playful — direct address to a developer. Short lines. Never "unlock the power of."

**Creative spine:** *Shipping a release should feel as simple as writing a note.* Every beat ties back to the letter metaphor — chaos gets turned into one tidy, hand-written note you (or your AI agent) record, and Tegami delivers it.

## Product truth

- **Audience:** maintainers who publish packages from a monorepo (TS/JS libs, and beyond — npm, Cargo, PyPI).
- **Pain:** releasing is manual toil — bump versions, fix workspace dep ranges, write changelogs, cut releases, post announcements; or you roll a brittle CI script; or you use Changesets and hit its walls.
- **Promise:** Tegami turns your whole release pipeline into one Node.js script you own — changelogs → version → publish — across any registry.
- **Product role:** a script-first, plugin-first release tool.
- **Proof:** it's a script (`scripts/tegami.mts`), not a black-box CLI/bot · plugin-first (github, npm, cargo, pip, git, gitlab) · 3-phase cycle · write changes as Markdown in `.tegami/` or from conventional commits · `tegami` / `tegami version` / `tegami publish` / `tegami ci` · familiar two-PR "Version Packages" flow + GitHub releases · publish lock in git → failed publishes are safe to retry · cross-registry monorepos · programmatic API (`willPublish()`, `draft()`, `publish()`) · `tegami init-agent` so AI agents write changelogs · easy migration from Changesets.
- **CTA:** `npm install tegami -D` · tegami.fuma-nama.dev

## Arc

**BAB (Before → After → Bridge)** with a feature→benefit rhythm inside the demo. Chosen because Tegami's whole identity is *replacing the old release workflow (manual scripts / Changesets) with a better one you own* — and the bridge (the script) IS the product. Beat order: before → after-tease → bridge/product → step 1 → step 2 → step 3 → wow → wow → delight → trust → CTA.

## Asset note

No capture pipeline (`capture/extracted/asset-descriptions.md`) was run for this project, so there is **no screenshot inventory to draw from**. This video is illustration- and code-typography-driven by design (ink-on-paper world), so beats are authored in-composition. The only two **real** brand files available are `assets/logo.png` and `assets/banner.png` (pulled from the repo). No screenshot filenames are invented; code panels, the mascot, and UI mock chrome are drawn/typeset in the composition.

---

## Frame 1 — Release-day avalanche

- scene: a lone マ mascot at a desk; release chores scribble in from every edge and pile up — checkboxes, version numbers, a changelog, a tag, an "announce" note — until they surround it.
- voiceover: "Bump the versions. Fix the dependency ranges. Write the changelog. Cut the release. Post the announcement — every single time you ship."
- duration: 7
- transition_in: cut
- status: outline
- src: compositions/frames/01-release-avalanche.html
- type: hook
- persuasion: Pain agitation
- beat: overwhelm
- blueprint: overwhelm-surround — recognizable chores pile in and bury the viewer; the pain is being swamped, not one bad number
- asset_candidates: (authored in composition) — hand-scribbled chore cards (version bump, dep range, changelog, tag, announce) closing in on the mascot

narrativeRole: Open on the felt pain of release day so the maintainer sees themselves instantly.
keyMessage: Shipping a release is death by a hundred manual steps.

## Frame 2 — The old fixes break

- scene: two scribbled escape hatches fail in turn — a hand-drawn "release.sh" script cracks down the middle; a Changesets-style box slams shut with walls around it.
- voiceover: "So you write a release script — and it breaks. Or you reach for Changesets — and hit its walls."
- duration: 5
- transition_in: crossfade
- status: outline
- src: compositions/frames/02-old-way-breaks.html
- type: pain_point
- persuasion: Negative contrast
- beat: frustration
- blueprint: kinetic-type-beats — two short pain statements land solo, the key word ("breaks", "walls") snapping in
- asset_candidates: (authored in composition) — sketched cracking "release.sh" file; a boxed-in Changesets logo behind walls

narrativeRole: Close the exits — the obvious alternatives don't actually solve it.
keyMessage: Both rolling-your-own and Changesets leave you stuck.

## Frame 3 — Meet Tegami

- scene: on blank white paper, a brush draws itself — first the kana てがみ, then the bold "Tegami" wordmark locks up beside it; the mascot gives a small wave.
- voiceover: "Meet Tegami — 手紙. A letter. Releasing, as simple as writing a note."
- duration: 4
- transition_in: zoom-through
- status: outline
- src: compositions/frames/03-meet-tegami.html
- type: product_intro
- persuasion: Future pacing (reframe the whole task)
- beat: curiosity + relief
- blueprint: logo-assemble-lockup — the ink mark draws itself on and the wordmark completes the lockup; VO is just the name + the reframe
- asset_candidates: assets/logo.png — hand-drawn てがみ brush mark (real brand file); assets/banner.png — full lockup + mascot reference

narrativeRole: Name the product and reframe release work as something small and human — writing a note.
keyMessage: Tegami = a letter; releasing should feel that simple.

## Frame 4 — A script you own

- scene: a clean editor window draws on; `scripts/tegami.mts` types in — `tegami({ plugins: [github(...)] })` then `runCli(paper)`. A handwritten margin arrow points at it: "yours — read it, change it."
- voiceover: "Tegami isn't a CLI you fight. It's one Node script — that you own, and can read."
- duration: 5
- transition_in: zoom-through
- status: outline
- src: compositions/frames/04-a-script-you-own.html
- type: product_intro
- persuasion: Friction reduction (transparency / ownership)
- beat: clarity + control
- blueprint: device-surface-showcase — the editor window is the hero; the config flow reveals inside its real surface
- asset_candidates: (authored in composition) — monospace panel of scripts/tegami.mts (github plugin + runCli); handwritten margin annotation

narrativeRole: Deliver the core paradigm — the bridge from old workflow to new is a script you control.
keyMessage: The release pipeline is a script you own, not a black box.

## Frame 5 — Write the note (Changelogs)

- scene: a terminal runs `tegami`; an interactive prompt becomes a tidy Markdown note dropping into the `.tegami/` folder — `packages: @acme/ui: minor` + a one-line heading. The mascot's "record your changes!" sits in the corner.
- voiceover: "Run `tegami`. Describe the change like a quick note. It lands in `.tegami/` — or your commits write it for you."
- duration: 6
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/05-write-the-note.html
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: ease
- blueprint: cursor-ui-demo — one real multi-step flow shown end to end: run → prompt → the note file appears
- asset_candidates: (authored in composition) — terminal `tegami` prompt; a `.tegami/2026-06-19-abc123.md` note card with frontmatter

narrativeRole: Phase 1 of the cycle — capturing a change is as light as a sticky note.
keyMessage: A changelog is just a short note in `.tegami/`.

## Frame 6 — Version & lock

- scene: `tegami version` runs; notes flow in, version numbers tick up across packages, manifests update — then the frame hands off to one card: `.tegami/publish-lock.yaml`.
- voiceover: "`tegami version` reads your notes, computes every bump, updates the manifests — and locks the release."
- duration: 6
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/06-version-and-lock.html
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: confidence
- blueprint: video-text-pivot — the command runs, then yields the frame to the artifact it produced (the publish lock)
- asset_candidates: (authored in composition) — package version numbers incrementing; resolved `publish-lock.yaml` card

narrativeRole: Phase 2 — the tedious bump math is computed and pinned down for you.
keyMessage: One command turns notes into exact, locked version bumps.

## Frame 7 — Merge, and it ships

- scene: `tegami ci` on `main` opens a "Version Packages" PR (drawn GitHub PR card); a hand checks the merge box; packages publish and GitHub release tags pop out beneath.
- voiceover: "On `main`, `tegami ci` opens a Version Packages PR. Merge it — and your packages publish, with GitHub releases to match."
- duration: 7
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/07-merge-and-ship.html
- type: feature_showcase
- persuasion: Feature-to-benefit translation (automation → shipped releases)
- beat: control
- blueprint: cursor-ui-demo — the two-PR flow shown end to end, landing on the published releases
- asset_candidates: (authored in composition) — "Version Packages" PR card; merge action; published package + GitHub release tags

narrativeRole: Phase 3 — the familiar Changesets-style two-PR flow, finished automatically.
keyMessage: Merge one PR and the whole release ships itself.

## Frame 8 — Not just npm

- scene: the Tegami mark sits center; registry nodes — npm, Cargo, PyPI, "…" — orbit and connect into it with inked lines; one pipeline feeds them all.
- voiceover: "And not just npm. Cargo, PyPI, more — one release pipeline for your whole monorepo."
- duration: 5
- transition_in: zoom-through
- status: outline
- src: compositions/frames/08-not-just-npm.html
- type: benefit_highlight
- persuasion: Value stacking (breadth)
- beat: awe
- blueprint: constellation-hub — registries orbit the product mark; "it sits at the center of your whole release."
- asset_candidates: (authored in composition) — npm / Cargo / PyPI nodes inked around the Tegami hub

narrativeRole: Widen the promise past JS — Tegami is cross-registry where Changesets is not.
keyMessage: One pipeline releases every package, on every registry.

## Frame 9 — Safe, pluggable, programmable

- scene: three hand-drawn cards pop into a row — a publish lock sitting safely in a git branch ("retry, no harm"), a stack of plugin chips (github · npm · cargo · git), and a snippet of the programmatic API (`willPublish()`, `draft()`, `publish()`).
- voiceover: "The publish lock lives in git — so a failed publish is just a retry. Every step is a plugin. Every step is programmable."
- duration: 6
- transition_in: crossfade
- status: outline
- src: compositions/frames/09-safe-pluggable-programmable.html
- type: benefit_highlight
- persuasion: Risk reversal + value stacking
- beat: peace of mind
- blueprint: grid-card-assemble — short value cards self-assemble to show breadth at once
- asset_candidates: (authored in composition) — git-tracked publish-lock card; plugin chips; API snippet card

narrativeRole: Stack the differentiators that make Tegami safe and extensible.
keyMessage: Retry-safe by design, and bendable to any workflow.

## Frame 10 — Let the agent write it

- scene: the mascot hands its brush to a small line-drawn robot; a `.tegami/` note types itself out, word by word, under a typewriter caret — authored by the agent after `tegami init-agent`.
- voiceover: "Run `tegami init-agent` — and your AI agent writes the changelog for you."
- duration: 4
- transition_in: crossfade
- status: outline
- src: compositions/frames/10-agent-writes-it.html
- type: feature_showcase
- persuasion: Delight + future pacing
- beat: delight
- blueprint: typewriter-reveal — the note is typed live, as if the agent is writing the letter itself
- asset_candidates: (authored in composition) — robot taking the brush; a `.tegami/*.md` note typing in under a caret

narrativeRole: A modern, on-brand delight beat — even the note-writing is automated.
keyMessage: Your AI agent can record the changes for you.

## Frame 11 — Coming from Changesets?

- scene: a busy `.changeset/` wall wipes away to one calm card: `.changeset/` → `.tegami/`, with a short checklist ticking off — "same two-PR flow."
- voiceover: "Already on Changesets? The flow is the same. Migrate in an afternoon."
- duration: 4
- transition_in: crossfade
- status: outline
- src: compositions/frames/11-coming-from-changesets.html
- type: social_proof
- persuasion: Risk reversal
- beat: reassurance + trust
- blueprint: titlecard-reveal — a busy open wipes to one clean, still value card; low motion is the point
- asset_candidates: (authored in composition) — `.changeset/` → `.tegami/` mapping card; small migration checklist

narrativeRole: Remove the switching cost for the most likely adopter.
keyMessage: Migrating from Changesets is familiar and quick.

## Frame 12 — Record your changes

- scene: the world condenses to one note: the install line `npm install tegami -D` written on paper; the Tegami lockup + mascot waving; the URL `tegami.fuma-nama.dev` underlined by a brush stroke; the handwritten "record your changes!" lands last.
- voiceover: "npm install tegami. Record your changes — Tegami ships the rest. tegami.fuma-nama.dev"
- duration: 5
- transition_in: zoom-through
- status: outline
- src: compositions/frames/12-cta.html
- type: cta
- persuasion: Friction reduction → call to act
- beat: motivation → urgency-to-act
- blueprint: cta-morph-press — the brand mark condenses into the single thing you do next: install + the URL
- asset_candidates: assets/logo.png — Tegami mark for the lockup; (authored in composition) — install line + URL + "record your changes!" annotation

narrativeRole: Land the one action and leave the tagline ringing.
keyMessage: Install it, write your note, ship — at tegami.fuma-nama.dev.
