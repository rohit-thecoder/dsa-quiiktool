import {runProblem,problemBySlug} from '@/engines/algorithms';
import type {Input,ApproachId} from '@/engines/algorithms/model';
type Request={slug:string;input:Input;approach:ApproachId;random?:boolean};
self.onmessage=({data}:{data:Request})=>{
 try{let input=data.input;
 if(data.random){const cases=problemBySlug[data.slug].cases;
 for(let n=0;n<24;n++){const sample=cases[Math.floor(Math.random()*cases.length)].input,values=[...sample.values],i=Math.floor(Math.random()*Math.max(1,values.length)); if(values.length)values[i]+=Math.floor(Math.random()*7)-3;
 const test={values,target:Math.random()<.5?sample.target:values[i]??0};try{const frames=runProblem(data.slug,test,data.approach);self.postMessage({input:test,frames});return;}catch{/* Try another candidate under this problem's rules. */}}
 input=cases[Math.floor(Math.random()*cases.length)].input;}
 const frames=runProblem(data.slug,input,data.approach);self.postMessage({input,frames});}
 catch(e){self.postMessage({error:e instanceof Error?e.message:'Input could not produce a trace.'});}
};
