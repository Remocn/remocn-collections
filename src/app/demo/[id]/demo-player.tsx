"use client";

import dynamic from "next/dynamic";
import { getDemo, DEFAULT_VIDEO } from "@/demos";

const Player = dynamic(() => import("@remotion/player").then((m) => m.Player), {
  ssr: false,
});

export function DemoPlayer({ id }: { id: string }) {
  const demo = getDemo(id);
  if (!demo) return null;

  const fps = demo.fps ?? DEFAULT_VIDEO.fps;
  const width = demo.width ?? DEFAULT_VIDEO.width;
  const height = demo.height ?? DEFAULT_VIDEO.height;

  return (
    <div
      className="mt-8 overflow-hidden rounded-[min(1.5vw,14px)] outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <Player
        component={demo.component}
        durationInFrames={demo.durationInFrames}
        fps={fps}
        compositionWidth={width}
        compositionHeight={height}
        inputProps={demo.defaultProps ?? {}}
        controls
        autoPlay
        loop
        style={{ width: "100%" }}
      />
    </div>
  );
}
