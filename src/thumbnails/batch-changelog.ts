import type { Thumbnail } from "./index";
import { AiAndSocialThumb } from "./ai-and-social";
import { AgentSkillThumb } from "./agent-skill";
import { SkillChangelogThumb } from "./skill-changelog";
import { LlmsTxtThumb } from "./llms-txt";
import { RemocnUiThumb } from "./remocn-ui";
import { ChatChangelogThumb } from "./chat-changelog";
import { ChangelogThumb } from "./changelog";

/** Filled in by the changelog thumbnail batch — one entry per demo id. */
export const batchChangelog: Thumbnail[] = [
  { demoId: "ai-and-social", component: AiAndSocialThumb },
  { demoId: "agent-skill", component: AgentSkillThumb },
  { demoId: "skill-changelog", component: SkillChangelogThumb },
  { demoId: "llms-txt", component: LlmsTxtThumb },
  { demoId: "remocn-ui", component: RemocnUiThumb },
  { demoId: "chat-changelog", component: ChatChangelogThumb },
  { demoId: "changelog", component: ChangelogThumb },
];
