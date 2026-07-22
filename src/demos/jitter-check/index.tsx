import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { SharedAxisZ } from "@/components/remocn/shared-axis-z";

// ===========================================================================
// Scratch diagnostic, not a shipping cut. It answers one question: does the
// residual trembling of BIG type come from the tail of its own entrance?
//
// Every band runs the same word change at the same moment, in its own promoted
// zoom layer (own layer, so one band's repaint can never disturb another), and
// differs only in how the entrance treats GEOMETRY:
//
//   1 as shipped   the real SharedAxisZ — scale 0.9 -> 1 on a deep ease-out,
//                  so the last frames creep by hundredths of a pixel
//   2 short tail   same entrance, but the scale reaches 1 early and stops;
//                  opacity and blur keep running
//   3 opacity only the word never changes size — nothing moves sub-pixel
//   4 hard cut     no entrance at all, the control
//
// A hairline sits under each word. It is geometry, so it always glides. If a
// band's letters shimmer against their own hairline while band 4 does not,
// the entrance tail is the cause, and bands 2 and 3 are the two ways out.
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
const RULE = "rgba(250,250,250,0.22)";
const LABEL = "rgba(250,250,250,0.34)";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// The demo's own words and beat, so the reel runs at the rhythm being judged.
const WORDS = ["Application", "Solutions", "eCommerce", "Marketing", "Analytics"];
const BEAT = 44;
const SPEED = 1.4; // sponsor-reui drives SharedAxisZ at this speed
const WORD_SIZE = 86;

export const JITTER_CHECK_DURATION = WORDS.length * BEAT;

// ---------------------------------------------------------------------------
// The hand-written variants. Timings mirror SharedAxisZ exactly (its enterDur
// 16 / exitDur 11 / overlap 3 / microDelay 1, all in speed-scaled frames) so
// the only thing that differs between bands is the scale schedule.
// ---------------------------------------------------------------------------
type Mode = "short" | "opacity" | "cut";

const ENTER_DUR = 16;
const EXIT_DUR = 11;
const NEW_START = Math.max(0, EXIT_DUR - 3 + 1);
const SHORT_SCALE_DUR = 9; // reaches 1 well before the fade finishes

const exitEasing = Easing.bezier(0.4, 0, 1, 1);
const enterEasing = Easing.bezier(0.2, 0, 0, 1);

const Word: React.FC<{
  text: string;
  opacity: number;
  scale: number;
  blur: number;
}> = ({ text, opacity, scale, blur }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <span
      style={{
        fontFamily: SANS,
        fontSize: WORD_SIZE,
        fontWeight: 400,
        letterSpacing: "-0.03em",
        color: INK,
        display: "inline-block",
        transformOrigin: "50% 50%",
        opacity,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
      }}
    >
      {text}
    </span>
  </div>
);

const AxisVariant: React.FC<{
  fromText: string;
  toText: string;
  mode: Mode;
}> = ({ fromText, toText, mode }) => {
  const frame = useCurrentFrame() * SPEED;

  if (mode === "cut") {
    return <Word text={toText} opacity={1} scale={1} blur={0} />;
  }

  const flat = mode === "opacity";

  const fromOpacity = interpolate(frame, [0, EXIT_DUR], [1, 0], {
    ...clampOpts,
    easing: exitEasing,
  });
  const fromBlur = interpolate(frame, [0, EXIT_DUR], [0, 1], {
    ...clampOpts,
    easing: exitEasing,
  });
  const fromScale = flat
    ? 1
    : interpolate(frame, [0, EXIT_DUR], [1, 1.06], {
        ...clampOpts,
        easing: exitEasing,
      });

  const local = frame - NEW_START;
  const toOpacity = interpolate(local, [0, ENTER_DUR], [0, 1], {
    ...clampOpts,
    easing: enterEasing,
  });
  const toBlur = interpolate(local, [0, ENTER_DUR], [2, 0], {
    ...clampOpts,
    easing: enterEasing,
  });
  // The whole point of band 2: land on 1 early, on a curve that actually
  // arrives, instead of easing in asymptotically for the rest of the beat.
  const toScale = flat
    ? 1
    : interpolate(local, [0, SHORT_SCALE_DUR], [0.9, 1], {
        ...clampOpts,
        easing: Easing.out(Easing.cubic),
      });

  return (
    <>
      <Word text={fromText} opacity={fromOpacity} scale={fromScale} blur={fromBlur} />
      <Word text={toText} opacity={toOpacity} scale={toScale} blur={toBlur} />
    </>
  );
};

// ---------------------------------------------------------------------------
// One band: its own slow push-in, promoted the way the demos promote it now,
// clipped to its row. The zoom reads the composition frame, not a Sequence's,
// so it never resets at a word change. Each band is a separate layer on
// purpose — a repaint in one must not be able to disturb another.
// ---------------------------------------------------------------------------
const BAND_H = 158;
const BAND_TOPS = [22, 194, 366, 538];

const Band: React.FC<{
  index: number;
  label: string;
  children: React.ReactNode;
}> = ({ index, label, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, JITTER_CHECK_DURATION], [1, 1.02]);
  return (
    <div
      style={{
        position: "absolute",
        top: BAND_TOPS[index],
        left: 0,
        right: 0,
        height: BAND_H,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale})`,
          willChange: "transform",
        }}
      >
        {children}
        {/* Geometry reference — this never quantizes, so any shimmer of the
            letters against it is the artifact under test. */}
        <div
          style={{
            position: "absolute",
            left: 210,
            right: 210,
            top: BAND_H / 2 + 56,
            height: 1,
            background: RULE,
          }}
        />
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

const BANDS: { label: string; render: (from: string, to: string) => React.ReactNode }[] = [
  {
    label: "as shipped",
    render: (from, to) => (
      <SharedAxisZ
        fromText={from}
        toText={to}
        fontSize={WORD_SIZE}
        fontWeight={400}
        color={INK}
        speed={SPEED}
      />
    ),
  },
  {
    label: "short tail",
    render: (from, to) => <AxisVariant fromText={from} toText={to} mode="short" />,
  },
  {
    label: "opacity only",
    render: (from, to) => <AxisVariant fromText={from} toText={to} mode="opacity" />,
  },
  {
    label: "hard cut",
    render: (from, to) => <AxisVariant fromText={from} toText={to} mode="cut" />,
  },
];

export const JitterCheckDemo: React.FC = () => (
  <AbsoluteFill
    style={
      {
        // SharedAxisZ reads its face from this var, so band 1 has to be given
        // the same Inter every hand-written band uses, or the reel would be
        // comparing two typefaces instead of two easings.
        "--font-geist-sans": SANS_FAMILY,
        background: BG,
      } as React.CSSProperties
    }
  >
    {BANDS.map((band, bi) => (
      <Band key={band.label} index={bi} label={band.label}>
        {WORDS.map((word, i) => (
          <Sequence
            key={word}
            from={i * BEAT}
            durationInFrames={BEAT}
            layout="none"
          >
            {band.render(i === 0 ? "" : WORDS[i - 1], word)}
          </Sequence>
        ))}
      </Band>
    ))}
  </AbsoluteFill>
);
