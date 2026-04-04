import { useEffect, useRef } from "react";
import { useStore } from "../store";

export default function useAI() {
  const { price, delta, smc, timeframe } = useStore();
  const setData = useStore((s) => s.setData);
  const setAlert = useStore((s) => s.setAlert);
  const prev = useRef(null);

  useEffect(() => {
    // 🔥 jangan block total
    if (!price || !delta || !smc) {
      console.log("WAITING DATA...", { price, delta, smc });
      return;
    }

    const run = async () => {
      try {
        console.log("CALL AI");

        const r = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price, delta, smc, timeframe }),
        });

        const d = await r.json();

        if (!d) return;

        setData(d);

        const strong = d.confidence >= 0.7;
        const change = prev.current !== d.final;
        const valid = d.final !== "HOLD";

        if (strong && change && valid) {
          setAlert(`🔥 ${d.final} ${(d.confidence * 100).toFixed(0)}%`);
        }

        prev.current = d.final;
      } catch (e) {
        console.error("AI ERROR:", e);
      }
    };

    run();

    const i = setInterval(run, 60000);
    return () => clearInterval(i);
  }, [price, delta, smc, timeframe]); // 🔥 FIX
}
