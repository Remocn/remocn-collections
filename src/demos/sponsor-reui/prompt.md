# sponsor-reui — "Say hello to my new sponsor"

A sponsor spot for **reui** ([reui.io](https://reui.io), by Keenthemes) — a
design-forward, open-source shadcn/ui component library. **Free** tier: 1,019
components + 17 primitives + an MCP server (100 req/day) + agent skills. **Pro**
($249 one-time): + 485 Pro blocks + unlimited MCP. **Ultimate** ($499): + 2,248
icons + full page templates. Built on React 19 + Tailwind v4 + Motion.

Sibling of `sponsor-reactbits` and `sponsor-gramotion` — same arc, reui's register.

## Register (verified from reui's own token file)

reui is **pure monochrome neutral, zero chroma** — the accent is white, and
color lives only inside its charts. Values are its dark theme:

- `--background: oklch(0.145 0 0)` ≈ `#0a0a0a` · `--foreground` ≈ `#fafafa`
- `--card: oklch(0.205 0 0)` ≈ `#1a1a1a` · `--muted-foreground: oklch(0.708 0 0)` ≈ `#b5b5b5`
- `--border: oklch(1 0 0 / 10%)` — white at 10%
- Font: **Inter** (the site binds both `--font-sans` and `--font-heading` to it),
  weight 400 only. Geist Mono carries the one shell command.

One quiet grayscale simplex-noise field carries the whole video, pushed back by
a vignette.

## Beats

1. **Hook** — "Say hello to my new sponsor" rises word by word. → push-through
2. **Reveal** — the real reui logo (mark + wordmark) resolves out of depth, "Design-forward shadcn/ui components" beneath. → **icon-scatter** (debut)
3. **Icon wall** — 18 real registry icons stroke-draw and fire their action in a diagonal wave under "Icons that animate on their own". → focus-pull
4. **Demos** — one live vignette per hard cut: Data Grid (rows deal in, sort caret, selected row) · Kanban (a card lifts To do → Doing) · Charts (animated bars). → crossfade
5. **Pro-block groups** — the five groups named one word at a time through the **shared-axis-z** depth morph (Application → Solutions → eCommerce → Data Grid → Marketing), each held to read. → focus-pull
6. **Pro blocks showcase** — a category grid rebuilt from [reui.io/blocks](https://reui.io/blocks): 12 cards (Dashboard, Chart, Auth, Kanban Board, Data Grid, Settings, CRM, Product Card, Stats, Analytics, Billing, Timeline) deal in on a diagonal wave, each with a tiny **live preview of that block type inside**. → crossfade
7. **MCP line** — "Your agent can build with them too" soft-blurs in. → push-through
8. **Install** — `npx shadcn@latest add reui.io/r/` types itself, the slug rolodex-flips data-grid → kanban → stepper → timeline → calendar (a terminal line, never a pill). → blur-fade
9. **Outro** — the introducing-remocn logo gesture inherited: smoke ring blooms, the R mark draws itself on, "emocn" slides out to assemble Remocn, then the real reui logo slides in from the side at matching size (Remocn ✕ reui).

## New registry transition: `icon-scatter`

`src/components/remocn/icon-scatter.tsx` — a scene change made of icons. The
frame shatters into a deterministic field of line-icons that stroke-draw, spin
and scatter outward over a cover that hides the swap, then fly off and draw away
as the incoming scene resolves through them. Self-contained (inlined paths,
`pathLength`-only draw-on), props: `count`, `color`, `coverColor`,
`coverOpacity`, `strokeWidth`, `flyDistance`, `seed`. Not swirl, not ripple.

## Constraints honored

No swirl / ripple transition · no letter-spacing · no uppercase · no badges ·
no pulsing · no installation pills.
