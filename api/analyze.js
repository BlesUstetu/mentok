export default async function handler(req, res) {
  try {
    const key = process.env.OPENROUTER_API_KEY;

    if (!key) {
      return res.status(500).json({
        error: "OPENROUTER_API_KEY not set"
      });
    }

    const { price, delta } = req.body || {};

    const prompt = `
You are a crypto trading AI.

Return ONLY JSON (no text, no explanation).

Format:
{
  "bias": "LONG or SHORT",
  "confidence": number (0-100),
  "entry": number,
  "tp": number,
  "sl": number
}

Data:
Price: ${price}
Buy: ${delta?.buy}
Sell: ${delta?.sell}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const json = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: json
      });
    }

    let text = json?.choices?.[0]?.message?.content || "";

    // 🔥 CLEAN RESPONSE (kadang AI kasih ```json)
    text = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: text
      });
    }

    // 🔥 VALIDASI
    if (!parsed.entry || !parsed.tp || !parsed.sl) {
      return res.status(500).json({
        error: "Invalid AI format",
        raw: parsed
      });
    }

    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
