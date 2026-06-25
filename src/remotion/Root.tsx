import React from "react";
import { Composition } from "remotion";
import { demos, DEFAULT_VIDEO } from "@/demos";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {demos.map((demo) => (
        <Composition
          key={demo.id}
          id={demo.id}
          component={demo.component as React.FC}
          durationInFrames={demo.durationInFrames}
          fps={demo.fps ?? DEFAULT_VIDEO.fps}
          width={demo.width ?? DEFAULT_VIDEO.width}
          height={demo.height ?? DEFAULT_VIDEO.height}
          defaultProps={(demo.defaultProps ?? {}) as Record<string, unknown>}
        />
      ))}
    </>
  );
};
