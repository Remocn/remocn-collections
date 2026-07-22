import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { SharedAxisZ } from "@/components/remocn/shared-axis-z";
import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";

// ===========================================================================
// Scratch diagnostic, round two. Round one held the background flat and varied
// the entrance, and nothing trembled — so the entrance is not the cause. This
// one inverts the experiment: every band runs the SAME entrance (the real
// SharedAxisZ, the real word, the real 86px Inter, the real 2% push-in), and
// what differs is the ground the type stands on.
//
//   1 live noise      the sponsor-reui backdrop exactly: the simplex field at
//                     speed 0.32 under its vignette, repainting every frame
//   2 flat black      the same scene with the field removed
//   3 frozen noise    the same field, same texture, speed 0 — it never moves
//   4 live, no entrance   the moving field under a word that hard-cuts in and
//                     then sits perfectly still
//
// Each band is a window onto a full-size replica of the real scene, offset so
// every band shows the same central strip the real word stands on — same noise,
// same vignette falloff, so a difference between bands can only be the variable.
//
// Reading it: if 1 shimmers and 2 does not, the ground is the cause. If 4
// shimmers too, then it is the moving ground alone and the type is innocent.
// If 3 is clean while 1 is not, it is the field's MOTION, not its texture.
// ===========================================================================

const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400"],
});

const SANS = `${SANS_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

const BG = "#0a0a0a";
const INK = "#fafafa";
const LABEL = "rgba(250,250,250,0.34)";

const WORDS = ["Application", "Solutions", "eCommerce", "Marketing", "Analytics"];
const BEAT = 44;
const SPEED = 1.4;
const WORD_SIZE = 86;

export const JITTER_CHECK_BG_DURATION = WORDS.length * BEAT;

// The composition's own frame, verbatim from sponsor-reui's root.
const FRAME_W = 1280;
const FRAME_H = 720;
const VIGNETTE =
  "radial-gradient(120% 120% at 50% 42%, rgba(10,10,10,0.62) 0%, rgba(10,10,10,0.92) 100%)";

type Ground = "live" | "flat" | "frozen";

const Backdrop: React.FC<{ ground: Ground }> = ({ ground }) => {
  if (ground === "flat") return null;
  return (
    <>
      <ShaderSimplexNoise
        speed={ground === "frozen" ? 0 : 0.32}
        colors={["#0a0a0a", "#141414", "#1f1f1f"]}
        stepsPerColor={2}
        softness={0.8}
      />
      <AbsoluteFill style={{ background: VIGNETTE }} />
    </>
  );
};

// The word, cut in with no entrance at all — band 4's control.
const StillWord: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <span
      style={{
        fontFamily: SANS,
        fontSize: WORD_SIZE,
        fontWeight: 400,
        letterSpacing: "-0.03em",
        color: INK,
      }}
    >
      {text}
    </span>
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// A band is a slot cut out of a full-size replica of the scene, so the type
// sits on the same patch of ground in every band. The push-in matches the
// GroupWords drift (grow 0.02) and is promoted the way the demo promotes it;
// the backdrop stays outside it, exactly as in sponsor-reui.
// ---------------------------------------------------------------------------
const BAND_H = 158;
const BAND_TOPS = [22, 194, 366, 538];

const Band: React.FC<{
  index: number;
  label: string;
  ground: Ground;
  children: React.ReactNode;
}> = ({ index, label, ground, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, JITTER_CHECK_BG_DURATION], [1, 1.02]);
  return (
    <div
      style={{
        position: "absolute",
        top: BAND_TOPS[index],
        left: 0,
        right: 0,
        height: BAND_H,
        overflow: "hidden",
        background: BG,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: -(FRAME_H / 2 - BAND_H / 2),
          width: FRAME_W,
          height: FRAME_H,
        }}
      >
        <Backdrop ground={ground} />
        <AbsoluteFill
          style={{
            transform: `scale(${scale})`,
            willChange: "transform",
          }}
        >
          {children}
        </AbsoluteFill>
      </div>
      <span
        style={{
          position: "absolute",
          left: 26,
          top: BAND_H / 2 - 9,
          fontFamily: MONO,
          fontSize: 13,
          color: LABEL,
        }}
      >
        {`${index + 1} ${label}`}
      </span>
    </div>
  );
};

const BANDS: {
  label: string;
  ground: Ground;
  still?: boolean;
}[] = [
  { label: "live noise", ground: "live" },
  { label: "flat black", ground: "flat" },
  { label: "frozen noise", ground: "frozen" },
  { label: "live noise, no entrance", ground: "live", still: true },
];

export const JitterCheckBgDemo: React.FC = () => (
  <AbsoluteFill
    style={
      {
        "--font-geist-sans": SANS_FAMILY,
        background: BG,
      } as React.CSSProperties
    }
  >
    {BANDS.map((band, bi) => (
      <Band key={band.label} index={bi} label={band.label} ground={band.ground}>
        {WORDS.map((word, i) => (
          <Sequence
            key={word}
            from={i * BEAT}
            durationInFrames={BEAT}
            layout="none"
          >
            {band.still ? (
              <StillWord text={word} />
            ) : (
              <SharedAxisZ
                fromText={i === 0 ? "" : WORDS[i - 1]}
                toText={word}
                fontSize={WORD_SIZE}
                fontWeight={400}
                color={INK}
                speed={SPEED}
              />
            )}
          </Sequence>
        ))}
      </Band>
    ))}
  </AbsoluteFill>
);
