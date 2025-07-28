"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bot } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-6 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 animate-pulse">
            🎉 Now tracking 10,000+ products daily
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Track Product Prices.{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Get Discord Alerts
            </span>{" "}
            Instantly.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Never miss a deal again! Monitor prices across Daraz, Amazon, and
            Flipkart. Get instant notifications when prices drop, delivered
            straight to your Discord server.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => signIn("discord")}
              title="Authorize the Discord bot and start tracking prices"
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-8 py-3 text-lg animate-bounce cursor-pointer"
            >
              <Bot className="w-5 h-5 mr-2" />
              Invite Bot to Server
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 text-lg border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-900 bg-transparent cursor-pointer"
              >
                Start Tracking
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
