import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { demoAsset } from "@/lib/demo-assets";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { loadFont as loadSans } from "@remotion/google-fonts/Geist";

import { ShaderGodRays } from "@/components/remocn/shader-god-rays";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";

// shieldcn speaks shadcn's language — Geist Sans everywhere.
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700", "800"],
});

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

// shieldcn palette — the shadcn zinc register plus the badge-value green.
const BG = "#09090b";
const INK = "#fafafa";
const MUTED = "#a1a1aa";
const FAINT = "rgba(250,250,250,0.5)";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_INTRO = 60; //   centered real badge, springing in with a float
const S_HOOK = 72; //    text animation
const S_MAIN = 112; //   Remocn ✕ shieldcn lockup
const S_BALLET = 220; // badge ballet: blur-formed circle → spin → row → exit

const T_X = 16; //  crossfade
const T_ZB = 18; // zoom-blur
const T_XB = 14; // crossfade into the ballet

export const SPONSOR_SHIELDCN_DURATION =
  S_INTRO + S_HOOK + S_MAIN + S_BALLET - (T_ZB + T_X + T_XB);

// The real shieldcn logo mark. When drawProgress is provided, the two paths
// draw themselves on as strokes and the fill resolves via fillProgress.
const LOGO_PATHS = [
  "M148.02,363.76c-4.48,0-8.64-2.42-10.86-6.32l-54.29-95.68c-2.15-3.8-2.15-8.52,0-12.32l54.29-95.68c2.21-3.9,6.37-6.32,10.86-6.32h18.51c4.44,0,8.45,2.28,10.73,6.09,2.27,3.82,2.37,8.43.25,12.33l-42.23,77.99c-3.98,7.36-3.98,16.14,0,23.49l22.22,41.02c4.25,7.85,12.43,12.8,21.36,12.92,0,0,45.08.61,45.11.61,8.68,0,16.83-4.64,21.26-12.12l24.87-41.99c2.23-3.77,6.34-6.11,10.72-6.12l19.47-.04c4.48,0,8.49,2.29,10.76,6.12,2.27,3.83,2.35,8.45.21,12.35l-42.2,77.17c-2.19,4-6.39,6.49-10.95,6.49h-110.08Z",
  "M346.7,363.69c-4.44,0-8.45-2.28-10.73-6.09-2.27-3.82-2.37-8.43-.25-12.33l42.23-77.99c3.98-7.35,3.98-16.14,0-23.49l-22.22-41.02c-4.25-7.85-12.44-12.8-21.36-12.92,0,0-46.51-.63-46.53-.63-8.88,0-17.12,4.81-21.48,12.54l-23.35,41.36c-2.2,3.9-6.36,6.34-10.84,6.35l-19.21.04c-4.48,0-8.49-2.29-10.76-6.12-2.27-3.83-2.35-8.45-.22-12.36l42.2-77.17c2.19-4.01,6.39-6.5,10.95-6.5h110.08c4.48,0,8.64,2.42,10.86,6.32l54.29,95.68c2.16,3.8,2.16,8.52,0,12.32l-54.29,95.68c-2.21,3.9-6.37,6.32-10.86,6.32h-18.51Z",
];

const ShieldcnLogo: React.FC<{
  size?: number;
  color?: string;
  drawProgress?: number;
  fillProgress?: number;
}> = ({ size = 96, color = INK, drawProgress, fillProgress }) => {
  const drawing = drawProgress !== undefined;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      aria-hidden
    >
      {LOGO_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={color}
          {...(drawing
            ? {
                pathLength: 1,
                strokeDasharray: 1,
                strokeDashoffset: 1 - drawProgress,
                stroke: color,
                strokeWidth: 10,
                strokeLinecap: "round" as const,
                fillOpacity: fillProgress ?? 1,
              }
            : {})}
        />
      ))}
    </svg>
  );
};

const RealBadge: React.FC<{ name: string; height?: number }> = ({
  name,
  height = 26,
}) => (
  <Img
    src={demoAsset(`shieldcn/${name}.svg`)}
    style={{ height, width: "auto", display: "block", flex: "none" }}
  />
);

// ===========================================================================
// Scene 1 — Intro. A single real shieldcn badge, centered, springing in with
// a gentle float — the badge plays the role sponsor-ln gave the emoji.
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
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          opacity: s,
          transform: `translateY(${float}px) scale(${scale})`,
          filter: "drop-shadow(0 22px 44px rgba(0,0,0,0.5))",
        }}
      >
        <RealBadge name="stars-shieldcn" height={84} />
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
      text="Say hello to my new sponsor"
      fontSize={54}
      fontWeight={600}
      color={INK}
      blur={14}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 3 — Main. The sponsor lockup, same choreography as sponsor-ln:
//   1. The shield mark + name pop in, centered, and hold briefly.
//   2. The (mark + name) group slides right while the Remocn wordmark pushes
//      in from the left and a cross appears between them.
// ===========================================================================
const MARK_SIZE = 168; //      DOM (entrance) size of the shield chip
const MARK_FINAL_SIZE = 84; // shrinks to this once settled inline
const FINAL_SCALE = MARK_FINAL_SIZE / MARK_SIZE;

// Final-layout horizontal centres (canvas is 1280 wide → centre at 640).
const REMOCN_X = 420; // centre of the "Remocn" wordmark
// Right edge of "Remocn" as rendered at fontSize 76 / weight 700 (measured).
const REMOCN_RIGHT = REMOCN_X + 141;
const MARK_X = 750; // centre of the shield chip
// The SVG box carries ~14px of dead space around the drawn mark at inline
// size, so a tiny gap keeps the name visually snug against the logo.
const NAME_GAP = 2;
const CROSS_X = Math.round(
  (REMOCN_RIGHT + (MARK_X - MARK_FINAL_SIZE / 2)) / 2,
);
const ROW_Y = 350; // vertical centre of the row

// Frame the group starts sliding right (and Remocn / cross start entering) —
// after the logo has finished drawing itself on.
const SPLIT_AT = 60;

// The bare logo mark, exactly as the shieldcn site renders it: currentColor
// (foreground ink), no chip, no border. Draws itself on as a stroke.
const ShieldMark: React.FC<{ draw: number; fill: number }> = ({
  draw,
  fill,
}) => (
  <div
    style={{
      width: MARK_SIZE,
      height: MARK_SIZE,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.5))",
    }}
  >
    <ShieldcnLogo size={MARK_SIZE} drawProgress={draw} fillProgress={fill} />
  </div>
);

const MainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1 — The logo draws itself on, centered; the fill and the name resolve
  // while the stroke completes. Starts after the incoming crossfade ends so
  // the stroke never draws over the outgoing hook text.
  const draw = interpolate(frame, [16, 46], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const fill = interpolate(frame, [38, 54], [0, 1], clampOpts);
  const nameIn = interpolate(frame, [30, 46], [0, 1], clampOpts);

  // 2 — The group slides from screen centre (640) to its final slot (MARK_X).
  const slide = spring({
    frame: frame - SPLIT_AT,
    fps,
    config: { damping: 16, stiffness: 110, mass: 1 },
  });
  const groupX = interpolate(slide, [0, 1], [640 - MARK_X, 0]);
  // As it slides right, the chip shrinks down to the inline size.
  const shrink = interpolate(slide, [0, 1], [1, FINAL_SCALE], clampOpts);
  const markScale = shrink;
  // "shieldcn" follows the chip's (shrinking) right edge at a fixed gap.
  const nameLeft = MARK_X + (MARK_SIZE * shrink) / 2 + NAME_GAP;

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

      {/* Shield mark — draws on centred, then slides right with the name. */}
      <div
        style={{
          position: "absolute",
          left: MARK_X,
          top: ROW_Y,
          transform: `translate(-50%, -50%) translateX(${groupX}px) scale(${markScale})`,
        }}
      >
        <ShieldMark draw={draw} fill={fill} />
      </div>

      {/* Sponsor name — sits to the right of the chip and travels with it. */}
      <span
        style={{
          position: "absolute",
          left: nameLeft,
          top: ROW_Y,
          transform: `translate(0, -50%) translateX(${groupX}px)`,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 44,
          color: INK,
          letterSpacing: "-0.02em",
          opacity: nameIn,
        }}
      >
        shieldcn
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 4 — Finale. The badge ballet from the shieldcn demo, with a more
// cinematic formation: instead of a scattered pop, each badge resolves out of
// blur + opacity already on the circle, drifting inward from a wider radius
// while the whole ring slowly winds into place. Then the full turn, the fall
// into a row, and the ride off-screen — closed by the shieldcn.dev tag.
// ===========================================================================
const BALLET_BADGES = [
  "npm-react",
  "stars-nextjs",
  "views-shieldcn",
  "license-shieldcn",
  "stars-shieldcn",
  "npm-react-secondary",
  "npm-react-outline",
  "npm-react-ghost",
  "npm-react-destructive",
  "npm-typescript",
];

const BALLET_N = BALLET_BADGES.length;
const BALLET_R = 190; //  circle radius
const BALLET_SLOT = 116; // row slot width

// Ballet timeline (scene-local frames)
const B_FORM_STAGGER = 3; // per-badge delay of the blur resolve
const B_FORM_DUR = 26; //   per-badge blur/opacity resolve length
const B_WIND: [number, number] = [0, 64]; // ring slowly winds into place
const B_SPIN: [number, number] = [66, 116];
const B_ALIGN: [number, number] = [116, 138];
const B_EXIT: [number, number] = [140, 160];
// The outro rides in on the tail of the exiting badge row.
const OUTRO_FROM = 154;

const BadgeBallet: React.FC = () => {
  const frame = useCurrentFrame();
  const ease = Easing.inOut(Easing.cubic);
  // The ring settles from a slight counter-rotation while badges resolve.
  const wind = interpolate(frame, B_WIND, [-0.4, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const rot = interpolate(frame, B_SPIN, [0, Math.PI * 2], {
    ...clampOpts,
    easing: ease,
  });
  const aP = interpolate(frame, B_ALIGN, [0, 1], {
    ...clampOpts,
    easing: ease,
  });
  const eP = interpolate(frame, B_EXIT, [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });
  return (
    <>
      {BALLET_BADGES.map((name, i) => {
        const t0 = 4 + i * B_FORM_STAGGER;
        // Cinematic formation — each badge resolves out of blur + opacity,
        // drifting inward from a wider radius onto its circle slot.
        const form = interpolate(frame, [t0, t0 + B_FORM_DUR], [0, 1], {
          ...clampOpts,
          easing: Easing.out(Easing.cubic),
        });
        const radius = BALLET_R * (1.35 - 0.35 * form);
        const blurVal = (1 - form) * 18;
        const formScale = 1.16 - 0.16 * form;

        const base = -Math.PI / 2 + (i * 2 * Math.PI) / BALLET_N;
        const cx = Math.cos(base + wind + rot) * radius;
        const cy = Math.sin(base + wind + rot) * radius;
        // circle (carrying the spin) → row → exit
        const rowX = (i - (BALLET_N - 1) / 2) * BALLET_SLOT;
        const x = cx + (rowX - cx) * aP - eP * 1750;
        const y = cy + (0 - cy) * aP;
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${formScale})`,
              opacity: form,
              filter: blurVal > 0.2 ? `blur(${blurVal}px)` : undefined,
            }}
          >
            <RealBadge name={name} height={26} />
          </div>
        );
      })}
    </>
  );
};

// Outro line — resolves out of blur + opacity. By default it rises gently;
// with fromX it glides in from the right, as if the exiting badge row pulled
// it onto the stage.
const OutroLine: React.FC<{
  children: React.ReactNode;
  delay: number;
  fromX?: number;
}> = ({ children, delay, fromX = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + (fromX ? 28 : 20)], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const transform = fromX
    ? `translateX(${(1 - p) * fromX}px)`
    : `translateY(${(1 - p) * 14}px)`;
  return (
    <div
      style={{
        opacity: p,
        transform,
        filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

const BalletScene: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <BadgeBallet />
    <Sequence from={OUTRO_FROM} layout="none">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <OutroLine delay={0} fromX={420}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ShieldcnLogo size={76} />
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 54,
                letterSpacing: "-0.02em",
                color: INK,
              }}
            >
              shieldcn
            </span>
          </div>
        </OutroLine>
        <OutroLine delay={16}>
          <span style={{ fontFamily: SANS, fontSize: 19, color: MUTED }}>
            Badges, charts, headers — as real shadcn/ui components.
          </span>
        </OutroLine>
      </div>
    </Sequence>
  </AbsoluteFill>
);

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
export const SponsorShieldcnDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-geist-sans": SANS_FAMILY,
          background: BG,
        } as React.CSSProperties
      }
    >
      {/* Persistent shader backdrop — god rays in the zinc register with a
          whisper of badge green: a slow spotlight for the sponsor reveal. */}
      <ShaderGodRays
        speed={0.35}
        colorBack={BG}
        colorBloom="#14352a"
        colors={["#1a1a1f", "#232329", "#2f4a3c", "#3b3b44"]}
        intensity={0.55}
        density={0.28}
        bloom={0.35}
      />
      {/* Vignette scrim to focus the center. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 42%, rgba(9,9,11,0.35) 0%, rgba(9,9,11,0.85) 100%)",
        }}
      />

      <TransitionSeries>
        {/* 1 — Intro badge */}
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
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_XB })}
          presentation={crossfade()}
        />

        {/* 4 — Badge ballet finale */}
        <TransitionSeries.Sequence durationInFrames={S_BALLET}>
          <BalletScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
