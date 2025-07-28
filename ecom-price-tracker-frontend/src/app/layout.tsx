import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/custom-ui/nav-component/top-nav";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PriceTracker - Track Product Prices & Get Discord Alerts",
  description:
    "Never miss a deal again! Monitor prices across Daraz, Amazon, and Flipkart. Get instant notifications when prices drop, delivered straight to your Discord server.",
  keywords:
    "price tracker, discord bot, amazon price alerts, daraz deals, flipkart discounts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
