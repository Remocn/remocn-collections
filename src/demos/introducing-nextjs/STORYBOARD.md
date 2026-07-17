# Introducing Next.js — storyboard (eclipse cut)

Spec: https://github.com/Remocn/remocn-content/issues/3, reworked per the
maintainer's second-pass direction: eclipse intro + ring dive, the official
full logotype with a draw enter, grain gradient everywhere, the nextjs.org
construction lines as animated decorations, the three feature-card
illustrations and the Powered By block rebuilt live, Geist Sans as on
nextjs.org. ~39s @ 30fps, 1280×720.

## Register

- nextjs.org dark tokens: `#000000` canvas, `#111111` card, `#ededed` ink,
  `#a1a1a1` muted. **Strictly monochrome type** — white is the accent.
- Geist 400–600 (headlines 600, as the site sets them), Geist Mono 400 only
  for the shell register (`theme.ts`).
- One grayscale `shader-grain-gradient` (corners shape) carries the whole
  video behind a vignette; the ring-dive transition and the pre-install cover
  are the SAME shader in ripple/blob shapes — backdrop and cuts speak one
  language.
- Illustration-surface exemptions (the site's own colors, confined to the
  illustration): the streaming pulses' #3291FF→#61DAFB gradient, the Powered
  By trace pulses, the SWC coil gradient, and the circle-N / logotype
  gradient sheens.

## Fact verification

Same verified set as the first cut (nextjs.org, 2026-07-12): all five
featured customers present; Notion 0.09 CLS and Frame.io 100ms verbatim;
headline + subtitle verbatim (the subtitle's bold segment kept bold);
feature-card titles/subtitles verbatim from the cards. GitHub stars
deliberately absent. Logotype and icon are the official brand SVGs from
vercel.com/geist/brands (dark-background variants), embedded path-for-path.

## Transition grammar (cohesion pass, 2026-07-12)

One language, not seven. The cuts hand off through a single family — dive,
push, pan — so the piece reads as one take; `fade` is spent exactly once, on
the final breath into the lockup.

- **`CameraRig`** wraps the whole `TransitionSeries` — a slow continuous creep
  on the composition's absolute frame that never resets at a cut. The
  connective tissue under every handoff.
- **Eclipse → Logotype is a fly-through, not a clip portal.** The eclipse
  self-dives (scale up from the ▲ center) so the flat-black interior swallows
  the frame — the camera flies THROUGH the aperture — then `logoApproach`
  brings the wordmark out of the black TO MEET the camera (small → full, out
  of blur). A clip-path triangle-portal was tried here and rejected: it drew
  the logo clipped inside the mask and popped it out, with the eclipse's own ▲
  reading as a second triangle.
- **Triangle-portal** (reused from `../introducing-vercel/triangle-portal`) is
  the signature for Hero → Command: the Get Started click opens the portal.
- **One light.** `GrainHalo` (single `HALO_COLORS` palette) is the eclipse's
  halo and the logo-approach bloom — one continuous field of light.
- **Cuts:** Hook→Eclipse `softDolly` (pull focus words→image) · Eclipse→Logo
  `logoApproach` (fly-through + approach) · Logo→Hero `pushThrough` ·
  Hero→Command `trianglePortal` ·
  Command→Features `pushThrough` · Features→Powered `whipPan` (same whip the
  stations use, so features+proof read as one pan) · Powered→Lockup `fade`.
- Transition frame-counts were kept identical to the previous cut, so
  `INTRODUCING_NEXTJS_DURATION` is unchanged.

## The flight

1. **The eclipse** (104f) — the backlit triangle over a grainy halo (a local
   grain field masked to a circle of light — the OG look), the hook beneath;
   the camera dives INTO the triangle (in-scene zoom pinned to its center,
   the introducing-videorc dive) until the flat black swallows the frame.
2. → **triangle dive** (70f) — we fell INTO a triangle, so we fall THROUGH
   triangles: nine concentric triangular rings zoom past the lens (born
   small at the vanishing point, exponential scale, blurring as they pass),
   a grainy halo breathing at the center. Same dive mechanics as the videorc
   SignalDive; the geometry is the brand's own.
3. **The logotype** (150f) — the official 394×80 wordmark writes itself:
   glyphs traced left-to-right (pathLength-normalized strokes), fills rising
   beneath the tracing line. The tracing starts exactly as the tunnel hands
   the frame over (`LOGOTYPE_DRAW_START` ≈ the p=0.86 child reveal).
4. **The hero** (176f) — `decorations.tsx`: the intro-module dashed guides
   draw in from their start edges, the 75×75 dashed marker circles settle on
   intersections with a slow dash drift; headline (Geist 600), subtitle,
   the button pair, `▲ ~ npx create-next-app@latest`.
5. **The receipts** (90f) — `perspective-marquee`, five names, muted ink.
6. **The features** (324f) — three whip-pan stations, each card rebuilt live
   (`features.tsx`): pixel mountains assembling with a shine pass; the
   wireframe streaming in piece by piece with traveling pulses; the RSC
   sphere tree growing with dashed edges and mesh spheres.
7. **Powered By** (160f) — `powered-by.tsx`: heading, the chip with pins,
   circuit traces drawing outward, colored pulses riding the wires, three
   tooling cards springing in.
8. **The numbers** (116f) — Geist 600 odometer digits, exact-landing
   per-place travel math; both figures land before the grain cover arrives.
9. **The command** (96f) — grayscale grain-dissolve cover; the registry
   Typewriter routed into Geist Mono via the `--font-geist-sans` var
   override; a black occluder retires the cover's persistent field.
10. **Blueprint lockup** (150f) — construction lines + marker circles on the
    far intersections, circle-N + "Next.js", nextjs.org, the grid breathing.

## Build notes

- `theme.ts` — shared fonts/tokens; `decorations.tsx` — GridLine/GridArc;
  `logotype.tsx` — official glyph paths + LogotypeDraw; `features.tsx` — the
  three illustrations; `powered-by.tsx` — the circuit scene.
- The tunnel is hand-built (SVG triangle strokes on an exponential scale
  cycle), not the ripple shader — a grayscale grain ripple reads as circles
  at best and as a soft glow at worst; the triangle geometry is the point.
- Odometer digits use the registry rolling-number per-place travel math —
  naive `(current/pow)%10` rests between digits on non-round landings.
