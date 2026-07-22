# Text jitter in registry components — what it is and how to fix it

A line of type that is animating slowly does not glide: it holds still, clicks down
a pixel, holds still, clicks again. Give every word or character its own stagger and
those clicks land on different frames, so a ripple runs through the line. Geometry
sitting right next to it — rules, borders, SVG marks — glides perfectly smoothly,
and that contrast is what makes the eye catch it.

This is not a Remotion bug and not a rendering setting. It is how browsers draw text.

---

## Why it happens

A glyph is rasterized into a cache, and that raster can only be placed on a whole
device pixel vertically. When an animation moves text by 3px in a frame, the glyph is
re-placed 3 pixels down and reads as motion. When an eased tail moves it by 0.04px in
a frame, nothing happens at all for several frames — then the accumulated offset
crosses a half-pixel boundary and the glyph jumps a whole pixel at once.

So the artifact is not caused by the creep itself. It is caused by **pixel crossings
spaced many frames apart**, which only happens once the motion drops below roughly
half a pixel per frame. Anything faster crosses a boundary nearly every frame and
looks continuous.

Rectangles and paths have no such cache — a border at y = 100.04 is drawn by shading
its edge pixel 4% darker. That is why in the same frame the hairline glides and the
caption trembles.

---

## The rule

> **While text is moving, keep it faster than ~0.5px per frame. Never let an eased
> curve park type in the sub-pixel zone.**

Almost every easing used for entrances violates this by design: `bezier(0.22, 1, 0.36, 1)`,
`bezier(0.2, 0.8, 0.2, 1)`, expo-out and friends are chosen precisely because they
decelerate hard into the target — and that deceleration is the artifact.

Ease-**in** exits have the mirror problem: they creep at the *start* instead.

---

## The fix

Split the progress driver in two. **Position gets a short window; opacity, blur and
colour keep the full one.** The entrance still reads the same, because the part you
remove is the part the eye never saw as movement — only as clicking.

```tsx
// before — one progress drives everything
const p = interpolate(local, [0, DUR], [0, 1], { ...clampOpts, easing });
// ...
opacity: p,
transform: `translateY(${(1 - p) * distance}px)`,
filter: `blur(${(1 - p) * 8}px)`,

// after — travel lands early, the rest of the curve is untouched
const p  = interpolate(local, [0, DUR],    [0, 1], { ...clampOpts, easing });
const py = interpolate(local, [0, TRAVEL], [0, 1], { ...clampOpts, easing });
// ...
opacity: p,
transform: `translateY(${(1 - py) * distance}px)`,
filter: `blur(${(1 - p) * 8}px)`,
```

For an ease-**in** exit, delay the start instead of clipping the end:

```tsx
const y = interpolate(local, [TRAVEL_FROM, DUR], [0, -6], { ...clampOpts, easing });
```

Keep `clampOpts` on both, or the position will keep drifting past the window.

---

## What to change, component by component

`TRAVEL` below is the window in which the curve still moves faster than 0.5px/frame,
computed from each component's own distance, duration and easing. Using exactly that
number leaves **zero** slow crossings. Using something between it and the original
duration is a legitimate compromise — softer landing, one crossing left instead of
several — which is what has already shipped in this repo.

| component | distance | duration | slow frames | fix |
|---|---|---|---|---|
| `soft-blur-in` | 16px | 27 | 18 | clip travel to **9** (shipped here: 16) |
| `per-character-rise` | 32px | 21 | 11 | clip travel to **10** |
| `line-by-line-slide` | 48px | 27 | 13 | clip travel to **14** |
| `per-word-crossfade` enter | 8px | 21 | 16 | clip travel to **5** (shipped here: 13) |
| `per-word-crossfade` exit | 6px | 15 | — | ease-in: start travel at **6** |
| `mask-reveal-up` | 30px | 23 | 12 | clip travel to **11** |
| `bottom-up-letters` | 46px | 12 | 5 | clip travel to **7** |
| `top-down-letters` | 46px | 12 | 5 | clip travel to **7** |
| `blur-out-up` enter | 10px | 17 | 11 | clip travel to **6** |
| `blur-out-up` exit | 14px | 14 | 8 | ease-in: start travel at **8** |
| `short-slide-right` | 24px | 16 | 8 | clip travel to **8** |
| `short-slide-down` | 26px | 15 | 7 | clip travel to **8** |
| `kinetic-center-build` | 26px | 13 | 6 | clip travel to **7** |
| `staggered-fade-up` | 20px | 12 | 0 | **nothing** — it is linear, 1.67px/frame throughout |

The first four are the loud ones: two or more crossings land in the slow zone, so the
ripple is plainly visible. The rest click once and read as a faint shimmer.

`staggered-fade-up` is the proof of the rule: same job, same distance, no easing, and
it is completely clean.

### Scale animations count too

`spring-scale-in` scales words rather than translating them (0.7 → 1 over 11 frames on
a `bezier(0.34, 1.56, 0.64, 1)` overshoot). A scale moves every glyph by a different
amount, so the same reasoning applies to the edges of the word: at 72px type the outer
letters travel ~10px and their tail creeps like any other. Treat it the same way —
let the scale land while it is still moving, and keep opacity on the full curve.

---

## What does NOT work

These were all measured on 2x renders and rejected.

**Per-character `will-change` / layer promotion.** The obvious idea — promote each
animating character so the compositor moves a texture instead of re-rasterizing — is
*worse than the artifact*. Sixteen promoted text layers shimmer even at complete rest
(sustained jerk 0.40 versus 0.00 for plain spans). Do not put `will-change` on
per-glyph or per-word spans.

**`text-rendering: geometricPrecision`, `-webkit-font-smoothing: antialiased`,
`opacity: 0.999`, `translateZ(0)`.** No measurable effect whatsoever; the numbers came
back identical to the untreated control.

**A tiny rotation** (`rotate(0.05deg)`) does defeat the whole-row pixel snapping, but it
only trades a coherent 1px staircase for an incoherent sub-pixel wave, and under a
promoted layer it makes things slightly worse (the tilted texture resamples).

---

## Two neighbouring cases with different fixes

**A continuous zoom over static text** (a slow push-in on a whole scene) is the one
place layer promotion is the right answer: `will-change: transform` on the *animated
wrapper* — not on the text — rasterizes the scene once and moves it as a texture,
which takes the snapping to the measurement floor. The cost is edge sharpness
(20-80% edge 1.7px → 2.1px at 1x), largely recovered by rendering at `--scale=2`.

**A reveal that animates layout** — a wrapper whose `width` grows to uncover text — is
the worst case of all, because the row is re-laid-out every frame and the type lands on
fractional pixels with no cache to reuse. Rewrite it with `transform` and `clip-path`:
hold the wrapper at its final size, uncover with `clipPath: inset(0 X% 0 0)`, slide the
content with `translateX`, and carry any re-centering the growing width used to produce
on the parent as a transform.

---

## How to verify

Real motion is smooth in time; quantization is "hold, hold, leap", which is a spike in
the second derivative. Measure it straight off a finished render — no tracking needed:

```bash
# per-frame jerk, restricted to near-white type so a dark noise background
# cannot drown the signal
ffmpeg -i out.mp4 -vf "format=gray,\
lutyuv=y='if(gt(val\,170)\,val\,0)',\
tblend=all_mode=difference,tblend=all_mode=difference,\
signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=jerk.txt" -f null -
```

Two chained `tblend=difference` passes — `tmix` with negative weights clamps its
intermediate result to zero and silently returns all zeros. Drop one of the two
passes to get plain per-frame motion for comparison.

Then average `jerk` over the frames of a hold and compare before/after. For reference,
on this repo's sponsor-reui cut the shipped fixes moved the hook from 0.142 to 0.095
and the soft-blur-in line from 0.127 to 0.108, while every untouched scene stayed
identical to three decimals — which is also how you confirm you changed only what you
meant to.
