import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import { BRAND } from "@/config/brand";
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const TOAST_MS = 3000;

export const metadata: Metadata = {
  title: `${BRAND.wordmark}`,
  description: "Creator marketplace — rebuild",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster position="bottom-right" duration={TOAST_MS} />
      </body>
    </html>
  );
}
