import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  Series,
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

import { ScaleDownFade } from "@/components/remocn/scale-down-fade";
import { ShortSlideRight } from "@/components/remocn/short-slide-right";
import { KineticCenterBuild } from "@/components/remocn/kinetic-center-build";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";

import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";
import { ShaderSmokeRing } from "@/components/remocn/shader-smoke-ring";

// The release this changelog entry ships — the real components, performing.
import { ClaudeCode } from "@/components/remocn/claude-code";
import { ClaudeChat } from "@/components/remocn/claude-chat";
import { ChatGpt } from "@/components/remocn/chat-gpt";
import { OpenCode } from "@/components/remocn/opencode";
import { V0 } from "@/components/remocn/v0";
import { XFollowCard } from "@/components/remocn/x-follow-card";
import { XFollowersOverview } from "@/components/remocn/x-followers-overview";

// Bind Manrope to the CSS variable the remocn typography components read.
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
const LIME = "#C3E88D";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK = 80; //      "Every launch video has the same two shots"
// Both shot lines carry a 64f composer-send on one side, which eats most of
// the beat — they are budgeted to land, hold, and only then be submitted.
const S_SHOT1 = 116; //    "Someone prompting an AI"
const AI_BEAT = 66; //     one AI surface per hard cut
const S_SHOT2 = 116; //    "And a follower count going up"
const S_FOLLOW = 126; //   the X follow card + the click
const S_COUNT = 148; //    the count climbing + confetti
const S_PAYOFF = 84; //    "Now both of them are components"
const S_VALUE = 92; //     three value lines
const S_CMD = 104; //      npx shadcn add @remocn/…
const S_OUTRO = 160; //    smoke ring → R mark → wordmark

const T_X = 16; //         crossfade
const T_BLUR = 20; //      blur crossfade
const T_SEND = 64; //      composer-send (the prompt is submitted)

// The composer-send holds the incoming scene back until p ≈ 0.56 and clears
// the outgoing one by p ≈ 0.44, so the montage's first and last beats pay back
// the frames the transition covers — every surface gets the same visible time.
const AI_LEAD = Math.round(T_SEND * 0.56);
const AI_TAIL = Math.round(T_SEND * 0.44);

// ===========================================================================
// The remocn mark — the R letterform from remocn.dev/logo-mark.svg, inlined
// so the outro can draw it on: `draw` runs the outline (pathLength-normalized
// dashoffset), `fill` lets the solid letter catch up behind it.
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

// ===========================================================================
// The AI surfaces keep their own brands — Anthropic clay, OpenAI blue,
// OpenCode blue, v0 monochrome. Each product is recognizable as itself, which
// is the point of shipping branded simulators; the video's obsidian field and
// the mono caption are what hold the montage together, not a colour wash.
//
// The one intervention is legibility: `chat-gpt` is hardcoded to its LIGHT
// theme, so on obsidian its heading is dark-on-dark and its composer is a
// headlight. `invert(1) hue-rotate(180deg)` is the classic dark-mode pair —
// it flips luminance and puts the hues straight back, so ChatGPT reads as its
// own dark-mode surface (OpenAI blue intact) instead of a blown-out light one.
// ===========================================================================
const Surface: React.FC<{ children: React.ReactNode; invert?: boolean }> = ({
  children,
  invert = false,
}) => (
  <AbsoluteFill
    style={{
      filter: invert ? "invert(1) hue-rotate(180deg)" : undefined,
    }}
  >
    {children}
  </AbsoluteFill>
);

// The one mono caption under a performing surface — names the component and
// nothing else. Bottom offset stays on the 8px grid.
const SurfaceCaption: React.FC<{ name: string }> = ({ name }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [8, 20], [0, 1], clampOpts);
  const y = interpolate(frame, [8, 22], [8, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "flex-end" }}
      // 48px from the bottom edge — 6 × 8.
    >
      <span
        style={{
          marginBottom: 48,
          fontFamily: MONO,
          fontSize: 20,
          color: MUTED,
          opacity,
          transform: `translateY(${y}px)`,
        }}
      >
        {name}
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 1 — The hook. The entry's own thesis, alone on the field.
// ===========================================================================
const HookScene: React.FC = () => (
  <AbsoluteFill>
    <ScaleDownFade
      text="Every launch video has the same two shots"
      fontSize={52}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 / 4 — The two shots, named. Same motion for both, so the pair reads
// as a pair.
// ===========================================================================
const ShotScene: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill>
    <ShortSlideRight
      text={text}
      fontSize={50}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 3 — The five surfaces. Real components, typing themselves out, hard
// cut one into the next. Each runs fast enough to finish inside its beat.
// ===========================================================================
const AI_SPEED = 1.7;

type AiBeat = { name: string; node: React.ReactNode; invert?: boolean };

// Each surface keeps its own accent: Anthropic clay for the two Claude
// surfaces, OpenAI blue for ChatGPT, OpenCode's blue, and v0's monochrome.
// Only the content is ours.
const AI_BEATS: AiBeat[] = [
  {
    name: "claude-code",
    node: (
      <ClaudeCode
        prompt="make me a launch video"
        userName="remocn"
        cwd="~/remocn"
        speed={AI_SPEED}
      />
    ),
  },
  {
    name: "claude-chat",
    node: <ClaudeChat prompt="Draft a launch tweet" speed={AI_SPEED} />,
  },
  {
    name: "chat-gpt",
    node: <ChatGpt prompt="Write my launch post" speed={AI_SPEED} />,
    invert: true,
  },
  {
    name: "opencode",
    node: (
      <OpenCode
        query="add a hero scene"
        modelName="Opus 4.8"
        provider="Anthropic"
        speed={AI_SPEED}
      />
    ),
  },
  {
    name: "v0",
    node: <V0 prompt="Build a pricing page" speed={AI_SPEED} />,
  },
];

const S_AI = AI_BEATS.length * AI_BEAT + AI_LEAD + AI_TAIL;

const aiBeatDuration = (i: number): number =>
  AI_BEAT +
  (i === 0 ? AI_LEAD : 0) +
  (i === AI_BEATS.length - 1 ? AI_TAIL : 0);

const AiMontageScene: React.FC = () => (
  <AbsoluteFill>
    <Series>
      {AI_BEATS.map((beat, i) => (
        <Series.Sequence key={beat.name} durationInFrames={aiBeatDuration(i)}>
          <AbsoluteFill>
            <Surface invert={beat.invert}>{beat.node}</Surface>
            <SurfaceCaption name={beat.name} />
          </AbsoluteFill>
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 5 — The follow button. x-follow-card is a light surface by design and
// keeps it: X's own card, X's own blue. It sits scaled back on the dark field
// so it reads as a real card floating there rather than a full-bleed page.
// ===========================================================================
const FollowScene: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ transform: "scale(0.92) translateY(-16px)" }}>
      <XFollowCard
        name="remocn"
        handle="remocn"
        bio={"Cinematic video components for React.\nCopy, paste, own the code."}
        website="remocn.dev"
        location="Open source"
        // Empty string takes the component's offline gradient fallback —
        // no network fetch, no 404 for a missing avatar file.
        avatarUrl=""
        speed={1.4}
      />
    </AbsoluteFill>
    <SurfaceCaption name="x-follow-card" />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 6 — The count that climbs. The overview cycles its follow
// notifications, the total blurs in, and the component fires its own confetti
// on the frame the number lands.
// ===========================================================================
const FOLLOWERS = [
  { name: "shadcn", verified: true, handle: "shadcn", time: "now" },
  { name: "Remotion", verified: true, handle: "remotion", time: "1m" },
  { name: "Jonny Burger", verified: true, handle: "JNYBGR", time: "2m" },
  { name: "paper", verified: false, handle: "paper", time: "4m" },
  { name: "Vercel", verified: true, handle: "vercel", time: "6m" },
  { name: "Guillermo Rauch", verified: true, handle: "rauchg", time: "8m" },
];

const CountScene: React.FC = () => (
  <AbsoluteFill>
    {/* X's own blue, and the component's own confetti palette — the burst is
        the entry's payoff line ("for the moment the number lands"), so it gets
        to be the one loud moment in the video. */}
    <XFollowersOverview
      notifications={FOLLOWERS}
      totalFollowers={1709}
      handle="remocn"
      avatarUrl=""
      speed={1.15}
    />
    <SurfaceCaption name="x-followers-overview · confetti" />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 7 — The payoff. The loop the hook opened, closing word by word.
// ===========================================================================
const PayoffScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={16}>
      <KineticCenterBuild
        text="Now both of them are components"
        fontSize={56}
        fontWeight={400}
        color={INK}
        measureScale={1.16}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 8 — The value block.
// ===========================================================================
const ValueScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={16}>
      <LineByLineSlide
        text={
          "Five AI surfaces\nTwo social cards\nConfetti when the number lands"
        }
        fontSize={46}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 9 — The command. Types itself, then the slug rolodexes through the
// release — one command, any surface. A terminal line, never a pill.
// ===========================================================================
const CMD = "npx shadcn add @remocn/";
const PKG_NAMES = [
  "claude-code",
  "claude-chat",
  "chat-gpt",
  "opencode",
  "v0",
  "x-follow-card",
];
const CMD_START = 8;
const FLIP_START = 48;
const FLIP_PER = 18;
const FLIP_DUR = 9;
// The slug column is sized to the longest name so the line never reflows.
const SLUG_WIDTH = Math.max(...PKG_NAMES.map((n) => n.length));

const CmdScene: React.FC = () => {
  const frame = useCurrentFrame();

  const full = CMD + PKG_NAMES[0];
  const typed = Math.max(
    0,
    Math.min(full.length, Math.floor((frame - CMD_START) * 1.6)),
  );
  const visible = full.slice(0, typed);
  const cmdOpacity = interpolate(
    frame,
    [CMD_START - 4, CMD_START],
    [0, 1],
    clampOpts,
  );
  const typingDone = typed >= full.length;
  const caretOn = typingDone ? Math.floor(frame / 15) % 2 === 0 : true;
  const caretOpacity = interpolate(
    frame,
    [FLIP_START - 12, FLIP_START - 4],
    [1, 0],
    clampOpts,
  );
  const flipping = frame >= FLIP_START - 4;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: cmdOpacity,
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 28, color: MUTED }}>
        <span style={{ color: FAINT }}>$ </span>
        <span>{visible.slice(0, Math.min(typed, 15))}</span>
        <span style={{ color: LIME }}>
          {typed > 15 ? visible.slice(15, Math.min(typed, CMD.length)) : ""}
        </span>
        <span
          style={{
            display: "inline-block",
            width: `${SLUG_WIDTH}ch`,
            textAlign: "left",
            position: "relative",
            verticalAlign: "bottom",
            perspective: 420,
            color: LIME,
          }}
        >
          {/* Invisible sizer keeps the container's height and baseline. */}
          <span style={{ visibility: "hidden" }}>{PKG_NAMES[0]}</span>
          {!flipping ? (
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                whiteSpace: "nowrap",
              }}
            >
              {typed > CMD.length ? visible.slice(CMD.length) : ""}
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 28,
                  marginLeft: 3,
                  verticalAlign: "-4px",
                  background: caretOn ? MUTED : "transparent",
                  opacity: caretOpacity,
                }}
              />
            </span>
          ) : (
            PKG_NAMES.map((name, i) => {
              // The outgoing name clears first; the incoming one follows half
              // a flip later, so the two never sit on top of each other.
              const inStart = FLIP_START + (i - 1) * FLIP_PER + 4;
              const outStart = FLIP_START + i * FLIP_PER;

              let rotate = 0;
              let y = 0;
              let opacity = 1;

              if (i > 0) {
                const pIn = interpolate(
                  frame,
                  [inStart, inStart + FLIP_DUR],
                  [0, 1],
                  { ...clampOpts, easing: Easing.out(Easing.cubic) },
                );
                rotate = (1 - pIn) * -85;
                y = (1 - pIn) * 18;
                opacity = pIn;
              }
              if (i < PKG_NAMES.length - 1) {
                const pOut = interpolate(
                  frame,
                  [outStart, outStart + FLIP_DUR],
                  [0, 1],
                  { ...clampOpts, easing: Easing.in(Easing.cubic) },
                );
                rotate += pOut * 85;
                y -= pOut * 18;
                opacity *= 1 - pOut;
              }
              if (opacity <= 0.001) return null;

              return (
                <span
                  key={name}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    whiteSpace: "nowrap",
                    opacity,
                    transform: `translateY(${y}px) rotateX(${rotate}deg)`,
                    transformOrigin: "50% 50%",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {name}
                </span>
              );
            })
          )}
        </span>
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 10 — Outro. Inherited verbatim from introducing-remocn: a smoke ring
// blooms open, the R mark draws itself on, then "emocn" slides out from
// behind it — the mark IS the R, together they assemble the wordmark.
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
        Open source, all the way down
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// NEW registry transition — composer-send.
//
// The cut IS a prompt being submitted. The outgoing scene contracts
// rect-to-rect into a centered composer pill, as if the whole frame were the
// thing you just typed; the pill holds a beat with a lime caret, the send
// control fills lime and the pill presses down and releases — sent; then the
// pill expands back out to full frame and the incoming scene resolves inside
// it through a fast top-down streaming wipe, the way a response arrives.
//
// Timeline (presentationProgress p):
//   0.00 → 0.34  the frame contracts into the pill
//   0.34 → 0.44  the outgoing content compresses out; the typed line remains
//   0.44 → 0.56  send: the control fills lime, the pill presses 8px and releases
//   0.56 → 0.92  the pill expands back to full frame
//   0.60 → 1.00  the incoming scene streams in top-down inside it
// ===========================================================================
type EmptyProps = Record<string, never>;

const PILL_W = 560;
const PILL_H = 64;
const PILL_R = 32;

const CONTRACT_END = 0.34;
const COMPRESS_END = 0.44;
const SEND_START = 0.44;
const SEND_END = 0.56;
const EXPAND_START = 0.56;
const EXPAND_END = 0.92;

// The frame-as-viewport: children keep their full 1280×720 size and are simply
// cropped by a box that travels between full-frame and pill.
const CropFrame: React.FC<{
  w: number;
  h: number;
  radius: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ w, h, radius, children, style }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: w,
          height: h,
          borderRadius: radius,
          overflow: "hidden",
          position: "relative",
          ...style,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: (w - width) / 2,
            top: (h - height) / 2,
            width,
            height,
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ComposerSend: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const { width, height } = useVideoConfig();
  const p = presentationProgress;

  // The send press — a single 8px dip and release, on the grid.
  const press = interpolate(
    p,
    [SEND_START, SEND_START + 0.05, SEND_END],
    [0, 8, 0],
    { ...clampOpts, easing: Easing.inOut(Easing.quad) },
  );

  if (!entering) {
    // Outgoing: the frame contracts into the pill, then its content
    // compresses out, leaving the pill chrome to the entering layer.
    const c = interpolate(p, [0, CONTRACT_END], [0, 1], {
      ...clampOpts,
      easing: Easing.inOut(Easing.cubic),
    });
    const w = interpolate(c, [0, 1], [width, PILL_W]);
    const h = interpolate(c, [0, 1], [height, PILL_H]);
    const radius = interpolate(c, [0, 1], [0, PILL_R]);
    const contentOpacity = interpolate(
      p,
      [CONTRACT_END, COMPRESS_END],
      [1, 0],
      clampOpts,
    );

    return (
      <CropFrame
        w={w}
        h={h}
        radius={radius}
        style={{ transform: `translateY(${press}px)` }}
      >
        <AbsoluteFill style={{ opacity: contentOpacity }}>
          {children}
        </AbsoluteFill>
      </CropFrame>
    );
  }

  // Entering: the pill holds, sends, then expands back out with the response
  // streaming in top-down.
  const e = interpolate(p, [EXPAND_START, EXPAND_END], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const w = interpolate(e, [0, 1], [PILL_W, width]);
  const h = interpolate(e, [0, 1], [PILL_H, height]);
  const radius = interpolate(e, [0, 1], [PILL_R, 0]);

  // The response streams down the frame — a soft edge sweeping top to bottom.
  // The mask rides the CROP BOX, not the full-size children: the box is still
  // pill-height when the stream starts, and masking the children instead would
  // reveal a band that is cropped away, leaving the frame empty.
  const REVEAL = 0.58;
  const stream = interpolate(p, [REVEAL, 1], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const streamMask = `linear-gradient(to bottom, rgba(0,0,0,1) ${
    stream * 130 - 30
  }%, rgba(0,0,0,0) ${stream * 130}%)`;

  // Pill chrome — border, the typed line, the caret and the send control.
  // It is only real while the frame is small.
  // The chrome clears as the response starts streaming in behind it.
  const chromeOpacity = interpolate(
    p,
    [CONTRACT_END - 0.06, CONTRACT_END, EXPAND_START, REVEAL + 0.06],
    [0, 1, 1, 0],
    clampOpts,
  );
  // The typed line fills in while the frame is contracting, as if the outgoing
  // scene were being written into the composer.
  const lineFill = interpolate(p, [0.16, SEND_START], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const sendFill = interpolate(p, [SEND_START, SEND_START + 0.04], [0, 1], {
    ...clampOpts,
  });
  const caretOpacity = interpolate(p, [SEND_START, SEND_START + 0.03], [1, 0], {
    ...clampOpts,
  });

  return (
    <AbsoluteFill>
      <CropFrame
        w={w}
        h={h}
        radius={radius}
        style={{
          transform: `translateY(${press}px)`,
          opacity: p < REVEAL ? 0 : 1,
          WebkitMaskImage: stream < 1 ? streamMask : undefined,
          maskImage: stream < 1 ? streamMask : undefined,
        }}
      >
        {children}
      </CropFrame>

      {/* The composer itself, drawn over the pill-sized frame. */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: chromeOpacity,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: PILL_W,
            height: PILL_H,
            borderRadius: PILL_R,
            border: `1px solid rgba(242,242,242,0.16)`,
            background: "rgba(20,19,24,0.72)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingLeft: 24,
            paddingRight: 8,
            boxSizing: "border-box",
            transform: `translateY(${press}px)`,
          }}
        >
          {/* the prompt, written in as the frame collapses */}
          <div
            style={{
              flex: 1,
              height: 10,
              borderRadius: 5,
              background: `linear-gradient(to right, rgba(242,242,242,0.34) ${
                lineFill * 100
              }%, rgba(242,242,242,0.08) ${lineFill * 100}%)`,
            }}
          />
          <div
            style={{
              width: 2,
              height: 24,
              background: LIME,
              opacity: caretOpacity,
            }}
          />
          {/* the send control */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginLeft: 8,
              background: sendFill > 0 ? LIME : "rgba(242,242,242,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 19V5M12 5l-6 6M12 5l6 6"
                stroke={sendFill > 0 ? OBSIDIAN : "rgba(242,242,242,0.5)"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const composerSend = (): TransitionPresentation<EmptyProps> => ({
  component: ComposerSend,
  props: {},
});

// ---------------------------------------------------------------------------
// House-grammar transitions.
// ---------------------------------------------------------------------------
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

// ===========================================================================
// Composition root.
// ===========================================================================
export const AI_AND_SOCIAL_DURATION =
  S_HOOK +
  S_SHOT1 +
  S_AI +
  S_SHOT2 +
  S_FOLLOW +
  S_COUNT +
  S_PAYOFF +
  S_VALUE +
  S_CMD +
  S_OUTRO -
  (T_X + T_SEND + T_SEND + T_BLUR + T_X + T_BLUR + T_X + T_X + T_BLUR);

export const AiAndSocialDemo: React.FC = () => {
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
        {/* 1 — The hook */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 2 — Shot one, named */}
        <TransitionSeries.Sequence durationInFrames={S_SHOT1}>
          <ShotScene text="Someone prompting an AI" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_SEND })}
          presentation={composerSend()}
        />

        {/* 3 — The five surfaces */}
        <TransitionSeries.Sequence durationInFrames={S_AI}>
          <AiMontageScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_SEND })}
          presentation={composerSend()}
        />

        {/* 4 — Shot two, named */}
        <TransitionSeries.Sequence durationInFrames={S_SHOT2}>
          <ShotScene text="And a follower count going up" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 5 — The follow button */}
        <TransitionSeries.Sequence durationInFrames={S_FOLLOW}>
          <FollowScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 6 — The count that climbs */}
        <TransitionSeries.Sequence durationInFrames={S_COUNT}>
          <CountScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 7 — The payoff */}
        <TransitionSeries.Sequence durationInFrames={S_PAYOFF}>
          <PayoffScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 8 — The value block */}
        <TransitionSeries.Sequence durationInFrames={S_VALUE}>
          <ValueScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 9 — The command */}
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
