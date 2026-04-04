export function parseSignal(input) {
  try {
    if (!input) return null;

    let data;

    // coba JSON dulu
    try {
      data = typeof input === "string"
        ? JSON.parse(input)
        : input;
    } catch {
      // fallback regex parsing
      const entry = input.match(/entry[:\s]*([0-9.]+)/i)?.[1];
      const tp = input.match(/tp[:\s]*([0-9.]+)/i)?.[1];
      const sl = input.match(/sl[:\s]*([0-9.]+)/i)?.[1];

      if (!entry || !tp || !sl) return null;

      data = { entry, tp, sl };
    }

    return {
      bias: data.bias || "NEUTRAL",
      confidence: Number(data.confidence) || 0,
      entry: Number(data.entry),
      tp: Number(data.tp),
      sl: Number(data.sl)
    };

  } catch (e) {
    console.error("parseSignal error:", e);
    return null;
  }
}
