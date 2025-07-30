"use client";

import React from "react";
import { Button } from "../ui/button";
import { Bot } from "lucide-react";
import { useUserStore } from "@/lib/zustand/useUserStore";
import { signIn } from "next-auth/react";

export default function CtaOverview() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-500 to-cyan-500">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to Start Saving Money?
        </h2>
        <p className="text-xl text-indigo-100 mb-8">
          Join thousands of smart shoppers who never pay full price
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isLoggedIn ? (
            <>
              <Button
                onClick={() => {
                  setIsLoading(true);
                  signIn("discord", { callbackUrl: "/dashboard" });
                }}
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg cursor-pointer"
                disabled={isLoading}
              >
                <Bot className="w-5 h-5 mr-2" />
                Connect Discord Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3 text-lg bg-transparent cursor-pointer"
              >
                View Demo
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3 text-lg bg-transparent cursor-pointer"
            >
              View Demo
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
