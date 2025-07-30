import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const code = body.code;

  const clientId = process.env.DISCORD_CLIENT_ID!;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET!;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/discord/callback`;

  try {
    const response = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const discordData = response.data;

    const ownerId = discordData?.guild?.owner_id;
    const serverId = discordData?.guild?.id;
    const serverName = discordData?.guild?.name;
    const serverIcon = discordData?.guild?.icon;
    const accessToken = req.cookies.get("accessToken")?.value;

    const externalResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/discord/save-server`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ownerId,
          serverId,
          serverName,
          serverIcon,
        }),
      }
    );
    const data = await externalResponse.json();
    if (data.status !== "success") {
      return new Response(
        JSON.stringify({ error: data?.data.message || "External API error" }),
        {
          status: externalResponse.status,
        }
      );
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error(
      "OAuth Token Exchange Error:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to exchange code with Discord" },
      { status: 500 }
    );
  }
}
