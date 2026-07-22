import type { Thumbnail } from "./index";
import { AgentSkillsThumb } from "./agent-skills";
import { TypographyThumb } from "./typography";
import { BatchworkThumb } from "./batchwork";
import { SignupFlowThumb } from "./signup-flow";
import { FonttrioThumb } from "./fonttrio";
import { RenderSdkThumb } from "./render-sdk";
import { PerfGuardsThumb } from "./perf-guards";

/** Filled in by the tools thumbnail batch — one entry per demo id. */
export const batchTools: Thumbnail[] = [
  { demoId: "agent-skills", component: AgentSkillsThumb },
  { demoId: "typography", component: TypographyThumb },
  { demoId: "batchwork", component: BatchworkThumb },
  { demoId: "signup-flow", component: SignupFlowThumb },
  { demoId: "fonttrio", component: FonttrioThumb },
  { demoId: "render-sdk", component: RenderSdkThumb },
  { demoId: "perf-guards", component: PerfGuardsThumb },
];
