import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
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
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";
import { BlurOutUp } from "@/components/remocn/blur-out-up";

import { whipPan } from "@/components/remocn/whip-pan";
import { pushThrough } from "@/components/remocn/push-through";
import { focusPull } from "@/components/remocn/focus-pull";
import { ditherDissolve } from "@/components/remocn/dither-dissolve";
import { waveWipe } from "@/components/remocn/wave-wipe";
import { grainDissolve } from "@/components/remocn/grain-dissolve";
import { rippleZoom } from "@/components/remocn/ripple-zoom";
import { warpDissolve } from "@/components/remocn/warp-dissolve";
import { perlinDissolve } from "@/components/remocn/perlin-dissolve";
import { smokeDissolve } from "@/components/remocn/smoke-dissolve";
import { swirlDissolve } from "@/components/remocn/swirl-dissolve";

const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400"],
});

const SANS = `${SANS_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

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
// Scene timings (frames @ 30fps). Transitions overlap the adjacent scenes.
// ---------------------------------------------------------------------------
const S_HOOK = 100;
const S_INTRO = 110;
const S_VALUE = 170;
const S_INSTALL = 152;
const S_OUTRO = 170;

const T_XF = 14; //  crossfade — the last deliberately plain cut
const T_VALUE = 46; // focus-pull, reused into the value block
const T_INSTALL = 26; // whip-pan up, reused into the install beat
const T_OUTRO = 40; // push-through, the climactic arrival

// The remocn mark — the real brand asset from remocn.dev/logo.svg.
const RemocnMark: React.FC<{ size: number }> = ({ size }) => (
  <Img
    src={demoAsset("remocn-logo.svg")}
    style={{ width: size, height: size, display: "block" }}
  />
);

// ===========================================================================
// The showcase — each beat enters through the transition it names.
// Labels are static on purpose: all motion belongs to the cut itself.
// ===========================================================================
type ShowcaseBeat = {
  name: string;
  dur: number;
  tIn: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  presentation: () => TransitionPresentation<any>;
  transparent?: boolean;
  // Obsidian layer fading in over [from, to] (scene-local frames). Needed
  // when the incoming shader field ends on a solid color that expects an
  // opaque scene to cover it — the veil resolves it into the root obsidian
  // without an unmount pop.
  veil?: { from: number; to: number };
  tint: string;
};

const BEATS: ShowcaseBeat[] = [
  {
    name: "Whip Pan",
    dur: 92,
    tIn: 26,
    presentation: () => whipPan({ direction: "left" }),
    tint: "#1a1922",
  },
  {
    name: "Push Through",
    dur: 112,
    tIn: 40,
    presentation: () => pushThrough(),
    tint: "#17161f",
  },
  {
    name: "Focus Pull",
    dur: 112,
    tIn: 46,
    presentation: () => focusPull(),
    tint: "#191720",
  },
  {
    name: "Dither Dissolve",
    dur: 122,
    tIn: 40,
    presentation: () =>
      ditherDissolve({ colorBack: OBSIDIAN, colorFront: LIME }),
    tint: "#161a15",
  },
  {
    name: "Wave Wipe",
    dur: 144,
    tIn: 56,
    presentation: () => waveWipe({ colorBack: OBSIDIAN }),
    // Scene B stays transparent so the wave field reads behind it as it
    // rides up, instead of being covered by an opaque frame.
    transparent: true,
    tint: OBSIDIAN,
  },
  {
    name: "Grain Dissolve",
    dur: 164,
    tIn: 66,
    presentation: () => grainDissolve({ colorBack: OBSIDIAN }),
    tint: "#1a1820",
  },
  {
    name: "Ripple Zoom",
    dur: 164,
    tIn: 76,
    presentation: () => rippleZoom({ colorBack: OBSIDIAN }),
    // The dolly lands on the ripple field — the frame stays transparent
    // so the field (and the root obsidian after it) reads as the ground.
    transparent: true,
    tint: OBSIDIAN,
  },
  {
    name: "Warp Dissolve",
    dur: 176,
    tIn: 66,
    presentation: () => warpDissolve(),
    tint: "#171622",
  },
  {
    name: "Perlin Dissolve",
    dur: 200,
    tIn: 90,
    presentation: () =>
      // Darker front keeps the mid-sweep flash in the video's tonal range.
      perlinDissolve({ colorBack: OBSIDIAN, colorFront: "#5b5773" }),
    // The perlin field ends solid colorFront — the veil dissolves it into
    // the root obsidian before the presentation unmounts at frame 90.
    transparent: true,
    veil: { from: 58, to: 86 },
    tint: OBSIDIAN,
  },
  {
    name: "Smoke Dissolve",
    dur: 210,
    tIn: 90,
    presentation: () => smokeDissolve({ colorBack: OBSIDIAN }),
    // The ring expands past the frame by the end — the field resolves to
    // colorBack on its own, so the transparent frame lands seamlessly.
    transparent: true,
    tint: OBSIDIAN,
  },
  {
    name: "Swirl Dissolve",
    dur: 180,
    tIn: 100,
    presentation: () =>
      swirlDissolve({
        colors: ["#1f1d29", "#413d56", LIME],
        colorBack: OBSIDIAN,
      }),
    // The vortex winds back to twist=1 (collapses into colorBack) by the
    // end, so the transparent frame lands seamlessly.
    transparent: true,
    tint: OBSIDIAN,
  },
];

const ShowcaseFrame: React.FC<{
  name: string;
  transparent?: boolean;
  veil?: { from: number; to: number };
  tint: string;
}> = ({ name, transparent, veil, tint }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // The only internal motion: a slow drift so the hold never feels frozen.
  const drift = interpolate(frame, [0, durationInFrames], [1, 1.045]);

  const veilOpacity = veil
    ? interpolate(frame, [veil.from, veil.to], [0, 1], clampOpts)
    : 0;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: transparent
          ? undefined
          : `radial-gradient(110% 110% at 50% 38%, ${tint} 0%, ${OBSIDIAN} 72%)`,
      }}
    >
      {veil ? (
        <AbsoluteFill style={{ background: OBSIDIAN, opacity: veilOpacity }} />
      ) : null}
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 76,
          color: INK,
          whiteSpace: "nowrap",
          transform: `scale(${drift})`,
        }}
      >
        {name}
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 1 — Hook. Two pain lines land solo; the world before the update.
// ===========================================================================
const HookScene: React.FC = () => (
  <AbsoluteFill style={{ background: OBSIDIAN }}>
    <Sequence durationInFrames={48}>
      <ScaleDownFade
        text="Everyone animates their scenes"
        fontSize={54}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
    <Sequence from={48} durationInFrames={48}>
      <ScaleDownFade
        text="Nobody animates the cut"
        fontSize={54}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — The announcement. The title glides in and holds alone.
// ===========================================================================
const IntroScene: React.FC = () => (
  <AbsoluteFill style={{ background: OBSIDIAN }}>
    <Sequence durationInFrames={S_INTRO - BEATS[0].tIn}>
      <ShortSlideRight
        text="Introducing Remocn transitions"
        fontSize={62}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 14 — The value block. Three claims slide in and hold.
// ===========================================================================
const ValueScene: React.FC = () => (
  <AbsoluteFill style={{ background: OBSIDIAN }}>
    <Sequence from={24} durationInFrames={S_VALUE - 24 - T_INSTALL}>
      <LineByLineSlide
        text={
          "Eleven new transitions\nFrame-driven, deterministic renders\nEach one lands in your repo"
        }
        fontSize={48}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 15 — Install. The headline assembles; the command resolves below.
// ===========================================================================
const InstallScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cmdOpacity = interpolate(frame, [54, 70], [0, 1], clampOpts);
  const cmdY = interpolate(frame, [54, 74], [16, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const cmdBlur = interpolate(frame, [54, 70], [6, 0], clampOpts);

  return (
    <AbsoluteFill style={{ background: OBSIDIAN }}>
      <Sequence durationInFrames={S_INSTALL - T_OUTRO}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "translateY(-40px)",
          }}
        >
          <BlurOutUp
            text="Any cut, one command"
            fontSize={56}
            fontWeight={400}
            color={INK}
            staggerDelay={3}
          />
        </div>
      </Sequence>
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
        <span style={{ fontFamily: MONO, fontSize: 27, color: MUTED }}>
          <span style={{ color: FAINT }}>$ </span>
          npx shadcn add <span style={{ color: LIME }}>@remocn/whip-pan</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 16 — Outro. The push-through lands the camera on the lockup.
// ===========================================================================
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markIn = spring({
    frame: frame - 26,
    fps,
    config: { damping: 13, stiffness: 150, mass: 0.8 },
  });
  const markScale = interpolate(markIn, [0, 1], [0.5, 1]);

  const wordIn = spring({
    frame: frame - 36,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.9 },
  });
  const wordX = interpolate(wordIn, [0, 1], [-18, 0]);
  const wordOpacity = interpolate(frame, [36, 50], [0, 1], clampOpts);

  const creditOpacity = interpolate(frame, [96, 114], [0, 1], clampOpts);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: OBSIDIAN,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          transform: "translateY(-14px)",
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
        Shader transitions built on Paper's shaders
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// The one plain cut left in the video — hook → announcement.
// ===========================================================================
type EmptyProps = Record<string, never>;

const CrossfadePresentation: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const opacity = entering ? presentationProgress : 1 - presentationProgress;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
const crossfade = (): TransitionPresentation<EmptyProps> => ({
  component: CrossfadePresentation,
  props: {},
});

// ===========================================================================
// Composition root.
// ===========================================================================
const SHOWCASE_SCENES = BEATS.reduce((acc, b) => acc + b.dur, 0);
const SHOWCASE_TRANSITIONS = BEATS.reduce((acc, b) => acc + b.tIn, 0);

export const NEW_TRANSITIONS_DURATION =
  S_HOOK +
  S_INTRO +
  SHOWCASE_SCENES +
  S_VALUE +
  S_INSTALL +
  S_OUTRO -
  (T_XF + SHOWCASE_TRANSITIONS + T_VALUE + T_INSTALL + T_OUTRO);

export const NewTransitionsDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          // remocn typography components read this CSS variable.
          "--font-geist-sans": SANS_FAMILY,
          background: OBSIDIAN,
          fontFamily: SANS,
        } as React.CSSProperties
      }
    >
      <TransitionSeries>
        {/* 1 — Hook */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_XF })}
          presentation={crossfade()}
        />

        {/* 2 — The announcement */}
        <TransitionSeries.Sequence durationInFrames={S_INTRO}>
          <IntroScene />
        </TransitionSeries.Sequence>

        {/* 3–13 — The showcase: each beat enters through the cut it names.
            Flat array (no fragments) — TransitionSeries only accepts direct
            Sequence/Transition children. */}
        {BEATS.flatMap((beat) => [
          <TransitionSeries.Transition
            key={`${beat.name}-transition`}
            timing={linearTiming({ durationInFrames: beat.tIn })}
            presentation={beat.presentation()}
          />,
          <TransitionSeries.Sequence
            key={`${beat.name}-scene`}
            durationInFrames={beat.dur}
          >
            <ShowcaseFrame
              name={beat.name}
              transparent={beat.transparent}
              veil={beat.veil}
              tint={beat.tint}
            />
          </TransitionSeries.Sequence>,
        ])}

        {/* 14 — Value block, entered via a reused focus-pull */}
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_VALUE })}
          presentation={focusPull()}
        />
        <TransitionSeries.Sequence durationInFrames={S_VALUE}>
          <ValueScene />
        </TransitionSeries.Sequence>

        {/* 15 — Install, entered via a reused whip-pan (up) */}
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_INSTALL })}
          presentation={whipPan({ direction: "up" })}
        />
        <TransitionSeries.Sequence durationInFrames={S_INSTALL}>
          <InstallScene />
        </TransitionSeries.Sequence>

        {/* 16 — Outro, the camera lands on the brand */}
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_OUTRO })}
          presentation={pushThrough()}
        />
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
