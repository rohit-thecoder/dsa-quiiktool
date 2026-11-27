'use client'
import {useState,useEffect} from 'react'
import {workedTraces} from '@/engines/algorithms/generated/worked-traces'
export default function WorkedExample({slug}:{slug:string}){
const trace=workedTraces.find(t=>t.slug===slug)!
const [i,I]=useState(0),[play,P]=useState(false),[speed,S]=useState(700)
const last=i===trace.frames.length
useEffect(()=>{if(!play||last)return;const id=setTimeout(()=>I(v=>v+1),speed);return()=>clearTimeout(id)},[play,last,i,speed])
const f=trace.frames[Math.min(i,trace.frames.length-1)]
return <section className="premium-lab"><h2>Worked example</h2><p>Replay a computed execution on a reference input. This lab currently supports a fixed example.</p><pre>{JSON.stringify(trace.input,null,2)}</pre><div className="actions"><button onClick={()=>{P(false);I(0)}}>Reset</button><button disabled={!i} onClick={()=>{P(false);I(i-1)}}>Previous</button><button disabled={last} onClick={()=>P(!play)}>{play&&!last?'Pause':'Play'}</button><button disabled={last} onClick={()=>{P(false);I(i+1)}}>Next step</button><select aria-label="Playback speed" value={speed} onChange={e=>S(+e.target.value)}><option value={1200}>Slow</option><option value={700}>Normal</option><option value={250}>Fast</option></select></div><input type="range" aria-label="Step" min={0} max={trace.frames.length} value={i} onChange={e=>{P(false);I(+e.target.value)}}/><p role="status">{last?'Complete':f.label} · {i+1}/{trace.frames.length+1}</p>{Object.entries(f.boards).map(([key,value])=><section key={key}><h3>{key}</h3><div className="premium-cells">{(value as unknown[]).map((v,j)=><div className={'premium-cell '+(key==='Array'&&f.active.includes(j)?'active':'')} key={j}><strong>{v===null?'—':Array.isArray(v)?v.join(' | '):String(v)}</strong><small>{j}</small></div>)}</div></section>)}{last&&<div className="premium-banner"><h3>Computed result</h3><pre>{JSON.stringify(trace.result)}</pre></div>}<a className="btn" href="/visualizers">Back to visualizer library</a></section>
}
