import { useEffect } from "react";
import { useStore } from "../store";

export default function useWS() {
  const setPrice = useStore((s) => s.setPrice);

  useEffect(() => {
    let intervalId; // ✅ declare dulu

    const run = async () => {
      try {
        console.log("FETCH PRICE...");

        const r = await fetch("/api/price");
        const d = await r.json();

        console.log("PRICE API:", d);

        if (d?.price) {
          setPrice(d.price);
        }
      } catch (e) {
        console.error("PRICE ERROR:", e);
      }
    };

    run();

    intervalId = setInterval(run, 2000); // ✅ assign setelah declare

    return () => {
      if (intervalId) clearInterval(intervalId); // ✅ aman
    };
  }, [setPrice]);
}
