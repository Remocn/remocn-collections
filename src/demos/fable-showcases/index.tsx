// fable-showcases — the remocn showcases announcement as one continuous
// zoom of scale. See STORYBOARD.md. A single unbroken take: from inside one
// playing render, out through 4 → 13 → 41 tiles, back in twice (the dives),
// out to the repos in the wild, and finally every object in the universe
// spring-flies into the R letterform, which becomes the logo.
//
// Motion charter: additive log-domain springs for every camera move, spring
// arrivals with camera kicks, a sine hand-drift — no linear timing anywhere.
// No letter-spacing, no uppercase, no badges, no pills, no pulsing.

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { ShaderGrainGradient } from "@/components/remocn/shader-grain-gradient";

import { TOTAL_DURATION, WORLD_END } from "./rig";
import { WorldPlane } from "./wall";
import {
  CountLine,
  CruiseCaption,
  DiveTitle,
  WildCaption,
  WildFootnote,
} from "./beats";
import { FinaleLockup, LetterOverlay } from "./finale";
import { DIVE_1, DIVE_2 } from "./manifest";

const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400"],
});

const SANS = `${SANS_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

const OBSIDIAN = "#141318";

export const FABLE_SHOWCASES_DURATION = TOTAL_DURATION;

export const FableShowcasesDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--fable-sans": SANS,
          "--fable-mono": MONO,
          // remocn text components read this variable
          "--font-geist-sans": SANS_FAMILY,
          background: OBSIDIAN,
        } as React.CSSProperties
      }
    >
      {/* the quiet field the plane floats on */}
      <ShaderGrainGradient
        speed={0.45}
        colorBack={OBSIDIAN}
        colors={["#1a1922", "#232231", "#2b2334"]}
        softness={0.85}
        intensity={0.1}
        noise={0.07}
      />

      {/* the world — one camera, no cuts, gone once the letter is solid */}
      <Sequence durationInFrames={WORLD_END}>
        <WorldPlane />
      </Sequence>

      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(115% 115% at 50% 46%, rgba(20,19,24,0) 54%, rgba(20,19,24,0.5) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* words */}
      <Sequence from={74} durationInFrames={72}>
        <CruiseCaption />
      </Sequence>
      <Sequence from={204} durationInFrames={142}>
        <CountLine />
      </Sequence>
      <Sequence from={388} durationInFrames={64}>
        <DiveTitle id={DIVE_1} />
      </Sequence>
      <Sequence from={564} durationInFrames={64}>
        <DiveTitle id={DIVE_2} />
      </Sequence>
      <Sequence from={656} durationInFrames={70}>
        <WildCaption />
      </Sequence>
      <Sequence from={686} durationInFrames={40}>
        <WildFootnote />
      </Sequence>

      {/* the letter, then the lockup */}
      <Sequence from={730} durationInFrames={WORLD_END - 730}>
        <LetterOverlay />
      </Sequence>
      <Sequence from={WORLD_END}>
        <FinaleLockup sansFamily={SANS_FAMILY} />
      </Sequence>
    </AbsoluteFill>
  );
};
