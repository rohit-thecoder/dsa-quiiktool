'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { activeDate, bestWindow, detectiveCases, modes, probes } from '../../data/activities';
import './practice.css';

type Finish = (correct:boolean)=>void;
type ChallengeProps = {seed:number; finish:Finish};
interface Props {mode?:string; daily?:boolean; onComplete?:(correct:boolean,id:string)=>void}

function Values({values,active=[]}:{values:number[];active?:number[]}) {
  return <ol className="practice-values" aria-label="Input positions">{values.map((v,i)=>
    <li key={i} className={active.includes(i)?'chosen':''}><span>{v}</span><small>{active.includes(i)?'probe ':''}{i}</small></li>)}</ol>;
}
function Answers({options,correct,explain,finish}:{options:string[];correct:number;explain:string;finish:Finish}) {
  const [answer,setAnswer]=useState<number|null>(null);
  return <><div className="practice-choices">{options.map((s,i)=>
    <button type="button" key={s} aria-pressed={i===answer} onClick={()=>{setAnswer(i);finish(i===correct);}}>{s}</button>)}</div>
    {answer!==null && <p role="status" className="practice-feedback"><strong>{answer===correct?'Correct. ':'Try again. '}</strong>{answer===correct?explain:'Use the condition in the question to eliminate one option.'}</p>}</>;
}
function Predict({seed,finish}:ChallengeProps) {
  const lo=0, hi=6, mid=3,offset=(seed%6)*2;
  const values=[2,5,7,11,14,19,23].map(n=>n+offset);
  const targetIndex=[5,1,3,6,2][seed%5], target=values[targetIndex];
  const correct=targetIndex<mid?0:targetIndex>mid?1:2;
  return <><p>Find <b>{target}</b> in the sorted array. The current midpoint is index {mid}.</p><Values values={values} active={[mid]}/>
    <p>Which action should the search take now?</p><Answers options={[`Keep [${lo}, ${mid-1}]`,`Keep [${mid+1}, ${hi}]`,`Return index ${mid}`]} correct={correct}
      explain={correct===0?`The midpoint value ${values[mid]} is too large. All larger indices can go too.`:correct===1?`The midpoint value ${values[mid]} is too small. All smaller indices can go too.`:'The probe exactly matches the target.'} finish={finish}/></>;
}
function Bug({seed,finish}:ChallengeProps) {
  const a=Array.from({length:3+seed%4},(_,i)=>2+i*3),target=a[a.length-1];
  const [variant,setVariant]=useState<'buggy'|'binary'>('buggy'),[tried,setTried]=useState(false);
  const {visited,found}=probes(a,target,variant);
  return <><p>A closed-interval search loses the final candidate. Find <b>{target}</b> and inspect its recorded probes.</p>
    <pre>{`lo, hi = 0, len(a) - 1\nwhile lo ${variant==='buggy'?'<':'<='} hi:\n    mid = (lo + hi) // 2\n    if a[mid] == target: return mid\n    if a[mid] < target: lo = mid + 1\n    else: hi = mid - 1\nreturn -1`}</pre>
    <Values values={a} active={visited}/><p>Probe order: {visited.join(' → ')}. Returned {found}.</p>
    <label>Loop condition <select value={variant} onChange={e=>{setVariant(e.target.value as typeof variant);setTried(false);}}>
      <option value="buggy">lo &lt; hi</option><option value="binary">lo ≤ hi</option></select></label>{' '}
    <button type="button" onClick={()=>{setTried(true);finish(found===a.length-1);}}>Check correction</button>
    {tried && <p role="status">{found>=0?'The corrected loop checks the single remaining position.':'The last position was never probed. A closed interval with equal endpoints still has one candidate.'}</p>}</>;
}
function Race({seed,finish}:ChallengeProps) {
  const [size,setSize]=useState([16,32,64][seed%3]),[targetPos,setTargetPos]=useState('last'),[report,setReport]=useState(false);
  const values=Array.from({length:size},(_,i)=>2*i+1);
  const target=targetPos==='first'?values[0]:targetPos==='middle'?values[(size>>1)-1]:targetPos==='absent'?2*size:values[size-1];
  const linear=probes(values,target,'linear'),binary=probes(values,target,'binary');
  return <><p>Run both algorithms on the same sorted sequence of odd numbers. Each visit to an array index counts as one probe.</p>
    <div className="practice-controls"><label>Items <select value={size} onChange={e=>{setSize(+e.target.value);setReport(false);}}>{[8,16,32,64,128,256].map(n=><option key={n}>{n}</option>)}</select></label>
    <label>Target <select value={targetPos} onChange={e=>{setTargetPos(e.target.value);setReport(false);}}>{['first','middle','last','absent'].map(t=><option key={t}>{t}</option>)}</select></label>
    <button type="button" onClick={()=>setReport(true)}>Run comparison</button></div>
    {report && <><div className="practice-races">{[['Linear search',linear,'O(n)'],['Binary search',binary,'O(log n)']].map(row=>{
      const [name,result,bound]=row as [string,typeof linear,string];
      return <div key={name}><strong>{name}</strong><progress max={size} value={result.visited.length} aria-label={name+' probes'}/><p>{result.visited.length} probes · worst-case {bound}</p>
      <small>First probes: {result.visited.slice(0,6).join(', ')}{result.visited.length>6?'…':''}. Result: {result.found}.</small></div>;
    })}</div><p>Which method used fewer probes for this input?</p><Answers options={['Linear search','Binary search','Same count']} correct={linear.visited.length===binary.visited.length?2:linear.visited.length<binary.visited.length?0:1}
     explain={'Observed counts were '+linear.visited.length+' and '+binary.visited.length+'. Input position affects a single run; worst-case growth describes a family of runs.'} finish={finish}/></>}</>;
}
function Detective({seed,finish}:ChallengeProps) {
  const c=detectiveCases[seed%detectiveCases.length];
  return <><p>{c.prompt}</p><Answers options={c.choices} correct={c.answer} explain={c.why} finish={finish}/></>;
}
const instructions=['Save next = current.next','Set current.next = previous','Move previous to current','Advance current to next'];
function reverseExperiment(order:number[],count:number) {
  const links:(number|null)[]=Array.from({length:count},(_,i)=>i===count-1?null:i+1);
  let current:number|null=0, previous:number|null=null;
  const name=(n:number|null|undefined)=>n==null?'∅':String.fromCharCode(65+n);
  const log:string[]=[];
  for(let round=0;current!==null && round<count+1;round++) {
    let next:number|null|undefined=undefined;
    for(const op of order) {
      if((op===0 || op===1) && current===null) return {log,error:'current is empty before a link access.'};
      if(op===0) {next=links[current!];log.push('Save successor '+name(next));}
      if(op===1) {links[current!]=previous;log.push(name(current)+' now points to '+name(previous));}
      if(op===2) {previous=current;log.push('Previous becomes '+name(previous));}
      if(op===3) {if(next===undefined) return {log,error:'The saved successor was read before it was assigned.'};current=next;log.push('Current advances to '+name(current));}
    }
  }
  const success=current===null && previous===count-1 && links.every((v,i)=>v===(i===0?null:i-1));
  return {log,error:success?'':'The links or the returned head do not match the reversed chain.'};
}
function Reconstruct({seed,finish}:ChallengeProps) {
  const count=3+seed%3;
  const [order,setOrder]=useState([2,0,3,1]),[run,setRun]=useState<ReturnType<typeof reverseExperiment>|null>(null),[step,setStep]=useState(0);
  useEffect(()=>{if(!run||step>=run.log.length)return;const t=setTimeout(()=>setStep(step+1),340);return ()=>clearTimeout(t);},[step,run]);
  function move(i:number,j:number){const a=[...order];[a[i],a[j]]=[a[j],a[i]];setOrder(a);setRun(null);setStep(0);}
  return <><p>Reverse {Array.from({length:count},(_,i)=>String.fromCharCode(65+i)).join(' → ')}. At the start, previous is empty and current points to A. Reorder the loop body.</p>
    <ol className="practice-order">{order.map((op,i)=><li key={op}><span>{instructions[op]}</span><button aria-label={'Move '+instructions[op]+' earlier'} disabled={i===0} onClick={()=>move(i,i-1)}>Up</button>
      <button aria-label={'Move '+instructions[op]+' later'} disabled={i===order.length-1} onClick={()=>move(i,i+1)}>Down</button></li>)}</ol>
    <button onClick={()=>{const next=reverseExperiment(order,count);setRun(next);setStep(0);finish(!next.error);}}>Run this order</button>
    {run && <div className="practice-feedback"><p role="status">{step===run.log.length?(run.error||'Chain reversed. Each successor survived until it was needed.'):'Tracing the submitted order…'}</p>
      <small>{run.log.slice(0,step).join(' · ')}</small></div>}</>;
}
function Edge({seed,finish}:ChallengeProps) {
  const [text,setText]=useState(seed%2?'2, -1, 3':'1, 2, 3'),[width,setWidth]=useState(2),[message,setMessage]=useState('');
  function submit() {
    const tokens=text.split(',').map(v=>v.trim()),a=tokens.map(Number);
    if(tokens.some(x=>!/^[-+]?\d+$/.test(x))||a.length>12||a.some(x=>Math.abs(x)>100)||!Number.isInteger(width)||width<1||width>a.length) {
      setMessage('Use 1–12 comma-separated integers from −100 to 100 and a width that fits the sequence.');return;
    }
    const flawed=bestWindow(a,width,true),correct=bestWindow(a,width,false);
    setMessage(`Window sums: ${correct.sums.join(', ')}. Faulty result: ${flawed.best}. Correct result: ${correct.best}. ${correct.best===flawed.best?'They agree. Can every complete window have a negative total?':'Counterexample found. Initializing the best to a real window fixes the invented zero.'}`);
    finish(correct.best!==flawed.best);
  }
  return <><p>A program starts its best fixed-width sum at zero. Construct an input where that choice produces an impossible answer.</p>
    <label>Array <input type="text" maxLength={70} value={text} onChange={e=>setText(e.target.value)}/></label>{' '}
    <label>Width <input type="number" min={1} max={12} value={width} onChange={e=>setWidth(Number(e.target.value))}/></label>{' '}
    <button onClick={submit}>Test input</button>{message && <p className="practice-feedback" role="status">{message}</p>}</>;
}
const panels=[Predict,Bug,Race,Detective,Reconstruct,Edge];
export default function ActiveLab({mode,daily=false,onComplete}:Props) {
  const [selected,choose]=useState(modes.some(m=>m.slug===mode)?mode!:modes[0].slug);
  const [round,setRound]=useState(0),[today,setToday]=useState<ReturnType<typeof activeDate>|null>(null);
  useEffect(()=>{if(daily)setToday(activeDate(new Date()));},[daily]);
  const dailyIndex=today ? today.ordinal%7 : 0;
  const index=daily?dailyIndex:modes.findIndex(m=>m.slug===selected);
  if(daily&&!today)return <section className="practice-panel" aria-busy="true">Preparing today’s exercise…</section>;
  if(index===6)return <section className="practice-panel"><h2>Today’s game challenge</h2><p>Find the hidden treasure using midpoint probes. After a failed probe, explain which half of the sorted path you can discard.</p><Link href="/games/binary-search-treasure-hunt">Play Binary Search Treasure Hunt</Link></section>;
  const item=modes[index],Panel=panels[index],seed=daily&&today?Math.floor(today.ordinal/7):round;
  const id=(daily?'daily-'+today?.key:'activity-'+seed)+'-'+item.slug;
  return <section className="practice-panel">
    {!daily && <label>Practice mode <select value={selected} onChange={e=>{choose(e.target.value);setRound(0);}}>{modes.map(m=><option key={m.slug} value={m.slug}>{m.title}</option>)}</select></label>}
    <h2>{item.title}</h2><p>{item.summary}</p>
    <Panel key={id} seed={seed} finish={correct=>onComplete?.(correct,id)}/>
    {!daily && <button type="button" className="practice-next" onClick={()=>setRound(round+1)}>New exercise</button>}
  </section>;
}
