import React from "react";
import { AbsoluteFill } from "remotion";
import { GEIST, ThumbFrame } from "./kit";

// shadcn's own monochrome: zinc-950 ground, #fafafa ink, colour only where the
// video licenses it — the Colors beat's full Tailwind palette.
const CANVAS = "#09090b";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.88)";
const CARD = "#18181b";
// 2px, not 1 — a hairline card edge is gone once YouTube scales this to the grid
const HAIR = "#3f3f46";

// Official shadcn/ui mark — icons.tsx, two round-cap diagonals, strokeWidth 32.
const ShadcnMark: React.FC<{ size: number; color?: string }> = ({ size, color = INK }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none" style={{ display: "block" }}>
    <line x1="192" y1="40" x2="40" y2="192" stroke={color} strokeWidth={32} strokeLinecap="round" />
    <line x1="208" y1="128" x2="128" y2="208" stroke={color} strokeWidth={32} strokeLinecap="round" />
  </svg>
);

const Bar: React.FC<{ w: number | string; h?: number; o?: number }> = ({ w, h = 9, o = 0.22 }) => (
  <div style={{ width: w, height: h, borderRadius: 4, background: `rgba(250,250,250,${o})` }} />
);

const Card: React.FC<{ height: number; children?: React.ReactNode }> = ({ height, children }) => (
  <div
    style={{
      height,
      borderRadius: 12,
      background: CARD,
      border: `2px solid ${HAIR}`,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

// The 22 × 11 Tailwind palette, condensed to the ramps that read at this size.
const RAMPS = [
  ["#fca5a5", "#ef4444", "#b91c1c"],
  ["#fdba74", "#f97316", "#c2410c"],
  ["#fde047", "#eab308", "#a16207"],
  ["#86efac", "#22c55e", "#15803d"],
  ["#67e8f9", "#06b6d4", "#0e7490"],
  ["#93c5fd", "#3b82f6", "#1d4ed8"],
  ["#c4b5fd", "#8b5cf6", "#6d28d9"],
  ["#f0abfc", "#d946ef", "#a21caf"],
];

const PaletteCard: React.FC = () => (
  <div
    style={{
      borderRadius: 12,
      background: CARD,
      border: `2px solid ${HAIR}`,
      padding: 14,
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}
  >
    {[0, 1, 2].map((row) => (
      <div key={row} style={{ display: "flex", gap: 6 }}>
        {RAMPS.map((ramp) => (
          <div
            key={ramp[row]}
            style={{ width: 22, height: 22, borderRadius: 5, background: ramp[row] }}
          />
        ))}
      </div>
    ))}
  </div>
);

const Column: React.FC<{
  left: number;
  top: number;
  dim: number;
  children: React.ReactNode;
}> = ({ left, top, dim, children }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: 250,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      opacity: dim,
    }}
  >
    {children}
  </div>
);

/**
 * Poster: the opening wall of real shadcn/ui components runs full bleed, the
 * creed lands bottom-left over it. The one colour in the frame is the palette
 * card — the same single burst the video allows itself.
 */
export const IntroducingShadcnThumb: React.FC = () => (
  <ThumbFrame background={CANVAS}>
    <AbsoluteFill>
      <Column left={-34} top={-58} dim={0.5}>
        <Card height={150}>
          <Bar w={120} h={12} o={0.5} />
          <Bar w={200} />
          <Bar w={168} />
          <div style={{ marginTop: "auto", height: 30, borderRadius: 7, background: "rgba(250,250,250,0.9)" }} />
        </Card>
        <Card height={210}>
          <Bar w={96} h={11} o={0.45} />
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: "auto", height: 118 }}>
            {[40, 78, 56, 104, 68, 90].map((h, i) => (
              <div key={i} style={{ flex: 1, height: h, borderRadius: 4, background: "rgba(250,250,250,0.3)" }} />
            ))}
          </div>
        </Card>
        <Card height={170} />
      </Column>

      <Column left={232} top={48} dim={0.45}>
        <Card height={196}>
          <Bar w={140} h={12} o={0.5} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            {Array.from({ length: 21 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: i === 9 ? "rgba(250,250,250,0.85)" : "rgba(250,250,250,0.10)",
                }}
              />
            ))}
          </div>
        </Card>
        <Card height={148}>
          <Bar w={110} h={11} o={0.45} />
          <Bar w={216} />
          <Bar w={190} />
          <Bar w={140} />
        </Card>
        <Card height={230} />
      </Column>

      <Column left={498} top={-92} dim={0.55}>
        <Card height={188}>
          <Bar w={132} h={12} o={0.5} />
          <Bar w={210} />
          <div style={{ marginTop: "auto", display: "flex", gap: 10 }}>
            <div style={{ width: 88, height: 30, borderRadius: 7, background: "rgba(250,250,250,0.85)" }} />
            <div style={{ width: 88, height: 30, borderRadius: 7, border: `2px solid ${HAIR}` }} />
          </div>
        </Card>
        <Card height={132} />
        <Card height={216}>
          <Bar w={150} h={12} o={0.45} />
          <Bar w={206} />
          <Bar w={182} />
          <Bar w={214} />
          <Bar w={130} />
        </Card>
      </Column>

      <Column left={764} top={34} dim={0.85}>
        <Card height={126}>
          <Bar w={128} h={12} o={0.5} />
          <Bar w={196} />
          <Bar w={150} />
        </Card>
        {/* the palette rides above the scrim — see below */}
        <div style={{ height: 106 }} />
        <Card height={188}>
          <Bar w={104} h={11} o={0.45} />
          <Bar w={200} />
          <Bar w={172} />
        </Card>
      </Column>

      <Column left={1030} top={-40} dim={0.5}>
        <Card height={168}>
          <Bar w={118} h={12} o={0.5} />
          <Bar w={204} />
          <Bar w={160} />
        </Card>
        <Card height={244}>
          <Bar w={140} h={12} o={0.45} />
          <Bar w={198} />
          <Bar w={214} />
          <Bar w={176} />
          <div style={{ marginTop: "auto", height: 30, borderRadius: 7, border: `2px solid ${HAIR}` }} />
        </Card>
        <Card height={150} />
      </Column>

      {/* the poster scrim — the wall recedes into the ground the type sits on */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(15deg, rgba(9,9,11,0.99) 24%, rgba(9,9,11,0.86) 44%, rgba(9,9,11,0.30) 68%, rgba(9,9,11,0.10) 100%)",
        }}
      />

      {/* the one colour in the frame, kept off the scrim so it lands at full strength */}
      <div style={{ position: "absolute", left: 764, top: 176, width: 250 }}>
        <PaletteCard />
      </div>

      <div style={{ position: "absolute", left: 80, top: 262, width: 820 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
          <ShadcnMark size={54} />
          <span
            style={{
              fontFamily: GEIST,
              fontWeight: 500,
              fontSize: 52,
              lineHeight: "52px",
              letterSpacing: "-0.03em",
              color: INK,
            }}
          >
            shadcn/ui
          </span>
        </div>

        <div
          style={{
            fontFamily: GEIST,
            fontWeight: 600,
            fontSize: 112,
            lineHeight: "116px",
            letterSpacing: "-0.045em",
            color: INK,
          }}
        >
          How you build
          <br />
          your own.
        </div>

        <div
          style={{
            marginTop: 26,
            fontFamily: GEIST,
            fontWeight: 400,
            fontSize: 52,
            lineHeight: "52px",
            color: MUTED,
          }}
        >
          Open Source. Open Code.
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
