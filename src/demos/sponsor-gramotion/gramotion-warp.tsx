"use client";

import { Warp } from "@paper-design/shaders-react";
import { useCallback, useState } from "react";
import {
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// The paper.design warp preset picked for the Gramotion spot, verbatim:
// colors=3c1515,944752,ffc085 · proportion=0.5 · softness=1 · distortion=0.09
// swirl=0.9 · swirlIterations=6 · shape=checks · shapeScale=0.25 · speed=3
// scale=2.5 · rotation=1.35 — the three colors are Gramotion's warm family
// around its #ff6825 accent. Frame-driven like the other remocn shaders so
// every render is deterministic.
const GRAMOTION_COLORS = ["#3c1515", "#944752", "#ffc085"];

export interface GramotionWarpProps {
  speed?: number;
  colors?: string[];
  className?: string;
}

export function GramotionWarp({
  speed = 3,
  colors = GRAMOTION_COLORS,
  className,
}: GramotionWarpProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const [handle] = useState(() => delayRender("gramotion-warp"));
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
        proportion={0.5}
        softness={1}
        distortion={0.09}
        swirl={0.9}
        swirlIterations={6}
        shape="checks"
        shapeScale={0.25}
        scale={2.5}
        rotation={1.35}
        fit="cover"
        width={width}
        height={height}
      />
    </div>
  );
}
