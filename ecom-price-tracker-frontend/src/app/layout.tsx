import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

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
        <Toaster richColors />
        <NextTopLoader color="#122173" showSpinner={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
