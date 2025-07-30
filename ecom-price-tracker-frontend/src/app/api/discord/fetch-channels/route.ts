import { NextRequest, NextResponse } from "next/server";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN as string;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const guildId = url.searchParams.get("guildId");

  if (!guildId) {
    return NextResponse.json({ error: "Missing guildId" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/channels`,
      {
        method: "GET",
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json({ error }, { status: res.status });
    }

    const channels = await res.json();
    return NextResponse.json(channels);
  } catch (err) {
    console.error("Error fetching channels:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
