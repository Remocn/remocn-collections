import React from "react";
import { MANROPE, MONO, REMOCN, RemocnLockup, ThumbFrame } from "./kit";

/**
 * One mechanism, off centre and oversized — a single render surface swung into
 * the top-right corner and cropped by it, with the claim anchored diagonally
 * opposite. "One" is said by there being exactly one object in the frame, not
 * by centring it.
 */
const GROUND = "#0A0A0A";
const BLUE = "#5b9dff";
const CYAN = "#34d9e6";

// The tile's geometry — kept in one place because the type block is positioned
// to clear its rotated lower-left corner (which swings in to x≈863).
const TILE = 470;
const TILE_LEFT = 823;
const TILE_TOP = -67;

export const RenderSdkThumb: React.FC = () => (
  <ThumbFrame background={GROUND}>
    <div
      style={{
        position: "absolute",
        left: TILE_LEFT + TILE / 2 - 460,
        top: TILE_TOP + TILE / 2 - 460,
        width: 920,
        height: 920,
        borderRadius: 9999,
        background:
          "radial-gradient(circle, rgba(52,217,230,0.26) 0%, rgba(91,157,255,0.10) 40%, rgba(10,10,10,0) 68%)",
        filter: "blur(30px)",
      }}
    />

    {/* The mechanism: a render surface, cropped by the corner it leans into. */}
    <div
      style={{
        position: "absolute",
        left: TILE_LEFT,
        top: TILE_TOP,
        width: TILE,
        height: TILE,
        borderRadius: 104,
        transform: "rotate(-9deg)",
        background: `linear-gradient(140deg, ${BLUE} 0%, ${CYAN} 100%)`,
        boxShadow: "0 50px 120px rgba(52,217,230,0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 326,
          height: 326,
          borderRadius: 74,
          background: "#0b0d12",
          border: "1px solid rgba(255,255,255,0.09)",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* The glyph's path sits right of the viewBox centre — nudged back so
            it reads optically centred in the screen. */}
        <svg width={168} height={168} viewBox="0 0 24 24" style={{ marginLeft: -9 }}>
          <path
            d="M8 5.4c0-1.1 1.2-1.8 2.1-1.2l8.2 5.4a1.6 1.6 0 0 1 0 2.7L10.1 18c-.9.6-2.1-.1-2.1-1.2V5.4Z"
            fill={CYAN}
          />
        </svg>
      </div>
    </div>

    {/* The claim, anchored to the opposite corner. */}
    <div
      style={{
        position: "absolute",
        left: 84,
        bottom: 62,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 22,
      }}
    >
      <RemocnLockup size={42} color="rgba(242,242,242,0.88)" />

      <div
        style={{
          fontFamily: MANROPE,
          fontWeight: 800,
          fontSize: 108,
          lineHeight: "112px",
          letterSpacing: "-0.045em",
          color: REMOCN.ink,
          whiteSpace: "nowrap",
        }}
      >
        One render API
      </div>

      <div
        style={{
          fontFamily: MANROPE,
          fontWeight: 600,
          fontSize: 52,
          lineHeight: "52px",
          color: "rgba(242,242,242,0.9)",
        }}
      >
        Two adapters, one interface
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 26px",
          borderRadius: 14,
          background: "rgba(91,157,255,0.12)",
          border: "2px solid rgba(91,157,255,0.42)",
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 48,
          lineHeight: "48px",
        }}
      >
        <span style={{ color: CYAN }}>bun install</span>
        <span style={{ color: REMOCN.ink }}>@remocn/render-sdk</span>
      </div>
    </div>
  </ThumbFrame>
);
