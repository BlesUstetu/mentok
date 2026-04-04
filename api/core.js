
export function inZone(price, zone){
  if(!zone) return false;
  return price >= zone.low && price <= zone.high;
}

export function detectStructure(closes){
  const high = Math.max(...closes.slice(-5));
  const low = Math.min(...closes.slice(-5));
  const last = closes.at(-1);
  const prev = closes.at(-2);

  let bos=null;
  if(last>high && prev<=high) bos="BULLISH_BOS";
  if(last<low && prev>=low) bos="BEARISH_BOS";

  return {bos, high, low};
}

export function detectSweep(price, high, low, closes){
  const last = closes.at(-1);
  if(price>high && last<high) return "SWEEP_HIGH";
  if(price<low && last>low) return "SWEEP_LOW";
  return null;
}

export function detectOrderBlock(klines){
  const prev = klines.at(-2);
  const open = +prev[1];
  const close = +prev[4];
  if(close>open) return {bullishOB:{low:open,high:close}};
  return {bearishOB:{low:close,high:open}};
}

export function detectFVG(klines){
  let out=[];
  for(let i=2;i<klines.length;i++){
    const h1=+klines[i-2][2];
    const l3=+klines[i][3];
    if(l3>h1) out.push({type:"BULLISH",low:h1,high:l3});
  }
  return out.slice(-2);
}
