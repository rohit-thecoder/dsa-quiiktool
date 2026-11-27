'use client';
import {useEffect,useState} from 'react';
import {Play,Pause,SkipForward,RotateCcw,Activity} from 'lucide-react';
const values=[3,7,12,18,24,31,42,56,68];
function trace(target:number){
 const rows:{lo:number,hi:number,mid:number,decision:string}[]=[];let lo=0,hi=values.length-1;
 while(lo<=hi){const mid=Math.floor((lo+hi)/2), v=values[mid];
 rows.push({lo,hi,mid,decision:v===target?'return mid':v<target?'left = mid + 1':'right = mid - 1'});
 if(v===target)break;if(v<target)lo=mid+1;else hi=mid-1;} return rows;
}
export default function HeroDemo(){
 const [target,setTarget]=useState(42),[i,step]=useState(0),[playing,play]=useState(false);
 const rows=trace(target),f=rows[i],last=i===rows.length-1;
 useEffect(()=>{if(!playing)return;const t=setTimeout(()=>{if(last)play(false);else step(v=>v+1);},1300);return()=>clearTimeout(t);},[i,playing,last]);
 return <section className="hero-demo" aria-label="Live binary search demonstration"><div className="demo-head"><span className="mono"><Activity size={16}/> LIVE VISUALIZER</span><span className="demo-light">● <span>Interactive</span></span></div>
 <div className="demo-inner"><div className="row spread"><h2>Binary Search</h2><label className="target">target <select aria-label="Search target" value={target} onChange={e=>{setTarget(+e.target.value);step(0);play(false)}}>{values.map(v=><option key={v}>{v}</option>)}</select></label></div>
 <div className="bars">{values.map((v,j)=><div key={v} className={'bar-col '+(j===f.mid?'current':j<f.lo||j>f.hi?'out':'')}><div className="bar" style={{height:(22+v*.88)+'px'}}><span>{v}</span></div><small>{j===f.mid?'mid':j===f.lo?'L':j===f.hi?'R':'·'}</small></div>)}</div>
 <div className="code-preview"><b>›</b> <code>{f.decision}</code><span>{String(i+1).padStart(2,'0')} / {String(rows.length).padStart(2,'0')}</span></div>
 <div className="demo-controls"><button className="demo-play" onClick={()=>{if(last)step(0);play(!playing)}}>{playing?<Pause size={14}/>:<Play size={14}/>} {playing?'Pause':'Play trace'}</button><button aria-label="Next demo step" disabled={last} onClick={()=>{play(false);step(i+1)}}><SkipForward size={15}/></button><button aria-label="Restart demo" onClick={()=>{step(0);play(false)}}><RotateCcw size={14}/></button><span aria-live="polite">{values[f.mid]===target?'Target found':'Probe index '+f.mid}</span></div></div></section>;
}
