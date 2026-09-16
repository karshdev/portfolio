import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CursorGlow } from "@/components/ambient/CursorGlow";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const TITLE = "Aakarsh Sharma — Full Stack Developer";
const DESCRIPTION =
  "Full-stack developer · Claude Certified Architect · automation. A live console portfolio.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Set SITE_URL in .env once the domain is live; localhost keeps OG tags valid
  // in development instead of pointing at a domain that doesn't resolve yet.
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: TITLE,
    description: "Full-stack developer · Claude Certified Architect · automation.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrains.variable} h-full antialiased`}>
      <body className="relative min-h-full overflow-x-hidden">
        <CursorGlow />
        <main className="relative z-10 min-h-full">{children}</main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
