import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import "../../styles/global.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      <div
        className={`${geist.variable} isolate font-sans [--font-sans:var(--font-geist),ui-sans-serif,system-ui,sans-serif]`}
      >
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
