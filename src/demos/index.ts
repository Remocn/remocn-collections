import type { Demo } from "./types";
import { getCatalogEntry } from "./catalog";
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
import {
  SponsorShieldcnDemo,
  SPONSOR_SHIELDCN_DURATION,
} from "./sponsor-shieldcn";
import {
  SponsorReactbitsDemo,
  SPONSOR_REACTBITS_DURATION,
} from "./sponsor-reactbits";
import { SponsorOrcdevDemo, SPONSOR_ORCDEV_DURATION } from "./sponsor-orcdev";
import {
  IntroducingRemocnDemo,
  INTRODUCING_REMOCN_DURATION,
} from "./introducing-remocn";
import {
  NewTransitionsDemo,
  NEW_TRANSITIONS_DURATION,
} from "./new-transitions";
import {
  IntroducingShadcnDemo,
  INTRODUCING_SHADCN_DURATION,
} from "./introducing-shadcn";
import { ShieldcnPlusDemo, SHIELDCN_PLUS_DURATION } from "./shieldcn-plus";

export * from "./types";

export const demos: Demo[] = [
  {
    ...getCatalogEntry("shieldcn-plus"),
    component: ShieldcnPlusDemo,
    durationInFrames: SHIELDCN_PLUS_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("introducing-shadcn"),
    component: IntroducingShadcnDemo,
    durationInFrames: INTRODUCING_SHADCN_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("sponsor-orcdev"),
    component: SponsorOrcdevDemo,
    durationInFrames: SPONSOR_ORCDEV_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("sponsor-reactbits"),
    component: SponsorReactbitsDemo,
    durationInFrames: SPONSOR_REACTBITS_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("new-transitions"),
    component: NewTransitionsDemo,
    durationInFrames: NEW_TRANSITIONS_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("introducing-remocn"),
    component: IntroducingRemocnDemo,
    durationInFrames: INTRODUCING_REMOCN_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("sponsor-shieldcn"),
    component: SponsorShieldcnDemo,
    durationInFrames: SPONSOR_SHIELDCN_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("paper-shaders"),
    component: PaperShadersDemo,
    durationInFrames: PAPER_SHADERS_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("shieldcn"),
    component: ShieldcnDemo,
    durationInFrames: SHIELDCN_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("sponsor-ln"),
    component: SponsorLnDemo,
    durationInFrames: SPONSOR_LN_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("shadcn-ui"),
    component: ShadcnDemo,
    durationInFrames: SHADCN_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("skill-changelog"),
    component: SkillChangelogDemo,
    durationInFrames: SKILL_CHANGELOG_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("tegami"),
    component: TegamiDemo,
    durationInFrames: TEGAMI_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("fonttrio"),
    component: FonttrioDemo,
    durationInFrames: FONTTRIO_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("render-sdk"),
    component: RenderSdkDemo,
    durationInFrames: RENDER_SDK_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("agent-skills"),
    component: AgentSkillsDemo,
    durationInFrames: AGENT_SKILLS_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("typography"),
    component: TypographyDemo,
    durationInFrames: TYPOGRAPHY_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("batchwork"),
    component: BatchworkDemo,
    durationInFrames: BATCHWORK_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("chat-changelog"),
    component: ChatChangelogDemo,
    durationInFrames: CHAT_CHANGELOG_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("changelog"),
    component: ChangelogDemo,
    durationInFrames: CHANGELOG_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("signup-flow"),
    component: SignupFlowDemo,
    durationInFrames: 230,
    defaultProps: {},
  },
];

export const getDemo = (id: string): Demo | undefined =>
  demos.find((demo) => demo.id === id);
