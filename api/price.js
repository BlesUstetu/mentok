import WebSocket from "ws";

let price = 0;

const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

ws.on("message", (msg) => {
  const data = JSON.parse(msg);
  price = Number(data.p);
});

export default function handler(req, res) {
  res.status(200).json({ price });
}
