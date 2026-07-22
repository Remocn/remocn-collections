import React from "react";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSourceSerif } from "@remotion/google-fonts/SourceSerif4";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { MANROPE, ThumbFrame } from "./kit";

/**
 * The one cover where mixing typefaces is the content: three specimen tiles,
 * each set in the real face it names, over the pairing's own claim.
 */
const playfair = loadPlayfair("normal", {
  subsets: ["latin"],
  weights: ["500", "700"],
});
const sourceSerif = loadSourceSerif("normal", {
  subsets: ["latin"],
  weights: ["400", "600"],
});
const jetBrains = loadJetBrains("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

const PLAYFAIR = playfair.fontFamily;
const SOURCE_SERIF = sourceSerif.fontFamily;
const JETBRAINS = jetBrains.fontFamily;

const GROUND = "#0a0a0a";
const GOLD = "#e0a23c";
const INK = "#fafafa";
const FAINT = "rgba(250,250,250,0.88)";

// `nameWeight` is the heavier cut of the same face — the name has to hold up at
// grid size, and only the weights loaded above are real (anything else would be
// synthesised and go soft).
const SPECIMENS = [
  {
    role: "Heading",
    name: "Playfair Display",
    family: PLAYFAIR,
    weight: 500,
    nameWeight: 700,
  },
  {
    role: "Body",
    name: "Source Serif 4",
    family: SOURCE_SERIF,
    weight: 400,
    nameWeight: 600,
  },
  {
    role: "Mono",
    name: "JetBrains Mono",
    family: JETBRAINS,
    weight: 400,
    nameWeight: 500,
  },
];

const TILE_W = 358;
const TILE_H = 238;

/** The trio mark from the demo — three bars, the middle one gold. */
const TrioMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x={3} y={4} width={3.4} height={16} rx={1.7} fill={INK} />
    <rect x={10.3} y={4} width={3.4} height={16} rx={1.7} fill={GOLD} />
    <rect x={17.6} y={4} width={3.4} height={16} rx={1.7} fill={INK} />
  </svg>
);

export const FonttrioThumb: React.FC = () => (
  <ThumbFrame
    background={GROUND}
    fonts={[
      playfair.waitUntilDone(),
      sourceSerif.waitUntilDone(),
      jetBrains.waitUntilDone(),
    ]}
  >
    <div
      style={{
        position: "absolute",
        left: -120,
        top: -260,
        width: 1200,
        height: 900,
        borderRadius: 9999,
        background:
          "radial-gradient(circle, rgba(224,162,60,0.16) 0%, rgba(224,162,60,0.05) 40%, rgba(10,10,10,0) 68%)",
        filter: "blur(26px)",
      }}
    />

    {/* Brand row */}
    <div
      style={{
        position: "absolute",
        left: 84,
        top: 46,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <TrioMark size={46} />
      <span
        style={{
          fontFamily: PLAYFAIR,
          fontWeight: 700,
          fontSize: 44,
          lineHeight: "44px",
          color: INK,
        }}
      >
        Fonttrio
      </span>
    </div>

    {/* Three specimens, each in its own face. Fixed tile widths keep the
        role labels and names on a shared grid. */}
    <div
      style={{
        position: "absolute",
        left: 84,
        top: 110,
        display: "flex",
        gap: 19,
      }}
    >
      {SPECIMENS.map((s) => (
        <div
          key={s.role}
          style={{
            width: TILE_W,
            height: TILE_H,
            flexShrink: 0,
            boxSizing: "border-box",
            padding: "20px 18px",
            borderRadius: 18,
            background: "rgba(250,250,250,0.06)",
            border: "2px solid rgba(224,162,60,0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: MANROPE,
              fontWeight: 700,
              fontSize: 40,
              lineHeight: "40px",
              letterSpacing: "-0.02em",
              color: GOLD,
            }}
          >
            {s.role}
          </span>
          <span
            style={{
              fontFamily: s.family,
              fontWeight: s.weight,
              fontSize: 92,
              lineHeight: "92px",
              color: INK,
            }}
          >
            Ag
          </span>
          <span
            style={{
              fontFamily: s.family,
              fontWeight: s.nameWeight,
              fontSize: 40,
              lineHeight: "40px",
              whiteSpace: "nowrap",
              color: "rgba(250,250,250,0.92)",
            }}
          >
            {s.name}
          </span>
        </div>
      ))}
    </div>

    {/* The claim */}
    <div
      style={{
        position: "absolute",
        left: 84,
        top: 368,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {[
        { text: "Three fonts.", color: INK },
        { text: "One command.", color: GOLD },
      ].map((line) => (
        <div
          key={line.text}
          style={{
            fontFamily: MANROPE,
            fontWeight: 800,
            fontSize: 92,
            lineHeight: "96px",
            letterSpacing: "-0.045em",
            color: line.color,
          }}
        >
          {line.text}
        </div>
      ))}
    </div>

    <div
      style={{
        position: "absolute",
        left: 84,
        top: 610,
        fontFamily: JETBRAINS,
        fontWeight: 500,
        fontSize: 48,
        lineHeight: "48px",
        color: FAINT,
      }}
    >
      npx shadcn add @fonttrio/editorial
    </div>
  </ThumbFrame>
);
