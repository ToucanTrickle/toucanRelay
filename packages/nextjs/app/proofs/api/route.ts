export async function POST(req: Request) {
  try {
    const reqData = await req.json();
    const cmcResp = await fetch(reqData.url, {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": String(process.env.CMC_API_KEY),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
      },
    });
    const cmcData = await cmcResp.json();
    return new Response(JSON.stringify({ data: cmcData }));
  } catch (e) {
    return new Response("Server Error", { status: 500 });
  }
}
