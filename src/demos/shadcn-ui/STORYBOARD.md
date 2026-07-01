# STORYBOARD — shadcn/ui product demo

> Step 3 (Story design) output. Decides what the video says, in what order, and the SHAPE of
> each line. Layout, composition, and motion are Step 4. For this remocn project there is no
> `capture/` directory, so `asset_candidates` names **remocn components** (UI-block sims and
> animations) the beat leans toward — not invented screenshot filenames. Step 4 confirms or
> overrides every blueprint and component.

## Product truth

- **Audience** — React / Next.js developers building apps and their own design system.
- **Pain / desire** — they want components that look great AND that they fully control; today they
  `npm install` a black-box library, then fight its styles and overrides, and it never feels theirs.
- **Promise** — *It's not a component library. It's how you build your own — you own the code.*
- **Product role** — a code-distribution platform: beautifully designed, accessible components you
  copy into your repo with one CLI command and own outright.
- **Proof** — `npx shadcn add button` drops real code into `components/`; built on Radix + Tailwind;
  open code you edit freely; theming + dark mode via CSS variables; a registry to distribute your own
  components; AI-ready open code; 100,000+ GitHub stars, 20,000+ projects, works with every framework.
- **CTA** — `npx shadcn@latest init` → ui.shadcn.com.

## Arc

**BAB (Before → After → Bridge)**, opened with a category-reframe hook and run with a
feature→benefit rhythm through the demo. The whole story bridges one move: *stop installing a locked
library — copy the code and own it.* Before (fight a black box) → After tease (Open Code) → Bridge
(the install) → Step 1 (own & edit it) → Step 2 (registry/distribute) → wow (ecosystem proof) → CTA.

## Voice & design register (from the shadcn/ui repo)

Plain, confident, low-hype, developer-to-developer — short declarative lines, real CLI commands, no
adjectives the product wouldn't use about itself. Visual world to honor in Step 4: **monochrome**,
near-black canvas (`zinc-950` / `#09090b`), white and muted-zinc text, hairline 1px zinc borders,
generous whitespace, **Geist Sans** for copy and **Geist Mono** for every command and code token,
small radii, no glow or gradient wash. Pick remocn components with a `tech` / `clean` vibe.

---

## Frame 1 — Not a library

- scene: three reframe options flick through one slot — "A component library?" / "A package to install?" — then a hard "No." crashes in and resolves to "It's your code."
- voiceover: "A component library? A package you install? — No. It's your code."
- duration: 4
- transition_in: cut
- status: outline
- src: compositions/frames/01-not-a-library.html
- type: hook
- persuasion: Category reframe
- beat: curiosity + intrigue
- blueprint: ticker-takeover — options cycle on one swapping word, then the hero claim crashes in
- asset_candidates: remocn/ticker-takeover or rolling text-swap on a single slot; Geist Mono for "your code"

narrativeRole: Stops the scroll by refusing the obvious label and promising something different.
keyMessage: shadcn/ui isn't a library you import — it's code you own.

## Frame 2 — Fighting the black box

- scene: pain lines land solo on a bare dark canvas, each clearing before the next — install, fight, override, still-not-yours.
- voiceover: "You install the library. You fight its styles. You override its CSS — and it's still not yours."
- duration: 4
- transition_in: crossfade
- status: outline
- src: compositions/frames/02-fighting-the-black-box.html
- type: pain_point
- persuasion: Pain agitation
- beat: frustration
- blueprint: kinetic-type-beats — 3–4 short pain statements, each landing alone, no product yet
- asset_candidates: typography-only (kinetic-type-beats); optional faint locked-package / node_modules motif

narrativeRole: Names the everyday pain of black-box component libraries so the viewer feels it.
keyMessage: Imported libraries cost you control — they're never really yours.

## Frame 3 — Open Source. Open Code.

- scene: the name lands, then the two-line creed resolves under it — "Open Source. Open Code."
- voiceover: "Introducing shadcn/ui — beautifully designed components. Open Source. Open Code."
- duration: 3.5
- transition_in: zoom-through
- status: outline
- src: compositions/frames/03-open-source-open-code.html
- type: product_intro
- persuasion: Friction reduction
- beat: relief + intrigue
- blueprint: kinetic-type-beats — hard-cut through "Introducing…" / tagline and resolve on the name
- asset_candidates: remocn/blur-out-up or tracking-in for the wordmark; "Open Source. Open Code." as a two-beat reveal

narrativeRole: Turns the corner from pain to answer and plants the thesis.
keyMessage: There's a better model — components that are open all the way down.

## Frame 4 — One command

- scene: a zoomed terminal types `npx shadcn@latest add button`; the response shows the file landing at `components/ui/button.tsx`.
- voiceover: "Run one command — npx shadcn add button — and the code lands right in your project."
- duration: 5
- transition_in: crossfade
- status: outline
- src: compositions/frames/04-one-command.html
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: clarity
- blueprint: cursor-ui-demo — a surface introduced by one real action landing on a result
- asset_candidates: remocn/terminal-simulator (instant step-scroll); terminal-cursor-zoom on the install line; file-path chip components/ui/button.tsx

narrativeRole: The bridge — shows the single move that makes the new model real.
keyMessage: Adding a component is one command, and the code arrives in your repo.

## Frame 5 — It's yours now

- scene: the button file opens in a glass code block; a cursor edits a variant, a radius, a color — plain React + Tailwind.
- voiceover: "Open the file. Change a variant, a radius, a color — it's just React and Tailwind, and it's yours."
- duration: 5.5
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/05-its-yours-now.html
- type: feature_showcase
- persuasion: Ownership / control
- beat: control + ease
- blueprint: cursor-ui-demo — one specific multi-edit workflow shown end to end
- asset_candidates: remocn/glass-code-block (button.tsx) with marker highlights on the edited tokens; cursor over the variant/radius lines

narrativeRole: Pays off the promise — the code isn't a dependency, it's editable source you control.
keyMessage: Because the code is in your project, you change anything, with tools you already know.

## Frame 6 — Built right by default

- scene: four value tiles assemble — Accessible on Radix · Composable · Themeable (CSS variables) · AI-ready.
- voiceover: "Accessible on Radix. Composable. Themeable with CSS variables. Ready for your AI to read and extend."
- duration: 5
- transition_in: zoom-through
- status: outline
- src: compositions/frames/06-built-right-by-default.html
- type: benefit_highlight
- persuasion: Value stacking
- beat: confidence
- blueprint: grid-card-assemble — a tile grid self-assembles to show breadth at once
- asset_candidates: remocn/grid-card-assemble (4 pillar cards); optional dark/light swap to show CSS-variable theming on the "Themeable" tile

narrativeRole: Reassures that owning the code doesn't mean losing quality — the defaults are excellent.
keyMessage: You get accessibility, composition, theming, and AI-readiness for free.

## Frame 7 — Distribute your own

- scene: terminal runs `npx shadcn add @acme/card`; a custom component flows from a registry into the project — the same mechanism, now for your team.
- voiceover: "Then ship your own — npx shadcn add @acme/card — one registry for your whole team."
- duration: 5
- transition_in: crossfade
- status: outline
- src: compositions/frames/07-distribute-your-own.html
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: power
- blueprint: cursor-ui-demo — a real command lands a result, revealing the platform underneath
- asset_candidates: remocn/terminal-simulator with the @acme namespace; a registry → project flow motif (constellation-hub or directional flow)

narrativeRole: The wow — reframes shadcn/ui from a component set to a distribution platform you build on.
keyMessage: The same CLI distributes your own components — it's a platform, not just a catalog.

## Frame 8 — Everyone's building on it

- scene: a framework logo wall builds — Next.js, Vite, Remix, Astro, Laravel — then two proof numbers roll up: 100,000+ stars, 20,000+ projects.
- voiceover: "Next.js, Vite, Remix, Astro — over 100,000 stars, and 20,000 projects already build on it."
- duration: 4.5
- transition_in: zoom-through
- status: outline
- src: compositions/frames/08-everyones-building-on-it.html
- type: social_proof
- persuasion: Social proof + Authority by association
- beat: trust
- blueprint: grid-card-assemble — a logo wall builds, then pulls back to a vast ecosystem
- asset_candidates: remocn/grid-card-assemble (framework logos); remocn/rolling-number for 100,000+ and 20,000+; remocn/github-stars card

narrativeRole: De-risks the choice with scale and broad framework support.
keyMessage: It's proven — every framework, six figures of stars, tens of thousands of projects.

## Frame 9 — Make it your own

- scene: the shadcn/ui mark condenses straight into the one command you run; `npx shadcn@latest init` holds with ui.shadcn.com.
- voiceover: "Start here — then make it your own. npx shadcn init."
- duration: 4
- transition_in: zoom-through
- status: outline
- src: compositions/frames/09-make-it-your-own.html
- type: cta
- persuasion: Risk reversal + Future pacing
- beat: motivation + urgency-to-act
- blueprint: cta-morph-press — the brand mark condenses straight into the single thing you click/run
- asset_candidates: remocn/terminal-cursor-zoom on `npx shadcn@latest init`; wordmark lockup with ui.shadcn.com

narrativeRole: Converts intent into the exact next action.
keyMessage: One command starts it; from there the design system is yours.

---

## Checklist

- Arc named (BAB + feature→benefit); sequence is narrative-driven, not page-order.
- Opening hook is one clear strategy (category reframe via ticker-takeover) that creates curiosity.
- Each beat has one job; every beat carries `type`, `persuasion`, `beat`.
- Each VO is written in its candidate blueprint's shape and phrase-segmented into cues.
- Shapes vary: ticker-takeover, kinetic-type-beats, cursor-ui-demo, grid-card-assemble, cta-morph-press.
- Story truth never bent to fit a shape — no beat invented, dropped, or reordered for a blueprint.
- UI demo is a multi-beat workflow (F4 install → F5 own/edit → F7 distribute) on the same surface family.
- `transition_in` uses registry types — crossfade default, zoom-through at section boundaries.
- `asset_candidates` adapted to this remocn project (component suggestions; no invented filenames).
