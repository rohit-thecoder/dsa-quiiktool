export const modes = [
  {slug:'pause-and-predict',title:'Pause and Predict',summary:'Pause a binary search before the boundary update and predict its next interval.'},
  {slug:'spot-the-bug',title:'Spot the Bug',summary:'Replay a failing search, apply a boundary correction and check the new trace.'},
  {slug:'complexity-race',title:'Complexity Race',summary:'Race two real search loops on the same sorted input and compare their probes.'},
  {slug:'pattern-detective',title:'Pattern Detective',summary:'Read a new scenario and identify its technique, constraint and edge case.'},
  {slug:'algorithm-reconstruction',title:'Algorithm Reconstruction',summary:'Arrange the operations for reversing a linked chain, then run your ordering.'},
  {slug:'edge-case-detective',title:'Edge Case Detective',summary:'Find a small input that makes a faulty maximum-window rule return the wrong sum.'}
];
export const detectiveCases = [
  {prompt:'A bus operator wants the busiest run of exactly four consecutive stops, measured by boardings. Which technique reuses the previous total?',choices:['Fixed-width window','Binary search','Breadth-first search'],answer:0,why:'Every shift drops one stop and adds one stop. Four is the fixed span; a line with fewer than four stops has no complete candidate.'},
  {prompt:'Two readings on a sorted dial strip must total 17. Return any pair of distinct positions with constant extra storage. Which technique matches?',choices:['Frequency map','Opposing pointers','Prefix tree'],answer:1,why:'Sorted order makes one failed endpoint safe to eliminate. A one-element strip cannot produce two different positions.'},
  {prompt:'Every corridor between rooms costs one move. Which method finds the fewest moves from reception to a named lab?',choices:['Depth-first search','Heap sort','Breadth-first search'],answer:2,why:'A FIFO frontier explores rooms by distance. A disconnected lab has no route and must be reported explicitly.'},
  {prompt:'A pass can cover one, three or seven days. Given a list of travel days and prices, choose the cheapest valid set of passes.',choices:['Dynamic programming','Greedy longest pass','Binary search only'],answer:0,why:'At the first uncovered day, compare the price plus the best cost of the remaining days for every pass type. No travel days costs zero.'},
  {prompt:'Temperature sensors stream distinct or repeated readings. Which structure can return the next strictly warmer reading for each day in one pass?',choices:['Ordinary queue','Monotonic stack','Hash set'],answer:1,why:'Store unresolved indices with nonincreasing readings. A strictly warmer day resolves the stack top. Equal readings must remain unresolved.'},
  {prompt:'A revision sheet asks for the first timetable entry at or after a time in a sorted list. Which method handles repeated times?',choices:['Find any match','Depth-first search','Lower-bound search'],answer:2,why:'The predicate entry ≥ target changes at most once. Keep the first true candidate. A target after the final time returns the insertion index n.'}
];
export function activeDate(date: Date) {
  const year=date.getFullYear(), month=date.getMonth(), day=date.getDate();
  return {key:`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`,
    ordinal:Math.floor(Date.UTC(year,month,day)/86400000)};
}
export function probes(values:number[],target:number,method:'linear'|'binary'|'buggy') {
  const visited:number[]=[];
  if(method==='linear') {
    for(let i=0;i<values.length;i++) {visited.push(i); if(values[i]===target) return {visited,found:i};}
  } else {
    let lo=0,hi=values.length-1;
    while(method==='buggy' ? lo<hi : lo<=hi) {
      const mid=lo+Math.floor((hi-lo)/2); visited.push(mid);
      if(values[mid]===target) return {visited,found:mid};
      if(values[mid]<target) lo=mid+1; else hi=mid-1;
    }
  }
  return {visited,found:-1};
}
export function bestWindow(values:number[],width:number,buggy:boolean) {
  if(width<1 || width>values.length) throw new Error('Width must fit the sequence.');
  let sum = values.slice(0,width).reduce((total,x)=>total+x,0);
  let best=buggy ? Math.max(0,sum) : sum;
  const sums=[sum];
  for(let i=width;i<values.length;i++) {sum+=values[i]-values[i-width]; sums.push(sum); best=Math.max(best,sum);}
  return {best,sums};
}
