# STORYBOARD — The remocn agent skill (changelog cut)

The changelog cut for the 2026-06-25 **"The remocn agent skill"** entry, made for the
changelog page itself. After ~28 seconds the viewer should know: **your AI agent now
knows remocn** — the skill teaches Claude Code and friends which components exist, what
each one is for, and how to compose them, so "make me an intro scene" stops being a
guessing game — and this release ships three new components and a one-button install.

- **Arc:** BAB (the ask → the agent guessing → the skill → the catalog → the same ask,
  now working → new components → value → lockup). The changelog's own hinge line —
  *"stops being a guessing game"* — is the spine: we stage the ask, the guess, and the
  ask working, in that order.
- **Length:** ~28s @ 30fps, 1280×720.
- **Register:** inherited from introducing-remocn — the shipped remocn.dev brand: warm
  obsidian `#141318`, ink `#f2f2f2`, muted `rgba(242,242,242,0.62)`, one lime accent
  `#C3E88D`, Manrope 400 for all headings, Geist Mono only for the agent prompt, the
  catalog rows and the shell command. No letter-spacing, no uppercase, no badges, no
  pulsing, no installation pills — the command is a mono terminal line, never a pill.
- **Visual language:** one quiet simplex-noise field carries the whole video as the
  shared backdrop, exactly as the introducing-remocn cut. The point-of-view is the
  **agent's terminal** — the ask and the setup command are mono prompt lines — but the
  frame stays clean: no persistent chrome, so each beat reads on an empty canvas.
- **Pacing:** slow on purpose. Every beat holds long enough to read, and the transitions
  are unhurried — the catalog-riffle in particular snaps its row and HOLDS the snapped
  catalog a long beat before scene B grows in.
- **The NEW registry transition — `catalog-riffle`** (debuts here; not swirl, not
  ripple, not dither, not caret-wipe, not skeleton-swap, not ascii-dissolve, not
  sync-snap, not bubble-bloom): the cut IS the agent thumbing the catalog. The outgoing
  scene lifts as the frame fills with a fast vertical **riffle of mono catalog rows** —
  real remocn component names streaming past like a thumbed card index, motion-blurred
  by speed so the row text is felt, not read. A lime cursor sweeps down the column,
  **decelerates and snaps onto one row**; that row's rectangle then **grows** (a
  rect-to-rect expand, eased-out) to become the frame of the incoming scene, which
  resolves inside it as the riffle clears. The riffle hides the swap; the snap gives the
  cut a decision point. Thematically it is the skill's whole job made kinetic —
  *knowing what exists, and landing on the right one.* Used at the two section
  boundaries that mean "the agent chose" (into the skill, and into the new components);
  everywhere else is crossfade / blur-crossfade, per the house grammar.
- **Typography discipline:** each remocn text animation appears where its motion matches
  the message — scale-down-fade for solo statements, short-slide-right for a headline
  glide, kinetic-center-build for the payoff line assembling, line-by-line-slide for the
  accumulating value block. Mono only for the prompt, the catalog and the command.
- **Outro:** the introducing-remocn outro inherited verbatim with the new logo — a smoke
  ring blooms open, the R mark draws itself on, "emocn" slides out from behind it to
  assemble the Remocn wordmark, remocn.dev / open-source credit beneath.

---

## Frame 1 — The ask

- scene: bare obsidian over the shared simplex-noise field; the agent chrome `/remocn ›`
  fades in top-left, and on the center line a mono prompt types itself — `make me an
  intro scene` — landing with a soft block caret. This is the request every remocn user
  now makes, in its own words.
- voiceover: "Make me an intro scene."
- duration: 3.0s
- transition_in: cut (opening frame)
- status: outline
- src: compositions/frames/01-the-ask.html
- type: hook
- persuasion: Direct address — the workflow the viewer already lives in
- beat: recognition + curiosity
- blueprint: typewriter-reveal — someone is typing this
- asset_candidates: (typography-only; mono prompt)

narrativeRole: opens on the exact request the changelog is about, from the agent's own
prompt line — the viewer recognizes their own habit instantly.
keyMessage: you ask your agent to build the scene.

## Frame 2 — The guess

- scene: the caret from Frame 1 blinks, then where the answer should be, the agent
  **guesses** — a single mono slot cycles wrong-shaped tries one per beat, each landing
  and clearing (`blur-in?` → `fade?` → `…slide?`), a faint `?` trailing each. Nothing
  composes; the tries just churn. The stall is the pain.
- voiceover: "Your agent used to guess."
- duration: 2.7s
- transition_in: crossfade (same terminal world; the prompt stays put)
- status: outline
- src: compositions/frames/02-the-guess.html
- type: pain_point
- persuasion: Pain validation — it didn't know what remocn had
- beat: frustration → tension
- blueprint: kinetic-type-beats — one word swaps in place; the swap is the problem
- asset_candidates: (typography-only; mono guesses)

narrativeRole: names the real cost — the agent was flying blind, so the ask was a
gamble. Sets up the turn.
keyMessage: without the skill, it was guessing.

## Frame 3 — Meet the skill

- scene: the **catalog-riffle** debuts — the guessing slot lifts as a fast vertical
  riffle of mono component names streams up the frame; a lime cursor sweeps down,
  decelerates and snaps onto one row, and that row grows into the frame where "The
  remocn skill" resolves through scale + settle. The cut itself is the agent finally
  finding what it was reaching for.
- voiceover: "Now it knows remocn."
- duration: 3.4s
- transition_in: catalog-riffle (NEW — riffle of catalog rows → lime cursor snaps a row
  → the row grows into the incoming scene)
- status: outline
- src: compositions/frames/03-meet-the-skill.html
- type: product_intro
- persuasion: Category naming — the fix has a name
- beat: relief + intrigue
- blueprint: kinetic-type-beats — "Introducing…" name-drop
- asset_candidates: (typography-only)

narrativeRole: the turn — the skill lands as the answer to the guess, nothing else
competing.
keyMessage: the remocn skill.

## Frame 4 — What it teaches

- scene: three mono catalog rows resolve one after another and hold as a block, each a
  real line the skill hands the agent — `which components exist` / `what each one is for`
  / `how to compose them`. The lime cursor rests at the head of the stack. The skill's
  contents, in the changelog's own three phrases.
- voiceover: "Which components exist. What each one is for. How to compose them."
- duration: 3.6s
- transition_in: crossfade (same world as the name)
- status: outline
- src: compositions/frames/04-what-it-teaches.html
- type: feature_showcase
- persuasion: Rule of three — the three things it now knows
- beat: clarity
- blueprint: grid-card-assemble — an accumulating value list
- asset_candidates: (typography-only; mono catalog rows)

narrativeRole: the mechanism — the skill is a catalog the agent can read, spelled out
in three concrete lines.
keyMessage: it knows the whole catalog: what, why, and how to combine.

## Frame 5 — The ask, answered

- scene: the terminal prompt from Frame 1 returns verbatim — `make me an intro scene` —
  but this time it resolves: the agent **composes** a real scene live, three named
  components dealing into a stack (a title reveal, a shader field, a lockup) and settling
  into a tiny built intro, the mono prompt sitting calm above it. The guess is gone; the
  answer is a scene.
- voiceover: "So 'make me an intro scene' just works."
- duration: 4.0s
- transition_in: blur-crossfade (backgrounds differ — the composed scene has its own
  surface; the blur masks the change)
- status: outline
- src: compositions/frames/05-ask-answered.html
- type: benefit_highlight
- persuasion: Before/after contrast — the same ask, now delivered
- beat: satisfaction + control
- blueprint: cursor-ui-demo — one workflow, end to end
- asset_candidates: (typography-only + live-rendered scene sim; no captured assets)

narrativeRole: the payoff — the exact request from the hook now produces a real scene,
closing the guessing-game loop.
keyMessage: the ask that used to gamble now composes.

## Frame 6 — Works with your AI

- scene: the **catalog-riffle** returns — the agent thumbs the catalog again — and lands
  on "Works with your AI": the AI-company marks spring in through the shipped
  **logo-enter** component (Claude, OpenAI, Cursor, Grok — the component's real vendored
  marks), the ringed circles overlapping into one row. The skill isn't tied to one
  agent; it runs inside whichever you use.
- voiceover: "Works with your AI."
- duration: 4.7s
- transition_in: catalog-riffle (NEW — reused; the cursor snaps the catalog and lands on
  the AI-support beat)
- status: outline
- src: compositions/frames/06-works-with-your-ai.html
- type: benefit_highlight
- persuasion: Authority by association — it plugs into the agents the viewer already uses
- beat: belonging + confidence
- blueprint: logo-assemble-lockup — brand marks springing into a row
- asset_candidates: (logo-enter component with its vendored AI marks, no captured assets)

narrativeRole: widens the promise — the skill works across every AI agent, not one, shown
with their own marks.
keyMessage: your agent, whichever it is, can build with remocn.

## Frame 7 — Add one, or add them all

- scene: back in the calm world; a compact components-page fragment resolves — a short
  column of component rows, each with its own quiet add control — then a single lime
  **install-all** control lands at the top and one sweep checks every row at once. The
  page's new one-button install, shown doing its one job.
- voiceover: "Add one — or add the whole catalog with one button."
- duration: 2.9s
- transition_in: crossfade (out of the montage, back to the calm surface)
- status: outline
- src: compositions/frames/07-install-all.html
- type: benefit_highlight
- persuasion: Friction reduction — comprehensive access in one click
- beat: ease
- blueprint: cursor-ui-demo — one specific action, landing on the result
- asset_candidates: (live-rendered components-page sim, no captured assets)

narrativeRole: the release's second improvement — the install-all button — shown as a
single satisfying action.
keyMessage: install one component, or the entire catalog, in one click.

## Frame 8 — The value

- scene: three short lines slide in one after another and hold as a block, the offer
  compressed — `Your agent builds with remocn` / `The catalog it can read` / `The code
  is still yours`.
- voiceover: "Your agent builds with remocn. A catalog it can read. And the code is
  still yours."
- duration: 3.3s
- transition_in: blur-crossfade
- status: outline
- src: compositions/frames/08-the-value.html
- type: benefit_highlight
- persuasion: Value stacking — capability, knowledge, ownership
- beat: confidence
- blueprint: grid-card-assemble — an accumulating value list
- asset_candidates: (typography-only)

narrativeRole: compresses the release into three memorizable claims and re-asserts the
ownership promise that never changes.
keyMessage: agent-buildable, catalog-driven, still yours.

## Frame 9 — Get the skill

- scene: back on the mono terminal surface, the setup command types itself alone in the
  center — `npx skills add Remocn/remocn`, the `Remocn/remocn` slug in lime — landing
  with a block caret. One line, a terminal command, never a pill.
- voiceover: "npx skills add Remocn/remocn — that's the whole setup."
- duration: 3.2s
- transition_in: crossfade (same terminal world, out of the value block)
- status: outline
- src: compositions/frames/09-get-the-skill.html
- type: cta
- persuasion: Friction reduction — one command wires the agent up
- beat: control + ease
- blueprint: typewriter-reveal — someone is typing this
- asset_candidates: (mono command, no captured assets)

narrativeRole: the mechanism made concrete — one command installs the skill into the
agent, in the ecosystem's own `npx skills add` form.
keyMessage: one command sets the skill up.

## Frame 10 — Lockup and CTA

- scene: the inherited introducing-remocn outro plays: a smoke ring blooms open from the
  dark, the R mark
  draws itself on in the center, "emocn" slides out from behind it to assemble the Remocn
  wordmark, and the open-source credit / remocn.dev resolves faint beneath.
- voiceover: "remocn. Open source — at remocn.dev."
- duration: 5.0s
- transition_in: blur-crossfade (into the OutroScene inherited from introducing-remocn)
- status: outline
- src: compositions/frames/09-outro.html
- type: branding
- persuasion: Risk reversal (open source) + destination
- beat: trust + inevitability
- blueprint: logo-assemble-lockup — elements clear, the lockup draws itself in
- asset_candidates: (R mark recreated inline as SVG, per introducing-remocn OutroScene)

narrativeRole: the brand stamp — name, mark, and the one place to go.
keyMessage: remocn.dev.

---

## Notes for Step 4 (visual design / build)

- **Reuse, don't rebuild:** the whole video lives in the introducing-remocn world.
  Import its `ShaderSimplexNoise` backdrop + `Scrim`, its `OutroScene` (the new-logo
  smoke-ring lockup) verbatim, and its typography components (`ScaleDownFade`,
  `ShortSlideRight`, `KineticCenterBuild`, `LineByLineSlide`). Match its scene-timing
  constants and its `SANS` / `MONO` bindings.
- **`catalog-riffle` is the one genuinely new build** — author it as a
  `TransitionPresentation` factory (`catalogRiffle()`) so it can graduate to the
  registry, mirroring how `caret-wipe` (typography cut) and `sync-snap` (perf-guards cut)
  were introduced. Rows should be a deterministic sample of real remocn component names
  (seed with `@remotion/random`, never `Math.random()`); the row→scene rect-grow rides
  the incoming child.
- **Skill-install command (confirmed):** `npx skills add Remocn/remocn`, typed as a mono
  terminal line in Frame 9 (never an install pill). The `Remocn/remocn` slug reads in
  lime, matching the `@remocn/...` accent treatment in the sibling cuts.
- **Anti-slop, inherited:** one accent (lime), sentence case, no letter-spacing, no
  uppercase, no badges, no pulsing, no install pills, no plus-suffix on any number, no
  swirl or ripple transitions anywhere.
