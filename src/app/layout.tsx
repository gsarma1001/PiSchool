import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Pi School | Build understanding. Grow confidence.",
  description:
    "A welcoming starting point for tutoring and a growing collection of ways to explore mathematics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
