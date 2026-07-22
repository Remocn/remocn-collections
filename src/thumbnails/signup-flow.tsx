import React from "react";
import { INTER, MANROPE, RemocnLockup, ThumbFrame } from "./kit";

/**
 * The only light-ground cover in the batch — because the product here IS the
 * form surface, and the signup card ships light. The card is the real thing,
 * but cropped hard into its two load-bearing beats — the focused email field
 * and the button it submits to — so the form still reads as a form at the size
 * YouTube actually draws it.
 */
const CARD_INK = "#09090b";
const BORDER = "#e4e4e7";
const GREEN = "#16a34a";

const Field: React.FC<{
  label: string;
  value: string;
  focused?: boolean;
}> = ({ label, value, focused }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
    <span
      style={{
        fontFamily: INTER,
        fontWeight: 600,
        fontSize: 40,
        lineHeight: "40px",
        letterSpacing: "-0.01em",
        color: CARD_INK,
      }}
    >
      {label}
    </span>
    <div
      style={{
        height: 86,
        borderRadius: 13,
        border: `2px solid ${focused ? CARD_INK : BORDER}`,
        boxShadow: focused ? `0 0 0 6px rgba(9,9,11,0.13)` : "none",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        padding: "0 22px",
        fontFamily: INTER,
        fontSize: 38,
        color: value.startsWith("•") ? CARD_INK : "#9b9ba3",
      }}
    >
      {value}
    </div>
  </div>
);

export const SignupFlowThumb: React.FC = () => (
  <ThumbFrame background="linear-gradient(160deg,#fbfbfc 0%,#eeeef1 100%)">
    {/* Card — the subject, sat on the light ground the component ships with. */}
    <div
      style={{
        position: "absolute",
        left: 744,
        top: 58,
        width: 484,
        boxSizing: "border-box",
        padding: 34,
        borderRadius: 20,
        background: "#ffffff",
        border: `2px solid ${BORDER}`,
        boxShadow:
          "0 40px 80px -28px rgba(9,9,11,0.30), 0 8px 20px -10px rgba(9,9,11,0.12)",
        display: "flex",
        flexDirection: "column",
        gap: 30,
      }}
    >
      <span
        style={{
          fontFamily: INTER,
          fontWeight: 600,
          fontSize: 48,
          lineHeight: "52px",
          letterSpacing: "-0.02em",
          color: CARD_INK,
        }}
      >
        Create an account
      </span>

      <Field label="Email" value="m@example.com" focused />
      <Field label="Password" value="••••••••" />

      <div
        style={{
          height: 94,
          borderRadius: 13,
          background: CARD_INK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: INTER,
          fontWeight: 600,
          fontSize: 42,
          color: "#fafafa",
        }}
      >
        Create account
      </div>
    </div>

    {/* The flow's last beat, escaping the card. */}
    <div
      style={{
        position: "absolute",
        left: 640,
        top: 588,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "22px 32px",
        borderRadius: 16,
        background: "#ffffff",
        border: `2px solid ${BORDER}`,
        boxShadow: "0 24px 50px -18px rgba(9,9,11,0.28)",
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: GREEN,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width={30} height={30} viewBox="0 0 24 24">
          <path
            d="M4 12.5 9.5 18 20 6.5"
            fill="none"
            stroke="#fff"
            strokeWidth={3.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span
        style={{
          fontFamily: INTER,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: "44px",
          letterSpacing: "-0.01em",
          color: CARD_INK,
        }}
      >
        Account created
      </span>
    </div>

    {/* Left column — brand, claim, source. */}
    <div
      style={{
        position: "absolute",
        left: 84,
        top: 26,
        width: 600,
        height: 720,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 30,
      }}
    >
      <RemocnLockup size={42} color="rgba(9,9,11,0.8)" />

      <div style={{ display: "flex", flexDirection: "column" }}>
        {[
          { text: "Signup,", color: CARD_INK },
          { text: "field by field", color: GREEN },
        ].map((line) => (
          <div
            key={line.text}
            style={{
              fontFamily: MANROPE,
              fontWeight: 800,
              fontSize: 100,
              lineHeight: "104px",
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
          fontFamily: MANROPE,
          fontWeight: 600,
          fontSize: 52,
          lineHeight: "52px",
          color: "rgba(9,9,11,0.78)",
        }}
      >
        Built from remocn primitives
      </div>
    </div>
  </ThumbFrame>
);
