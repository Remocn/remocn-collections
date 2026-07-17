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
import { fade } from "@remotion/transitions/fade";

import { ShaderGrainGradient } from "@/components/remocn/shader-grain-gradient";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { Typewriter } from "@/components/remocn/typewriter";
import { pushThrough } from "@/components/remocn/push-through";
import { whipPan } from "@/components/remocn/whip-pan";
import { focusPull } from "@/components/remocn/focus-pull";
import { grainDissolve } from "@/components/remocn/grain-dissolve";

import {
  BG,
  BRIGHT,
  HAIRLINE,
  INK,
  MONO,
  MONO_FAMILY,
  MUTED,
  SANS,
  SANS_FAMILY,
  clampOpts,
} from "./theme";
import { GridArc, GridLine } from "./decorations";
import { LogotypeDraw } from "./logotype";
import { OptimizationsIllo, RscIllo, StreamingIllo } from "./features";
import { PoweredByScene } from "./powered-by";

const easeOut = Easing.out(Easing.cubic);
const easeSoft = Easing.bezier(0.2, 0.8, 0.2, 1);

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). The flight: the eclipse triangle hooks,
// the camera dives INTO it and falls through the grain-ring tunnel (the
// introducing-videorc dive, in grayscale) onto the logotype writing itself;
// the nextjs.org hero rebuilds around its own construction lines; the
// receipts glide past; three feature illustrations play as stations; the
// Powered By circuit lights up; the numbers land; one grain cover marks the
// install; the blueprint lockup closes the loop. One grayscale grain
// gradient carries the whole video.
// ---------------------------------------------------------------------------
const S_HOOK = 66; // the opening line, slammed in and held before the eclipse
const S_ECLIPSE = 68; // camera dives into the triangle; the logo-approach takes over
// Kept as S_ECLIPSE = DIVE_TO + T_APPROACH so the swallow lands exactly as the
// approach transition begins — the wordmark rushes in ~2s into the video.
const S_LOGOTYPE = 64; // ~22f approach + ~1s hold + 12f fade out
const S_HERO = 176;
const F_STATION = 116; // each feature station
const T_WHIP = 12;
const S_FEATURES = F_STATION * 3 - T_WHIP * 2;
const S_POWERED = 160;
const S_COMMAND = 96;
const S_LOCKUP = 150;

const T_APPROACH = 22; // the wordmark rushes to meet the camera — short, not a long hold
const T_FADE = 12;
const T_PUSH = 22; // Command → Features focus-pull — long enough to read the rack
const T_FEAT = 14;
const T_GRAIN = 34; // Hero → Command grain wash — long enough to ease in, not pop

export const INTRODUCING_NEXTJS_DURATION =
  S_HOOK +
  S_ECLIPSE +
  S_LOGOTYPE +
  S_HERO +
  S_FEATURES +
  S_POWERED +
  S_COMMAND +
  S_LOCKUP -
  (T_FADE + T_APPROACH + T_FADE + T_GRAIN + T_PUSH + T_FEAT + T_FADE);

// ---------------------------------------------------------------------------
// Small shared pieces
// ---------------------------------------------------------------------------

// Barely-there push-in so no frame is ever static.
const Drift: React.FC<{ children: React.ReactNode; grow?: number }> = ({
  children,
  grow = 0.03,
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

// One continuous camera over the whole piece — a slow forward creep plus a
// faint sway, driven by the composition's ABSOLUTE frame, so the "camera"
// never resets at a cut. The transitions handle the per-scene handoffs; this
// is the connective tissue underneath them that keeps the video one take.
const CameraRig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;
  // Base >1 so the sway never reveals a frame edge; the creep is subtle by
  // design — a big global zoom reads as nausea, a small one as intention.
  const scale = 1.006 + t * 0.03 + Math.sin(frame * 0.012) * 0.004;
  const ty = Math.sin(frame * 0.008) * 3;
  return (
    <AbsoluteFill style={{ transform: `scale(${scale}) translateY(${ty}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

// The single light source of the flight. One palette, one mask — the eclipse
// and the logotype ride the SAME halo, so the triangle-portal cut between them
// is a continuous field of light, not two patched-in glows.
const HALO_COLORS = ["#3a3a3a", "#666666", "#9a9a9a"];

const GrainHalo: React.FC<{
  cx: number;
  cy: number;
  r: number;
  opacity?: number;
  breathe?: boolean;
}> = ({ cx, cy, r, opacity = 0.9, breathe = false }) => {
  const frame = useCurrentFrame();
  const b = breathe ? 1 + Math.sin(frame * 0.06) * 0.05 : 1;
  const mask =
    "radial-gradient(circle, rgba(0,0,0,1) 8%, rgba(0,0,0,0.45) 33%, transparent 62%)";
  return (
    <div
      style={{
        position: "absolute",
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        opacity,
        WebkitMaskImage: mask,
        maskImage: mask,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1280,
          height: 720,
          transform: `translate(-50%, -50%) scale(${b})`,
        }}
      >
        <ShaderGrainGradient
          colors={HALO_COLORS}
          colorBack={BG}
          softness={0.6}
          intensity={0.4}
          noise={0.7}
          speed={0.5}
          scale={1.6}
        />
      </div>
    </div>
  );
};

// Hook → Eclipse: no flat dissolve. The line pushes a touch further in and
// blows out while the eclipse is revealed BEHIND it, settling back from a
// slight over-scale — one camera pulling focus from the words to the image.
type EmptyProps = Record<string, never>;

const SoftDolly: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{
          transform: `scale(${interpolate(p, [0, 1], [1, 1.12], {
            ...clampOpts,
            easing: Easing.in(Easing.cubic),
          })})`,
          opacity: interpolate(p, [0.15, 0.7], [1, 0], clampOpts),
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${interpolate(p, [0, 1], [1.08, 1], {
          ...clampOpts,
          easing: easeSoft,
        })})`,
        opacity: interpolate(p, [0.2, 0.75], [0, 1], clampOpts),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
const softDolly = (): TransitionPresentation<EmptyProps> => ({
  component: SoftDolly,
  props: {},
});


// Words rise out of blur onto the baseline.
const RiseWords: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
}> = ({ text, delay = 0, stagger = 2.5 }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => {
        const p = interpolate(frame - delay - i * stagger, [0, 20], [0, 1], {
          ...clampOpts,
          easing: easeSoft,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: p,
              transform: `translateY(${(1 - p) * 18}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 7}px)` : undefined,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </>
  );
};

const Triangle: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <svg
    width={size}
    height={size * 0.882}
    viewBox="0 0 100 88.2"
    style={{ display: "block" }}
  >
    <path d="M50 0 L100 88.2 L0 88.2 Z" fill={color} />
  </svg>
);

// The official circle-N icon, kept for the lockup.
const N_DIAGONAL =
  "M149.508 157.52L69.142 54H54V125.97H66.114V69.384L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z";
const N_BAR = "M115 54H127V126H115V54Z";

const NextMark: React.FC<{ size: number; idPrefix: string }> = ({
  size,
  idPrefix,
}) => (
  <svg width={size} height={size} viewBox="0 0 180 180">
    <defs>
      <linearGradient
        id={`${idPrefix}-d`}
        x1="109"
        y1="116.5"
        x2="144.5"
        y2="160.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id={`${idPrefix}-b`}
        x1="121"
        y1="54"
        x2="120.8"
        y2="106.9"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="90" cy="90" r="88" fill="#000000" />
    <circle
      cx="90"
      cy="90"
      r="88"
      fill="none"
      stroke="rgba(237,237,237,0.3)"
      strokeWidth="1.5"
    />
    <path d={N_BAR} fill={`url(#${idPrefix}-b)`} />
    <path d={N_DIAGONAL} fill={`url(#${idPrefix}-d)`} />
  </svg>
);

// ===========================================================================
// Scene 1 — The eclipse. The backlit triangle over the grain field, the hook
// beneath it, and then the camera dives INTO the triangle — its flat black
// swallows the frame and the ring tunnel is already there beneath.
// ===========================================================================
const ECLIPSE_CX = 640;
const ECLIPSE_CY = 322;
// The camera flies INTO the ▲: the eclipse scales up from the triangle center
// so its flat-black interior swallows the frame, finishing exactly as the
// logo-approach transition takes over (DIVE_TO === S_ECLIPSE − T_APPROACH).
const DIVE_FROM = 28;
const DIVE_TO = 46;

// ===========================================================================
// Scene 0 — The opening line. Alone on black, it SLAMS in: crashing down out
// of an over-scale and heavy blur to a hard settle, then a slow, pompous
// push-in holds the claim before the eclipse.
// ===========================================================================
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Brutal impact — over-scale + heavy blur crash into place, a hard settle.
  const slam = interpolate(frame, [0, 9, 15], [1.42, 0.985, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.exp),
  });
  const op = interpolate(frame, [0, 5], [0, 1], clampOpts);
  // Pompous hold — a slow, majestic push-in after the impact lands.
  const grand = interpolate(frame, [15, S_HOOK], [1, 1.05], clampOpts);
  // A short decaying shake sells the crash.
  const shake = Math.sin(frame * 2.1) * Math.max(0, 1 - frame / 9) * 4;
  // Brutal exit — the line blasts outward and dissolves before the eclipse,
  // so it never lingers over the triangle during the cut.
  const exit = interpolate(frame, [S_HOOK - 16, S_HOOK - 2], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });
  const blur = interpolate(frame, [0, 11], [24, 0], clampOpts) + exit * 26;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 64,
          color: BRIGHT,
          textAlign: "center",
          padding: "0 90px",
          opacity: op * (1 - exit),
          transform: `translateY(${shake}px) scale(${slam * grand * (1 + exit * 0.2)})`,
          filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
        }}
      >
        You've already used Next.js today
      </div>
    </AbsoluteFill>
  );
};

const EclipseScene: React.FC = () => {
  const frame = useCurrentFrame();

  const glowIn = interpolate(frame, [0, 14], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  // Fly INTO the triangle — the flat black interior grows to swallow the frame,
  // completing right as the approach transition hands over to the logotype.
  const dive = interpolate(frame, [DIVE_FROM, DIVE_TO], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${1 + dive * 56})`,
        transformOrigin: `${ECLIPSE_CX}px ${ECLIPSE_CY}px`,
      }}
    >
      {/* The grainy halo — the single flight light, carried on into the
          logotype's approach as the same bloom. */}
      <AbsoluteFill style={{ opacity: glowIn }}>
        <GrainHalo cx={ECLIPSE_CX} cy={ECLIPSE_CY} r={360} opacity={0.9} breathe />
      </AbsoluteFill>
      {/* The rim hugging the edges. */}
      <div
        style={{
          position: "absolute",
          left: ECLIPSE_CX,
          top: ECLIPSE_CY,
          transform: "translate(-50%, -50%) scale(1.055)",
          filter: "blur(13px)",
          opacity: glowIn * 0.85,
        }}
      >
        <Triangle size={238} color="#f0f0f2" />
      </div>
      {/* The monolith. */}
      <div
        style={{
          position: "absolute",
          left: ECLIPSE_CX,
          top: ECLIPSE_CY,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Triangle size={238} color="#000000" />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// The triangle dive — we fell INTO a triangle, so we fall THROUGH triangles:
// concentric triangular rings zoom past the lens (born small at the center,
// blurring as they pass), a grainy halo breathing at the vanishing point.
// The eclipse scene does its own swallow; this dissolves the flat black once
// it fills the frame, holds the tunnel readable, then settles onto the
// logotype. Same dive mechanics as introducing-videorc, triangular geometry.
// ---------------------------------------------------------------------------
// Eclipse → Logotype. We've flown THROUGH the ▲ and the frame is black; now the
// wordmark rushes TO MEET the camera out of that black — small → full, out of
// blur, fading up — riding a fresh bloom of the SAME grain light. No clip mask,
// no second triangle: one continuous flight into the logo.
const LogoApproach: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    // The eclipse's black already fills the frame; clear the residual fast.
    return (
      <AbsoluteFill
        style={{ opacity: interpolate(p, [0, 0.4], [1, 0], clampOpts) }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  // The pool of light the wordmark emerges into — blooms, then hands off to the
  // scene's own ambient grain.
  const haloOpacity = interpolate(p, [0, 0.4, 0.85, 1], [0, 0.9, 0.9, 0], {
    ...clampOpts,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: haloOpacity }}>
        <GrainHalo cx={640} cy={360} r={340} opacity={1} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: interpolate(p, [0.12, 0.5], [0, 1], clampOpts),
          transform: `scale(${interpolate(p, [0, 1], [0.32, 1], {
            ...clampOpts,
            easing: Easing.out(Easing.cubic),
          })})`,
          filter: `blur(${interpolate(p, [0.12, 0.82], [16, 0], clampOpts)}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const logoApproach = (): TransitionPresentation<EmptyProps> => ({
  component: LogoApproach,
  props: {},
});

// ===========================================================================
// Scene 2 — The logotype. The approach delivers the full official wordmark,
// rushing out of the black to meet the camera; here it just holds and drifts.
// ===========================================================================
const LOGOTYPE_W = 680;

const LogotypeScene: React.FC = () => (
  <Drift grow={0.05}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <LogotypeDraw width={LOGOTYPE_W} start={-200} color={BRIGHT} />
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 3 — The hero, rebuilt. The construction lines draw in first, the
// marker circles settle on their intersections, and the page assembles in
// reading order: headline, subtitle, buttons, the shell line.
// ===========================================================================
// The cursor drifts to Get Started and clicks; the click hands the frame to
// the install command that follows (the grain dissolve begins right after).
const HERO_BTN_X = 560; // Get Started button center
const HERO_BTN_Y = 516;
const HERO_CURSOR_IN = 52; // cursor fades in as the page finishes snapping in
const HERO_CLICK = 112; // the click — the cursor's slow drift fills the hold

const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fast assembly — the page snaps in at the eclipse's rhythm (~a dozen frames
  // per element, tightly staggered), not the old leisurely ~100f build.
  const blockIn = (from: number) =>
    interpolate(frame - from, [0, 12], [0, 1], {
      ...clampOpts,
      easing: easeSoft,
    });
  const button = (from: number) =>
    spring({
      frame: frame - from,
      fps,
      config: { damping: 13, stiffness: 170, mass: 0.7 },
    });

  const sub1 = blockIn(10);
  const sub2 = blockIn(14);
  const btn1 = button(18);
  const btn2 = button(22);
  const npxIn = blockIn(28);

  // Cursor: fade in, glide to Get Started, click; the button dips and a ring
  // pulses out of the click.
  const curAppear = interpolate(
    frame,
    [HERO_CURSOR_IN, HERO_CURSOR_IN + 8],
    [0, 1],
    clampOpts,
  );
  const curMove = interpolate(
    frame,
    [HERO_CURSOR_IN + 2, HERO_CLICK - 2],
    [0, 1],
    { ...clampOpts, easing: easeSoft },
  );
  const curX = interpolate(curMove, [0, 1], [726, HERO_BTN_X]);
  const curY = interpolate(curMove, [0, 1], [614, HERO_BTN_Y]);
  const curPress = interpolate(
    frame,
    [HERO_CLICK, HERO_CLICK + 4, HERO_CLICK + 9],
    [1, 0.8, 1],
    clampOpts,
  );
  const btnPress = interpolate(
    frame,
    [HERO_CLICK, HERO_CLICK + 4, HERO_CLICK + 12],
    [0, 1, 0],
    clampOpts,
  );
  const ripple = interpolate(
    frame,
    [HERO_CLICK, HERO_CLICK + 20],
    [0, 1],
    clampOpts,
  );

  return (
    <Drift>
      <AbsoluteFill>
        {/* Construction lines — the intro-module guides, drawing in. */}
        <GridLine orientation="v" at={150} from={50} to={670} start={0} />
        <GridLine orientation="v" at={1130} from={50} to={670} start={2} />
        <GridLine orientation="h" at={168} from={40} to={1240} start={1} />
        <GridLine orientation="h" at={318} from={40} to={1240} start={3} />
        <GridLine orientation="h" at={452} from={150} to={1130} start={5} />
        <GridLine orientation="h" at={604} from={230} to={1050} start={7} />
        <GridArc cx={150} cy={168} start={4} drift={1.4} />
        <GridArc cx={1130} cy={318} start={8} drift={-1.1} />
        <GridArc cx={890} cy={604} start={12} drift={0.9} />

        {/* Headline — their exact words, their weight. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 214,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 56,
            lineHeight: 1.15,
            color: BRIGHT,
            whiteSpace: "pre",
          }}
        >
          <RiseWords text="The React Framework for the Web" delay={2} stagger={1.4} />
        </div>

        {/* Subtitle — verbatim, the bold segment kept bold. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 360,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 23,
            lineHeight: 1.55,
            color: MUTED,
          }}
        >
          <div
            style={{
              opacity: sub1,
              transform: `translateY(${(1 - sub1) * 12}px)`,
            }}
          >
            Used by some of the world's largest companies, Next.js enables you to
          </div>
          <div
            style={{
              opacity: sub2,
              transform: `translateY(${(1 - sub2) * 12}px)`,
            }}
          >
            create{" "}
            <span style={{ color: INK, fontWeight: 600 }}>
              high-quality web applications
            </span>{" "}
            with the power of React components.
          </div>
        </div>

        {/* Buttons — the page's own pair. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 494,
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              height: 44,
              padding: "0 24px",
              borderRadius: 8,
              background: INK,
              color: "#0a0a0a",
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 15.5,
              display: "flex",
              alignItems: "center",
              opacity: Math.min(1, btn1 * 1.3),
              transform: `translateY(${(1 - btn1) * 14}px) scale(${1 - btnPress * 0.05})`,
              filter: btnPress > 0 ? `brightness(${1 - btnPress * 0.14})` : undefined,
            }}
          >
            Get Started
          </div>
          <div
            style={{
              height: 44,
              padding: "0 24px",
              borderRadius: 8,
              background: "#0a0a0a",
              border: `1px solid ${HAIRLINE}`,
              color: INK,
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 15.5,
              display: "flex",
              alignItems: "center",
              opacity: Math.min(1, btn2 * 1.3),
              transform: `translateY(${(1 - btn2) * 14}px)`,
            }}
          >
            Learn Next.js
          </div>
        </div>

        {/* The shell line the page keeps beneath its buttons. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 566,
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 15,
            color: MUTED,
            opacity: npxIn,
          }}
        >
          ▲ ~ npx create-next-app@latest
        </div>

        {/* Click ripple out of Get Started. */}
        {ripple > 0 && ripple < 1 && (
          <div
            style={{
              position: "absolute",
              left: HERO_BTN_X,
              top: HERO_BTN_Y,
              width: 44,
              height: 44,
              marginLeft: -22,
              marginTop: -22,
              borderRadius: "50%",
              border: `2px solid ${INK}`,
              opacity: (1 - ripple) * 0.5,
              transform: `scale(${0.4 + ripple * 2.4})`,
            }}
          />
        )}

        {/* The cursor — drifts in, glides to the button, clicks. */}
        {curAppear > 0 && (
          <div
            style={{
              position: "absolute",
              left: curX,
              top: curY,
              opacity: curAppear,
              transform: `scale(${curPress})`,
              transformOrigin: "4px 2px",
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))",
            }}
          >
            <svg width={24} height={26} viewBox="0 0 24 26">
              <path
                d="M4 2 L4 20 L9 15 L12 22.5 L15.2 21 L12.2 13.8 L18.5 13.8 Z"
                fill="#fafafa"
                stroke="#0a0a0a"
                strokeWidth={1.4}
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 4 — The features. Three illustration stations, each the nextjs.org
// card rebuilt live: image optimization assembling from pixels, HTML
// streaming its wireframe in, the server-component tree growing.
// ===========================================================================
const FeatureStation: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <Drift>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 252,
          transform: "translate(-50%, -50%)",
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 470,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 31,
          color: BRIGHT,
          whiteSpace: "pre",
        }}
      >
        <RiseWords text={title} delay={8} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 320,
          right: 320,
          top: 522,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 18.5,
          lineHeight: 1.5,
          color: MUTED,
        }}
      >
        <RiseWords text={subtitle} delay={16} stagger={1.2} />
      </div>
    </AbsoluteFill>
  </Drift>
);

const FeaturesScene: React.FC = () => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={F_STATION}>
        <FeatureStation
          title="Built-in Optimizations"
          subtitle="Automatic Image, Font, and Script Optimizations for improved UX and Core Web Vitals."
        >
          <OptimizationsIllo />
        </FeatureStation>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: T_WHIP })}
        presentation={whipPan({ direction: "left" })}
      />
      <TransitionSeries.Sequence durationInFrames={F_STATION}>
        <FeatureStation
          title="Dynamic HTML Streaming"
          subtitle="Instantly stream UI from the server, integrated with the App Router and React Suspense."
        >
          <StreamingIllo />
        </FeatureStation>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: T_WHIP })}
        presentation={whipPan({ direction: "left" })}
      />
      <TransitionSeries.Sequence durationInFrames={F_STATION}>
        <FeatureStation
          title="React Server Components"
          subtitle="Add components without sending additional client-side JavaScript. Built on the latest React features."
        >
          <RscIllo />
        </FeatureStation>
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 8 — The command. Alone in the center, in Geist Mono, nothing else on
// screen. The var override routes the registry Typewriter into the mono face.
// ===========================================================================
const CommandScene: React.FC = () => (
  // The portal delivers this scene on black; the typewriter starts once the
  // dive has settled, so the command types in clean center-frame.
  <AbsoluteFill>
    <Sequence from={26}>
      <AbsoluteFill
        style={{ "--font-geist-sans": MONO_FAMILY } as React.CSSProperties}
      >
        <Typewriter
          text="npx create-next-app@latest"
          fontSize={38}
          fontWeight={400}
          color={INK}
          cursorColor={INK}
          charsPerSecond={20}
        />
      </AbsoluteFill>
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 9 — Blueprint lockup. The construction lines brighten one step and
// frame the center; the circle-N settles in, "Next.js" beside it, nextjs.org
// beneath; the grid breathing.
// ===========================================================================
const LOCKUP_MARK = 96;
const LOCKUP_GAP = 26;
const LOCKUP_WORD_W = 178;
const LOCKUP_W = LOCKUP_MARK + LOCKUP_GAP + LOCKUP_WORD_W;
const LOCKUP_CY = 330;
const LOCKUP_X = 640 - LOCKUP_W / 2;

const LockupScene: React.FC = () => {
  const frame = useCurrentFrame();

  const markIn = interpolate(frame, [4, 26], [0, 1], {
    ...clampOpts,
    easing: easeSoft,
  });
  const guides = interpolate(frame, [10, 36], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  const breathe = 0.75 + Math.sin((frame / 96) * Math.PI * 2) * 0.12;

  const markCx = LOCKUP_X + LOCKUP_MARK / 2;
  const lineTop = LOCKUP_CY - LOCKUP_MARK / 2 - 16;
  const lineBottom = LOCKUP_CY + LOCKUP_MARK / 2 + 16;

  return (
    <AbsoluteFill>
      <svg
        width={1280}
        height={720}
        style={{
          position: "absolute",
          inset: 0,
          opacity: guides * breathe,
        }}
      >
        <circle
          cx={markCx}
          cy={LOCKUP_CY}
          r={LOCKUP_MARK / 2 + 16}
          fill="none"
          stroke="#2c2c2c"
          strokeWidth="1"
          strokeDasharray="5 7"
        />
        <line x1={0} x2={1280} y1={lineTop} y2={lineTop} stroke="#2c2c2c" strokeWidth="1" strokeDasharray="5 7" />
        <line x1={0} x2={1280} y1={lineBottom} y2={lineBottom} stroke="#2c2c2c" strokeWidth="1" strokeDasharray="5 7" />
        <line x1={640} x2={640} y1={90} y2={630} stroke="#2c2c2c" strokeWidth="1" strokeDasharray="5 7" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: markCx,
          top: LOCKUP_CY,
          transform: `translate(-50%, -50%) scale(${interpolate(
            markIn,
            [0, 1],
            [0.92, 1],
          )})`,
          opacity: markIn,
        }}
      >
        <NextMark size={LOCKUP_MARK} idPrefix="lockup" />
      </div>
      <Sequence from={22}>
        <div
          style={{
            position: "absolute",
            left: LOCKUP_X + LOCKUP_MARK + LOCKUP_GAP,
            top: LOCKUP_CY - 40,
            width: LOCKUP_WORD_W + 60,
            height: 80,
          }}
        >
          <SoftBlurIn
            text="Next.js"
            fontSize={58}
            fontWeight={600}
            color={INK}
            className=""
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Composition root. One grayscale grain gradient carries the whole video —
// the grain lives at the edges, the center stays clear for type.
// ===========================================================================
export const IntroducingNextjsDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-geist-sans": SANS_FAMILY,
          "--font-geist-mono": MONO_FAMILY,
          background: BG,
        } as React.CSSProperties
      }
    >
      <ShaderGrainGradient
        speed={0.4}
        shape="corners"
        colors={["#141414", "#1b1b1b", "#232323"]}
        colorBack={BG}
        softness={0.8}
        intensity={0.14}
        noise={0.35}
      />
      {/* Vignette scrim — keeps the grain a texture, not a subject. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 44%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.94) 100%)",
        }}
      />

      {/* One continuous camera under the whole edit — the cuts hand off, this
          never resets, so the piece reads as a single take. */}
      <CameraRig>
        <TransitionSeries>
          {/* 0 — The opening line, slammed in */}
          <TransitionSeries.Sequence durationInFrames={S_HOOK}>
            <HookScene />
          </TransitionSeries.Sequence>
          {/* Hook → Eclipse: camera pulls focus from the words to the image. */}
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_FADE })}
            presentation={softDolly()}
          />

          {/* 1 — The eclipse */}
          <TransitionSeries.Sequence durationInFrames={S_ECLIPSE}>
            <EclipseScene />
          </TransitionSeries.Sequence>
          {/* Eclipse → Logotype: we fly THROUGH the ▲ (the eclipse's self-dive)
              and the wordmark rushes out of the black to meet the camera. */}
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_APPROACH })}
            presentation={logoApproach()}
          />

          {/* 2 — The logotype writes itself */}
          <TransitionSeries.Sequence durationInFrames={S_LOGOTYPE}>
            <LogotypeScene />
          </TransitionSeries.Sequence>
          {/* Logotype → Hero: a forward dolly, the wordmark pushing past the
              lens as the page assembles behind it. */}
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_FADE })}
            presentation={pushThrough({ zoom: 1.8, blur: 10 })}
          />

          {/* 3 — The hero; the cursor clicks Get Started */}
          <TransitionSeries.Sequence durationInFrames={S_HERO}>
            <HeroScene />
          </TransitionSeries.Sequence>
          {/* Hero → Command: no camera move — the video's own grain shader
              washes over the click and clears to the install command. */}
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_GRAIN })}
            presentation={grainDissolve({
              colors: ["#161616", "#242424", "#3a3a3a"],
              colorBack: BG,
              noise: 0.5,
              // Ease the field IN gently and let the hero linger under it, so
              // the grain doesn't pop — the whole first half is the wash-in.
              fieldFade: [0, 0.6],
              exitFade: [0.18, 0.52],
            })}
          />

          {/* 4 — The command (the click opened it) */}
          <TransitionSeries.Sequence durationInFrames={S_COMMAND}>
            <CommandScene />
          </TransitionSeries.Sequence>
          {/* Command → Features: a focus pull — the command defocuses and the
              first feature station racks into focus. */}
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_PUSH })}
            presentation={focusPull({ blur: 18 })}
          />

          {/* 5 — The features */}
          <TransitionSeries.Sequence durationInFrames={S_FEATURES}>
            <FeaturesScene />
          </TransitionSeries.Sequence>
          {/* Features → Powered By: the same whip-pan the stations use, so the
              features and the proof read as one continuous horizontal pan. */}
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_FEAT })}
            presentation={whipPan({ direction: "left" })}
          />

          {/* 7 — Powered By */}
          <TransitionSeries.Sequence durationInFrames={S_POWERED}>
            <PoweredByScene />
          </TransitionSeries.Sequence>
          {/* Powered By → Lockup: the one and only fade — the final breath. */}
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_FADE })}
            presentation={fade()}
          />

          {/* 8 — Blueprint lockup */}
          <TransitionSeries.Sequence durationInFrames={S_LOCKUP}>
            <LockupScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </CameraRig>
    </AbsoluteFill>
  );
};
