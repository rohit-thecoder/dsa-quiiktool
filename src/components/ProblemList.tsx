'use client';
import {useState} from 'react';
import {Search,Bookmark,ChevronRight,Activity,Check} from 'lucide-react';
import {useProgress} from '@/hooks/useProgress';
import {day} from '@/lib/persistence/progress';
import {pretty} from '@/lib/seo/internalLinks';
export type Listing={slug:string;title:string;description:string;topicId:string;difficulty:string;patternIds:string[]};
export default function ProblemList({items,visual=false}:{items:Listing[];visual?:boolean}){
 const p=useProgress(),[q,query]=useState(''),[topic,setTopic]=useState(''),[diff,setDiff]=useState(''),[status,setStatus]=useState(''),[pattern,setPattern]=useState('');
 const filtered=items.filter(a=>{const done=p.achievements['problem/'+a.slug],started=p.started[a.slug];return (!topic||topic===a.topicId)&&(!diff||diff===a.difficulty)&&(!pattern||a.patternIds.includes(pattern))&&(a.title+' '+a.topicId+' '+a.description).toLowerCase().includes(q.toLowerCase())&&(!status|| (status==='Bookmarked'?p.bookmarks.includes(a.slug):status==='Completed'?done:status==='In progress'?started&&!done:status==='Needs revision'?p.reviews[a.slug]?.due<=day():!started&&!done));});
 return <><div className="filters"><label className="filter-search"><Search size={17}/><input aria-label="Find a problem" placeholder="Find an algorithm…" value={q} onChange={e=>query(e.target.value)}/></label>{[
 ['Topic',topic,setTopic,[...new Set(items.map(a=>a.topicId))]],['Pattern',pattern,setPattern,[...new Set(items.flatMap(a=>a.patternIds))]],['Difficulty',diff,setDiff,['easy','medium','hard']],['Status',status,setStatus,['Not started','In progress','Completed','Bookmarked','Needs revision']]
 ].map(([label,val,set,opts])=><select aria-label={String(label)} key={String(label)} value={String(val)} onChange={e=>(set as (s:string)=>void)(e.target.value)}><option value="">All {String(label).toLowerCase()}{label==='Difficulty'?' levels':label==='Status'?'es':'s'}</option>{(opts as string[]).map(o=><option key={o} value={o}>{pretty(o)}</option>)}</select>)}</div><p className="muted">{filtered.length} {visual?'visualizers':'problems'}</p><div className="linklist">{filtered.map(a=><a href={'/'+(visual?'visualizers':'problem')+'/'+a.slug} key={a.slug}><Activity/><span><b>{a.title}</b><small>{pretty(a.topicId)} · {a.patternIds.map(pretty).join(', ')}</small></span>{p.bookmarks.includes(a.slug)&&<Bookmark size={14}/>} {p.achievements['problem/'+a.slug]&&<Check size={14}/>}<em>{a.difficulty}</em><ChevronRight size={16}/></a>)}{!filtered.length&&<p>Try a different search or clear a filter.</p>}</div></>;
}
