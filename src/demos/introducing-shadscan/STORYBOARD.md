# STORYBOARD — Introducing shadscan

An introducing spot for shadscan (shadscan.com) — the deterministic UI auditor for React
shadcn apps, from OrcDev. The viewer ships shadcn UI with an AI coding agent and reviews it
by eye; after ~35 seconds they should know: **one terminal command statically audits the app
across six categories, scores it 0–100 with evidence and fixes for every finding, hands the
findings to the coding agent, and the rescan proves the fix — the same score on every run, so
it can gate CI.**

## Product truth (from `shadscan.com` + `/docs`)

- **Audience** — developers shipping React shadcn apps with AI coding agents (Claude Code,
  Codex, Grok); teams who want a UI quality gate in CI.
- **Pain / desire** — agent-generated shadcn UI _looks_ right and ships accessibility, state,
  form, and composition regressions; review is by eye, and asking an LLM to re-check gives a
  different answer every run.
- **Promise** — deterministic UI audits for shadcn apps: the same result on every run, built
  for the terminal and for CI.
- **Product role** — one CLI, `pnpm dlx @shadscan/cli@next` (one-shot, no install): statically
  analyzes source and config, scores 0–100 across six categories (foundation, interaction,
  states, accessibility, forms, production-polish), prints evidence + suggested fixes, and
  hands the findings to the coding agent (`--prompt` / `--apply`) — then the rescan is the
  acceptance test. `--fail-under` gates CI; a GitHub Action and a pre-commit hook keep it
  gated.
- **Proof** — the terminal run itself: the category cascade, one real finding with a code
  frame, the score bar, the agent diff, the rescan landing 100/100.
- **CTA** — `pnpm dlx @shadscan/cli@next` + shadscan.com.

## Arc

**Demo Loop** — question → product intro → demo cycle 1 (the scan) → demo cycle 2 (the agent
handoff + rescan) → trust (the score as a CI gate) → CTA. The terminal session is one
unbroken shot across both demo cycles: the product is best shown working, and the working
surface IS the terminal.

## Register & rules

- **Length:** ~35s @ 30fps, 1280×720.
- **Brand:** shadscan's own register — the shadcn neutral dark tokens from the live
  stylesheet: `#0a0a0a` canvas, `#fafafa` ink, `#a1a1a1` muted, `#737373` faint, `#171717`
  card, hairline white/10. **Outfit** (the site's `--font-heading`) carries every spoken
  headline, **Nunito Sans** the secondary lines, **Geist Mono** the terminal and every
  command. The accent is monochrome white; the only chroma is terminal-semantic — green
  (passed / resolved), amber (issues / score), red (errors / gate) — colors the product's own
  output wears.
- **Logo:** the shipped mark (four scan-corner brackets + the inner diagonal pair, square
  caps, stroke-width 6 on a 64 grid) redrawn in code, stroke-drawn on; the wordmark is
  lowercase "shadscan" (the site's prose register).
- **Anti-slop:** no letter-spacing on any authored text, no uppercase, no badges, no pills,
  no installation pills, no pulsing, no confetti. The terminal chrome is drawn, not
  screenshot.
- **Backdrop:** flat `#0a0a0a` with a barely-there vignette — the brand is austere; the
  terminal and the ascii cover carry the texture.
- **Terminal:** one continuous session (scan → handoff → rescan) rebuilt from the
  react-doctor reference: two-row mac chrome (traffic lights, centered window title, named
  tab, `+`), chunked command typing, live scan counter, blur-in category cascade, a finding
  card with explanation → `⟶` fix → path → syntax-tinted code frame (amber line highlight,
  gutter `>`, caret under the token), the score line with an animated bar, an agent menu
  (`❯ Claude Code / Codex / Copy prompt`), the red/green diff, and the rescan counting up to
  `100/100`. Scroll is a step function — the buffer snaps, never glides.
- **Transitions:** NO swirl, NO ripple. The statement cover is the registry **ascii-dissolve**
  in text mode (used once): the hook decays into a fullscreen glyph field (` .:-=+*#%@`,
  ink glyphs on `#0a0a0a`, a sparse terminal-green scattering), the field holds readable as
  pure text, then "Meet shadscan" arrives as real type and the field opens a granular cavity
  around it (`enterStyle: "clearing"`). The rest: push-through into the terminal (the dive
  into the product), whip-pan left into the gate (enumeration travel), focus-pull into the
  CTA.
- **Music:** `music: none` — a wordless product video in this repo's demo register; no
  narration, no BGM. See SCRIPT.md.

---

## Frame 1 — Looks right

- scene: bare `#0a0a0a`; three short lines land solo, each replacing the last with a blurred
  rise-exit: "It looks right." → "It feels done." → "It ships broken." — the third line
  lands harder and stays
- voiceover: "It looks right. It feels done. It ships broken."
- duration: 3.7
- transition_in: cut
- status: outline
- src: IntroducingShadscanDemo → HookScene
- type: hook
- persuasion: Pain validation — the viewer's own "looks fine to me" review, named and indicted
- beat: recognition → tension
- blueprint: kinetic-type-beats — an escalation where the twist lands on the third beat
  (Outrank shape: "Getting traffic is hard. Insanely hard.")
- asset_candidates: (typography-only)

narrativeRole: states the wound in six words — agent-shipped UI passes visual review and
still ships regressions — so the audit reads as the missing step, not a new chore.
keyMessage: looking right is not being right.

## Frame 2 — Meet shadscan

- scene: the hook blurs out under the rising ascii field; the field holds as pure text, then
  a cavity opens around "Meet shadscan" as the real type resolves; above it the scan-corner
  mark stroke-draws itself on; beneath, the site's own H1 lands word by word: "Deterministic
  UI audits for shadcn apps"
- voiceover: "Meet shadscan — deterministic UI audits for shadcn apps."
- duration: 4.7
- transition_in: ascii-dissolve (text mode, enterStyle "clearing", enterText "Meet shadscan")
- status: outline
- src: IntroducingShadscanDemo → IntroScene
- type: product_intro
- persuasion: Category announcement — the category (deterministic UI audit) named with the
  product
- beat: relief + intrigue
- blueprint: logo-assemble-lockup — the mark assembles around the arriving name
- asset_candidates: (typography + code-drawn logo; no captured assets)

narrativeRole: answers the hook with the product and its one-word thesis — "deterministic" —
before any UI appears.
keyMessage: shadscan = deterministic UI audits for shadcn apps.

## Frame 3 — The scan

- scene: the camera dives into the product: a mac terminal springs in (two-row chrome, tab
  "shadscan"). `$ pnpm dlx @shadscan/cli@next` types, "Scanning components (48/48)…" ticks,
  and six category rows cascade in with a soft blur-in — foundation passed, interaction 2
  issues, states 1 issue, accessibility 3 issues, forms passed, production-polish 1 issue.
  One finding expands: "Accessibility: icon-only button has no accessible name", a two-line
  explanation, the `⟶` fix, the file path, and a syntax-tinted code frame — line 42
  highlighted amber, gutter `>`, caret under `<SearchIcon />`. The receipt lands: "64/100
  Needs work" with the amber bar animating to 64.
- voiceover: "One command. Six categories. Every finding with evidence and a fix — and a
  score."
- duration: 9.7
- transition_in: push-through
- status: outline
- src: IntroducingShadscanDemo → TerminalScene (phase 1)
- type: feature_showcase
- persuasion: Show-don't-tell proof — the real output, unedited, is the argument
- beat: clarity + control
- blueprint: agent-progress-theater — trigger → working theater → receipt: "Kick off the
  scan — it checks every component, flags what's broken, and scores it. Watch."
- asset_candidates: (code-drawn terminal; no captured assets)

narrativeRole: demo cycle 1 — proves the promise in the product's own habitat; the finding is
specific enough (aria-label on an icon-only button) that every shadcn user recognizes their
own code.
keyMessage: one command turns "looks fine" into a score with evidence.

## Frame 4 — The handoff

- scene: the same terminal, one continuous session (hard cut inside the shot — no transition):
  "Hand these findings to an agent?" — `❯ Claude Code / Codex / Copy prompt`; the selector
  steps and lands on Claude Code, the tab flips to "claude", a status line spins
  ("Fixing findings…"), and the diff lands: red `- <Button variant="ghost" size="icon">`,
  green `+ <Button … aria-label="Search">`. "✓ All findings resolved", "Rescanning…" — and
  the score counts up 64 → 100, the bar sweeping green: "shadscan score: 100/100".
- voiceover: "Hand the findings to your agent — evidence, fixes, acceptance criteria. Rescan:
  a hundred."
- duration: 8.8
- transition_in: cut (same terminal session continues)
- status: outline
- src: IntroducingShadscanDemo → TerminalScene (phase 2)
- type: feature_showcase
- persuasion: Friction reduction — the fix is a handoff with acceptance criteria, not a
  rediscovery; the rescan is the acceptance test
- beat: relief + power
- blueprint: transcript-scroll-artifact-reveal — the work scrolls past, then one line cashes
  it in on the artifact: the 100/100
- asset_candidates: (code-drawn terminal; no captured assets)

narrativeRole: demo cycle 2 — the loop that makes shadscan an agent-native tool rather than a
linter: deterministic findings in, verified fix out, score as proof.
keyMessage: the agent fixes from evidence, and the rescan proves it — 100/100.

## Frame 5 — The gate

- scene: whip-pan left off the terminal onto a bare stage; the line "Same source. Same
  score." lands word by word; beneath, a compact terminal card types
  `$ pnpm dlx @shadscan/cli@next --fail-under 80`, answers "score 71 — below the floor", and
  stamps "exit 1" in red; a quiet closing line settles: "Regressions don't merge."
- voiceover: "The same score on every run — so it can gate your CI. Regressions don't merge."
- duration: 4.3
- transition_in: whip-pan LEFT
- status: outline
- src: IntroducingShadscanDemo → GateScene
- type: benefit_highlight
- persuasion: Risk reversal — determinism is what makes the score a gate: the check that
  fails the merge
- beat: trust + inevitability
- blueprint: prompt-type-submit-generate — one typed command, one verdict printed
- asset_candidates: (typography + one small code-drawn terminal card)

narrativeRole: widens the promise from one terminal session to the team workflow — the audit
is reproducible, therefore it can be a gate (GitHub Action, pre-commit, `--fail-under`).
keyMessage: deterministic score = a gate CI can enforce.

## Frame 6 — One command

- scene: focus-pull into the outro: the scan-mark stroke-draws on at lockup size, "shadscan"
  resolves beside it; beneath, the one command types itself in mono —
  `pnpm dlx @shadscan/cli@next` — with a block caret holding; "shadscan.com" fades in last
  and the frame holds
- voiceover: "One command — pnpm dlx @shadscan/cli@next — and you know. shadscan.com."
- duration: 5.7
- transition_in: focus-pull
- status: outline
- src: IntroducingShadscanDemo → CtaScene
- type: cta
- persuasion: Friction reduction — no install, no config: one dlx command is the whole ask
- beat: motivation + ease
- blueprint: prompt-type-submit-generate — the closing invitation IS the typed command;
  the card holds with only the caret blinking
- asset_candidates: (typography + code-drawn logo)

narrativeRole: converts — the lockup for memory, the command for hands, the URL for later.
keyMessage: run `pnpm dlx @shadscan/cli@next`.

---

## Shape check

- Arc named (Demo Loop); the sequence is narrative-driven, not docs-order-driven (CI/docs
  detail compressed to one gate beat; the GitHub Action, pre-commit hook, `--json`, and
  category flags deliberately omitted — one idea per beat).
- The opening uses one hook strategy (pain escalation, three beats) — tension, not a company
  description.
- Each beat has one job; every beat has `type`, `persuasion`, `beat`, and a candidate
  `blueprint` whose script shape the VO line follows.
- VO lines are cue-segmented ("One command. Six categories. Every finding with evidence and a
  fix — and a score." hands the terminal its reveal cadence).
- Shapes vary: kinetic-type-beats, logo-assemble-lockup, agent-progress-theater,
  transcript-scroll-artifact-reveal, prompt-type-submit-generate ×2 — no shape repeated
  back-to-back.
- Story truth never bent: six real categories, real flags (`--fail-under`), the real command,
  the real tagline; the demo score (64 → 100) is illustrative, the finding is a real rule
  (accessibility: accessible name on icon-only buttons).
- Transitions from the approved set only: ascii-dissolve (once, the signature turn),
  push-through, whip-pan, focus-pull, one hard cut inside the continuous terminal session.
- UI demo is a multi-beat sequence on one surface (scan → finding → score → handoff → diff →
  rescan), not one isolated frame.
