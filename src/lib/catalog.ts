import {topics,patterns,cheatSheets} from '@/data/curriculum';
import {problems} from '@/engines/algorithms';
import {games} from '@/engines/games';
import {sections,privateSections,type Entry} from '@/lib/seo/internalLinks';
import {labs} from '@/data/visual-labs';
import {workedExamples} from '@/data/worked-examples';
import {studyGroups,questionSlug,existingAliases} from '@/data/study-groups';
const locationBySlug=new Map(studyGroups.flatMap(g=>g.titles.map(t=>[existingAliases[questionSlug(t)]??questionSlug(t),{topic:g.topic,subtopic:g.subtopic}] as const)));
export const visualizerLocation=(slug:string)=>locationBySlug.get(slug);
const rawEntries:Entry[]=[
 ...Object.entries(sections).map(([slug,[title,summary]])=>({title,summary,href:'/'+slug,group:'Workspace'})),
 ...topics.map(t=>({title:t.title,summary:t.summary,href:'/topics/'+t.slug,group:'Topic',keywords:[...t.subtopics,t.slug==='stacks-and-queues'?'LIFO FIFO':''].join(' ')})),
 ...patterns.map(t=>({title:t.title,summary:t.summary,href:'/patterns/'+t.slug,group:'Pattern',keywords:t.signal})),
 ...problems.flatMap(p=>[{title:p.title,summary:p.description,href:'/problem/'+p.slug,group:'Problem',keywords:[p.topicId,...p.patternIds].join(' ')},{title:p.title+' visualizer',summary:p.description,href:'/visualizers/'+p.slug,group:'Visualizer'}]),
 ...workedExamples.map(x=>({title:x.title+' visualizer',summary:workedSummary(x.slug,x.title,x.topicId),href:'/visualizers/'+x.slug,group:'Visualizer',keywords:x.topicId})),
 ...labs.map(l=>({title:l.title+' visualizer',summary:l.summary,href:'/visualizers/'+l.slug,group:'Visualizer',keywords:l.topicId})),
 ...games.map(t=>({title:t.title,summary:t.description,href:'/games/'+t.slug,group:'Game',keywords:t.topicId+(t.slug.includes('stack')?' LIFO':'')})),
 ...cheatSheets.map(t=>({title:t.title,summary:t.summary,href:'/cheat-sheets/'+t.slug,group:'Cheat sheet'}))];
function workedSummary(slug:string,title:string,topicId:string){const g=visualizerLocation(slug);const topic=g?.topic??topicId.replace(/-/g,' ');const pattern=g?.subtopic;return 'Learn '+title+' with a step-by-step '+topic+' visualizer, JavaScript source code and a worked example. '+(pattern?'Practice '+pattern.toLowerCase()+'.':'Inspect algorithm state and predict the next step.');}
export const entries=Array.from(new Map(rawEntries.map(e=>[e.href,e])).values());
export const publicEntries=entries.filter(e=>!privateSections.includes(e.href.slice(1)));
export const canonicalPath=(path:string)=>path.startsWith('/problem/')&&entries.some(e=>e.href===path.replace('/problem/','/visualizers/'))?path.replace('/problem/','/visualizers/'):path;
export const indexableEntries=publicEntries.filter(e=>canonicalPath(e.href)===e.href);
export function relatedVisualizers(slug:string){const g=visualizerLocation(slug);if(!g)return [];const matches=studyGroups.filter(x=>x.topic===g.topic).sort((a,b)=>Number(b.subtopic===g.subtopic)-Number(a.subtopic===g.subtopic)).flatMap(x=>x.titles.map(t=>existingAliases[questionSlug(t)]??questionSlug(t)));return [...new Set(matches)].filter(x=>x!==slug).map(x=>entries.find(e=>e.href==='/visualizers/'+x)).filter((x):x is Entry=>!!x).slice(0,6);}

