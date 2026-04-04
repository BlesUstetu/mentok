
import useWS from "./hooks/useWS";
import useSMC from "./hooks/useSMC";
import useAI from "./hooks/useAI";
import UI from "./components/UI";
import useDelta from "./hooks/useDelta";

export default function App(){
 useWS();
 useSMC();
 useAI();
 useDelta();
 return <UI/>;
}
