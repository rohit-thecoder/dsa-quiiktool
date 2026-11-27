import {topics,patterns,cheatSheets} from '@/data/curriculum';
import {problems} from '@/engines/algorithms';
import {games} from '@/engines/games';
import {sections,privateSections,type Entry} from '@/lib/seo/internalLinks';
export const entries:Entry[]=[
 ...Object.entries(sections).map(([slug,[title,summary]])=>({title,summary,href:'/'+slug,group:'Workspace'})),
 ...topics.map(t=>({title:t.title,summary:t.summary,href:'/topics/'+t.slug,group:'Topic',keywords:[...t.subtopics,t.slug==='stacks-and-queues'?'LIFO FIFO':''].join(' ')})),
 ...patterns.map(t=>({title:t.title,summary:t.summary,href:'/patterns/'+t.slug,group:'Pattern',keywords:t.signal})),
 ...problems.flatMap(p=>[{title:p.title,summary:p.description,href:'/problem/'+p.slug,group:'Problem',keywords:[p.topicId,...p.patternIds].join(' ')},{title:p.title+' visualizer',summary:p.description,href:'/visualizers/'+p.slug,group:'Visualizer'}]),
 ...games.map(t=>({title:t.title,summary:t.description,href:'/games/'+t.slug,group:'Game',keywords:t.topicId+(t.slug.includes('stack')?' LIFO':'')})),
 ...cheatSheets.map(t=>({title:t.title,summary:t.summary,href:'/cheat-sheets/'+t.slug,group:'Cheat sheet'}))];
export const publicEntries=entries.filter(e=>!privateSections.includes(e.href.slice(1)));

