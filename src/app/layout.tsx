import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Pi School | Build understanding. Grow confidence.",
  description:
    "Explore mathematics from early number sense through advanced courses with The Pi School’s tutoring information and math learning activities.",
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
