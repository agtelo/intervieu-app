import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// Self-hosted (not next/font/google): Vercel's build environment was
// intermittently failing to fetch the font from Google at build time
// ("Cannot read properties of null (reading '1')" in the font loader),
// breaking production builds. This is the same variable-weight woff2
// Google would have served, just bundled locally instead of fetched.
const plusJakartaSans = localFont({
  src: "./fonts/plus-jakarta-sans-latin-variable.woff2",
  variable: "--font-plus-jakarta",
  weight: "400 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "intervU - Preparate para cualquier entrevista con IA",
  description:
    "Subí tu CV y la descripción del puesto. La IA investiga la empresa, analiza tu fit, genera preguntas probables y te ofrece un simulacro de entrevista realista.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard">
      <html
        lang="es"
        className={`${plusJakartaSans.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
