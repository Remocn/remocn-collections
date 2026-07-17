import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { ScaleDownFade } from "@/components/remocn/scale-down-fade";
import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";
import {
  asciiDissolve,
  type AsciiEnterStyle,
} from "@/components/remocn/ascii-dissolve";

// ---------------------------------------------------------------------------
// SCRATCH — side-by-side comparison of the ascii-dissolve enter styles.
// Five identical takes of the llms-txt turn (verdict → cover → headline),
// one per enterStyle, with a mono label naming the take. Not a shipping cut.
// ---------------------------------------------------------------------------

const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

const OBSIDIAN = "#141318";
const INK = "#f2f2f2";
const FAINT = "rgba(242,242,242,0.4)";

const TAKE_A = 140; //  the verdict beat
const TAKE_B = 130; //  the headline holds
const T_COVER = 84; //  the ascii-dissolve cover
const TAKE_LEN = TAKE_A + TAKE_B - T_COVER;

const VARIANTS: { style: AsciiEnterStyle; label: string }[] = [
  { style: "clearing", label: "1/5 clearing — cells near the text vanish first" },
  { style: "halo", label: "2/5 halo — a soft dark well grows around the text" },
  { style: "wave", label: "3/5 wave — one density impulse rides outward" },
  { style: "focus", label: "4/5 focus — the field defocuses, the text is sharp" },
  { style: "lime-echo", label: "5/5 lime-echo — an accent ring flashes once" },
];

const variantCover = (style: AsciiEnterStyle) =>
  asciiDissolve({
    cellSize: 12,
    colorBack: OBSIDIAN,
    colorFront: "rgba(242,242,242,0.56)",
    accentColor: "rgba(195,232,141,0.75)",
    accentDensity: 0.05,
    fontFamily: MONO,
    enterStyle: style,
    enterText: {
      text: "Now the docs are plain text",
      fontSize: 72,
      fontFamily: `${SANS_FAMILY}, sans-serif`,
      fontWeight: 400,
      color: INK,
    },
  });

const VerdictLite: React.FC = () => (
  <AbsoluteFill>
    <ScaleDownFade
      text="A bad way to learn an API"
      fontSize={58}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

const TurnLite: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <span
      style={{
        fontFamily: SANS,
        fontWeight: 400,
        fontSize: 72,
        color: INK,
      }}
    >
      Now the docs are plain text
    </span>
  </AbsoluteFill>
);

const Take: React.FC<{ style: AsciiEnterStyle; label: string }> = ({
  style,
  label,
}) => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={TAKE_A}>
        <VerdictLite />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: T_COVER })}
        presentation={variantCover(style)}
      />
      <TransitionSeries.Sequence durationInFrames={TAKE_B}>
        <TurnLite />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <span
      style={{
        position: "absolute",
        left: 32,
        bottom: 26,
        fontFamily: MONO,
        fontSize: 17,
        color: FAINT,
      }}
    >
      {label}
    </span>
  </AbsoluteFill>
);

export const ASCII_VARIANTS_DURATION = VARIANTS.length * TAKE_LEN;

export const AsciiVariantsDemo: React.FC = () => (
  <AbsoluteFill
    style={
      {
        "--font-geist-sans": SANS_FAMILY,
        background: OBSIDIAN,
      } as React.CSSProperties
    }
  >
    <ShaderSimplexNoise
      speed={0.35}
      colors={["#141318", "#1a1922", "#232231"]}
      stepsPerColor={2}
      softness={0.8}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 120% at 50% 42%, rgba(20,19,24,0.26) 0%, rgba(20,19,24,0.66) 100%)",
      }}
    />
    <Series>
      {VARIANTS.map((v) => (
        <Series.Sequence key={v.style} durationInFrames={TAKE_LEN}>
          <Take style={v.style} label={v.label} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
