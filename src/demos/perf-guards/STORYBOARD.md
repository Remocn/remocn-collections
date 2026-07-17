# STORYBOARD — Faster site, stronger guards

A changelog spot for the **2026-07-07 "performance-and-guards"** entry, told in the shipped
remocn.dev cinematic register (the introducing-remocn / introducing-shadcn / introducing-videorc
house style).

After ~30 seconds the viewer should know: **remocn got faster and safer — the site loads lighter,
and a set of guards keeps the library honest, so the component you install always matches the one
in the docs.** The heart is **trust**: a copy-paste registry lives or dies on "what I install is
what I saw."

- **Arc:** Feature-Benefit Cascade (category hook → title → perf feature/benefit → the guards, feature
  by feature → trust climax → lockup) — every infra feature translated into developer value, never
  stacked as raw features.
- **Length:** ~30s @ 30fps, 1280×720 (the guards run is the tunable slack — trim to ~26s).
- **Register:** the shipped remocn brand — warm obsidian `#141318`, ink `#f2f2f2`, muted
  `rgba(242,242,242,0.62)`, one lime accent `#C3E88D`. **Manrope 400 everywhere**; Geist Mono 400
  only for code/paths and the metric. **No letter-spacing**, sentence case, **no uppercase, no
  badges, no pulsing, no installation pills.**
- **Visual language:** one quiet **simplex-noise** field (obsidian, faint lime undertone) carries the
  whole video as the shared backdrop — the same single-field discipline as the introducing cuts. No
  image backdrop.
- **Register of proof:** two beats show tiny built UI (a source↔build compare panel; a CI checklist)
  rendered inline in the docs' own register — near-black panels, mono paths, a lime check. These are
  the only non-typographic beats; everything else is kinetic type. No captured assets anywhere.
- **Typography discipline:** each line is its own scene beat — no subtitles stacked under a headline.

---

## NEW REGISTRY TRANSITION — `sync-snap`

> The user asked for a brand-new transition (no swirl, no ripple — `swirl-dissolve` / `ripple-zoom`
> already exist and are out; `caret-wipe` was the typography demo's). `sync-snap` is this video's,
> and it IS the theme: the drift guard locks source and build into sync, so the transition locks the
> incoming scene into sync.

**What it is:** the incoming scene arrives as a faint, horizontally **offset ghost** (as if the two
copies have drifted apart), then the ghost **snaps into alignment** with the main copy on a short
spring settle — two images becoming one crisp frame. The outgoing scene fades out under it early.
No blur-scale (that's `blur-crossfade`), no rotation, no color shift — the signature is the
double-image *converging and locking*, which reads as "drift → matched."

- **Params:** `offset` (px the ghost starts shifted, default ~36), `direction` (`x` default | `y`),
  `ghostOpacity` (default ~0.35), `springy` settle. Factory `syncSnap(props)` → `TransitionPresentation`
  for `TransitionSeries`, paced with `linearTiming`.
- **Where used:** at the two section boundaries — into the features (Frame 2→3) and, most pointedly,
  into the guards (Frame 4→5), where the "lock into sync" motion literally previews the drift guard.
  Everywhere else stays on the restrained set (`crossfade`, `blur-crossfade`).
- **Step-4 note:** implement as `src/components/remocn/sync-snap.tsx`, add to the transitions registry,
  export `@remocn/sync-snap`. Both scenes transparent so the shared field shows through the converge.

---

## Frame 1 — The hook

- scene: bare obsidian canvas over the barely-moving simplex-noise field; one line lands, the key word "trust" resolving last and holding
- voiceover: "Copy-paste UI runs on trust."
- duration: 2.6s
- transition_in: cut (opening frame)
- status: outline
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Category truth — a registry is a promise that what you install is what you saw
- beat: recognition + a touch of skepticism
- blueprint: kinetic-type-beats — a punchy claim whose key word carries the weight
- asset_candidates: (typography-only)

narrativeRole: names the one thing a copy-paste library must earn — trust — before showing how this drop earns it.
keyMessage: a registry is only as good as your trust in it.

## Frame 2 — The title

- scene: same world; the update's own title lands as the promise
- voiceover: "Faster site, stronger guards."
- duration: 2.6s
- transition_in: crossfade (same world; the hook exits itself)
- status: outline
- src: compositions/frames/02-title.html
- type: product_intro
- persuasion: Value naming — the two things this drop delivers
- beat: intrigue → confidence
- blueprint: kinetic-type-beats — the two halves land beat by beat
- asset_candidates: (typography-only)

narrativeRole: the message (landed by beat 2) — this update is speed plus guardrails. Everything after is its evidence.
keyMessage: faster, and guarded.

## Frame 3 — Loads lighter

- scene: `sync-snap` locks the section in; one line lands — the lazy-mount feature
- voiceover: "Players now mount only when you scroll to them."
- duration: 2.4s
- transition_in: sync-snap (NEW registry transition — into the features)
- status: outline
- src: compositions/frames/03-mount.html
- type: feature_showcase
- persuasion: Feature-to-benefit translation — less mounted, less to load
- beat: ease
- blueprint: titlecard-reveal — the calm feature line
- asset_candidates: (typography-only)

narrativeRole: the first speed win, stated plainly — nothing renders until it's on screen.
keyMessage: players mount on scroll.

## Frame 4 — The weight drop

- scene: the hero video's size counts DOWN — 18.5 lands, then the digits fall and settle on 4.7, "MB" beside it; a quiet "nearly four times lighter" resolves under the number
- voiceover: "The hero video — 18.5 down to 4.7 megabytes."
- duration: 3.6s
- transition_in: crossfade (same perf world)
- status: outline
- src: compositions/frames/04-weight.html
- type: benefit_highlight
- persuasion: Statistical proof — one concrete number the eye pushes through
- beat: confidence + relief
- blueprint: dataviz-countup — the data IS the argument (a count-DOWN, the weight dropping)
- asset_candidates: (typography-only; plain numbers, no plus suffix; Geist Mono for the metric)

narrativeRole: turns "faster" into a number you can feel — the page got measurably lighter.
keyMessage: the hero video is nearly four times smaller.

## Frame 5 — The drift guard

- scene: two small panels in the docs' own register — left `registry/…` source, right the built component — a guard checks them and a lime check settles between them reading "match"; the caption resolves: "every push". This is the centerpiece guard.
- voiceover: "A guard checks the build against the source — every push."
- duration: 4.4s
- transition_in: sync-snap (NEW registry transition — the lock-into-sync motion previews the guard itself)
- status: outline
- src: compositions/frames/05-drift-guard.html
- type: feature_showcase
- persuasion: Risk reversal — the exact fear (installed code lagging the docs) named and closed
- beat: trust
- blueprint: comparison-split — two paired things shown in lockstep (source and build, always identical)
- asset_candidates: (inline source/build compare panel, built in Step 4; no captured assets)

narrativeRole: the hero guard — what you install can't silently drift from what the docs show.
keyMessage: build always matches source.

## Frame 6 — Every push, all four

- scene: a small CI checklist assembles in the docs' register — Lint, Typecheck, Tests, Drift guard — each row arriving and a lime check settling on it one after another; "on every push" holds beneath
- voiceover: "Lint, typecheck, tests, the drift guard — on every push."
- duration: 4.0s
- transition_in: crossfade (the guards section continues)
- status: outline
- src: compositions/frames/06-ci.html
- type: feature_showcase
- persuasion: Value stacking, shown as a settling checklist — the guards run themselves
- beat: control + confidence
- blueprint: grid-card-assemble — an accumulating checklist
- asset_candidates: (inline CI checklist, built in Step 4; no captured assets)

narrativeRole: shows the guards are automatic and complete — and that typecheck is back on, its real errors fixed rather than suppressed (the Typecheck row is the trust beat inside the list).
keyMessage: every guard runs on every push.

## Frame 7 — The render API, locked down

- scene: three hardening items snap in beat by beat, each clearing before the next — Trusted IPs, Capped queues, Allowlisted avatars
- voiceover: "Trusted IPs, capped queues, allowlisted avatars."
- duration: 3.0s
- transition_in: blur-crossfade (a distinct sub-topic — the backend, not the registry)
- status: outline
- src: compositions/frames/07-hardening.html
- type: benefit_highlight
- persuasion: Feature-to-benefit translation — the render endpoint is harder to abuse
- beat: security → peace of mind
- blueprint: kinetic-type-beats — rapid-fire value montage
- asset_candidates: (typography-only)

narrativeRole: extends "guards" past the registry to the render backend — the whole surface got safer.
keyMessage: the render API got tighter.

## Frame 8 — The trust climax

- scene: back in the calm world; three short lines slide in one after another and hold as a block
- voiceover: "Faster to load. Safe to render. Always in sync."
- duration: 3.2s
- transition_in: crossfade
- status: outline
- src: compositions/frames/08-values.html
- type: benefit_highlight
- persuasion: Value stacking, resolved into the throughline
- beat: confidence + trust
- blueprint: grid-card-assemble — an accumulating value list
- asset_candidates: (typography-only)

narrativeRole: compresses the whole drop into three memorizable claims — the payoff of "faster + guarded."
keyMessage: fast, safe, in sync.

## Frame 9 — The lockup (reused introducing-remocn outro, new logo)

- scene: the introducing-remocn OutroScene — a smoke ring blooms open from the dark; the new **R** mark draws its outline on while the fill catches up; then "emocn" slides out from behind it to assemble the **Remocn** wordmark; `remocn.dev` settles faint underneath. Reused at default tracking (drop the outro's -0.03em to honor the no-letter-spacing rule).
- voiceover: "Remocn — faster and guarded, at remocn.dev."
- duration: 5.0s
- transition_in: blur-crossfade (the smoke ring blooms from dark — masks the background change)
- status: outline
- src: compositions/frames/09-outro.html (import IntroducingRemocn → OutroScene / RemocnMark)
- type: branding
- persuasion: Brand stamp + destination + Risk reversal (open source, guarded)
- beat: trust + inevitability
- blueprint: logo-assemble-lockup — the mark draws itself on and the wordmark completes the lockup
- asset_candidates: (new logo mark recreated inline as SVG — the RemocnMark path)

narrativeRole: the brand stamp with the new logo — name, mark, and the one place to go.
keyMessage: remocn.dev.

---

## Transition map (repeat a small set)

| Boundary | transition_in | why |
| --- | --- | --- |
| — → F1 | cut | opening frame |
| F1 → F2 | crossfade | same world; hook exits itself |
| F2 → F3 | **sync-snap** | section boundary into the features (NEW) |
| F3 → F4 | crossfade | same perf world |
| F4 → F5 | **sync-snap** | into the guards — the lock-into-sync motion previews the drift guard (NEW) |
| F5 → F6 | crossfade | guards section continues |
| F6 → F7 | blur-crossfade | distinct sub-topic (backend, not registry) |
| F7 → F8 | crossfade | into the value climax |
| F8 → F9 | blur-crossfade | smoke-ring bloom from dark |

Internal reveals (rows in F5/F6, items in F7) are carried by the components' own settle motion, not frame transitions.

---

## Music

- music: confident minimal tech underscore — a steady pulse under the guards run, settling to a warm pad on the outro.
- No spoken VO track: this is a page video (changelog), text-driven like the introducing cuts.
  `SCRIPT.md` holds the locked on-screen copy; each line is revealed as it is named.

## Final checklist

- Arc named (Feature-Benefit Cascade); sequence is narrative-driven around the trust throughline.
- One hook that creates recognition + skepticism; the message (faster + guarded) lands by beat 2.
- Each beat has one job and a `type` / `persuasion` / `beat`.
- Story truth kept — every changelog fact placed (perf, weight, drift guard, CI/typecheck, hardening); none invented or bent to a blueprint.
- Shapes vary (kinetic-type, titlecard, dataviz count-down, comparison-split, grid checklist, rapid-fire, accumulating list, logo-lockup).
- Constraints honored: no letter-spacing, no uppercase, no badges, no pulsing, no install pills.
- No swirl / ripple; the NEW `sync-snap` is defined for the registry and used at the section boundaries.
- Outro is the reused introducing-remocn lockup with the new logo.
