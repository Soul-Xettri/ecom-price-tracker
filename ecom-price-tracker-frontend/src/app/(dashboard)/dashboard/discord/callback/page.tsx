"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
        router.push("/dashboard");
      } else {
        console.error(data);
      }
    })();
  }, []);

  return <p className="p-6 text-center">Connecting your server...</p>;
}
