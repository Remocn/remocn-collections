import React from "react";
import { AbsoluteFill } from "remotion";
import { GEIST, MANROPE, MONO, REMOCN, RemocnLockup, ThumbFrame } from "./kit";

/**
 * "Both shots are components" — the two shots every launch video films: someone
 * prompting an AI, and a follower count going up. A diagonal deck of the real
 * branded surfaces bleeds off the right edge; each keeps its OWN brand (Anthropic
 * clay, OpenAI's dark composer, X blue) because being recognizable is the point.
 * X blue is this thumbnail's colour moment, not the lime.
 */

// the Anthropic mark, verbatim from components/remocn/logo-enter.tsx
const CLAUDE_MARK =
  "m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z";

// the X mark, verbatim from demos/remocn-new-logo/index.tsx
const X_MARK =
  "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z";

// the X verified seal, verbatim from components/remocn/x-follow-card.tsx
const X_SEAL =
  "M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z";

const X_BLUE = "#1d9bf0";

const Card: React.FC<{
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
  background: string;
  border?: string;
  children?: React.ReactNode;
}> = ({ left, top, width, height, rotate, background, border, children }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      height,
      borderRadius: 22,
      transform: `rotate(${rotate}deg)`,
      background,
      border: border ?? "none",
      boxShadow: "0 34px 80px rgba(0,0,0,0.62)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {children}
  </div>
);

export const AiAndSocialThumb: React.FC = () => (
  <ThumbFrame background={REMOCN.obsidian}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: -240,
          top: -240,
          width: 760,
          height: 760,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(120,114,152,0.24) 0%, rgba(20,19,24,0) 68%)",
          filter: "blur(26px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 700,
          top: 120,
          width: 820,
          height: 820,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(29,155,240,0.24) 0%, rgba(29,155,240,0.06) 40%, rgba(20,19,24,0) 70%)",
          filter: "blur(22px)",
        }}
      />

      {/* Claude — Anthropic clay on its own paper surface, never veiled */}
      <Card
        left={812}
        top={8}
        width={524}
        height={216}
        rotate={-4}
        background="#F0EEE6"
      >
        <div
          style={{
            padding: "28px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 22,
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width={38} height={38} viewBox="0 0 256 257">
              <path fill="#D97757" d={CLAUDE_MARK} />
            </svg>
            <span
              style={{
                fontFamily: GEIST,
                fontWeight: 500,
                fontSize: 30,
                color: "#3d3929",
              }}
            >
              Claude
            </span>
          </div>
          <div
            style={{
              flex: 1,
              borderRadius: 18,
              background: "#ffffff",
              border: "2px solid #e3ded1",
              padding: "0 16px 0 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: GEIST,
                fontSize: 32,
                color: "#3d3929",
              }}
            >
              Build me a landing page
            </span>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 9999,
                background: "#D97757",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 19V6M12 6l-6 6M12 6l6 6"
                  stroke="#ffffff"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </Card>

      {/* ChatGPT — OpenAI's own dark composer chrome */}
      <Card
        left={856}
        top={262}
        width={490}
        height={160}
        rotate={3}
        background="#212121"
        border="2px solid #303030"
      >
        <div
          style={{
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            height: "100%",
          }}
        >
          <span
            style={{ fontFamily: GEIST, fontSize: 28, color: "#B4B4B4" }}
          >
            ChatGPT
          </span>
          <div
            style={{
              flex: 1,
              borderRadius: 9999,
              background: "#303030",
              padding: "0 10px 0 26px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{ fontFamily: GEIST, fontSize: 34, color: "#ECECEC" }}
            >
              Ask anything
            </span>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 9999,
                background: "#FFFFFF",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 19V6M12 6l-6 6M12 6l6 6"
                  stroke="#0D0D0D"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </Card>

      {/* the X follow card — the colour moment */}
      <Card
        left={818}
        top={452}
        width={530}
        height={244}
        rotate={-2}
        background="#16181c"
        border="2px solid #2f3336"
      >
        <div
          style={{
            padding: "22px 30px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 66,
                height: 66,
                borderRadius: 9999,
                flexShrink: 0,
                background:
                  "radial-gradient(110% 110% at 30% 24%, #C3E88D 0%, #6f8a4a 60%, #2c3520 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                flex: 1,
                minWidth: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontFamily: GEIST,
                    fontWeight: 600,
                    fontSize: 32,
                    color: "#e7e9ea",
                  }}
                >
                  remocn
                </span>
                <svg width={27} height={27} viewBox="0 0 22 22">
                  <path fill={X_BLUE} d={X_SEAL} />
                </svg>
              </div>
              <span
                style={{ fontFamily: GEIST, fontSize: 27, color: "#8b9198" }}
              >
                @remocn
              </span>
            </div>
            <svg
              width={30}
              height={30}
              viewBox="0 0 24 24"
              style={{ flexShrink: 0, opacity: 0.85 }}
            >
              <path fill="#e7e9ea" d={X_MARK} />
            </svg>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span
                style={{
                  fontFamily: GEIST,
                  fontWeight: 600,
                  fontSize: 40,
                  color: "#e7e9ea",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                1,709
              </span>
              <span
                style={{ fontFamily: GEIST, fontSize: 28, color: "#8b9198" }}
              >
                Followers
              </span>
            </div>
          </div>

          <div
            style={{
              height: 62,
              borderRadius: 9999,
              background: X_BLUE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: GEIST,
                fontWeight: 600,
                fontSize: 32,
                color: "#ffffff",
              }}
            >
              Following
            </span>
          </div>
        </div>
      </Card>

      <div
        style={{
          position: "absolute",
          left: 76,
          top: 0,
          width: 760,
          height: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 40,
        }}
      >
        <RemocnLockup size={50} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { text: "Both shots are", color: REMOCN.ink },
            { text: "components", color: X_BLUE },
          ].map((line) => (
            <div
              key={line.text}
              style={{
                fontFamily: MANROPE,
                fontWeight: 800,
                fontSize: 110,
                lineHeight: "110px",
                letterSpacing: "-0.045em",
                whiteSpace: "nowrap",
                color: line.color,
              }}
            >
              {line.text}
            </div>
          ))}
        </div>

        <span
          style={{
            fontFamily: MONO,
            fontSize: 44,
            lineHeight: "44px",
            // the guest brand owns the colour here, so the slug stays ink
            color: "rgba(242,242,242,0.88)",
          }}
        >
          @remocn/claude-code
        </span>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
