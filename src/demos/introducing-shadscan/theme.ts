import { loadFont as loadHeading } from "@remotion/google-fonts/Outfit";
import { loadFont as loadBody } from "@remotion/google-fonts/NunitoSans";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

// shadscan.com typography: Outfit is the site's --font-heading (header wordmark,
// hero H1), Nunito Sans the --font-sans body face, Geist Mono the code register.
const { fontFamily: OUTFIT_FAMILY } = loadHeading("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});
const { fontFamily: NUNITO_FAMILY } = loadBody("normal", {
  subsets: ["latin"],
  weights: ["400", "600"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

export const HEADING = `${OUTFIT_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
export const BODY = `${NUNITO_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
export const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, Menlo, monospace`;
export const OUTFIT = OUTFIT_FAMILY;
export const MONO_FAMILY_EXPORT = MONO_FAMILY;

// shadcn neutral dark tokens, lifted from shadscan.com's live stylesheet:
// --background:#0a0a0a, --foreground:#fafafa, --card:#171717,
// --muted-foreground:#a1a1a1, --border:#ffffff1a, --destructive:#ff6568.
export const BG = "#0a0a0a";
export const WINDOW = "#0d0d0d";
export const CARD = "#171717";
export const INK = "#fafafa";
export const BODY_INK = "#e5e5e5";
export const MUTED = "#a1a1a1";
export const FAINT = "#737373";
export const HAIRLINE = "rgba(255,255,255,0.1)";
export const HAIRLINE_SOFT = "rgba(255,255,255,0.06)";

// The only chroma: terminal-semantic colors the product's own output wears.
export const GREEN = "#4ade80";
export const AMBER = "#fbbf24";
export const RED = "#ff6568";
export const GREEN_BG = "rgba(74,222,128,0.12)";
export const RED_BG = "rgba(255,101,104,0.13)";
export const AMBER_BG = "rgba(251,191,36,0.11)";

// Restrained syntax tints for the code frame (near-shiki on near-black).
export const SYN_KEYWORD = "#f472b6";
export const SYN_FN = "#93c5fd";
export const SYN_TEXT = "#d4d4d8";
export const SYN_PUNCT = "#71717a";
export const SYN_ATTR = "#c4b5fd";

// The Claude Code panel wears remocn's own claude-code palette (dark theme,
// remocn.dev/docs/ai/claude-code) — terracotta accent + warm neutrals, NOT the
// react-doctor orange. This is what makes the card read as Claude Code.
export const CC_ACCENT = "#D97757"; // terracotta — dashed border, legend, mark
export const CC_FG = "#E8E5DD"; // warm off-white primary
export const CC_MUTED = "#8A857C"; // warm muted
export const CC_DIM = "#6B6660"; // warm dim
export const CC_GREEN = "#28C840"; // remocn success green (✓, resolved diff)

// Diff tints for the agent's edit frame — the added line greens toward remocn's
// success green, the removed line a muted warm red.
export const RD_RED_TEXT = "#F0776C";
export const RD_RED_BG = "rgba(224,73,61,0.13)";
export const RD_RED_BAR = "#E0493D";
export const RD_GREEN_TEXT = "#63D98A";
export const RD_GREEN_BG = "rgba(40,200,64,0.13)";
export const RD_GREEN_BAR = "#28C840";
export const RD_CTX_NUM = "#6B6660";
export const RD_CTX_CODE = "#DADAD3";

// GitHub UI tokens (dark, github.com) — the CI gate visualization.
export const GH_BG = "#0d1117";
export const GH_BORDER = "#30363d";
export const GH_TEXT = "#c9d1d9";
export const GH_MUTED = "#8b949e";
export const GH_RED = "#f85149";
export const GH_GREEN = "#3fb950";
export const GH_KEY = "#79c0ff";
export const GH_STR = "#a5d6ff";

export const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
