# fable-flipbook — living photographs

The showcases announcement re-told as a stop-motion scrapbook, after the paper-documentary
reference: a xerox-warm desk, everything re-shot by hand at ~10 poses per second, handwriting
laid down letter by letter — while the video inside each photograph plays smooth at 30fps.
The dissonance is the concept: **the showcases are living photographs.**

## The clock

`STEP = 3` (10 poses/s). Every transform samples the timeline through `qf()`; springs are
sampled on the quantized clock so overshoot survives as hand-placed poses; every object
breathes a per-pose reshoot wobble (`paperJitter`). Only `OffthreadVideo` runs on the real
30fps clock. No linear timing — poses come from stepped springs and keyframe rows.

## Beats

| frames | beat |
|---|---|
| 0–96 | **Dark card.** White pen writes *the remocn showcases* over the quiet grain field; the dark page swings away like a notebook cover. |
| 96–520 | **The stack.** A polaroid pile on paper. The top photo plays its real render; its caption is handwritten on the frame; then a hand flips it aside in four poses and the next photograph is revealed — already playing. Seven photos: remocn, next.js, shadcn × react aria, icons in 3d, ai & social, prisma, vercel. |
| 520–748 | **The desk.** The pile deals out across the desk in one scatter, the camera pulls back a power of ten (stepped spring), and *41 videos* is handwritten across the clean band with a marker stroke; a taped sticker types *made with remocn · 22 minutes of footage*. |
| 748–956 | **The wild page.** Page turn. Taped mono stickers for the outside repos — blume large with a handwritten note — a hand-drawn arrow, *10 public repos ship with it too*. |
| 956–1188 | **The pen finale.** On a clean page the pen draws the R letterform stroke by stroke, ink floods it, *emocn* slides out from behind (the shipped lockup, paper edition), and *remocn.dev/showcases* is written beneath with a lime-ink stroke. |

## Live policy

Top-of-stack photo plays live (pre-warmed 40 frames before it surfaces), freezes on its last
shown frame 21 frames after being flipped aside; the 34 desk photos arrive as thumbnail
stills. Peak decoders ≈ 3.

## Charter

Caveat for handwriting, Geist Mono on paper stickers, Manrope only for the brand wordmark.
Paper `#f1eee7`, ink `#26242c`, pencil at 55%, one lime-ink accent `#6f7f35`. Real-object
paper shadows only. No letter-spacing added, no uppercase, no badges, no pills, no pulsing.
remocn components: `shader-grain-gradient` (dark card), `typewriter` (sticker labels).
