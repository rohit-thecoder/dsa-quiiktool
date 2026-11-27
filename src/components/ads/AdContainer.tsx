'use client';
import {useEffect,useRef,useState} from 'react';
import {canShow,publisher,slots,type Placement} from './adConfig';
declare global{interface Window{adsbygoogle?:object[]}}
function Unit({placement}:{placement:Placement}){
 const ref=useRef<HTMLModElement>(null),sent=useRef(false),slot=slots[placement];
 useEffect(()=>{
  const el=ref.current;if(!el)return;
  let near=false,disposed=false;
  function request(){
   if(disposed||!near||sent.current||!el||!el.isConnected||el.clientWidth<120||el.getClientRects().length===0)return;
   if(el.hasAttribute('data-adsbygoogle-status')){sent.current=true;return}
   sent.current=true;
   try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch{sent.current=false;}
  }
  const observer=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(([entry])=>{near=!!entry?.isIntersecting;request()},{rootMargin:'250px 0px'});
  const resize=typeof ResizeObserver==='undefined'?null:new ResizeObserver(request);
  if(observer)observer.observe(el);else near=true;
  resize?.observe(el);request();
  return()=>{disposed=true;observer?.disconnect();resize?.disconnect()};
 },[slot]);
 const article=placement==='content';
 return <aside aria-label="Advertisement" className={'ad ad-'+placement}><small className="ad-label">Advertisement</small><ins ref={ref} className="adsbygoogle" style={{display:'block',textAlign:article?'center':undefined,minHeight:placement==='sidebar'?250:placement==='banner'?90:120}} data-ad-client={publisher} data-ad-slot={slot} data-ad-format={article?'fluid':placement==='sidebar'?'rectangle':'auto'} data-ad-layout={article?'in-article':undefined} data-full-width-responsive={article||placement==='sidebar'?undefined:'true'}/></aside>;
}
export default function AdContainer({placement}:{placement:Placement}){
 const [wide,setWide]=useState(false);
 useEffect(()=>{if(placement!=='sidebar'||!canShow(placement))return;const media=window.matchMedia('(min-width:1440px)');const update=()=>setWide(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[placement]);
 if(!canShow(placement)||placement==='sidebar'&&!wide)return null;
 return <Unit key={placement+slots[placement]} placement={placement}/>;
}
