import { topics } from './topics';

export interface Roadmap {
  slug: string; title: string; summary: string; days: number;
  stages: {title:string; topics:string[]; task:string}[];
}
const stages = [
  {title:'Foundations',topics:['fundamentals','arrays-and-hashing','strings','sorting'],task:'Run a small input by hand, then compare its state with the visualizer.'},
  {title:'Essential patterns',topics:['arrays-and-hashing','two-pointers','sliding-window','binary-search'],task:'Name the invariant and explain why one candidate can be discarded.'},
  {title:'Data structures',topics:['linked-lists','stacks-and-queues','recursion-and-backtracking','trees','heaps'],task:'Draw the structure before and after one insertion, removal or recursive call.'},
  {title:'Advanced algorithms',topics:['graphs','dynamic-programming','greedy-and-intervals','bit-manipulation'],task:'Explain a transition or local choice and test the smallest awkward input.'},
  {title:'Interview mastery',topics:['binary-search','stacks-and-queues','graphs','dynamic-programming'],task:'Solve an unfamiliar input, justify the complexity and describe a counterexample to a tempting shortcut.'}
];
export const roadmaps: Roadmap[] = [
  {slug:'30-day-foundation',title:'30-day DSA foundation',summary:'Build a dependable routine for scans, pointer moves and first data structures.',days:30,stages:[
    stages[0],stages[1],{...stages[2],topics:['linked-lists','stacks-and-queues','recursion-and-backtracking']},
    {...stages[3],topics:['trees','graphs']},{...stages[4],topics:['two-pointers','binary-search']}]},
  {slug:'60-day-placement',title:'60-day placement preparation',summary:'Connect common interview constraints to patterns and practise explaining your choices.',days:60,stages},
  {slug:'90-day-comprehensive',title:'90-day comprehensive DSA',summary:'Work across all sixteen topic groups, then revisit them through experiments and mixed practice.',days:90,stages}
];
const drills = ['Trace the example','Change one input','Explain the invariant','Predict an edge case','Review from memory'];
export function buildSchedule(plan: Roadmap, dailyMinutes: number) {
  const minutes = Math.max(10, Math.min(120, Math.round(dailyMinutes) || 20));
  const available = new Set(topics.map(t => t.slug));
  const units = plan.stages.flatMap(stage => stage.topics.filter(id=>available.has(id)).map(topic=>({topic,stage})));
  return Array.from({length:plan.days},(_,index)=>{
    const unitIndex = Math.floor(index*units.length/plan.days);
    const unit = units[unitIndex];
    const firstDay = Math.ceil(unitIndex*plan.days/units.length);
    const visit = index-firstDay;
    const tasks = Array.from({length:Math.min(drills.length,Math.max(1,Math.floor(minutes/12)))},(_,i)=>drills[(visit+i)%drills.length]);
    const earlier = units[Math.max(0,unitIndex-2)].topic;
    return {day:index+1,topic:unit.topic,stage:unit.stage.title,task:unit.stage.task,minutes,tasks,
      review: index>=3 && index%3===0 ? earlier : undefined};
  });
}
export interface PrepSection {title:string; summary:string; items:{question:string; answer:string}[]}
export const interviewPrep: PrepSection[] = [
  {title:'Frame the problem',summary:'Make requirements testable before committing to a technique.',items:[
    {question:'What does a pair mean?',answer:'Ask whether the two indices must differ, whether duplicate values are allowed and whether any solution is acceptable. For [4] and target 8, two distinct indices cannot form an answer.'},
    {question:'Which constraints change the design?',answer:'State maximum input size, value range, sortedness, allowed mutation and memory limits. Sorting can destroy the positions that an index-returning problem asks for.'},
    {question:'How do I state a baseline?',answer:'Describe the simplest complete search. For pair sum, enumerate i < j. There are n(n−1)/2 comparisons; this gives you a correct reference for small tests.'}]},
  {title:'Explain an optimization',summary:'Move from repeated work to an invariant an interviewer can check.',items:[
    {question:'Where is the repeated work in pair sum?',answer:'Each inner scan asks whether the complement exists. In one pass, store the earlier values so each new candidate can query its complement. Check before insertion.'},
    {question:'How can I justify a pointer move?',answer:'In sorted pair sum, if the endpoints sum too low, the left value is too small even with the largest available partner. Every pair beginning at that index can be discarded.'},
    {question:'What should a complexity claim include?',answer:'Name the size variable and the work per unit. Hash lookup is expected constant time under suitable hashing. A one-pass complement map has expected O(n) time and O(n) auxiliary memory.'}]},
  {title:'Test and discuss a follow-up',summary:'Close the explanation with a trace and one change that would alter the answer.',items:[
    {question:'Which boundary inputs would I show?',answer:'Try an empty collection, one element, repeated values, a missing target and a target at the final index. State the agreed return convention before recording outputs.'},
    {question:'What if input arrives as a stream?',answer:'A prefix frequency map can be maintained as values arrive. Sorting an entire unfinished stream would require buffering it. Ask how long earlier values must remain available.'},
    {question:'How should I handle uncertainty?',answer:'Write the invariant in words, run the smallest case that could break it, and explain any correction. Distinguish a proved claim from an intuition you are still testing.'}]}
];
export const collegePrep: PrepSection[] = [
  {title:'Array and linked-list practicals',summary:'Draw storage locations and logical sequence separately.',items:[
    {question:'Insert 6 at index 1 of [2, 5, 9]. Which writes happen first?',answer:'With spare capacity, shift 9 to index 3 and 5 to index 2, then store 6 at index 1. Shifting from the right preserves unread items.'},
    {question:'Delete B from A → B → C using a reference to A.',answer:'Set A.next to B.next. In a manually managed language release B when no live owner still needs it. The logical chain is A → C.'}]},
  {title:'Stacks, queues and expressions',summary:'Record the contents of each active end after consuming one token.',items:[
    {question:'Why does a circular queue need a size or spare slot?',answer:'With only head and tail modulo capacity, equal indices can represent either full or empty. A size field or a reserved empty position distinguishes those states.'},
    {question:'Convert A+B*C to postfix.',answer:'Emit A and B, keep + and * pending, then emit C. Pop * before + due to precedence. The result is A B C * +.'},
    {question:'Evaluate 8 3 − 2 ×.',answer:'Push 8 then 3. Pop the right operand 3 before the left operand 8, push 5, then multiply by 2 to obtain 10.'}]},
  {title:'Recursion and sorting passes',summary:'Show one complete return or pass before giving the final output.',items:[
    {question:'How many moves does Hanoi use for three disks?',answer:'Move two disks aside in 3 moves, move the largest once and restore the two in 3 moves. The total is 7, following T(n) = 2T(n−1)+1.'},
    {question:'What does one bubble pass guarantee?',answer:'In a left-to-right increasing sort, the largest active value reaches the rightmost active position. For [3, 2, 1], the pass ends at [2, 1, 3].'},
    {question:'What is live on the factorial(3) stack?',answer:'With base case 0, the deepest point has frames for 3, 2, 1 and 0. Returning 1 from zero allows multiplication by 1, then 2, then 3.'}]},
  {title:'BSTs and AVL repairs',summary:'Maintain both search order and the extra balance condition when rotating.',items:[
    {question:'Insert 30, 20, 10 into an AVL tree.',answer:'30 becomes heavy on the left-left path. A right rotation at 30 makes 20 the root, with 10 and 30 as children. Inorder still gives 10, 20, 30.'},
    {question:'When is a double rotation needed?',answer:'A left-heavy node with a right-heavy left child needs a left rotation on the child and then a right rotation on the node. The symmetric case uses right then left.'},
    {question:'Why use bounds to validate a BST?',answer:'Every node in the left subtree must remain below its ancestor’s upper bound. Checking only a node and its direct parent does not verify this transitive restriction.'}]},
  {title:'Graph laboratory',summary:'State graph direction, edge costs and the objective before choosing an algorithm.',items:[
    {question:'Trace Dijkstra from A with A→B=4, A→C=1, C→B=2.',answer:'Start with A=0, B=∞, C=∞. After A, distances are B=4, C=1. Settle C and relax B to 3. Settle B to finish.'},
    {question:'How does a minimum spanning tree differ from a shortest-path tree?',answer:'A minimum spanning tree minimizes the sum of selected edges connecting all vertices in an undirected graph. A shortest-path tree preserves distances from a particular source.'},
    {question:'Which edge does Kruskal reject in a triangle of costs 1, 2, 4?',answer:'The edges of costs 1 and 2 connect all three vertices. Adding cost 4 would make a cycle in the selected forest, so reject it.'},
    {question:'Why does BFS mark at enqueue time?',answer:'Two parents might discover the same neighbor before it is processed. Marking when enqueuing gives that vertex a single queue entry and records its first-layer distance.'}]}
];
export const companyTracks = ['Amazon','Microsoft','Google','Flipkart','Goldman Sachs','TCS','Infosys','Wipro','Accenture'];

interviewPrep.push(...[{"title":"Hashing","summary":"Practice relevant to general Amazon, Microsoft and Google software engineering interviews; exact question occurrences are not verified.","items":[{"question":"Count subarrays with sum k","answer":"Use prefix frequencies initialized with 0:1; query prefix minus k before inserting. Expected O(n)."},{"question":"Group anagrams","answer":"Group by sorted string or frequency signature."}]},{"title":"Two pointers and windows","summary":"Practice relevant to general Amazon, Microsoft and Google software engineering interviews; exact question occurrences are not verified.","items":[{"question":"Three sum","answer":"Sort, fix one index, sweep two endpoints, skip duplicates. O(n²)."},{"question":"Minimum covering substring","answer":"Track required multiplicities; shrink when all requirements are met."}]},{"title":"Binary search","summary":"Practice relevant to general Amazon, Microsoft and Google software engineering interviews; exact question occurrences are not verified.","items":[{"question":"Minimum shipping capacity","answer":"Search between largest weight and total weight using monotone feasibility."},{"question":"Rotated sorted array search","answer":"Identify sorted half and discard the half that cannot contain target."}]},{"title":"Graphs","summary":"Practice relevant to general Amazon, Microsoft and Google software engineering interviews; exact question occurrences are not verified.","items":[{"question":"Course scheduling","answer":"Kahn algorithm; fewer than V processed nodes implies a cycle."},{"question":"Count islands","answer":"BFS or DFS from unvisited land, marking on discovery."},{"question":"Redundant connection","answer":"Union-find detects edges joining vertices already connected."}]},{"title":"Dynamic programming","summary":"Practice relevant to general Amazon, Microsoft and Google software engineering interviews; exact question occurrences are not verified.","items":[{"question":"Longest increasing subsequence","answer":"Maintain minimum tails using lower bound. O(n log n)."},{"question":"Equal subset partition","answer":"Reject odd totals; use descending-capacity 0/1 subset sum."}]},{"title":"Stacks and heaps","summary":"Practice relevant to general Amazon, Microsoft and Google software engineering interviews; exact question occurrences are not verified.","items":[{"question":"Largest histogram rectangle","answer":"Use increasing stack of indices and flush at end."},{"question":"Streaming median","answer":"Maintain two balanced heaps with ordered halves."}]}]);
