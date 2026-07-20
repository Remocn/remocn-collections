# fable-showcases — powers of ten

The second announcement cut for remocn.dev/showcases, written in a language the repo has
never spoken: not a flight *through* space but one continuous **zoom of scale** — a single
unbroken take from inside one playing video out to the whole remocn universe, and back in
twice. Every camera move is a spring; there is no linear segment and no cut anywhere in the
main body.

## The rig

One flat world plane. Tiles live at world coordinates (640×360 units each); the camera is
`(cx, cy, S)` where `S` is scale. All three channels are **additive springs in the log-scale
domain**: each beat contributes `spring(frame - at) * (target - prevTarget)`, so overlapping
beats stay continuous and every arrival overshoots and settles like a real mass on a spring.
A slow sine hand-drift (amplitude ∝ 1/S) breathes on top, enveloped to zero inside dives and
during the cold open.

## Beats

| frames | beat |
|---|---|
| 0–58 | **Cold open.** Fullscreen, chrome-less: the real `introducing-remocn` render is just… playing. You think you're watching a normal video. |
| 58–128 | **Pull 1.** The camera snaps back on a spring — the video shrinks into a framed tile, four neighbours land beside it with staggered impacts, all playing live. Caption: *remocn has been busy*. |
| 128–204 | **Pull 2.** Wider — eight more land playing, then quietly freeze-frame once attention moves on. |
| 204–330 | **Pull 3 — the count.** The long pull reveals the whole wall: 28 more tiles cascade in along the elliptical spiral while an inline `rolling-number` odometer rides the caption to **41** — *videos, made with remocn*; mono under-line: *22 minutes, every frame rendered from code*. |
| 330–452 | **Dive 1.** A 3-frame anticipation breath back, then the camera dives into the `introducing-vercel` tile until it exactly fills the frame. The tile has been playing its hero mp4 the whole time — the dive is the same pixels, no cut, no swap. Lower-third names it. |
| 452–628 | **Bounce + dive 2.** Spring back out wide, breathe, dive into `remocn-icons-3d` on the opposite diagonal. |
| 628–726 | **The wild.** The widest bounce: our wall is suddenly not alone — slabs for outside repos land around it, `haydenbleasel/blume` largest. *Ten public repos ship with it too.* |
| 726–920 | **The letter.** The zoom keeps going; the R letterform draws itself around the shrinking universe and clips it — the whole cosmos now lives inside the mark. Ink rises through the mosaic, the R springs down to logo size, *emocn* slides out from behind it, `remocn.dev/showcases` rises beneath. |

## Live-video policy (render budget)

- Opener + the three hero tiles (`introducing-vercel`, `remocn-icons-3d`, `introducing-shadcn`)
  play `OffthreadVideo` continuously — the hero files are 1280×720/22s so the dives stay sharp.
- Wave-1/2 tiles arrive playing, then `<Freeze active>` on their last shown frame once small.
- Wave-3 tiles (13+) arrive as 640×360 thumbnail stills — at that scale motion is unreadable
  anyway. Peak concurrent decoders ≈ 8.

## remocn components

`shader-grain-gradient` (the quiet obsidian field behind the plane), `soft-blur-in` (captions),
`rolling-number` (the inline odometer). Camera physics is remotion `spring()` throughout.

## Charter

Manrope 400/600 for every word, Geist Mono for slugs and counts. Warm obsidian `#141318`,
ink `#f2f2f2`, one lime accent `#C3E88D`. No letter-spacing, no uppercase, no badges, no
pills, no pulsing, no glow. Numbers are plain — never a `+` suffix.
