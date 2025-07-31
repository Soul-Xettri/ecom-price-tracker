"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/containers/Header";

export default function DiscordCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;

    (async () => {
      const res = await fetch("/api/discord/exchange-code", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (res.ok) {
        // Redirect or show success
        router.push("/dashboard/discord?connected=true");
      } else {
        console.error(data);
      }
    })();
  }, []);

  return (
    <>
      <Header title={"Discord Bot"} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Discord Bot Integration
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Connect our bot to your Discord server to receive instant price
                drop notifications
              </p>
            </div>
          </div>
          <p className="p-6 text-center">Connecting your server...</p>
        </div>
      </div>
    </>
  );
}
