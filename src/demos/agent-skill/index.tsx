import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";
import { LogoEnter, SAMPLE_LOGOS } from "@/components/remocn/logo-enter";

import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";
import { ShaderSmokeRing } from "@/components/remocn/shader-smoke-ring";

// ---------------------------------------------------------------------------
// The changelog cut for the 2026-06-25 "The remocn agent skill" entry. Built
// in the introducing-remocn world (shared simplex-noise field, obsidian + one
// lime accent, Manrope 400, the new-logo smoke-ring outro), debuting one new
// registry transition: catalog-riffle (the agent thumbing the catalog).
// ---------------------------------------------------------------------------

const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700", "800"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

// The shipped remocn.dev brand: warm obsidian + one lime accent.
const OBSIDIAN = "#141318";
const INK = "#f2f2f2";
const MUTED = "rgba(242,242,242,0.62)";
const FAINT = "rgba(242,242,242,0.4)";
const DIM = "rgba(242,242,242,0.24)";
const LIME = "#C3E88D";
const LIME_SOFT = "rgba(195,232,141,0.14)";
const LIME_LINE = "rgba(195,232,141,0.4)";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @30fps). Transitions overlap. Paced slow on purpose —
// every beat holds long enough to read.
// ---------------------------------------------------------------------------
const S_ASK = 110; //          the prompt types itself
const S_GUESS = 120; //        the agent guesses (wrong tries cycle)
const S_MEET = 110; //         "The remocn skill" (plays its own exit)
const S_TEACH = 140; //        three catalog rows accumulate
const S_ANSWER = 150; //       the same ask, now composing a scene
const S_WORKS = 140; //        works with your AI — logo-enter
const S_INSTALL_ALL = 110; //  the install-all button
const S_VALUE = 120; //        three value lines
const S_CMD = 120; //          npx skills add Remocn/remocn
const S_OUTRO = 160; //        smoke ring → R mark → wordmark

const T_X = 22; //             crossfade
const T_BLUR = 26; //          blur crossfade
const T_RIFFLE = 74; //        catalog-riffle cover (lingers before scene B)

// ===========================================================================
// The remocn mark — inlined from introducing-remocn's OutroScene so this cut
// closes on the exact same new-logo lockup.
// ===========================================================================
const MARK_VIEWBOX = "0 0 124.06 134.26";
const MARK_RATIO = 124.06 / 134.26;
const MARK_PATH =
  "M 0.01 0.81 C 0.01 1.73, 0.36 2.79, 1.09 4.13 C 4.91 11.04, 13.45 17.16, 21.7 18.9 C 22.94 19.16, 23.18 19.16, 51.39 19.27 C 76.07 19.36, 80.02 19.4, 81.32 19.57 C 89.89 20.69, 96.2 24.68, 99.38 31.01 C 103.19 38.56, 102.53 50.1, 97.91 57.07 C 94.66 61.96, 89.68 64.99, 83.26 66 C 82.81 66.07, 70.18 66.83, 55.2 67.69 C 24.82 69.43, 27.03 69.23, 24.18 70.4 C 19.9 72.15, 14.84 75.7, 10.65 79.89 C 4.86 85.68, 1.3 91.91, 0.25 98.13 C 0.12 98.85, 0.08 103.13, 0.04 116.66 L 0 134.26 9.5 134.26 L 19 134.26 19.05 119.41 C 19.1 103.27, 19.08 103.82, 19.82 101.04 C 21.79 93.65, 27.86 88.75, 36.45 87.63 C 37.23 87.53, 39.41 87.5, 43.57 87.53 C 50.12 87.59, 50.75 87.65, 53.22 88.45 C 56.61 89.56, 59.67 91.86, 62.02 95.07 C 62.52 95.76, 69.35 103.85, 77.2 113.07 C 85.04 122.28, 91.63 130.04, 91.85 130.32 C 92.07 130.59, 92.5 131.34, 92.82 131.97 C 93.52 133.35, 94.11 133.93, 95.06 134.13 C 95.5 134.23, 98.97 134.26, 106.36 134.23 L 117.01 134.19 100.82 113.07 C 91.91 101.45, 84.52 91.78, 84.39 91.57 C 83.36 89.89, 83.66 87.53, 85.09 86 C 85.79 85.25, 86.36 84.94, 88.07 84.38 C 96.18 81.72, 104.15 76.62, 109.97 70.36 C 120.59 58.93, 124.06 44.32, 119.44 30.43 C 114.59 15.81, 101.93 4.02, 87.64 0.83 C 83.93 0.01, 88.09 0.08, 41.85 0.04 L 0.01 0 0.01 0.81 Z";

const RemocnMark: React.FC<{ size: number; draw?: number; fill?: number }> = ({
  size,
  draw = 1,
  fill = 1,
}) => (
  <svg
    viewBox={MARK_VIEWBOX}
    width={size * MARK_RATIO}
    height={size}
    style={{ display: "block", color: INK, overflow: "visible" }}
  >
    <path
      d={MARK_PATH}
      pathLength={1}
      fill="currentColor"
      fillOpacity={fill}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
      strokeDasharray={1}
      strokeDashoffset={1 - draw}
    />
  </svg>
);

// Readability scrim over a backdrop shader.
const Scrim: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 120% at 50% 42%, rgba(20,19,24,${
        0.3 * strength
      }) 0%, rgba(20,19,24,${0.78 * strength}) 100%)`,
    }}
  />
);

// A blinking mono block caret (deterministic).
const Caret: React.FC<{ frame: number; height?: number; on?: boolean }> = ({
  frame,
  height = 26,
  on,
}) => {
  const blink = on ?? Math.floor(frame / 15) % 2 === 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: 12,
        height,
        marginLeft: 4,
        verticalAlign: "-4px",
        background: blink ? MUTED : "transparent",
      }}
    />
  );
};

// ===========================================================================
// Scene 1 — The ask. The prompt every remocn user now makes, typed live.
// ===========================================================================
const PROMPT = "make me an intro scene";

const AskScene: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = Math.max(0, Math.min(PROMPT.length, Math.floor((frame - 10) * 0.85)));
  const done = typed >= PROMPT.length;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: MONO, fontSize: 34, color: INK }}>
        <span style={{ color: FAINT }}>$ </span>
        {PROMPT.slice(0, typed)}
        <Caret frame={frame} height={30} on={done ? undefined : true} />
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 2 — The guess. Where the answer should be, the agent churns wrong
// tries, one per beat — the stall is the pain.
// ===========================================================================
const GUESSES = ["blur-in?", "fade?", "…slide?", "which one?"];
const GUESS_HOLD = 26;

const GuessScene: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(GUESSES.length - 1, Math.floor(frame / GUESS_HOLD));
  const local = frame - idx * GUESS_HOLD;
  const inP = interpolate(local, [0, 7], [0, 1], clampOpts);
  const outP =
    idx < GUESSES.length - 1
      ? interpolate(local, [GUESS_HOLD - 7, GUESS_HOLD], [0, 1], clampOpts)
      : 0;
  const opacity = inP * (1 - outP);
  const y = interpolate(inP, [0, 1], [10, 0]) + outP * -10;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 30,
            color: MUTED,
            marginBottom: 26,
          }}
        >
          Your agent used to guess
        </div>
        <div style={{ height: 52, position: "relative" }}>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 40,
              color: DIM,
              opacity,
              transform: `translateY(${y}px)`,
              display: "inline-block",
            }}
          >
            {GUESSES[idx]}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 3 — Meet the skill. Lands out of the catalog-riffle, plays its own
// exit so the next beat starts clean.
// ===========================================================================
const MeetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exitP = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 4],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 74,
          letterSpacing: "-0.03em",
          color: INK,
          opacity: 1 - exitP,
          transform: `translateY(${exitP * -10}px) scale(${1 - exitP * 0.05})`,
          filter: `blur(${exitP * 6}px)`,
        }}
      >
        The remocn skill
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 4 — What it teaches. Three mono catalog rows accumulate.
// ===========================================================================
const TEACH_ROWS = [
  "which components exist",
  "what each one is for",
  "how to compose them",
];

const TeachScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {TEACH_ROWS.map((row, i) => {
          const start = 14 + i * 30;
          const p = interpolate(frame, [start, start + 14], [0, 1], {
            ...clampOpts,
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={row}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: p,
                transform: `translateX(${(1 - p) * -18}px)`,
              }}
            >
              <span style={{ color: LIME, fontFamily: MONO, fontSize: 26 }}>
                ›
              </span>
              <span style={{ fontFamily: MONO, fontSize: 30, color: INK }}>
                {row}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 5 — The ask, answered. The same prompt now composes a real scene: a
// framed mini-intro assembles while the components that built it tick in.
// ===========================================================================
const BUILT_WITH = ["scale-down-fade", "shader-warp", "logo-enter"];

const MiniScene: React.FC<{ frame: number }> = ({ frame }) => {
  // The mini-scene's own tiny timeline (local to this beat).
  const bg = interpolate(frame, [36, 66], [0, 1], clampOpts);
  const titleP = interpolate(frame, [64, 86], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const markSettle = interpolate(frame, [90, 116], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        width: 372,
        height: 209,
        borderRadius: 14,
        border: `1px solid ${LIME_LINE}`,
        overflow: "hidden",
        position: "relative",
        background: OBSIDIAN,
      }}
    >
      {/* the "shader field" filling in */}
      <AbsoluteFill
        style={{
          opacity: bg * 0.9,
          background:
            "linear-gradient(120deg, #1f1d29 0%, #413d56 55%, #C3E88D 140%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 40%, rgba(20,19,24,0.2), rgba(20,19,24,0.72))",
        }}
      />
      {/* the composed title */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 30,
            letterSpacing: "-0.03em",
            color: INK,
            opacity: titleP,
            transform: `scale(${interpolate(titleP, [0, 1], [1.08, 1])})`,
          }}
        >
          Your title
        </span>
      </AbsoluteFill>
      {/* a tiny lockup dot in the corner */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 18,
          width: 14,
          height: 14,
          borderRadius: 4,
          background: LIME,
          opacity: markSettle,
          transform: `scale(${interpolate(markSettle, [0, 1], [0.4, 1])})`,
        }}
      />
    </div>
  );
};

const AnswerScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 20,
            color: MUTED,
            marginBottom: 22,
          }}
        >
          <span style={{ color: FAINT }}>$ </span>
          {PROMPT}
          <span style={{ color: LIME, marginLeft: 12 }}>✓</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 34,
          }}
        >
          <MiniScene frame={frame} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {BUILT_WITH.map((name, i) => {
              const start = 40 + i * 20;
              const p = interpolate(frame, [start, start + 12], [0, 1], {
                ...clampOpts,
                easing: Easing.out(Easing.cubic),
              });
              return (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    opacity: p,
                    transform: `translateX(${(1 - p) * 14}px)`,
                  }}
                >
                  <span style={{ color: LIME, fontSize: 16 }}>✓</span>
                  <span style={{ fontFamily: MONO, fontSize: 19, color: MUTED }}>
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 6 — Works with your AI. The skill runs inside every agent — the AI
// company marks spring in via the logo-enter component.
// ===========================================================================
const WorksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const headP = interpolate(frame, [4, 22], [0, 1], {
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
          gap: 46,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 58,
            letterSpacing: "-0.03em",
            color: INK,
            opacity: headP,
            transform: `translateY(${(1 - headP) * 10}px)`,
          }}
        >
          Works with your AI
        </span>
        <div style={{ position: "relative", width: 640, height: 150 }}>
          <Sequence from={22}>
            <LogoEnter
              logos={SAMPLE_LOGOS}
              diameter={116}
              overlap={36}
              ringColor="#fff"
              stagger={9}
            />
          </Sequence>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 7 — Add one, or add them all. A components-page fragment; a lime
// install-all button lands and one sweep checks every row.
// ===========================================================================
const PAGE_ROWS = ["typewriter", "glass-code-walk", "shader-warp", "logo-enter"];

const InstallAllScene: React.FC = () => {
  const frame = useCurrentFrame();
  const btnP = interpolate(frame, [18, 38], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const press = interpolate(frame, [52, 60], [0, 1], clampOpts);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 460,
          borderRadius: 16,
          border: `1px solid rgba(242,242,242,0.1)`,
          background: "rgba(255,255,255,0.02)",
          padding: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: 20, color: INK }}>
            Components
          </span>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 15,
              color: OBSIDIAN,
              background: LIME,
              borderRadius: 9,
              padding: "7px 14px",
              opacity: btnP,
              transform: `scale(${interpolate(press, [0, 1], [1, 0.95])})`,
            }}
          >
            Install all
          </div>
        </div>
        {PAGE_ROWS.map((name, i) => {
          const checkAt = 62 + i * 9;
          const c = interpolate(frame, [checkAt, checkAt + 9], [0, 1], {
            ...clampOpts,
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "11px 4px",
                borderTop: i === 0 ? "none" : "1px solid rgba(242,242,242,0.07)",
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 17, color: MUTED }}>
                {name}
              </span>
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  border: `1px solid ${c > 0.5 ? LIME : "rgba(242,242,242,0.2)"}`,
                  background: c > 0.5 ? LIME : "transparent",
                  color: OBSIDIAN,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {c > 0.5 ? "✓" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 8 — The value. Three claims accumulate as a block.
// ===========================================================================
const ValueScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={24}>
      <LineByLineSlide
        text={
          "Your agent builds with remocn\nA catalog it can read\nThe code is still yours"
        }
        fontSize={44}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 9 — Get the skill. The setup command types itself.
// ===========================================================================
const CMD_HEAD = "npx skills add ";
const CMD_SLUG = "Remocn/remocn";

const CmdScene: React.FC = () => {
  const frame = useCurrentFrame();
  const full = CMD_HEAD + CMD_SLUG;
  const typed = Math.max(0, Math.min(full.length, Math.floor((frame - 12) * 1.0)));
  const done = typed >= full.length;
  const opacity = interpolate(frame, [4, 12], [0, 1], clampOpts);
  const headShown = Math.min(typed, CMD_HEAD.length);
  const slugShown = typed > CMD_HEAD.length ? typed - CMD_HEAD.length : 0;
  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", opacity }}
    >
      <span style={{ fontFamily: MONO, fontSize: 28, color: MUTED }}>
        <span style={{ color: FAINT }}>$ </span>
        <span>{CMD_HEAD.slice(0, headShown)}</span>
        <span style={{ color: LIME }}>{CMD_SLUG.slice(0, slugShown)}</span>
        <Caret frame={frame} height={26} on={done ? undefined : true} />
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 10 — Outro. Inherited verbatim from introducing-remocn's new-logo
// lockup: a smoke ring blooms, the R draws itself on, "emocn" slides out.
// ===========================================================================
const WORD_TAIL = "emocn";
const WORD_SIZE = 92;
const WORD_TRACKING = -0.03;
const MARK_SIZE = 66;

const measureTail = (): number => {
  const fallback = WORD_TAIL.length * WORD_SIZE * 0.55;
  if (typeof document === "undefined") return fallback;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.font = `400 ${WORD_SIZE}px ${SANS_FAMILY}, sans-serif`;
  return (
    ctx.measureText(WORD_TAIL).width +
    WORD_TAIL.length * WORD_TRACKING * WORD_SIZE +
    2
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tailWidth = React.useMemo(measureTail, []);

  const ringRadius = interpolate(frame, [6, 56], [0.03, 0.19], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  const markDraw = interpolate(frame, [24, 58], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const markFill = interpolate(frame, [50, 68], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const markSettle = spring({
    frame: frame - 24,
    fps,
    config: { damping: 16, stiffness: 90, mass: 0.9 },
  });
  const markScale = interpolate(markSettle, [0, 1], [0.92, 1]);

  const slideIn = Math.min(
    1,
    spring({
      frame: frame - 70,
      fps,
      config: { damping: 18, stiffness: 90, mass: 1 },
    }),
  );

  const creditOpacity = interpolate(frame, [116, 134], [0, 1], clampOpts);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: OBSIDIAN,
      }}
    >
      <AbsoluteFill style={{ opacity: 0.7 }}>
        <ShaderSmokeRing
          speed={0.8}
          colorBack={OBSIDIAN}
          colors={["#33323d", "#525b40"]}
          radius={ringRadius}
          thickness={0.4}
          scale={0.85}
        />
      </AbsoluteFill>
      <Scrim strength={0.55} />
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 0,
          transform: "translateY(-14px)",
          position: "relative",
        }}
      >
        <div
          style={{
            transform: `scale(${markScale})`,
            transformOrigin: "50% 100%",
            marginBottom: Math.round(WORD_SIZE * 0.115),
          }}
        >
          <RemocnMark size={MARK_SIZE} draw={markDraw} fill={markFill} />
        </div>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            width: slideIn * tailWidth,
            height: WORD_SIZE,
          }}
        >
          <span
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              whiteSpace: "nowrap",
              lineHeight: 1,
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: WORD_SIZE,
              letterSpacing: `${WORD_TRACKING}em`,
              color: INK,
            }}
          >
            {WORD_TAIL}
          </span>
        </div>
      </div>

      <span
        style={{
          position: "absolute",
          bottom: 42,
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 19,
          color: FAINT,
          opacity: creditOpacity,
        }}
      >
        Open source · remocn.dev
      </span>
    </AbsoluteFill>
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
        transform: `scale(${0.94 + p * 0.06})`,
        filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
      }
    : {
        opacity: 1 - p,
        transform: `scale(${1 + p * 0.08})`,
        filter: p > 0 ? `blur(${p * 12}px)` : undefined,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const blurFade = (): TransitionPresentation<EmptyProps> => ({
  component: BlurFade,
  props: {},
});

// ---------------------------------------------------------------------------
// NEW registry transition — catalog-riffle. The cut IS the agent thumbing the
// catalog: mono component rows riffle past, a lime cursor snaps onto one row
// and HOLDS there, then that row grows into the incoming scene.
// ---------------------------------------------------------------------------
const RIFFLE_NAMES = [
  "kinetic-center-build", "shader-warp", "glass-code-walk", "typewriter",
  "terminal-cursor-zoom", "logo-enter", "command-menu", "line-by-line-slide",
  "shader-smoke-ring", "rolling-number", "push-through", "whip-pan",
  "scale-down-fade", "message-bubble", "github-stars", "focus-pull",
  "short-slide-right", "claude-code", "number-wheel", "spotlight-card",
];
const RIFFLE_ROW_H = 46;
const RIFFLE_VIEW_ROWS = 9; // odd, so one row sits dead-center
const RIFFLE_VIEW_H = RIFFLE_ROW_H * RIFFLE_VIEW_ROWS;
const RIFFLE_COL_W = 560;
const RIFFLE_ROW_PAD = 30; // text gap from the lime cursor / left edge

const CatalogRiffle: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const p = presentationProgress;

  if (!entering) {
    // Outgoing scene simply fades out under the riffle.
    const opacity = interpolate(p, [0.06, 0.22], [1, 0], clampOpts);
    return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
  }

  // The riffle scrolls fast, decelerates, and snaps a row to center early —
  // then HOLDS the snapped row a long beat before the row grows into scene B.
  const rows = RIFFLE_NAMES.length;
  const scroll = interpolate(p, [0, 0.32], [0, rows * RIFFLE_ROW_H], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const riffleBlur = interpolate(p, [0, 0.26, 0.32], [11, 3, 0], clampOpts);
  const overlayOpacity = interpolate(
    p,
    [0, 0.1, 0.74, 0.9],
    [0, 1, 1, 0],
    clampOpts,
  );
  const snapped = p >= 0.3;

  // The selected center row grows into the incoming scene — delayed, so the
  // snapped catalog reads before scene B appears.
  const grow = interpolate(p, [0.72, 1], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  // Center-row band in % of the 1280×720 frame.
  const bandTop = ((360 - RIFFLE_ROW_H / 2) / 720) * 100; // ≈ 46.8%
  const sideMargin = ((1280 - RIFFLE_COL_W) / 2 / 1280) * 100; // ≈ 28.1%
  const insetTB = interpolate(grow, [0, 1], [bandTop, 0]);
  const insetLR = interpolate(grow, [0, 1], [sideMargin, 0]);
  const radius = interpolate(grow, [0, 1], [12, 0]);

  const childStyle: React.CSSProperties = {
    clipPath: `inset(${insetTB}% ${insetLR}% ${insetTB}% ${insetLR}% round ${radius}px)`,
    opacity: interpolate(p, [0.7, 0.8], [0, 1], clampOpts),
    transform: `scale(${interpolate(grow, [0, 1], [0.97, 1])})`,
  };

  return (
    <AbsoluteFill style={{ background: OBSIDIAN }}>
      {/* incoming scene, revealed as the selected row grows */}
      <AbsoluteFill style={childStyle}>{children}</AbsoluteFill>

      {/* the riffle overlay */}
      <AbsoluteFill
        style={{
          opacity: overlayOpacity,
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: RIFFLE_COL_W,
            height: RIFFLE_VIEW_H,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* the scrolling column of catalog rows */}
          <div
            style={{
              position: "absolute",
              top: RIFFLE_VIEW_H / 2 - RIFFLE_ROW_H / 2,
              left: 0,
              right: 0,
              paddingLeft: RIFFLE_ROW_PAD,
              transform: `translateY(${-scroll}px)`,
              filter: `blur(${riffleBlur}px)`,
            }}
          >
            {Array.from({ length: rows * 2 }).map((_, i) => {
              const name = RIFFLE_NAMES[i % rows];
              return (
                <div
                  key={i}
                  style={{
                    height: RIFFLE_ROW_H,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: MONO,
                    fontSize: 22,
                    color: MUTED,
                  }}
                >
                  {name}
                </div>
              );
            })}
          </div>

          {/* the lime cursor / selected-row highlight, fixed at center */}
          <div
            style={{
              position: "absolute",
              top: RIFFLE_VIEW_H / 2 - RIFFLE_ROW_H / 2,
              left: 0,
              right: 0,
              height: RIFFLE_ROW_H,
              background: LIME_SOFT,
              borderLeft: `3px solid ${LIME}`,
              borderRadius: 3,
              transform: `scaleY(${snapped ? 1.06 : 1})`,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const catalogRiffle = (): TransitionPresentation<EmptyProps> => ({
  component: CatalogRiffle,
  props: {},
});

// ===========================================================================
// Composition root.
// ===========================================================================
export const AGENT_SKILL_DURATION =
  S_ASK +
  S_GUESS +
  S_MEET +
  S_TEACH +
  S_ANSWER +
  S_WORKS +
  S_INSTALL_ALL +
  S_VALUE +
  S_CMD +
  S_OUTRO -
  (T_X + T_RIFFLE + T_BLUR + T_RIFFLE + T_X + T_BLUR + T_X + T_BLUR);

export const AgentSkillDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-geist-sans": SANS_FAMILY,
          background: OBSIDIAN,
        } as React.CSSProperties
      }
    >
      {/* One quiet simplex-noise field carries the whole video. */}
      <ShaderSimplexNoise
        speed={0.35}
        colors={["#141318", "#1a1922", "#232231"]}
        stepsPerColor={2}
        softness={0.8}
      />
      <Scrim strength={0.85} />

      <TransitionSeries>
        {/* 1 — The ask */}
        <TransitionSeries.Sequence durationInFrames={S_ASK}>
          <AskScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 2 — The guess */}
        <TransitionSeries.Sequence durationInFrames={S_GUESS}>
          <GuessScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_RIFFLE })}
          presentation={catalogRiffle()}
        />

        {/* 3 — Meet the skill (plays its own exit, hard cut into teach) */}
        <TransitionSeries.Sequence durationInFrames={S_MEET}>
          <MeetScene />
        </TransitionSeries.Sequence>

        {/* 4 — What it teaches */}
        <TransitionSeries.Sequence durationInFrames={S_TEACH}>
          <TeachScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 5 — The ask, answered */}
        <TransitionSeries.Sequence durationInFrames={S_ANSWER}>
          <AnswerScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_RIFFLE })}
          presentation={catalogRiffle()}
        />

        {/* 6 — Works with your AI */}
        <TransitionSeries.Sequence durationInFrames={S_WORKS}>
          <WorksScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 7 — Add one, or add them all */}
        <TransitionSeries.Sequence durationInFrames={S_INSTALL_ALL}>
          <InstallAllScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 8 — The value */}
        <TransitionSeries.Sequence durationInFrames={S_VALUE}>
          <ValueScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 9 — Get the skill (command) */}
        <TransitionSeries.Sequence durationInFrames={S_CMD}>
          <CmdScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 10 — Outro lockup */}
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
