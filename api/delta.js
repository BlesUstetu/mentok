export default async function handler(req, res) {
  const fetchWithTimeout = async (url, ms = 2000) => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), ms);

      const r = await fetch(url, { signal: controller.signal });
      clearTimeout(id);

      return await r.json();
    } catch {
      return null;
    }
  };

  try {
    // 🔥 PARALLEL FETCH
    const [b, by, ok, cb] = await Promise.all([
      fetchWithTimeout("https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=20"),
      fetchWithTimeout("https://api.bybit.com/v5/market/orderbook?category=linear&symbol=BTCUSDT"),
      fetchWithTimeout("https://www.okx.com/api/v5/market/books?instId=BTC-USDT"),
      fetchWithTimeout("https://api.exchange.coinbase.com/products/BTC-USD/book?level=2")
    ]);

    let buy = 0, sell = 0;

    // BINANCE
    if (b?.bids && b?.asks) {
      b.bids.forEach(x => buy += +x[1]);
      b.asks.forEach(x => sell += +x[1]);
    }

    // BYBIT
    if (by?.result?.b && by?.result?.a) {
      by.result.b.forEach(x => buy += +x[1]);
      by.result.a.forEach(x => sell += +x[1]);
    }

    // OKX
    if (ok?.data?.[0]?.bids && ok?.data?.[0]?.asks) {
      ok.data[0].bids.forEach(x => buy += +x[1]);
      ok.data[0].asks.forEach(x => sell += +x[1]);
    }

    // COINBASE
    if (cb?.bids && cb?.asks) {
      cb.bids.forEach(x => buy += +x[1]);
      cb.asks.forEach(x => sell += +x[1]);
    }

    const total = buy + sell || 1;

    res.status(200).json({
      buy: Math.round((buy / total) * 100),
      sell: Math.round((sell / total) * 100)
    });

  } catch (err) {
    console.error("DELTA ERROR:", err);

    res.status(200).json({
      buy: 50,
      sell: 50
    });
  }
}
