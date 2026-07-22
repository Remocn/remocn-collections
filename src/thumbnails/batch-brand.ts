import type { Thumbnail } from "./index";
import { ShowcasesThumb } from "./showcases";
import { FableFlipbookThumb } from "./fable-flipbook";
import { FableShowcasesThumb } from "./fable-showcases";
import { RemocnIconsThumb } from "./remocn-icons";
import { RemocnIconsOnetakeThumb } from "./remocn-icons-onetake";
import { RemocnIcons3dThumb } from "./remocn-icons-3d";
import { RemocnNewLogoThumb } from "./remocn-new-logo";
import { NewTransitionsThumb } from "./new-transitions";

/** Filled in by the brand thumbnail batch — one entry per demo id. */
export const batchBrand: Thumbnail[] = [
  { demoId: "showcases", component: ShowcasesThumb },
  { demoId: "fable-flipbook", component: FableFlipbookThumb },
  { demoId: "fable-showcases", component: FableShowcasesThumb },
  { demoId: "remocn-icons", component: RemocnIconsThumb },
  { demoId: "remocn-icons-onetake", component: RemocnIconsOnetakeThumb },
  { demoId: "remocn-icons-3d", component: RemocnIcons3dThumb },
  { demoId: "remocn-new-logo", component: RemocnNewLogoThumb },
  { demoId: "new-transitions", component: NewTransitionsThumb },
];
