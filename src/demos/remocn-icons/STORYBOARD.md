# STORYBOARD — Introducing remocn icons

The announcement of remocn's first sub-project: **remocn icons** — 100 Lucide-derived
icons re-authored from scratch as animated, deterministic Remotion components. After
~41 seconds the viewer should know: every icon draws itself on and then acts, the code
(and the raw SVG paths) land in your repo, and one shadcn command installs any of them.

- **Arc:** joke-hook (motion vs. stillness) → reveal → positioning → breadth →
  the morph run (draw / act / ownership in one continuous shot) → install → brand stamp
- **Length:** ~41s @ 30fps, 1280×720
- **Register:** warm obsidian `#141318`, ink `#f2f2f2`, one lime accent `#C3E88D`,
  Manrope 400 headlines, Geist Mono only for icon names and the shell command —
  the shipped remocn.dev brand.
- **Visual language:** one quiet neuro-noise field carries the whole video — a web of
  fine living strokes, the same material the icons are made of — recolored into the
  obsidian family with a faint lime undertone, pushed far back by opacity + a vignette.
  Never used as a carrier in any previous remocn video.
- **Motion grammar:** the video's whole argument is *stroke motion* — so every beat is
  either a stroke drawing on, a drawn stroke acting, or a stroke morphing into another
  stroke. Scene changes are push-through (narrative dives), whip-pan (enumeration),
  crossfade and focus-pull (statements), plus one deliberate hard cut into the morph run.
  No swirl anywhere. No line-by-line-slide anywhere.
- **Typography discipline:** soft-blur-in (the lush hook), scale-down-fade (solo
  statements), kinetic-center-build (the positioning assembling word by word).
  No letter-spacing, no uppercase, no badges, no pills, no plus-suffixes,
  no trailing periods on screen.

---

## Frame 1 — Hook, the motion

- scene: bare obsidian canvas over the barely-moving neuro-noise web; "Everything in your video moves" resolves character by character out of blur — the lushest text entrance remocn ships, deliberately
- voiceover: "Everything in your video moves."
- duration: 2.4s
- transition_in: cut (opening frame)
- status: locked
- src: RemocnIconsDemo → HookMovesScene
- type: hook
- persuasion: Pain setup via contrast
- beat: recognition
- blueprint: kinetic-type-beats — one line lands alone, dressed in motion
- asset_candidates: (typography-only)

narrativeRole: establishes the world where everything is animated — so the next
line can betray it.
keyMessage: your video is full of motion.

## Frame 2 — Hook, the stillness

- scene: a quiet crossfade lands "Except the icons" — and then nothing. No easing, no life — the stillest frame in the whole video. Beneath it, three gray Lucide outlines (star, bell, heart) sit frozen at rest. The joke is the grammar: the line about static icons refuses to move
- voiceover: "Except the icons."
- duration: 2.2s
- transition_in: crossfade (the line settles in, then plays dead)
- status: locked
- src: RemocnIconsDemo → HookStillScene
- type: pain_point
- persuasion: Pain agitation by demonstration
- beat: the wince — everyone has shipped this frame
- blueprint: kinetic-type-beats — anti-motion as the beat
- asset_candidates: (three static icon outlines, drawn inline)

narrativeRole: names the gap remocn icons fills, by being the gap for two seconds.
keyMessage: icons are the last dead thing in your video.

## Frame 3 — The reveal

- scene: a push-through dives INTO the frozen icons; on the other side one huge bell (~170px) stroke-draws itself on alone in ink, gets its one grand beat, rings once — then glides up and shrinks as "Remocn Icons" resolves tight beneath it, with "A new icon set for Remotion" settling faint under the name
- voiceover: "Meet remocn icons."
- duration: 5.2s
- transition_in: push-through (the camera dives through the dead icons into the living one)
- status: locked
- src: RemocnIconsDemo → RevealScene
- type: product_intro
- persuasion: Category naming + show-don't-tell (the first drawn icon precedes the name)
- beat: relief + delight
- blueprint: logo-assemble-lockup — the mark earns its beat before the name lands
- asset_candidates: (icon-bell component, real registry code)

narrativeRole: the turn — the product demonstrates itself before it is named.
keyMessage: remocn icons — icons that come alive.

## Frame 4 — The positioning

- scene: "100 Lucide icons, rewritten for video" builds word by word in the center — each new word pushes the line open; the plain number 100 rides in as just another word, no suffix
- voiceover: "100 Lucide icons, rewritten for video."
- duration: 2.9s
- transition_in: crossfade (same visual world as the reveal)
- status: locked
- src: RemocnIconsDemo → PositioningScene
- type: product_intro
- persuasion: Anchoring to a known source (Lucide) + honest scope (100, plain)
- beat: clarity
- blueprint: kinetic-type-beats — the words ARE the motion
- asset_candidates: (typography-only)

narrativeRole: one sentence that transfers everything the viewer knows about Lucide
onto remocn icons, and stakes the difference: rewritten for video.
keyMessage: familiar icons, re-authored as Remotion components.

## Frame 5 — The gallery

- scene: a whip-pan lands on a 6×4 grid of 24 icons; a diagonal wave of stroke-draws sweeps the grid corner to corner — and as each icon finishes drawing it fires its own action, so the wall ripples alive and never sits still. "Every icon draws itself on" holds beneath the grid
- voiceover: "Every icon draws itself on."
- duration: 4.6s
- transition_in: whip-pan (enumeration travels sideways)
- status: locked
- src: RemocnIconsDemo → GalleryScene
- type: feature_showcase
- persuasion: Value stacking by demonstration
- beat: awe + momentum
- blueprint: grid-card-assemble — the breadth argument, drawn live
- asset_candidates: (24 real icon components: bell, heart, star, zap, search, rocket, send, play, settings, lock, cloud, camera, mail, check-circle, sun, moon, party-popper, trending-up, wallet, crown, trophy, flame, sparkles, timer)

narrativeRole: proves breadth AND both halves of the API in one shot — 24 of the 100,
all running the same real registry code, drawing and acting.
keyMessage: the whole set animates, not a curated few.

## Frame 6 — The morph run (draw → act → ownership)

- scene: "Then it acts" lands alone via scale-down-fade; then ONE continuous lime stroke draws itself on as the heart and never cuts for the rest of the scene — it beats, morphs into the flame and flickers, the moon and rocks, the cloud and drifts, the bubble and bounces, the shield and thumps, the bookmark and dips, the star and twinkles, the zap and flashes, the play and presses — ten icons, one stroke, ordered by silhouette similarity (round blobs first, then the angular family) so every morph reads as one shape flowing into a neighbour; every action eases out of rest so the morph hand-off never jumps. Each station's mono name crossfades beneath. On the final hold the claims land: "The paths land in your repo" / "So you can write motion we never shipped" — the actions the stroke just performed are hand-written on the raw paths, not registry code
- voiceover: "Then it acts. The paths land in your repo. So you can write motion we never shipped."
- duration: 15.5s
- transition_in: cut (the run announces itself)
- status: locked
- src: RemocnIconsDemo → ActsScene
- type: feature_showcase + benefit_highlight
- persuasion: Mechanism made concrete, then ownership proof by counter-example (this choreography is NOT in the registry)
- beat: delight ten times, then "oh — it's mine"
- blueprint: morph-carry — one shape carried through identities, the remocn-new-logo gesture applied to icons
- asset_candidates: (raw paths of heart, flame, moon, cloud, message-circle, shield, bookmark, star, zap, play; interpolatePath from @remotion/paths)

narrativeRole: the spine of the video — action personality and code ownership argued
in a single unbroken shot.
keyMessage: each icon acts, and because you own the paths, you own every animation
you can imagine.

## Frame 7 — The command

- scene: a focus-pull resolves onto the shell command typing itself in mono: npx shadcn@latest add @remocn/icon-folder — the folder draws itself on above it; then the package name rolodex-flips through icon-tag, icon-filter, icon-sparkles while the icon above morphs in sync — flip and morph are the same beat. Four icons the morph run did not use: fourteen distinct icons across the two scenes
- voiceover: "npx shadcn add — one command per icon."
- duration: 6.0s
- transition_in: focus-pull (attention narrows to the mechanism)
- status: locked
- src: RemocnIconsDemo → InstallScene
- type: feature_showcase
- persuasion: Friction reduction, show-don't-tell — one command, any icon
- beat: control
- blueprint: typewriter-reveal + rolodex — someone is typing this, and the catalog flips past
- asset_candidates: (mono command; rolodex-flip component; raw icon paths)

narrativeRole: the workflow made concrete — type one line, swap one name, an icon
comes alive.
keyMessage: any icon, one command, yours.

## Frame 8 — Lockup

- scene: the new-logo outro inherited: the R letterform stroke-draws itself on at cap height, the ink fills beneath the tracing outline, then "emocn" slides out from behind the mark as the outline thins away — the wordmark assembling exactly as the rebrand video taught it to. remocn.dev resolves faint beneath
- voiceover: "remocn. At remocn.dev."
- duration: 5.4s
- transition_in: push-through (the last dive lands on the brand)
- status: locked
- src: RemocnIconsDemo → OutroScene
- type: cta
- persuasion: Brand consistency + destination
- beat: trust + inevitability
- blueprint: logo-assemble-lockup — the new logo animation, one video old, already a ritual
- asset_candidates: (R path inlined from remocn-new-logo)

narrativeRole: the brand stamp — the same mark that introduced itself last video now
signs the first sub-project.
keyMessage: remocn.dev.
