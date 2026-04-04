
import { create } from "zustand";
export const useStore = create(set => ({
  price:0,last:0,delta:null,smc:null,data:null,timeframe:"1m",alert:null,loading:false,
  setPrice:p=>set(s=>({last:s.price||p,price:p})),
  setDelta:d=>set({delta:d}),
  setSMC:s=>set({smc:s}),
  setData:d=>set({data:d}),
  setTF:t=>set({timeframe:t}),
  setAlert:a=>set({alert:a}),
  setLoading:l=>set({loading:l})
}));
