import {z} from 'zod';
const id = z.string().min(1).max(180);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const dates = z.record(id,date).refine(v=>Object.keys(v).length<=10000);
const review = z.object({stage:z.number().int().min(0).max(4), due:date, last:date.optional()});
export const progressSchema = z.object({
  version:z.literal(1), achievements:dates, bookmarks:z.array(id).max(2000), started:dates,
  reviews:z.record(id,review), attempts:z.record(id,z.boolean()), gameScores:z.record(id,z.number().int().min(0).max(1000)).default({}), theme:z.enum(['dark','light']),
  language:z.enum(['python','cpp','java']), hinglish:z.boolean(), reduced:z.boolean(), last:z.string().max(180)
});
export type Progress = z.infer<typeof progressSchema>;
export const defaults:Progress = {version:1,achievements:{},bookmarks:[],started:{},reviews:{},attempts:{},gameScores:{},theme:'dark',language:'python',hinglish:false,reduced:false,last:''};
export const key='quiiktool.dsa.progress.v1';
export const day=(d=new Date())=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
export function daysFromNow(n:number){const d=new Date(); d.setDate(d.getDate()+n); return day(d);}
export function readProgress(raw:string):Progress {
  if(raw.length>2000000) throw Error('This progress file is too large.');
  const parsed:unknown=JSON.parse(raw);
  return progressSchema.parse(parsed);
}
export function award(p:Progress, id:string):Progress {
  if(Object.hasOwn(p.achievements,id)) return p;
  const reviews={...p.reviews};
  if(id.startsWith('problem/')) reviews[id.slice(8)]={stage:0,due:daysFromNow(1)};
  return {...p,achievements:{...p.achievements,[id]:day()},reviews};
}
export function revise(p:Progress,slug:string,remembered:boolean):Progress {
  const old=p.reviews[slug];
  if(!old) return p;
  const stage=remembered?Math.min(4,old.stage+1):0;
  return award({...p,reviews:{...p.reviews,[slug]:{stage,due:daysFromNow([1,3,7,14,30][stage]),last:day()}}},'review/'+slug+'/'+day());
}
export function xp(id:string){return id.startsWith('game/')?25:id.startsWith('problem/')?20:id.startsWith('review/')?5:10;}
export function streak(p:Progress){
  const dates=new Set(Object.values(p.achievements)); let off=dates.has(day())?0:1, total=0;
  while(dates.has(daysFromNow(-off))){total++;off++;} return total;
}
