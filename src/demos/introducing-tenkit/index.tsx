import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  interpolateColors,
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
import { loadFont as loadHeading } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { ShaderVoronoi } from "@/components/remocn/shader-voronoi";
import { whipPan } from "@/components/remocn/whip-pan";
import { pushThrough } from "@/components/remocn/push-through";
import { focusPull } from "@/components/remocn/focus-pull";

// Tenkit speaks in its own fonts: Space Grotesk is the site's font-heading,
// Inter its body face, Geist Mono its code register.
const { fontFamily: HEAD_FAMILY } = loadHeading("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});
const { fontFamily: BODY_FAMILY } = loadBody("normal", {
  subsets: ["latin"],
  weights: ["400"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400"],
});

const HEAD = `${HEAD_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const BODY = `${BODY_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

// Palette lifted from tenkit.dev's own .dark tokens (#09090b background,
// #fafafa foreground) plus the THREE tenant accents the site's hero uses to
// show many branded apps — blue, orange, teal. The accents appear only as
// tenant identity, never as decoration.
const BG = "#09090b";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.62)";
const FAINT = "rgba(250,250,250,0.42)";
const HAIRLINE = "rgba(250,250,250,0.14)";
const SURFACE = "rgba(250,250,250,0.045)";

const TENANTS = [
  { name: "Atlas", letter: "A", color: "#208AEF" },
  { name: "Ember", letter: "E", color: "#EF8520" },
  { name: "Mint", letter: "M", color: "#2DD4A8" },
] as const;

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// The motion score: one → many. Division moves OUTWARD from center (the hook
// text fans apart, the phone clones slide apart, voronoi cells grow, the
// branch diagram fans down), narrative progress dives INTO the frame
// (push-through), enumeration travels LEFT (whip-pans). The outro reverses
// the split — three tenant dots converge back into the one mark. Every beat
// holds long enough to be READ before the next one moves.
// ---------------------------------------------------------------------------
const S_HOOK = 92; //    "One codebase" lands, then fans into three
const S_REVEAL = 134; //  mark faces assemble → descent into the real lockup proportions
const S_LINE = 72; //     "The setup you actually ship"
const S_BEATS = 108; //   White label / Runtime tenant / Generic + standalone
const S_TRIO = 190; //    statement text first, then a concise three-phone money shot
const F_CONFIG = 118; //  station 1 — text beat, then the app variant file
const F_CLI = 118; //     station 2 — text beat, then the local CLI commands
const F_EAS = 128; //     station 3 — text beat, then EAS builds
const S_CREATE = 108; //  package-manager create command cycle
const S_OUTRO = 128; //   reverse split → lockup + tenkit.dev

const T_PUSH = 18; //     push-through
const T_FP = 14; //       focus-pull
const T_BLOOM = 54; //    voronoi bloom (tenant-tinted cells growing)
const T_WHIP = 10; //     whip-pan left

const S_MONTAGE = F_CONFIG + F_CLI + F_EAS - T_WHIP * 2;

export const INTRODUCING_TENKIT_DURATION =
  S_HOOK +
  S_REVEAL +
  S_LINE +
  S_BEATS +
  S_TRIO +
  S_MONTAGE +
  S_CREATE +
  S_OUTRO -
  (T_PUSH + T_FP + T_FP + T_BLOOM + T_WHIP + T_FP + T_PUSH);

// ---------------------------------------------------------------------------
// The supplied Group 84.svg logo, embedded path by path. The shipped file is
// one 374×157 viewBox; here the mark and the wordmark live in their own
// boxes so the lockup can be recomposed with the wordmark's letter height
// matching the mark's height — everything sits in one tight box.
// ---------------------------------------------------------------------------
const MARK_VB = "-1 -1 115 160"; // mark bbox ≈ x[-0.5,112.5] y[-0.2,157.5]
const MARK_AR = 115 / 160; // width / height
const WORD_VB = "129.6 41.9 243.8 79.1"; // letters bbox in the shipped viewBox
const WORD_AR = 243.8 / 79.1;
const WORD_TO_MARK_H = 79.1 / 160;
const WORD_TOP_TO_MARK_H = 41.9 / 160;
const WORD_GAP_TO_MARK_H = 17.1 / 160;

const MARK_BOTTOM =
  "M34.54 90.6967C34.54 89.2775 35.2785 87.9607 36.4894 87.2205L71.4017 65.702C74.1164 64.0426 77.6005 65.9964 77.6005 69.1781V129.342C77.6005 130.706 76.9181 131.979 75.7825 132.735L40.8702 156.218C38.1624 158.019 34.54 156.078 34.54 152.826L34.54 90.6967Z";
const MARK_TOP =
  "M74.4541 0.565754C75.5499 -0.0811406 76.885 -0.178923 78.0634 0.30151L109.084 13.4258C112.178 14.6873 112.522 18.9318 109.671 20.6744L36.7776 65.2285C35.6052 65.9451 34.1505 66.0226 32.9088 65.4344L2.33016 50.5264C-0.622425 49.1278 -0.810432 44.997 2.00292 43.3361L74.4541 0.565754Z";

// The six wordmark letters, ordered left → right (t e n k i t).
const WORD_LETTERS = [
  "M148.827 119.999C142.598 119.999 137.822 118.649 134.5 115.95C131.247 113.251 129.621 108.96 129.621 103.077V52.8285C129.621 51.5827 130.347 50.5791 131.801 49.8178C133.254 49.0564 134.742 48.6758 136.265 48.6758C137.926 48.6758 139.449 49.0564 140.833 49.8178C142.286 50.5791 143.013 51.5827 143.013 52.8285V70.6853H155.264C156.371 70.6853 157.202 71.2044 157.755 72.2426C158.378 73.2115 158.69 74.3189 158.69 75.5647C158.69 76.8106 158.378 77.9526 157.755 78.9907C157.202 79.9597 156.371 80.4442 155.264 80.4442H143.013V103.077C143.013 105.153 143.428 106.606 144.259 107.437C145.159 108.268 146.681 108.683 148.827 108.683H152.876C154.814 108.683 156.233 109.271 157.132 110.448C158.101 111.624 158.586 112.905 158.586 114.289C158.586 115.742 158.101 117.057 157.132 118.234C156.233 119.411 154.814 119.999 152.876 119.999H148.827Z",
  "M188.163 120.934C183.249 120.934 178.888 120.068 175.082 118.338C171.344 116.539 168.403 114.047 166.257 110.863C164.111 107.61 163.039 103.873 163.039 99.6507V90.8262C163.039 87.0887 164.042 83.6627 166.049 80.5482C168.126 77.3644 170.86 74.8381 174.251 72.9694C177.712 71.0315 181.553 70.0625 185.775 70.0625C189.651 70.0625 193.181 70.893 196.364 72.5541C199.617 74.2152 202.247 76.4992 204.254 79.4062C206.262 82.3131 207.265 85.7045 207.265 89.5804C207.265 92.5565 206.781 94.7021 205.812 96.0171C204.843 97.2629 203.597 98.0589 202.074 98.4049C200.621 98.6818 199.098 98.8202 197.506 98.8202H176.431V100.377C176.431 103.354 177.539 105.776 179.753 107.645C182.037 109.444 184.979 110.344 188.578 110.344C190.862 110.344 192.765 109.998 194.288 109.306C195.811 108.614 197.126 107.956 198.233 107.333C199.34 106.71 200.379 106.399 201.348 106.399C202.386 106.399 203.285 106.745 204.047 107.437C204.808 108.129 205.396 108.96 205.812 109.929C206.227 110.829 206.435 111.624 206.435 112.317C206.435 113.493 205.673 114.774 204.151 116.158C202.697 117.473 200.586 118.615 197.818 119.584C195.118 120.484 191.9 120.934 188.163 120.934ZM176.431 90.93H191.589C192.765 90.93 193.561 90.757 193.976 90.4109C194.461 89.9956 194.703 89.2343 194.703 88.1269C194.703 86.535 194.253 85.1162 193.354 83.8703C192.523 82.6245 191.416 81.6556 190.031 80.9634C188.716 80.2713 187.228 79.9253 185.567 79.9253C183.975 79.9253 182.487 80.2713 181.103 80.9634C179.719 81.5863 178.577 82.5207 177.677 83.7665C176.846 84.9431 176.431 86.362 176.431 88.0231V90.93Z",
  "M221.94 119.999C220.002 119.999 218.41 119.549 217.165 118.65C215.919 117.75 215.296 116.746 215.296 115.639V74.8381C215.296 73.5923 215.919 72.5888 217.165 71.8274C218.41 71.0661 220.002 70.6854 221.94 70.6854C223.601 70.6854 224.986 71.0661 226.093 71.8274C227.27 72.5888 227.858 73.5923 227.858 74.8381V77.9527C228.896 75.9455 230.592 74.146 232.945 72.5541C235.367 70.893 238.309 70.0625 241.77 70.0625C245.023 70.0625 247.999 71.0315 250.698 72.9694C253.397 74.8381 255.543 77.3644 257.135 80.5482C258.796 83.7319 259.626 87.2617 259.626 91.1376V115.639C259.626 117.092 258.934 118.2 257.55 118.961C256.166 119.653 254.608 119.999 252.878 119.999C251.355 119.999 249.867 119.653 248.414 118.961C246.961 118.2 246.234 117.092 246.234 115.639V91.1376C246.234 89.5457 245.818 88.0577 244.988 86.6734C244.227 85.2892 243.154 84.1472 241.77 83.2474C240.385 82.2785 238.863 81.794 237.202 81.794C235.817 81.794 234.468 82.1746 233.153 82.936C231.838 83.6973 230.765 84.7701 229.934 86.1544C229.104 87.5386 228.688 89.1997 228.688 91.1376V115.639C228.688 116.746 228.031 117.75 226.716 118.65C225.401 119.549 223.809 119.999 221.94 119.999Z",
  "M276.283 119.999C274.414 119.999 272.857 119.549 271.611 118.65C270.365 117.75 269.742 116.746 269.742 115.639V46.0805C269.742 44.8346 270.365 43.8311 271.611 43.0697C272.857 42.3084 274.414 41.9277 276.283 41.9277C278.221 41.9277 279.847 42.3084 281.162 43.0697C282.477 43.8311 283.135 44.8346 283.135 46.0805V89.5804L302.756 71.2045C303.449 70.5124 304.314 70.1663 305.352 70.1663C306.39 70.1663 307.394 70.5124 308.363 71.2045C309.401 71.8274 310.231 72.6234 310.854 73.5923C311.546 74.5613 311.892 75.5649 311.892 76.6031C311.892 77.0183 311.789 77.4682 311.581 77.9527C311.443 78.368 311.166 78.7487 310.75 79.0947L298.5 90.2033L313.865 112.005C314.349 112.766 314.592 113.493 314.592 114.185C314.592 115.224 314.176 116.262 313.346 117.3C312.515 118.338 311.512 119.203 310.335 119.895C309.159 120.518 308.017 120.83 306.909 120.83C305.525 120.83 304.418 120.241 303.587 119.065L289.675 98.5088L283.135 104.323V115.639C283.135 116.746 282.477 117.75 281.162 118.65C279.847 119.549 278.221 119.999 276.283 119.999Z",
  "M327.482 59.6807C325.475 59.6807 323.745 59.0232 322.292 57.7082C320.838 56.3239 320.111 54.8013 320.111 53.1402C320.111 51.3406 320.838 49.818 322.292 48.5722C323.745 47.2571 325.475 46.5996 327.482 46.5996C329.559 46.5996 331.289 47.2571 332.673 48.5722C334.058 49.818 334.75 51.3406 334.75 53.1402C334.75 54.8013 334.058 56.3239 332.673 57.7082C331.289 59.0232 329.559 59.6807 327.482 59.6807ZM327.482 119.999C325.544 119.999 323.953 119.549 322.707 118.65C321.461 117.75 320.838 116.746 320.838 115.639V74.8382C320.838 73.5924 321.461 72.5888 322.707 71.8275C323.953 71.0661 325.544 70.6855 327.482 70.6855C329.351 70.6855 330.943 71.0661 332.258 71.8275C333.573 72.5888 334.231 73.5924 334.231 74.8382V115.639C334.231 116.746 333.573 117.75 332.258 118.65C330.943 119.549 329.351 119.999 327.482 119.999Z",
  "M363.459 119.999C357.23 119.999 352.455 118.649 349.132 115.95C345.879 113.251 344.253 108.96 344.253 103.077V52.8285C344.253 51.5827 344.98 50.5791 346.433 49.8178C347.887 49.0564 349.375 48.6758 350.897 48.6758C352.558 48.6758 354.081 49.0564 355.465 49.8178C356.919 50.5791 357.646 51.5827 357.646 52.8285V70.6853H369.896C371.003 70.6853 371.834 71.2044 372.388 72.2426C373.011 73.2115 373.322 74.3189 373.322 75.5647C373.322 76.8106 373.011 77.9526 372.388 78.9907C371.834 79.9597 371.003 80.4442 369.896 80.4442H357.646V103.077C357.646 105.153 358.061 106.606 358.891 107.437C359.791 108.268 361.314 108.683 363.459 108.683H367.508C369.446 108.683 370.865 109.271 371.765 110.448C372.734 111.624 373.218 112.905 373.218 114.289C373.218 115.742 372.734 117.057 371.765 118.234C370.865 119.411 369.446 119.999 367.508 119.999H363.459Z",
];

// One absolutely-positioned layer: an SVG of the given box with a single
// path, so wrapper divs can transform faces / letters independently while
// everything stays in the shipped geometry.
const SvgLayer: React.FC<{
  d: string;
  viewBox: string;
  width: number;
  height: number;
  color: string;
  style?: React.CSSProperties;
}> = ({ d, viewBox, width, height, color, style }) => (
  <div style={{ position: "absolute", inset: 0, ...style }}>
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      style={{ display: "block" }}
    >
      <path d={d} fill={color} />
    </svg>
  </div>
);

// The boxed lockup geometry: the wordmark's letter height EQUALS the mark's
// height, the tagline underneath spans the full lockup width — one tight box.
const lockupGeometry = (h: number, gap: number) => {
  const markW = h * MARK_AR;
  const wordH = h * WORD_TO_MARK_H;
  const wordW = wordH * WORD_AR;
  const realGap = gap || h * WORD_GAP_TO_MARK_H;
  return {
    h,
    gap: realGap,
    markW,
    wordH,
    wordW,
    wordTop: h * WORD_TOP_TO_MARK_H,
    w: markW + realGap + wordW,
    markCx: markW / 2 - (markW + realGap + wordW) / 2,
  };
};

// ---------------------------------------------------------------------------
// Voronoi bloom — the statement transition. The SAME shader as the backdrop,
// re-lit in the three tenant tints, its cells GROWING over the cut (cells
// multiplying = apps multiplying). TransitionSeries keeps the entering
// presentation mounted at progress 1 for the whole incoming scene, so the
// field tail-fades to nothing and the cut lands back in the calm canvas.
// ---------------------------------------------------------------------------
type EmptyProps = Record<string, never>;

const VoronoiBloom: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{
          opacity: interpolate(p, [0.12, 0.42], [1, 0], {
            ...clampOpts,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
          }),
          transform: `scale(${interpolate(p, [0, 0.55], [1, 1.1], {
            ...clampOpts,
            easing: Easing.in(Easing.quad),
          })})`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  const fieldOpacity = interpolate(p, [0.04, 0.3, 0.74, 1], [0, 1, 1, 0], {
    ...clampOpts,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });
  // Cells grow from few to many — the division reads outward from center.
  const fieldScale = interpolate(p, [0, 1], [0.55, 1.7], {
    ...clampOpts,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const childStyle: React.CSSProperties = {
    opacity: interpolate(p, [0.6, 0.84], [0, 1], clampOpts),
    transform: `scale(${interpolate(p, [0.58, 1], [0.92, 1], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    })})`,
    filter: `blur(${interpolate(p, [0.6, 0.92], [10, 0], clampOpts)}px)`,
  };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: fieldOpacity, pointerEvents: "none" }}>
        <ShaderVoronoi
          colors={["#132638", "#31200f", "#0f281e"]}
          colorGap={BG}
          gap={0.07}
          distortion={0.42}
          glow={0.55}
          colorGlow={BG}
          scale={fieldScale}
          speed={1.1}
        />
      </AbsoluteFill>
      <AbsoluteFill style={childStyle}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const voronoiBloom = (): TransitionPresentation<EmptyProps> => ({
  component: VoronoiBloom,
  props: {},
});

// ---------------------------------------------------------------------------
// Slow camera drift — every scene rides a barely-there push-in so no frame
// is ever static. durationInFrames is Sequence-scoped inside TransitionSeries.
// ---------------------------------------------------------------------------
const Drift: React.FC<{ children: React.ReactNode; grow?: number }> = ({
  children,
  grow = 0.035,
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

// ---------------------------------------------------------------------------
// Per-word rise — words resolve out of blur while rising onto the baseline.
// ---------------------------------------------------------------------------
const WordsRise: React.FC<{
  text: string;
  fontSize: number;
  color?: string;
  fontFamily?: string;
  delay?: number;
  stagger?: number;
}> = ({
  text,
  fontSize,
  color = INK,
  fontFamily = HEAD,
  delay = 0,
  stagger = 3,
}) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
  const words = text.split(" ");
  return (
    <span
      style={{
        fontFamily,
        fontWeight: 400,
        fontSize,
        color,
        lineHeight: 1.3,
      }}
    >
      {words.map((word, i) => {
        const p = interpolate(frame - delay - i * stagger, [0, 22], [0, 1], {
          ...clampOpts,
          easing: ease,
        });
        // Travel lands at ~60% — the eased tail clicks the word down the pixel
        // grid one pixel every few frames; opacity/blur keep the full curve.
        const py = interpolate(frame - delay - i * stagger, [0, 13], [0, 1], {
          ...clampOpts,
          easing: ease,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: p,
              transform: `translateY(${(1 - py) * 24}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
};

// ===========================================================================
// Scene 1 — Hook. "One codebase" lands word by word, holds long enough to be
// read, then the line itself FANS into three copies — blue rises, orange
// holds the center, teal descends. The sentence literally becomes many, and
// the push-through dives through the vacated center.
// ===========================================================================
const FAN_FROM = 42;
const FAN_TO = 70;
const FAN_SPREAD = 96;

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fan = interpolate(frame, [FAN_FROM, FAN_TO], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.3, 0, 0.25, 1),
  });
  const inkOpacity = interpolate(fan, [0, 0.22], [1, 0], clampOpts);
  const copyOpacity = interpolate(fan, [0, 0.18], [0, 1], clampOpts);

  const line = (color: string, dir: -1 | 0 | 1) => (
    <span
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) translateY(${dir * fan * FAN_SPREAD}px)`,
        fontFamily: HEAD,
        fontWeight: 400,
        fontSize: 64,
        lineHeight: 1.2,
        color,
        opacity: copyOpacity,
        filter:
          dir !== 0 && fan > 0 && fan < 1
            ? `blur(${Math.sin(fan * Math.PI) * 3}px)`
            : undefined,
        whiteSpace: "nowrap",
      }}
    >
      One codebase
    </span>
  );

  return (
    <Drift>
      <AbsoluteFill>
        {/* The ink line that builds first. */}
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            opacity: inkOpacity,
          }}
        >
          <WordsRise text="One codebase" fontSize={64} delay={6} stagger={5} />
        </AbsoluteFill>
        {/* The three tenant copies it fans into. */}
        {line(TENANTS[0].color, -1)}
        {line(TENANTS[1].color, 0)}
        {line(TENANTS[2].color, 1)}
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 2 — Reveal. The mark's two folded faces glide together out of blur
// (the generated project assembling), one crisp grandeur beat, then ONE
// descent curve walks the mark into its lockup slot while the six wordmark
// letters stagger in and the tagline rises beneath. The lockup is a tight
// box: the wordmark stands as tall as the mark, the tagline spans exactly
// the lockup width.
// ===========================================================================
const RV = lockupGeometry(198, 0);
// The tagline stays centered in the frame, and avoids using platform marks
// as part of Tenkit's primary identity.
const TAGLINE = "Ship one app as many branded apps";
const TAGLINE_SIZE = 29;
const REVEAL_SETTLE_FROM = 36;
const REVEAL_SETTLE_TO = 86;

const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Face assembly — the two folds glide together along their own planes.
  const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
  const topP = interpolate(frame, [2, 28], [0, 1], {
    ...clampOpts,
    easing: ease,
  });
  const botP = interpolate(frame, [6, 32], [0, 1], {
    ...clampOpts,
    easing: ease,
  });

  // The one descent: scale and the walk into the lockup slot ride the same
  // curve, so the shrink and the move are one motion.
  const p = interpolate(frame, [REVEAL_SETTLE_FROM, REVEAL_SETTLE_TO], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.5, 0, 0.2, 1),
  });
  const groupScale = interpolate(p, [0, 1], [2.2, 1]);
  const groupX = (1 - p) * -RV.markCx;

  const letter = (i: number) => {
    const lp = interpolate(p, [0.3 + i * 0.07, 0.46 + i * 0.07], [0, 1], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    });
    return {
      opacity: lp,
      transform: `translateX(${(1 - lp) * 30}px)`,
      filter: lp < 1 ? `blur(${(1 - lp) * 8}px)` : undefined,
    };
  };

  return (
    <Drift>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <div
          style={{
            position: "relative",
            width: RV.w,
            height: RV.h,
            transform: `translateX(${groupX}px) scale(${groupScale})`,
            transformOrigin: `calc(50% + ${RV.markCx}px) 50%`,
          }}
        >
          {/* The mark: top fold arrives along its own diagonal, bottom fold
              rises to meet it. */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: RV.markW,
              height: RV.h,
            }}
          >
            <SvgLayer
              d={MARK_TOP}
              viewBox={MARK_VB}
              width={RV.markW}
              height={RV.h}
              color={INK}
              style={{
                opacity: topP,
                transform: `translate(${(1 - topP) * 34}px, ${(1 - topP) * -26}px)`,
                filter: topP < 1 ? `blur(${(1 - topP) * 10}px)` : undefined,
              }}
            />
            <SvgLayer
              d={MARK_BOTTOM}
              viewBox={MARK_VB}
              width={RV.markW}
              height={RV.h}
              color={INK}
              style={{
                opacity: botP,
                transform: `translate(${(1 - botP) * -14}px, ${(1 - botP) * 34}px)`,
                filter: botP < 1 ? `blur(${(1 - botP) * 10}px)` : undefined,
              }}
            />
          </div>
          {/* The wordmark, letter by letter, as tall as the mark. */}
          <div
            style={{
              position: "absolute",
              left: RV.markW + RV.gap,
              top: RV.wordTop,
              width: RV.wordW,
              height: RV.wordH,
            }}
          >
            {WORD_LETTERS.map((d, i) => (
              <SvgLayer
                key={i}
                d={d}
                viewBox={WORD_VB}
                width={RV.wordW}
                height={RV.wordH}
                color={INK}
                style={letter(i)}
              />
            ))}
          </div>
        </div>
        {/* The tagline — centered on the frame, not the lockup wrapper. */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            whiteSpace: "nowrap",
          }}
        >
          <WordsRise
            text={TAGLINE}
            fontSize={TAGLINE_SIZE}
            color={MUTED}
            delay={68}
            stagger={3}
          />
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 3 — Positioning. The site's own phrase assembles from the center.
// ===========================================================================
const SetupLineScene: React.FC = () => (
  <Drift>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Sequence from={8} layout="none">
        <WordsRise text="The setup you actually ship" fontSize={54} />
      </Sequence>
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 4 — The three real Setup Types hard-cut on a beat, each holding
// long enough to be read.
// ===========================================================================
const SETUPS = [
  "White label apps",
  "Runtime tenant app",
  "Generic + standalone",
];
const SETUP_STARTS = [8, 46, 84];

const SetupBeatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  let active = -1;
  for (let i = 0; i < SETUP_STARTS.length; i++) {
    if (frame >= SETUP_STARTS[i]) active = i;
  }
  const local = active >= 0 ? frame - SETUP_STARTS[active] : 0;
  const p = interpolate(local, [0, 8], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {active >= 0 ? (
          <span
            style={{
              fontFamily: HEAD,
              fontWeight: 400,
              fontSize: 72,
              lineHeight: 1.1,
              color: INK,
              opacity: p,
              transform: `scale(${interpolate(p, [0, 1], [1.12, 1])})`,
              filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
              whiteSpace: "nowrap",
            }}
          >
            {SETUPS[active]}
          </span>
        ) : null}
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 5 — The money shot, in two beats. The voronoi bloom lands on the
// STATEMENT first — "Same code, different identity" alone, readable — then
// the words lift away and the screens act it out: one neutral code-drawn
// phone rises, two clones slide out from behind it (same code), then
// identity floods left → right: icon, app name, button re-tint per tenant.
// ===========================================================================
const PHONE_W = 148;
const PHONE_H = 300;
const PHONE_SCALE = 1.13;
const PHONE_GAP = 292;
const TRIO_TEXT_EXIT = 62;
const PHONE_ENTER = 72;
const SPLIT_FROM = 92;
const SPLIT_TO = 120;
const BRAND_STARTS = [124, 134, 144];

const Phone: React.FC<{
  tenant: (typeof TENANTS)[number];
  brandP: number;
}> = ({ tenant, brandP }) => {
  // The neutral face rolls up and out as the brand face rolls in beneath it.
  const swapOut: React.CSSProperties = {
    opacity: 1 - brandP,
    transform: `translateY(${brandP * -7}px)`,
  };
  const swapIn: React.CSSProperties = {
    opacity: brandP,
    transform: `translateY(${(1 - brandP) * 7}px)`,
  };
  const pulse = PHONE_SCALE + Math.sin(brandP * Math.PI) * 0.02;
  return (
    <div
      style={{
        position: "relative",
        width: PHONE_W,
        height: PHONE_H,
        borderRadius: 30,
        border: `1.5px solid ${HAIRLINE}`,
        background: "#0f0f13",
        transform: `scale(${pulse})`,
        overflow: "hidden",
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          marginLeft: -21,
          width: 42,
          height: 5,
          borderRadius: 3,
          background: HAIRLINE,
        }}
      />
      {/* Header: icon chip + app name, both crossfading to the brand. */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 16,
          right: 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ position: "relative", width: 30, height: 30 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 8,
              background: "#1f1f24",
              opacity: 1 - brandP,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 8,
              background: tenant.color,
              opacity: brandP,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: HEAD,
              fontWeight: 500,
              fontSize: 15,
              color: "#09090b",
            }}
          >
            {tenant.letter}
          </div>
        </div>
        <div style={{ position: "relative", flex: 1, height: 22 }}>
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              fontFamily: HEAD,
              fontWeight: 400,
              fontSize: 16.5,
              lineHeight: "22px",
              color: MUTED,
              whiteSpace: "nowrap",
              ...swapOut,
            }}
          >
            Your app
          </span>
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              fontFamily: HEAD,
              fontWeight: 400,
              fontSize: 16.5,
              lineHeight: "22px",
              color: INK,
              whiteSpace: "nowrap",
              ...swapIn,
            }}
          >
            {tenant.name}
          </span>
        </div>
      </div>
      {/* Shared content — identical on every clone: the same codebase. */}
      <div
        style={{
          position: "absolute",
          top: 86,
          left: 16,
          right: 16,
          height: 74,
          borderRadius: 10,
          border: `1px solid ${HAIRLINE}`,
          background: SURFACE,
        }}
      />
      {[92, 74, 84].map((w, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 176 + i * 20,
            left: 16,
            width: w,
            height: 9,
            borderRadius: 5,
            background: "rgba(250,250,250,0.12)",
          }}
        />
      ))}
      {/* Primary button — the loudest place the identity lands. */}
      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 16,
          height: 34,
          borderRadius: 10,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 10,
            background: "#1f1f24",
            opacity: 1 - brandP,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 10,
            background: tenant.color,
            opacity: brandP,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: BODY,
            fontWeight: 400,
            fontSize: 13,
            color: "#09090b",
          }}
        >
          Continue
        </div>
      </div>
    </div>
  );
};

const TrioScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Beat 1 — the statement alone.
  const textExit = interpolate(
    frame,
    [TRIO_TEXT_EXIT, TRIO_TEXT_EXIT + 16],
    [0, 1],
    {
      ...clampOpts,
      easing: Easing.in(Easing.cubic),
    },
  );

  // Beat 2 — the screens act it out, rising into the space the words left.
  const phoneIn = interpolate(frame, [PHONE_ENTER, PHONE_ENTER + 22], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const split = interpolate(frame, [SPLIT_FROM, SPLIT_TO], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const brandP = (i: number) =>
    interpolate(frame - BRAND_STARTS[i], [0, 12], [0, 1], {
      ...clampOpts,
      easing: Easing.bezier(0.3, 0, 0.3, 1),
    });
  const sideOpacity = interpolate(split, [0, 0.22], [0, 1], clampOpts);

  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {/* Beat 1 — the statement, alone and readable. */}
        <span
          style={{
            position: "absolute",
            fontFamily: HEAD,
            fontWeight: 400,
            fontSize: 46,
            color: INK,
            opacity: 1 - textExit,
            transform: `translateY(${textExit * -56}px)`,
            filter: textExit > 0 ? `blur(${textExit * 8}px)` : undefined,
            whiteSpace: "nowrap",
          }}
        >
          Same code, different identity
        </span>
        {/* Beat 2 — the phones. */}
        <div
          style={{
            position: "relative",
            opacity: phoneIn,
            transform: `translateY(${(1 - phoneIn) * 70 - 10}px)`,
            filter: phoneIn < 1 ? `blur(${(1 - phoneIn) * 8}px)` : undefined,
          }}
        >
          {([-1, 1] as const).map((dir) => {
            const idx = dir === -1 ? 0 : 2;
            return (
              <div
                key={dir}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) translateX(${dir * split * PHONE_GAP}px)`,
                  opacity: sideOpacity,
                  zIndex: 1,
                }}
              >
                <Phone tenant={TENANTS[idx]} brandP={brandP(idx)} />
              </div>
            );
          })}
          <div style={{ position: "relative", zIndex: 2 }}>
            <Phone tenant={TENANTS[1]} brandP={brandP(1)} />
          </div>
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Feature stations — each station is two beats sharing one rhythm: the
// LABEL arrives first, alone at center, readable; then it glides down to
// its seat while the fragment arrives from the right, decelerating out of
// the whip's leftward momentum.
// ===========================================================================
const ST_TEXT_HOLD = 18; //  the label reads alone until here
const ST_VIS_FROM = 24; //   the fragment enters here

const Station: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  const frame = useCurrentFrame();
  const ease = Easing.out(Easing.cubic);
  const labelIn = interpolate(frame - 4, [0, 16], [0, 1], {
    ...clampOpts,
    easing: ease,
  });
  const seatP = interpolate(frame, [ST_TEXT_HOLD, ST_TEXT_HOLD + 18], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.45, 0, 0.25, 1),
  });
  const labelY = interpolate(seatP, [0, 1], [346, 496]);
  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {/* The fragment enters only after the label has been read. */}
        <Sequence from={ST_VIS_FROM}>
          <AbsoluteFill
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <StationVisual>{children}</StationVisual>
          </AbsoluteFill>
        </Sequence>
        <span
          style={{
            position: "absolute",
            top: labelY,
            fontFamily: HEAD,
            fontWeight: 400,
            fontSize: 31,
            color: INK,
            opacity: labelIn,
            transform: `translateX(${(1 - labelIn) * 60}px)`,
            filter: labelIn < 1 ? `blur(${(1 - labelIn) * 6}px)` : undefined,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </AbsoluteFill>
    </Drift>
  );
};

// The fragment slides in from the right, decelerating — same direction the
// whip travels, same direction the label arrived.
const StationVisual: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 18], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        transform: `translateX(${(1 - p) * 60}px) translateY(-56px)`,
        opacity: p,
        filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

// Station 1 — App variants. The generated file, each tenant's accent wearing
// its own color — native identity lives in one reviewable file.
type Token = { t: string; c: string };
const CONFIG_LINES: Token[][] = [
  [{ t: "export const appVariants = [", c: INK }],
  [
    { t: "  { slug: ", c: MUTED },
    { t: "'atlas'", c: INK },
    { t: ", theme: { accent: ", c: MUTED },
    { t: "'#208AEF'", c: TENANTS[0].color },
    { t: " } },", c: MUTED },
  ],
  [
    { t: "  { slug: ", c: MUTED },
    { t: "'ember'", c: INK },
    { t: ", theme: { accent: ", c: MUTED },
    { t: "'#EF8520'", c: TENANTS[1].color },
    { t: " } },", c: MUTED },
  ],
  [
    { t: "  { slug: ", c: MUTED },
    { t: "'mint'", c: INK },
    { t: ", theme: { accent: ", c: MUTED },
    { t: "'#2DD4A8'", c: TENANTS[2].color },
    { t: " } },", c: MUTED },
  ],
  [{ t: "] satisfies readonly AppVariant[];", c: INK }],
];

const ConfigScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 15,
          color: FAINT,
          marginBottom: 10,
        }}
      >
        src/constants/app-variants.ts
      </span>
      {CONFIG_LINES.map((tokens, i) => {
        const p = interpolate(frame - (6 + i * 7), [0, 18], [0, 1], {
          ...clampOpts,
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div
            key={i}
            style={{
              fontFamily: MONO,
              fontSize: 21,
              lineHeight: 1.55,
              whiteSpace: "pre",
              opacity: p,
              transform: `translateX(${(1 - p) * 34}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 5}px)` : undefined,
            }}
          >
            {tokens.map((tok, j) => (
              <span key={j} style={{ color: tok.c }}>
                {tok.t}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

// Station 2 — The local CLI. The repo's real commands, one per beat.
const CLI_ROWS = [
  { cmd: "pnpm tenkit build", detail: "prepare the selected app variant" },
  { cmd: "pnpm tenkit doctor", detail: "check identity, assets, and env" },
  { cmd: "pnpm tenkit reset", detail: "return native projects to default" },
];

const CliScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: 590,
        padding: "24px 28px",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 18,
        background: "rgba(15,15,19,0.72)",
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}
    >
      {CLI_ROWS.map((row, i) => {
        const p = interpolate(frame - (4 + i * 14), [0, 18], [0, 1], {
          ...clampOpts,
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div
            key={row.cmd}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              opacity: p,
              transform: `translateX(${(1 - p) * 38}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 5}px)` : undefined,
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 26, color: FAINT }}>
              $
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontFamily: MONO, fontSize: 26, color: INK }}>
                {row.cmd}
              </span>
              <span style={{ fontFamily: BODY, fontSize: 16, color: FAINT }}>
                {row.detail}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Station 3 — EAS builds. Three rows fill and settle with a quiet check —
// every tenant ships.
const EasScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        width: 520,
        padding: "24px 28px",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 18,
        background: "rgba(15,15,19,0.72)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {TENANTS.map((tenant, i) => {
        const start = 4 + i * 14;
        const p = interpolate(frame - start, [0, 18], [0, 1], {
          ...clampOpts,
          easing: Easing.out(Easing.cubic),
        });
        const fill = interpolate(frame - (start + 10), [0, 34], [0, 1], {
          ...clampOpts,
          easing: Easing.bezier(0.3, 0, 0.3, 1),
        });
        const checkIn = spring({
          frame: frame - (start + 46),
          fps,
          config: { damping: 12, stiffness: 170, mass: 0.7 },
        });
        const checkP = Math.max(0, Math.min(1, checkIn));
        return (
          <div
            key={tenant.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              opacity: p,
              transform: `translateX(${(1 - p) * 38}px)`,
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: tenant.color,
              }}
            />
            <span
              style={{
                fontFamily: BODY,
                fontWeight: 400,
                fontSize: 23,
                color: INK,
                width: 108,
                whiteSpace: "nowrap",
              }}
            >
              {tenant.name}
            </span>
            <div
              style={{
                position: "relative",
                width: 236,
                height: 4,
                borderRadius: 3,
                background: HAIRLINE,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 2,
                  background: tenant.color,
                  transformOrigin: "0 50%",
                  transform: `scaleX(${fill})`,
                }}
              />
            </div>
            <div
              style={{
                width: 24,
                height: 24,
                opacity: checkP,
                transform: `scale(${interpolate(checkP, [0, 1], [0.72, 1])})`,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="rgba(250,250,250,0.04)"
                  stroke={tenant.color}
                  strokeOpacity={0.72}
                  strokeWidth="1.4"
                />
                <path
                  d="M7.5 12.1L10.4 15L16.8 8.8"
                  stroke={INK}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="14"
                  strokeDashoffset={(1 - checkP) * 14}
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MontageScene: React.FC = () => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={F_CONFIG}>
        <Station label="App variants, one file">
          <ConfigScene />
        </Station>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: T_WHIP })}
        presentation={whipPan({ direction: "left" })}
      />
      <TransitionSeries.Sequence durationInFrames={F_CLI}>
        <Station label="Local commands for the native chores">
          <CliScene />
        </Station>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: T_WHIP })}
        presentation={whipPan({ direction: "left" })}
      />
      <TransitionSeries.Sequence durationInFrames={F_EAS}>
        <Station label="EAS builds for every app">
          <EasScene />
        </Station>
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 8 — Create. Package managers alternate quickly while the Tenkit
// create command stays locked and readable.
// ===========================================================================
const PACKAGE_MANAGERS = [
  { name: "pnpm", color: "#F69220" },
  { name: "bun", color: "#fafafa" },
  { name: "npm", color: "#CB3837" },
  { name: "pnpm", color: "#F69220" },
] as const;

const PackageManagerCycle: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: 86,
        height: 52,
        overflow: "hidden",
        verticalAlign: "bottom",
      }}
    >
      {PACKAGE_MANAGERS.map((pm, i) => {
        const start = i * 22;
        const p = interpolate(frame - start, [0, 10], [0, 1], {
          ...clampOpts,
          easing: Easing.bezier(0.2, 0.8, 0.2, 1),
        });
        const out = interpolate(frame - start, [18, 30], [0, 1], {
          ...clampOpts,
          easing: Easing.in(Easing.cubic),
        });
        const opacity = p * (1 - out);
        const y = (1 - p) * 30 - out * 28;
        return (
          <span
            key={`${pm.name}-${i}`}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              fontFamily: MONO,
              fontSize: 34,
              lineHeight: "52px",
              color: pm.color,
              opacity,
              transform: `translateY(${y}px)`,
              filter:
                opacity > 0 && opacity < 1
                  ? `blur(${(1 - opacity) * 5}px)`
                  : undefined,
              whiteSpace: "pre",
            }}
          >
            {pm.name}
          </span>
        );
      })}
    </span>
  );
};

const CreateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const tailP = interpolate(frame, [8, 24], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const caretOn = frame < 56 || Math.floor(frame / 12) % 2 === 0;
  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <PackageManagerCycle />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 34,
              color: INK,
              whiteSpace: "pre",
              opacity: tailP,
              transform: `translateX(${(1 - tailP) * 22}px)`,
              filter: tailP < 1 ? `blur(${(1 - tailP) * 5}px)` : undefined,
            }}
          >
            {" create tenkit@latest"}
          </span>
          <div
            style={{
              width: 15,
              height: 38,
              marginLeft: 5,
              background: INK,
              opacity: caretOn ? 0.9 : 0,
            }}
          />
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 9 — Outro. The reverse split: three tenant dots fly in from the
// directions the phones went and CONVERGE into the mark slot — many apps,
// one codebase again. The mark pops where they merge, the letters stagger
// in, tenkit.dev rests at the bottom.
// ===========================================================================
const OT = lockupGeometry(174, 0);
const MERGE_AT = 34;
const MARK_POP_AT = MERGE_AT + 8;

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const converge = interpolate(frame, [4, MERGE_AT], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const dotsOpacity = interpolate(
    frame,
    [MERGE_AT + 2, MERGE_AT + 10],
    [1, 0],
    clampOpts,
  );
  const mergeBallIn = interpolate(frame, [MERGE_AT - 6, MERGE_AT + 3], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const mergeBallOut = interpolate(
    frame,
    [MARK_POP_AT, MARK_POP_AT + 12],
    [1, 0],
    {
      ...clampOpts,
      easing: Easing.in(Easing.cubic),
    },
  );
  const mergeBallScale = interpolate(
    frame,
    [MERGE_AT - 4, MERGE_AT + 6, MARK_POP_AT + 12],
    [0.45, 1.45, 0.72],
    {
      ...clampOpts,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    },
  );
  const markIn = spring({
    frame: frame - MARK_POP_AT,
    fps,
    config: { damping: 13, stiffness: 150, mass: 0.8 },
  });
  const letter = (i: number) => {
    const lp = interpolate(
      frame - (MARK_POP_AT + 12 + i * 4),
      [0, 16],
      [0, 1],
      {
        ...clampOpts,
        easing: Easing.out(Easing.cubic),
      },
    );
    return {
      opacity: lp,
      transform: `translateX(${(1 - lp) * 26}px)`,
      filter: lp < 1 ? `blur(${(1 - lp) * 7}px)` : undefined,
    };
  };
  const urlP = interpolate(frame, [96, 116], [0, 1], clampOpts);

  // The dots start where the phones lived: left, high center, right.
  const DOT_FROM: Array<[number, number]> = [
    [-440, -40],
    [50, -270],
    [440, 190],
  ];

  return (
    <Drift grow={0.05}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            width: OT.w,
            height: OT.h,
          }}
        >
          {/* The three tenant dots, converging into the mark slot. */}
          {TENANTS.map((tenant, i) => {
            const [fx, fy] = DOT_FROM[i];
            const x = OT.markCx + fx * (1 - converge);
            const y = fy * (1 - converge);
            const dotColor = interpolateColors(
              converge,
              [0, 0.72, 1],
              [tenant.color, tenant.color, INK],
            );
            const dotScale = interpolate(converge, [0, 0.82, 1], [1, 1, 1.38], {
              ...clampOpts,
              easing: Easing.out(Easing.cubic),
            });
            return (
              <div
                key={tenant.name}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 18,
                  height: 18,
                  marginLeft: -9,
                  marginTop: -9,
                  borderRadius: "50%",
                  background: dotColor,
                  opacity: dotsOpacity,
                  transform: `translate(${x}px, ${y}px) scale(${dotScale})`,
                }}
              />
            );
          })}
          {/* A single white merge point bridges the dots into the mark. */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 30,
              height: 30,
              marginLeft: -15,
              marginTop: -15,
              borderRadius: "50%",
              background: INK,
              opacity: mergeBallIn * mergeBallOut,
              transform: `translate(${OT.markCx}px, 0px) scale(${mergeBallScale})`,
            }}
          />
          {/* The mark grows out of the white merge point. */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: OT.markW,
              height: OT.h,
              opacity: Math.min(1, markIn * 1.3),
              transform: `scale(${interpolate(markIn, [0, 1], [0.18, 1])})`,
              transformOrigin: "50% 50%",
            }}
          >
            <SvgLayer
              d={MARK_TOP}
              viewBox={MARK_VB}
              width={OT.markW}
              height={OT.h}
              color={INK}
            />
            <SvgLayer
              d={MARK_BOTTOM}
              viewBox={MARK_VB}
              width={OT.markW}
              height={OT.h}
              color={INK}
            />
          </div>
          {/* The wordmark, letter by letter, as tall as the mark. */}
          <div
            style={{
              position: "absolute",
              left: OT.markW + OT.gap,
              top: OT.wordTop,
              width: OT.wordW,
              height: OT.wordH,
            }}
          >
            {WORD_LETTERS.map((d, i) => (
              <SvgLayer
                key={i}
                d={d}
                viewBox={WORD_VB}
                width={OT.wordW}
                height={OT.wordH}
                color={INK}
                style={letter(i)}
              />
            ))}
          </div>
        </div>
        <span
          style={{
            position: "absolute",
            bottom: 42,
            fontFamily: BODY,
            fontWeight: 400,
            fontSize: 18,
            color: FAINT,
            opacity: urlP,
          }}
        >
          tenkit.dev
        </span>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Composition root. One quiet voronoi field carries the whole video — one
// continuous surface partitioned into many cells IS the product. The
// statement transition is the SAME shader re-lit in the tenant tints, so
// backdrop and cuts speak one language. No swirl anywhere.
// ===========================================================================
export const IntroducingTenkitDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-geist-sans": HEAD_FAMILY,
          background: BG,
        } as React.CSSProperties
      }
    >
      <ShaderVoronoi
        speed={0.22}
        colors={["#0e0e12", "#131318", "#17171d"]}
        colorGap={BG}
        gap={0.05}
        distortion={0.35}
        glow={0}
        scale={0.75}
      />
      {/* Vignette scrim — keeps the cells a texture, not a subject. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 42%, rgba(9,9,11,0.6) 0%, rgba(9,9,11,0.94) 100%)",
        }}
      />

      <TransitionSeries>
        {/* 1 — Hook: One codebase → fans into three */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PUSH })}
          presentation={pushThrough()}
        />

        {/* 2 — Reveal */}
        <TransitionSeries.Sequence durationInFrames={S_REVEAL}>
          <RevealScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 3 — The setup you actually ship */}
        <TransitionSeries.Sequence durationInFrames={S_LINE}>
          <SetupLineScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 4 — Setup type beats */}
        <TransitionSeries.Sequence durationInFrames={S_BEATS}>
          <SetupBeatsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLOOM })}
          presentation={voronoiBloom()}
        />

        {/* 5 — Statement, then the money shot */}
        <TransitionSeries.Sequence durationInFrames={S_TRIO}>
          <TrioScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_WHIP })}
          presentation={whipPan({ direction: "left" })}
        />

        {/* 6 — Feature montage (whip-pans inside keep the same direction) */}
        <TransitionSeries.Sequence durationInFrames={S_MONTAGE}>
          <MontageScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 7 — pnpm create tenkit@latest */}
        <TransitionSeries.Sequence durationInFrames={S_CREATE}>
          <CreateScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PUSH })}
          presentation={pushThrough()}
        />

        {/* 8 — Reverse split → lockup + tenkit.dev */}
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
