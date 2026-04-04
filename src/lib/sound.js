
export function beep(){
 try{
  const ctx=new (window.AudioContext||window.webkitAudioContext)();
  const o=ctx.createOscillator();
  const g=ctx.createGain();
  o.frequency.value=880;
  g.gain.value=0.1;
  o.connect(g); g.connect(ctx.destination);
  o.start(); o.stop(ctx.currentTime+0.2);
 }catch{}
}
