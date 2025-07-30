import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { serverId } = body;
    const accessToken = req.cookies.get("accessToken")?.value;

    const externalResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/discord/${serverId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
  } catch (error) {
    console.error("Error in internal API route:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
