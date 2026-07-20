// The letter. While the swarm flies its pads, the R letterform draws itself
// around them in screen space; ink rises through the mosaic until the mark
// is solid; then the world hands off — pixel-identical — to the lockup
// layer, where the R springs down to logo size, "emocn" slides out from
// behind it (the shipped brand gesture), and the showcases URL rises.

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MARK_PATH, MARK_RATIO, MARK_VIEWBOX_H, MARK_VIEWBOX_W } from "./mark";
import { R_SCREEN } from "./rig";

const INK = "#f2f2f2";
const FAINT = "rgba(242,242,242,0.4)";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// One R, centered on (cx, cy) at a given height — the same geometry the
// world's swarm pads were sampled against, so overlay and lockup line up.
const RMark: React.FC<{
  cx: number;
  cy: number;
  size: number;
  draw?: number;
  fillOpacity?: number;
}> = ({ cx, cy, size, draw = 1, fillOpacity = 1 }) => (
  <svg
    viewBox={`0 0 ${MARK_VIEWBOX_W} ${MARK_VIEWBOX_H}`}
    width={size * MARK_RATIO}
    height={size}
    style={{
      position: "absolute",
      left: cx - (size * MARK_RATIO) / 2,
      top: cy - size / 2,
      color: INK,
      overflow: "visible",
      display: "block",
    }}
  >
    <path
      d={MARK_PATH}
      pathLength={1}
      fill="currentColor"
      fillOpacity={fillOpacity}
      stroke="currentColor"
      strokeWidth={draw < 1 || fillOpacity < 1 ? 1.7 : 0}
      vectorEffect="non-scaling-stroke"
      strokeLinejoin="round"
      strokeDasharray={1}
      strokeDashoffset={1 - draw}
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Over the world: contour draw while the swarm lands, ink rise once it has.
// Mounts at 730, dies with the world at 830.
// ---------------------------------------------------------------------------
export const LetterOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [6, 62], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const fill = interpolate(frame, [70, 96], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <RMark
        cx={R_SCREEN.cx}
        cy={R_SCREEN.cy}
        size={R_SCREEN.h}
        draw={draw}
        fillOpacity={fill}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// The lockup layer. Takes over at frame 830 with the identical solid R,
// springs it down into the wordmark slot, slides the tail out, lifts the URL.
// ---------------------------------------------------------------------------
const WORD_TAIL = "emocn";
const WORD_SIZE = 92;
const WORD_TRACKING = -0.03; // the shipped wordmark's own tracking
const MARK_SIZE = 66;
const BASELINE = 380; // lockup baseline: centers the word block on y 334

const measureTail = (fontFamily: string): number => {
  const fallback = WORD_TAIL.length * WORD_SIZE * 0.55;
  if (typeof document === "undefined") return fallback;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.font = `400 ${WORD_SIZE}px ${fontFamily}, sans-serif`;
  return (
    ctx.measureText(WORD_TAIL).width +
    WORD_TAIL.length * WORD_TRACKING * WORD_SIZE +
    2
  );
};

export const FinaleLockup: React.FC<{ sansFamily: string }> = ({
  sansFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tailWidth = React.useMemo(() => measureTail(sansFamily), [sansFamily]);

  const markW = MARK_SIZE * MARK_RATIO;
  const lockupW = markW + tailWidth;
  const lockupLeft = 640 - lockupW / 2;

  // where the mark ends up: left edge of the lockup, feet on the baseline
  const endCx = lockupLeft + markW / 2;
  const endCy = BASELINE - WORD_SIZE * 0.115 - MARK_SIZE / 2;

  const shrink = spring({
    frame: frame - 4,
    fps,
    config: { damping: 16, stiffness: 80, mass: 1 },
  });
  const size = interpolate(shrink, [0, 1], [R_SCREEN.h, MARK_SIZE]);
  const cx = interpolate(shrink, [0, 1], [R_SCREEN.cx, endCx]);
  const cy = interpolate(shrink, [0, 1], [R_SCREEN.cy, endCy]);

  const slide = Math.min(
    1,
    spring({
      frame: frame - 36,
      fps,
      config: { damping: 18, stiffness: 90, mass: 1 },
    }),
  );

  const urlOpacity = interpolate(frame, [62, 82], [0, 1], clampOpts);
  const urlRise = interpolate(frame, [62, 84], [10, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <RMark cx={cx} cy={cy} size={size} />

      {/* the tail slides out from behind the mark, leading edge first */}
      <div
        style={{
          position: "absolute",
          left: lockupLeft + markW,
          top: BASELINE - WORD_SIZE,
          width: slide * tailWidth,
          height: WORD_SIZE,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            whiteSpace: "nowrap",
            lineHeight: 1,
            fontFamily: "var(--fable-sans)",
            fontWeight: 400,
            fontSize: WORD_SIZE,
            letterSpacing: `${WORD_TRACKING}em`,
            color: INK,
          }}
        >
          {WORD_TAIL}
        </span>
      </div>

      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 96,
          textAlign: "center",
          fontFamily: "var(--fable-sans)",
          fontWeight: 400,
          fontSize: 24,
          color: FAINT,
          opacity: urlOpacity,
          transform: `translateY(${urlRise}px)`,
        }}
      >
        remocn.dev/showcases
      </span>
    </AbsoluteFill>
  );
};
