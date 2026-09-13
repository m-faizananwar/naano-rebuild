import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import { BRAND } from "@/config/brand";
// Cormorant Garamond 500 is only for the brand lockup (src/components/brand).
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500"], variable: "--font-cormorant", display: "swap" });

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const TOAST_MS = 3000;

export const metadata: Metadata = {
  title: `${BRAND.wordmark}`,
  description: "Creator marketplace — rebuild",
  // The oval-sprig mark (scripts/icons.mjs renders the PNGs from public/favicon.svg and public/mark.svg).
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster position="bottom-right" duration={TOAST_MS} />
      </body>
    </html>
  );
}
