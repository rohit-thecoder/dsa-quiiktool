'use client';
import {useEffect,useRef} from 'react';
import {adsEnabled,publisher,slots,type Placement} from './adConfig';
declare global{interface Window{adsbygoogle?:object[]}}
export default function AdContainer({placement}:{placement:Placement}){const ref=useRef<HTMLModElement>(null);const slot=slots[placement];
 const valid=adsEnabled && /^\d+$/.test(slot||'');
 useEffect(()=>{if(!valid||!ref.current)return;const el=ref.current;let sent=false;const resize=new ResizeObserver(()=>{if(!sent&&el.clientWidth>0&&!el.hasAttribute('data-adsbygoogle-status')){sent=true;try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch{sent=false;}}});resize.observe(el);return()=>resize.disconnect();},[valid,slot]);
 return valid?<aside aria-label="Advertisement" className={'ad ad-'+placement}><small>Advertisement</small><ins ref={ref} className="adsbygoogle" style={{display:'block'}} data-ad-client={publisher} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true"/></aside>:null;}
