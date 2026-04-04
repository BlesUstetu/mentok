
import { useEffect, useState } from "react";
import { beep } from "../lib/sound";
import { vibrate } from "../lib/vibrate";

export default function AlertPopup({ message }){
 const [show,setShow]=useState(false);

 useEffect(()=>{
  if(!message) return;
  setShow(true);
  beep(); vibrate();
  const t=setTimeout(()=>setShow(false),3000);
  return()=>clearTimeout(t);
 },[message]);

 if(!show) return null;

 return (
  <div className="fixed top-4 right-4 z-50 animate-slide-in">
    <div className="bg-black/80 border border-yellow-400 px-4 py-2 rounded">
      🔔 {message}
    </div>
  </div>
 );
}
