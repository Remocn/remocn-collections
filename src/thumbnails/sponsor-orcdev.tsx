import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender } from "remotion";
import { loadFont as loadPixel } from "@remotion/fonts";
import { demoAsset } from "@/lib/demo-assets";
import { GEIST, RemocnMark, ThumbFrame } from "./kit";

/**
 * OrcDev — the 8bitcn register, so the cover is a sprite sheet: black canvas
 * under a green dither field, corner-notched pixel frames, and an HP bar
 * taking its critical hit. Bottom-weighted, avatar hard right — nothing on
 * this frame is smooth.
 */
const BG = "#000000";
const INK = "#fafafa";
const DITHER = "#008000";
const ORC_GREEN = "#8ec71e";

const PIXEL_FAMILY = "Geist Pixel";
const PIXEL = `${PIXEL_FAMILY}, monospace`;
const SANS = `${GEIST}, -apple-system, BlinkMacSystemFont, sans-serif`;

// Geist Pixel is loaded inside the composition — at module scope its
// delayRender fires before anything mounts and the render proceeds unfonted.
const usePixelFont = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const handle = delayRender("geist-pixel");
    loadPixel({ family: PIXEL_FAMILY, url: demoAsset("fonts/GeistPixel-Square.woff2") })
      .catch(() => undefined)
      .then(() => {
        setLoaded(true);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => continueRender(handle)),
        );
      });
    return () => continueRender(handle);
  }, []);
  return loaded;
};

/** the 8bitcn border: straight bars stopped short of the corners, so each
 *  corner reads as a stepped notch. Verbatim from the demo. */
const PixelBox: React.FC<{
  children: React.ReactNode;
  border?: number;
  color?: string;
  background?: string;
}> = ({ children, border = 6, color = INK, background = "transparent" }) => {
  const bar = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    background: color,
    ...pos,
  });
  return (
    <div style={{ position: "relative", background }}>
      <div style={bar({ top: 0, left: border, right: border, height: border })} />
      <div style={bar({ bottom: 0, left: border, right: border, height: border })} />
      <div style={bar({ left: 0, top: border, bottom: border, width: border })} />
      <div style={bar({ right: 0, top: border, bottom: border, width: border })} />
      {children}
    </div>
  );
};

const HP_CELLS = 8;
const HP_FILLED = 3; // critical hit — three left

const AVATAR = 356;
const PIXEL_BORDER = 9;

const Body: React.FC = () => {
  const pixelReady = usePixelFont();
  if (!pixelReady) return null;
  return (
    <AbsoluteFill>
      {/* the dithering preset, as a still field */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${DITHER} 1.9px, transparent 2px)`,
          backgroundSize: "11px 11px",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 62% 68% at 44% 52%, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.80) 46%, rgba(0,0,0,0.30) 100%)",
        }}
      />

      {/* the avatar, crunched — quarter-res sampled up with pixelated edges */}
      <div style={{ position: "absolute", left: 838, top: 122 }}>
        <PixelBox border={PIXEL_BORDER} color={ORC_GREEN} background={BG}>
          <div style={{ padding: PIXEL_BORDER }}>
            <Img
              src={demoAsset("orcdev-avatar.jpg")}
              style={{
                width: AVATAR,
                height: AVATAR,
                objectFit: "cover",
                imageRendering: "pixelated",
                display: "block",
              }}
            />
          </div>
        </PixelBox>
      </div>

      {/* credit */}
      <div
        style={{
          position: "absolute",
          left: 74,
          top: 52,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <RemocnMark size={42} color="rgba(250,250,250,0.88)" />
        <span style={{ fontFamily: SANS, fontSize: 28, color: "rgba(250,250,250,0.7)" }}>
          ✕
        </span>
        <span
          style={{
            fontFamily: PIXEL,
            fontSize: 42,
            lineHeight: "42px",
            color: "rgba(250,250,250,0.92)",
          }}
        >
          OrcDev
        </span>
      </div>

      <div style={{ position: "absolute", left: 74, top: 196, width: 740 }}>
        {["Web dev", "warrior"].map((line) => (
          <div
            key={line}
            style={{
              fontFamily: PIXEL,
              fontSize: 116,
              lineHeight: "120px",
              color: INK,
              whiteSpace: "nowrap",
            }}
          >
            {line}
          </div>
        ))}

        <div
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 50,
            lineHeight: "50px",
            letterSpacing: "-0.015em",
            color: "rgba(250,250,250,0.9)",
            marginTop: 30,
          }}
        >
          The maker of 8bitcn/ui
        </div>

        {/* the HP bar, three cells from the end */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 40 }}
        >
          <PixelBox border={6} background={BG}>
            <div style={{ display: "flex", gap: 6, padding: 12 }}>
              {Array.from({ length: HP_CELLS }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 32,
                    height: 38,
                    flexShrink: 0,
                    background:
                      i < HP_FILLED ? ORC_GREEN : "rgba(250,250,250,0.16)",
                  }}
                />
              ))}
            </div>
          </PixelBox>
          <span
            style={{
              fontFamily: PIXEL,
              fontSize: 44,
              lineHeight: "44px",
              color: ORC_GREEN,
            }}
          >
            Critical hit
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SponsorOrcdevThumb: React.FC = () => (
  <ThumbFrame background={BG}>
    <Body />
  </ThumbFrame>
);
