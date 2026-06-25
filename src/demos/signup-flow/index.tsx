import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { RemocnUIProvider } from "@/lib/remocn-ui";
import { SignupFlow } from "@/components/remocn/signup-flow";

// Capture Inter's font family and expose it as `--font-geist-sans`, the CSS
// variable the remocn components reference for their `fontFamily`. Without
// this binding the variable is undefined inside the Remotion render and the
// components fall back to a system font.
const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const SignupFlowDemo: React.FC = () => (
  <RemocnUIProvider>
    <div
      style={
        {
          width: "100%",
          height: "100%",
          "--font-geist-sans": fontFamily,
        } as React.CSSProperties
      }
    >
      <SignupFlow />
    </div>
  </RemocnUIProvider>
);
