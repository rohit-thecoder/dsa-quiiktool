'use client'
import {useState,useEffect} from 'react'
import {workedTraces} from '@/engines/algorithms/generated/worked-traces'

function display(v:unknown):string {return v===null?'—':Array.isArray(v)?v.map(display).join(' · '):typeof v==='object'?JSON.stringify(v):String(v)}
function Graph({edges,current}:{edges:unknown[][];current:unknown[]}) {
 const valid=edges.filter(r=>r.length>=2&&r[0]!=null&&r[1]!=null)
 const ids=[...new Set(valid.flatMap(r=>[String(r[0]),String(r[1])]))]
 if(!ids.length||ids.length>24)return null
 const points=new Map(ids.map((v,i)=>[v,[150+110*Math.cos(2*Math.PI*i/ids.length-Math.PI/2),135+100*Math.sin(2*Math.PI*i/ids.length-Math.PI/2)]]))
 return <svg viewBox="0 0 300 270" className="worked-graph" role="img" aria-label="Graph state">{valid.map((r,i)=>{const [x,y]=points.get(String(r[0]))!,[u,v]=points.get(String(r[1]))!;return <g key={i}><line x1={x} y1={y} x2={u} y2={v} stroke="#8995aa" strokeWidth="1.5"/>{r.length>2&&<text x={(x+u)/2} y={(y+v)/2} fill="currentColor" fontSize="10">{display(r[2])}</text>}</g>})}{ids.map(id=>{const [x,y]=points.get(id)!;return <g key={id}><circle cx={x} cy={y} r="15" fill={current.map(String).includes(id)?'#2563eb':'#334155'}/><text x={x} y={y+4} textAnchor="middle" fill="white" fontSize="11">{id}</text></g>})}</svg>
}
export default function WorkedExample({slug}:{slug:string}){
const trace=workedTraces.find(t=>t.slug===slug)!
const [i,I]=useState(0),[play,P]=useState(false),[speed,S]=useState(700)
const last=i===trace.frames.length
useEffect(()=>{if(!play||last)return;const id=setTimeout(()=>I(v=>v+1),speed);return()=>clearTimeout(id)},[play,last,i,speed])
const f=trace.frames[Math.min(i,trace.frames.length-1)]
return <section className="premium-lab"><h2>Worked example</h2><p>Replay a computed execution on a reference input. This lab currently supports a fixed example.</p><details><summary>Reference input</summary><pre>{JSON.stringify(trace.input,null,2)}</pre></details><div className="actions"><button onClick={()=>{P(false);I(0)}}>Reset</button><button disabled={!i} onClick={()=>{P(false);I(i-1)}}>Previous</button><button disabled={last} onClick={()=>P(!play)}>{play&&!last?'Pause':'Play'}</button><button disabled={last} onClick={()=>{P(false);I(i+1)}}>Next step</button><select aria-label="Playback speed" value={speed} onChange={e=>S(+e.target.value)}><option value={1200}>Slow</option><option value={700}>Normal</option><option value={250}>Fast</option></select></div><input type="range" aria-label="Step" min={0} max={trace.frames.length} value={i} onChange={e=>{P(false);I(+e.target.value)}}/><p role="status" aria-live="polite">{last?'Complete':f.label} · {i+1}/{trace.frames.length+1}</p>{Array.isArray(f.boards.Edges)&&f.boards.Edges.every(Array.isArray)&&<Graph edges={f.boards.Edges as unknown[][]} current={f.boards.Current??[]}/>}
{Object.entries(f.boards).map(([key,value])=>{const matrix=value.length>0&&value.every(Array.isArray);const cell=f.boards.Cell??[];return <section key={key}><h3>{key}</h3>{matrix?<div className="worked-table-scroll"><table className="worked-table"><tbody>{(value as unknown[][]).map((r,j)=><tr key={j}>{r.map((v,k)=><td className={cell[0]===j&&cell[1]===k?'worked-active':''} key={k}>{display(v)}</td>)}</tr>)}</tbody></table></div>:<div className="premium-cells">{value.map((v,j)=><div className={'premium-cell '+(key==='Array'&&f.active.includes(j)?'active':'')} key={j}><strong>{display(v)}</strong><small>{j}</small></div>)}</div>}</section>})}{last&&<div className="premium-banner"><h3>Computed result</h3><pre>{JSON.stringify(trace.result)}</pre></div>}<a className="btn" href="/visualizers">Back to visualizer library</a></section>
}
