import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { INTER, MONO, ThumbFrame } from "./kit";

// Tokens lifted from the live prisma.io stylesheet, same as the video.
const CANVAS = "#131420";
const INK = "#f9fafb";
const INDIGO = "#6366f1";
const INDIGO_LIGHT = "#818cf8";
const TEAL = "#14b8a6";
const TEAL_LIGHT = "#2dd4bf";

// The official press-kit prism (public/prisma/symbol-light.svg), verbatim.
const PRISM_PATH =
  "M0.522473 45.0933C-0.184191 46.246 -0.173254 47.7004 0.550665 48.8423L13.6534 69.5114C14.5038 70.8529 16.1429 71.4646 17.6642 71.0082L55.4756 59.6648C57.539 59.0457 58.5772 56.7439 57.6753 54.7874L33.3684 2.06007C32.183 -0.511323 28.6095 -0.722394 27.1296 1.69157L0.522473 45.0933ZM32.7225 14.1141C32.2059 12.9187 30.4565 13.1028 30.2001 14.3796L20.842 60.9749C20.6447 61.9574 21.5646 62.7964 22.5248 62.5098L48.6494 54.7114C49.4119 54.4838 49.8047 53.6415 49.4891 52.9111L32.7225 14.1141Z";

const PRISM_H = 486;
const PRISM_W = (PRISM_H * 58) / 72;

const Prism: React.FC<{ blur?: number; opacity?: number }> = ({
  blur = 0,
  opacity = 1,
}) => (
  <svg
    width={PRISM_W}
    height={PRISM_H}
    viewBox="0 0 58 72"
    style={{ display: "block", filter: blur ? `blur(${blur}px)` : undefined, opacity }}
  >
    <defs>
      <linearGradient id="prisma-gem" x1="0" y1="0" x2="58" y2="72" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#c7d2fe" />
        <stop offset="0.34" stopColor={INDIGO_LIGHT} />
        <stop offset="0.68" stopColor={INDIGO} />
        <stop offset="1" stopColor={TEAL} />
      </linearGradient>
    </defs>
    <path fillRule="evenodd" clipRule="evenodd" d={PRISM_PATH} fill="url(#prisma-gem)" />
  </svg>
);

/**
 * Split: the claim left, the prism right. The gem-smoke field of the video
 * survives as an indigo→teal bloom behind the mark — the one colour moment.
 */
export const IntroducingPrismaThumb: React.FC = () => (
  <ThumbFrame background={CANVAS}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 700,
          top: -160,
          width: 880,
          height: 880,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.38) 0%, rgba(99,102,241,0.12) 42%, rgba(19,20,32,0) 70%)",
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 300,
          width: 720,
          height: 720,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(45,212,191,0.30) 0%, rgba(20,184,166,0.10) 44%, rgba(19,20,32,0) 72%)",
          filter: "blur(30px)",
        }}
      />

      <div style={{ position: "absolute", left: 830, top: 104 }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Prism blur={44} opacity={0.55} />
        </div>
        <Prism />
      </div>

      <div
        style={{
          position: "absolute",
          left: 84,
          top: 0,
          width: 724,
          height: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 40,
        }}
      >
        <Img
          src={staticFile("prisma/logo-light.svg")}
          style={{ display: "block", width: 168, height: (168 * 72) / 228 }}
        />

        <div
          style={{
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: 112,
            lineHeight: "114px",
            letterSpacing: "-0.045em",
            color: INK,
          }}
        >
          Agent infrastructure
          <br />
          for{" "}
          <span
            style={{
              background: `linear-gradient(100deg, ${INDIGO_LIGHT} 0%, ${TEAL_LIGHT} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            TypeScript
          </span>
        </div>

        {/* one line, poster-scale — the URL slug went, it read as noise at grid size */}
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 52,
            lineHeight: "52px",
            color: TEAL_LIGHT,
          }}
        >
          npx prisma init
        </span>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
