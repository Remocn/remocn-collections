import React from "react";
import { AbsoluteFill } from "remotion";
import { INTER, MONO, RemocnLockup, ThumbFrame } from "./kit";

/**
 * reui — the icon wall carries the frame. reui's register is deliberately
 * zero-chroma (bg #0a0a0a, ink #fafafa, card #1a1a1a, Inter for everything),
 * so white IS the accent: a full-bleed grid of stroke icons on card tiles with
 * a single inverted tile as the one bright moment. Split layout — copy left,
 * wall bleeding off the right, top and bottom edges.
 */
const BG = "#0a0a0a";
const CARD = "#1a1a1a";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.9)";
const BORDER = "rgba(255,255,255,0.1)";

// the lowercase "reui" wordmark, inlined verbatim from the demo source.
const REUI_RATIO = 269 / 100;
const ReuiLogo: React.FC<{ height: number; color?: string }> = ({
  height,
  color = INK,
}) => (
  <svg
    viewBox="0 0 269 100"
    width={height * REUI_RATIO}
    height={height}
    fill="none"
    style={{ display: "block", color, overflow: "visible" }}
  >
    <path d="M268.091 31.8093V68.1729H260.402V31.8093H268.091Z" fill="currentColor" />
    <path d="M236.389 31.8093H244.077V55.4243C244.077 58.0758 243.444 60.3959 242.177 62.3846C240.922 64.3732 239.164 65.9238 236.904 67.0365C234.643 68.1374 232.009 68.6878 229.002 68.6878C225.984 68.6878 223.344 68.1374 221.083 67.0365C218.822 65.9238 217.065 64.3732 215.81 62.3846C214.555 60.3959 213.928 58.0758 213.928 55.4243V31.8093H221.616V54.7674C221.616 56.1523 221.918 57.3834 222.521 58.4605C223.137 59.5377 224.001 60.3841 225.114 60.9996C226.227 61.6151 227.523 61.9229 229.002 61.9229C230.494 61.9229 231.79 61.6151 232.891 60.9996C234.004 60.3841 234.862 59.5377 235.465 58.4605C236.081 57.3834 236.389 56.1523 236.389 54.7674V31.8093Z" fill="currentColor" />
    <path d="M173.312 68.1729V31.8093H197.815V38.148H181.001V46.8128H196.555V53.1516H181.001V61.8341H197.886V68.1729H173.312Z" fill="currentColor" />
    <path d="M130.5 68.1729V31.8093H144.847C147.593 31.8093 149.937 32.3005 151.878 33.283C153.831 34.2536 155.317 35.6327 156.335 37.4201C157.364 39.1956 157.879 41.2849 157.879 43.6878C157.879 46.1026 157.358 48.18 156.317 49.9201C155.275 51.6483 153.766 52.974 151.789 53.8973C149.824 54.8206 147.445 55.2823 144.651 55.2823H135.045V49.1033H143.408C144.876 49.1033 146.095 48.9021 147.066 48.4996C148.037 48.0971 148.759 47.4935 149.232 46.6885C149.718 45.8836 149.96 44.8834 149.96 43.6878C149.96 42.4804 149.718 41.4624 149.232 40.6338C148.759 39.8052 148.031 39.1779 147.048 38.7517C146.078 38.3138 144.853 38.0948 143.373 38.0948H138.188V68.1729H130.5ZM150.138 51.6246L159.175 68.1729H150.688L141.846 51.6246H150.138Z" fill="currentColor" />
    <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M67.1667 3.84615H33.8333C17.548 3.84615 4.34615 17.048 4.34615 33.3333V66.6667C4.34615 82.952 17.548 96.1538 33.8333 96.1538H67.1667C83.452 96.1538 96.6538 82.952 96.6538 66.6667V33.3333C96.6538 17.048 83.452 3.84615 67.1667 3.84615ZM33.8333 0C15.4238 0 0.5 14.9238 0.5 33.3333V66.6667C0.5 85.0762 15.4238 100 33.8333 100H67.1667C85.5762 100 100.5 85.0762 100.5 66.6667V33.3333C100.5 14.9238 85.5762 0 67.1667 0H33.8333Z" fill="currentColor" />
    <circle cx="70.634" cy="29.698" r="4.69799" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M25.668 56.879V29.6978C25.668 27.1032 27.7713 24.9998 30.366 24.9998C32.9606 24.9998 35.0639 27.1032 35.0639 29.6978V56.879C35.0639 61.6976 38.9702 65.6038 43.7888 65.6038H57.2116C62.0302 65.6038 65.9364 61.6976 65.9364 56.879V43.5904C65.9364 40.9958 68.0398 38.8924 70.6344 38.8924C73.229 38.8924 75.3324 40.9958 75.3324 43.5904V56.879C75.3324 66.8869 67.2194 74.9998 57.2116 74.9998H43.7888C33.7809 74.9998 25.668 66.8869 25.668 56.879Z" fill="currentColor" />
  </svg>
);

// Twenty line icons in a 24-box, drawn flat so nothing depends on a clock.
const ICONS: string[][] = [
  ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  ["M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"],
  ["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
  ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 01-3.46 0"],
  ["M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z", "M12 9a4 4 0 100 8 4 4 0 000-8z"],
  ["M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"],
  ["M22 11.08V12a10 10 0 11-5.93-9.14", "M22 4L12 14.01l-3-3"],
  ["M2 18h20", "M3 6l4.5 4.5L12 4l4.5 6.5L21 6l-2 12H5L3 6z"],
  ["M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"],
  ["M5 3l14 9-14 9V3z"],
  ["M11 3a8 8 0 100 16 8 8 0 000-16z", "M21 21l-4.35-4.35"],
  ["M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z", "M22 6l-10 7L2 6"],
  ["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"],
  ["M12 7a5 5 0 100 10 5 5 0 000-10z", "M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"],
  ["M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z", "M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"],
  ["M12 9a3 3 0 100 6 3 3 0 000-6z", "M12 1v3M12 20v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M1 12h3M20 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"],
  ["M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z", "M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"],
  ["M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2C7.9 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.1.6 2 2 2 3.8M18 2H6v7a6 6 0 0012 0V2z"],
  ["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
  ["M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z", "M16 2v4M8 2v4M3 10h18"],
];

const COLS = 4;
const TILE = 156;
const GAP = 16;
const WALL_X = 902;
const WALL_Y = -46;
/** the one inverted tile — white card, black icon; reui's accent IS white */
const ACCENT_TILE = 9;

const Icon: React.FC<{ paths: string[]; size: number; color: string }> = ({
  paths,
  size,
  color,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {paths.map((d) => (
      <path
        key={d}
        d={d}
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ))}
  </svg>
);

export const SponsorReuiThumb: React.FC = () => (
  <ThumbFrame background={BG}>
    <AbsoluteFill>
      {/* the wall's own light — white, because reui keeps colour in its charts */}
      <div
        style={{
          position: "absolute",
          left: 790,
          top: -160,
          width: 900,
          height: 1040,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 44%, rgba(10,10,10,0) 70%)",
          filter: "blur(18px)",
        }}
      />

      {ICONS.map((paths, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const accent = i === ACCENT_TILE;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: WALL_X + col * (TILE + GAP),
              top: WALL_Y + row * (TILE + GAP),
              width: TILE,
              height: TILE,
              flexShrink: 0,
              borderRadius: 22,
              background: accent ? INK : CARD,
              border: `1px solid ${accent ? INK : BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: accent
                ? "0 24px 60px rgba(255,255,255,0.14)"
                : undefined,
            }}
          >
            <Icon
              paths={paths}
              size={56}
              color={accent ? BG : "rgba(250,250,250,0.9)"}
            />
          </div>
        );
      })}

      {/* scrim so the copy column never fights the wall */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, #0a0a0a 0%, #0a0a0a 48%, rgba(10,10,10,0.90) 56%, rgba(10,10,10,0.34) 62%, rgba(10,10,10,0) 68%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 64,
          top: 0,
          width: 830,
          height: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 36,
        }}
      >
        {/* the sponsorship, kept to a credit line — both wordmarks have to stay
            readable in the 168px sidebar, so neither is set small */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <RemocnLockup size={48} color={MUTED} />
          <span
            style={{
              fontFamily: INTER,
              fontWeight: 400,
              fontSize: 32,
              color: "rgba(250,250,250,0.7)",
            }}
          >
            ✕
          </span>
          <ReuiLogo height={52} color={MUTED} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {["Design-forward", "shadcn/ui", "components"].map((line) => (
            <div
              key={line}
              style={{
                fontFamily: INTER,
                fontWeight: 700,
                fontSize: 112,
                lineHeight: "108px",
                letterSpacing: "-0.045em",
                color: INK,
                whiteSpace: "nowrap",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* the proof, and the only number on the cover — the icon count and the
            "animated" qualifier went, because three facts at 26px read as none */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: 60,
              lineHeight: "60px",
              color: INK,
            }}
          >
            1,019
          </span>
          <span
            style={{
              fontFamily: INTER,
              fontWeight: 500,
              fontSize: 50,
              lineHeight: "50px",
              color: MUTED,
            }}
          >
            open-source components
          </span>
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
