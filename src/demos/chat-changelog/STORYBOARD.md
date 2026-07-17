# STORYBOARD — Chat primitives (changelog cut)

Changelog video for remocn.dev/changelog#2026-06-27-chat-primitives. The viewer is an
existing remocn / Remotion user scanning the changelog; after ~35 seconds they should
know: **remocn now ships chat — bubbles that type, send, land and react, one message
API with three skins (Chat Flow, iMessage, Telegram), built from two primitives.**

- **Arc:** Demo Loop with a chat-native hook (hook exchange → name the drop → skin
  cycle 1–2–3 on the SAME conversation → mechanism → command → lockup)
- **Scope:** the changelog entry ("Chat and messaging primitives", 2026-06-27) also
  ships a GitHub Sponsors card; it's deliberately out of this video — one film, one
  story. The entry's own framing — building blocks over one rigid component — is
  Frame 7's mechanism beat.
- **Length:** ~35s @ 30fps, 1280×720 (1052 frames as built — the chat flows earn
  the extra seconds over the ~30s sketch)
- **Register:** the shipped remocn.dev brand — warm obsidian `#141318`, ink `#f2f2f2`,
  one lime accent `#C3E88D`, Manrope 400/600, Geist Mono only for the shell command.
  Same world as the introducing-remocn cut.
- **Visual language:** one quiet simplex-noise field carries the whole video. The
  typing indicator is the video's recurring motif: it opens the film, and it seeds the
  statement transition. Light phone screens sit on the dark stage as lit objects
  (hardcoded-light chat surfaces stay light — the stage stays obsidian).
- **The one-API proof is shown, not told:** all three skin stations replay the SAME
  message array. Only the skin changes between stations — that repetition IS the
  mechanism argument before it's ever said out loud.
- **Typography discipline:** no letter-spacing, no uppercase, no badges, no pills,
  no pulsing chrome, no "+" suffixes on numbers. Station labels are sentence-case
  Manrope. The install command is bare typed mono — no pill, no copy button. The
  typing indicator's dot wave is the component's essence, not decoration — it stays.
- **New transitions (registry candidates): `bubble-bloom` + `message-send`** —
  this cut uses `bubble-bloom` variant `launch`: a typing pill pops up on the
  incoming side (the left — the other party is typing) and ITSELF swells into the
  next scene, its center gliding to the middle of the frame as it opens; dots,
  surface and edge all belong to the one growing bubble. The outgoing scene
  recedes and fades behind it; the bubble's last layer is color-matched to the
  backdrop so the hand-off never flashes. Pure transform + clip mask,
  deterministic, no shader. No swirl, no ripple anywhere in this cut.
  Used exactly once — at the drop. The covering layers render the live stage
  backdrop (`backdrop` prop), so the shader field never goes dark mid-transition.
  The sibling `message-send` (the thread scrolls up, the next scene springs in
  from below) ships alongside in the registry drop.
- **Music:** confident minimal tech underscore, soft message-pop accents on bubble
  lands.

---

## Frame 1 — Hook, someone's typing

- scene: bare obsidian canvas over the barely-moving simplex field; a single incoming-style bubble with a live typing indicator sits alone in the center — three dots waving on the component's own cycle. It holds just long enough to be READ (universal "someone's typing" tension), then the dots resolve into the first message, which pops in on the bubble's spring.
- voiceover: "Every product talks in chat now."
- duration: 3.0s
- transition_in: cut (opening frame)
- status: locked
- src: ChatChangelogDemo → HookScene
- type: hook
- persuasion: Pattern recognition — the typing indicator creates anticipation before a single word lands
- beat: curiosity → recognition
- blueprint: typewriter-reveal — someone is typing this (chat-native: the bubble types it)
- asset_candidates: (live remocn typing-indicator + message-bubble; typography-only otherwise)

narrativeRole: stops the scroll with the most recognizable micro-moment on any phone — and it's rendered by the component being announced.
keyMessage: chat is everywhere; someone is about to say something.

## Frame 2 — The pain, in reply

- scene: the same thread continues in place — an outgoing bubble types and sends the reply from the right side; the exchange sits as a real two-message conversation. The pain is delivered inside the medium it's about.
- voiceover: "Animating bubbles by hand? A day of keyframes."
- duration: 2.6s
- transition_in: none (same surface — the reply continues the thread)
- status: locked
- src: ChatChangelogDemo → HookScene (second beat, same thread)
- type: pain_point
- persuasion: Pain validation — every editor who has hand-keyed a fake chat nods here
- beat: frustration → tension
- blueprint: kinetic-type-beats — pain lands alone (carried by the reply bubble)
- asset_candidates: (live remocn message-bubble; typography-only otherwise)

narrativeRole: names the real cost — time — while the components quietly demonstrate the fix.
keyMessage: faking a chat by hand is slow.

## Frame 3 — The drop

- scene: a typing-indicator pill pops up on the incoming side of the exchange — the other party is typing — and swells from the left into the frame, gliding to center as it opens. Mid-flight the dots hand off to the message they were typing: "New in Remocn" resolves exactly where the dots dissolve and rides the bubble to center, lifts away, then "Chat components" lands center, alone.
- voiceover: "New in Remocn — chat components."
- duration: 4.4s
- transition_in: zoom-through (implemented as bubble-bloom `launch` — NEW registry transition; the typing pill is the door, entering from the incoming side)
- status: locked
- src: ChatChangelogDemo → DropScene
- type: product_intro
- persuasion: Category naming — the changelog headline given its own beat
- beat: relief + intrigue
- blueprint: kinetic-type-beats — "Introducing…" name-drop
- asset_candidates: (typography-only)

narrativeRole: the turn — the announcement blooms literally out of the problem's own bubble.
keyMessage: remocn ships chat components.

## Frame 3b — The tagline

- scene: its own typographic beat — the category line settles in the center via a calm scale-down fade, then lifts away
- voiceover: "Conversations that play themselves."
- duration: 2.2s
- transition_in: crossfade (same visual world as the name)
- status: locked
- src: ChatChangelogDemo → TaglineScene
- type: product_intro
- persuasion: Feature-to-benefit translation — frame-driven bubbles, said as an outcome
- beat: clarity
- blueprint: titlecard-reveal — the calm value beat
- asset_candidates: (typography-only)

narrativeRole: tells the viewer what the drop actually does for them.
keyMessage: the chat animates itself, frame-driven.

## Frame 4 — Station 1: Chat Flow

- scene: a device frame glides in and parks right of center; on its screen the Chat Flow conversation plays live — bubbles type in the composer, send, land on springs, a reaction pops onto the last message. Left of the phone, a quiet sentence-case label and one-line blurb reveal as the VO names them: "Chat Flow" / "shadcn-styled bubbles, themed by your tokens." No counter, no badge, no install pill.
- voiceover: "Chat Flow — bubbles type, send, land. Reactions included."
- duration: 4.8s
- transition_in: push-slide LEFT (the skin cycle begins on lateral momentum)
- status: locked
- src: ChatChangelogDemo → StationScene (chat-flow)
- type: feature_showcase
- persuasion: Show-don't-tell proof — the component performs its whole lifecycle live
- beat: control + delight
- blueprint: device-surface-showcase — experienced inside its real interface
- asset_candidates: (live remocn chat-flow inside a code-drawn phone; vendored avatar public/shadcn-avatar.png)

narrativeRole: demo cycle 1 — the default skin acts out typing → send → land → react.
keyMessage: the full message lifecycle is one component.

## Frame 5 — Station 2: iMessage

- scene: the next station pushes in on the same momentum — the SAME conversation replays, now in the iMessage skin: blue outgoing bubbles, gray inbound, a tapback ring instead of the reaction chip. Label swaps to "iMessage". The viewer sees the identical words wearing a different skin.
- voiceover: "Same messages — iMessage skin. Blue bubbles, tapbacks."
- duration: 4.7s
- transition_in: none (in-place morph — the device blurs in over the previous one, the label morphs through blur; the stage never moves)
- status: locked
- src: ChatChangelogDemo → StationScene (imessage-chat-flow)
- type: feature_showcase
- persuasion: Repetition-as-proof — identical content, swapped skin; the API claim shown before it's spoken
- beat: recognition + momentum
- blueprint: kinetic-type-beats — the KEY WORD (the skin) swaps in place; the swap is the story
- asset_candidates: (live remocn imessage-chat-flow inside the phone; vendored avatar public/shadcn-avatar.png)

narrativeRole: demo cycle 2 — the swap begins; "same messages" becomes the refrain.
keyMessage: one conversation, new skin, zero rewrites.

## Frame 6 — Station 3: Telegram

- scene: last station, same push — the SAME conversation again in the Telegram skin: accent-blue outgoing, timestamps and read ticks settling on each bubble as it lands. Label swaps to "Telegram".
- voiceover: "Same messages — Telegram skin. Ticks and timestamps."
- duration: 4.6s
- transition_in: none (in-place morph, same as station 2)
- status: locked
- src: ChatChangelogDemo → StationScene (telegram-chat-flow)
- type: feature_showcase
- persuasion: Rule of three — the third identical replay locks the pattern in
- beat: momentum → confidence
- blueprint: kinetic-type-beats — the KEY WORD (the skin) swaps in place; the swap is the story
- asset_candidates: (live remocn telegram-chat-flow inside the phone; vendored avatar public/shadcn-avatar.png)

narrativeRole: demo cycle 3 — the cycle completes; three skins have now told one story.
keyMessage: any messenger look, same code.

## Frame 7 — The mechanism

- scene: the calm obsidian world returns through a quiet blur-crossfade; three short lines slide in one after another and hold as a block — "One message API" / "Three skins" / "Two primitives underneath" — with message-bubble and typing-indicator named in the third line's sub-reveal.
- voiceover: "One message API. Three skins. Two primitives underneath — message-bubble and typing-indicator."
- duration: 4.0s
- transition_in: blur-crossfade (the bubble transition stays a one-per-video statement — a second use out of the demo read as excess and was cut)
- status: locked
- src: ChatChangelogDemo → MechanismScene
- type: benefit_highlight
- persuasion: Mechanism reveal — explains WHY the three stations looked identical
- beat: clarity + trust
- blueprint: grid-card-assemble — an accumulating value list
- asset_candidates: (typography-only)

narrativeRole: compresses what the montage just proved into three memorizable claims.
keyMessage: not three chat widgets — one API, two primitives, three skins.

## Frame 8 — The command

- scene: the shell command types itself in mono, alone in the center — `npx shadcn add @remocn/chat-flow` — bare text on the obsidian field, no pill, no copy chrome. Once typed, the component name flips once through the two siblings (imessage-chat-flow, telegram-chat-flow): same command, any skin.
- voiceover: "npx shadcn add — the whole thread lands in your repo."
- duration: 4.2s
- transition_in: cut (the mechanism block exits itself first — no overlap)
- status: locked
- src: ChatChangelogDemo → InstallScene
- type: feature_showcase
- persuasion: Show-don't-tell proof + friction reduction — one typed line is the whole workflow
- beat: control + ease
- blueprint: typewriter-reveal — someone is typing this
- asset_candidates: (mono command, no captured assets)

narrativeRole: the mechanism made concrete — the changelog entry's install line, performed.
keyMessage: one command, and you own the code.

## Frame 9 — Lockup

- scene: the introducing-remocn outro, reused as-is: a smoke ring blooms open from the dark; the R mark draws itself on in the center, then "emocn" slides out from behind it — the mark IS the R, together they assemble the Remocn wordmark; "Open source, all the way down" settles faint at the bottom.
- voiceover: "Remocn. Open source, all the way down."
- duration: 5.0s
- transition_in: blur-crossfade
- status: locked
- src: ChatChangelogDemo → OutroScene (reused from IntroducingRemocnDemo)
- type: cta
- persuasion: Risk reversal (open source) + brand stamp
- beat: trust + inevitability
- blueprint: logo-assemble-lockup — elements clear, the lockup draws itself in
- asset_candidates: (logo mark inlined as SVG — remocn.dev/logo-mark.svg path, already in introducing-remocn)

narrativeRole: the brand stamp — the new lockup closes every changelog film the same way.
keyMessage: Remocn.
