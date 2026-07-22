import React from "react";
import { Composition } from "remotion";
import { demos, DEFAULT_VIDEO } from "@/demos";
import { thumbnails, thumbnailCompositionId } from "@/thumbnails";
import { ContactSheetThumb, CONTACT_SHEET } from "@/thumbnails/contact-sheet";

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
