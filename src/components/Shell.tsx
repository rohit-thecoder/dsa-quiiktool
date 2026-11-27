'use client';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import {House,BookOpen,Activity,ListChecks,Gamepad2,BriefcaseBusiness,Route,NotebookTabs,ChartNoAxesCombined,Settings,Search,Sun,Moon,Menu,X,ExternalLink,PanelLeft,CalendarDays,Layers3,ChevronRight,Flame} from 'lucide-react';
import Brand from './Brand';
import {useProgress,updateProgress} from '@/hooks/useProgress';
import {streak} from '@/lib/persistence/progress';
import {pretty,type Entry} from '@/lib/seo/internalLinks';
const nav = [
 [['Home','/',House],['Learn DSA','/learn',BookOpen],['Visualizers','/visualizers',Activity],['Problem sheet','/problems',ListChecks],['DSA games','/games',Gamepad2]],
 [['Interview prep','/interview-prep',BriefcaseBusiness],['Roadmap','/roadmap',Route],['Cheat sheets','/cheat-sheets',NotebookTabs],['Daily challenge','/daily-challenge',CalendarDays]],
 [['My progress','/progress',ChartNoAxesCombined],['Revision','/revision',Layers3],['Settings','/settings',Settings]]
] as const;
export default function Shell({children}:{children:React.ReactNode}){
 const path=usePathname(), p=useProgress(),[menu,setMenu]=useState(false),[term,search]=useState(''),[index,setIndex]=useState<Entry[]>([]),[searchError,setError]=useState(false);
 const dlg=useRef<HTMLDialogElement>(null), trigger=useRef<HTMLButtonElement>(null), side=useRef<HTMLElement>(null);
 const close=()=>{dlg.current?.close();trigger.current?.focus();};
 const open=()=>{if(!dlg.current?.open)dlg.current?.showModal();search('');if(!index.length){setError(false);fetch('/search-index.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(setIndex).catch(()=>setError(true));}};
 useEffect(()=>{const fn=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.querySelector<HTMLButtonElement>('#global-search')?.click();}if(e.key==='Escape')setMenu(false);};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[]);
 useEffect(()=>{document.documentElement.dataset.theme=p.theme;document.documentElement.dataset.motion=p.reduced?'reduce':'auto';},[p.theme,p.reduced]);
 useEffect(()=>{if(menu)side.current?.querySelector<HTMLButtonElement>('button')?.focus();},[menu]);
 const words=term.toLowerCase().trim().split(/\s+/).filter(Boolean);
 const hits=index.filter(x=>words.every(w=>(x.title+' '+x.group+' '+x.summary+' '+(x.keywords||'')).toLowerCase().includes(w))).sort((a,b)=>Number(b.title.toLowerCase().includes(term.toLowerCase()))-Number(a.title.toLowerCase().includes(term.toLowerCase()))).slice(0,30);
 const page=path==='/'?'Home':pretty(path.split('/').filter(Boolean).at(-1)||'Home');
 return <><a className="skip" href="#main">Skip to content</a>{menu&&<button className="shade" aria-label="Close navigation" onClick={()=>setMenu(false)}/>}
 <aside ref={side} className={'sidebar '+(menu?'shown':'')}><div className="brand-line"><a href="/" aria-label="QuiikTool DSA home"><Brand/></a><button className="icon mobile" onClick={()=>setMenu(false)} aria-label="Close navigation"><X/></button></div>
 <nav>{nav.map((group,n)=><div className="nav-group" key={n}><p>{['WORKSPACE','PREPARATION','PERSONAL'][n]}</p>{group.map(([label,href,Icon])=>{const active=path===href||(href!=='/'&&path.startsWith(href+'/'))||(href==='/problems'&&path.startsWith('/problem/'))||(href==='/learn'&&/^\/(topics|patterns)(\/|$)/.test(path));return <a key={href} aria-current={active?'page':undefined} className={active?'active':''} href={href}><Icon size={18}/>{label}</a>})}</div>)}</nav>
 <a className="parent-site" href="https://quiiktool.com"><span className="parent-icon">Q</span> QuiikTool.com <ExternalLink size={14}/></a></aside>
 <div className="shell-body"><header className="topbar"><button className="icon mobile" onClick={()=>setMenu(true)} aria-label="Open navigation"><Menu/></button><span className="crumb"><PanelLeft size={16}/> Workspace <ChevronRight size={13}/> <b>{page}</b></span><div className="header-tools"><button ref={trigger} className="search-btn" id="global-search" onClick={open}><Search size={16}/><span>Search the lab</span><kbd>⌘ K</kbd></button><button className="icon" aria-label={'Switch to '+(p.theme==='dark'?'light':'dark')+' theme'} onClick={()=>updateProgress(v=>({...v,theme:v.theme==='dark'?'light':'dark'}))}>{p.theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button><a className="streak" href="/progress" title="Study streak"><Flame size={16}/>{streak(p)}<span>d</span></a></div></header>
 <main id="main" className="main">{children}</main><footer><Brand/><div>{[['About','about'],['Contact','contact'],['Privacy','privacy-policy'],['Terms','terms'],['Disclaimer','disclaimer']].map(([l,s])=><a href={'/'+s} key={s}>{l}</a>)}</div></footer></div>
 <dialog ref={dlg} aria-label="Search the lab" onClick={e=>{if(e.target===dlg.current)close()}}><div className="search-box"><div className="row"><Search size={20}/><input autoFocus aria-label="Search topics, algorithms and games" placeholder="Search topics, algorithms, games…" value={term} onChange={e=>search(e.target.value)}/><button onClick={close} aria-label="Close search"><X size={18}/></button></div><div className="hits">{searchError?<p>Search could not load. Close and reopen it to retry.</p>:!index.length?<p>Loading search…</p>:hits.length?hits.map(h=><a key={h.href} href={h.href}><strong>{h.title}</strong><small>{h.group}</small></a>):<p>No matches. Try a topic or an algorithm name.</p>}</div></div></dialog></>;
}
