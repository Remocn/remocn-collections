import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { demoAsset } from "@/lib/demo-assets";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { Gif } from "@remotion/gif";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";

import { Backdrop } from "@/components/remocn/backdrop";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";

// Bind the sans font to the CSS variable the remocn typography components read.
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700", "800"],
});

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const INK = "#fafafa";
const FAINT = "rgba(250,250,250,0.5)";
const ACCENT = "#a78bfa";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_INTRO = 60; //  centered animated emoji
const S_HOOK = 72; //   text animation
const S_MAIN = 100; //  sponsor lockup

const T_X = 16; //  crossfade
const T_ZB = 18; // zoom-blur

export const SPONSOR_LN_DURATION = S_INTRO + S_HOOK + S_MAIN - (T_ZB + T_X);

// ===========================================================================
// Scene 1 — Intro. A single animated emoji, centered, springing in with a
// gentle float.
// ===========================================================================
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150, mass: 0.9 },
  });
  const scale = interpolate(s, [0, 1], [0.4, 1]);
  const float = Math.sin(frame / 14) * 8;
  const size = 260;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: size,
          height: size,
          opacity: s,
          transform: `translateY(${float}px) scale(${scale})`,
          filter: "drop-shadow(0 22px 44px rgba(0,0,0,0.5))",
        }}
      >
        <Gif
          src={demoAsset("emoji.gif")}
          width={size}
          height={size}
          fit="contain"
        />
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 2 — Hook. Text animation via remocn's soft-blur-in typography.
// ===========================================================================
const HookScene: React.FC = () => (
  <AbsoluteFill style={{ padding: "0 90px" }}>
    <SoftBlurIn
      text="Say hello my new sponsor"
      fontSize={56}
      fontWeight={600}
      color={INK}
      blur={14}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 3 — Main. The sponsor block on the logo, choreographed:
//   1. The LN avatar + name pop in, centered on screen, and hold briefly.
//   2. The (avatar + name) group slides to the right while, in sync, the
//      Remocn wordmark pushes in from the left and a cross appears between them.
// Implemented with absolute positioning so the group can travel from centre to
// its final slot deterministically.
// ===========================================================================
const AVATAR_SIZE = 168; // DOM (entrance) size — the avatar first appears at this
const AVATAR_FINAL_SIZE = 84; // shrinks to this once settled inline with the text
const FINAL_SCALE = AVATAR_FINAL_SIZE / AVATAR_SIZE;

// Final-layout horizontal centres (canvas is 1280 wide → centre at 640).
const REMOCN_X = 470; // centre of the "Remocn" wordmark
// Right edge of "Remocn" as rendered at fontSize 76 / weight 700 (measured).
const REMOCN_RIGHT = 611;
const AVATAR_X = 800; // centre of the avatar
const NAME_GAP = 28; // gap between the avatar's right edge and the "LN" name
// The cross sits evenly between Remocn's right edge and the avatar's FINAL left edge.
const CROSS_X = Math.round(
  (REMOCN_RIGHT + (AVATAR_X - AVATAR_FINAL_SIZE / 2)) / 2,
);
const ROW_Y = 350; // vertical centre of the row

// Frame the group starts sliding right (and Remocn / cross start entering).
const SPLIT_AT = 34;

const AvatarVisual: React.FC = () => (
  <div
    style={{ position: "relative", width: AVATAR_SIZE, height: AVATAR_SIZE }}
  >
    {/* Soft accent halo behind the portrait. */}
    <div
      style={{
        position: "absolute",
        inset: -18,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${ACCENT}55 0%, transparent 68%)`,
      }}
    />
    <Img
      src={demoAsset("ln.jpg")}
      style={{
        position: "relative",
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid rgba(250,250,250,0.9)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
      }}
    />
  </div>
);

const MainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1 — Avatar + name pop in, centered.
  const pop = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 150, mass: 0.9 },
  });
  const popScale = interpolate(pop, [0, 1], [0.6, 1]);

  // 2 — The group slides from screen centre (640) to its final slot (AVATAR_X).
  const slide = spring({
    frame: frame - SPLIT_AT,
    fps,
    config: { damping: 16, stiffness: 110, mass: 1 },
  });
  const groupX = interpolate(slide, [0, 1], [640 - AVATAR_X, 0]);
  // As it slides right, the avatar shrinks from full size down to the inline
  // size so it sits exactly on the text row.
  const shrink = interpolate(slide, [0, 1], [1, FINAL_SCALE], clampOpts);
  const avatarScale = popScale * shrink;
  // "LN" follows the avatar's (shrinking) right edge at a fixed gap.
  const nameLeft = AVATAR_X + (AVATAR_SIZE * shrink) / 2 + NAME_GAP;

  // Remocn pushes in from the left, in sync with the slide.
  const remocnOpacity = interpolate(
    frame,
    [SPLIT_AT + 2, SPLIT_AT + 24],
    [0, 1],
    clampOpts,
  );
  const remocnX = interpolate(frame, [SPLIT_AT + 2, SPLIT_AT + 26], [-36, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  // The cross appears between them, slightly after the split begins.
  const crossSpring = spring({
    frame: frame - (SPLIT_AT + 8),
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.7 },
  });
  const crossOpacity = interpolate(
    frame,
    [SPLIT_AT + 8, SPLIT_AT + 20],
    [0, 1],
    clampOpts,
  );
  const crossScale = interpolate(crossSpring, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill>
      {/* Remocn wordmark — enters from the left. */}
      <span
        style={{
          position: "absolute",
          left: REMOCN_X,
          top: ROW_Y,
          transform: `translate(-50%, -50%) translateX(${remocnX}px)`,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 76,
          letterSpacing: "-0.03em",
          color: INK,
          opacity: remocnOpacity,
          whiteSpace: "nowrap",
        }}
      >
        Remocn
      </span>

      {/* Cross — appears between the two. */}
      <span
        style={{
          position: "absolute",
          left: CROSS_X,
          top: ROW_Y,
          transform: `translate(-50%, -50%) scale(${crossScale})`,
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 52,
          color: FAINT,
          opacity: crossOpacity,
        }}
      >
        ✕
      </span>

      {/* Avatar — pops in centred, then slides right with the name. */}
      <div
        style={{
          position: "absolute",
          left: AVATAR_X,
          top: ROW_Y,
          transform: `translate(-50%, -50%) translateX(${groupX}px) scale(${avatarScale})`,
          opacity: pop,
        }}
      >
        <AvatarVisual />
      </div>

      {/* Sponsor name — sits to the right of the avatar and travels with it. */}
      <span
        style={{
          position: "absolute",
          left: nameLeft,
          top: ROW_Y,
          transform: `translate(0, -50%) translateX(${groupX}px)`,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 44,
          color: INK,
          letterSpacing: "-0.01em",
          opacity: pop,
        }}
      >
        LN
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
export const SponsorLnDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-geist-sans": SANS_FAMILY,
          background: "#0a0a0a",
        } as React.CSSProperties
      }
    >
      {/* Persistent image background for the whole video. */}
      <Backdrop fill={{ type: "image", src: demoAsset("bg.png") }} />
      {/* Scrim to deepen contrast for the foreground content. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 42%, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.82) 100%)",
        }}
      />

      <TransitionSeries>
        {/* 1 — Intro emoji */}
        <TransitionSeries.Sequence durationInFrames={S_INTRO}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_ZB })}
          presentation={zoomBlur()}
        />

        {/* 2 — Hook text */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 3 — Main sponsor lockup */}
        <TransitionSeries.Sequence durationInFrames={S_MAIN}>
          <MainScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
