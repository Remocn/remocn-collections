import type { AppProps } from "next/app";
import { Geist } from "next/font/google";
import "../../styles/global.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={geist.className} style={{ fontFamily: "var(--font-sans)" }}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
