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

import { BlurOutUp } from "@/components/remocn/blur-out-up";
import { ShortSlideRight } from "@/components/remocn/short-slide-right";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";
import { KineticCenterBuild } from "@/components/remocn/kinetic-center-build";

import { ShaderGrainGradient } from "@/components/remocn/shader-grain-gradient";
import { ShaderMeshGradient } from "@/components/remocn/shader-mesh-gradient";
import { ShaderWarp } from "@/components/remocn/shader-warp";
import { ShaderLiquidMetal } from "@/components/remocn/shader-liquid-metal";
import { ShaderGodRays } from "@/components/remocn/shader-god-rays";
import { ShaderNeuroNoise } from "@/components/remocn/shader-neuro-noise";
import { ShaderVoronoi } from "@/components/remocn/shader-voronoi";
import { ShaderDotOrbit } from "@/components/remocn/shader-dot-orbit";
import { ShaderMetaballs } from "@/components/remocn/shader-metaballs";
import { ShaderWater } from "@/components/remocn/shader-water";
import { ShaderSpiral } from "@/components/remocn/shader-spiral";
import { ShaderSwirl } from "@/components/remocn/shader-swirl";
import { ShaderDithering } from "@/components/remocn/shader-dithering";
import { ShaderPulsingBorder } from "@/components/remocn/shader-pulsing-border";

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

const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.62)";
const FAINT = "rgba(250,250,250,0.4)";
const PAPER_BLUE = "#81ADEC";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK = 78; //      "Paper just open-sourced their shaders"
const S_LOCKUP = 112; //   Remocn + Paper lockup
const S_INTRO = 76; //     "Introducing remocn shaders"
const BEAT_F = 36; //      one fullscreen shader per hard cut
const S_FEATURES = 92; //  three feature lines
const S_INSTALL = 104; //  one command away
const S_OUTRO = 156; //    fade in → swirl unwinds → holds → winds away → wordmark

const T_ZB = 18; // zoom-blur
const T_X = 16; // crossfade

// ===========================================================================
// The Paper logo mark (provided brand asset).
// ===========================================================================
const PaperMark: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 39 39" fill="none" width={size} height={size}>
    <path
      d="M39 24H24V6H6V24H24V39H0V6H6V0H39V24Z"
      fill={PAPER_BLUE}
    />
  </svg>
);

// ===========================================================================
// Fullscreen shader showcase — hard cuts, no transitions on purpose.
// ===========================================================================
type Beat = { name: string; node: React.ReactNode };

const BEATS: Beat[] = [
  {
    name: "shader-mesh-gradient",
    node: (
      <ShaderMeshGradient
        speed={2}
        colors={["#12102a", "#3b2a80", "#7c5cff", "#c9b8ff"]}
        distortion={0.8}
        swirl={0.2}
      />
    ),
  },
  {
    name: "shader-warp",
    node: (
      <ShaderWarp
        speed={2}
        colors={["#041418", "#0d4f5c", "#2fb7c4", "#c8f4f7"]}
        swirl={0.6}
      />
    ),
  },
  {
    name: "shader-liquid-metal",
    node: (
      <ShaderLiquidMetal speed={2} colorBack="#17171c" colorTint="#c9c9d6" />
    ),
  },
  {
    name: "shader-god-rays",
    node: (
      <ShaderGodRays
        speed={2}
        colorBack="#0d0a05"
        colorBloom="#6b4e17"
        colors={["#ffe4b3", "#f6b352", "#fff6e0", "#8a6a2a"]}
        intensity={1}
        bloom={0.55}
      />
    ),
  },
  {
    name: "shader-neuro-noise",
    node: (
      <ShaderNeuroNoise
        speed={2}
        colorFront="#7ef0c0"
        colorMid="#14503a"
        colorBack="#03100a"
        contrast={0.4}
      />
    ),
  },
  {
    name: "shader-voronoi",
    node: (
      <ShaderVoronoi
        speed={2}
        colors={["#0e2a55", "#2b6cb0", "#66b2f0", "#cfe8ff"]}
        colorGap="#04080f"
        glow={0.15}
      />
    ),
  },
  {
    name: "shader-dot-orbit",
    node: (
      <ShaderDotOrbit
        speed={2}
        colorBack="#0a0a12"
        colors={["#81adec", "#5a8fd8", "#e8f0fb", "#33538a"]}
      />
    ),
  },
  {
    name: "shader-metaballs",
    node: (
      <ShaderMetaballs
        speed={2}
        colorBack="#150a16"
        colors={["#ff6b9d", "#ff9e64", "#ffd166", "#c084fc"]}
      />
    ),
  },
  {
    name: "shader-water",
    node: (
      <ShaderWater
        speed={2}
        colorBack="#06121c"
        colorHighlight="#aee3f2"
        highlights={0.12}
        caustic={0.12}
      />
    ),
  },
  {
    name: "shader-spiral",
    node: <ShaderSpiral speed={2} colorBack="#0a0a0a" colorFront="#ececf2" />,
  },
  {
    name: "shader-dithering",
    node: (
      <ShaderDithering
        speed={2}
        colorBack="#0a0a10"
        colorFront={PAPER_BLUE}
        size={3}
      />
    ),
  },
  {
    name: "shader-pulsing-border",
    node: (
      <ShaderPulsingBorder
        speed={2}
        colorBack="#0b0b10"
        colors={["#81adec", "#a9c7f2", "#4a76b8", "#dfe9fa"]}
        intensity={0.35}
        bloom={0.4}
        thickness={0.12}
      />
    ),
  },
];

const S_SHOWCASE = BEATS.length * BEAT_F;

const ShowcaseScene: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0a0a" }}>
    <Series>
      {BEATS.map((beat) => (
        <Series.Sequence key={beat.name} durationInFrames={BEAT_F}>
          <AbsoluteFill style={{ background: "#0a0a0a" }}>
            {beat.node}
          </AbsoluteFill>
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 1 — Hook.
// ===========================================================================
const HookScene: React.FC = () => (
  <AbsoluteFill style={{ padding: "0 90px" }}>
    <BlurOutUp
      text="Paper just open-sourced their shaders"
      fontSize={58}
      fontWeight={600}
      color={INK}
      staggerDelay={2}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — Lockup. Remocn + Paper, staggered entrances on a static flex row,
// then a quiet subtitle resolves underneath.
// ===========================================================================
const LockupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Remocn slides in from the left.
  const remocnIn = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.9 },
  });
  const remocnX = interpolate(remocnIn, [0, 1], [-44, 0]);

  // The plus pops between them.
  const plusIn = spring({
    frame: frame - 10,
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.7 },
  });
  const plusOpacity = interpolate(frame, [10, 22], [0, 1], clampOpts);
  const plusScale = interpolate(plusIn, [0, 1], [0.4, 1]);

  // The Paper mark + word slide in from the right.
  const paperIn = spring({
    frame: frame - 16,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.9 },
  });
  const paperX = interpolate(paperIn, [0, 1], [44, 0]);
  const paperOpacity = interpolate(frame, [16, 30], [0, 1], clampOpts);

  // The mark breathes very slightly once settled.
  const markFloat = Math.sin((frame - 40) / 22) * 3;

  // Subtitle resolves after the lockup settles.
  const subOpacity = interpolate(frame, [52, 70], [0, 1], clampOpts);
  const subY = interpolate(frame, [52, 72], [14, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const subBlur = interpolate(frame, [52, 70], [8, 0], clampOpts);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 36,
          transform: "translateY(-26px)",
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 76,
            letterSpacing: "-0.03em",
            color: INK,
            opacity: remocnIn,
            transform: `translateX(${remocnX}px)`,
            whiteSpace: "nowrap",
          }}
        >
          Remocn
        </span>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 54,
            color: FAINT,
            opacity: plusOpacity,
            transform: `scale(${plusScale})`,
          }}
        >
          +
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            opacity: paperOpacity,
            transform: `translateX(${paperX}px)`,
          }}
        >
          <div style={{ transform: `translateY(${frame > 40 ? markFloat : 0}px)` }}>
            <PaperMark size={78} />
          </div>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 76,
              letterSpacing: "-0.03em",
              color: INK,
              whiteSpace: "nowrap",
            }}
          >
            Paper
          </span>
        </div>
      </div>

      <span
        style={{
          position: "absolute",
          top: 448,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 28,
          color: MUTED,
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          filter: `blur(${subBlur}px)`,
        }}
      >
        Their shaders, now wrapped for Remotion
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 3 — Introducing. The line slides in from the left via short-slide-right.
// ===========================================================================
const IntroScene: React.FC = () => (
  <AbsoluteFill>
    <ShortSlideRight
      text="Introducing Remocn Shaders"
      fontSize={66}
      fontWeight={700}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 5 — Features. Three lines, left-aligned block, centered.
// ===========================================================================
const FeaturesScene: React.FC = () => (
  <AbsoluteFill>
    <LineByLineSlide
      text={
        "18 shaders on the GPU\nFrozen to the current frame\nDeterministic on every render"
      }
      fontSize={52}
      fontWeight={600}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 6 — Install. Kinetic headline, then the command resolves below.
// ===========================================================================
const InstallScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cmdOpacity = interpolate(frame, [52, 68], [0, 1], clampOpts);
  const cmdY = interpolate(frame, [52, 72], [16, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const cmdBlur = interpolate(frame, [52, 68], [6, 0], clampOpts);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: "translateY(-42px)",
        }}
      >
        <KineticCenterBuild
          text="Any shader, one command"
          fontSize={56}
          fontWeight={700}
          color={INK}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 418,
          display: "flex",
          justifyContent: "center",
          opacity: cmdOpacity,
          transform: `translateY(${cmdY}px)`,
          filter: `blur(${cmdBlur}px)`,
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 28, color: MUTED }}>
          <span style={{ color: FAINT }}>$ </span>
          npx shadcn add{" "}
          <span style={{ color: PAPER_BLUE }}>@remocn/shader-warp</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 7 — Outro. The swirl opens up — twist animates 0 → 1 — and once the
// bands have wound in, the wordmark resolves at the center.
// ===========================================================================
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The swirl reads rich below twist ≈ 0.4 and collapses into colorBack near 1.
  // The scene fades in over the near-black twist=1 field first; only once the
  // fade has settled does the twist unwind 1 → 0, emerging out of the dark.
  // It holds open for a beat, then winds back 0 → 1, clearing the stage for
  // the wordmark. The easing applies to each segment of the keyframe range.
  const twist = interpolate(frame, [14, 48, 72, 112], [1, 0, 0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });

  const pop = spring({
    frame: frame - 102,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.9 },
  });
  const scale = interpolate(pop, [0, 1], [0.92, 1]);
  const blur = interpolate(frame, [102, 118], [10, 0], clampOpts);

  const creditOpacity = interpolate(frame, [122, 140], [0, 1], clampOpts);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
      }}
    >
      <ShaderSwirl
        twist={twist}
        colors={["#1d2c4a", "#3f6cb0", "#81adec"]}
        colorBack="#0a0a0e"
        bandCount={10}
        softness={0.35}
      />
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 92,
          letterSpacing: "-0.03em",
          color: INK,
          opacity: pop,
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          position: "relative",
        }}
      >
        Remocn
      </span>
      <div
        style={{
          position: "absolute",
          bottom: 44,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: creditOpacity,
        }}
      >
        <PaperMark size={20} />
        <span style={{ fontFamily: SANS, fontSize: 20, color: FAINT }}>
          Shaders by Paper
        </span>
      </div>
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

const ZoomBlur: React.FC<TransitionPresentationComponentProps<EmptyProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const entering = presentationDirection === "entering";
  const p = presentationProgress;
  const style: React.CSSProperties = entering
    ? {
        opacity: p,
        transform: `scale(${0.9 + p * 0.1})`,
        filter: p < 1 ? `blur(${(1 - p) * 16}px)` : undefined,
      }
    : {
        opacity: 1 - p,
        transform: `scale(${1 + p * 0.12})`,
        filter: p > 0 ? `blur(${p * 16}px)` : undefined,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const zoomBlur = (): TransitionPresentation<EmptyProps> => ({
  component: ZoomBlur,
  props: {},
});

// ===========================================================================
// Composition root.
// ===========================================================================
export const PAPER_SHADERS_DURATION =
  S_HOOK +
  S_LOCKUP +
  S_INTRO +
  S_SHOWCASE +
  S_FEATURES +
  S_INSTALL +
  S_OUTRO -
  (T_ZB + T_X + T_X + T_X);

export const PaperShadersDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-geist-sans": SANS_FAMILY,
          background: "#0a0a0a",
        } as React.CSSProperties
      }
    >
      {/* One of the new shaders carries the whole video as its backdrop. */}
      <ShaderGrainGradient speed={0.5} />
      {/* Scrim to keep the foreground copy readable. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 42%, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.8) 100%)",
        }}
      />

      <TransitionSeries>
        {/* 1 — Hook */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_ZB })}
          presentation={zoomBlur()}
        />

        {/* 2 — Remocn + Paper lockup */}
        <TransitionSeries.Sequence durationInFrames={S_LOCKUP}>
          <LockupScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 3 — Introducing */}
        <TransitionSeries.Sequence durationInFrames={S_INTRO}>
          <IntroScene />
        </TransitionSeries.Sequence>

        {/* 4 — Fullscreen shader showcase, hard cut in and out */}
        <TransitionSeries.Sequence durationInFrames={S_SHOWCASE}>
          <ShowcaseScene />
        </TransitionSeries.Sequence>

        {/* 5 — Features */}
        <TransitionSeries.Sequence durationInFrames={S_FEATURES}>
          <FeaturesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 6 — Install */}
        <TransitionSeries.Sequence durationInFrames={S_INSTALL}>
          <InstallScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 7 — Outro: fade to the dark twist=1 field, then the swirl unwinds */}
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
