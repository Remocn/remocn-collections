import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { SITE_URL } from "@/lib/site-config";
import "../../styles/global.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <div
            className={`${geist.variable} isolate font-sans [--font-sans:var(--font-geist),ui-sans-serif,system-ui,sans-serif]`}
          >
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
