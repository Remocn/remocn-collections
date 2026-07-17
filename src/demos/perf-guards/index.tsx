import React from "react";
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
import { syncSnap } from "@/components/remocn/sync-snap";
import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";
import { ShaderSmokeRing } from "@/components/remocn/shader-smoke-ring";

import { KineticCenterBuild } from "@/components/remocn/kinetic-center-build";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { ShortSlideRight } from "@/components/remocn/short-slide-right";
import { ScaleDownFade } from "@/components/remocn/scale-down-fade";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";

// Manrope + Geist Mono, matching the shipped remocn.dev brand.
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

const OBSIDIAN = "#141318";
const PANEL = "#1b1a21";
const INK = "#f2f2f2";
const MUTED = "rgba(242,242,242,0.62)";
const FAINT = "rgba(242,242,242,0.4)";
const HAIRLINE = "rgba(242,242,242,0.12)";
const LIME = "#C3E88D";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const Scrim: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 120% at 50% 42%, rgba(20,19,24,${
        0.3 * strength
      }) 0%, rgba(20,19,24,${0.82 * strength}) 100%)`,
    }}
  />
);

// A small lime check that draws itself on.
const CheckMark: React.FC<{ size?: number; draw: number }> = ({
  size = 16,
  draw,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M20 6 9 17l-5-5"
      stroke={LIME}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - draw}
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK = 74;
const S_TITLE = 66;
const S_MOUNT = 66;
const S_WEIGHT = 108;
const S_DRIFT = 132;
const S_CI = 126;
const S_HARDEN = 96;
const S_VALUE = 100;
const S_OUTRO = 150;

const T_X = 14; //     crossfade
const T_SNAP = 18; //  sync-snap (the new registry transition)
const T_BLUR = 16; //  blur crossfade

// ===========================================================================
// 1 — Hook. The key word "trust" lands last as the line assembles.
// ===========================================================================
const HookScene: React.FC = () => (
  <AbsoluteFill>
    <KineticCenterBuild
      text="Copy-paste UI runs on trust"
      fontSize={58}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// 2 — The title (the update's own words).
// ===========================================================================
const TitleScene: React.FC = () => (
  <AbsoluteFill>
    <SoftBlurIn
      text="Faster site, stronger guards"
      fontSize={58}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// 3 — Loads lighter (the lazy-mount feature).
// ===========================================================================
const MountScene: React.FC = () => (
  <AbsoluteFill>
    <ShortSlideRight
      text="Players mount only when you scroll to them"
      fontSize={42}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// 4 — The weight drop. The hero video's size counts DOWN and settles lighter.
// ===========================================================================
const WeightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [6, 20], [0, 1], clampOpts);
  const value = interpolate(frame, [16, 74], [18.5, 4.7], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  // The number eases down in scale as it drops — the weight coming off.
  const scale = interpolate(frame, [16, 74], [1.08, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const caption = interpolate(frame, [78, 94], [0, 1], clampOpts);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 18,
        opacity: appear,
      }}
    >
      <span style={{ fontFamily: SANS, fontSize: 20, fontWeight: 400, color: FAINT }}>
        hero video
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          transform: `scale(${scale})`,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 104,
            fontWeight: 500,
            color: INK,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {value.toFixed(1)}
        </span>
        <span style={{ fontFamily: SANS, fontSize: 40, fontWeight: 400, color: MUTED }}>
          MB
        </span>
      </div>
      <span
        style={{
          fontFamily: SANS,
          fontSize: 22,
          fontWeight: 400,
          color: MUTED,
          opacity: caption,
        }}
      >
        was 18.5 — nearly four times lighter
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 5 — The drift guard. Source and build shown side by side; a guard checks
// they match, every push.
// ===========================================================================
const GuardPanel: React.FC<{
  label: string;
  path: string;
  enter: number;
  fromX: number;
}> = ({ label, path, enter, fromX }) => (
  <div
    style={{
      width: 300,
      padding: "20px 22px",
      borderRadius: 14,
      border: `1px solid ${HAIRLINE}`,
      background: PANEL,
      boxShadow: "0 16px 40px rgba(0,0,0,0.32)",
      opacity: enter,
      transform: `translateX(${(1 - enter) * fromX}px)`,
    }}
  >
    <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 400, color: FAINT }}>
      {label}
    </div>
    <div
      style={{
        marginTop: 12,
        fontFamily: MONO,
        fontSize: 21,
        fontWeight: 400,
        color: INK,
      }}
    >
      {path}
    </div>
  </div>
);

const DriftGuardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterL = interpolate(frame, [6, 26], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const enterR = interpolate(frame, [12, 32], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const badge = spring({ frame: frame - 40, fps, config: { damping: 15, stiffness: 100, mass: 0.8 } });
  const checkDraw = interpolate(frame, [46, 62], [0, 1], clampOpts);
  const caption = interpolate(frame, [70, 86], [0, 1], clampOpts);

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <GuardPanel label="source" path="registry/blur-out-up" enter={enterL} fromX={-40} />

        {/* The guard's verdict — a lime check that pops in and draws. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: Math.min(1, badge),
            transform: `scale(${interpolate(Math.min(1, badge), [0, 1], [0.6, 1])})`,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 999,
              border: `1px solid ${LIME}`,
              background: "rgba(195,232,141,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckMark size={22} draw={checkDraw} />
          </div>
          <span style={{ fontFamily: SANS, fontSize: 15, fontWeight: 500, color: LIME }}>
            match
          </span>
        </div>

        <GuardPanel label="built" path="blur-out-up.tsx" enter={enterR} fromX={40} />
      </div>

      <span
        style={{ fontFamily: SANS, fontSize: 22, fontWeight: 400, color: MUTED, opacity: caption }}
      >
        checked on every push
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 6 — Every push, all four. The CI checklist assembles, a check settling on
// each row in turn.
// ===========================================================================
const CI_ROWS = ["Lint", "Typecheck", "Tests", "Drift guard"];
const ROW_STEP = 16;

const CIScene: React.FC = () => {
  const frame = useCurrentFrame();
  const caption = interpolate(frame, [CI_ROWS.length * ROW_STEP + 6, CI_ROWS.length * ROW_STEP + 22], [0, 1], clampOpts);

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 300 }}>
        {CI_ROWS.map((row, i) => {
          const at = 8 + i * ROW_STEP;
          const enter = interpolate(frame, [at, at + 12], [0, 1], {
            ...clampOpts,
            easing: Easing.out(Easing.cubic),
          });
          const checkDraw = interpolate(frame, [at + 6, at + 18], [0, 1], clampOpts);
          return (
            <div
              key={row}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 16px",
                borderRadius: 12,
                border: `1px solid ${HAIRLINE}`,
                background: PANEL,
                opacity: enter,
                transform: `translateY(${(1 - enter) * 12}px)`,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 7,
                  border: `1px solid ${checkDraw > 0.05 ? LIME : HAIRLINE}`,
                  background: checkDraw > 0.05 ? "rgba(195,232,141,0.12)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CheckMark size={14} draw={checkDraw} />
              </div>
              <span style={{ fontFamily: SANS, fontSize: 22, fontWeight: 400, color: INK }}>
                {row}
              </span>
            </div>
          );
        })}
      </div>
      <span
        style={{ fontFamily: SANS, fontSize: 21, fontWeight: 400, color: MUTED, opacity: caption }}
      >
        on every push
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 7 — The render API, locked down. Three hardening items land and clear.
// ===========================================================================
const HARDENING = ["Trusted IPs", "Capped queues", "Allowlisted avatars"];

const HardeningScene: React.FC = () => (
  <AbsoluteFill>
    <Series>
      {HARDENING.map((item) => (
        <Series.Sequence key={item} durationInFrames={30}>
          <ScaleDownFade text={item} fontSize={52} fontWeight={400} color={INK} speed={1.15} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

// ===========================================================================
// 8 — The trust climax. Three claims accumulate as a block.
// ===========================================================================
const ValueScene: React.FC = () => (
  <AbsoluteFill>
    <LineByLineSlide
      text={"Faster to load\nSafe to render\nAlways in sync"}
      fontSize={48}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// 9 — Outro. The introducing-remocn lockup, reused with the new logo.
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
// Section boundaries use the new sync-snap.
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
export const PERF_GUARDS_DURATION =
  S_HOOK +
  S_TITLE +
  S_MOUNT +
  S_WEIGHT +
  S_DRIFT +
  S_CI +
  S_HARDEN +
  S_VALUE +
  S_OUTRO -
  (T_X + T_SNAP + T_X + T_SNAP + T_X + T_BLUR + T_X + T_BLUR);

export const PerfGuardsDemo: React.FC = () => {
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

          {/* 2 — Title */}
          <TransitionSeries.Sequence durationInFrames={S_TITLE}>
            <TitleScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_SNAP })}
            presentation={syncSnap({ offset: 40 })}
          />

          {/* 3 — Loads lighter */}
          <TransitionSeries.Sequence durationInFrames={S_MOUNT}>
            <MountScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 4 — The weight drop */}
          <TransitionSeries.Sequence durationInFrames={S_WEIGHT}>
            <WeightScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_SNAP })}
            presentation={syncSnap({ offset: 40 })}
          />

          {/* 5 — The drift guard */}
          <TransitionSeries.Sequence durationInFrames={S_DRIFT}>
            <DriftGuardScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 6 — Every push, all four */}
          <TransitionSeries.Sequence durationInFrames={S_CI}>
            <CIScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BLUR })}
            presentation={blurFade()}
          />

          {/* 7 — The render API, locked down */}
          <TransitionSeries.Sequence durationInFrames={S_HARDEN}>
            <HardeningScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 8 — The trust climax */}
          <TransitionSeries.Sequence durationInFrames={S_VALUE}>
            <ValueScene />
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
