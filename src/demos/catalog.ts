// Component-free demo metadata. The home page (and anything that only needs
// titles) imports this instead of ./index to keep compositions out of its
// bundle. ./index re-attaches the composition components.
export type DemoCatalogEntry = {
  id: string;
  title: string;
  description: string;
};

export const demoCatalog: DemoCatalogEntry[] = [
  {
    id: "introducing-tenkit",
    title: "tenkit — Introducing tenkit",
    description:
      "An introducing spot for tenkit, the generator for Expo projects that ship as multiple branded native apps from a single shared codebase, in the product's own register lifted from tenkit.dev: #09090b canvas, #fafafa ink, Space Grotesk (the site's font-heading) for everything spoken, Inter small print, Geist Mono for config and CLI — plus the site's own THREE tenant accents (blue #208AEF, orange #EF8520, teal #2DD4A8), used only as tenant identity, never as decoration. One quiet paper.design voronoi field carries the whole video — one continuous surface partitioned into many cells IS the product — and the statement transition is the SAME shader re-lit in the tenant tints, its cells growing over the cut (apps multiplying). No swirl anywhere. The motion score is one → many: division moves outward from center, narrative progress dives into the frame (push-through), enumeration travels left (whip-pans), and the outro reverses the split. Statement-first rhythm throughout — wherever a label would sit under a visual, the words land FIRST, alone and readable, and the visual acts them out afterwards. Hook: 'One codebase' lands word by word, holds a full breath, then the line itself fans into three copies — blue rises, orange holds center, teal descends. Reveal: the real logo's two folded faces glide together out of blur, one crisp grandeur beat, then a single descent walks the mark into a BOXED lockup — the wordmark letters stand exactly as tall as the mark and 'Ship one Expo app as many branded apps' spans exactly the lockup width beneath. Kinetic 'The setup you actually ship', then the three real Setup Types hard-cut on a beat — White label apps / Runtime tenant app / Generic + standalone. Money shot in two beats: the bloom lands on 'Same code, different identity' alone; the words lift away and the screens act it out — one neutral code-drawn phone rises, two clones slide out from behind it, then identity floods left to right: icon chip, app name (Atlas / Ember / Mint), primary button re-tint per tenant. Features: three whip-pan stations, each label first at center then gliding down to its seat as the fragment arrives — a variants.config.ts with each tenant hex wearing its own color, the repo's real local CLI (pnpm tenkit build / doctor / reset), and EAS build rows filling to quiet checks. A typed pnpm create tenkit@latest alone on screen, and the outro: three tenant dots converge back into the mark slot — many apps, one codebase again — with tenkit.dev faint at the bottom. No letter-spacing, no uppercase, no pills, no badges, no highlight markers, no trailing periods.",
  },
  {
    id: "introducing-videorc",
    title: "Videorc — Introducing Videorc",
    description:
      "An introducing spot for Videorc, OrcDev's open-source Mac studio for recording, multistreaming and AI publishing, in the product's own dark zinc register lifted from videorc.com's .dark tokens: #18181b canvas, #f5f5f6 ink, #a1a1a8 muted, and ONE accent — record-red #ff3b30, the color of the logo's eyes and the record dot. Manrope 400 throughout, Geist Mono only for the timecode chrome. One quiet paper.design grain-gradient (corners shape — film grain lives at the frame edges, the center stays clear for type, zinc family with a faint warm-red undertone) carries the whole video behind a vignette; the statement transitions are the SAME shader in its other shapes — a brand-red ripple-zoom dive and a zinc wave-wipe swell — so backdrop and cuts speak one language. No swirl anywhere. From the reveal onward the spot wears the product's own chrome: a mono timecode with a blinking red dot ticks along the bottom-left, freezes solid at the outro lockup, and lifts away — the video was one recording session. Hook: the ● REC lockup lands dead-center — the dot blinking on the camcorder cycle, REC in heavy red beside it — then the camera dives INTO the dot (an accelerating zoom pinned to the dot's center, letters flying past) until the flat red swallows the frame and dissolves into the grain-ripple tunnel already open beneath it, holding readable while it keeps zooming — the record dot IS the transition. Reveal: the tunnel reveals only the cyber-orc mark, enlarged and alone; it shrinks to lockup size and 'Videorc' drives in from the right, physically pushing the mark left into the lockup (rigid-body push, impact pop), 'The future of video starts here' rising word by word beneath. Then the three jobs hard-cut on a beat — Record / Stream / Publish. Positioning: kinetic 'Everything you need in one window'. Features: three whip-pan stations arriving from the right and decelerating — a code-drawn capture surface (red dot + running mini-timecode, camera bubble, breathing mic waveform, 3840×2160 · 60 fps), a multistream fan (the red source dot emitting five rays to YouTube / Twitch / X / RTMP / one more), and the AI publish checklist (Transcript, Title & description, Chapters, Highlights settling with quiet checks). Values: three lines via line-by-line-slide. Lockup: the site's own app icon (the orc on its black plate) + Videorc, centered alone, 'Open source, built by OrcDev' faint at the bottom. No letter-spacing, no uppercase, no pills, no badges, no highlight markers, no trailing periods.",
  },
  {
    id: "sponsor-shadcn-ui-kit",
    title: "remocn ✕ Shadcn UI Kit — New sponsor",
    description:
      "A partner-level sponsor announcement for Shadcn UI Kit, the dashboards-templates-components kit for shadcn/ui, in its own register lifted from shadcnuikit.com: dark #0a0a0a canvas, #fafafa ink, the indigo #6366f1 hero accent, Cal Sans headings over Inter body — the site's own font faces. One persistent paper.design warp shader (edge shape, swirl 0.86 with 7 iterations, recolored into the kit's indigo family #a5b4fc / #312e81 / #0a0a0a) carries the whole video behind a vignette, every scene riding a slow camera drift. Hook: 'Say hello to my new sponsor' via soft-blur-in. Reveal: the rounded-square mark redrawn in code (five diagonal round-cap strokes measured off the shipped logo) draws itself on while the ink Shadcn UI Kit wordmark resolves out of depth, 'Launch your projects faster' settling beneath. What's inside: three hard-cut stations, each acted out inside a tiny code-drawn fragment of the kit — a mini admin dashboard assembling (sidebar rows, counting stat cards, growing chart bars, a self-drawing indigo donut), a bento of blocks snapping in tile by tile, and the theme generator re-tinting the same surface live as the accent flips indigo to emerald to amber with a hopping swatch ring. Kinetic bridge: 'Copy, paste, ship' via kinetic-center-build. Value stack: four lines via line-by-line-slide. Proof: a plain 780 components count-up (no plus-suffix). CTA: 'Your next dashboard is already built'. Lockup: Remocn ✕ the mark + Shadcn UI Kit glide together from both sides, centered, nothing else on screen. No letter-spacing, no uppercase, no pills, no badges, no pulsing, no trailing periods, compact spacing. Scene changes are push-through, focus-pull, and crossfade.",
  },
  {
    id: "sponsor-gramotion",
    title: "remocn ✕ Gramotion — New sponsor",
    description:
      "A partner-level sponsor announcement for Gramotion, the browser-based motion graphics tool, in its own dark register: #0a0a0a canvas, #fafafa ink, the single orange accent #ff6825, Cal Sans headings over Plus Jakarta Sans body with JetBrains Mono for the timeline register. One persistent paper.design warp shader (checks shape, the warm #3c1515 / #944752 / #ffc085 family) carries the whole video behind a vignette, every scene riding a slow camera drift, and a quiet mono timecode ticks along the bottom edge — the spot wears the product's own editor chrome. Hook: 'Say hello to my new sponsor' via soft-blur-in. Reveal: the lowercase gramotion wordmark resolves out of depth, its orange dot springs in last, 'Create stunning motion graphics' settles beneath. How it works: the site's three-step flow hard-cut into three beats — Design / Animate / Export — each acted out inside a tiny code-drawn fragment of the Gramotion editor (shapes dropping onto a canvas with a cursor landing a handled selection frame, a timeline where the cursor drags the orange animation bar under a sweeping playhead, an export progress bar resolving into shipped mp4/gif files). Value stack: four feature lines via line-by-line-slide. Proof: a plain 1,200 waitlist count-up (no plus-suffix). CTA: 'Be there at the first frame'. Lockup: Remocn ✕ gramotion glides together from both sides, centered, nothing else on screen. No letter-spacing, no uppercase, no pills, no badges, no pulsing, no trailing periods, compact spacing. Scene changes are push-through, focus-pull, and crossfade.",
  },
  {
    id: "sponsor-canadian-ai",
    title: "remocn ✕ Canadian AI — New sponsor",
    description:
      "A sponsor announcement for Canadian AI in their light editorial register — the only light sponsor spot in the collection: paper-white #FCFBF9 canvas, black ink, one amber accent #F59E0B (the site's Start-button color), Inter paired with Playfair Display serif italics, over a warm paper-grain gradient washed back toward the center. Every scene rides a slow camera drift. Intro: the real canadian-ai.ca swirl mark stroke-draws itself on in ink and the fill resolves. Hook: 'Say hello to my new sponsor' via soft-blur-in. Reveal: the Canadian AI wordmark resolves out of depth with the 'Operating System for Organizations' tagline settling tight beneath in serif italic. Beats: the site's own 'What we build' list hard-cut into three numbered slots — 01 Core / 02 Sales Agent / 03 Dev Agent — amber serif numerals over ink product names. Philosophy: 'Better tools create more value.' as a Playfair italic statement. Lockup: Remocn ✕ Canadian AI glides together from both sides, centered, nothing else on screen. Scene changes are push-through, crossfade, and focus-pull.",
  },
  {
    id: "shieldcn-plus",
    title: "shieldcn — Introducing shieldcn Plus",
    description:
      "The launch video for shieldcn's accounts-with-sync release: Pro collapsed into a single Plus tier ($10/mo) for maintainers who live in their READMEs. Announcement-cascade arc mirroring the author's launch tweet, in the shieldcn register (zinc-950, ink, Geist, badge-value green #22c55e) over a monochrome paper.design warp backdrop (checks shape, quiet zinc grays). Opens on a camera-glide hook where a README assembles itself from REAL shieldcn.dev renders (graph header, xs badges, star chart, sponsor wall), then a shared-axis 'This is shieldcn' education beat, the news (accounts — with sync, a self-drawing green sync arc), the free-forever reassurance with a green marker sweep, and the Plus lockup with the repo's real shield icon stroke-drawing itself on. Four feature beats — a rolling 75 saved READMEs over a mini-README dashboard grid, a saved badges library shelf dropping the same real badge into three README rows, a mass-migration PR cascade over six mono repo rows, an AI prompt typing itself into a real acme header + branded badges — then the crown: one managed brand, where the accent hex flips in place (#22c55e → #8b5cf6 → #f59e0b) and every real artifact (header, badges, chart — all fetched from shieldcn.dev with color= params) re-renders simultaneously. A quiet 'Plus keeps the lights on' beat, and a CTA with price, shieldcn.dev/pricing, and the launch20 code. Transitions are the shieldcn family grammar only — squeeze, pill-iris, zoom-blur, crossfade; no swirl, no dither covers.",
  },
  {
    id: "introducing-shadcn",
    title: "shadcn/ui — Introducing shadcn/ui (gift cut)",
    description:
      "A gift video for shadcn — an introducing spot for shadcn/ui in shadcn's own monochrome: zinc-950 canvas, ink #fafafa, Geist 400 only (font-normal forced on every embedded component), no letter-spacing, no links on screen. Color lives only inside shader covers, sampled from shadcn's X avatar and heavily muted (deep plum, dusty rose), plus one deliberate burst: the Colors beat's full Tailwind palette. Opens on a camera glide — no pull-back — across a dense 4-column masonry wall of REAL shadcn/ui components rendered live via Tailwind in the Remotion pipeline (the ui.shadcn.com homepage cards: create account, move goal with mini bars, chat, calendar with a fixed deterministic today, command menu, payment, cookie settings, team, report an issue, share, upgrade plan). A muted-plum shader-swirl cover lands 'This is shadcn/ui', a short-slide-right tagline, the creed in two beats (Not a component library → kinetic 'How you build your own'), then a real-UI category montage (Blocks dashboard cards / a live monochrome bar chart / a dark→light→dark theme flip / the full Tailwind palette grid, 22 ramps × 11 shades waving in), a line-by-line pillars block, a typed npx shadcn add with a 3D component-name rolodex, a presets suite ('Your whole design system, one preset' → the ui.shadcn.com/create builder as a settings tile stack whose Style/Base Color/Theme/Font values flip one by one while a live sign-in card reshapes — Lyra sharpens corners, Stone warms grays, Dark inverts, Geist Mono swaps type — condensing into --preset a1Dg5eFl → the same card re-theming live as the preset code rolodexes through npx shadcn init --preset → 'Switch it any time'), 'And the code is yours', a 1,000,000-apps-every-month count-up in Geist tabular figures, a Startups/YC/Fortune 500s hard-cut montage resolving on 'Everyone is building with it', the opportunity line, the 'The best part? Everyone needs UI' kicker, and a smoke-ring outro with the wordmark over 'Open Source. Open Code.' (no URL).",
  },
  {
    id: "sponsor-orcdev",
    title: "remocn ✕ OrcDev — New sponsor",
    description:
      "A sponsor announcement for OrcDev in the 8bitcn register: black canvas, the paper.design dithering shader exactly as its dots/random preset (#000000 back, #008000 dots, size 5.2) pushed back by a vignette, Geist Pixel Square headlines over Geist Sans small print, and the orc-skin green #8ec71e sampled from the avatar as the only accent. Every move is quantized into sprite poses — stepped snaps, hard cuts, and green dither-dissolve covers, no blur glides. Intro: the orc nod gif crunched into chunky pixels inside an 8bitcn corner-notched frame. Hook: 'Say hello to my new sponsor' snapping word by word. Reveal: the avatar in a pixel frame, 'OrcDev' typed on with a solid green block caret, 'Web dev warrior' beneath. Beats: Build / Break / Conquer hard cuts, the last in green. Flagship: 8bitcn/ui with its real tagline and an HP bar that takes three chunky hits — Critical hit. Lockup: Remocn ✕ OrcDev with orcdev.com.",
  },
  {
    id: "sponsor-reactbits",
    title: "remocn ✕ react-bits — New sponsor",
    description:
      "A cinematic sponsor announcement for react-bits over a persistent paper.design dithering shader (warp shape, 4x4 Bayer) recolored into the react-bits brand palette — #060010 landing background, #5227FF signature violet — pushed back by a vignette. Manrope 400 throughout, every scene riding a slow camera drift. Hook: 'Say hello to my new sponsor' lands word by word in the react-bits split-text register. Reveal: the white react-bits wordmark resolves out of depth with the tagline settling beneath. Proof: a plain 130 count-up (their own signature animation, no plus suffix), then the tagline cut into rhythmic hard-cut word beats — Free / Customizable / Animations for / Text / Backgrounds / UI, all in ink. Lockup: Remocn ✕ react bits glides together from opposite sides. Scene changes are push-through and focus-pull.",
  },
  {
    id: "new-transitions",
    title: "Changelog — Eleven New Transitions",
    description:
      "An update announcement for remocn's eleven new transition presentations, told through self-demonstration: after the announcement beat, every scene change in the video IS one of the new components. Remocn brand register (Manrope 400, warm obsidian #141318, ink, one lime accent): two scale-down-fade pain lines (everyone animates their scenes / nobody animates the cut), a short-slide-right 'Introducing Remocn transitions' with the meta promise beneath, then the labeled cascade — whip-pan, push-through, focus-pull, a lime dither-dissolve, wave-wipe, grain-dissolve, ripple-zoom (transparent frame landing on the ripple field), warp-dissolve, perlin-dissolve, smoke-dissolve, and a lime-banded swirl-dissolve as the statement finale. A reused focus-pull enters the line-by-line value block (frame-driven, deterministic, lands in your repo), a whip-pan up enters the kinetic 'Any cut, one command' with npx shadcn add @remocn/whip-pan, and a push-through lands the camera on the Remocn lockup at remocn.dev, crediting Paper's shaders.",
  },
  {
    id: "introducing-remocn",
    title: "remocn — Introducing remocn (shaders cut)",
    description:
      "The first-post introduction video for the remocn X account, told entirely in the library's own shaders and typography. BAB arc in the shipped remocn.dev brand (Manrope, warm obsidian #141318, one lime accent) over one quiet simplex-noise field that carries the whole video: two scale-down-fade pain lines, a shader-swirl cover (fade in → 500ms opaque hold with a slow twist unwind → fade out) into a short-slide-right 'Meet remocn', a scale-down-fade tagline beat (Cinematic video components for React), a kinetic-center-build 'Like shadcn/ui, for video', six registry categories hard-cut across fullscreen shaders (color-panels, warp, mesh-gradient, voronoi, metaballs, god-rays), a line-by-line value block (110+ components / one command / the code is yours), a typed npx shadcn add, and a smoke-ring outro where the inverted play-bars mark and lowercase wordmark assemble over remocn.dev. Scene changes are held shader covers — swirl and lime simplex dither.",
  },
  {
    id: "sponsor-shieldcn",
    title: "remocn ✕ shieldcn — New sponsor",
    description:
      "A sponsor announcement for shieldcn in its zinc + badge-green register, over a slow god-rays shader spotlight. Intro: a real stars-shieldcn badge springs in, centered, with a gentle float. Hook: 'Say hello to my new sponsor' resolves via soft-blur-in. Main: the Remocn ✕ shieldcn lockup assembles — the wordmark slides in, a cross fades between, the green shield-check chip springs into a ringed circle with the shieldcn name settling beside it. Finale: the badge ballet — ten real badges resolve out of blur + opacity onto a slowly winding circle, take one full turn, fall into a row, and ride off-screen, closed by the shieldcn.dev tag.",
  },
  {
    id: "paper-shaders",
    title: "remocn ✕ Paper — Introducing shaders",
    description:
      "A launch spot for remocn's new shader components, built on Paper's freshly open-sourced WebGL shaders. Manrope over a shader-grain-gradient backdrop: a blur-out-up hook (Paper just open-sourced their shaders), the Remocn + Paper lockup assembling around the Paper mark, a short-slide-right 'Introducing remocn shaders', then twelve shaders rendered fullscreen and hard-cut one into the next — mesh gradient, warp, liquid metal, god rays, neuro noise, voronoi, dot orbit, metaballs, water, spiral, dithering, pulsing border — pure and unlabeled. Line-by-line feature claims (18 shaders on the GPU, frozen to the current frame, deterministic on every render), a kinetic 'Any shader, one command' with the shadcn install line, and an outro where shader-swirl's twist animates 0 → 1 to wind the scene open before the Remocn wordmark resolves, crediting Paper.",
  },
  {
    id: "shieldcn",
    title: "shieldcn — Everything for your README",
    description:
      "A product demo for shieldcn, the shields.io alternative that renders README badges, charts, and headers as real shadcn/ui components. BAB arc in the shadcn zinc register plus the badge-value green: a short-slide-right hook (someone just opened your repo), the dated pixel-badge wall as the pain, a three-beat shared-axis-z intro (Meet → the lockup with a self-drawing shield mark → the creed), section titles as their own interstitial beats, the five variants / sizes / icons grid, a live star-history chart with headers & sponsor walls, the `npx skills add jal-co/shieldcn` agent skill in a terminal, proof pills (MIT, Vercel OSS Program) with a rolling 500+ star count, and a drawn shield-mark lockup CTA at shieldcn.dev.",
  },
  {
    id: "sponsor-ln",
    title: "remocn ✕ LN — New sponsor",
    description:
      "A three-scene sponsor announcement over the bg.png backdrop. Intro: an animated emoji springs in, centered, with a gentle float. Hook: 'Say hello my new sponsor' resolves via remocn's soft-blur-in typography. Main: the Remocn ✕ LN collab lockup assembles — the Remocn wordmark slides in, a cross fades between, the LN avatar springs into a ringed circle with a soft accent halo, and the LN name settles beneath.",
  },
  {
    id: "shadcn-ui",
    title: "shadcn/ui — Not a library. Your code.",
    description:
      "A product demo for shadcn/ui in its own monochrome zinc register — Geist Sans + Geist Mono, hairline grid on a zinc-950 canvas, white marker highlights. BAB arc: a ticker hook reframes 'a component library? a package?' into 'No — it's your code', the pain of fighting an installed black box, then Introducing shadcn/ui (Open Source. Open Code.), a terminal `npx shadcn@latest add button` landing the file in your project, the button.tsx cva variants in a glass code block ('change anything, it's yours'), four pillar cards (Open Code, Composable, Themeable, AI-Ready), shipping your own via `npx shadcn add @acme/card`, rolling-number proof (100,000+ stars, 20,000+ projects across Next.js/Vite/Remix/Astro/Laravel), and a wordmark CTA with `npx shadcn@latest init` → ui.shadcn.com.",
  },
  {
    id: "skill-changelog",
    title: "Changelog — The remocn agent skill, rebuilt",
    description:
      "A meta changelog about the remocn agent skill itself. The skill went from one monolithic SKILL.md to a structured reference: the hero beat builds the skill's file tree (SKILL.md + references/ → anatomy, design, motion-principles, anti-patterns, archetypes/, components/), then a changelog-style list lands what was added (anatomy with a good-vs-slop quality bar, 9 archetype recipes, one-file-per-component docs), rolling-number proof (124 components, 9 archetypes, 5 guides), and a calm 'remocn' wordmark outro. A fresh warm-accent doc/IDE aesthetic on a flat near-black grid — distinct from the other demos.",
  },
  {
    id: "tegami",
    title: "Tegami — Releasing, as simple as writing a note",
    description:
      "An introducing demo for Tegami (手紙), a tool to manage changelogs, versioning, and publishing in monorepos. Rendered in the brand's monochrome ink-on-paper, hand-drawn world — black ink on white paper, sketch doodles, the てがみ mascot, handwritten Caveat annotations. BAB arc: release-day chores pile up, the old fixes (a brittle script, Changesets' walls) break, then Meet Tegami — a script you own (scripts/tegami.mts), write a change like a note in .tegami/, tegami version computes bumps and writes the publish lock, merge the Version Packages PR and it ships with GitHub releases, one pipeline across npm/Cargo/PyPI, retry-safe + pluggable + programmable, your AI agent writes the changelog, migrate from Changesets, and a 'record your changes!' CTA at tegami.fuma-nama.dev.",
  },
  {
    id: "fonttrio",
    title: "Fonttrio — Three fonts. One command.",
    description:
      "A type-forward spot for Fonttrio, the curated font-pairing registry for shadcn/ui. Three pain questions enter via shared-axis-z, a 'Three fonts.' hook lands, then the editorial pairing reveals its three roles — Playfair Display, Source Serif 4, and JetBrains Mono — each rendered in its real typeface. A terminal-cursor-zoom install (npx shadcn add @fonttrio/editorial), a GlassCodeBlock of the generated CSS variables, a rolling-number count of 78 curated pairings, a specimen wall of 'Ag' across moods (editorial, bold, impact, clean), and an outro with the trio mark, the Fonttrio wordmark set in Playfair Display, the tagline, and a copy-ready install pill.",
  },
  {
    id: "render-sdk",
    title: "render-sdk — One render API",
    description:
      "A launch spot for @remocn/render-sdk: three pain questions enter via shared-axis-z, a scale-down-fade 'Stop.' interrupts, then 'One API, different providers' leads into render + lambda adapter cards, a terminal-cursor-zoom install (bun install @remocn/render-sdk), a GlassCodeBlock code example, a logo-enter framework wall (Next.js, React, Remix, React Router), and an outro with a drawn-on box mark, the render-sdk wordmark, v1.0.0, and tagline.",
  },
  {
    id: "agent-skills",
    title: "Agent Skills — Claude Code makes the video",
    description:
      "A meta product spot: Claude Code receives /remocn make a great demo video, thinks through the remocn skill, and 'produces' a polished remocn showcase — a zoomed terminal typing the install command, the component's code scanned top-to-bottom in a glass block, six component examples blurring in (checkbox, input, drawer, alert-dialog, select, sheet), GitHub stars, an X followers overview, white text dividers, and a closing wordmark.",
  },
  {
    id: "typography",
    title: "Typography — New Text Animations",
    description:
      "A showcase of remocn's new typography animations — each effect introduced by animating its own name, over an image backdrop with dynamic kinetic transitions.",
  },
  {
    id: "batchwork",
    title: "Batchwork — Unified Batch API",
    description:
      "A product spot for batchwork: one batch API for every AI provider, with glass code windows and marker highlights.",
  },
  {
    id: "chat-changelog",
    title: "Changelog — New Chat Components",
    description:
      "A changelog spot for remocn's new chat primitives — chat-flow, iMessage and Telegram flows, each playing live in a phone frame over an image backdrop. Built from message-bubble + typing-indicator, one message API across all three skins.",
  },
  {
    id: "changelog",
    title: "Changelog — Rolling Numbers",
    description:
      "A remocn v2.0.6 changelog spot showcasing the rolling-number animation.",
  },
  {
    id: "signup-flow",
    title: "Signup Flow",
    description:
      "An animated signup form flow built from remocn primitives.",
  },
];

export const getCatalogEntry = (id: string): DemoCatalogEntry => {
  const entry = demoCatalog.find((d) => d.id === id);
  if (!entry) throw new Error(`unknown demo id: ${id}`);
  return entry;
};
