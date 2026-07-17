# Introducing Vercel — storyboard

Spec: https://github.com/Remocn/remocn-content/issues/4 (produced per the pipeline in #1).
~29s @ 30fps, 1280×720. ONE continuous camera flight — no hard cuts; every
transition is a camera move. The triangle is a portal; the flight's three
stations are Vercel's own creed: Develop, Preview, Ship.

## Register

- Canvas `#000000`, ink `#ededed`, bright ink `#fafafa` (creed + lockup only),
  muted `#a1a1a1`, card `#111111`.
- **Monochrome cut.** The spec allows Vercel blue `#0070f3` in at most two
  moments IF verified against the live design-system tokens. At build time
  (2026-07-12) the tokens were not exposed on vercel.com (only a hover-state
  `#0B7BFE` surfaces in served markup), so per the spec's own fallback the
  video ships fully monochrome.
- Geist 400–600, sentence case; Geist Mono 400 only for shell commands and
  URLs-as-chrome.
- The eclipse rim-light is the only sanctioned lighting event: god-rays behind
  the triangle occluder, rebuilt live from shaders — never the OG image. Type
  is never backlit.

## Fact verification (production note compliance)

Checked against vercel.com on 2026-07-12:

- "Zapier serves over 100 million monthly website visits on Vercel." — present
  verbatim in the customer strip. ✔ kept.
- "Notion powers millions of agent conversations daily on Vercel." — present
  verbatim. ✔ kept.
- Agent Stack section lists AI SDK, Sandbox, AI Gateway. ✔ frame 6 uses the
  homepage's own vocabulary.
- Vercel blue `#0070f3` — NOT verifiable against live tokens. ✘ dropped;
  monochrome fallback engaged (sanctioned by the spec).

## The flight

1. **The eclipse** (92f) — grain void, god-rays behind the black triangle,
   `scale-down-fade` lands "Shipping used to be the hard part."
2. → **triangle-portal** (NEW) — the camera accelerates into the triangle's
   dark interior; the rim light streaks past the lens.
3. **Develop** (140f) — a terminal alone in space, `git push` typing itself,
   the prompt calm. The block cursor goes solid before the dive.
4. → **seamless-zoom** (NEW) — match-cut: the cursor's rectangle becomes the
   page surface of the browser (`outRect` = cursor, `inRect` = page; both are
   the same flat `#ededed` at the crossover).
5. **Preview** (146f) — browser card on `#111111`, `acme-git-new-nav.vercel.app`
   in the address bar, a comment pin popping onto the page.
6. → **triangle-portal** again — the favicon IS the triangle.
7. **Ship** (148f) — the same page multiplying outward across a receding
   edge-node field (manual perspective projection, one SVG for the dots),
   latency wheeling 240 → 38 ms in the corner of the formation.
8. → **face pull-back** (local presentation) — the Ship world recedes onto the
   prism's front face, which hosts the mini edge field.
9. **The creed** (136f) — **prism-spin** (NEW): a preserve-3d triangular prism
   whose faces are the three worlds just visited; "Develop. Preview. Ship."
   builds word by word in bright ink, hand-synced so each word lands as its
   face passes (custom center-build; the registry kinetic-center-build rhythm
   is fixed and cannot sync to the prism).
10. → crossfade (the void is one world).
11. **The agent era** (108f) — AI SDK. / Sandbox. / AI Gateway. /
    "Infrastructure for agents, too." in bright ink.
12. → crossfade.
13. **The receipts** (112f) — 100 million monthly visits (Zapier) with the
    figure wheeling in Geist Mono odometer digits; millions of agent chats,
    daily (Notion).
14. → **drift back** (local presentation) — seamless zoom out; the monolith
    was behind us all along.
15. **Return to the eclipse** (152f) — the triangle shrinks into the lockup
    slot, "Vercel" slides out from behind it (Geist 600 bright), "Where the
    web ships" + `vercel.com` muted beneath, the rim light breathes once and
    holds.

## Registry gaps built here (candidate components after the video ships)

- `triangle-portal.tsx` — fly-through-a-mask transition. Outgoing scene scales
  past the lens toward the flight target; a polygon clip-path (triangle by
  default, any vertex list generalizes) opens from the same point; incoming
  scene lives inside the mask. Entering presentation collapses to a bare
  wrapper at p ≥ 1 (TransitionSeries pins it for the whole incoming scene).
- `seamless-zoom.tsx` — match-cut infinite zoom. Takes `outRect`/`inRect`
  target rects; the camera maps the outgoing rect to the full frame while the
  incoming scene starts with its rect covering the frame and settles to
  identity.
- `prism-spin.tsx` — preserve-3d triangular prism; three faces host arbitrary
  scene children; rotation is a plain prop so the parent owns the timeline.
  CSS 3D only. Never put a `filter` on an ancestor (filters flatten
  preserve-3d).

## Deviations from the spec text (and why)

- Fully monochrome (see above) — spec-sanctioned fallback.
- The creed uses a hand-rolled center-build instead of the registry
  `kinetic-center-build`: the registry component's word rhythm is fixed
  (10/13-frame pushes) and cannot land each word on its prism face.
- The proof figures use Geist Mono odometer digits instead of
  `rolling-number`/`number-wheel`: the register mandates Geist for figures
  and the 100 must sit inline on the text baseline; the registry components
  are block-centered and carry their own JetBrains Mono 800.
