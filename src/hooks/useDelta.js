import { useEffect } from "react";
import { useStore } from "../store";

export default function useDelta() {
  const setDelta = useStore((s) => s.setDelta);

  useEffect(() => {
    const run = async () => {
      try {
        console.log("FETCH DELTA...");

        const res = await fetch("/api/delta");
        const data = await res.json();

        if (!data) return;

        setDelta(data);

        console.log("DELTA:", data);
      } catch (err) {
        console.error("DELTA ERROR:", err);
      }
    };

    run();

    const interval = setInterval(run, 10000); // update tiap 10 detik
    return () => clearInterval(interval);
  }, [setDelta]);
}
