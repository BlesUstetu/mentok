
import axios from "axios";
import { DEFAULT_PARAMS } from "./params.js";
import { detectStructure, detectSweep, detectOrderBlock, detectFVG, inZone } from "./core.js";

export default async function handler(req,res){
  try {
    const symbol = req.query.symbol || "BTCUSDT";

    const [p, ob, k] = await Promise.all([
      axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`),
      axios.get(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=20`),
      axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=50`)
    ]);

    const price = +p.data.price;
    const bids = ob.data.bids;
    const asks = ob.data.asks;
    const closes = k.data.map(d=>+d[4]);

    const pms = DEFAULT_PARAMS;

    // volume & range filter
    const bidVol = bids.slice(0,10).reduce((a,b)=>a+parseFloat(b[1]),0);
    const askVol = asks.slice(0,10).reduce((a,b)=>a+parseFloat(b[1]),0);
    const range = Math.max(...closes) - Math.min(...closes);

    if (bidVol + askVol < pms.MIN_BOOK_VOL || range/price < pms.SIDEWAY_TH) {
      return res.json({ action:"WAIT", reason:"LOW_ACTIVITY" });
    }

    // structure & sweep
    const structure = detectStructure(closes);
    const sweep = detectSweep(price, structure.high, structure.low, closes);

    // OB & FVG
    const oblock = detectOrderBlock(k.data);
    const fvg = detectFVG(k.data);

    // momentum & trend
    const prev = closes.at(-2);
    const momentumUp = price > prev;

    const avg = closes.reduce((a,b)=>a+b,0)/closes.length;
    const trendUp = price > avg;

    let score = 0;

    if(sweep==="SWEEP_LOW") score += pms.W_SWEEP;
    if(sweep==="SWEEP_HIGH") score -= pms.W_SWEEP;

    if(inZone(price, oblock.bullishOB)) score += pms.W_OB;
    if(inZone(price, oblock.bearishOB)) score -= pms.W_OB;

    const nearFVG = fvg.find(z => Math.abs(price-z.low)/price < pms.NEAR_FVG_PCT);
    if(nearFVG?.type==="BULLISH") score += pms.W_FVG;
    if(nearFVG?.type==="BEARISH") score -= pms.W_FVG;

    if(momentumUp) score += pms.W_MOM;
    else score -= pms.W_MOM;

    if(trendUp) score += pms.W_TREND;
    else score -= pms.W_TREND;

    // strong confirmation
    const strongBuy =
      sweep === "SWEEP_LOW" &&
      structure.bos === "BULLISH_BOS";

    const strongSell =
      sweep === "SWEEP_HIGH" &&
      structure.bos === "BEARISH_BOS";

    let action = "WAIT";

    if (strongBuy && score > pms.BUY_TH) action = "BUY";
    else if (strongSell && score < pms.SELL_TH) action = "SELL";

    res.json({
      symbol,
      price,
      action,
      confidence: Math.round(score*100),
      score,
      sweep,
      bos: structure.bos,
      inOB: inZone(price, oblock.bullishOB) || inZone(price, oblock.bearishOB),
      fvgCount: fvg.length
    });

  } catch(e){
    return res.status(500).json({ error:"API_ERROR" });
  }
}
