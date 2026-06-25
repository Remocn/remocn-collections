import type { Demo } from "./types";
import { SignupFlowDemo } from "./signup-flow";
import { ChangelogDemo, CHANGELOG_DURATION } from "./changelog";
import { BatchworkDemo, BATCHWORK_DURATION } from "./batchwork";
import { TypographyDemo, TYPOGRAPHY_DURATION } from "./typography";
import { AgentSkillsDemo, AGENT_SKILLS_DURATION } from "./agent-skills";

export * from "./types";

export const demos: Demo[] = [
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
