// showcases — the remocn gallery announcement.
//
// The angle: don't enumerate the library, show the OUTPUT. One continuous
// physics camera flight through a canyon of all 41 videos made with remocn
// (every screen plays the real render), three match-cut dives into featured
// flagships, the count (41 videos / 22 minutes), the wild (10 public repos
// already wired to @remocn), and the inherited smoke-ring outro at
// remocn.dev/showcases.
//
// Motion charter for this cut: no linear timing anywhere, springs for
// physical beats, a banked camera weave, wake on the walls, zoom in / zoom
// out as the only transition language inside the flight. No letter-spacing,
// no uppercase, no badges, no pills, no pulsing.

import React from "react";
import { AbsoluteFill } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { whipPan } from "@/components/remocn/whip-pan";
import { smokeDissolve } from "@/components/remocn/smoke-dissolve";

import { FLIGHT_DURATION } from "./camera";
import { FlightAct } from "./flight";
import { CountAct, WildAct } from "./acts";
import { OutroAct } from "./outro";

const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700", "800"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

const SANS = `${SANS_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

// The shipped remocn.dev brand: warm obsidian + one lime accent.
const OBSIDIAN = "#141318";

// ---------------------------------------------------------------------------
// Act lengths (frames @ 30fps)
// ---------------------------------------------------------------------------
const S_COUNT = 214;
const S_WILD = 172;
const S_OUTRO = 162;

const T_WHIP = 24; // flight → count
const T_BLUR = 16; // count → wild
const T_SMOKE = 38; // wild → outro

export const SHOWCASES_DURATION =
  FLIGHT_DURATION + S_COUNT + S_WILD + S_OUTRO - (T_WHIP + T_BLUR + T_SMOKE);

// ---------------------------------------------------------------------------
// blurFade — the quiet crossfade between the count and the wild.
// ---------------------------------------------------------------------------
type EmptyProps = Record<string, never>;

const BlurFade: React.FC<TransitionPresentationComponentProps<EmptyProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const entering = presentationDirection === "entering";
  const p = presentationProgress;
  const style: React.CSSProperties = entering
    ? {
        opacity: p,
        transform: `scale(${0.95 + p * 0.05})`,
        filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
      }
    : {
        opacity: 1 - p,
        transform: `scale(${1 + p * 0.06})`,
        filter: p > 0 ? `blur(${p * 10}px)` : undefined,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const blurFade = (): TransitionPresentation<EmptyProps> => ({
  component: BlurFade,
  props: {},
});

// ---------------------------------------------------------------------------
// Composition root.
// ---------------------------------------------------------------------------
export const ShowcasesDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--showcases-sans": SANS,
          "--showcases-mono": MONO,
          // bind Manrope where the remocn typography components look
          "--font-geist-sans": SANS_FAMILY,
          background: OBSIDIAN,
        } as React.CSSProperties
      }
    >
      <TransitionSeries>
        {/* 1 — the flight: ignition, the canyon, three dives */}
        <TransitionSeries.Sequence durationInFrames={FLIGHT_DURATION}>
          <FlightAct />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_WHIP })}
          presentation={whipPan({ direction: "left" })}
        />

        {/* 2 — the count: the mosaic, then 41 */}
        <TransitionSeries.Sequence durationInFrames={S_COUNT}>
          <CountAct />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 3 — the wild: blume and the other repos */}
        <TransitionSeries.Sequence durationInFrames={S_WILD}>
          <WildAct />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_SMOKE })}
          presentation={smokeDissolve({
            colorBack: OBSIDIAN,
            colors: ["#33323d", "#525b40"],
          })}
        />

        {/* 4 — the outro at remocn.dev/showcases */}
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroAct sansFamily={SANS_FAMILY} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
