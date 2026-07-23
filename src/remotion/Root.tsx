import React from "react";
import { Composition } from "remotion";
import { demos, DEFAULT_VIDEO } from "@/demos";
import {
  TransitionLabDemo,
  TRANSITION_LAB_DURATION,
  transitionLabSchema,
} from "@/demos/transition-lab";
import { thumbnails, thumbnailCompositionId } from "@/thumbnails";
import { ContactSheetThumb, CONTACT_SHEET } from "@/thumbnails/contact-sheet";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Registered by hand with LITERAL defaultProps so the Studio
          "Save defaults" button can codemod tuned values back into
          this file (it cannot rewrite computed defaultProps). */}
      <Composition
        id="transition-lab"
        component={TransitionLabDemo}
        durationInFrames={TRANSITION_LAB_DURATION}
        fps={DEFAULT_VIDEO.fps}
        width={DEFAULT_VIDEO.width}
        height={DEFAULT_VIDEO.height}
        schema={transitionLabSchema}
        defaultProps={{
          mode: "rise" as const,
          sceneFrames: 40,
          gapFrames: 1,
          slideFrames: 6,
          slideInDistance: 0.28,
          slideInDamping: 60,
          slideInStiffness: 300,
          slideInMass: 0.2,
          slideInFadeFrames: 16,
          slideOutFrames: 30,
          slideOutDistance: 0.1,
          slideOutPower: 5,
          enterScale: 1.24,
          enterFadeFrames: 5,
          enterStagger: 3,
          springDamping: 30,
          springStiffness: 320,
          springMass: 1,
          exitFrames: 6,
          exitScale: 0.84,
          exitPower: 5,
          bgFadeFrames: 4,
          showHud: true,
        }}
      />

      {demos
        .filter((demo) => demo.id !== "transition-lab")
        .map((demo) => (
        <Composition
          key={demo.id}
          id={demo.id}
          component={demo.component as React.FC}
          durationInFrames={demo.durationInFrames}
          fps={demo.fps ?? DEFAULT_VIDEO.fps}
          width={demo.width ?? DEFAULT_VIDEO.width}
          height={demo.height ?? DEFAULT_VIDEO.height}
          schema={demo.schema as never}
          defaultProps={(demo.defaultProps ?? {}) as Record<string, unknown>}
        />
      ))}

      {/* YouTube covers — single-frame stills, rendered with `remotionb still`. */}
      {thumbnails.map((thumb) => (
        <Composition
          key={thumb.demoId}
          id={thumbnailCompositionId(thumb.demoId)}
          component={thumb.component as React.FC}
          durationInFrames={1}
          fps={DEFAULT_VIDEO.fps}
          width={DEFAULT_VIDEO.width}
          height={DEFAULT_VIDEO.height}
        />
      ))}

      {/* QA surface: the whole cover set at the size YouTube renders it. */}
      <Composition
        id="contact-sheet"
        component={ContactSheetThumb}
        durationInFrames={1}
        fps={DEFAULT_VIDEO.fps}
        width={CONTACT_SHEET.width}
        height={CONTACT_SHEET.height}
      />
    </>
  );
};
