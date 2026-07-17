# STORYBOARD — llms.txt for AI agents (changelog cut)

The changelog video for the 2026-07-06 entry "llms.txt for AI agents" — made to live at the
top of that changelog entry. The viewer already knows remocn; after ~30 seconds they should
know: **agents were learning remocn by scraping rendered HTML — a bad way to learn an API —
and now the docs are plain text at the addresses agents already look for**, via three routes:
`/llms.txt`, `/llms-full.txt`, and `.md` appended to any docs URL.

## Product truth (from `remocn.dev/changelog#2026-07-06-llms-txt` + the live `/llms.txt`)

- **Audience** — developers who build remocn videos with an AI agent (Claude Code, Cursor);
  changelog readers.
- **Pain / desire** — their agent was reading the docs by scraping the rendered site: markup
  noise around every real sentence, "a bad way to learn an API" (the entry's own words).
- **Promise** — the docs are plain text now, at the addresses agents already look for.
- **Product role** — three routes: `/llms.txt` lists every docs page with a short description;
  `/llms-full.txt` returns the whole documentation as one Markdown document; any docs page can
  be fetched as raw Markdown by appending `.md` to its URL.
- **Proof** — the real index pouring in, the real corpus streaming past, a real docs URL
  flipping from rendered to raw with two typed characters.
- **CTA** — none explicit; the changelog page itself carries the links. Brand outro closes.

## Arc

**BAB** — before (the agent buried in markup) → verdict (the entry's own hinge) → bridge
(plain text now, performed by the cut itself) → three route beats on one mono surface →
compression → brand stamp. The video's job on a changelog page is *show the mechanism*, so the
middle is the three addresses acting, not claims about them.

## Register & rules

- **Length:** ~30s @ 30fps, 1280×720.
- **Brand:** warm obsidian `#141318`, ink `#f2f2f2`, one lime accent `#C3E88D` — the shipped
  remocn.dev register. Manrope 400 for every spoken headline; Geist Mono only for URLs, markup
  noise, the index/corpus text, and the `.md` suffix.
- **Anti-slop:** no letter-spacing on any authored text, no uppercase, no badges, no pills,
  no pulsing, no installation pills. The outro wordmark keeps its inherited brand tracking only.
- **Backdrop:** one quiet simplex-noise field (the introducing-remocn family — same brand
  world, one release later) behind a vignette scrim, carrying the whole video.
- **Transitions:** NO swirl, NO ripple, NO skeleton-swap (last release's cover). The statement
  cover is a NEW registry transition, **ascii-dissolve** — the outgoing frame decomposes into a
  fullscreen field of monospace glyphs (a deterministic noise/luminance map drives a character
  ramp ` .:-=+*#%@`, ink glyphs on obsidian with a scattering of lime), the field holds fully
  readable ~500ms — the frame has literally become plain text — then the incoming scene
  resolves from the text. In its **text mode** (the turn) the outgoing scene blurs out under
  the rising field, and the incoming headline clears its own space via the "clearing" enter
  style: the dissolve order is biased by distance to the text, so cells near the headline
  vanish first and a granular cavity opens outward around it while the real type fades in —
  never previewed as ascii, never a flat fade. Used exactly twice at the section boundaries.
  The cut IS the release: rendered pixels → plain text → the next thing. Everything else is
  crossfade, hard cuts into self-exiting scenes, and one blur-crossfade family.

---

## Frame 1 — The other reader

- scene: bare obsidian canvas over the quiet noise field; one line lands solo via the family's settle-in, holds, lifts away: "Your agent reads the docs too"
- voiceover: "Your agent reads the docs too."
- duration: 2.2
- transition_in: cut
- status: outline
- src: LlmsTxtDemo → HookScene
- type: hook
- persuasion: Direct address — naming the reader the viewer didn't picture
- beat: recognition + curiosity
- blueprint: kinetic-type-beats — a punchy claim lands alone on a bare canvas
- asset_candidates: (typography-only)

narrativeRole: reframes the docs as something an agent consumes — the premise of the whole entry in six words.
keyMessage: your AI agent is a docs reader now.

## Frame 2 — The scrape

- scene: a clean docs sentence sits center in ink — a real line from the transitions docs — then mono markup crowds in from all four edges, one fragment per beat: `<div class="…">`, `<span data-…>`, `<nav>`, attribute noise, until the sentence is buried in tag soup and barely legible
- voiceover: "Until now it read them like this — by scraping the rendered site."
- duration: 3.5
- transition_in: crossfade
- status: outline
- src: LlmsTxtDemo → ScrapeScene
- type: pain_point
- persuasion: Show-don't-tell pain — the agent's-eye view of the docs
- beat: overwhelm
- blueprint: overwhelm-surround — markup piles in until it buries the one real sentence
- asset_candidates: (typography-only; markup fragments authored in mono)

narrativeRole: makes the invisible pain visible — the viewer watches a sentence they wrote for humans drown in what the agent actually received.
keyMessage: scraping the rendered site feeds the agent noise.

## Frame 3 — The verdict

- scene: the tag soup freezes and dims to faint; the entry's own verdict lands over it solo, nothing else moving: "A bad way to learn an API"
- voiceover: "A bad way to learn an API."
- duration: 2.2
- transition_in: cut (the verdict lands over the held noise — same visual world)
- status: outline
- src: LlmsTxtDemo → VerdictScene
- type: pain_point
- persuasion: Pain agitation in the changelog's own words
- beat: frustration → anticipation
- blueprint: kinetic-type-beats — the pain line lands alone
- asset_candidates: (typography-only)

narrativeRole: the entry's argument at its hinge — the last beat before the turn.
keyMessage: this had to change.

## Frame 4 — The turn

- scene: the ascii-dissolve cover debuts in text mode — the verdict blurs out as the glyph field rises and boils, holding readable (the markup has literally become plain text); then "Now the docs are plain text" arrives as REAL type and the field clears from the text outward — cells nearest the headline vanish first, a granular cavity opening around it as the rest dissolves; the scene plays its own exit so the next beat gets an empty canvas
- voiceover: "Now the docs are plain text."
- duration: 3.6
- transition_in: zoom-through (implemented as the NEW ascii-dissolve cover — the cut performs the release)
- status: outline
- src: LlmsTxtDemo → TurnScene
- type: product_intro
- persuasion: The mechanism performed by the transition itself
- beat: relief + intrigue
- blueprint: kinetic-type-beats — "Introducing…" name-drop
- asset_candidates: remocn/ascii-dissolve (new transition, debuting here)

narrativeRole: the turn — and the transition is the first proof: rendered noise dissolving into readable text is exactly what the release does.
keyMessage: plain text now.

## Frame 4b — The addresses

- scene: its own typographic beat — the promise glides in from the left and holds alone: "At the addresses agents already look for"
- voiceover: "At the addresses agents already look for."
- duration: 2.4
- transition_in: cut (the turn plays its own exit first — empty canvas handoff)
- status: outline
- src: LlmsTxtDemo → AddressesScene
- type: product_intro
- persuasion: Anchoring — llms.txt is a standard the agent already knows, not a remocn invention
- beat: clarity
- blueprint: titlecard-reveal — the calm value beat
- asset_candidates: (typography-only)

narrativeRole: the promise in the entry's own words — no discovery step, no configuration; agents find it on their own.
keyMessage: standard addresses, zero setup.

## Frame 5 — Route 1, the index

- scene: a quiet mono surface — `remocn.dev/llms.txt` types itself at the top (the path in lime), then the real index pours in beneath, line by line: docs paths, each with its one-line description, exactly as the live file reads
- voiceover: "llms.txt — every docs page, one line and a description."
- duration: 3.6
- transition_in: blur-crossfade (typography world → mono surface)
- status: outline
- src: LlmsTxtDemo → IndexScene
- type: feature_showcase
- persuasion: Show-don't-tell proof — the actual file, not a diagram of it
- beat: clarity + control
- blueprint: device-surface-showcase — the text file IS the surface, and it advances through the flow
- asset_candidates: (real llms.txt lines, authored in mono; no captured assets)

narrativeRole: the first route shown as itself — a text file so simple it needs no explanation.
keyMessage: /llms.txt is the map.

## Frame 6 — Route 2, the corpus

- scene: same surface, same address line — `llms.txt` flips in place to `llms-full.txt`, and the index beneath becomes a fast vertical stream: the whole documentation scrolling past as one Markdown document, headings and code fences flashing by too fast to read — the volume is the point
- voiceover: "llms-full.txt — the whole documentation, one Markdown file."
- duration: 3.2
- transition_in: crossfade (same surface — the in-place swap is the move)
- status: outline
- src: LlmsTxtDemo → CorpusScene
- type: feature_showcase
- persuasion: Value stacking by volume — everything, in one fetch
- beat: awe + momentum
- blueprint: kinetic-type-beats — the key token swaps in place; the swap is the story
- asset_candidates: (real docs Markdown for the stream, authored in mono; no captured assets)

narrativeRole: escalates route one — not a map this time, the whole territory in a single document.
keyMessage: one URL returns all of it.

## Frame 7 — Route 3, any page

- scene: same surface, now one real docs URL alone in the center — `remocn.dev/docs/transitions/grain-dissolve` — a block caret appends `.md` character by character, and on the last keystroke the rendered docs card behind it flips to its raw Markdown source: same content, no chrome
- voiceover: "Or take any docs page — and just add .md."
- duration: 3.8
- transition_in: crossfade (same surface run)
- status: outline
- src: LlmsTxtDemo → SuffixScene
- type: feature_showcase
- persuasion: Friction reduction — the whole mechanic is two typed characters
- beat: ease + delight
- blueprint: typewriter-reveal — someone is typing this
- asset_candidates: (real docs URL + its Markdown source, authored in mono; no captured assets)

narrativeRole: the delight beat — the tiniest possible mechanic closes the route run.
keyMessage: any page, plus .md, equals Markdown.

## Frame 8 — The compression

- scene: the ascii-dissolve cover's second and last pass carries the mono surface away; back in the calm obsidian world, three short lines slide in one after another and hold as a block
- voiceover: "One index. One full corpus. Every page in Markdown."
- duration: 3.2
- transition_in: zoom-through (ascii-dissolve, second use — bookending the section it opened)
- status: outline
- src: LlmsTxtDemo → ValueScene
- type: benefit_highlight
- persuasion: Rule of three — the release compressed into its three routes
- beat: confidence
- blueprint: grid-card-assemble — an accumulating value list
- asset_candidates: (typography-only)

narrativeRole: compresses the three routes into three memorizable claims.
keyMessage: index, corpus, per-page — pick your granularity.

## Frame 9 — The lockup

- scene: the introducing-remocn outro, inherited with the new logo — a smoke ring blooms open, the R mark draws itself on and fills, "emocn" slides out from behind it assembling the wordmark, "Open source, all the way down" settles faint beneath
- voiceover: "remocn — open source, all the way down."
- duration: 5
- transition_in: blur-crossfade
- status: outline
- src: LlmsTxtDemo → OutroScene (inherited from IntroducingRemocnDemo)
- type: branding
- persuasion: Brand stamp + risk reversal
- beat: trust + inevitability
- blueprint: logo-assemble-lockup — the mark draws itself on, the wordmark completes the lockup
- asset_candidates: (logo mark inlined as SVG — the new R letterform)

narrativeRole: the brand stamp, identical to the flagship cut so the changelog series reads as one voice.
keyMessage: remocn.

---

## The new transition — ascii-dissolve (registry candidate)

- **What it is:** a statement cover in the family grammar. A fullscreen grid of monospace
  glyphs fades in over the outgoing scene; each cell's character comes from a density ramp
  (` .:-=+*#%@`) driven by a deterministic simplex-noise field (seeded via `@remotion/random`,
  animated by frame), so the field reads as living plain text. It holds fully opaque ~500ms —
  long enough to be READ as text — then thins out (cells drop back down the ramp to space) as
  the incoming scene resolves beneath. Ink glyphs on obsidian; a sparse scattering of cells
  render in lime.
- **Text mode (`enterText` + `enterStyle`):** the outgoing scene blurs out under the rising
  field; the incoming headline is NEVER previewed as ascii. Its letterform mask (sampled once
  from the real fonts on an offscreen canvas at grid resolution) serves only as geometry for
  the enter style. The shipped style is **"clearing"** — the per-cell dissolve order is
  biased by distance to the text, so cells near the headline vanish first and a granular
  cavity opens outward around the arriving type. Other styles in the registry component:
  "fade", "halo" (a soft dark well), "wave" (a circular density impulse), "focus"
  (depth-of-field handoff), "lime-echo" (one accent ring flash).
- **Why this one:** it performs the release. Swirl was the shaders cut's cover, skeleton-swap
  was the UI tier's cover; ascii-dissolve is "the rendered frame becomes plain text" — the
  llms.txt thesis as a cut.
- **Registry shape:** lowercase factory `asciiDissolve(props)` returning a
  `TransitionPresentation`, paced with `linearTiming`, same as dither-dissolve / grain-dissolve.
  Props: `cellSize`, `colorFront`, `colorBack`, `accentColor`, `accentDensity`, `ramp`.
- **Not:** swirl, not ripple, not a wipe — no directional edge; the whole frame converts at once.

## Checklist

- Arc named (BAB); sequence narrative-driven, not page-order.
- One hook strategy (direct address — the reader you didn't picture).
- Each beat has one job; every beat carries `type`, `persuasion`, `beat`.
- Every VO written in its blueprint's shape and phrase-segmented into cues.
- Shapes vary: kinetic-type-beats, overwhelm-surround, titlecard-reveal,
  device-surface-showcase, typewriter-reveal, grid-card-assemble, logo-assemble-lockup.
- The route demo is a multi-beat sequence on one mono surface (F5 → F6 → F7).
- No swirl, no ripple, no skeleton-swap; the statement cover is the NEW ascii-dissolve, used
  exactly twice (into the turn, out of the routes); crossfade default elsewhere.
- No letter-spacing, no uppercase, no badges, no pulsing, no installation pills.
- The outro is the introducing-remocn scene with the new R-mark logo, inherited unchanged.
