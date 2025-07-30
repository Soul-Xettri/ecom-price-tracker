// /app/api/discord/invite-link/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(
    `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/discord/callback`
  );
  const permissions = "274878365696";
  const scope = ["bot", "applications.commands"];

  const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=${scope.join(
    "%20"
  )}&redirect_uri=${redirectUri}&response_type=code`;

  return NextResponse.json({ url });
}
