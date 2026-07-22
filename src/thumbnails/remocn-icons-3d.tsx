import React from "react";
import { AbsoluteFill } from "remotion";
import { MANROPE, REMOCN, RemocnLockup, ThumbFrame } from "./kit";

import { BellIconStatic } from "@/components/remocn/icon-bell";
import { HeartIconStatic } from "@/components/remocn/icon-heart";
import { StarIconStatic } from "@/components/remocn/icon-star";
import { ZapIconStatic } from "@/components/remocn/icon-zap";
import { CloudIconStatic } from "@/components/remocn/icon-cloud";
import { MoonIconStatic } from "@/components/remocn/icon-moon";
import { PlayIconStatic } from "@/components/remocn/icon-play";
import { FlameIconStatic } from "@/components/remocn/icon-flame";
import { RocketIconStatic } from "@/components/remocn/icon-rocket";
import { SparklesIconStatic } from "@/components/remocn/icon-sparkles";
import { CrownIconStatic } from "@/components/remocn/icon-crown";
import { TrophyIconStatic } from "@/components/remocn/icon-trophy";
import { SunIconStatic } from "@/components/remocn/icon-sun";
import { CameraIconStatic } from "@/components/remocn/icon-camera";

type IconComp = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

/**
 * A shard of the blast. The stroke is given volume the way the 3D cut gives
 * it: three passes of the same registry path — a lime rim from behind-left,
 * the ink body, and a white key highlight riding the near side.
 */
const TubeShard: React.FC<{
  Icon: IconComp;
  x: number;
  y: number;
  size: number;
  rotate: number;
  opacity: number;
  blur?: number;
}> = ({ Icon, x, y, size, rotate, opacity, blur = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      opacity,
      transform: `rotate(${rotate}deg)`,
      filter: blur
        ? `blur(${blur}px) drop-shadow(0 18px 26px rgba(0,0,0,0.7))`
        : "drop-shadow(0 22px 30px rgba(0,0,0,0.75))",
    }}
  >
    <div style={{ position: "absolute", left: -2, top: -2.4 }}>
      <Icon size={size} color={REMOCN.lime} strokeWidth={4.4} />
    </div>
    <div style={{ position: "absolute", left: 0, top: 0 }}>
      <Icon size={size} color="#c4c3d0" strokeWidth={3.5} />
    </div>
    <div style={{ position: "absolute", left: 1, top: 1.2, opacity: 0.8 }}>
      <Icon size={size} color="#ffffff" strokeWidth={1.4} />
    </div>
  </div>
);

/**
 * Type given the same treatment as the icons: a solid extruded away from the
 * viewer, its body in near-black, the lime living in the rim light that rides
 * the upper-left edge rather than in the fill.
 */
const ExtrudedLine: React.FC<{
  text: string;
  size: number;
  face: string;
  depth?: number;
}> = ({ text, size, face, depth = 26 }) => {
  // dense enough that the copies fuse into one solid rather than ghosting
  const step = size * 0.0085;
  const base: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    fontFamily: MANROPE,
    fontWeight: 800,
    fontSize: size,
    lineHeight: `${size * 0.98}px`,
    letterSpacing: "-0.045em",
    whiteSpace: "nowrap",
  };
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <span style={{ ...base, position: "relative", visibility: "hidden" }}>
        {text}
      </span>
      {Array.from({ length: depth }).map((_, k) => {
        // painted back to front, so the near side of the wall stays on top
        const i = depth - 1 - k;
        // the side wall is lit: bright where it meets the face, falling away
        // into the ground at the far end — a solid, never a cast shadow
        const t = i / (depth - 1);
        const c = (a: number, b: number) => Math.round(a + (b - a) * t);
        return (
          <span
            key={k}
            style={{
              ...base,
              color: `rgb(${c(64, 24)}, ${c(63, 23)}, ${c(78, 31)})`,
              transform: `translate(${(i + 1) * step * 0.86}px, ${(i + 1) * step}px)`,
            }}
          >
            {text}
          </span>
        );
      })}
      <span
        style={{
          ...base,
          color: REMOCN.lime,
          transform: `translate(${-size * 0.042}px, ${-size * 0.05}px)`,
        }}
      >
        {text}
      </span>
      <span style={{ ...base, color: face }}>{text}</span>
    </div>
  );
};

type Shard = {
  Icon: IconComp;
  x: number;
  y: number;
  size: number;
  rotate: number;
  opacity: number;
  blur?: number;
};

/** the point the blast leaves from — everything is aimed away from it */
// the blast sits high so the debris fans across the top and right and the
// lower-left stays clear for the type
const CORE = { x: 866, y: 296 };

/** three parallax layers, far first so the near debris lands on top */
const SHARDS: Shard[] = [
  { Icon: SparklesIconStatic, x: 792, y: 186, size: 58, rotate: 20, opacity: 0.62, blur: 1 },
  { Icon: CrownIconStatic, x: 986, y: 142, size: 62, rotate: -14, opacity: 0.62, blur: 1 },
  { Icon: TrophyIconStatic, x: 566, y: 268, size: 56, rotate: 30, opacity: 0.62, blur: 1 },
  { Icon: SunIconStatic, x: 1088, y: 224, size: 54, rotate: 8, opacity: 0.58, blur: 1.2 },
  { Icon: CameraIconStatic, x: 846, y: 424, size: 60, rotate: -28, opacity: 0.62, blur: 1 },

  { Icon: CloudIconStatic, x: 472, y: 146, size: 92, rotate: 8, opacity: 0.9 },
  { Icon: MoonIconStatic, x: 702, y: 322, size: 96, rotate: -18, opacity: 0.9 },
  { Icon: PlayIconStatic, x: 1004, y: 398, size: 88, rotate: 12, opacity: 0.9 },
  { Icon: FlameIconStatic, x: 904, y: 566, size: 90, rotate: -6, opacity: 0.9 },
  { Icon: RocketIconStatic, x: 1178, y: 328, size: 86, rotate: 18, opacity: 0.9 },

  { Icon: HeartIconStatic, x: 256, y: 176, size: 132, rotate: -22, opacity: 1 },
  { Icon: BellIconStatic, x: 630, y: 92, size: 118, rotate: 26, opacity: 1 },
  { Icon: ZapIconStatic, x: 1146, y: 122, size: 130, rotate: -12, opacity: 1 },
  { Icon: StarIconStatic, x: 1186, y: 570, size: 126, rotate: 14, opacity: 1 },
];

/**
 * "Same stroke, real depth" — the 3D cut, whose gallery beat detonates the
 * 24 icons out of the center as true tube strokes. The frame is that blast:
 * shards tumbling out of a lime core in three parallax layers, the claim
 * held in the clean upper-left.
 */
export const RemocnIcons3dThumb: React.FC = () => (
  <ThumbFrame background={REMOCN.obsidian}>
    <AbsoluteFill>
      {/* the blast core */}
      <div
        style={{
          position: "absolute",
          left: CORE.x - 380,
          top: CORE.y - 380,
          width: 760,
          height: 760,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(195,232,141,0.42) 0%, rgba(195,232,141,0.13) 26%, rgba(20,19,24,0) 58%)",
          filter: "blur(28px)",
        }}
      />

      {/* the debris is still leaving: a speed line behind every shard */}
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        {SHARDS.map((s, i) => {
          const dx = s.x - CORE.x;
          const dy = s.y - CORE.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const near = 46;
          const far = Math.max(near + 20, len - s.size * 0.52);
          return (
            <line
              key={i}
              x1={CORE.x + ux * near}
              y1={CORE.y + uy * near}
              x2={CORE.x + ux * far}
              y2={CORE.y + uy * far}
              stroke={REMOCN.lime}
              strokeWidth={3.4}
              strokeLinecap="round"
              opacity={0.24}
            />
          );
        })}
      </svg>

      {/* each shard drags a ghost of itself back toward the core */}
      {SHARDS.filter((s) => !s.blur).map((s, i) => {
        const t = 0.3;
        return (
          <TubeShard
            key={`ghost-${i}`}
            {...s}
            x={s.x + (CORE.x - s.x) * t}
            y={s.y + (CORE.y - s.y) * t}
            size={s.size * 0.84}
            opacity={s.opacity * 0.16}
            blur={7}
          />
        );
      })}

      {SHARDS.map((s, i) => (
        <TubeShard key={i} {...s} />
      ))}

      {/* the floor the type stands on */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(76% 66% at 6% 96%, rgba(20,19,24,0.98) 0%, rgba(20,19,24,0.9) 34%, rgba(20,19,24,0.44) 60%, rgba(20,19,24,0) 80%)",
        }}
      />

      {/* the claim, extruded and set on the same receding plane as the blast */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 344,
          perspective: "900px",
          perspectiveOrigin: "4% 50%",
        }}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateY(21deg) rotateX(4deg)",
            transformOrigin: "0% 50%",
          }}
        >
          <ExtrudedLine text="Same stroke," size={130} face={REMOCN.ink} />
          <div style={{ marginTop: 10, marginLeft: 104 }}>
            <ExtrudedLine
              text="real depth"
              size={96}
              face="rgba(242,242,242,0.86)"
              depth={22}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 70,
          top: 632,
          display: "flex",
          alignItems: "center",
          gap: 22,
        }}
      >
        <RemocnLockup size={52} />
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
