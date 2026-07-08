# Introducing Tenkit — storyboard

An introducing spot for Tenkit (tenkit.dev): one codebase becoming many branded apps, then resolving back into the Tenkit mark.

## Register

- Canvas: `#09090b` background, `#fafafa` ink, quiet muted foreground.
- Tenant accents: blue `#208AEF`, orange `#EF8520`, teal `#2DD4A8`. They appear only as tenant identity.
- Fonts: Space Grotesk for spoken text, Inter for small supporting text, Geist Mono for code and commands.
- No letter-spacing, uppercase text, installation pills, badges, or highlight markers.
- Logo: the supplied Tenkit lockup is embedded inline as paths so the mark and wordmark can animate separately while keeping the real proportions.

## Shader

Paper Design Voronoi. One continuous surface partitioned into many cells matches the core metaphor: one codebase, many apps.

- Backdrop: neutral zinc cells, slow movement, vignette scrim.
- Transition bloom: the same field re-lit in the three tenant colors, with cells expanding over the cut into the three-app showcase.

## Motion Score

The motion grammar is one to many, then many back to one.

- Division moves outward: the hook fans vertically, phones split horizontally, Voronoi cells expand.
- Narrative transitions push into the frame.
- Feature stations travel left with whip pans and right-to-left momentum.
- The outro reverses the split: three colored dots converge, transition to white, merge into one white point, then grow into the Tenkit mark.

## Beats

Canvas: `1280x720 @ 30fps`.
Duration: `1034` frames, about `34.5s`.

1. **Hook (92f)** — "One codebase" resolves, then fans into three tenant-colored copies.
2. **Reveal (134f)** — the mark assembles quickly, descends into the true lockup proportions, and the centered tagline reads: "Ship one app as many branded apps".
3. **Setup line (72f)** — "The setup you actually ship".
4. **Setup beats (108f)** — White label apps / Runtime tenant app / Generic + standalone.
5. **Voronoi bloom (54f)** — tenant-tinted cells bloom over the cut.
6. **Money shot (190f)** — "Same code, different identity" hands off quickly to three larger phone mockups branded Atlas / Ember / Mint.
7. **Feature montage (344f before overlaps)** — app variants in `src/constants/app-variants.ts`; local Tenkit commands; EAS build rows with animated checks.
8. **Create (108f)** — package manager cycles through `pnpm`, `bun`, `npm`, then locks into `pnpm create tenkit@latest`.
9. **Outro (128f)** — tenant dots converge and become white before growing into the Tenkit mark, then the wordmark and `tenkit.dev` resolve.
