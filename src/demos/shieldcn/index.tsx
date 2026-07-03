import React, { type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  Series,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { loadFont as loadSans } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { RemocnUIProvider } from "@/lib/remocn-ui";
import { ShortSlideRight } from "@/components/remocn/short-slide-right";
import { TerminalSimulator } from "@/components/remocn/terminal-simulator";
import {
  GitHubStars,
  type Stargazer,
} from "@/components/remocn/github-stars";
import { BlurIn } from "@/components/remocn/blur-in";
import { useBlurInTransition } from "@/components/remocn/use-blur-in-transition";
import { ShaderGrainGradient } from "@/components/remocn/shader-grain-gradient";
import { StarIcon } from "lucide-react";

// shieldcn speaks shadcn's language: Geist Sans for copy, Geist Mono for every
// URL and command.
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "700"],
});

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace";

// shieldcn palette — the shadcn zinc register plus the one liberty the brand
// takes: badge-value green. The dated shields colors live ONLY in the pain beat.
const BG = "#09090b"; //      zinc-950 canvas
const INK = "#fafafa"; //     zinc-50 text
const MUTED = "#a1a1aa"; //   zinc-400
const FAINT = "rgba(250,250,250,0.45)";
const BORDER = "rgba(255,255,255,0.10)";
const CARD = "rgba(255,255,255,0.03)";
const GREEN = "#22c55e"; //   the badge-value green
const GREEN_SOFT = "#4ade80";

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps), one per beat. Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK = 120; //     stacked slide-in lines, README marker-highlighted
const S_PAIN = 120; //     counter-drifting marquee wall of dated badges
const S_INTRO = 185; //    Meet → shieldcn lockup → creed, on the shared Z axis
const S_TITLE = 55; //     interstitial section titles (short-slide-right)
const S_VARIANTS = 170; // ?variant= param morphs the live badge
const S_CHART = 140; //    spatial pan across chart / header / sponsor cards
const S_AGENT = 125; //    npx skills add jal-co/shieldcn
const S_PROOF = 120; //    stargazers card + proof pills
const S_CTA = 255; //      badge ballet (scatter → circle → spin → row → exit) + outro

const T_X = 14; //     crossfade
const T_SQ = 16; //    squeeze — snappy mechanical beat change
const T_ZOOM = 18; //  section turn (zoom-through)
const T_IRIS = 22; //  pill-shaped iris reveal

export const SHIELDCN_DURATION =
  S_HOOK +
  S_PAIN +
  S_INTRO +
  S_TITLE * 3 +
  S_VARIANTS +
  S_CHART +
  S_AGENT +
  S_PROOF +
  S_CTA -
  (T_SQ +
    T_IRIS +
    T_ZOOM +
    T_SQ +
    T_ZOOM +
    T_SQ +
    T_X +
    T_ZOOM +
    T_SQ +
    T_IRIS);

// ---------------------------------------------------------------------------
// Reveal — blur-in wrapper driven by useBlurInTransition.
// ---------------------------------------------------------------------------
const Reveal: React.FC<{
  children: ReactNode;
  delay?: number;
  distance?: number;
  blur?: number;
  duration?: number;
  display?: React.CSSProperties["display"];
}> = ({
  children,
  delay = 0,
  distance = 16,
  blur = 10,
  duration = 20,
  display = "block",
}) => {
  const style = useBlurInTransition(
    [{ at: delay, state: "revealed", duration }],
    { direction: "up", distance, blur },
  );
  return (
    <BlurIn style={style} display={display}>
      {children}
    </BlurIn>
  );
};

// ---------------------------------------------------------------------------
// SlideLine — a short-slide-right line stacked inside a flex column.
// SlideRich — the same motion for rich content (marker highlights etc.).
// ---------------------------------------------------------------------------
const SlideLine: React.FC<{
  text: string;
  at: number;
  fontSize: number;
  color?: string;
  fontWeight?: number;
}> = ({ text, at, fontSize, color = INK, fontWeight = 600 }) => (
  <div
    style={{
      position: "relative",
      width: "100%",
      height: Math.round(fontSize * 1.35),
    }}
  >
    <Sequence from={at} layout="none">
      <ShortSlideRight
        text={text}
        fontSize={fontSize}
        color={color}
        fontWeight={fontWeight}
      />
    </Sequence>
  </div>
);

const SlideRich: React.FC<{ at: number; children: ReactNode }> = ({
  at,
  children,
}) => {
  const frame = useCurrentFrame();
  const easing = Easing.bezier(0.2, 0.8, 0.2, 1);
  const t = frame - at;
  const x = interpolate(t, [0, 16], [-24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
  const opacity = interpolate(t, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
  const blurVal = interpolate(t, [0, 16], [1.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
  return (
    <div
      style={{
        transform: `translateX(${x}px)`,
        opacity,
        filter: `blur(${blurVal}px)`,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Mark — a green marker sweep behind a phrase; the text flips dark.
// ---------------------------------------------------------------------------
const Mark: React.FC<{ children: string; startFrame?: number }> = ({
  children,
  startFrame = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scaleX = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, mass: 0.8 },
  });
  const textColor = interpolateColors(
    interpolate(scaleX, [0.45, 0.85], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    [0, 1],
    [INK, "#052e16"],
  );
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: "-0.04em -0.14em",
          background: GREEN,
          borderRadius: 8,
          transformOrigin: "left center",
          transform: `scaleX(${scaleX})`,
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1, color: textColor }}>
        {children}
      </span>
    </span>
  );
};

// ---------------------------------------------------------------------------
// SectionTitle — the block headline as its own interstitial beat: the line
// slides in, then a green rule draws itself underneath.
// ---------------------------------------------------------------------------
const SectionTitle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const off = interpolate(frame, [12, 30], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: 74 }}>
        <ShortSlideRight
          text={text}
          fontSize={54}
          color={INK}
          fontWeight={600}
        />
      </div>
      <svg width={190} height={6} viewBox="0 0 190 6">
        <path
          d="M3 3 H187"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={off}
          stroke={GREEN}
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// SazSwap — shared-axis-z motion (same curves as the remocn component) for
// arbitrary ReactNode content: outgoing scales up + fades, incoming scales in.
// ---------------------------------------------------------------------------
const SazSwap: React.FC<{
  from?: ReactNode;
  to: ReactNode;
  align?: "center" | "start";
}> = ({ from, to, align = "center" }) => {
  const frame = useCurrentFrame();
  const exitDur = 11;
  const enterDur = 16;
  const newStart = Math.max(0, exitDur - 3 + 1);
  const exitEasing = Easing.bezier(0.4, 0, 1, 1);
  const enterEasing = Easing.bezier(0.2, 0, 0, 1);

  const fromOpacity = interpolate(frame, [0, exitDur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: exitEasing,
  });
  const fromScale = interpolate(frame, [0, exitDur], [1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: exitEasing,
  });
  const fromBlur = interpolate(frame, [0, exitDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: exitEasing,
  });

  const local = frame - newStart;
  const toOpacity = interpolate(local, [0, enterDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: enterEasing,
  });
  const toScale = interpolate(local, [0, enterDur], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: enterEasing,
  });
  const toBlur = interpolate(local, [0, enterDur], [2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: enterEasing,
  });

  // AbsoluteFill is a flex COLUMN — alignItems is the horizontal axis.
  const center: React.CSSProperties = {
    alignItems: align === "center" ? "center" : "flex-start",
    justifyContent: "center",
  };
  return (
    <AbsoluteFill>
      {from && (
        <AbsoluteFill
          style={{
            ...center,
            opacity: fromOpacity,
            transform: `scale(${fromScale})`,
            filter: `blur(${fromBlur}px)`,
          }}
        >
          {from}
        </AbsoluteFill>
      )}
      <AbsoluteFill
        style={{
          ...center,
          opacity: toOpacity,
          transform: `scale(${toScale})`,
          filter: `blur(${toBlur}px)`,
        }}
      >
        {to}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Badge — a shieldcn badge rendered the way the product renders it: as a real
// shadcn button. Split form carries a label segment and a green value segment.
// ---------------------------------------------------------------------------
type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
type BadgeSize = "xs" | "sm" | "default" | "lg";

const SIZE_STYLE: Record<
  BadgeSize,
  { height: number; fontSize: number; padX: number }
> = {
  xs: { height: 26, fontSize: 12.5, padX: 10 },
  sm: { height: 32, fontSize: 14, padX: 13 },
  default: { height: 38, fontSize: 15.5, padX: 16 },
  lg: { height: 46, fontSize: 18, padX: 20 },
};

const VARIANT_STYLE: Record<BadgeVariant, React.CSSProperties> = {
  default: { background: INK, color: "#09090b" },
  secondary: { background: "#27272a", color: INK },
  outline: {
    background: "transparent",
    color: INK,
    boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.22)`,
  },
  ghost: { background: "transparent", color: MUTED },
  destructive: { background: "#dc2626", color: INK },
};

const Badge: React.FC<{
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
}> = ({ children, variant = "secondary", size = "default" }) => {
  const s = SIZE_STYLE[size];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        height: s.height,
        padding: `0 ${s.padX}px`,
        borderRadius: 8,
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: s.fontSize,
        ...VARIANT_STYLE[variant],
      }}
    >
      {children}
    </span>
  );
};

// ===========================================================================
// Scene 1 — Hook. The lines accumulate this time, and "Your README." gets the
// green marker sweep.
// ===========================================================================
const HookScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 8,
    }}
  >
    <SlideLine
      text="Someone just opened your repo."
      at={0}
      fontSize={38}
      color={MUTED}
      fontWeight={500}
    />
    <SlideLine
      text="The first thing they see?"
      at={22}
      fontSize={38}
      color={MUTED}
      fontWeight={500}
    />
    <div style={{ height: 8 }} />
    <SlideRich at={44}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 56,
          color: INK,
        }}
      >
        <Mark startFrame={62}>Your README.</Mark>
      </span>
    </SlideRich>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — The wall. REAL shieldcn badges (SVGs fetched from the repo's own
// README) drift across the frame in two counter-scrolling bands — the tease
// of what the front door could look like.
// ===========================================================================
const RealBadge: React.FC<{ name: string; height?: number }> = ({
  name,
  height = 32,
}) => (
  <Img
    src={staticFile(`shieldcn/${name}.svg`)}
    style={{ height, width: "auto", display: "block", flex: "none" }}
  />
);

const BADGE_ROW_1 = [
  "npm-react",
  "stars-nextjs",
  "views-shieldcn",
  "dw-react",
  "license-shieldcn",
  "stars-shieldcn",
  "last-commit",
  "contributors",
];

const BADGE_ROW_2 = [
  "npm-react-secondary",
  "npm-react-outline",
  "vercel-oss",
  "npm-typescript",
  "stars-react",
  "npm-react-destructive",
  "npm-react-ghost",
  "views-shieldcn",
];

const MarqueeRow: React.FC<{
  items: string[];
  pxPerFrame: number;
  reverse?: boolean;
}> = ({ items, pxPerFrame, reverse = false }) => {
  const frame = useCurrentFrame();
  const drift = frame * pxPerFrame;
  const x = reverse ? -560 + drift : -drift;
  const doubled = [...items, ...items];
  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "max-content",
          transform: `translateX(${x}px)`,
        }}
      >
        {doubled.map((name, i) => (
          <RealBadge key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
};

const TeaseScene: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center" }}>
    <Reveal delay={2} distance={10} blur={8}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 44,
        }}
      >
        <MarqueeRow items={BADGE_ROW_1} pxPerFrame={1.4} />
        <MarqueeRow items={BADGE_ROW_2} pxPerFrame={1.1} reverse />
      </div>
    </Reveal>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <SlideLine
        text="Your README could look like this."
        at={20}
        fontSize={34}
        color={MUTED}
        fontWeight={500}
      />
      <SlideLine
        text="A design system — all the way to the front door."
        at={44}
        fontSize={40}
        color={INK}
      />
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 3 — Product intro. Three beats on the shared Z axis: Meet → the
// shieldcn wordmark → the creed.
// ===========================================================================
const Lockup: React.FC = () => (
  <h1
    style={{
      margin: 0,
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 92,
      letterSpacing: "-0.03em",
      color: INK,
    }}
  >
    shieldcn
  </h1>
);

const MeetLabel = (
  <span
    style={{
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 72,
      letterSpacing: "-0.03em",
      color: INK,
    }}
  >
    Meet
  </span>
);

const Creed = (
  <span
    style={{
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 27,
      color: FAINT,
      textAlign: "center",
    }}
  >
    Badges, charts, headers —{" "}
    <span style={{ color: INK, fontWeight: 600 }}>
      as real shadcn/ui components.
    </span>
  </span>
);

// MicroPhase — the micro-scale-fade motion (same curve as the remocn
// component: 0.96 → 1 scale + fade over 18f) for arbitrary content, plus a
// gentle fade-out at the end of the phase so beats hand over cleanly.
const MicroPhase: React.FC<{ children: ReactNode; outAt?: number }> = ({
  children,
  outAt,
}) => {
  const frame = useCurrentFrame();
  const easing = Easing.bezier(0.32, 0.72, 0, 1);
  const opacityIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
  const scale = interpolate(frame, [0, 18], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
  const opacityOut =
    outAt === undefined
      ? 1
      : interpolate(frame, [outAt, outAt + 10], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.quad),
        });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: opacityIn * opacityOut,
        transform: `scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const IntroScene: React.FC = () => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence durationInFrames={40} layout="none">
        <MicroPhase outAt={30}>{MeetLabel}</MicroPhase>
      </Series.Sequence>
      <Series.Sequence durationInFrames={75} layout="none">
        <MicroPhase outAt={63}>
          <Lockup />
        </MicroPhase>
      </Series.Sequence>
      <Series.Sequence durationInFrames={70} layout="none">
        <MicroPhase>{Creed}</MicroPhase>
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 4 — Make it yours. A split stage: the URL parameter swaps on the
// left, and the SAME badge restyles live on the right — one param, any look.
// The five variants then cascade in along the bottom.
// ===========================================================================
const PARAM_VALUES: BadgeVariant[] = [
  "default",
  "secondary",
  "outline",
  "destructive",
];
const PHASE_LEN = 30;

const ParamValue: React.FC<{ text: string }> = ({ text }) => (
  <span
    style={{
      fontFamily: MONO,
      fontWeight: 500,
      fontSize: 26,
      color: GREEN_SOFT,
    }}
  >
    {text}
  </span>
);

const MorphBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(
    PARAM_VALUES.length - 1,
    Math.max(0, Math.floor((frame - 12) / PHASE_LEN)),
  );
  const local = (frame - 12) % PHASE_LEN;
  const pulse =
    frame < 12
      ? 1
      : interpolate(local, [0, 7], [0.94, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        });
  // The icon follows the variant's text color, like a real shadcn button.
  const iconColor = VARIANT_STYLE[PARAM_VALUES[idx]].color as string;
  return (
    <div style={{ transform: `scale(${1.55 * pulse})` }}>
      <Badge variant={PARAM_VALUES[idx]} size="lg">
        <StarIcon size={18} color={iconColor} />
        stars · 138k
      </Badge>
    </div>
  );
};

const VariantsScene: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 54,
        marginBottom: 90,
      }}
    >
      {/* Left — the URL, one param swapping */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Reveal delay={2} distance={12} blur={8}>
          <span style={{ fontFamily: MONO, fontSize: 20, color: FAINT }}>
            shieldcn.dev/github/stars/….svg
          </span>
        </Reveal>
        <Reveal delay={8} distance={12} blur={8}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{ fontFamily: MONO, fontSize: 26, color: INK }}
            >
              ?variant=
            </span>
            <div style={{ position: "relative", width: 240, height: 40 }}>
              <Series>
                <Series.Sequence durationInFrames={PHASE_LEN + 12} layout="none">
                  <SazSwap align="start" to={<ParamValue text="default" />} />
                </Series.Sequence>
                <Series.Sequence durationInFrames={PHASE_LEN} layout="none">
                  <SazSwap
                    align="start"
                    from={<ParamValue text="default" />}
                    to={<ParamValue text="secondary" />}
                  />
                </Series.Sequence>
                <Series.Sequence durationInFrames={PHASE_LEN} layout="none">
                  <SazSwap
                    align="start"
                    from={<ParamValue text="secondary" />}
                    to={<ParamValue text="outline" />}
                  />
                </Series.Sequence>
                <Series.Sequence durationInFrames={200} layout="none">
                  <SazSwap
                    align="start"
                    from={<ParamValue text="outline" />}
                    to={<ParamValue text="destructive" />}
                  />
                </Series.Sequence>
              </Series>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Divider */}
      <Reveal delay={6} distance={0} blur={6}>
        <div style={{ width: 1, height: 130, background: BORDER }} />
      </Reveal>

      {/* Right — the same badge, restyled live */}
      <div
        style={{
          width: 340,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Reveal delay={6} distance={16} blur={10}>
          <MorphBadge />
        </Reveal>
      </div>
    </div>

    {/* Bottom — the whole family cascades in */}
    <div
      style={{
        position: "absolute",
        bottom: 130,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {[
        "npm-react",
        "npm-react-secondary",
        "npm-react-outline",
        "npm-react-ghost",
        "npm-react-destructive",
      ].map((name, i) => (
        <Reveal key={name} delay={116 + i * 4} distance={14} blur={9}>
          <RealBadge name={name} height={30} />
        </Reveal>
      ))}
      <Reveal delay={140} distance={10} blur={6}>
        <span style={{ fontFamily: SANS, fontSize: 16, color: MUTED }}>
          any size, any icon — dark mode built in
        </span>
      </Reveal>
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 5 — More than badges. A spatial pan across three README artifacts —
// the REAL rendered SVGs from the shieldcn repo: the star-history chart, the
// header, the sponsor wall.
// ===========================================================================
const CARD_W = 620;
const CARD_GAP = 48;
const CARD_STEP = CARD_W + CARD_GAP;

const ArtifactCard: React.FC<{
  url: string;
  children: ReactNode;
  dim: number;
}> = ({ url, children, dim }) => (
  <div
    style={{
      width: CARD_W,
      flex: "none",
      borderRadius: 14,
      border: `1px solid ${BORDER}`,
      background: CARD,
      overflow: "hidden",
      opacity: 1 - 0.55 * dim,
      transform: `scale(${1 - 0.06 * dim})`,
    }}
  >
    <div
      style={{
        padding: "12px 18px",
        borderBottom: `1px solid ${BORDER}`,
        fontFamily: MONO,
        fontSize: 13.5,
        color: MUTED,
        whiteSpace: "nowrap",
      }}
    >
      {url}
    </div>
    <div
      style={{
        position: "relative",
        width: CARD_W,
        height: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  </div>
);

const seg = (
  frame: number,
  from: number,
  to: number,
): number =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

const ChartScene: React.FC = () => {
  const frame = useCurrentFrame();
  const station = seg(frame, 42, 60) + seg(frame, 96, 114);
  const x = -station * CARD_STEP;
  const dimFor = (i: number) => Math.min(1, Math.abs(i - station));
  return (
    <AbsoluteFill style={{ justifyContent: "center" }}>
      <Reveal delay={2} distance={30} blur={14} duration={22}>
        <div
          style={{
            display: "flex",
            gap: CARD_GAP,
            alignItems: "center",
            width: "max-content",
            marginLeft: (1280 - CARD_W) / 2,
            transform: `translateX(${x}px)`,
          }}
        >
          {/* Card 1 — the real star-history chart */}
          <ArtifactCard
            url="shieldcn.dev/chart/github/stars/jal-co/shieldcn.svg"
            dim={dimFor(0)}
          >
            <Img
              src={staticFile("shieldcn/chart-stars.svg")}
              style={{ width: 596, height: "auto", display: "block" }}
            />
          </ArtifactCard>

          {/* Card 2 — the real README header */}
          <ArtifactCard url="shieldcn.dev/header/graph.svg?title=shieldcn" dim={dimFor(1)}>
            <Img
              src={staticFile("shieldcn/header-graph.svg")}
              style={{ width: 596, height: "auto", display: "block" }}
            />
          </ArtifactCard>

          {/* Card 3 — the real sponsor wall */}
          <ArtifactCard url="shieldcn.dev/sponsors/jal-co.svg" dim={dimFor(2)}>
            <Img
              src={staticFile("shieldcn/sponsors.svg")}
              style={{ width: 596, height: "auto", display: "block" }}
            />
          </ArtifactCard>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 6 — Your agent does it. The skill install, then the punchline.
// ===========================================================================
const AgentScene: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 860 }}>
      <TerminalSimulator
        title="~/my-project"
        fontSize={20}
        charsPerFrame={2}
        chunkSize={2}
        lines={[
          {
            text: "npx skills add jal-co/shieldcn -a claude-code",
            type: "command",
            delay: 0,
          },
          {
            text: "✓ Found skill shieldcn-badges",
            type: "log",
            delay: 12,
            pause: 8,
          },
          { text: "✓ Installed for Claude Code", type: "success", delay: 8 },
          {
            text: "Your agent writes the README now.",
            type: "log",
            delay: 12,
          },
        ]}
      />
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 7 — Built in the open. The real star card counts up while the proof
// pills hold the top row.
// ===========================================================================
const STARGAZERS: Stargazer[] = [
  { login: "junedev", avatarUrl: "", starredAt: "2025-09-14" },
  { login: "mirak", avatarUrl: "", starredAt: "2025-10-02" },
  { login: "tobiasw", avatarUrl: "", starredAt: "2025-11-18" },
  { login: "sofia-oss", avatarUrl: "", starredAt: "2026-01-05" },
  { login: "kentbuilds", avatarUrl: "", starredAt: "2026-02-21" },
  { login: "annadev", avatarUrl: "", starredAt: "2026-04-09" },
  { login: "dpetrov", avatarUrl: "", starredAt: "2026-05-27" },
  { login: "clararw", avatarUrl: "", starredAt: "2026-06-30" },
];

const ProofScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 26,
    }}
  >
    <div style={{ display: "flex", gap: 12 }}>
      {["MIT license", "Vercel OSS Program", "shields.io alternative"].map(
        (chip, i) => (
          <Reveal key={chip} delay={2 + i * 5} distance={14} blur={9}>
            <Badge variant="outline">{chip}</Badge>
          </Reveal>
        ),
      )}
    </div>
    <Reveal delay={4} distance={24} blur={12} duration={14}>
      {/* GitHubStars lays out for the full 1280×720 canvas — scale it down. */}
      <div style={{ position: "relative", width: 1280 * 0.62, height: 720 * 0.62 }}>
        <div
          style={{
            position: "absolute",
            width: 1280,
            height: 720,
            transform: "scale(0.62)",
            transformOrigin: "top left",
          }}
        >
          <GitHubStars
            repo="jal-co/shieldcn"
            totalStars={524}
            stargazers={STARGAZERS}
            accentColor={GREEN}
            theme="dark"
            repoAvatarUrl=""
            speed={1}
          />
        </div>
      </div>
    </Reveal>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 8 — CTA. The badge ballet: ten real badges pop in at scattered spots,
// gather into a circle, the circle makes one full turn, they fall into a row,
// the row rides off-screen — and the outro lockup takes the stage.
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

// Hand-placed "random" scatter (deterministic — no Math.random in Remotion).
const SCATTER: Array<[number, number]> = [
  [-420, -180],
  [300, -220],
  [-140, -60],
  [480, 60],
  [-500, 120],
  [120, -160],
  [420, -40],
  [-280, 220],
  [60, 190],
  [-40, -250],
];

const BALLET_N = BALLET_BADGES.length;
const BALLET_R = 190; //  circle radius
const BALLET_SLOT = 116; // row slot width

// Ballet timeline (scene-local frames)
const B_GATHER: [number, number] = [26, 48];
const B_SPIN: [number, number] = [48, 100];
const B_ALIGN: [number, number] = [100, 122];
const B_EXIT: [number, number] = [124, 144];
const OUTRO_FROM = 146;

const BadgeBallet: React.FC = () => {
  const frame = useCurrentFrame();
  const ease = Easing.inOut(Easing.cubic);
  const gP = interpolate(frame, B_GATHER, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const rot = interpolate(frame, B_SPIN, [0, Math.PI * 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const aP = interpolate(frame, B_ALIGN, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const eP = interpolate(frame, B_EXIT, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return (
    <>
      {BALLET_BADGES.map((name, i) => {
        const base = -Math.PI / 2 + (i * 2 * Math.PI) / BALLET_N;
        const cx = Math.cos(base + rot) * BALLET_R;
        const cy = Math.sin(base + rot) * BALLET_R;
        const [sx, sy] = SCATTER[i];
        // scatter → circle (the circle itself carries the spin) → row → exit
        const gx = sx + (cx - sx) * gP;
        const gy = sy + (cy - sy) * gP;
        const rowX = (i - (BALLET_N - 1) / 2) * BALLET_SLOT;
        const x = gx + (rowX - gx) * aP - eP * 1750;
        const y = gy + (0 - gy) * aP;
        const popIn = interpolate(frame, [i * 2, i * 2 + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const popScale = interpolate(frame, [i * 2, i * 2 + 12], [0.5, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        });
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${popScale})`,
              opacity: popIn,
            }}
          >
            <RealBadge name={name} height={26} />
          </div>
        );
      })}
    </>
  );
};

const CtaScene: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <BadgeBallet />
    <Sequence from={OUTRO_FROM} layout="none">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        <Reveal delay={10} distance={16} blur={14} duration={22}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 80,
              letterSpacing: "-0.03em",
              color: INK,
            }}
          >
            shieldcn
          </div>
        </Reveal>
        <Reveal delay={26} distance={12} blur={8}>
          <span style={{ fontFamily: MONO, fontSize: 22, color: MUTED }}>
            shieldcn.dev
          </span>
        </Reveal>
        <Reveal delay={44} distance={10} blur={6}>
          <span style={{ fontFamily: SANS, fontSize: 20, color: MUTED }}>
            Make the first impression count.
          </span>
        </Reveal>
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

// Squeeze — the outgoing frame compresses to a line at the top edge while the
// incoming frame expands up from the bottom. Snappy, mechanical.
const SqueezePres: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: Easing.bezier(0.7, 0, 0.3, 1),
  });
  const style: React.CSSProperties = entering
    ? {
        transform: `scaleY(${Math.max(0.002, p)})`,
        transformOrigin: "50% 100%",
        opacity: Math.min(1, p * 2),
      }
    : {
        transform: `scaleY(${Math.max(0.002, 1 - p)})`,
        transformOrigin: "50% 0%",
        opacity: Math.min(1, (1 - p) * 2),
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const squeeze = (): TransitionPresentation<EmptyProps> => ({
  component: SqueezePres,
  props: {},
});

// Iris — the incoming frame is revealed through an expanding badge-shaped
// (pill) clip while the outgoing frame dims underneath.
const IrisPres: React.FC<TransitionPresentationComponentProps<EmptyProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const entering = presentationDirection === "entering";
  if (entering) {
    const p = interpolate(presentationProgress, [0, 1], [0, 1], {
      easing: Easing.out(Easing.cubic),
    });
    const vy = (1 - p) * 46;
    const vx = (1 - p) * 38;
    const r = (1 - p) * 380;
    return (
      <AbsoluteFill
        style={{
          clipPath: `inset(${vy}% ${vx}% ${vy}% ${vx}% round ${r}px)`,
          transform: `scale(${1.04 - p * 0.04})`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  const p = presentationProgress;
  return (
    <AbsoluteFill style={{ opacity: 1 - p * 0.8, filter: `blur(${p * 6}px)` }}>
      {children}
    </AbsoluteFill>
  );
};
const iris = (): TransitionPresentation<EmptyProps> => ({
  component: IrisPres,
  props: {},
});

const ZoomBlur: React.FC<
  TransitionPresentationComponentProps<{ rise: number }>
> = ({
  children,
  presentationProgress,
  presentationDirection,
  passedProps,
}) => {
  const { rise } = passedProps;
  const entering = presentationDirection === "entering";
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: entering ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
  });
  const style: React.CSSProperties = entering
    ? {
        opacity: p,
        transform: `translateY(${(1 - p) * rise}px) scale(${0.86 + p * 0.14})`,
        filter: p < 1 ? `blur(${(1 - p) * 18}px)` : undefined,
      }
    : {
        opacity: 1 - p,
        transform: `translateY(${-p * rise}px) scale(${1 + p * 0.18})`,
        filter: p > 0 ? `blur(${p * 18}px)` : undefined,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const zoomBlur = (rise = 0): TransitionPresentation<{ rise: number }> => ({
  component: ZoomBlur,
  props: { rise },
});

// ===========================================================================
// Composition root.
// ===========================================================================
export const ShieldcnDemo: React.FC = () => {
  return (
    <RemocnUIProvider>
      <AbsoluteFill
        style={
          {
            background: BG,
            "--font-geist-sans": SANS_FAMILY,
            "--font-geist-mono": MONO_FAMILY,
          } as React.CSSProperties
        }
      >
        {/* Living shader backdrop — grain gradient in the zinc register with a
            whisper of the badge green. */}
        <ShaderGrainGradient
          speed={0.5}
          colorBack={BG}
          colors={["#101012", "#1c1c20", "#2a2a30", "#14352a"]}
        />
        {/* Vignette scrim to focus the center. */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(120% 120% at 50% 45%, rgba(9,9,11,0) 30%, rgba(9,9,11,0.85) 100%)",
          }}
        />

        <TransitionSeries>
          {/* 1 — Hook */}
          <TransitionSeries.Sequence durationInFrames={S_HOOK}>
            <HookScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_SQ })}
            presentation={squeeze()}
          />

          {/* 2 — The wall of real badges */}
          <TransitionSeries.Sequence durationInFrames={S_PAIN}>
            <TeaseScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_IRIS })}
            presentation={iris()}
          />

          {/* 3 — Intro: Meet → lockup → creed on the shared Z axis */}
          <TransitionSeries.Sequence durationInFrames={S_INTRO}>
            <IntroScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_ZOOM })}
            presentation={zoomBlur(44)}
          />

          {/* — Section title: Make it yours */}
          <TransitionSeries.Sequence durationInFrames={S_TITLE}>
            <SectionTitle text="Make it yours" />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_SQ })}
            presentation={squeeze()}
          />

          {/* 4 — Variants: ?variant= morphs the live badge */}
          <TransitionSeries.Sequence durationInFrames={S_VARIANTS}>
            <VariantsScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_ZOOM })}
            presentation={zoomBlur(44)}
          />

          {/* — Section title: More than badges */}
          <TransitionSeries.Sequence durationInFrames={S_TITLE}>
            <SectionTitle text="More than badges" />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_SQ })}
            presentation={squeeze()}
          />

          {/* 5 — Spatial pan across the three README artifacts */}
          <TransitionSeries.Sequence durationInFrames={S_CHART}>
            <ChartScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 6 — Agent skill */}
          <TransitionSeries.Sequence durationInFrames={S_AGENT}>
            <AgentScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_ZOOM })}
            presentation={zoomBlur(44)}
          />

          {/* — Section title: Built in the open */}
          <TransitionSeries.Sequence durationInFrames={S_TITLE}>
            <SectionTitle text="Built in the open" />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_SQ })}
            presentation={squeeze()}
          />

          {/* 7 — Proof: the star card counts up */}
          <TransitionSeries.Sequence durationInFrames={S_PROOF}>
            <ProofScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_IRIS })}
            presentation={iris()}
          />

          {/* 8 — CTA: the stage clears, the lockup draws on */}
          <TransitionSeries.Sequence durationInFrames={S_CTA}>
            <CtaScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </RemocnUIProvider>
  );
};
