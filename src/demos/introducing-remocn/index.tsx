import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, Series, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { demoAsset } from "@/lib/demo-assets";
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
import { ShaderSwirl } from "@/components/remocn/shader-swirl";
import { ShaderDithering } from "@/components/remocn/shader-dithering";
import { ShaderColorPanels } from "@/components/remocn/shader-color-panels";
import { ShaderWarp } from "@/components/remocn/shader-warp";
import { ShaderMeshGradient } from "@/components/remocn/shader-mesh-gradient";
import { ShaderVoronoi } from "@/components/remocn/shader-voronoi";
import { ShaderMetaballs } from "@/components/remocn/shader-metaballs";
import { ShaderGodRays } from "@/components/remocn/shader-god-rays";
import { ShaderSmokeRing } from "@/components/remocn/shader-smoke-ring";

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
// Shader covers run fade-in (12f) → opaque hold (~500ms) → fade-out, so the
// shader itself gets read as a moment, not a flash.
// ---------------------------------------------------------------------------
const S_PAIN = 208; //     two scale-down-fade pain lines + room for the swirl
const S_MEET = 150; //     "Meet Remocn"
const S_TAGLINE = 76; //   "Cinematic video components for React"
const S_POS = 96; //       kinetic "Like shadcn/ui, for video"
const REG_BEAT = 26; //    one fullscreen shader per hard cut
const S_VALUE = 104; //    three value lines
const S_INSTALL_TITLE = 70; // "It lands in your repo"
const S_INSTALL_CMD = 176; //  typed command + 3D name rolodex
const S_OUTRO = 150; //    smoke ring blooms → mark + wordmark + url

// Paced like the paper-shaders OutroScene: unwind ~34f, hold ~22f, wind ~38f.
const T_SWIRL = 104; //    shader-swirl cover (twist 1→0 → hold → 0→1)
const T_DITHER = 40; //    lime dither dissolve (held mid-frame)
const T_X = 14; //         crossfade
const T_BLUR = 16; //      blur crossfade

// ===========================================================================
// The remocn mark — the real brand asset from remocn.dev/logo.svg,
// downloaded to public/remocn-logo.svg.
// ===========================================================================
const RemocnMark: React.FC<{ size: number }> = ({ size }) => (
  <Img
    src={demoAsset("remocn-logo.svg")}
    style={{ width: size, height: size, display: "block" }}
  />
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
// Scene 1 — Pain. Two lines land solo on the shared backdrop.
// ===========================================================================
const PainScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={60}>
      <ScaleDownFade
        text="Every launch needs a video"
        fontSize={54}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
    <Sequence from={60} durationInFrames={60}>
      <ScaleDownFade
        text="Yours shouldn't take a week"
        fontSize={54}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — Meet Remocn. The text itself is static on entry (the swirl
// cover's exit reveals it with a z-axis scale), then it plays its own exit —
// fading up and out — so the tagline never overlaps it.
// ===========================================================================
const MeetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const exitP = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 2],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 76,
          letterSpacing: "-0.03em",
          color: INK,
          opacity: 1 - exitP,
          transform: `translateY(${exitP * -10}px) scale(${1 - exitP * 0.05})`,
          filter: `blur(${exitP * 6}px)`,
        }}
      >
        Meet Remocn
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 3 — Tagline. Enters via short-slide-right only after Meet Remocn
// has fully exited (hard cut between the scenes, no overlap).
// ===========================================================================
const TaglineScene: React.FC = () => (
  <AbsoluteFill>
    <ShortSlideRight
      text="Cinematic video components for React"
      fontSize={48}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 4 — Positioning. The mental model assembles word by word.
// ===========================================================================
const PositioningScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={24}>
      <KineticCenterBuild
        text="Like shadcn/ui, for video"
        fontSize={62}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 5 — The registry montage. Six shaders hard-cut, one category each.
// ===========================================================================
type RegistryBeat = { label: string; node: React.ReactNode };

const REGISTRY_BEATS: RegistryBeat[] = [
  {
    label: "Text animations",
    node: (
      <ShaderColorPanels
        speed={2}
        colorBack={OBSIDIAN}
        colors={["#39364d", "#55506e", "#7d76a0", "#a49dcb"]}
        density={3}
        length={1.1}
      />
    ),
  },
  {
    label: "Transitions",
    node: (
      <ShaderWarp
        speed={2}
        colors={["#141318", "#2c2a38", "#5b5773", "#b9b4d6"]}
        swirl={0.6}
      />
    ),
  },
  {
    label: "Backgrounds",
    node: (
      <ShaderMeshGradient
        speed={2}
        colors={["#141318", "#2b2a3a", "#565170", "#8f88ae"]}
        distortion={0.8}
        swirl={0.2}
      />
    ),
  },
  {
    label: "UI blocks",
    node: (
      <ShaderVoronoi
        speed={2}
        colors={["#232130", "#3d3a52", "#6b6590", "#a9a2cf"]}
        colorGap="#0d0c10"
        glow={0.1}
      />
    ),
  },
  {
    label: "UI primitives",
    node: (
      <ShaderMetaballs
        speed={2}
        colorBack={OBSIDIAN}
        colors={["#4a4661", "#7d76a0", "#C3E88D", "#e6e2f5"]}
      />
    ),
  },
  {
    label: "Shaders",
    node: (
      <ShaderGodRays
        speed={2}
        colorBack="#0d0d10"
        colorBloom="#48522f"
        colors={["#C3E88D", "#e8f2d0", "#6a7550", "#39412a"]}
        intensity={0.9}
        bloom={0.5}
      />
    ),
  },
];

// The last beat carries the dither transition on top, so it gets its
// clean 26 frames back by absorbing the overlap.
const S_REGISTRY = REGISTRY_BEATS.length * REG_BEAT + T_DITHER;

const RegistryLabel: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 7], [0, 1], clampOpts);
  const y = interpolate(frame, [0, 8], [10, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const blur = interpolate(frame, [0, 7], [6, 0], clampOpts);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 58,
          letterSpacing: "-0.03em",
          color: INK,
          opacity,
          transform: `translateY(${y}px)`,
          filter: `blur(${blur}px)`,
        }}
      >
        {label}
      </span>
    </AbsoluteFill>
  );
};

const RegistryScene: React.FC = () => (
  <AbsoluteFill style={{ background: OBSIDIAN }}>
    <Series>
      {REGISTRY_BEATS.map((beat, i) => (
        <Series.Sequence
          key={beat.label}
          durationInFrames={
            i === REGISTRY_BEATS.length - 1 ? REG_BEAT + T_DITHER : REG_BEAT
          }
        >
          <AbsoluteFill style={{ background: OBSIDIAN }}>
            {beat.node}
            <Scrim strength={0.7} />
            <RegistryLabel label={beat.label} />
          </AbsoluteFill>
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 6 — The numbers. Three claims accumulate as a block.
// ===========================================================================
const ValueScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={24}>
      <LineByLineSlide
        text={"110+ components\nOne command to install\nThe code is yours"}
        fontSize={50}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 7a — Install title. Its own typographic beat; plays its own exit so
// the command scene starts on an empty canvas.
// ===========================================================================
const InstallTitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const exitP = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 2],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exitP,
        transform: `translateY(${exitP * -10}px) scale(${1 - exitP * 0.05})`,
        filter: `blur(${exitP * 6}px)`,
      }}
    >
      <ShortSlideRight
        text="It lands in your repo"
        fontSize={50}
        fontWeight={400}
        color={INK}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 7b — Install command. The command types itself; once typing lands,
// the package name becomes a 3D rolodex and flips through other registry
// components — any component, same command.
// ===========================================================================
const CMD = "npx shadcn add @remocn/";
const PKG_NAMES = [
  "kinetic-center-build",
  "per-character-rise",
  "shader-warp",
  "command-menu",
  "claude-chat",
];
const CMD_START = 10;
const FLIP_START = 56; // first flip, after the typed command has settled
const FLIP_PER = 24; //  one name every 24 frames
const FLIP_DUR = 10; //  the 3D flip itself

const InstallCmdScene: React.FC = () => {
  const frame = useCurrentFrame();

  const full = CMD + PKG_NAMES[0];
  const typed = Math.max(
    0,
    Math.min(full.length, Math.floor((frame - CMD_START) * 1.5)),
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
  // The caret leaves just before the rolodex starts spinning.
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
            width: `${PKG_NAMES[0].length}ch`,
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
              // The outgoing name clears first; the incoming one follows
              // half a flip later, so the two never sit on top of each other.
              const inStart = FLIP_START + (i - 1) * FLIP_PER + 5;
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
                y = (1 - pIn) * 20;
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
                y -= pOut * 20;
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
// Scene 8 — Outro. A smoke ring blooms open, the lockup assembles inside it.
// ===========================================================================
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ringRadius = interpolate(frame, [6, 56], [0.03, 0.19], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  const markIn = spring({
    frame: frame - 52,
    fps,
    config: { damping: 13, stiffness: 150, mass: 0.8 },
  });
  const markScale = interpolate(markIn, [0, 1], [0.5, 1]);

  const wordIn = spring({
    frame: frame - 62,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.9 },
  });
  const wordX = interpolate(wordIn, [0, 1], [-18, 0]);
  const wordOpacity = interpolate(frame, [62, 76], [0, 1], clampOpts);

  const creditOpacity = interpolate(frame, [110, 128], [0, 1], clampOpts);

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
          alignItems: "center",
          gap: 26,
          transform: "translateY(-14px)",
          position: "relative",
        }}
      >
        <div style={{ opacity: markIn, transform: `scale(${markScale})` }}>
          <RemocnMark size={76} />
        </div>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 84,
            letterSpacing: "-0.03em",
            color: INK,
            opacity: wordOpacity,
            transform: `translateX(${wordX}px)`,
          }}
        >
          Remocn
        </span>
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
// Transition presentations — the scene changes are shaders too.
// Cover envelope: fade in over ~12f, hold fully opaque for ~500ms while the
// shader plays, then fade out. Children swap underneath the hold.
// ===========================================================================
type EmptyProps = Record<string, never>;

const coverEnvelope = (p: number) =>
  interpolate(p, [0, 0.3, 0.65, 1], [0, 1, 1, 0], clampOpts);

const coverChildOpacity = (p: number, entering: boolean) =>
  entering
    ? interpolate(p, [0.58, 0.66], [0, 1], clampOpts)
    : interpolate(p, [0.28, 0.36], [1, 0], clampOpts);

// The swirl cover mirrors the paper-shaders outro: it fades in over the
// outgoing scene as the dark twist=1 field, unwinds 1 → 0 into fully open
// bands, holds there for ~500ms, then winds back 0 → 1 — and synchronized
// with the wind-back the incoming text resolves through scale + blur on top.
const SwirlCover: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const p = presentationProgress;
  // Same gentle curve as the paper-shaders outro swirl.
  const twist = interpolate(p, [0.1, 0.42, 0.64, 1], [1, 0, 0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });
  // The swirl's colorBack is transparent, so at twist = 1 the cover IS
  // invisible and the shared backdrop shows through the whole time — no
  // opacity fade needed, the wind itself brings the bands in and out.

  // The incoming text waits until the wind-back has reached twist ≈ 0.25
  // (p ≈ 0.77 on the bezier), then grows from deep inside the swirl's dark
  // center opening to full size as the bands wind shut around it.
  const childStyle: React.CSSProperties = entering
    ? {
        opacity: interpolate(p, [0.77, 0.87], [0, 1], clampOpts),
        transform: `scale(${interpolate(p, [0.77, 1], [0.3, 1], {
          ...clampOpts,
          easing: Easing.out(Easing.cubic),
        })})`,
        filter: `blur(${interpolate(p, [0.77, 0.93], [10, 0], clampOpts)}px)`,
      }
    : { opacity: interpolate(p, [0.06, 0.13], [1, 0], clampOpts) };

  // The cover sits UNDER the entering children: the incoming text z-scales
  // in on top of the swirl while it winds shut beneath it.
  return (
    <AbsoluteFill>
      {entering ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <ShaderSwirl
            speed={1}
            twist={twist}
            colors={["#1f1d29", "#413d56", "#C3E88D"]}
            colorBack="rgba(20,19,24,0)"
            bandCount={10}
            softness={0.35}
          />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={childStyle}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const swirlCover = (): TransitionPresentation<EmptyProps> => ({
  component: SwirlCover,
  props: {},
});

// The frame dissolves through a slow drift of lime dither pixels.
const DitherCover: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const p = presentationProgress;
  const size = interpolate(p, [0, 1], [1.6, 2.8], clampOpts);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: coverChildOpacity(p, entering) }}>
        {children}
      </AbsoluteFill>
      {entering ? (
        <AbsoluteFill
          style={{ opacity: coverEnvelope(p), pointerEvents: "none" }}
        >
          <ShaderDithering
            speed={1.5}
            colorBack={OBSIDIAN}
            colorFront={LIME}
            shape="simplex"
            size={size}
          />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
const ditherCover = (): TransitionPresentation<EmptyProps> => ({
  component: DitherCover,
  props: {},
});

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
export const INTRODUCING_REMOCN_DURATION =
  S_PAIN +
  S_MEET +
  S_TAGLINE +
  S_POS +
  S_REGISTRY +
  S_VALUE +
  S_INSTALL_TITLE +
  S_INSTALL_CMD +
  S_OUTRO -
  (T_SWIRL + T_DITHER + T_DITHER + T_X + T_BLUR);

export const IntroducingRemocnDemo: React.FC = () => {
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
        {/* 1 — Pain, two lines */}
        <TransitionSeries.Sequence durationInFrames={S_PAIN}>
          <PainScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_SWIRL })}
          presentation={swirlCover()}
        />

        {/* 2 — Meet Remocn (plays its own exit, hard cut into the tagline) */}
        <TransitionSeries.Sequence durationInFrames={S_MEET}>
          <MeetScene />
        </TransitionSeries.Sequence>

        {/* 3 — Tagline, its own typography beat */}
        <TransitionSeries.Sequence durationInFrames={S_TAGLINE}>
          <TaglineScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_DITHER })}
          presentation={ditherCover()}
        />

        {/* 4 — Like shadcn/ui, for video */}
        <TransitionSeries.Sequence durationInFrames={S_POS}>
          <PositioningScene />
        </TransitionSeries.Sequence>

        {/* 5 — Registry montage, hard cut in */}
        <TransitionSeries.Sequence durationInFrames={S_REGISTRY}>
          <RegistryScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_DITHER })}
          presentation={ditherCover()}
        />

        {/* 6 — The numbers */}
        <TransitionSeries.Sequence durationInFrames={S_VALUE}>
          <ValueScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 7 — Install */}
        <TransitionSeries.Sequence durationInFrames={S_INSTALL_TITLE}>
          <InstallTitleScene />
        </TransitionSeries.Sequence>

        {/* 7b — Install command (title exits itself, hard cut) */}
        <TransitionSeries.Sequence durationInFrames={S_INSTALL_CMD}>
          <InstallCmdScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 8 — Outro lockup */}
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
