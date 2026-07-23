import type { ComponentType } from "react";

export const DEFAULT_VIDEO = { fps: 30, width: 1280, height: 720 } as const;

export type Demo = {
  /** slug — also the Remotion composition id and the /demo/[id] route param */
  id: string;
  title: string;
  description: string;
  /** the Remotion composition component */
  component: ComponentType;
  durationInFrames: number;
  fps?: number;     // defaults to DEFAULT_VIDEO.fps
  width?: number;   // defaults to DEFAULT_VIDEO.width
  height?: number;  // defaults to DEFAULT_VIDEO.height
  defaultProps?: Record<string, unknown>;
  /** optional zod schema — enables the props-panel controls in Remotion Studio */
  schema?: unknown;
  /** frame shown in the list-page thumbnail; defaults to the middle frame */
  thumbnailFrame?: number;
};
