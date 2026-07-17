import React, { type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
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

import { RemocnUIProvider } from "@/lib/remocn-ui";
import { caretWipe } from "@/components/remocn/caret-wipe";
import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";
import { ShaderSmokeRing } from "@/components/remocn/shader-smoke-ring";

// The wave's cast — every effect appears in the montage animating its own name.
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { PerCharacterRise } from "@/components/remocn/per-character-rise";
import { BottomUpLetters } from "@/components/remocn/bottom-up-letters";
import { TopDownLetters } from "@/components/remocn/top-down-letters";
import { SpringScaleIn } from "@/components/remocn/spring-scale-in";
import { MicroScaleFade } from "@/components/remocn/micro-scale-fade";
import { MaskRevealUp } from "@/components/remocn/mask-reveal-up";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";
import { KineticCenterBuild } from "@/components/remocn/kinetic-center-build";
import { FocusBlurResolve } from "@/components/remocn/focus-blur-resolve";
import { BlurOutUp } from "@/components/remocn/blur-out-up";
import { ScaleDownFade } from "@/components/remocn/scale-down-fade";
import { FadeThrough } from "@/components/remocn/fade-through";
import { PerWordCrossfade } from "@/components/remocn/per-word-crossfade";
import { SharedAxisY } from "@/components/remocn/shared-axis-y";
import { SharedAxisZ } from "@/components/remocn/shared-axis-z";
import { ShortSlideDown } from "@/components/remocn/short-slide-down";
import { ShortSlideRight } from "@/components/remocn/short-slide-right";

// Manrope, bound to the CSS variable every remocn typography component reads.
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

// The shipped remocn.dev brand — warm obsidian + one lime accent. No
// letter-spacing, sentence case, weight 400 everywhere.
const OBSIDIAN = "#141318";
const INK = "#f2f2f2";
const MUTED = "rgba(242,242,242,0.62)";
const FAINT = "rgba(242,242,242,0.4)";
const LIME = "#C3E88D";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Readability scrim over the shared shader field.
const Scrim: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 120% at 50% 42%, rgba(20,19,24,${
        0.3 * strength
      }) 0%, rgba(20,19,24,${0.82 * strength}) 100%)`,
    }}
  />
);

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK = 70;
const S_WAVE = 74;
const S_MECH = 80;
const S_DET = 74;
const S_VALUE = 100;
const S_CMD = 104;
const S_OUTRO = 150;

const T_X = 14; //     crossfade
const T_CARET = 22; // caret-wipe (the new registry transition)
const T_BLUR = 16; //  blur crossfade

// ===========================================================================
// Intro — the hook and the promise.
// ===========================================================================
const HookScene: React.FC = () => (
  <AbsoluteFill>
    <SoftBlurIn
      text="Text is most of what a demo video says"
      fontSize={46}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

const WaveScene: React.FC = () => (
  <AbsoluteFill>
    <KineticCenterBuild
      text="18 new ways to make it move"
      fontSize={60}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// The montage — every effect introduced by animating its own name. The
// counter holds perfectly still while the effects change beneath it.
// ===========================================================================
const MONT_SIZE = 60;
const MONT_WEIGHT = 400;
const SPEED_MONT = 1.5;
const TOTAL_EFFECTS = 18;

type MontEffect = { name: string; dur: number; node: ReactNode };

const s = SPEED_MONT;

const ENTRANCES: MontEffect[] = [
  {
    name: "soft-blur-in",
    dur: 30,
    node: <SoftBlurIn text="Soft blur in" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "per-character-rise",
    dur: 36,
    node: <PerCharacterRise text="Per character rise" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "bottom-up-letters",
    dur: 34,
    node: <BottomUpLetters text="Bottom up letters" staggerDelay={2} fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "top-down-letters",
    dur: 34,
    node: <TopDownLetters text="Top down letters" staggerDelay={2} fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "spring-scale-in",
    dur: 28,
    node: <SpringScaleIn text="Spring scale in" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "micro-scale-fade",
    dur: 28,
    node: <MicroScaleFade text="Micro scale fade" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "mask-reveal-up",
    dur: 32,
    node: <MaskRevealUp text={"Mask reveal\nup"} fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "line-by-line-slide",
    dur: 36,
    node: <LineByLineSlide text={"Line by line\nslide"} fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "kinetic-center-build",
    dur: 36,
    node: <KineticCenterBuild text="Kinetic center build" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "focus-blur-resolve",
    dur: 34,
    node: <FocusBlurResolve text="Focus blur resolve" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
];

const SWAPS: MontEffect[] = [
  {
    name: "blur-out-up",
    dur: 32,
    node: <BlurOutUp text="Blur out up" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "scale-down-fade",
    dur: 32,
    node: <ScaleDownFade text="Scale down fade" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "fade-through",
    dur: 36,
    node: <FadeThrough fromText="Static text" toText="Fade through" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "per-word-crossfade",
    dur: 38,
    node: <PerWordCrossfade fromText="Word by word" toText="Per word crossfade" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "shared-axis-y",
    dur: 34,
    node: <SharedAxisY fromText="Outgoing" toText="Shared axis y" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "shared-axis-z",
    dur: 36,
    node: <SharedAxisZ fromText="Outgoing" toText="Shared axis z" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "short-slide-down",
    dur: 30,
    node: <ShortSlideDown text="Short slide down" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
  {
    name: "short-slide-right",
    dur: 30,
    node: <ShortSlideRight text="Short slide right" fontSize={MONT_SIZE} fontWeight={MONT_WEIGHT} color={INK} speed={s} />,
  },
];

const ENTR_TOTAL = ENTRANCES.reduce((a, e) => a + e.dur, 0);
const SWAP_TOTAL = SWAPS.reduce((a, e) => a + e.dur, 0);

// The still `NN / 18` counter — reads the montage-half's local frame and maps
// it to the active effect; the chrome never moves, only its value ticks.
const MontageCounter: React.FC<{ effects: MontEffect[]; baseIndex: number }> = ({
  effects,
  baseIndex,
}) => {
  const frame = useCurrentFrame();

  let active = 0;
  let acc = 0;
  for (let i = 0; i < effects.length; i++) {
    if (frame >= acc) active = i;
    acc += effects[i].dur;
  }
  const tag = effects[active];

  const vis = interpolate(frame, [0, 8], [0, 1], clampOpts);
  // The value settles with a soft fade (no movement) on each switch.
  let start = 0;
  for (let i = 0; i < active; i++) start += effects[i].dur;
  const valueOpacity = interpolate(frame - start, [0, 7], [0.4, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        bottom: 56,
        display: "flex",
        alignItems: "baseline",
        gap: 13,
        opacity: vis,
        fontFamily: SANS,
        color: MUTED,
      }}
    >
      <span
        style={{
          fontSize: 22,
          fontWeight: 500,
          fontVariantNumeric: "tabular-nums",
          opacity: valueOpacity,
        }}
      >
        {String(baseIndex + active + 1).padStart(2, "0")}
      </span>
      <span style={{ fontSize: 15, fontWeight: 400, color: FAINT }}>
        / {String(TOTAL_EFFECTS).padStart(2, "0")}
      </span>
      <span
        style={{ fontSize: 16, fontWeight: 400, color: MUTED, opacity: valueOpacity }}
      >
        {tag.name}
      </span>
    </div>
  );
};

const MontageScene: React.FC<{ effects: MontEffect[]; baseIndex: number }> = ({
  effects,
  baseIndex,
}) => (
  <AbsoluteFill>
    <Series>
      {effects.map((e) => (
        <Series.Sequence key={e.name} durationInFrames={e.dur}>
          {e.node}
        </Series.Sequence>
      ))}
    </Series>
    <MontageCounter effects={effects} baseIndex={baseIndex} />
  </AbsoluteFill>
);

// ===========================================================================
// The argument — why these are different (interpolate/spring, deterministic).
// ===========================================================================
const MechScene: React.FC = () => (
  <AbsoluteFill>
    <ShortSlideRight
      text="No CSS keyframes — just interpolate and spring"
      fontSize={44}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

const DeterministicScene: React.FC = () => (
  <AbsoluteFill>
    <SoftBlurIn
      text="Frame 40 looks the same on every render"
      fontSize={46}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

const ValueScene: React.FC = () => (
  <AbsoluteFill>
    <LineByLineSlide
      text={"Seek-safe by default\nOne import each\nThe code is yours"}
      fontSize={48}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// One command — the exact effect that opened the montage, installed live.
// A plain typed mono line (never a pill).
// ===========================================================================
const CMD_FULL = "npx shadcn add @remocn/soft-blur-in";
const PKG_AT = CMD_FULL.indexOf("@remocn/");
const CMD_START = 8;

const CommandScene: React.FC = () => {
  const frame = useCurrentFrame();

  const typed = Math.max(
    0,
    Math.min(CMD_FULL.length, Math.floor((frame - CMD_START) * 1.4)),
  );
  const visible = CMD_FULL.slice(0, typed);
  const done = typed >= CMD_FULL.length;
  const caretOn = done ? Math.floor(frame / 15) % 2 === 0 : true;
  const enter = interpolate(frame, [CMD_START - 4, CMD_START], [0, 1], clampOpts);

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", opacity: enter }}
    >
      <span style={{ fontFamily: MONO, fontSize: 29, color: MUTED }}>
        <span style={{ color: FAINT }}>$ </span>
        <span>{visible.slice(0, Math.min(typed, PKG_AT))}</span>
        <span style={{ color: LIME }}>
          {typed > PKG_AT ? visible.slice(PKG_AT) : ""}
        </span>
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: 28,
            marginLeft: 4,
            verticalAlign: "-5px",
            background: caretOn ? MUTED : "transparent",
          }}
        />
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Outro — the introducing-remocn lockup, reused with the new logo. A smoke
// ring blooms open, the R mark draws itself on, "emocn" slides out from behind
// it to assemble the Remocn wordmark, and remocn.dev settles underneath.
// Tracking dropped to default to honor the no-letter-spacing rule.
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

const WORD_TAIL = "emocn";
const WORD_SIZE = 92;
const MARK_SIZE = 66;

const measureTail = (): number => {
  const fallback = WORD_TAIL.length * WORD_SIZE * 0.55;
  if (typeof document === "undefined") return fallback;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.font = `400 ${WORD_SIZE}px ${SANS_FAMILY}, sans-serif`;
  return ctx.measureText(WORD_TAIL).width + 2;
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
    spring({ frame: frame - 70, fps, config: { damping: 18, stiffness: 90, mass: 1 } }),
  );

  const creditOpacity = interpolate(frame, [110, 128], [0, 1], clampOpts);

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", background: OBSIDIAN }}
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
          bottom: 44,
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 21,
          color: MUTED,
          opacity: creditOpacity,
        }}
      >
        remocn.dev
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Transition presentations (restrained set: crossfade + blur crossfade).
// The section boundaries use the new caret-wipe.
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

// ===========================================================================
// Composition root.
// ===========================================================================
export const TYPOGRAPHY_DURATION =
  S_HOOK +
  S_WAVE +
  ENTR_TOTAL +
  SWAP_TOTAL +
  S_MECH +
  S_DET +
  S_VALUE +
  S_CMD +
  S_OUTRO -
  (T_X + T_CARET + T_CARET + T_BLUR + T_X + T_X + T_X + T_BLUR);

export const TypographyDemo: React.FC = () => {
  return (
    <RemocnUIProvider>
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
          {/* 1 — Hook */}
          <TransitionSeries.Sequence durationInFrames={S_HOOK}>
            <HookScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 2 — The wave (the count) */}
          <TransitionSeries.Sequence durationInFrames={S_WAVE}>
            <WaveScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_CARET })}
            presentation={caretWipe({ direction: "right", caretColor: LIME })}
          />

          {/* 3 — Ten ways to enter */}
          <TransitionSeries.Sequence durationInFrames={ENTR_TOTAL}>
            <MontageScene effects={ENTRANCES} baseIndex={0} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_CARET })}
            presentation={caretWipe({ direction: "left", caretColor: LIME })}
          />

          {/* 4 — Eight ways to leave, or swap */}
          <TransitionSeries.Sequence durationInFrames={SWAP_TOTAL}>
            <MontageScene effects={SWAPS} baseIndex={ENTRANCES.length} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BLUR })}
            presentation={blurFade()}
          />

          {/* 5 — The mechanism */}
          <TransitionSeries.Sequence durationInFrames={S_MECH}>
            <MechScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 6 — Deterministic */}
          <TransitionSeries.Sequence durationInFrames={S_DET}>
            <DeterministicScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 7 — Value block */}
          <TransitionSeries.Sequence durationInFrames={S_VALUE}>
            <ValueScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 8 — One command */}
          <TransitionSeries.Sequence durationInFrames={S_CMD}>
            <CommandScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BLUR })}
            presentation={blurFade()}
          />

          {/* 9 — Outro lockup (new logo) */}
          <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
            <OutroScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </RemocnUIProvider>
  );
};
