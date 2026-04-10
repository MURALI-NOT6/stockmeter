import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// next/font handles downloading, self-hosting, and preloading automatically.
// The manual <link> to Google Fonts CDN is removed — it was duplicate & slower.

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap", // Prevents invisible text flash during font load
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-headline",
  subsets: ["latin"],
  display: "swap",
});

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "StockMeter | Tactical Terminal",
  description:
    "Real-time quantitative stock analysis and market intelligence engine. Track price trends, analyst sentiment, and financial health indicators.",
  keywords: ["stock market", "trading terminal", "stock analysis", "real-time finance"],
  openGraph: {
    title: "StockMeter | Tactical Terminal",
    description: "Real-time quantitative stock analysis and market intelligence engine.",
    type: "website",
  },
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark scroll-smooth ${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-on-background font-body antialiased selection:bg-primary-container/30">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
