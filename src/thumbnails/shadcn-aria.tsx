import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadSourceSans } from "@remotion/google-fonts/SourceSans3";
import { GEIST, ThumbFrame } from "./kit";

// Adobe's open face — it stands in wherever the guest speaks.
const sourceSans = loadSourceSans("normal", { subsets: ["latin"], weights: ["400", "600"] });
const SOURCE = sourceSans.fontFamily;

// ui.shadcn.com dark tokens, sampled 2026-07-17.
const CANVAS = "#0a0a0a";
const INK = "#fafafa";
const CARD = "#171717";
// 2px at nearly double the opacity — the old 1px/0.10 edge was gone by 360px
const HAIR = "rgba(255,255,255,0.18)";
const ARIA = "#7F57FF"; // React Aria's dark-side violet — the one guest accent

// Official shadcn/ui mark — icons.tsx, two round-cap diagonals, strokeWidth 32.
const ShadcnMark: React.FC<{ size: number; color?: string }> = ({ size, color = INK }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none" style={{ display: "block" }}>
    <line x1="192" y1="40" x2="40" y2="192" stroke={color} strokeWidth={32} strokeLinecap="round" />
    <line x1="208" y1="128" x2="128" y2="208" stroke={color} strokeWidth={32} strokeLinecap="round" />
  </svg>
);

// Exact React Aria header mark — react-aria.adobe.com, one path, two subpaths.
const ARIA_PATH =
  "M720.67 205.995C867.583 205.995 986.679 325.091 986.68 472.003C986.68 590.753 908.865 691.325 801.446 725.521L979.312 948.055C994.438 966.98 980.963 995 956.736 995H795.612C778.743 995 762.715 987.629 751.734 974.823L697.365 911.421L493.126 653.39C457.134 607.918 489.518 540.979 547.511 540.977L720.67 540.971C758.758 540.971 789.635 510.091 789.635 472.003C789.634 433.915 758.758 403.038 720.67 403.038H429.939C404.955 403.038 388.623 391.886 373.994 373.623L277.349 252.966C262.194 234.045 275.664 205.996 299.905 205.995H720.67Z M396.605 720.706C407.798 705.406 430.443 704.843 442.381 719.568L503.816 797.018H502.786L535.569 838.934C548.074 854.358 549.943 877.191 538.047 893.09L476.638 972.545C465.692 986.707 448.803 995 430.903 995H242.276C218.18 995 204.665 967.248 219.523 948.278L337.992 797.018H337.923L396.605 720.706Z";

const AriaMark: React.FC<{ size: number; color?: string; opacity?: number }> = ({
  size,
  color = ARIA,
  opacity = 1,
}) => (
  <svg
    width={size * (800 / 790)}
    height={size}
    viewBox="200 206 800 790"
    style={{ display: "block", opacity }}
  >
    <path d={ARIA_PATH} fill={color} />
  </svg>
);

// The "Default" caption on Base UI is gone — a 26px note is grey noise once
// YouTube has this at grid size, and the row labels carry the choice on their own.
type Row = { label: string; selected?: boolean };
const ROWS: Row[] = [
  { label: "Base UI" },
  { label: "Radix" },
  { label: "React Aria", selected: true },
];

/**
 * Stacked: the claim, then the choice being made underneath it. The base list
 * holds its three rows and the violet focus ring — React Aria's own signature —
 * has landed on the new one. The only colour in the frame is that ring.
 */
export const ShadcnAriaThumb: React.FC = () => (
  <ThumbFrame background={CANVAS} fonts={[sourceSans.waitUntilDone()]}>
    <AbsoluteFill>
      {/* the caustic field, denser toward the floor, violet since the choice */}
      <div
        style={{
          position: "absolute",
          left: 620,
          top: 210,
          width: 900,
          height: 900,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(127,87,255,0.30) 0%, rgba(127,87,255,0.10) 40%, rgba(10,10,10,0) 68%)",
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -140,
          top: 420,
          width: 760,
          height: 760,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(127,87,255,0.16) 0%, rgba(127,87,255,0.05) 44%, rgba(10,10,10,0) 70%)",
          filter: "blur(34px)",
        }}
      />

      <div style={{ position: "absolute", left: 852, top: 158, opacity: 0.17 }}>
        <AriaMark size={434} />
      </div>

      <div style={{ position: "absolute", left: 80, top: 56, display: "flex", alignItems: "center", gap: 24 }}>
        <ShadcnMark size={48} />
        <div style={{ width: 2, height: 48, background: HAIR }} />
        <AriaMark size={48} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 148,
          fontFamily: GEIST,
          fontWeight: 600,
          fontSize: 112,
          lineHeight: "116px",
          letterSpacing: "-0.045em",
          color: INK,
        }}
      >
        React Aria,
        <br />
        now a base
      </div>

      {/* the `pnpm dlx shadcn@latest init --base aria` line is gone — 38 mono
          characters can't be set at poster scale in this column, and shrinking
          them is exactly what the downscale destroys */}

      <div style={{ position: "absolute", left: 80, top: 386, width: 720 }}>
        {ROWS.map((row) => (
          <div
            key={row.label}
            style={{
              position: "relative",
              height: 90,
              marginBottom: 14,
              borderRadius: 12,
              background: CARD,
              border: `2px solid ${row.selected ? "rgba(127,87,255,0.7)" : HAIR}`,
              boxShadow: row.selected ? `0 0 0 6px rgba(127,87,255,0.35)` : undefined,
              display: "flex",
              alignItems: "center",
              padding: "0 28px",
              gap: 22,
            }}
          >
            {row.selected ? (
              <AriaMark size={36} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: 9999, border: `2px solid ${HAIR}` }} />
            )}
            <span
              style={{
                fontFamily: row.selected ? SOURCE : GEIST,
                fontWeight: row.selected ? 600 : 400,
                fontSize: 48,
                lineHeight: "48px",
                color: INK,
              }}
            >
              {row.label}
            </span>
            {row.selected ? (
              <svg
                width={44}
                height={44}
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginLeft: "auto", display: "block" }}
              >
                <path
                  d="M4 12.5 L9.5 18 L20 6.5"
                  stroke={ARIA}
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
