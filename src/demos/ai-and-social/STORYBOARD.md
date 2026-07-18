# STORYBOARD — AI chat simulators and social cards (changelog cut)

The changelog cut for the 2026-06-17 **"AI chat simulators and social cards"** entry,
made for the changelog page itself. After ~39 seconds the viewer should know: **the two
shots that show up in almost every launch video are now components** — five AI surfaces
that type themselves out, two X cards for the follow and the climbing count, and
confetti for the moment the number lands.

- **Arc:** built on the changelog's own opening sentence — *"Two shots that show up in
  almost every launch video — someone prompting an AI, and a follower count going up."*
  The video names shot one, plays it five ways, names shot two, plays it through to the
  confetti, then closes the loop: **now both of them are components**. Hook → shot one →
  AI montage → shot two → follow → the count → payoff → value → command → lockup.
- **Length:** ~39s @ 30fps, 1280×720 (1168 frames).
- **Register:** inherited from introducing-remocn / introducing-shadcn / introducing-videorc
  — the shipped remocn.dev brand: warm obsidian `#141318`, ink `#f2f2f2`, muted
  `rgba(242,242,242,0.62)`, one lime accent `#C3E88D`, Manrope 400 for every heading,
  Geist Mono only for the surface captions and the shell command. No letter-spacing, no
  uppercase, no badges, no eyebrows, no pulsing, no installation pills — the command is a
  mono terminal line. Every offset on the 8px grid.
- **Visual language:** one quiet simplex-noise field carries the whole video as the shared
  backdrop, exactly as the introducing-remocn cut. The changelog's own components are the
  subject, so the frame around them stays empty: each surface arrives on the bare field
  with one mono caption beneath it, nothing else.
- **Every component keeps its own brand.** Anthropic clay on both Claude surfaces, OpenAI's
  dark composer, OpenCode's blue, v0's monochrome, X's blue on both social cards, and the
  overview's own confetti palette. Each product is recognizable as itself, because being
  recognizable is the entire point of shipping branded simulators — a video that washes
  them into one palette is showing its own art direction, not the release. No colour
  treatment is applied and no accent prop is overridden anywhere. What holds the montage
  together is the obsidian field they all sit on, the identical framing, and the one mono
  caption beneath each. Only the content typed into them is ours, and nothing about their
  internal timing is touched — they are shown doing exactly what they do.
  - The single intervention in the whole video is legibility: **`chat-gpt` is hardcoded to
    its light theme**, so on obsidian its heading is dark-on-dark and its composer is a
    headlight. That beat runs `invert(1) hue-rotate(180deg)` — the classic dark-mode pair,
    which flips luminance and puts the hues straight back — so ChatGPT reads as its own
    dark-mode surface rather than a blown-out light one. `x-follow-card` is light too, but
    it renders as a self-contained card rather than a page, so it simply stays light and
    sits scaled back on the field, the way a real X card would.
  - The confetti burst is the loudest colour in the video, and that is correct: it lands on
    the exact beat the entry names — *"for the moment the number lands."*
- **The NEW registry transition — `composer-send`** (debuts here; not swirl, not ripple,
  not dither, not caret-wipe, not skeleton-swap, not ascii-dissolve, not sync-snap, not
  bubble-bloom, not catalog-riffle): the cut IS a prompt being submitted. The outgoing
  scene contracts — rect-to-rect — into a centered composer pill, as if the whole frame
  were the thing you just typed; the pill holds a beat with a lime caret, the send control
  fills lime and the pill presses 8px down and releases — sent; then the pill expands back
  out to full frame and the incoming scene resolves inside it through a fast top-down
  streaming wipe, the way a response arrives. Thematically it is the entry's first half
  made kinetic — *you type, you send, something appears*. Used at the two boundaries that
  mean "the prompt was answered" (into the AI montage, and out of it); everywhere else is
  crossfade / blur-crossfade, per the house grammar.
- **Typography discipline:** each remocn text animation appears where its motion matches
  the message — scale-down-fade for the solo statements, short-slide-right for the two
  shot names gliding in, kinetic-center-build for the payoff line assembling,
  line-by-line-slide for the accumulating value block. Mono only for the surface captions
  and the command.
- **Outro:** the introducing-remocn outro inherited verbatim with the new logo — a smoke
  ring blooms open, the R mark draws itself on, "emocn" slides out from behind it to
  assemble the Remocn wordmark, "Open source, all the way down" beneath.

---

## Frame 1 — The same two shots

- scene: bare obsidian over the shared simplex-noise field; one line lands solo in the
  center via scale-down-fade, settles, lifts away. Nothing else in frame.
- voiceover: "Every launch video has the same two shots."
- duration: 2.7s
- transition_in: cut (opening frame)
- status: locked
- src: AiAndSocialDemo → HookScene
- type: hook
- persuasion: recognition — the viewer has already made both of these shots by hand

narrativeRole: states the entry's own thesis as a truth the viewer already agrees with.
keyMessage: launch videos are made of two recurring shots.

## Frame 2 — Shot one

- scene: same world; "Someone prompting an AI" glides in via short-slide-right and holds
  alone. The naming of the shot, before it is shown.
- voiceover: "Someone prompting an AI."
- duration: 3.9s
- transition_in: crossfade (same visual world)
- status: locked
- src: AiAndSocialDemo → ShotOneScene
- type: product_intro

narrativeRole: names the first shot so the montage that follows reads as evidence.
keyMessage: shot one is the prompt.

## Frame 3 — The five surfaces

- scene: the composer-send lands us inside the first surface, then five real components
  hard-cut one into the next, each typing itself out live on the bare field with a quiet
  mono caption beneath — Claude Code, Claude Chat, ChatGPT, OpenCode, v0. Each arrives in
  its own brand (clay, clay, OpenAI dark, blue, monochrome); the shared field and the
  identical framing are what make five vendors read as one montage. The montage IS the
  argument: the shot everyone shoots, five ways, no mockups.
- voiceover: (silent — the surfaces carry it)
- duration: 13.1s (5 × 2.2s, hard cuts, plus the frames the two transitions cover)
- transition_in: composer-send (the prompt is submitted; the response is the montage)
- status: locked
- src: AiAndSocialDemo → AiMontageScene
- type: feature_showcase
- persuasion: show-don't-tell — the components perform instead of being listed

narrativeRole: proves the first half of the entry with the actual shipped components.
keyMessage: five AI interfaces, typing themselves out.

## Frame 4 — Shot two

- scene: the composer-send returns us to the calm world; "And a follower count going up"
  glides in via short-slide-right and holds alone.
- voiceover: "And a follower count going up."
- duration: 3.9s
- transition_in: composer-send (the second submission — out of the montage)
- status: locked
- src: AiAndSocialDemo → ShotTwoScene
- type: product_intro

narrativeRole: names the second shot on the same beat the first one was named.
keyMessage: shot two is the follow.

## Frame 5 — The follow button

- scene: the X Follow Card lands on the field in X's own light card and X's own blue, and
  the cursor travels to Follow and clicks — the button flips to Following. One mono
  caption beneath.
- voiceover: (silent — the click carries it)
- duration: 4.2s
- transition_in: blur-crossfade
- status: locked
- src: AiAndSocialDemo → FollowScene
- type: feature_showcase

narrativeRole: the follow button, acted out rather than described.
keyMessage: the follow button.

## Frame 6 — The count that climbs

- scene: the X Followers Overview takes the frame — follow notifications cycle up while
  the total climbs — and confetti fires the instant the number lands. The entry's three
  social components in one continuous beat.
- voiceover: (silent — the count carries it)
- duration: 4.9s
- transition_in: crossfade (the same social world, one continuous surface)
- status: locked
- src: AiAndSocialDemo → CountScene
- type: feature_showcase
- persuasion: the payoff moment the entry names outright — "for the moment the number lands"

narrativeRole: the second shot played to its end, confetti included.
keyMessage: the count that climbs, and the confetti when it lands.

## Frame 7 — Now both of them are components

- scene: back on the calm field; the payoff line assembles word by word via
  kinetic-center-build — each word pushing the line open.
- voiceover: "Now both of them are components."
- duration: 2.8s
- transition_in: blur-crossfade
- status: locked
- src: AiAndSocialDemo → PayoffScene
- type: benefit_highlight

narrativeRole: closes the loop the hook opened — the two shots are no longer work.
keyMessage: both shots ship as components.

## Frame 8 — The value block

- scene: three short lines slide in one after another and hold as a block.
- voiceover: "Five AI surfaces. Two social cards. Confetti when the number lands."
- duration: 3.1s
- transition_in: crossfade
- status: locked
- src: AiAndSocialDemo → ValueScene
- type: benefit_highlight

narrativeRole: compresses the release into three memorizable claims.
keyMessage: 5 + 2 + confetti.

## Frame 9 — The command

- scene: the shell command types itself in mono, alone in the center; once it settles the
  component slug rolodex-flips through the release — claude-code → claude-chat → chat-gpt
  → opencode → v0 → x-follow-card. A terminal line, never a pill.
- voiceover: "npx shadcn add @remocn/claude-code"
- duration: 3.5s
- transition_in: crossfade
- status: locked
- src: AiAndSocialDemo → CmdScene
- type: feature_showcase

narrativeRole: the mechanism made concrete — one command, any surface in the release.
keyMessage: one command each.

## Frame 10 — Lockup

- scene: the introducing-remocn outro inherited verbatim — a smoke ring blooms open, the R
  mark draws itself on, "emocn" slides out from behind it to assemble the Remocn wordmark,
  "Open source, all the way down" settling beneath.
- voiceover: "Remocn. Open source — at remocn.dev."
- duration: 5.3s
- transition_in: blur-crossfade
- status: locked
- src: AiAndSocialDemo → OutroScene
- type: cta

narrativeRole: the brand stamp shared with every cut in the series.
keyMessage: remocn.dev.
