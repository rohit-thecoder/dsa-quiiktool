import type { Config, EdgeSpec, Input, JsonValue, NodeSpec, VisualizerState } from './model';

export function displayState(config:Config, input:Input, board:number[], variables:Record<string,JsonValue>):VisualizerState {
  const target = input.target;
  const pointers:Record<string,number> = {};
  for (const label of config.pointers) {
    const value = variables[label];
    if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < board.length) pointers[label]=value;
  }
  const activeIndices = [...new Set(Object.values(pointers))];
  if (config.shape === 'grid') {
    const cells:number[][] = [];
    for (let i=0;i<board.length;i+=target) cells.push(board.slice(i,i+target));
    return {kind:'matrix-grid',cells,activeCells:activeIndices.map(i=>[Math.floor(i/target),i%target]),visitedCells:[]};
  }
  if (config.shape === 'stack') {
    const buffer = Array.isArray(variables.stack) ? variables.stack : [];
    const size = typeof variables.top === 'number' ? variables.top : 0;
    const items = buffer.slice(0,size).map((v,i)=>({id:String(i),value:typeof v === 'number' ? v : null}));
    const top = items.length ? items[items.length-1].id : null;
    return {kind:'stack-queue-list',structure:'stack',nodes:items,edges:[],highlightedNodeIds:top?[top]:[],pointers:{top}};
  }
  if (config.shape === 'linked' || config.shape === 'tree' || config.shape === 'graph') {
    const graph = config.shape === 'graph';
    const n = graph ? Math.sqrt(board.length) : board.length;
    const nodes:NodeSpec[] = Array.from({length:n},(_,i)=>({id:String(i),value:graph ? i : board[i]}));
    const edges:EdgeSpec[] = [];
    function edge(from:number,to:number,directed=true) { if (to >= 0 && to < n) edges.push({from:String(from),to:String(to),directed}); }
    if (config.shape === 'linked') {
      const links = Array.isArray(variables.links) ? variables.links : null;
      for (let i=0;i<n;i++) { const next = links ? links[i] : i+1; if (typeof next === 'number') edge(i,next); }
      return {kind:'stack-queue-list',structure:'linked-list',nodes,edges,highlightedNodeIds:activeIndices.map(String),pointers:Object.fromEntries(Object.entries(pointers).map(([k,v])=>[k,String(v)]))};
    }
    if (graph) {
      for(let i=0;i<n;i++) for(let j=0;j<n;j++) if(board[i*n+j]) edge(i,j);
    } else {
      for(let i=1;i<n;i++) edge(Math.floor((i-1)/2),i);
    }
    const seen = Array.isArray(variables.seen) ? variables.seen : [];
    return {kind:'tree-graph',nodes,edges,activeNodeIds:activeIndices.filter(i=>i<n).map(String),
      visitedNodeIds:seen.flatMap((v,i)=>v?[String(i)]:[]),rootId:n?String(graph?target:0):undefined};
  }
  const values = board.slice();
  return {kind:'array',values,pointers,highlightedIndices:activeIndices,sortedIndices:[],
    ...(pointers.left !== undefined && pointers.right !== undefined && pointers.left<=pointers.right ? {window:{start:pointers.left,end:pointers.right}} : {})};
}

