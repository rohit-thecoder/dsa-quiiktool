import {BookOpen,Activity,Gamepad2,ListChecks,ChevronRight,Layers3,Route,BriefcaseBusiness,GraduationCap,CalendarDays} from 'lucide-react';
import {labs} from '@/data/visual-labs';
import HeroDemo from './HeroDemo';
import Art from './Art';
import {Continue} from './StudyActions';
import {topics} from '@/data/curriculum';
import {problems} from '@/engines/algorithms';
import {games} from '@/engines/games';
import BannerAd from './ads/BannerAd';
import AdProvider from './ads/AdProvider';
import {safeJson} from '@/lib/seo/structuredData';
import {origin} from '@/lib/seo/metadata';
export function ShelfTitle({name,href,label}:{name:string;href?:string;label?:string}){return <div className="shelf-title"><h2>{name}</h2>{href&&<a href={href}>{label||'View all'} <ChevronRight size={15}/></a>}</div>}
export function Tile({title,summary,href,kind,category}:{title:string;summary:string;href:string;kind:number;category?:string}){return <a className="tile" href={href}><Art kind={kind}/><div>{category&&<small>{category}</small>}<h3>{title}</h3><p>{summary}</p></div></a>}
export const faqs=[['Can I use my own input?','Yes. Open a problem, enter values and a target where applicable, then generate a fresh trace. The workspace checks the input before running the algorithm.'],['Where is my progress saved?','Your browser stores your learning record on this device. Export a backup in Settings to move your progress to another browser.'],['Which languages can I study?','The code inspector includes C++, Java and Python. A trusted TypeScript runner produces the execution frames you see.']];
export default function Overview(){
 const selected=['arrays-and-hashing','trees','linked-lists'].map(id=>topics.find(t=>t.slug===id)!).filter(Boolean);
 return <><AdProvider/><section className="hero"><div className="hero-copy"><span className="eyebrow"><span className="eyeline"/> INTERACTIVE DSA LAB</span><h1>Don’t just<br/>memorize DSA.<br/><em>See it. Play it.<br className="hero-break"/> Master it.</em></h1><p>Learn data structures and algorithms through visual experiments, hands-on games and guided interview practice.</p><div className="actions"><a className="btn primary" href="/learn"><BookOpen size={17}/> Start Learning DSA</a><a className="btn" href="/games"><Gamepad2 size={17}/> Play DSA Games</a></div></div><HeroDemo/></section>
 <div className="stats">{[[Layers3,topics.length,'DSA topics','/topics'],[ListChecks,problems.length,'Interactive problems','/problems'],[Activity,problems.length+labs.length,'Visualizers','/visualizers'],[Gamepad2,games.length,'Playable games','/games']].map(([I,n,s,h])=>{const Icon=I as typeof Layers3;return <a href={String(h)} key={String(s)}><span className="stat-icon"><Icon size={20}/></span><span><b>{String(n)}</b><small>{String(s)}</small></span></a>})}</div>
 <Continue items={problems.map(({slug,title})=>({slug,title}))}/><ShelfTitle name="Explore DSA topics" href="/topics" label="All topics"/><div className="tiles">{selected.map((t,i)=><Tile key={t.slug} title={t.title} href={'/topics/'+t.slug} summary={t.summary} kind={i} category="Topic lab"/>)}</div>
 <ShelfTitle name="Popular visualizers" href="/visualizers"/><div className="linklist">{['binary-search','merge-sort','reverse-linked-list'].map(id=>problems.find(p=>p.slug===id)).filter(p=>!!p).map(p=><a key={p.slug} href={'/visualizers/'+p.slug}><Activity size={20}/><span><b>{p.title}</b><small>{p.description}</small></span><ChevronRight size={16}/></a>)}</div><BannerAd/>
 <ShelfTitle name="Learn by playing" href="/games"/><div className="tiles">{[...games.slice(-3),...games.slice(0,3)].map((g,i)=><Tile key={g.slug} title={g.title} href={'/games/'+g.slug} summary={g.description} kind={i+3} category="DSA arcade"/>)}</div>
 <ShelfTitle name="Plan your practice"/><div className="tiles plain">{[[Route,'Learning roadmap','Set a daily workload and follow a 30, 60 or 90-day plan.','/roadmap'],[CalendarDays,'Today’s visual challenge','Make a prediction, test it, and explain your reasoning.','/daily-challenge'],[GraduationCap,'College and viva prep','Rehearse a lab practical or print revision notes.','/college-prep'],[BriefcaseBusiness,'Interview preparation','Practice a timed explanation and check your reasoning.','/interview-prep']].map(([I,t,d,h])=>{const Icon=I as typeof Route;return <a href={String(h)} key={String(t)}><Icon/><h3>{String(t)}</h3><p>{String(d)}</p></a>})}</div>
 <ShelfTitle name="Interview problems" href="/problems"/><div className="chips">{['two-sum','binary-search','reverse-linked-list'].map(s=>problems.find(p=>p.slug===s)).filter(p=>!!p).map(p=><a key={p.slug} href={'/problem/'+p.slug}>{p.title}</a>)}</div>
 <ShelfTitle name="How it works"/><p className="lede">Start with a topic, predict one step in the visualizer and test a different input. Complete the trace to add the problem to your revision queue.</p><ShelfTitle name="Frequently asked questions"/>{faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJson([{'@context':'https://schema.org','@type':'WebSite',name:'QuiikTool DSA',url:origin},{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))}])}}/></>;
}
