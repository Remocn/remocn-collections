import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming, type TransitionPresentation, type TransitionPresentationComponentProps } from "@remotion/transitions";
import { loadFont as loadCalSans } from "@remotion/google-fonts/CalSans";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadJetMono } from "@remotion/google-fonts/JetBrainsMono";

import { GramotionWarp } from "./gramotion-warp";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";
import { pushThrough } from "@/components/remocn/push-through";
import { focusPull } from "@/components/remocn/focus-pull";

// Gramotion speaks in three voices, exactly as gramotion.video pairs them:
// Cal Sans for the headings, Plus Jakarta Sans for the body, JetBrains Mono
// for the timeline register. Cal Sans ships one weight only — 400 everywhere.
const { fontFamily: HEADING_FAMILY } = loadCalSans("normal", {
  subsets: ["latin"],
  weights: ["400"],
});
const { fontFamily: BODY_FAMILY } = loadJakarta("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});
const { fontFamily: MONO_FAMILY } = loadJetMono("normal", {
  subsets: ["latin"],
  weights: ["400"],
});

const HEADING = `${HEADING_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const BODY = `${BODY_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

// Palette lifted from gramotion.video itself: #0a0a0a body background,
// #fafafa ink, #a1a1a1 muted copy, #ff6825 the single orange accent that
// also dots the wordmark.
const BG = "#0a0a0a";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.62)";
const FAINT = "rgba(250,250,250,0.4)";
const ORANGE = "#ff6825";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK = 66; //     "Say hello to my new sponsor"
const S_REVEAL = 100; //  gramotion wordmark + orange dot + tagline
const S_FEATURES = 90; // line-by-line value stack
const S_COUNT = 70; //    1,200 waitlist count-up
const S_CTA = 64; //      "Be there at the first frame"
const S_LOCKUP = 120; //  Remocn ✕ gramotion + gramotion.video

// How it works — the site's own three-step flow, cut into hard beats.
const STEPS = [
  {
    name: "Design",
    blurb: "Shapes, text, images and video on one canvas",
  },
  {
    name: "Animate",
    blurb: "Drag a bar on the timeline, no keyframes to wrangle",
  },
  {
    name: "Export",
    blurb: "MP4 or GIF in seconds",
  },
];
const STEP_DURS = [56, 56, 66];
const S_STEPS = STEP_DURS.reduce((a, b) => a + b, 0);

const T_PT = 16; // push-through
const T_FP = 16; // focus-pull
const T_X = 14; //  crossfade

export const SPONSOR_GRAMOTION_DURATION =
  S_HOOK +
  S_REVEAL +
  S_STEPS +
  S_FEATURES +
  S_COUNT +
  S_CTA +
  S_LOCKUP -
  (T_PT + T_FP + T_X + T_FP + T_X + T_PT);

// Global frame where the lockup scene enters — the timecode bows out here.
const LOCKUP_START = SPONSOR_GRAMOTION_DURATION - S_LOCKUP;

// ---------------------------------------------------------------------------
// Slow camera drift — every scene rides a barely-there push-in so no frame
// is ever static. durationInFrames is Sequence-scoped inside TransitionSeries.
// ---------------------------------------------------------------------------
const Drift: React.FC<{ children: React.ReactNode; grow?: number }> = ({
  children,
  grow = 0.035,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1 + grow]);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Per-word rise — each word resolves out of blur while rising onto the
// baseline. The body voice of the spot, in Plus Jakarta Sans.
// ---------------------------------------------------------------------------
const WordsRise: React.FC<{
  text: string;
  fontSize: number;
  color?: string;
  delay?: number;
  stagger?: number;
  fontFamily?: string;
}> = ({
  text,
  fontSize,
  color = INK,
  delay = 0,
  stagger = 3,
  fontFamily = BODY,
}) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
  const words = text.split(" ");
  return (
    <span
      style={{
        fontFamily,
        fontWeight: 400,
        fontSize,
        color,
        lineHeight: 1.3,
      }}
    >
      {words.map((word, i) => {
        const local = frame - delay - i * stagger;
        const p = interpolate(local, [0, 24], [0, 1], {
          ...clampOpts,
          easing: ease,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: p,
              transform: `translateY(${(1 - p) * 24}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 9}px)` : undefined,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
};

// ===========================================================================
// Scene 1 — Hook. The family line resolves out of a soft blur.
// ===========================================================================
const HookScene: React.FC = () => (
  <Drift>
    <AbsoluteFill style={{ padding: "0 90px" }}>
      <SoftBlurIn
        text="Say hello to my new sponsor"
        fontSize={54}
        fontWeight={400}
        color={INK}
        blur={14}
      />
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 2 — Reveal. The gramotion wordmark resolves out of depth, its orange
// dot springs in last, and the tagline settles tight beneath.
// ===========================================================================
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [4, 34], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 1], [1.12, 1]);

  const dot = spring({
    frame: frame - 32,
    fps,
    config: { damping: 12, stiffness: 170, mass: 0.7 },
  });
  const dotOpacity = interpolate(frame, [32, 42], [0, 1], clampOpts);

  return (
    <Drift>
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 10 }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span
            style={{
              fontFamily: HEADING,
              fontWeight: 400,
              fontSize: 116,
              lineHeight: 1,
              color: INK,
              opacity: p,
              transform: `scale(${scale})`,
              filter: p < 1 ? `blur(${(1 - p) * 20}px)` : undefined,
              whiteSpace: "nowrap",
            }}
          >
            gramotion
          </span>
          <span
            style={{
              fontFamily: HEADING,
              fontWeight: 400,
              fontSize: 116,
              lineHeight: 1,
              color: ORANGE,
              opacity: dotOpacity,
              display: "inline-block",
              transform: `scale(${interpolate(dot, [0, 1], [0.2, 1])})`,
              transformOrigin: "50% 80%",
            }}
          >
            .
          </span>
        </div>
        <WordsRise
          text="Create stunning motion graphics"
          fontSize={27}
          color={MUTED}
          delay={40}
        />
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 3 — How it works. The site's three-step flow cut into hard beats,
// each visualized as a tiny live piece of the Gramotion editor itself:
// a canvas being designed, a timeline bar being dragged, an export running.
// gramotion.video ships no illustrations, so the spot draws its own.
// ===========================================================================
const STEP_STARTS = STEP_DURS.map((_, i) =>
  STEP_DURS.slice(0, i).reduce((a, b) => a + b, 0),
);

// A small pointer cursor, shared by the canvas and timeline vignettes.
const Cursor: React.FC<{ x: number; y: number; opacity?: number }> = ({
  x,
  y,
  opacity = 1,
}) => (
  <svg
    width="17"
    height="18"
    viewBox="0 0 17 18"
    style={{ position: "absolute", left: x, top: y, opacity }}
  >
    <path
      d="M1 1 L1 14 L4.8 10.7 L7.2 16 L9.8 14.8 L7.4 9.7 L12.4 9.3 Z"
      fill="#fafafa"
      stroke="rgba(10,10,10,0.65)"
      strokeWidth="1"
    />
  </svg>
);

const PANEL_W = 470;
const PANEL_H = 200;

const panelStyle: React.CSSProperties = {
  position: "relative",
  width: PANEL_W,
  height: PANEL_H,
  borderRadius: 14,
  border: "1px solid rgba(250,250,250,0.12)",
  background: "rgba(22,19,18,0.6)",
  overflow: "hidden",
};

// 01 Design — shapes drop onto a canvas, the cursor flies in and a selection
// frame with corner handles lands around the orange one.
const DesignIllustration: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const ease = Easing.out(Easing.cubic);

  const rectS = spring({
    frame: frame - 8,
    fps,
    config: { damping: 13, stiffness: 180, mass: 0.7 },
  });
  const rectO = interpolate(frame, [8, 14], [0, 1], clampOpts);
  const circS = spring({
    frame: frame - 15,
    fps,
    config: { damping: 13, stiffness: 180, mass: 0.7 },
  });
  const circO = interpolate(frame, [15, 21], [0, 1], clampOpts);
  const line1 = interpolate(frame, [21, 31], [0, 1], {
    ...clampOpts,
    easing: ease,
  });
  const line2 = interpolate(frame, [24, 34], [0, 1], {
    ...clampOpts,
    easing: ease,
  });

  // The cursor flies to the rectangle; the selection lands when it arrives.
  const cur = interpolate(frame, [18, 30], [0, 1], {
    ...clampOpts,
    easing: ease,
  });
  const curX = interpolate(cur, [0, 1], [416, 168]);
  const curY = interpolate(cur, [0, 1], [176, 130]);
  const sel = interpolate(frame, [30, 37], [0, 1], {
    ...clampOpts,
    easing: ease,
  });

  const handles: Array<[number, number]> = [
    [-4, -4],
    [78, -4],
    [-4, 78],
    [78, 78],
  ];

  return (
    <div style={panelStyle}>
      {/* Orange rounded square */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 58,
          width: 64,
          height: 64,
          borderRadius: 12,
          background: ORANGE,
          opacity: rectO,
          transform: `scale(${interpolate(rectS, [0, 1], [0.5, 1])})`,
        }}
      />
      {/* Muted circle */}
      <div
        style={{
          position: "absolute",
          left: 208,
          top: 66,
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "rgba(250,250,250,0.72)",
          opacity: circO,
          transform: `scale(${interpolate(circS, [0, 1], [0.5, 1])})`,
        }}
      />
      {/* Two text lines */}
      <div
        style={{
          position: "absolute",
          left: 306,
          top: 74,
          width: 108,
          height: 11,
          borderRadius: 5.5,
          background: "rgba(250,250,250,0.4)",
          opacity: line1,
          transform: `translateY(${(1 - line1) * 10}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 306,
          top: 95,
          width: 72,
          height: 11,
          borderRadius: 5.5,
          background: "rgba(250,250,250,0.22)",
          opacity: line2,
          transform: `translateY(${(1 - line2) * 10}px)`,
        }}
      />
      {/* Selection frame + corner handles around the square */}
      <div
        style={{
          position: "absolute",
          left: 87,
          top: 49,
          width: 82,
          height: 82,
          border: `1.5px solid ${ORANGE}`,
          borderRadius: 4,
          opacity: sel,
        }}
      >
        {handles.map(([hx, hy], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: hx,
              top: hy,
              width: 8,
              height: 8,
              borderRadius: 2,
              background: INK,
              border: `1.5px solid ${ORANGE}`,
            }}
          />
        ))}
      </div>
      <Cursor x={curX} y={curY} opacity={interpolate(frame, [18, 22], [0, 1], clampOpts)} />
    </div>
  );
};

// 02 Animate — timeline tracks assemble, the cursor drags the orange bar
// longer while the playhead sweeps across, exactly the site's promise:
// drag a bar, no keyframes.
const TIMELINE_BARS = [
  {
    label: "Pop in",
    x: 70,
    y: 52,
    w: 118,
    bg: ORANGE,
    text: "#0a0a0a",
    in: 6,
  },
  {
    label: "Slide up",
    x: 112,
    y: 94,
    w: 150,
    bg: "rgba(250,250,250,0.22)",
    text: "rgba(250,250,250,0.78)",
    in: 10,
  },
  {
    label: "Float in",
    x: 152,
    y: 136,
    w: 122,
    bg: "rgba(250,250,250,0.12)",
    text: "rgba(250,250,250,0.55)",
    in: 14,
  },
];

const TimelineIllustration: React.FC<{ frame: number }> = ({ frame }) => {
  const ease = Easing.out(Easing.cubic);
  const dragP = interpolate(frame, [24, 40], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const dragW = 62 * dragP;
  const playX = interpolate(frame, [18, 54], [70, 408], clampOpts);
  const playO = interpolate(frame, [18, 24], [0, 1], clampOpts);

  return (
    <div style={panelStyle}>
      {/* Ruler */}
      {["0s", "1s", "2s", "3s", "4s"].map((t, i) => (
        <span
          key={t}
          style={{
            position: "absolute",
            left: 70 + i * 85,
            top: 14,
            fontFamily: MONO,
            fontSize: 11,
            color: FAINT,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {t}
        </span>
      ))}
      {/* Animation bars */}
      {TIMELINE_BARS.map((bar, i) => {
        const p = interpolate(frame, [bar.in, bar.in + 10], [0, 1], {
          ...clampOpts,
          easing: ease,
        });
        const grow = i === 0 ? dragW : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: bar.x,
              top: bar.y,
              width: bar.w + grow,
              height: 24,
              borderRadius: 6,
              background: bar.bg,
              opacity: p,
              transform: `translateX(${(1 - p) * -14}px)`,
              display: "flex",
              alignItems: "center",
              paddingLeft: 9,
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 11,
                color: bar.text,
                whiteSpace: "nowrap",
              }}
            >
              {bar.label}
            </span>
          </div>
        );
      })}
      {/* Playhead */}
      <div
        style={{
          position: "absolute",
          left: playX,
          top: 34,
          width: 1.5,
          height: 146,
          background: "rgba(250,250,250,0.65)",
          opacity: playO,
        }}
      />
      <svg
        width="11"
        height="8"
        viewBox="0 0 11 8"
        style={{ position: "absolute", left: playX - 4.5, top: 28, opacity: playO }}
      >
        <polygon points="0,0 11,0 5.5,8" fill="rgba(250,250,250,0.8)" />
      </svg>
      {/* Cursor rides the orange bar's right edge during the drag */}
      <Cursor
        x={TIMELINE_BARS[0].x + TIMELINE_BARS[0].w + dragW - 4}
        y={60}
        opacity={interpolate(frame, [20, 24, 46, 52], [0, 1, 1, 0], clampOpts)}
      />
    </div>
  );
};

// 03 Export — the render runs: a progress bar fills with a mono readout,
// then the two shipped files resolve beneath it.
const ExportIllustration: React.FC<{ frame: number }> = ({ frame }) => {
  const ease = Easing.out(Easing.cubic);
  const fill = interpolate(frame, [6, 28], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const files = [
    { name: "launch-video.mp4", in: 30 },
    { name: "launch-video.gif", in: 36 },
  ];
  return (
    <div style={panelStyle}>
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 38,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 13,
          color: FAINT,
        }}
      >
        launch-video.gram
      </span>
      {/* Progress track + fill + readout */}
      <div
        style={{
          position: "absolute",
          left: (PANEL_W - 320) / 2 - 20,
          top: 78,
          width: 320,
          height: 6,
          borderRadius: 3,
          background: "rgba(250,250,250,0.12)",
        }}
      >
        <div
          style={{
            width: 320 * fill,
            height: 6,
            borderRadius: 3,
            background: ORANGE,
          }}
        />
      </div>
      <span
        style={{
          position: "absolute",
          left: (PANEL_W - 320) / 2 + 312,
          top: 71,
          fontFamily: MONO,
          fontSize: 13,
          color: MUTED,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.round(fill * 100)}
      </span>
      {/* Shipped files */}
      {files.map((file, i) => {
        const p = interpolate(frame, [file.in, file.in + 10], [0, 1], {
          ...clampOpts,
          easing: ease,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 112 + i * 30,
              display: "flex",
              justifyContent: "center",
              gap: 10,
              opacity: p,
              transform: `translateY(${(1 - p) * 10}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 14, color: ORANGE }}>
              ✓
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 14,
                color: "rgba(250,250,250,0.85)",
              }}
            >
              {file.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const STEP_ILLUSTRATIONS = [
  DesignIllustration,
  TimelineIllustration,
  ExportIllustration,
];

const StepsScene: React.FC = () => {
  const frame = useCurrentFrame();
  let active = 0;
  for (let i = 0; i < STEP_STARTS.length; i++) {
    if (frame >= STEP_STARTS[i]) active = i;
  }
  const local = frame - STEP_STARTS[active];
  const p = interpolate(local, [0, 9], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 1], [1.06, 1]);
  const step = STEPS[active];
  const Illustration = STEP_ILLUSTRATIONS[active];
  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
            opacity: p,
            transform: `scale(${scale})`,
            filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
          }}
        >
          <Illustration frame={local} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: HEADING,
                fontWeight: 400,
                fontSize: 54,
                lineHeight: 1.05,
                color: INK,
                whiteSpace: "nowrap",
              }}
            >
              {step.name}
            </span>
            <span
              style={{
                fontFamily: BODY,
                fontWeight: 400,
                fontSize: 20,
                color: MUTED,
                whiteSpace: "nowrap",
              }}
            >
              {step.blurb}
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 4 — Value stack. Four short feature lines slide in line by line and
// hold as one compact block.
// ===========================================================================
const FeaturesScene: React.FC = () => (
  <Drift>
    <AbsoluteFill>
      <LineByLineSlide
        text={
          "Figma-like canvas\nOne-click animations\nText animations\nSmart auto layout"
        }
        fontSize={46}
        fontWeight={400}
        color={INK}
      />
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 5 — Proof. A plain count-up to 1,200 in tabular figures, the caption
// tight beneath. No plus-suffix, in the series' count-up tradition.
// ===========================================================================
const CountScene: React.FC = () => {
  const frame = useCurrentFrame();
  const count = interpolate(frame, [4, 46], [0, 1200], {
    ...clampOpts,
    easing: Easing.out(Easing.poly(3)),
  });
  return (
    <Drift>
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 4 }}
      >
        <span
          style={{
            fontFamily: HEADING,
            fontWeight: 400,
            fontSize: 168,
            lineHeight: 1,
            color: INK,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(count)}
        </span>
        <WordsRise
          text="already on the waitlist"
          fontSize={25}
          color={MUTED}
          delay={18}
        />
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 6 — CTA. The site's own closing line, resolving alone.
// ===========================================================================
const CtaScene: React.FC = () => (
  <Drift>
    <AbsoluteFill style={{ padding: "0 90px" }}>
      <SoftBlurIn
        text="Be there at the first frame"
        fontSize={54}
        fontWeight={400}
        color={INK}
        blur={14}
      />
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 7 — Lockup. Remocn ✕ gramotion glides together from both sides,
// dead-center, nothing else on screen.
// ===========================================================================
const LockupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ease = Easing.out(Easing.cubic);

  const sideP = interpolate(frame, [6, 30], [0, 1], {
    ...clampOpts,
    easing: ease,
  });
  const leftX = (1 - sideP) * -70;
  const rightX = (1 - sideP) * 70;
  const sideBlur = (1 - sideP) * 12;

  const cross = spring({
    frame: frame - 26,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.8 },
  });
  const crossOpacity = interpolate(frame, [26, 38], [0, 1], clampOpts);

  return (
    <Drift grow={0.05}>
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <span
            style={{
              fontFamily: HEADING,
              fontWeight: 400,
              fontSize: 64,
              color: INK,
              opacity: sideP,
              transform: `translateX(${leftX}px)`,
              filter: sideBlur > 0.2 ? `blur(${sideBlur}px)` : undefined,
              whiteSpace: "nowrap",
            }}
          >
            Remocn
          </span>
          <span
            style={{
              fontFamily: BODY,
              fontWeight: 400,
              fontSize: 42,
              color: FAINT,
              opacity: crossOpacity,
              transform: `scale(${interpolate(cross, [0, 1], [0.4, 1])})`,
            }}
          >
            ✕
          </span>
          <span
            style={{
              fontFamily: HEADING,
              fontWeight: 400,
              fontSize: 64,
              color: INK,
              opacity: sideP,
              transform: `translateX(${rightX}px)`,
              filter: sideBlur > 0.2 ? `blur(${sideBlur}px)` : undefined,
              whiteSpace: "nowrap",
            }}
          >
            gramotion<span style={{ color: ORANGE }}>.</span>
          </span>
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Persistent timecode — the spot wears the product's own timeline register:
// a quiet JetBrains Mono readout ticking along the bottom edge, fading in
// after the hook and out before the lockup. Plain text, not a badge.
// ===========================================================================
const Timecode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ss = String(Math.floor(frame / fps)).padStart(2, "0");
  const ff = String(frame % fps).padStart(2, "0");
  const opacity = interpolate(
    frame,
    [S_HOOK + 4, S_HOOK + 24, LOCKUP_START - 14, LOCKUP_START + 6],
    [0, 1, 1, 0],
    clampOpts,
  );
  return (
    <div
      style={{
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: MONO,
        fontWeight: 400,
        fontSize: 15,
        color: "rgba(250,250,250,0.3)",
        fontVariantNumeric: "tabular-nums",
        opacity,
      }}
    >
      00:00:{ss}:{ff}
    </div>
  );
};

// ===========================================================================
// Transition presentations.
// ===========================================================================
type EmptyProps = Record<string, never>;

const Crossfade: React.FC<TransitionPresentationComponentProps<EmptyProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const entering = presentationDirection === "entering";
  const opacity = entering ? presentationProgress : 1 - presentationProgress;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
const crossfade = (): TransitionPresentation<EmptyProps> => ({
  component: Crossfade,
  props: {},
});

// ===========================================================================
// Composition root. One persistent warp shader carries the whole video — the
// paper.design checks preset in Gramotion's warm family, pushed back by a
// vignette so it textures the dark instead of competing with it. Cal Sans is
// wired into the remocn text components via the shared font var.
// ===========================================================================
export const SponsorGramotionDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-geist-sans": HEADING_FAMILY,
          background: BG,
        } as React.CSSProperties
      }
    >
      {/* Persistent warp backdrop — checks shape, Gramotion warm family. */}
      <GramotionWarp />
      {/* Vignette scrim — keeps the warp a texture, not a subject. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 42%, rgba(10,8,7,0.72) 0%, rgba(10,8,7,0.94) 100%)",
        }}
      />

      <TransitionSeries>
        {/* 1 — Hook */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PT })}
          presentation={pushThrough()}
        />

        {/* 2 — gramotion reveal */}
        <TransitionSeries.Sequence durationInFrames={S_REVEAL}>
          <RevealScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 3 — How it works: Design / Animate / Export */}
        <TransitionSeries.Sequence durationInFrames={S_STEPS}>
          <StepsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 4 — Value stack */}
        <TransitionSeries.Sequence durationInFrames={S_FEATURES}>
          <FeaturesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 5 — 1200 count-up */}
        <TransitionSeries.Sequence durationInFrames={S_COUNT}>
          <CountScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 6 — CTA */}
        <TransitionSeries.Sequence durationInFrames={S_CTA}>
          <CtaScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PT })}
          presentation={pushThrough()}
        />

        {/* 7 — Lockup + URL */}
        <TransitionSeries.Sequence durationInFrames={S_LOCKUP}>
          <LockupScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Timecode />
    </AbsoluteFill>
  );
};
