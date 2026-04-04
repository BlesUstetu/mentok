import { useStore } from "../store";
import AlertPopup from "./AlertPopup";

export default function UI() {
  const { price, last, delta, smc, data, timeframe, setTF, alert } = useStore();

  const isUp = price > last;
  const isDown = price < last;

  const priceColor = isUp ? "text-green-400" : isDown ? "text-red-400" : "text-white";

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white p-4">
      <AlertPopup message={alert} />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-semibold ${priceColor}`}>
          BTC {price ? price.toLocaleString() : "..."}
        </h1>

        <select
          value={timeframe}
          onChange={(e) => setTF(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm"
        >
          <option>1m</option>
          <option>5m</option>
          <option>15m</option>
        </select>
      </div>

      {/* MARKET STATUS */}
      {!price && (
        <div className="text-gray-400 animate-pulse">
          Connecting to market...
        </div>
      )}

      {/* DELTA + SMC */}
      <div className="grid grid-cols-2 gap-3 mb-4">

        {/* DELTA */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Order Flow</div>

          {delta ? (
            <>
              <div className="text-green-400 font-semibold">
                BUY {delta.buy}%
              </div>
              <div className="text-red-400 text-sm">
                SELL {delta.sell}%
              </div>
            </>
          ) : (
            <div className="opacity-50 text-sm">Loading...</div>
          )}
        </div>

        {/* SMC */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Liquidity</div>

          {smc ? (
            <div className="text-cyan-400 font-semibold">
              Sweep: {smc.sweep || "-"}
            </div>
          ) : (
            <div className="opacity-50 text-sm">Analyzing...</div>
          )}
        </div>

      </div>

      {/* AI SIGNAL */}
      {data ? (
        <div className="p-4 rounded-2xl bg-[#0f141b] border border-cyan-500/20 shadow-[0_0_20px_rgba(0,255,255,0.08)]">

          {/* SIGNAL HEADER */}
          <div className="flex justify-between items-center mb-3">
            <div className={`text-xl font-bold ${
              data.final === "BUY" ? "text-green-400" : "text-red-400"
            }`}>
              {data.final}
            </div>

            <div className="text-sm text-gray-400">
              {(data.confidence * 100).toFixed(0)}%
            </div>
          </div>

          {/* CONFIDENCE BAR */}
          <div className="w-full h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
            <div
              className={`h-full ${
                data.final === "BUY" ? "bg-green-400" : "bg-red-400"
              }`}
              style={{ width: `${data.confidence * 100}%` }}
            />
          </div>

          {/* ENTRY / TP / SL */}
          <div className="grid grid-cols-3 gap-3">

            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="text-xs text-gray-400">Entry</div>
              <div className="font-semibold">
                {data.entry}
              </div>
            </div>

            <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/30">
              <div className="text-xs text-gray-400">TP</div>
              <div className="text-green-400 font-semibold">
                {data.tp}
              </div>
            </div>

            <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/30">
              <div className="text-xs text-gray-400">SL</div>
              <div className="text-red-400 font-semibold">
                {data.sl}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="text-gray-500 mt-4 animate-pulse">
          Waiting AI signal...
        </div>
      )}
    </div>
  );
}
