import type { Thumbnail } from "./index";
import { IntroducingPrismaThumb } from "./introducing-prisma";
import { IntroducingNextjsThumb } from "./introducing-nextjs";
import { IntroducingVercelThumb } from "./introducing-vercel";
import { IntroducingShadcnThumb } from "./introducing-shadcn";
import { ShadcnUiThumb } from "./shadcn-ui";
import { IntroducingShadcnTypesetThumb } from "./introducing-shadcn-typeset";
import { ShadcnAriaThumb } from "./shadcn-aria";

/** Filled in by the frameworks thumbnail batch — one entry per demo id. */
export const batchFrameworks: Thumbnail[] = [
  { demoId: "introducing-prisma", component: IntroducingPrismaThumb },
  { demoId: "introducing-nextjs", component: IntroducingNextjsThumb },
  { demoId: "introducing-vercel", component: IntroducingVercelThumb },
  { demoId: "introducing-shadcn", component: IntroducingShadcnThumb },
  { demoId: "introducing-shadcn-typeset", component: IntroducingShadcnTypesetThumb },
  { demoId: "shadcn-ui", component: ShadcnUiThumb },
  { demoId: "shadcn-aria", component: ShadcnAriaThumb },
];
