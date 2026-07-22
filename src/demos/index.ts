import type { Demo } from "./types";
import { JitterCheckDemo, JITTER_CHECK_DURATION } from "./jitter-check";
import { JitterCheckBgDemo, JITTER_CHECK_BG_DURATION } from "./jitter-check-bg";
import { getCatalogEntry } from "./catalog";
import { AiAndSocialDemo, AI_AND_SOCIAL_DURATION } from "./ai-and-social";
import { SignupFlowDemo } from "./signup-flow";
import { ChangelogDemo, CHANGELOG_DURATION } from "./changelog";
import { ChatChangelogDemo, CHAT_CHANGELOG_DURATION } from "./chat-changelog";
import { BatchworkDemo, BATCHWORK_DURATION } from "./batchwork";
import { TypographyDemo, TYPOGRAPHY_DURATION } from "./typography";
import { PerfGuardsDemo, PERF_GUARDS_DURATION } from "./perf-guards";
import { AgentSkillsDemo, AGENT_SKILLS_DURATION } from "./agent-skills";
import { RenderSdkDemo, RENDER_SDK_DURATION } from "./render-sdk";
import { FonttrioDemo, FONTTRIO_DURATION } from "./fonttrio";
import { TegamiDemo, TEGAMI_DURATION } from "./tegami";
import {
  SkillChangelogDemo,
  SKILL_CHANGELOG_DURATION,
} from "./skill-changelog";
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
import {
  SponsorCanadianAiDemo,
  SPONSOR_CANADIAN_AI_DURATION,
} from "./sponsor-canadian-ai";
import {
  SponsorGramotionDemo,
  SPONSOR_GRAMOTION_DURATION,
} from "./sponsor-gramotion";
import {
  SponsorShadcnUiKitDemo,
  SPONSOR_SHADCN_UI_KIT_DURATION,
} from "./sponsor-shadcn-ui-kit";
import {
  IntroducingVideorcDemo,
  INTRODUCING_VIDEORC_DURATION,
} from "./introducing-videorc";
import {
  IntroducingTenkitDemo,
  INTRODUCING_TENKIT_DURATION,
} from "./introducing-tenkit";
import {
  IntroducingPrismaDemo,
  INTRODUCING_PRISMA_DURATION,
} from "./introducing-prisma";
import { RemocnNewLogoDemo, REMOCN_NEW_LOGO_DURATION } from "./remocn-new-logo";
import { RemocnIconsDemo, REMOCN_ICONS_DURATION } from "./remocn-icons";
import {
  RemocnIconsOnetakeDemo,
  REMOCN_ICONS_ONETAKE_DURATION,
} from "./remocn-icons-onetake";
import { RemocnIcons3DDemo, REMOCN_ICONS_3D_DURATION } from "./remocn-icons-3d";
import {
  IntroducingShadcnTypesetDemo,
  INTRODUCING_SHADCN_TYPESET_DURATION,
} from "./introducing-shadcn-typeset";
import {
  IntroducingVercelDemo,
  INTRODUCING_VERCEL_DURATION,
} from "./introducing-vercel";
import {
  IntroducingNextjsDemo,
  INTRODUCING_NEXTJS_DURATION,
} from "./introducing-nextjs";
import { RemocnUiDemo, REMOCN_UI_DURATION } from "./remocn-ui";
import { LlmsTxtDemo, LLMS_TXT_DURATION } from "./llms-txt";
import {
  AsciiVariantsDemo,
  ASCII_VARIANTS_DURATION,
} from "./llms-txt-variants";
import {
  ChatTransitionVariantsDemo,
  CHAT_TRANSITION_VARIANTS_DURATION,
} from "./chat-transition-variants";
import { SponsorReuiDemo, SPONSOR_REUI_DURATION } from "./sponsor-reui";
import { AgentSkillDemo, AGENT_SKILL_DURATION } from "./agent-skill";
import { ShadcnAriaDemo, SHADCN_ARIA_DURATION } from "./shadcn-aria";
import { ShowcasesDemo, SHOWCASES_DURATION } from "./showcases";
import {
  FableShowcasesDemo,
  FABLE_SHOWCASES_DURATION,
} from "./fable-showcases";
import { FableFlipbookDemo, FABLE_FLIPBOOK_DURATION } from "./fable-flipbook";
import {
  IntroducingShadscanDemo,
  INTRODUCING_SHADSCAN_DURATION,
} from "./introducing-shadscan";

export * from "./types";

export const demos: Demo[] = [
  {
    ...getCatalogEntry("introducing-shadscan"),
    component: IntroducingShadscanDemo,
    durationInFrames: INTRODUCING_SHADSCAN_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("jitter-check-bg"),
    component: JitterCheckBgDemo,
    durationInFrames: JITTER_CHECK_BG_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("jitter-check"),
    component: JitterCheckDemo,
    durationInFrames: JITTER_CHECK_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("showcases"),
    component: ShowcasesDemo,
    durationInFrames: SHOWCASES_DURATION,
    defaultProps: {},
    thumbnailFrame: 1000,
  },
  {
    ...getCatalogEntry("fable-flipbook"),
    component: FableFlipbookDemo,
    durationInFrames: FABLE_FLIPBOOK_DURATION,
    defaultProps: {},
    thumbnailFrame: 600,
  },
  {
    ...getCatalogEntry("fable-showcases"),
    component: FableShowcasesDemo,
    durationInFrames: FABLE_SHOWCASES_DURATION,
    defaultProps: {},
    thumbnailFrame: 260,
  },
  {
    ...getCatalogEntry("introducing-prisma"),
    component: IntroducingPrismaDemo,
    durationInFrames: INTRODUCING_PRISMA_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("ai-and-social"),
    component: AiAndSocialDemo,
    durationInFrames: AI_AND_SOCIAL_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("shadcn-aria"),
    component: ShadcnAriaDemo,
    durationInFrames: SHADCN_ARIA_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("agent-skill"),
    component: AgentSkillDemo,
    durationInFrames: AGENT_SKILL_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("sponsor-reui"),
    component: SponsorReuiDemo,
    durationInFrames: SPONSOR_REUI_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("chat-transition-variants"),
    component: ChatTransitionVariantsDemo,
    durationInFrames: CHAT_TRANSITION_VARIANTS_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("llms-txt-variants"),
    component: AsciiVariantsDemo,
    durationInFrames: ASCII_VARIANTS_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("llms-txt"),
    component: LlmsTxtDemo,
    durationInFrames: LLMS_TXT_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("remocn-ui"),
    component: RemocnUiDemo,
    durationInFrames: REMOCN_UI_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("introducing-nextjs"),
    component: IntroducingNextjsDemo,
    durationInFrames: INTRODUCING_NEXTJS_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("introducing-vercel"),
    component: IntroducingVercelDemo,
    durationInFrames: INTRODUCING_VERCEL_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("introducing-shadcn-typeset"),
    component: IntroducingShadcnTypesetDemo,
    durationInFrames: INTRODUCING_SHADCN_TYPESET_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("remocn-icons-3d"),
    component: RemocnIcons3DDemo,
    durationInFrames: REMOCN_ICONS_3D_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("remocn-icons-onetake"),
    component: RemocnIconsOnetakeDemo,
    durationInFrames: REMOCN_ICONS_ONETAKE_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("remocn-icons"),
    component: RemocnIconsDemo,
    durationInFrames: REMOCN_ICONS_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("remocn-new-logo"),
    component: RemocnNewLogoDemo,
    durationInFrames: REMOCN_NEW_LOGO_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("introducing-tenkit"),
    component: IntroducingTenkitDemo,
    durationInFrames: INTRODUCING_TENKIT_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("introducing-videorc"),
    component: IntroducingVideorcDemo,
    durationInFrames: INTRODUCING_VIDEORC_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("sponsor-shadcn-ui-kit"),
    component: SponsorShadcnUiKitDemo,
    durationInFrames: SPONSOR_SHADCN_UI_KIT_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("sponsor-gramotion"),
    component: SponsorGramotionDemo,
    durationInFrames: SPONSOR_GRAMOTION_DURATION,
    defaultProps: {},
  },
  {
    ...getCatalogEntry("sponsor-canadian-ai"),
    component: SponsorCanadianAiDemo,
    durationInFrames: SPONSOR_CANADIAN_AI_DURATION,
    defaultProps: {},
  },
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
    ...getCatalogEntry("perf-guards"),
    component: PerfGuardsDemo,
    durationInFrames: PERF_GUARDS_DURATION,
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
