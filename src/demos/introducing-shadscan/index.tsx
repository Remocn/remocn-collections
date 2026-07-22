import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";

import { asciiDissolve } from "@/components/remocn/ascii-dissolve";
import { pushThrough } from "@/components/remocn/push-through";
import { whipPan } from "@/components/remocn/whip-pan";
import { focusPull } from "@/components/remocn/focus-pull";

import {
  BG,
  BODY,
  FAINT,
  GH_BG,
  GH_BORDER,
  GH_KEY,
  GH_MUTED,
  GH_RED,
  GH_STR,
  GH_TEXT,
  HAIRLINE_SOFT,
  HEADING,
  INK,
  MONO,
  MUTED,
  OUTFIT,
  RED,
  WINDOW,
  clampOpts,
} from "./theme";
import { ShadscanMarkDraw } from "./logo";
import { TerminalScene } from "./terminal";

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap the adjacent scenes.
// ---------------------------------------------------------------------------
const S_HOOK = 166;
const T_ASCII = 70; // ascii-dissolve, text mode — the signature turn
const S_INTRO = 140;
const T_PUSH = 18; // push-through — the dive into the product
const S_TERM = 556; // one continuous terminal session (scan → handoff → rescan)
const T_WHIP = 14; // whip-pan left — enumeration travel
const S_GATE = 205;
const T_FP = 16; // focus-pull — settle into the outro
const S_CTA = 170;

export const INTRODUCING_SHADSCAN_DURATION =
  S_HOOK +
  S_INTRO +
  S_TERM +
  S_GATE +
  S_CTA -
  (T_ASCII + T_PUSH + T_WHIP + T_FP);

// ---------------------------------------------------------------------------
// Shared chrome
// ---------------------------------------------------------------------------

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(115% 115% at 50% 44%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.42) 100%)",
      pointerEvents: "none",
    }}
  />
);

/** Per-word soft blur+rise entrance, measured for Outfit. */
const Words: React.FC<{
  text: string;
  start: number;
  size?: number;
  weight?: number;
  color?: string;
  stagger?: number;
  family?: string;
  accentWord?: string;
  accentColor?: string;
}> = ({
  text,
  start,
  size = 56,
  weight = 500,
  color = INK,
  stagger = 3,
  family = HEADING,
  accentWord,
  accentColor = RED,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.28em",
        maxWidth: 1100,
        padding: "0 40px",
      }}
    >
      {words.map((w, i) => {
        const t = interpolate(frame - start - i * stagger, [0, 12], [0, 1], {
          ...clampOpts,
          easing: Easing.out(Easing.cubic),
        });
        const isAccent = accentWord !== undefined && w.includes(accentWord);
        return (
          <span
            key={`${w}-${i}`}
            style={{
              fontFamily: family,
              fontWeight: weight,
              fontSize: size,
              color: isAccent ? accentColor : color,
              opacity: t,
              transform: `translateY(${(1 - t) * 14}px)`,
              filter: t < 1 ? `blur(${(1 - t) * 6}px)` : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ===========================================================================
// Frame 1 — Hook: "It looks right. / It feels done. / It ships broken."
// ===========================================================================
const HOOK_LINES = [
  { text: "It looks right.", start: 6, end: 32 },
  { text: "It feels done.", start: 38, end: 64 },
  { text: "It ships broken.", start: 70, end: Infinity, accent: "broken." },
];

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {HOOK_LINES.map((l, i) => {
        const exit =
          l.end !== Infinity
            ? interpolate(frame, [l.end - 6, l.end + 2], [0, 1], clampOpts)
            : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 1 - exit,
              transform: `translateY(${exit * -12}px)`,
              filter: exit > 0 ? `blur(${exit * 6}px)` : undefined,
            }}
          >
            <Words text={l.text} start={l.start} accentWord={l.accent} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ===========================================================================
// Frame 2 — Meet shadscan: mark draw-on + wordmark + the site's own H1.
// The headline sits dead-center and static: the ascii-dissolve text-mode
// transition resolves it (its enterText spec mirrors this exactly).
// ===========================================================================
export const INTRO_HEADLINE = "Meet shadscan";

const IntroScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, calc(-50% - 148px))",
        }}
      >
        <ShadscanMarkDraw size={84} delay={42} />
      </div>
      <span
        style={{
          fontFamily: HEADING,
          fontWeight: 400,
          fontSize: 76,
          color: INK,
        }}
      >
        {INTRO_HEADLINE}
      </span>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(58px)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Words
          text="Deterministic UI audits for shadcn apps"
          start={64}
          size={27}
          weight={400}
          color={MUTED}
          stagger={3}
        />
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Frame 5 — The gate: the deterministic score, as a GitHub Action that fails
// the merge. The workflow file you add → the check it enforces on a PR.
// (shadscan.com/docs#github-action)
// ===========================================================================

/** GitHub's red failing-check glyph — a filled circle with an ✕. */
const XMark: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "0 0 auto",
      width: size,
      height: size,
      borderRadius: 999,
      background: GH_RED,
      color: GH_BG,
      fontSize: size * 0.56,
      fontWeight: 700,
      lineHeight: 1,
    }}
  >
    ✕
  </span>
);

const GateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = (start: number, dur = 10) =>
    interpolate(frame - start, [0, dur], [0, 1], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    });

  const fileIn = spring({
    frame: frame - 20,
    fps,
    config: { damping: 17, stiffness: 130, mass: 0.85 },
  });
  const checkIn = spring({
    frame: frame - 74,
    fps,
    config: { damping: 17, stiffness: 130, mass: 0.85 },
  });
  const failIn = rise(90);
  const mergeIn = rise(110);
  const closing = rise(134, 12);

  // YAML rows, tinted like GitHub's editor.
  const yaml: React.ReactNode[] = [
    <>
      <span style={{ color: GH_KEY }}>steps</span>
      <span style={{ color: GH_MUTED }}>:</span>
    </>,
    <>
      <span style={{ color: GH_MUTED }}>{"  - "}</span>
      <span style={{ color: GH_KEY }}>uses</span>
      <span style={{ color: GH_MUTED }}>: </span>
      <span style={{ color: INK }}>TheOrcDev/shadscan@main</span>
    </>,
    <>
      <span style={{ color: GH_MUTED }}>{"    "}</span>
      <span style={{ color: GH_KEY }}>with</span>
      <span style={{ color: GH_MUTED }}>:</span>
    </>,
    <>
      <span style={{ color: GH_MUTED }}>{"      "}</span>
      <span style={{ color: GH_KEY }}>fail-under</span>
      <span style={{ color: GH_MUTED }}>: </span>
      <span style={{ color: GH_STR }}>"80"</span>
    </>,
  ];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 88,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Words
          text="Same source. Same score."
          start={8}
          size={44}
          stagger={4}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          transform: "translateY(24px)",
        }}
      >
        {/* the workflow file */}
        <div
          style={{
            width: 560,
            borderRadius: 10,
            border: `1px solid ${HAIRLINE_SOFT}`,
            background: WINDOW,
            overflow: "hidden",
            opacity: Math.min(1, fileIn * 1.2),
            transform: `translateY(${interpolate(fileIn, [0, 1], [16, 0])}px)`,
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              borderBottom: `1px solid ${HAIRLINE_SOFT}`,
              fontFamily: MONO,
              fontSize: 12.5,
              color: FAINT,
            }}
          >
            .github/workflows/shadscan.yml
          </div>
          <div
            style={{
              padding: "12px 18px 14px",
              fontFamily: MONO,
              fontSize: 14.5,
              lineHeight: "25px",
              whiteSpace: "pre",
            }}
          >
            {yaml.map((row, i) => (
              <div
                key={i}
                style={{
                  opacity: rise(34 + i * 5),
                  transform: `translateY(${(1 - rise(34 + i * 5)) * 5}px)`,
                }}
              >
                {row}
              </div>
            ))}
          </div>
        </div>

        {/* the check it enforces on the PR */}
        <div
          style={{
            width: 560,
            borderRadius: 10,
            border: `1px solid ${GH_BORDER}`,
            background: GH_BG,
            overflow: "hidden",
            opacity: Math.min(1, checkIn * 1.2),
            transform: `translateY(${interpolate(checkIn, [0, 1], [16, 0])}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "13px 18px",
            }}
          >
            <span style={{ opacity: failIn }}>
              <XMark size={20} />
            </span>
            <div style={{ flex: 1 }}>
              <div
                style={{ fontFamily: MONO, fontSize: 14.5, color: GH_TEXT }}
              >
                shadscan / audit
              </div>
              <div
                style={{
                  fontFamily: BODY,
                  fontSize: 13,
                  color: GH_MUTED,
                  opacity: failIn,
                }}
              >
                score 71 · required 80
              </div>
            </div>
            <span
              style={{
                fontFamily: BODY,
                fontSize: 13.5,
                color: GH_RED,
                opacity: failIn,
              }}
            >
              Failing
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 18px",
              borderTop: `1px solid ${GH_BORDER}`,
              background: "rgba(248,81,73,0.09)",
              opacity: mergeIn,
            }}
          >
            <XMark size={16} />
            <span
              style={{ fontFamily: BODY, fontSize: 14, color: GH_RED }}
            >
              Merge blocked — required check failing
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 74,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: closing,
          transform: `translateY(${(1 - closing) * 10}px)`,
        }}
      >
        <span
          style={{
            fontFamily: BODY,
            fontWeight: 400,
            fontSize: 22,
            color: MUTED,
          }}
        >
          Regressions don't merge.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Frame 6 — CTA: the lockup, the one command, the URL.
// ===========================================================================
const CTA_CMD = "pnpm dlx @shadscan/cli@next";

const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wordIn = spring({
    frame: frame - 26,
    fps,
    config: { damping: 15, stiffness: 110, mass: 0.9 },
  });
  const typed = Math.max(
    0,
    Math.min(CTA_CMD.length, Math.floor((frame - 62) / 1.15)),
  );
  const typedDone = typed >= CTA_CMD.length;
  const caretOn = Math.floor(frame / 15) % 2 === 0;
  // The prompt line (and its caret) only arrives when it is time to type —
  // no caret idling on a bare "$" while the lockup settles.
  const cmdIn = interpolate(frame - 56, [0, 10], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const urlIn = interpolate(frame - 118, [0, 14], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: "translateY(-46px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <ShadscanMarkDraw size={70} delay={8} />
          <span
            style={{
              fontFamily: HEADING,
              fontWeight: 500,
              fontSize: 66,
              color: INK,
              opacity: Math.min(1, wordIn * 1.2),
              transform: `translateX(${interpolate(wordIn, [0, 1], [-18, 0])}px)`,
              filter: wordIn < 1 ? `blur(${(1 - wordIn) * 7}px)` : undefined,
            }}
          >
            shadscan
          </span>
        </div>
        <div
          style={{
            marginTop: 48,
            fontFamily: MONO,
            fontSize: 21,
            color: INK,
            whiteSpace: "pre",
            opacity: cmdIn,
            transform: `translateY(${(1 - cmdIn) * 6}px)`,
          }}
        >
          <span style={{ color: FAINT }}>$ </span>
          {CTA_CMD.slice(0, typed)}
          <span
            style={{
              display: "inline-block",
              width: "0.55em",
              height: "1.05em",
              marginLeft: 2,
              verticalAlign: "text-bottom",
              background: INK,
              opacity: typedDone && !caretOn ? 0 : 1,
            }}
          />
        </div>
      </div>
      <span
        style={{
          position: "absolute",
          bottom: 58,
          fontFamily: MONO,
          fontSize: 17,
          color: MUTED,
          opacity: urlIn,
          transform: `translateY(${(1 - urlIn) * 8}px)`,
        }}
      >
        shadscan.com
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Composition root
// ===========================================================================
const asciiTurn = () =>
  asciiDissolve({
    cellSize: 12,
    colorBack: BG,
    colorFront: "rgba(250,250,250,0.55)",
    accentColor: "rgba(74,222,128,0.7)",
    accentDensity: 0.04,
    fontFamily: MONO,
    enterStyle: "clearing",
    enterText: {
      text: INTRO_HEADLINE,
      fontSize: 76,
      fontFamily: `${OUTFIT}, sans-serif`,
      fontWeight: 400,
      color: INK,
    },
  });

export const IntroducingShadscanDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          background: BG,
          ["--font-geist-sans" as string]: HEADING,
          ["--font-geist-mono" as string]: MONO,
        } as React.CSSProperties
      }
    >
      <TransitionSeries>
        {/* 1 — Hook */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_ASCII })}
          presentation={asciiTurn()}
        />

        {/* 2 — Meet shadscan */}
        <TransitionSeries.Sequence durationInFrames={S_INTRO}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PUSH })}
          presentation={pushThrough()}
        />

        {/* 3+4 — The terminal session (scan → handoff → rescan) */}
        <TransitionSeries.Sequence durationInFrames={S_TERM}>
          <TerminalScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_WHIP })}
          presentation={whipPan({ direction: "left" })}
        />

        {/* 5 — The gate */}
        <TransitionSeries.Sequence durationInFrames={S_GATE}>
          <GateScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 6 — CTA */}
        <TransitionSeries.Sequence durationInFrames={S_CTA}>
          <CtaScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Vignette />
    </AbsoluteFill>
  );
};

export default IntroducingShadscanDemo;
