import type { Demo } from "./types";
import { SignupFlowDemo } from "./signup-flow";
import { ChangelogDemo, CHANGELOG_DURATION } from "./changelog";
import { ChatChangelogDemo, CHAT_CHANGELOG_DURATION } from "./chat-changelog";
import { BatchworkDemo, BATCHWORK_DURATION } from "./batchwork";
import { TypographyDemo, TYPOGRAPHY_DURATION } from "./typography";
import { AgentSkillsDemo, AGENT_SKILLS_DURATION } from "./agent-skills";
import { RenderSdkDemo, RENDER_SDK_DURATION } from "./render-sdk";
import { FonttrioDemo, FONTTRIO_DURATION } from "./fonttrio";
import { TegamiDemo, TEGAMI_DURATION } from "./tegami";
import { SkillChangelogDemo, SKILL_CHANGELOG_DURATION } from "./skill-changelog";
import { ShadcnDemo, SHADCN_DURATION } from "./shadcn-ui";
import { SponsorLnDemo, SPONSOR_LN_DURATION } from "./sponsor-ln";
import { ShieldcnDemo, SHIELDCN_DURATION } from "./shieldcn";
import { PaperShadersDemo, PAPER_SHADERS_DURATION } from "./paper-shaders";

export * from "./types";

export const demos: Demo[] = [
  {
    id: "paper-shaders",
    title: "remocn ✕ Paper — Introducing shaders",
    description:
      "A launch spot for remocn's new shader components, built on Paper's freshly open-sourced WebGL shaders. Manrope over a shader-grain-gradient backdrop: a blur-out-up hook (Paper just open-sourced their shaders), the Remocn + Paper lockup assembling around the Paper mark, a short-slide-right 'Introducing remocn shaders', then twelve shaders rendered fullscreen and hard-cut one into the next — mesh gradient, warp, liquid metal, god rays, neuro noise, voronoi, dot orbit, metaballs, water, spiral, dithering, pulsing border — pure and unlabeled. Line-by-line feature claims (18 shaders on the GPU, frozen to the current frame, deterministic on every render), a kinetic 'Any shader, one command' with the shadcn install line, and an outro where shader-swirl's twist animates 0 → 1 to wind the scene open before the Remocn wordmark resolves, crediting Paper.",
    component: PaperShadersDemo,
    durationInFrames: PAPER_SHADERS_DURATION,
    defaultProps: {},
  },
  {
    id: "shieldcn",
    title: "shieldcn — Everything for your README",
    description:
      "A product demo for shieldcn, the shields.io alternative that renders README badges, charts, and headers as real shadcn/ui components. BAB arc in the shadcn zinc register plus the badge-value green: a short-slide-right hook (someone just opened your repo), the dated pixel-badge wall as the pain, a three-beat shared-axis-z intro (Meet → the lockup with a self-drawing shield mark → the creed), section titles as their own interstitial beats, the five variants / sizes / icons grid, a live star-history chart with headers & sponsor walls, the `npx skills add jal-co/shieldcn` agent skill in a terminal, proof pills (MIT, Vercel OSS Program) with a rolling 500+ star count, and a drawn shield-mark lockup CTA at shieldcn.dev.",
    component: ShieldcnDemo,
    durationInFrames: SHIELDCN_DURATION,
    defaultProps: {},
  },
  {
    id: "sponsor-ln",
    title: "remocn ✕ LN — New sponsor",
    description:
      "A three-scene sponsor announcement over the bg.png backdrop. Intro: an animated emoji springs in, centered, with a gentle float. Hook: 'Say hello my new sponsor' resolves via remocn's soft-blur-in typography. Main: the Remocn ✕ LN collab lockup assembles — the Remocn wordmark slides in, a cross fades between, the LN avatar springs into a ringed circle with a soft accent halo, and the LN name settles beneath.",
    component: SponsorLnDemo,
    durationInFrames: SPONSOR_LN_DURATION,
    defaultProps: {},
  },
  {
    id: "shadcn-ui",
    title: "shadcn/ui — Not a library. Your code.",
    description:
      "A product demo for shadcn/ui in its own monochrome zinc register — Geist Sans + Geist Mono, hairline grid on a zinc-950 canvas, white marker highlights. BAB arc: a ticker hook reframes 'a component library? a package?' into 'No — it's your code', the pain of fighting an installed black box, then Introducing shadcn/ui (Open Source. Open Code.), a terminal `npx shadcn@latest add button` landing the file in your project, the button.tsx cva variants in a glass code block ('change anything, it's yours'), four pillar cards (Open Code, Composable, Themeable, AI-Ready), shipping your own via `npx shadcn add @acme/card`, rolling-number proof (100,000+ stars, 20,000+ projects across Next.js/Vite/Remix/Astro/Laravel), and a wordmark CTA with `npx shadcn@latest init` → ui.shadcn.com.",
    component: ShadcnDemo,
    durationInFrames: SHADCN_DURATION,
    defaultProps: {},
  },
  {
    id: "skill-changelog",
    title: "Changelog — The remocn agent skill, rebuilt",
    description:
      "A meta changelog about the remocn agent skill itself. The skill went from one monolithic SKILL.md to a structured reference: the hero beat builds the skill's file tree (SKILL.md + references/ → anatomy, design, motion-principles, anti-patterns, archetypes/, components/), then a changelog-style list lands what was added (anatomy with a good-vs-slop quality bar, 9 archetype recipes, one-file-per-component docs), rolling-number proof (124 components, 9 archetypes, 5 guides), and a calm 'remocn' wordmark outro. A fresh warm-accent doc/IDE aesthetic on a flat near-black grid — distinct from the other demos.",
    component: SkillChangelogDemo,
    durationInFrames: SKILL_CHANGELOG_DURATION,
    defaultProps: {},
  },
  {
    id: "tegami",
    title: "Tegami — Releasing, as simple as writing a note",
    description:
      "An introducing demo for Tegami (手紙), a tool to manage changelogs, versioning, and publishing in monorepos. Rendered in the brand's monochrome ink-on-paper, hand-drawn world — black ink on white paper, sketch doodles, the てがみ mascot, handwritten Caveat annotations. BAB arc: release-day chores pile up, the old fixes (a brittle script, Changesets' walls) break, then Meet Tegami — a script you own (scripts/tegami.mts), write a change like a note in .tegami/, tegami version computes bumps and writes the publish lock, merge the Version Packages PR and it ships with GitHub releases, one pipeline across npm/Cargo/PyPI, retry-safe + pluggable + programmable, your AI agent writes the changelog, migrate from Changesets, and a 'record your changes!' CTA at tegami.fuma-nama.dev.",
    component: TegamiDemo,
    durationInFrames: TEGAMI_DURATION,
    defaultProps: {},
  },
  {
    id: "fonttrio",
    title: "Fonttrio — Three fonts. One command.",
    description:
      "A type-forward spot for Fonttrio, the curated font-pairing registry for shadcn/ui. Three pain questions enter via shared-axis-z, a 'Three fonts.' hook lands, then the editorial pairing reveals its three roles — Playfair Display, Source Serif 4, and JetBrains Mono — each rendered in its real typeface. A terminal-cursor-zoom install (npx shadcn add @fonttrio/editorial), a GlassCodeBlock of the generated CSS variables, a rolling-number count of 78 curated pairings, a specimen wall of 'Ag' across moods (editorial, bold, impact, clean), and an outro with the trio mark, the Fonttrio wordmark set in Playfair Display, the tagline, and a copy-ready install pill.",
    component: FonttrioDemo,
    durationInFrames: FONTTRIO_DURATION,
    defaultProps: {},
  },
  {
    id: "render-sdk",
    title: "render-sdk — One render API",
    description:
      "A launch spot for @remocn/render-sdk: three pain questions enter via shared-axis-z, a scale-down-fade 'Stop.' interrupts, then 'One API, different providers' leads into render + lambda adapter cards, a terminal-cursor-zoom install (bun install @remocn/render-sdk), a GlassCodeBlock code example, a logo-enter framework wall (Next.js, React, Remix, React Router), and an outro with a drawn-on box mark, the render-sdk wordmark, v1.0.0, and tagline.",
    component: RenderSdkDemo,
    durationInFrames: RENDER_SDK_DURATION,
    defaultProps: {},
  },
  {
    id: "agent-skills",
    title: "Agent Skills — Claude Code makes the video",
    description:
      "A meta product spot: Claude Code receives /remocn make a great demo video, thinks through the remocn skill, and 'produces' a polished remocn showcase — a zoomed terminal typing the install command, the component's code scanned top-to-bottom in a glass block, six component examples blurring in (checkbox, input, drawer, alert-dialog, select, sheet), GitHub stars, an X followers overview, white text dividers, and a closing wordmark.",
    component: AgentSkillsDemo,
    durationInFrames: AGENT_SKILLS_DURATION,
    defaultProps: {},
  },
  {
    id: "typography",
    title: "Typography — New Text Animations",
    description:
      "A showcase of remocn's new typography animations — each effect introduced by animating its own name, over an image backdrop with dynamic kinetic transitions.",
    component: TypographyDemo,
    durationInFrames: TYPOGRAPHY_DURATION,
    defaultProps: {},
  },
  {
    id: "batchwork",
    title: "Batchwork — Unified Batch API",
    description:
      "A product spot for batchwork: one batch API for every AI provider, with glass code windows and marker highlights.",
    component: BatchworkDemo,
    durationInFrames: BATCHWORK_DURATION,
    defaultProps: {},
  },
  {
    id: "chat-changelog",
    title: "Changelog — New Chat Components",
    description:
      "A changelog spot for remocn's new chat primitives — chat-flow, iMessage and Telegram flows, each playing live in a phone frame over an image backdrop. Built from message-bubble + typing-indicator, one message API across all three skins.",
    component: ChatChangelogDemo,
    durationInFrames: CHAT_CHANGELOG_DURATION,
    defaultProps: {},
  },
  {
    id: "changelog",
    title: "Changelog — Rolling Numbers",
    description:
      "A remocn v2.0.6 changelog spot showcasing the rolling-number animation.",
    component: ChangelogDemo,
    durationInFrames: CHANGELOG_DURATION,
    defaultProps: {},
  },
  {
    id: "signup-flow",
    title: "Signup Flow",
    description: "An animated signup form flow built from remocn primitives.",
    component: SignupFlowDemo,
    durationInFrames: 230,
    defaultProps: {},
  },
];

export const getDemo = (id: string): Demo | undefined =>
  demos.find((demo) => demo.id === id);
