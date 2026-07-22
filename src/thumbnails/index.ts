import type { ComponentType } from "react";
import { IntroducingRemocnThumb } from "./introducing-remocn";
import { batchBrand } from "./batch-brand";
import { batchFrameworks } from "./batch-frameworks";
import { batchSponsors } from "./batch-sponsors";
import { batchProducts } from "./batch-products";
import { batchChangelog } from "./batch-changelog";
import { batchTools } from "./batch-tools";

export type Thumbnail = {
  /** the demo this is a cover for — also the composition id, prefixed `thumb-` */
  demoId: string;
  component: ComponentType;
};

export const thumbnails: Thumbnail[] = [
  { demoId: "introducing-remocn", component: IntroducingRemocnThumb },
  ...batchBrand,
  ...batchFrameworks,
  ...batchSponsors,
  ...batchProducts,
  ...batchChangelog,
  ...batchTools,
];

export const thumbnailCompositionId = (demoId: string) => `thumb-${demoId}`;
