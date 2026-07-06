"use client";

import { Warp } from "@paper-design/shaders-react";
import { useCallback, useState } from "react";
import {
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// The paper.design warp preset picked for the Shadcn UI Kit spot:
// proportion=0.64 · softness=1 · distortion=0.2 · swirl=0.86
// swirlIterations=7 · shape=edge · shapeScale=0.6 · speed=10 · scale=0.9
// rotation=160 — the preset's green/navy colors are remapped into the kit's
// indigo family around its #6366f1 hero accent: indigo-300, indigo-900 and
// the site's own #0a0a0a dark canvas. Frame-driven like the other remocn
// shaders so every render is deterministic.
const SHADCN_UI_KIT_COLORS = ["#a5b4fc", "#312e81", "#0a0a0a"];

export interface ShadcnUiKitWarpProps {
  speed?: number;
  colors?: string[];
  className?: string;
}

export function ShadcnUiKitWarp({
  speed = 10,
  colors = SHADCN_UI_KIT_COLORS,
  className,
}: ShadcnUiKitWarpProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const [handle] = useState(() => delayRender("shadcn-ui-kit-warp"));
  const gate = useCallback(
    (element: HTMLDivElement | null) => {
      if (!element) return;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => continueRender(handle)),
      );
    },
    [handle],
  );

  return (
    <div
      ref={gate}
      className={className}
      style={{ position: "absolute", inset: 0 }}
    >
      <Warp
        speed={0}
        frame={(frame / fps) * speed * 1000}
        colors={colors}
        proportion={0.64}
        softness={1}
        distortion={0.2}
        swirl={0.86}
        swirlIterations={7}
        shape="edge"
        shapeScale={0.6}
        scale={0.9}
        rotation={160}
        fit="cover"
        width={width}
        height={height}
      />
    </div>
  );
}
