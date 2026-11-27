import {level, numbers, randomFrom, shuffled, wrong, type Level} from './core'

export function dependency(n:number):Level {
  const count=4+Math.floor((n-1)/3), order=shuffled(numbers(count),n*71)
  const edges:[number,number][]=[]
  for(let i=0;i<count;i++) for(let j=i+1;j<count;j++) if((i+j+n)%3===0||j===i+1&&i%2===0) edges.push([order[i],order[j]])
  const ready=(done:number[],v:number)=>!done.includes(v)&&edges.every(([a,b])=>b!==v||done.includes(a))
  return level({title:'Dependency dispatch',goal:'Launch every module after its prerequisites.',instruction:'Select any module with no unfinished incoming dependencies. The arrows point from prerequisite to dependent.',lesson:'Kahn’s topological sort removes zero-indegree vertices. With adjacency lists and a queue it costs O(V + E).'},[] as number[],{
    scene:done=>({layout:'network',tiles:numbers(count).map(v=>({id:String(v),label:'Module '+(v+1),value:'M'+(v+1),caption:done.includes(v)?'Launched':edges.filter(([a,b])=>b===v&&!done.includes(a)).length+' pending',mark:done.includes(v)?'done':ready(done,v)?'goal':'plain',disabled:done.includes(v),x:15+(order.indexOf(v)%4)*23,y:25+Math.floor(order.indexOf(v)/4)*50})),edges,stats:[['Launched',done.length+'/'+count],['Ready',numbers(count).filter(v=>ready(done,v)).length]],table:{label:'Launch order',cells:[done.map(v=>'M'+(v+1))]}}),
    solved:done=>done.length===count,guide:done=>String(numbers(count).find(v=>ready(done,v))),
    move:(done,key)=>ready(done,+key)?{state:[...done,+key],feedback:'Module launched. Update incoming dependency counts.'}:wrong(done,'Launch its prerequisites first.')
  })
}

export function hashVault(n:number):Level {
  const size=7+Math.floor((n-1)/5)*2, count=4+Math.floor((n-1)/5), rng=randomFrom(n*509)
  const keys=Array.from({length:count},(_,i)=>size*(i+1)+rng(3))
  type S={slots:(number|null)[];next:number;probe:number}
  const start:S={slots:Array(size).fill(null),next:0,probe:keys[0]%size}
  return level({title:'Collision control',goal:'Store every incoming key without overwriting a slot.',instruction:'Hash the current key modulo capacity. Click the active bucket to inspect it. If occupied, advance one slot with wraparound.',lesson:'Linear probing resolves collisions by searching consecutive buckets. Expected insertion can be O(1) at low load; worst case O(n).'},start,{
    scene:s=>({layout:'strip',tiles:s.slots.map((v,i)=>({id:String(i),label:'Bucket '+i,value:v===null?'·':String(v),caption:'Index '+i,mark:s.next===count?'done':i===s.probe?'active':v!==null?'done':'plain'})),stats:[['Incoming key',keys[s.next]??'All stored'],['Capacity',size],['Load',s.next+'/'+size],['Home bucket',s.next<count?keys[s.next]%size:'—']]}),
    solved:s=>s.next===count,guide:s=>String(s.probe),
    move:(s,key)=>{if(+key!==s.probe)return wrong(s,'Probe the current bucket before moving forward.');if(s.slots[s.probe]!==null)return {state:{...s,probe:(s.probe+1)%size},feedback:'Collision! Advance to the next bucket.'};const slots=[...s.slots];slots[s.probe]=keys[s.next];const next=s.next+1;return {state:{slots,next,probe:next<count?keys[next]%size:0},feedback:'Key stored. Hash the next key.'}}
  })
}

export function bitForge(n:number):Level {
  const width=5+Math.floor((n-1)/5), initial=(randomFrom(n*97)(2**width-1)+1)
  const bits=(v:number)=>numbers(width).map(i=>(v>>i)&1)
  return level({title:'Bit forge',goal:'Clear every set bit, lowest first.',instruction:'Select the least significant remaining 1. This simulates x & (x − 1).',lesson:'Each iteration clears one set bit. Counting set bits this way takes O(k) iterations for k ones.'},initial,{
    scene:x=>({layout:'strip',tiles:bits(x).map((v,i)=>({id:String(i),label:'Bit '+i,value:String(v),caption:'2^'+i,mark:v?'active':'done',disabled:!v})).reverse(),stats:[['Decimal',x],['Cleared',bits(initial).reduce((a,b)=>a+b,0)-bits(x).reduce((a,b)=>a+b,0)],['Remaining',bits(x).reduce((a,b)=>a+b,0)]]}),
    solved:x=>x===0,guide:x=>String(bits(x).indexOf(1)),move:(x,key)=>+key===bits(x).indexOf(1)?{state:x&(x-1),feedback:'Lowest set bit cleared.'}:wrong(x,'Choose the rightmost remaining 1.')
  })
}

export function networkMerge(n:number):Level {
  const count=5+Math.floor((n-1)/5), order=shuffled(numbers(count),n*19)
  const requests=order.slice(1).map((v,i)=>[order[Math.floor(i/2)],v] as [number,number])
  type S={parent:number[];sizes:number[];next:number}
  const root=(p:number[],v:number):number=>p[v]===v?v:root(p,p[v])
  const pair=(s:S)=>requests[s.next].map(v=>root(s.parent,v))
  const winner=(s:S)=>{const [a,b]=pair(s);return s.sizes[a]>=s.sizes[b]?a:b}
  return level({title:'Network merge',goal:'Connect all stations with union by size.',instruction:'For each link, find both representatives and choose the larger root. If sizes tie, choose the first endpoint’s root.',lesson:'Union by size attaches the smaller tree to the larger. Without path compression, root lookup is O(log n).'}, {parent:numbers(count),sizes:Array(count).fill(1),next:0} as S,{
    scene:s=>({layout:'strip',tiles:numbers(count).map(v=>({id:String(v),label:'Station '+v,value:String(v),caption:s.parent[v]===v?'Root · '+s.sizes[v]:'Parent '+s.parent[v],mark:s.next===requests.length?'done':s.parent[v]===v?'goal':'plain'})),stats:[['Link',requests[s.next]?.join(' → ')??'Complete'],['Components',count-s.next]],table:{label:'Parent array',cells:[numbers(count),s.parent]}}),
    solved:s=>s.next===requests.length,guide:s=>String(winner(s)),
    move:(s,key)=>{if(+key!==winner(s))return wrong(s,'Choose the larger representative (first endpoint on a tie).');const [a,b]=pair(s),keep=+key,drop=keep===a?b:a,parent=[...s.parent],sizes=[...s.sizes];parent[drop]=keep;sizes[keep]+=sizes[drop];return {state:{parent,sizes,next:s.next+1},feedback:'Smaller component attached to root '+keep+'.'}}
  })
}

export function intervalMission(n:number):Level {
  const rng=randomFrom(n*157), count=5+Math.floor((n-1)/3), tasks=numbers(count).map(i=>{const start=rng(13);return {i,start,end:start+1+rng(6)}})
  type S={end:number;chosen:number[]}
  const candidates=(s:S)=>tasks.filter(t=>t.start>=s.end).sort((a,b)=>a.end-b.end||a.i-b.i)
  return level({title:'Mission scheduler',goal:'Complete the maximum number of non-overlapping missions.',instruction:'Select the eligible mission with the earliest finish. Ties are allowed. A mission can start when the preceding one ends.',lesson:'Earliest-finish greedy scheduling is optimal for maximizing the number of unweighted intervals. Sorting costs O(n log n).'}, {end:-1,chosen:[]} as S,{
    scene:s=>({layout:'strip',tiles:tasks.map(t=>({id:String(t.i),label:'Mission '+(t.i+1)+', '+t.start+' to '+t.end,value:t.start+'–'+t.end,caption:'Mission '+(t.i+1),mark:s.chosen.includes(t.i)?'done':t.start<s.end?'blocked':'plain',disabled:s.chosen.includes(t.i)||t.start<s.end})),stats:[['Missions completed',s.chosen.length],['Available from',Math.max(0,s.end)]]}),
    solved:s=>candidates(s).length===0,guide:s=>String(candidates(s)[0]?.i),
    move:(s,key)=>{const t=tasks[+key];return t&&t.start>=s.end&&t.end===candidates(s)[0]?.end?{state:{end:t.end,chosen:[...s.chosen,t.i]},feedback:'Earliest finish leaves maximum room for later missions.'}:wrong(s,'Find the compatible mission with the earliest finish.')}
  })
}

export function primeLab(n:number):Level {
  const max=20+n, values=numbers(max+1).slice(2)
  type S={marked:number[];done:number[];p:number}
  const nextPrime=(marked:number[],done:number[])=>values.find(v=>v*v<=max&&!marked.includes(v)&&!done.includes(v))??0
  const multiples=(s:S)=>values.filter(v=>v>=s.p*s.p&&v%s.p===0&&!s.marked.includes(v))
  return level({title:'Prime reactor',goal:'Sieve out composites and leave only prime numbers.',instruction:'For the active prime p, mark its remaining multiples starting at p². Then advance to the next prime.',lesson:'The sieve of Eratosthenes marks multiples of primes up to √n. Time O(n log log n), space O(n).'}, {marked:[],done:[],p:2} as S,{
    scene:s=>({layout:'grid',columns:6,tiles:values.map(v=>({id:String(v),label:'Number '+v,value:String(v),mark:s.marked.includes(v)?'blocked':v===s.p?'active':!s.p||s.done.includes(v)?'done':'plain',disabled:s.marked.includes(v)||!s.p})),controls:s.p?[{id:'advance',label:'Next prime'}]:[],stats:[['Active prime',s.p||'Complete'],['Composites',s.marked.length],['Remaining candidates',values.length-s.marked.length]]}),
    solved:s=>s.p===0,guide:s=>String(multiples(s)[0]??'advance'),
    move:(s,key)=>{const pending=multiples(s);if(key==='advance'){if(pending.length)return wrong(s,'Mark every remaining multiple first.');const done=[...s.done,s.p];return {state:{...s,done,p:nextPrime(s.marked,done)},feedback:'Advance to the next unmarked prime.'}}return pending.includes(+key)?{state:{...s,marked:[...s.marked,+key]},feedback:'Composite removed.'}:wrong(s,'Select an unmarked multiple of '+s.p+' at or above its square.')}
  })
}
