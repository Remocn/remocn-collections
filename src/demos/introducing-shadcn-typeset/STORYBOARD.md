# STORYBOARD — Introducing shadcn/typeset

An "introducing" spot for shadcn/typeset (shipped July 2026) in the same fan-made
register as the introducing-shadcn gift cut. After ~55 seconds the viewer should know:
**typeset styles HTML and rendered markdown once — one CSS file you own**, three
controls (size, leading, flow — "rhythm") tune it per context, and it's the first
typography system built for streaming chat: new blocks land, earlier ones never move.

- **Arc:** BAB with feature-benefit progression (elements hook → the restyling pain →
  name → one-class bridge → rhythm mechanism → context breadth → streaming wow →
  pillars → ownership → outro)
- **Length:** ~55s @ 30fps, 1280×720
- **Signature move:** the video IS typography — the product demonstrates itself. The
  hook sets each element's name in that element's own type (Headings as an h1,
  Paragraphs as body, Code in mono), and the central beat is a raw browser-default
  document snapping into set type the moment `class="typeset"` lands. No
  illustrations of typography — only typography.
- **Register:** shadcn's own monochrome — zinc-950 `#09090b` canvas, ink `#fafafa`,
  Geist 400 only (no weight above regular anywhere). No letter-spacing, no uppercase,
  no pills, no badges, no pulsing, no installation pill, no links shown on screen.
  A serif (Lora) appears exactly once, inside the reading-preset demo — it is
  product truth (the docs' `typeset-reading` example), not decoration.
- **Color discipline:** monochrome throughout. The ONLY color lives inside the shader
  covers, sampled from the same muted vaporwave set as the shadcn cut: deep plum
  `#3d2547`, dark navy `#141833`, dusty rose `#6b4054`, dusty blue `#3a4a5e`.
- **Visual language:** one quiet simplex-noise field (zinc with a plum hint) carries
  the whole video; scene changes are shader covers (a muted-plum smoke-ring bloom for
  the statement cut — deliberately NOT the swirl the earlier cuts leaned on — and a
  dusty-rose dither) that fade in, are read, then hand the frame over; the smoke
  cover rhymes with the smoke-ring outro.
- **Typography discipline:** every text is its own scene beat (no subtitles under
  headlines). scale-down-fade for solo statements, short-slide-right for glides,
  kinetic-center-build for lines assembling word by word, line-by-line-slide for the
  pillars block. Mono (Geist Mono 400) only for code — the `typeset` class attribute
  and CSS variables.

---

## Frame 1 — The elements

- scene: five hard beats, each one word set as the element it names — "Headings" as a large h1, "Paragraphs" as calm body text, "Lists" as a bulleted item, "Tables" inside a ruled row, "Code" in mono on a code-block ground. The type IS the demo; nothing else on the canvas.
- voiceover: "Headings. Paragraphs. Lists. Tables. Code."
- duration: 4.5s
- transition_in: cut (opening frame)
- status: locked
- src: IntroducingShadcnTypesetDemo → ElementsScene
- type: hook
- persuasion: Recognition — every viewer has rendered these exact elements
- beat: recognition + curiosity
- blueprint: kinetic-type-beats — the words ARE the motion (each word set in its own element's type)
- asset_candidates: (typography-only, live-set type)

narrativeRole: stops the scroll with the raw material of the product — the same five elements every app renders.
keyMessage: this is the HTML you deal with every day.

## Frame 2 — Styled three times

- scene: one line holds while its key word swaps in place — "You've styled them for the blog." → "…for the docs." → "…for the chat." — the swap is the pain
- voiceover: "You've styled them for the blog. For the docs. For the chat."
- duration: 3.5s
- transition_in: crossfade (same visual world)
- status: locked
- src: IntroducingShadcnTypesetDemo → StyledScene
- type: pain_point
- persuasion: Pain validation
- beat: recognition → frustration
- blueprint: kinetic-type-beats — the KEY WORD swaps in place; the swap is the joke
- asset_candidates: (typography-only)

narrativeRole: names the repetition — same elements, new context, another stylesheet.
keyMessage: you keep re-styling the same HTML.

## Frame 3 — The same fight

- scene: the agitation lands solo on the bare canvas — the docs' own words
- voiceover: "Every time, the same fight — sizing and spacing."
- duration: 2.8s
- transition_in: crossfade
- status: locked
- src: IntroducingShadcnTypesetDemo → FightScene
- type: pain_point
- persuasion: Pain agitation, in the project's own words
- beat: frustration → tension
- blueprint: kinetic-type-beats — pain lands alone on a bare canvas
- asset_candidates: (typography-only)

narrativeRole: compresses the pain to its two-word core, quoted straight from the docs.
keyMessage: the fight is always sizing and spacing.

## Frame 4 — Meet shadcn/typeset

- scene: a muted-plum smoke ring blooms open over the pain and swallows the frame — and riding its dissipation, "Meet shadcn/typeset" resolves through scale + blur; the same smoke that will close the video at the lockup
- voiceover: "Meet shadcn/typeset."
- duration: 4.0s
- transition_in: zoom-through (implemented as a smoke-ring shader cover in muted plum — no swirl anywhere in this cut)
- status: locked
- src: IntroducingShadcnTypesetDemo → MeetScene
- type: product_intro
- persuasion: Category naming
- beat: relief + intrigue
- blueprint: kinetic-type-beats — "Introducing…" name-drop
- asset_candidates: (typography-only)

narrativeRole: the turn — the name lands alone, nothing competing. Geist 400, no tricks.
keyMessage: shadcn/typeset.

## Frame 5 — The tagline

- scene: its own typographic beat — the line glides in from the left and holds alone
- voiceover: "Typography for HTML — from blog posts to streaming chat."
- duration: 2.8s
- transition_in: cut (the name plays its own exit first — empty canvas handoff)
- status: locked
- src: IntroducingShadcnTypesetDemo → TaglineScene
- type: product_intro
- persuasion: Category naming, in the site's own words
- beat: clarity
- blueprint: titlecard-reveal — the calm value beat
- asset_candidates: (typography-only)

narrativeRole: says what the name is, in the project's own words.
keyMessage: one typography system across every surface that renders HTML.

## Frame 6 — Style it once

- scene: the claim alone — the headline glides in via short-slide-right, holds, then plays its own exit
- voiceover: "Style it once."
- duration: 2.2s
- transition_in: crossfade (same visual world)
- status: locked
- src: IntroducingShadcnTypesetDemo → OnceTitleScene
- type: feature_showcase
- persuasion: Friction reduction
- beat: ease
- blueprint: titlecard-reveal — the calm value beat
- asset_candidates: (typography-only)

narrativeRole: sets up the mechanism the next beat demonstrates.
keyMessage: one pass, every element.

## Frame 7 — One class

- scene: a real markdown document rendered in raw browser defaults (Times, cramped margins, naked table) sits center-frame; `class="typeset"` types itself in mono beneath it — and on the closing quote the document BREATHES into set type: the letterforms dissolve Georgia → Geist fast while leading and flow open up slower, so the spacing (the product) visibly does the work. A short set-type beat, then the hard cut into the controls scene keeps the document moving.
- voiceover: "One class. The whole document follows."
- duration: 3.7s
- transition_in: cut (the title exits itself first — no overlap)
- status: locked
- src: IntroducingShadcnTypesetDemo → OneClassScene
- type: feature_showcase
- persuasion: Show-don't-tell proof — the before/after IS the argument
- beat: control + satisfaction
- blueprint: typewriter-reveal — someone is typing this
- asset_candidates: (live-rendered document, typography-only)

narrativeRole: the mechanism made concrete — the whole setup is one class on a wrapper.
keyMessage: wrap it in `typeset` and everything is styled.

## Frame 8 — Three controls

- scene: the styled document stays on stage; three mono variables flip one at a time in a settings rail beside it — `--typeset-size` bumps and the whole document scales, `--typeset-leading` opens and every line breathes, `--typeset-flow` widens and the blocks spread. Each flip reflows the document live.
- voiceover: "Three controls. Size. Leading. Flow."
- duration: 6.0s
- transition_in: cut (same surface, the demo continues)
- status: locked
- src: IntroducingShadcnTypesetDemo → ControlsScene
- type: feature_showcase
- persuasion: Show-don't-tell proof — you watch each control move the whole document
- beat: control
- blueprint: kinetic-type-beats — one value swaps in place per beat; the swap is the story
- asset_candidates: (live-rendered document, typography-only)

narrativeRole: the entire tuning surface shown to be three values — no scale ratios, no tracking tables.
keyMessage: size, leading, flow — that's the whole API.

## Frame 9 — Rhythm

- scene: one word lands solo in the calm world — the name the docs gave those three controls
- voiceover: "We call it rhythm."
- duration: 2.2s
- transition_in: cut (the demo exits itself first)
- status: locked
- src: IntroducingShadcnTypesetDemo → RhythmScene
- type: benefit_highlight
- persuasion: Concept naming — three values become one memorable idea
- beat: clarity
- blueprint: kinetic-type-beats — the calm landing after the demo
- asset_candidates: (typography-only)

narrativeRole: gives the mechanism a name the viewer can carry out of the video.
keyMessage: rhythm = size + leading + flow.

## Frame 10 — The context montage

- scene: three hard-cut beats, the SAME document reshaping per context — Docs (`typeset-docs`: 15px, tighter flow, a docs-page frame), Chat (`typeset-chat`: the document inside a chat bubble, following the smaller type around it, compact flow), Reading (`typeset-reading`: Lora serif, 18px, airy leading — the one serif moment in the video). Each beat carries its preset name in mono. The montage IS the breadth argument.
- voiceover: "Docs. Chat. Reading. Same file — tuned per context."
- duration: 7.0s
- transition_in: blur-crossfade (dithering-shader dissolve in dusty rose)
- status: locked
- src: IntroducingShadcnTypesetDemo → PresetsScene
- type: feature_showcase
- persuasion: Value stacking, shown not told — one document, three presets
- beat: awe + momentum
- blueprint: device-surface-showcase — the document experienced inside each real surface
- asset_candidates: (live-rendered document in three preset frames)

narrativeRole: proves that "tune the rhythm per context" is a preset, not a rewrite.
keyMessage: one CSS file covers docs, chat, and reading modes.

## Frame 11 — Built for streaming

- scene: a chat surface; an assistant reply streams in markdown block by block — a heading, a paragraph, a list, a code block — while a thin baseline grid behind the earlier blocks proves they hold pixel-still as each new block adds its own space below. Spacing flows one direction; nothing above ever shifts.
- voiceover: "Built for streaming. New blocks land — earlier ones never move."
- duration: 6.5s
- transition_in: cut (chat surface continues from the montage's chat beat)
- status: locked
- src: IntroducingShadcnTypesetDemo → StreamTitleScene + StreamScene + StreamClaimScene (title beat → silent demo → claim beat, the install-title/command grammar)
- type: feature_showcase
- persuasion: Negative contrast with every prose stylesheet that reflows on append
- beat: trust + quiet awe
- blueprint: device-surface-showcase — the feature shown being USED inside its real surface
- asset_candidates: (live-rendered chat surface, typography-only)

narrativeRole: the 2026 differentiator — the first typography system with a stability contract for streamed markdown.
keyMessage: designed for stable appends; nothing restyles retroactively.

## Frame 12 — The pillars

- scene: back in the calm zinc world; three short lines slide in one after another and hold as a block
- voiceover: "Container-aware. Theme-native. Zero specificity."
- duration: 3.5s
- transition_in: blur-crossfade (dithering-shader dissolve out of the demo)
- status: locked
- src: IntroducingShadcnTypesetDemo → PillarsScene
- type: benefit_highlight
- persuasion: Value stacking
- beat: confidence
- blueprint: grid-card-assemble — an accumulating value list
- asset_candidates: (typography-only)

narrativeRole: compresses the engineering into three memorizable claims — it follows the type around it, it uses your theme tokens, and your Tailwind utilities always win.
keyMessage: it fits your app instead of fighting it.

## Frame 13 — The file is yours

- scene: one line lands solo in the calm world — the ownership claim, nothing else
- voiceover: "And the file is yours."
- duration: 2.3s
- transition_in: crossfade
- status: locked
- src: IntroducingShadcnTypesetDemo → YoursScene
- type: benefit_highlight
- persuasion: Risk reversal — no package, no config layer to work around
- beat: control + peace of mind
- blueprint: kinetic-type-beats — the calm landing after the demo
- asset_candidates: (typography-only)

narrativeRole: lands the shadcn creed applied to CSS — a real file in your project, yours to change.
keyMessage: one CSS file, in your repo, no package between you and it.

## Frame 14 — The lockup

- scene: a smoke ring in muted rose blooms open from the dark; "shadcn/typeset" resolves inside it; "One CSS file you own." settles faint at the bottom
- voiceover: "shadcn/typeset. One CSS file you own."
- duration: 4.7s
- transition_in: blur-crossfade
- status: locked
- src: IntroducingShadcnTypesetDemo → OutroScene
- type: branding
- persuasion: Brand stamp in the project's own words
- beat: inevitability
- blueprint: logo-assemble-lockup — elements clear, the lockup draws itself in
- asset_candidates: (typography-only; no URL shown by design)

narrativeRole: the brand stamp — the name and its own motto, no link, no CTA.
keyMessage: shadcn/typeset — one CSS file you own.
