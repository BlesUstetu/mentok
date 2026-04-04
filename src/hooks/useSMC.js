import { useEffect, useRef } from "react";
import { useStore } from "../store";

export default function useSMC() {
  const price = useStore((s) => s.price);
  const setSMC = useStore((s) => s.setSMC);

  const history = useRef([]);

  useEffect(() => {
    if (!price) return;

    const h = history.current;

    h.push(price);
    if (h.length > 50) h.shift();

    const high = Math.max(...h);
    const low = Math.min(...h);

    let sweep = null;

    // 🔥 lebih realistis (buffer lebih kecil)
    if (price >= high * 0.9995) sweep = "UP";
    else if (price <= low * 1.0005) sweep = "DOWN";

    setSMC({ high, low, sweep });

    console.log("SMC:", { high, low, sweep });
  }, [price, setSMC]);
}
