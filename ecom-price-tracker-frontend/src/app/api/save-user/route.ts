export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { discordId, name, email, avatar } = body;

    const externalResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/save-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: process.env.ADMIN_URL_TOKEN,
          discordId,
          name,
          email,
          avatar,
        }),
      }
    );

    const data = await externalResponse.json();

    console.log("Response from external API:", data);

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
