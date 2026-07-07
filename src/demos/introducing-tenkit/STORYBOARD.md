# Introducing tenkit — storyboard

An introducing spot for tenkit (tenkit.dev) — "One Codebase Many Branded Apps":
a generator for Expo projects that ship as multiple branded native apps from a
single shared codebase.

## Register (lifted from tenkit.dev)

- Canvas: `#09090b` (site `.dark` background), ink `#fafafa`, muted `#9f9fa9`.
- THREE accents — the site's own tenant demo colors, used ONLY as tenant
  identity, never as decoration: blue `#208AEF`, orange `#EF8520`, teal
  `#2DD4A8`.
- Fonts: **Space Grotesk** (the site's `font-heading`) for everything spoken,
  Inter for small print, Geist Mono for config/CLI. No letter-spacing, no
  uppercase, no pills, no badges, no highlight markers, no trailing periods.
- Logo: the real `tenkit-logo-long.svg` embedded inline (mark = two folded
  faces, wordmark = six letter paths) so faces assemble and letters stagger.

## Shader

**paper.design Voronoi** — chosen for meaning, not looks: one continuous field
partitioned into many cells IS the product (one codebase, many apps). Two
voices of the same shader:

- Backdrop: neutral zinc cells (`#0e0e12/#131318/#17171d`), hairline gaps,
  slow, behind a vignette — texture, not subject.
- Statement transition (VoronoiBloom): the same field re-lit in the three
  tenant tints, cells GROWING (scale up = apps multiplying) as it covers the
  cut into the money shot, then tail-fades (pinned-presentation rule).

No swirl anywhere.

## Motion score

One → many is the only idea, so one grammar carries it:
- Division moves OUTWARD from center (hook text fans apart vertically, the
  phone clones slide apart horizontally, voronoi cells grow).
- Narrative progress dives INTO the frame (push-through), small steps are
  focus-pulls; enumeration travels LEFT (whip-pans, content arriving from the
  right, decelerating out of the whip's momentum).
- The outro REVERSES the split: three tenant dots converge into the one mark —
  many apps, one codebase again.
- Every scene rides a slow camera drift; no fade-in/fade-out-only moves.

## Beats (@30fps, 1280×720, ≈41s)

Every text beat holds long enough to be read before anything else moves.
Statement-first rhythm: wherever a label used to sit under a visual, the
words now land FIRST, alone, and the visual acts them out afterwards.

1. **Hook (116f)** — "One codebase" resolves word by word, holds a full
   breath, then the line itself FANS into three copies — blue rises, orange
   holds center, teal descends — the sentence literally becomes many.
   Push-through dives through the vacated center.
2. **Reveal (190f)** — the mark's two folded faces glide together out of blur
   (assembly = generated project), one crisp grandeur beat, then ONE descent
   curve: the mark shrinks left into the BOXED lockup — the wordmark letters
   stand exactly as tall as the mark, and "Ship one Expo app as many branded
   apps" spans exactly the lockup width beneath. Focus-pull.
3. **Setup line (92f)** — kinetic center-build: "The setup you actually ship"
   (the site's own phrase). Focus-pull.
4. **Setup beats (128f)** — the three real Setup Types hard-cut on a beat,
   ~38f each: White label apps / Runtime tenant app / Generic + standalone.
5. **VoronoiBloom (54f)** — tenant-tinted cells bloom over the cut.
6. **Money shot (232f), two beats** — the bloom lands on the STATEMENT
   first: "Same code, different identity", alone, readable. The words lift
   away and the screens act it out: one neutral code-drawn phone rises, two
   clones slide out from behind it (same code), then identity floods
   left→right: icon, app name (Atlas / Ember / Mint), button re-tint.
   Whip-pan left.
7. **Feature montage (304f), two beats per station** — each label arrives
   first, alone at center, readable; then it glides down to its seat while
   the fragment slides in from the right: `variants.config.ts` typed config
   with tenant hexes in their own colors; the real local CLI rows
   (`pnpm tenkit build / doctor / reset`); EAS build rows filling to quiet
   checks per tenant. Whip-pans left inside. Focus-pull.
8. **Create (90f)** — `pnpm create tenkit@latest` types itself in mono with a
   block caret. Nothing else on screen. Push-through.
9. **Outro (150f)** — the reverse split: three tenant dots fly in from the
   directions the phones went and CONVERGE into the mark slot; the mark
   pops where they merge, letters stagger into the same boxed lockup,
   `tenkit.dev` faint at the bottom.
