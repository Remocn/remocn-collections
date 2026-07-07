# STORYBOARD — Introducing Videorc

An introducing spot for Videorc — OrcDev's open-source Mac studio for
recording, multistreaming and AI publishing. After ~22 seconds the viewer
should know: **Videorc records your screen in 4K for free, goes live to five
platforms at once, and its AI does the publishing chores** — one calm Mac app,
open source.

- **Arc:** verbs hook → name → positioning → three feature stations → value
  stack → lockup + URL.
- **Length:** ~22s @ 30fps, 1280×720.
- **Register:** Videorc's own dark zinc tokens — `#18181b` canvas, `#f5f5f6`
  ink, `#a1a1a8` muted — with ONE accent: record-red `#ff3b30` (the logo's
  eyes, the record dot). Manrope 400 everywhere; Geist Mono only for the
  timecode chrome. No letter-spacing, no uppercase, no pills, no badges,
  no highlight markers, no trailing periods.
- **Shader choice (paper.design):** grain-gradient — film grain over a slow
  gradient is the texture of video itself. One quiet `corners`-shaped
  grain-gradient carries the whole video (zinc with a faint warm-red
  undertone, grain kept alive, center clear for type); the two statement
  transitions — ripple-zoom and wave-wipe — are the SAME shader in `ripple`
  and `wave` shapes, so backdrop and transitions speak one language. No swirl
  anywhere.
- **Recording chrome:** from the reveal onward a quiet mono timecode with a
  blinking red dot ticks along the bottom-left — the video wears the
  product's own chrome, as if Videorc is recording the spot. At the outro
  lockup the timecode freezes, the dot goes solid, and the chrome lifts away:
  the recording is done.
- **Motion score:** narrative progress always moves INTO the frame
  (z-axis: ripple dive, push-through); enumeration always moves LEFT
  (whip-pans, content arriving from the right and decelerating — every
  entrance inherits the previous cut's momentum). No motion starts against
  the motion before it; nothing fades in without a direction.

---

## Frame 1 — Hook, ● REC

- scene: bare zinc canvas; the ● REC lockup lands dead-center — the dot
  blinking on the camcorder cycle, REC in heavy red beside it. After two
  blinks the camera dives INTO the dot: an accelerating zoom pinned to the
  dot's center, the letters flying past, until the flat red swallows the
  frame.
- voiceover: (silent — the blinking REC carries it)
- duration: 3.5s (the dive takes the tail)
- transition_in: cut (opening frame)
- src: IntroducingVideorcDemo → HookScene
- type: hook
- persuasion: instant recognition — recording is on
- beat: recognition → plunge

narrativeRole: the blinking REC plants the brand accent before the brand,
and the dot becomes the door.
keyMessage: a recording just started.

## Frame 2 — Meet Videorc

- scene: we fall THROUGH the record dot — behind the flat red a grain-ripple
  tunnel (brand red, muted) is already open and holds readable while it
  keeps zooming, so the red dissolves into its rings with no visible fade —
  and the tunnel reveals ONLY the orc mark, enlarged, alone in the center.
  Three moves follow (the shieldcn-plus push mechanic): the mark shrinks to
  lockup size, then "Videorc" drives in from the right on one aggressive
  curve and physically PUSHES the mark left — the mark's position is derived
  from the word's, so from the moment of contact the pair moves as one rigid
  body; an impact pop sells the hit. The site's own tagline rises word by
  word beneath once they park.
- voiceover: "Meet Videorc. The future of video starts here."
- duration: 6.5s
- transition_in: signal dive (in-scene zoom into the dot + grain-gradient
  `ripple` tunnel revealed beneath the swallow — the record dot IS the
  transition)
- src: IntroducingVideorcDemo → RevealScene
- type: product_intro
- persuasion: category naming, in the project's own words
- beat: relief + intrigue

## Frame 2b — The verbs

- scene: the three jobs hard-cut on a beat in the calm world — Record /
  Stream / Publish — now that the viewer knows whose jobs they are
- voiceover: "Record. Stream. Publish."
- duration: 2.9s
- transition_in: focus-pull (calm editorial shift out of the reveal)
- src: IntroducingVideorcDemo → VerbsScene
- type: product_intro
- persuasion: category recognition — the three jobs every creator has
- beat: rhythm → momentum

narrativeRole: names the three jobs in three beats, straight after the name.
keyMessage: recording, streaming, publishing — one rhythm.

narrativeRole: the turn — name, mark and tagline land together, nothing else
competing. The timecode chrome starts ticking here: the recording has begun.
keyMessage: Videorc — the future of video starts here.

## Frame 3 — One window

- scene: the site's positioning line assembles word by word in the center
- voiceover: "Everything you need in one window."
- duration: 3.2s
- transition_in: focus-pull (calm editorial shift, same world)
- src: IntroducingVideorcDemo → OneWindowScene
- type: product_intro
- persuasion: anchoring — all-in-one against the three-tools pain
- beat: clarity

narrativeRole: the whole pitch in six words, their own words.
keyMessage: one app does all three jobs.

## Frame 4 — Capture

- scene: whip-pan left into the first station: a code-drawn capture fragment
  arrives from the right and decelerates — the screen surface draws in, the
  red dot with a running mini-timecode lands top-left, the camera bubble
  docks bottom-right, a live mic waveform breathes at the bottom;
  "3840×2160 · 60 fps" sits quiet in the corner. Label beneath.
- voiceover: "Record your screen, camera and mic in 4K — free, no watermark."
- duration: 2.2s
- transition_in: whip-pan left (montage momentum begins)
- src: IntroducingVideorcDemo → CaptureScene
- type: feature_showcase
- persuasion: the free tier IS the product — no watermark, no paywall
- beat: control

narrativeRole: the first feature acted out, not listed.
keyMessage: 4K recording, free.

## Frame 5 — Multistream

- scene: same momentum, next station: the red source dot lands left of
  center and five rays draw outward to the right, one per beat — YouTube,
  Twitch, X, RTMP and one more — endpoints popping in as each ray arrives.
  The fan IS the multistream.
- voiceover: "One go-live, five destinations."
- duration: 2.2s
- transition_in: whip-pan left
- src: IntroducingVideorcDemo → MultistreamScene
- type: feature_showcase
- persuasion: the premium headline feature, shown as geometry
- beat: reach

narrativeRole: one signal fanning out — the premium argument in one picture.
keyMessage: five platforms at once.

## Frame 6 — AI publish

- scene: same momentum, last station: four rows arrive from the right one
  after another — Transcript, Title & description, Chapters, Highlights —
  and a quiet check settles on each as it lands. The chores doing themselves.
- voiceover: "Stop recording — AI writes the rest."
- duration: 2.5s
- transition_in: whip-pan left
- src: IntroducingVideorcDemo → PublishScene
- type: feature_showcase
- persuasion: feature-to-benefit — the tedious parts, handled
- beat: relief

narrativeRole: the AI pipeline as a settling checklist, not a buzzword.
keyMessage: stop → published.

## Frame 7 — The values

- scene: the grain swell washes the montage away upward (wave-wipe) and the
  calm world returns; three lines slide in one after another and hold
- voiceover: "Open source, free forever. 4K on your Mac. From stop to published."
- duration: 3.3s
- transition_in: wave-wipe (grain-gradient `wave` — the montage exits on the
  same upward energy the rows arrived with)
- src: IntroducingVideorcDemo → ValuesScene
- type: benefit_highlight
- persuasion: value stacking, risk reversal first
- beat: confidence

narrativeRole: compresses the offer into three memorizable claims.
keyMessage: free forever, 4K local, AI publishing.

## Frame 8 — Lockup

- scene: push-through dive into the last frame: the site's own app icon (the
  orc on its black plate) springs in, "Videorc" glides in beside it — the
  lockup alone, dead-center. The timecode freezes, the red dot goes solid,
  the chrome lifts away — recording saved. A faint "Open source, built by
  OrcDev" settles at the bottom.
- voiceover: "Videorc. Open source, built by OrcDev."
- duration: 5.3s
- transition_in: push-through (the final move deeper)
- src: IntroducingVideorcDemo → OutroScene
- type: cta
- persuasion: risk reversal (open source) + author trust + destination
- beat: trust + inevitability

narrativeRole: the brand stamp and the one place to go; the chrome payoff
closes the recording-session frame story.
keyMessage: videorc.com.
