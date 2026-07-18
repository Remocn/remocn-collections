import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  CARD,
  FAINT,
  HAIRLINE,
  INK,
  MONO,
  MUTED,
  SANS,
  SURFACE,
  TEAL_SOFT,
  clampOpts,
} from "./theme";

// The real CLI flow and its real output lines — init creates the schema,
// generate builds the client. Two commands is the whole getting started.
const CMD_1 = "npx prisma init";
const OUT_1 = "Your Prisma schema was created at prisma/schema.prisma";
const CMD_2 = "npx prisma generate";
const OUT_2 = "Generated Prisma Client";

const T1_START = 8; // first command starts typing
const CHARS_PER_F = 1.4;
const T1_TYPED = T1_START + Math.ceil(CMD_1.length / CHARS_PER_F);
const OUT1_IN = T1_TYPED + 8;
const T2_START = OUT1_IN + 14;
const T2_TYPED = T2_START + Math.ceil(CMD_2.length / CHARS_PER_F);
const OUT2_IN = T2_TYPED + 8;
const CTA_IN = OUT2_IN + 26;

const CheckLine: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 8], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 10,
        opacity: p,
        transform: `translateY(${(1 - p) * 6}px)`,
      }}
    >
      <span style={{ color: TEAL_SOFT, fontSize: 15 }}>✔</span>
      <span style={{ color: MUTED }}>{text}</span>
    </div>
  );
};

const CmdLine: React.FC<{
  text: string;
  start: number;
  showCaret?: boolean;
}> = ({ text, start, showCaret = false }) => {
  const frame = useCurrentFrame();
  const n = Math.max(
    0,
    Math.min(text.length, Math.floor((frame - start) * CHARS_PER_F)),
  );
  const typing = n < text.length;
  const caretOn = typing || Math.floor(frame / 15) % 2 === 0;
  const opacity = interpolate(frame, [start - 3, start], [0, 1], clampOpts);
  return (
    <div style={{ opacity, whiteSpace: "nowrap" }}>
      <span style={{ color: FAINT }}>$ </span>
      <span style={{ color: INK }}>{text.slice(0, n)}</span>
      {(typing || showCaret) && (
        <span
          style={{
            display: "inline-block",
            width: 9,
            height: 17,
            marginLeft: 2,
            verticalAlign: "-3px",
            background: caretOn ? MUTED : "transparent",
          }}
        />
      )}
    </div>
  );
};

/**
 * Getting started — the hook to action. Two real commands type themselves,
 * the real CLI answers, then the card yields the stage to the one place to
 * go: prisma.io.
 */
export const GettingStarted: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const cardIn = interpolate(frame, [0, 14], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  // Once both commands have landed, the card lifts and quiets — the CTA
  // takes the frame.
  const handoff = interpolate(frame, [CTA_IN - 4, CTA_IN + 14], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });

  const ctaP = interpolate(frame, [CTA_IN, CTA_IN + 16], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const ctaBlur = interpolate(frame, [CTA_IN, CTA_IN + 12], [8, 0], clampOpts);

  const exitP = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames - 2],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - exitP,
        filter: exitP > 0 ? `blur(${exitP * 6}px)` : undefined,
      }}
    >
      {/* The terminal card */}
      <div
        style={{
          width: 640,
          padding: "22px 26px",
          borderRadius: 14,
          border: `1px solid ${HAIRLINE}`,
          background: CARD,
          boxShadow: "0 1px 0 rgba(249,249,251,0.04) inset",
          fontFamily: MONO,
          fontSize: 16.5,
          lineHeight: 2.1,
          opacity: cardIn * (1 - handoff * 0.55),
          transform: `translateY(${(1 - cardIn) * 18 - handoff * 132}px) scale(${1 - handoff * 0.06})`,
        }}
      >
        {/* window chrome */}
        <div
          style={{
            display: "flex",
            gap: 7,
            marginBottom: 14,
            opacity: 0.55,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: SURFACE,
                border: `1px solid ${HAIRLINE}`,
              }}
            />
          ))}
        </div>
        <CmdLine text={CMD_1} start={T1_START} />
        <CheckLine text={OUT_1} at={OUT1_IN} />
        <div style={{ height: 10 }} />
        <CmdLine
          text={CMD_2}
          start={T2_START}
          showCaret={frame >= T2_START && frame < CTA_IN - 6}
        />
        <CheckLine text={OUT_2} at={OUT2_IN} />
      </div>

      {/* The action — where to go. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 478,
          display: "flex",
          justifyContent: "center",
          opacity: ctaP,
          transform: `translateY(${(1 - ctaP) * 14}px)`,
          filter: `blur(${ctaBlur}px)`,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 44,
            color: INK,
          }}
        >
          Start at <span style={{ color: TEAL_SOFT }}>prisma.io</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const GETTING_STARTED_CTA_IN = CTA_IN;
