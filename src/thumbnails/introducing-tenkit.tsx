import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { MONO, ThumbFrame } from "./kit";

/**
 * tenkit — one codebase, many branded apps. The split: the claim on the left,
 * three fanned app frames on the right, each wearing one of the site's own
 * tenant accents. The accents are identity, never decoration, so nothing else
 * in the frame is coloured.
 *
 * Register from src/demos/introducing-tenkit: #09090b canvas, #fafafa ink,
 * Space Grotesk for everything spoken, Geist Mono for the CLI.
 */
const grotesk = loadSpaceGrotesk("normal", {
  subsets: ["latin"],
  weights: ["500", "600", "700"],
});
const HEADING = grotesk.fontFamily;

const CANVAS = "#09090b";
const INK = "#fafafa";

const TENANTS = [
  { name: "Atlas", hex: "#208AEF" },
  { name: "Ember", hex: "#EF8520" },
  { name: "Mint", hex: "#2DD4A8" },
] as const;

// the shipped Group 84 mark — its two folded faces, in the shipped geometry
const MARK_VB = "-1 -1 115 160";
const MARK_BOTTOM =
  "M34.54 90.6967C34.54 89.2775 35.2785 87.9607 36.4894 87.2205L71.4017 65.702C74.1164 64.0426 77.6005 65.9964 77.6005 69.1781V129.342C77.6005 130.706 76.9181 131.979 75.7825 132.735L40.8702 156.218C38.1624 158.019 34.54 156.078 34.54 152.826L34.54 90.6967Z";
const MARK_TOP =
  "M74.4541 0.565754C75.5499 -0.0811406 76.885 -0.178923 78.0634 0.30151L109.084 13.4258C112.178 14.6873 112.522 18.9318 109.671 20.6744L36.7776 65.2285C35.6052 65.9451 34.1505 66.0226 32.9088 65.4344L2.33016 50.5264C-0.622425 49.1278 -0.810432 44.997 2.00292 43.3361L74.4541 0.565754Z";

const TenkitMark: React.FC<{ height: number; color?: string }> = ({
  height,
  color = INK,
}) => (
  <svg
    width={height * (115 / 160)}
    height={height}
    viewBox={MARK_VB}
    style={{ display: "block" }}
  >
    <path d={MARK_TOP} fill={color} />
    <path d={MARK_BOTTOM} fill={color} />
  </svg>
);

/**
 * One tenant's app, drawn as the video draws it: icon chip, name, button. The
 * two flanking copies drop their names — behind the hero they would only clip,
 * and colour alone is the point: same code, different identity.
 */
const AppFrame: React.FC<{
  name: string;
  hex: string;
  left: number;
  top: number;
  rotate: number;
  scale: number;
  dim: number;
  showName?: boolean;
}> = ({ name, hex, left, top, rotate, scale, dim, showName = true }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: 280,
      height: 560,
      borderRadius: 40,
      transform: `rotate(${rotate}deg) scale(${scale})`,
      transformOrigin: "center",
      background: "#0f0f13",
      border: "2px solid rgba(255,255,255,0.14)",
      boxShadow: `0 46px 110px rgba(0,0,0,0.72), 0 0 90px ${hex}22`,
      padding: "44px 26px 0",
      opacity: dim,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: 74,
        height: 74,
        borderRadius: 20,
        background: hex,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TenkitMark height={40} color="#0b0b0d" />
    </div>
    {showName ? (
      <div
        style={{
          marginTop: 20,
          fontFamily: HEADING,
          fontWeight: 600,
          fontSize: 48,
          letterSpacing: "-0.02em",
          color: INK,
        }}
      >
        {name}
      </div>
    ) : (
      <div style={{ height: 68 }} />
    )}
    <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 26 }}>
      {[190, 140, 168].map((w, i) => (
        <div
          key={i}
          style={{
            height: 10,
            width: w,
            borderRadius: 5,
            background: "rgba(255,255,255,0.10)",
          }}
        />
      ))}
    </div>
    <div
      style={{
        marginTop: 34,
        height: 50,
        borderRadius: 14,
        background: hex,
      }}
    />
  </div>
);

export const IntroducingTenkitThumb: React.FC = () => (
  <ThumbFrame background={CANVAS} fonts={[grotesk.waitUntilDone()]}>
    <AbsoluteFill>
      {/* the voronoi field, hinted — one surface partitioned into many cells */}
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        <g stroke="#fafafa" strokeOpacity="0.055" strokeWidth="1.5" fill="none">
          <path d="M-40 200 L210 130 L430 250 L360 470 L120 520 Z" />
          <path d="M210 130 L470 40 L640 170 L430 250 Z" />
          <path d="M430 250 L640 170 L820 300 L700 480 L360 470 Z" />
          <path d="M120 520 L360 470 L470 700 L200 760 Z" />
          <path d="M700 480 L820 300 L1090 260 L1160 520 L860 620 Z" />
          <path d="M820 300 L640 170 L900 60 L1120 120 L1090 260 Z" />
          <path d="M860 620 L1160 520 L1240 760 L900 780 Z" />
        </g>
      </svg>
      {TENANTS.map((t, i) => (
        <div
          key={t.hex}
          style={{
            position: "absolute",
            left: 620 + i * 240,
            top: -120 + i * 130,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${t.hex}2b 0%, ${t.hex}0a 40%, rgba(9,9,11,0) 68%)`,
            filter: "blur(30px)",
          }}
        />
      ))}

      {/* the fan — one app, cloned into three identities */}
      <AppFrame {...TENANTS[0]} left={664} top={124} rotate={-12} scale={0.88} dim={0.62} showName={false} />
      <AppFrame {...TENANTS[2]} left={1040} top={124} rotate={12} scale={0.88} dim={0.62} showName={false} />
      <AppFrame {...TENANTS[1]} left={852} top={92} rotate={0} scale={1} dim={1} />

      <div
        style={{
          position: "absolute",
          left: 82,
          top: 0,
          width: 620,
          height: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <TenkitMark height={54} />
          <span
            style={{
              fontFamily: HEADING,
              fontWeight: 600,
              fontSize: 46,
              letterSpacing: "-0.02em",
              color: INK,
            }}
          >
            tenkit
          </span>
        </div>

        <div
          style={{
            fontFamily: HEADING,
            fontWeight: 700,
            fontSize: 112,
            lineHeight: "106px",
            letterSpacing: "-0.045em",
            color: INK,
          }}
        >
          One
          <br />
          codebase,
          <br />
          many apps
        </div>

        <div
          style={{
            fontFamily: HEADING,
            fontWeight: 500,
            fontSize: 48,
            lineHeight: "58px",
            color: "rgba(250,250,250,0.88)",
          }}
        >
          Ship one Expo app as
          <br />
          many branded apps
        </div>

        <div
          style={{
            fontFamily: MONO,
            fontWeight: 400,
            fontSize: 44,
            color: "rgba(250,250,250,0.88)",
          }}
        >
          pnpm create tenkit
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
