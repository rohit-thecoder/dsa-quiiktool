'use client';
import {useEffect} from 'react';
import {Bookmark,Check,BookOpen} from 'lucide-react';
import {useProgress,updateProgress} from '@/hooks/useProgress';
import {award,day} from '@/lib/persistence/progress';
export function Remember({slug}:{slug:string}){useEffect(()=>{updateProgress(p=>p.last===slug&&p.started[slug]?p:{...p,last:slug,started:{...p.started,[slug]:p.started[slug]||day()}});},[slug]);return null;}
export function Mark({id,label='Mark as complete',disabled=false}:{id:string;label?:string;disabled?:boolean}){const p=useProgress(),done=!!p.achievements[id];return <button disabled={done||disabled} className="btn primary" onClick={()=>updateProgress(v=>award(v,id))}><Check size={16}/>{done?'Completed':label}</button>}
export function Save({slug}:{slug:string}){const p=useProgress(),saved=p.bookmarks.includes(slug);return <button className="btn" aria-pressed={saved} onClick={()=>updateProgress(v=>({...v,bookmarks:saved?v.bookmarks.filter(s=>s!==slug):[...v.bookmarks,slug]}))}><Bookmark size={16}/>{saved?'Bookmarked':'Bookmark'}</button>}
export function Analogy({en,hi}:{en:string;hi:string}){const p=useProgress();return <p>{p.hinglish?hi:en}</p>}
export function Continue({items}:{items:{slug:string;title:string}[]}){const p=useProgress(),item=items.find(x=>x.slug===p.last);return item?<div className="resume row spread"><span><BookOpen size={18}/> Continue learning <b>{item.title}</b></span><a href={'/problem/'+item.slug}>Resume lesson</a></div>:null;}

