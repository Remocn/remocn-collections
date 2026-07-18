"use client";

import type React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export type PrismRefractionProps = {
  /** Spectrum fan colors, ordered inside → outside. */
  colors?: string[];
  beamColor?: string;
  /** Softness of the beam and fan (blur radius). */
  glow?: number;
  /**
   * The height of the mark in the scene this transition hands the prism to.
   * The overlay prism morphs — spin, glide, shrink — into exactly that
   * mark's slot, so the logo is never hidden and re-shown: the refracting
   * element BECOMES the scene's logo.
   */
  targetMarkHeight?: number;
};

// The official Prisma prism silhouette (press-kit mark, 58×72 box), used as
// the refracting element — the brand IS the transition.
const PRISM_D =
  "M0.522473 45.0933C-0.184191 46.246 -0.173254 47.7004 0.550665 48.8423L13.6534 69.5114C14.5038 70.8529 16.1429 71.4646 17.6642 71.0082L55.4756 59.6648C57.539 59.0457 58.5772 56.7439 57.6753 54.7874L33.3684 2.06007C32.183 -0.511323 28.6095 -0.722394 27.1296 1.69157L0.522473 45.0933ZM32.7225 14.1141C32.2059 12.9187 30.4565 13.1028 30.2001 14.3796L20.842 60.9749C20.6447 61.9574 21.5646 62.7964 22.5248 62.5098L48.6494 54.7114C49.4119 54.4838 49.8047 53.6415 49.4891 52.9111L32.7225 14.1141Z";

const W = 1280;
const H = 720;
// Where the beam lands and the fan opens from — the prism's center.
const APEX = { x: W * 0.5, y: H * 0.5 };
// The overlay prism is drawn at this height before morphing.
const RIG_HEIGHT = 150;

/** One fan wedge from the apex out to a far circle, in degrees. */
function wedge(a1: number, a2: number, r: number): string {
  const rad = (a: number) => (a * Math.PI) / 180;
  const p = (a: number) => ({
    x: APEX.x + r * Math.cos(rad(a)),
    y: APEX.y + r * Math.sin(rad(a)),
  });
  const s = p(a1);
  const e = p(a2);
  return `M ${APEX.x} ${APEX.y} L ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y} Z`;
}

// The fan covers the right hemisphere and then some — four spectrum bands.
const FAN_ARCS: Array<[number, number]> = [
  [-58, -20],
  [-20, 8],
  [8, 34],
  [34, 62],
];

const morphEase = Easing.bezier(0.65, 0, 0.35, 1);

const PrismRefractionPresentation: React.FC<
  TransitionPresentationComponentProps<PrismRefractionProps>
> = ({
  children,
  presentationProgress,
  presentationDirection,
  passedProps,
}) => {
  const {
    colors = ["#818cf8", "#6366f1", "#2dd4bf", "#14b8a6"],
    beamColor = "#ffffff",
    glow = 18,
    targetMarkHeight = 96,
  } = passedProps;
  const entering = presentationDirection === "entering";
  const p = presentationProgress;

  if (!entering) {
    // The outgoing scene is swallowed by the fan: it sinks into the impact
    // point as the spectrum closes over it.
    const exitStyle: React.CSSProperties = {
      opacity: interpolate(p, [0.34, 0.58], [1, 0], clampOpts),
      transform: `scale(${interpolate(p, [0, 0.6], [1, 1.06], {
        ...clampOpts,
        easing: Easing.in(Easing.cubic),
      })})`,
    };
    return <AbsoluteFill style={exitStyle}>{children}</AbsoluteFill>;
  }

  // --- Choreography ---
  // 1. Appearance (0 → 0.62): the beam strikes, the prism flares upright,
  //    the fan opens and swallows the outgoing scene, the camera zooms in.
  // 2. Recombine (0.58 → 0.8): the fan squeezes back into a line through
  //    the prism — the spectrum recombining into white light, the exact
  //    reverse of how it arrived.
  // 3. The beam exits RIGHT (0.78 → 0.95) while the prism spins once and
  //    glides LEFT into the incoming scene's own mark slot (0.6 → 0.92).
  // 4. Handoff (0.84 → 0.97): the rig crossfades into the scene; the
  //    prism's fill lands so the swap is invisible.
  const beamP = interpolate(p, [0, 0.28], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.quad),
  });
  const hitP = interpolate(p, [0.24, 0.38], [0, 1], clampOpts);
  const fanP = interpolate(p, [0.3, 0.62], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const squashP = interpolate(p, [0.58, 0.78], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const lineIn = interpolate(p, [0.68, 0.78], [0, 1], clampOpts);
  const exitXP = interpolate(p, [0.78, 0.95], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });
  const lineOut = interpolate(p, [0.88, 0.96], [1, 0], clampOpts);
  const morphP = interpolate(p, [0.6, 0.92], [0, 1], {
    ...clampOpts,
    easing: morphEase,
  });
  const fillIn = interpolate(p, [0.78, 0.92], [0, 1], clampOpts);
  const overlayOut = interpolate(p, [0.86, 0.97], [1, 0], clampOpts);
  const sceneIn = interpolate(p, [0.5, 0.82], [0, 1], clampOpts);
  // Camera: zoom into the impact, settle back as the morph lands.
  const zoom = interpolate(p, [0.3, 0.62, 0.98], [1, 1.07, 1], clampOpts);

  // The mark slot in the incoming scene: the lockup is centered, so the
  // mark's center sits left of center by (wordmark) width share.
  const targetCx = W / 2 - (targetMarkHeight * 85) / 72;
  const targetCy = H / 2;
  const targetScale = targetMarkHeight / RIG_HEIGHT;

  const beamLen = APEX.x + 80;
  const beamX = -beamLen + beamP * (beamLen + APEX.x - 140);

  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
      {/* The incoming scene — resolves beneath as the fan drains. */}
      <AbsoluteFill style={{ opacity: sceneIn }}>{children}</AbsoluteFill>

      {/* The refraction rig. */}
      <AbsoluteFill style={{ opacity: overlayOut }}>
        {/* The spectrum fan — opens on impact, then CLOSES the same way it
            opened: the wedges fold back into a thin ray pointing right,
            fading as the exit beam is born from it. */}
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{
            position: "absolute",
            inset: 0,
            filter: `blur(${glow}px)`,
            opacity: fanP * interpolate(p, [0.7, 0.85], [1, 0], clampOpts),
          }}
        >
          {FAN_ARCS.map(([a1, a2], i) => {
            // Openness: grows with the entrance, folds back on exit —
            // the exact reverse of the opening sweep.
            const o = fanP * (1 - squashP);
            return (
              <path
                key={i}
                d={wedge(a1 * o + (1 - o) * -2, a2 * o + (1 - o) * 2, 2400)}
                fill={colors[i % colors.length]}
                opacity={0.82}
              />
            );
          })}
        </svg>

        {/* The recombined beam — born where the fan folds shut, exits
            right the way the first beam arrived from the left. */}
        <div
          style={{
            position: "absolute",
            top: APEX.y - 1.5,
            left: APEX.x,
            width: W - APEX.x + 200,
            height: 3,
            background: `linear-gradient(90deg, ${beamColor}, transparent 92%)`,
            filter: `blur(0.5px) drop-shadow(0 0 ${glow * 0.7}px ${beamColor})`,
            opacity: lineIn * lineOut,
            transform: `translateX(${exitXP * 1500}px) scaleX(${1 + exitXP * 0.6})`,
            transformOrigin: "left center",
          }}
        />

        {/* The prism — flares on impact, then spins once and glides into
            the scene's mark slot, filling in for the handoff. */}
        <svg
          width={RIG_HEIGHT * (58 / 72)}
          height={RIG_HEIGHT}
          viewBox="0 0 58 72"
          fill="none"
          style={{
            position: "absolute",
            left: APEX.x - RIG_HEIGHT * (58 / 72) * 0.5,
            top: APEX.y - RIG_HEIGHT * 0.5,
            opacity: interpolate(p, [0.14, 0.26], [0, 1], clampOpts),
            filter: `drop-shadow(0 0 ${10 + hitP * 26}px rgba(255,255,255,${
              (0.25 + hitP * 0.55) * (1 - fillIn * 0.7)
            }))`,
            transform: `translate(${morphP * (targetCx - APEX.x)}px, ${
              morphP * (targetCy - APEX.y)
            }px) rotate(${morphP * -360}deg) scale(${
              interpolate(p, [0.14, 0.34], [0.85, 1], clampOpts) *
              (1 + (targetScale - 1) * morphP)
            })`,
            transformOrigin: "50% 50%",
          }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={PRISM_D}
            fill={`rgba(255,255,255,${0.06 + hitP * 0.1 + fillIn * 0.84})`}
            stroke="#ffffff"
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </svg>

        {/* The beam — a hard line of light with a soft halo. */}
        <div
          style={{
            position: "absolute",
            top: APEX.y - 1.5,
            left: 0,
            width: beamLen,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${beamColor})`,
            filter: `blur(0.5px) drop-shadow(0 0 ${glow * 0.7}px ${beamColor})`,
            opacity: (beamP > 0 && beamP < 1 ? 1 : 0) * (1 - hitP * 0.9),
            transform: `translateX(${beamX}px)`,
          }}
        />

        {/* Impact flash. */}
        <div
          style={{
            position: "absolute",
            left: APEX.x - 90,
            top: APEX.y - 90,
            width: 180,
            height: 180,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.85), transparent 65%)",
            opacity: interpolate(hitP, [0, 0.4, 1], [0, 0.9, 0], clampOpts),
            transform: `scale(${0.4 + hitP * 1.4})`,
            filter: `blur(${glow * 0.6}px)`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * prism-refraction — a beam of light strikes the prism, the spectrum fan
 * swallows the outgoing scene; then the fan collapses back into the prism
 * and the prism spins into the incoming scene's own mark slot. A branded
 * transition: the refracting element never leaves — it becomes the logo.
 */
export function prismRefraction(
  props: PrismRefractionProps = {},
): TransitionPresentation<PrismRefractionProps> {
  return {
    component: PrismRefractionPresentation,
    props,
  };
}
