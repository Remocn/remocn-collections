// fable-flipbook — the remocn showcases as living photographs.
//
// The whole world is stop-motion: every transform ticks on a ~10fps
// quantized clock (STEP=3) with a per-pose paper wobble, like pages and
// polaroids re-shot by hand on a desk — while the video inside each
// photograph plays smooth at 30fps. That contrast IS the concept: the
// showcases are living photographs. Every word is written by pen (Caveat
// letters laid down per pose), mono labels live on taped paper stickers,
// and the finale draws the R letterform by hand and floods it with ink.
//
// No letter-spacing added, no uppercase, no badges, no pills, no pulsing.

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { DarkIntro, FinaleAct, WildAct } from "./acts";
import { PhotosAct, PHOTOS_DURATION } from "./photos";
import { PaperField } from "./paper";

const { fontFamily: HAND_FAMILY } = loadHand("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "600"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400"],
});

const INTRO = 96;
const WILD_AT = INTRO + PHOTOS_DURATION; // 748
const WILD_DUR = 208;
const FINALE_AT = WILD_AT + WILD_DUR;
const FINALE_DUR = 192;

export const FABLE_FLIPBOOK_DURATION = FINALE_AT + FINALE_DUR; // 1188

export const FableFlipbookDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--flip-hand": `${HAND_FAMILY}, cursive`,
          "--flip-sans": `${SANS_FAMILY}, -apple-system, sans-serif`,
          "--flip-mono": `${MONO_FAMILY}, ui-monospace, monospace`,
          background: "#f1eee7",
        } as React.CSSProperties
      }
    >
      <PaperField />

      <Sequence from={INTRO} durationInFrames={PHOTOS_DURATION}>
        <PhotosAct />
      </Sequence>

      <Sequence from={WILD_AT} durationInFrames={WILD_DUR}>
        <WildAct />
      </Sequence>

      <Sequence from={FINALE_AT} durationInFrames={FINALE_DUR}>
        <FinaleAct sansFamily={SANS_FAMILY} />
      </Sequence>

      {/* the dark title card sits on top until its page swings away */}
      <Sequence durationInFrames={INTRO}>
        <DarkIntro />
      </Sequence>
    </AbsoluteFill>
  );
};
