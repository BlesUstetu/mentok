import axios from "axios";

export default async function handler(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "BTCUSDT";

    const priceRes = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );

    const price = parseFloat(priceRes.data.price);

    return res.json({
      symbol,
      price,
      action: "WAIT",
      test: "OK"
    });

  } catch (e) {
    return res.status(200).json({
      error: e.message
    });
  }
}
