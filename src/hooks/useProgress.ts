'use client';
import {useSyncExternalStore} from 'react';
import {defaults,key,readProgress,type Progress} from '@/lib/persistence/progress';
let previous:string|null|undefined; let cached=defaults;
function snapshot(){
  try {const raw=localStorage.getItem(key); if(raw!==previous){previous=raw;cached=raw?readProgress(raw):defaults;}} catch {if(previous===undefined) cached=defaults;}
  return cached;
}
function subscribe(cb:()=>void){window.addEventListener('storage',cb);window.addEventListener('dsa-progress',cb);return ()=>{window.removeEventListener('storage',cb);window.removeEventListener('dsa-progress',cb);};}
export function updateProgress(fn:(p:Progress)=>Progress){
  const current=snapshot(), next=fn(current);
  if(next===current)return;
  cached=next;
  try{const raw=JSON.stringify(next);localStorage.setItem(key,raw);previous=raw;}catch{/* Keep the active session usable when storage is restricted. */}
  window.dispatchEvent(new Event('dsa-progress'));
}
export const useProgress=()=>useSyncExternalStore(subscribe,snapshot,()=>defaults);
