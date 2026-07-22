import type { Thumbnail } from "./index";
import { SponsorReuiThumb } from "./sponsor-reui";
import { SponsorShadcnUiKitThumb } from "./sponsor-shadcn-ui-kit";
import { SponsorGramotionThumb } from "./sponsor-gramotion";
import { SponsorCanadianAiThumb } from "./sponsor-canadian-ai";
import { SponsorOrcdevThumb } from "./sponsor-orcdev";
import { SponsorReactbitsThumb } from "./sponsor-reactbits";
import { SponsorLnThumb } from "./sponsor-ln";

/** Filled in by the sponsors thumbnail batch — one entry per demo id. */
export const batchSponsors: Thumbnail[] = [
  { demoId: "sponsor-reui", component: SponsorReuiThumb },
  { demoId: "sponsor-shadcn-ui-kit", component: SponsorShadcnUiKitThumb },
  { demoId: "sponsor-gramotion", component: SponsorGramotionThumb },
  { demoId: "sponsor-canadian-ai", component: SponsorCanadianAiThumb },
  { demoId: "sponsor-orcdev", component: SponsorOrcdevThumb },
  { demoId: "sponsor-reactbits", component: SponsorReactbitsThumb },
  { demoId: "sponsor-ln", component: SponsorLnThumb },
];
