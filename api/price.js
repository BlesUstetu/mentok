export const config = {
  runtime: "edge"
};

export default async function handler() {
  try {
    const r = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");

    const text = await r.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({
        error: "Invalid JSON from Binance",
        raw: text
      }), { status: 500 });
    }

    if (!data.price) {
      return new Response(JSON.stringify({
        error: "No price field",
        response: data
      }), { status: 500 });
    }

    return new Response(JSON.stringify({
      price: Number(data.price)
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({
      error: e.message
    }), { status: 500 });
  }
}
