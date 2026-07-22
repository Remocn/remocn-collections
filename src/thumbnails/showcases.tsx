import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { MANROPE, REMOCN, RemocnLockup, ThumbFrame } from "./kit";

/**
 * "41 videos, one camera" — the canyon of screens the whole cut flies through,
 * frozen mid-flight. Real showcase thumbnails stand as walls in CSS 3D and the
 * corridor recedes to a lime vanishing point; a scrim carries the copy across
 * the left third.
 */
type Screen = { thumb: string; x: number; y: number; z: number; ry: number };

const SCREENS: Screen[] = [
  // left wall, far → near
  { thumb: "shieldcn", x: -470, y: -12, z: -1240, ry: 34 },
  { thumb: "tegami", x: -470, y: 14, z: -940, ry: 34 },
  { thumb: "llms-txt", x: -470, y: -22, z: -620, ry: 34 },
  { thumb: "shadcn-aria", x: -470, y: 26, z: -300, ry: 34 },
  { thumb: "ai-and-social", x: -470, y: -32, z: 30, ry: 34 },
  // right wall, far → near
  { thumb: "changelog", x: 470, y: -14, z: -1120, ry: -34 },
  { thumb: "introducing-nextjs", x: 470, y: 22, z: -800, ry: -34 },
  { thumb: "sponsor-reactbits", x: 470, y: -18, z: -460, ry: -34 },
  { thumb: "remocn-ui", x: 470, y: 30, z: -130, ry: -34 },
  { thumb: "introducing-remocn", x: 470, y: -26, z: 220, ry: -34 },
];

const TILE_W = 440;
const TILE_H = 248;

const ScreenTile: React.FC<{ screen: Screen }> = ({ screen }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: TILE_W,
      height: TILE_H,
      marginLeft: -TILE_W / 2,
      marginTop: -TILE_H / 2,
      transform: `translate3d(${screen.x}px, ${screen.y}px, ${screen.z}px) rotateY(${screen.ry}deg)`,
      borderRadius: 10,
      overflow: "hidden",
      border: "1px solid rgba(242,242,242,0.10)",
      boxShadow: "0 40px 110px rgba(0,0,0,0.75)",
      background: "#0d0c11",
    }}
  >
    <Img
      src={staticFile(`thumbnails/${screen.thumb}.png`)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: "brightness(1.8) saturate(1.2)",
      }}
    />
  </div>
);

export const ShowcasesThumb: React.FC = () => (
  <ThumbFrame background={REMOCN.obsidian}>
    <AbsoluteFill>
      {/* the lime haze sitting at the vanishing point */}
      <div
        style={{
          position: "absolute",
          left: 500,
          top: 134,
          width: 280,
          height: 280,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(195,232,141,0.34) 0%, rgba(195,232,141,0.11) 38%, rgba(20,19,24,0) 68%)",
          filter: "blur(22px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: "820px",
          perspectiveOrigin: "50% 38%",
        }}
      >
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
          {SCREENS.map((s) => (
            <ScreenTile key={s.thumb} screen={s} />
          ))}
        </div>
      </div>

      {/* scrims: the corridor stays visible up top, the copy gets a clean floor */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(20,19,24,0) 30%, rgba(20,19,24,0.72) 58%, rgba(20,19,24,0.96) 78%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(96% 88% at 4% 92%, rgba(20,19,24,0.97) 0%, rgba(20,19,24,0.82) 40%, rgba(20,19,24,0.20) 68%, rgba(20,19,24,0) 84%)",
        }}
      />

      <div style={{ position: "absolute", left: 76, top: 58 }}>
        <RemocnLockup size={54} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 76,
          bottom: 74,
          width: 720,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: MANROPE,
              fontWeight: 800,
              fontSize: 120,
              lineHeight: "116px",
              letterSpacing: "-0.045em",
              color: REMOCN.ink,
            }}
          >
            41 videos,
          </div>
          <div
            style={{
              fontFamily: MANROPE,
              fontWeight: 800,
              fontSize: 120,
              lineHeight: "116px",
              letterSpacing: "-0.045em",
              color: REMOCN.lime,
            }}
          >
            one camera
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            style={{
              fontFamily: MANROPE,
              fontWeight: 500,
              fontSize: 50,
              lineHeight: "52px",
              letterSpacing: "-0.02em",
              color: "rgba(242,242,242,0.9)",
            }}
          >
            Every showcase, a real screen
          </span>
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
