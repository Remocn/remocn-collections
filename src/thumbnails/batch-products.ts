import type { Thumbnail } from "./index";
import { ShieldcnThumb } from "./shieldcn";
import { ShieldcnPlusThumb } from "./shieldcn-plus";
import { SponsorShieldcnThumb } from "./sponsor-shieldcn";
import { PaperShadersThumb } from "./paper-shaders";
import { IntroducingTenkitThumb } from "./introducing-tenkit";
import { IntroducingVideorcThumb } from "./introducing-videorc";
import { TegamiThumb } from "./tegami";

/** Filled in by the products thumbnail batch — one entry per demo id. */
export const batchProducts: Thumbnail[] = [
  { demoId: "shieldcn", component: ShieldcnThumb },
  { demoId: "shieldcn-plus", component: ShieldcnPlusThumb },
  { demoId: "sponsor-shieldcn", component: SponsorShieldcnThumb },
  { demoId: "paper-shaders", component: PaperShadersThumb },
  { demoId: "introducing-tenkit", component: IntroducingTenkitThumb },
  { demoId: "introducing-videorc", component: IntroducingVideorcThumb },
  { demoId: "tegami", component: TegamiThumb },
];
