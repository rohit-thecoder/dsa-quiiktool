export type Language = 'cpp' | 'java' | 'python';
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type Input = { values: number[]; target: number };
export type ApproachId = 'brute' | 'better' | 'optimal';
export type Scalar = string | number | boolean | null;
export type NodeSpec = { id: string; value: Scalar; label?: string };
export type EdgeSpec = { from: string; to: string; directed?: boolean; weight?: number; highlighted?: boolean };
export type VisualizerState =
  | { kind: 'array'; values: Scalar[]; pointers: Record<string, number>; highlightedIndices: number[]; sortedIndices: number[]; window?: {start:number;end:number}; auxiliary?: Record<string,JsonValue> }
  | { kind: 'stack-queue-list'; structure: 'stack'|'queue'|'deque'|'linked-list'; nodes: NodeSpec[]; edges: EdgeSpec[]; highlightedNodeIds: string[]; pointers: Record<string,string|null> }
  | { kind: 'tree-graph'; nodes: NodeSpec[]; edges: EdgeSpec[]; visitedNodeIds: string[]; activeNodeIds: string[]; rootId?: string }
  | { kind: 'matrix-grid'; cells: Scalar[][]; activeCells: [number,number][]; visitedCells: [number,number][]; labels?:{rows?:string[];columns?:string[]} };
export interface CallStackFrame { id:string; functionName:string; arguments: Record<string,JsonValue>; locals: Record<string,JsonValue>; returnValue?:JsonValue }
export type Counters = {comparisons:number;reads:number;writes:number;swaps:number;recursiveCalls:number};
export interface Frame {
  id:number; event:string; title:string; explanation:string; activeLines:Record<Language,number[]>;
  variables:Record<string,JsonValue>; state:VisualizerState; callStack:CallStackFrame[]; counters:Counters; output?:JsonValue; completed?:boolean;
}
export interface Approach { id:ApproachId;title:string;intuition:string;time:string;space:string;code:Record<Language,string> }
export interface Problem {
  slug:string;title:string;topicId:string;patternIds:string[];difficulty:'easy'|'medium'|'hard';description:string; constraints:string[];
  analogy:string;hints:string[];mistake:string;followUp:string;approaches:Approach[];
  cases:{label:string;input:Input;expected:JsonValue}[];related?:string[];
}
export type Shape = 'array'|'stack'|'linked'|'tree'|'graph'|'grid';
export type Rule = 'sorted'|'positive'|'nonnegative'|'letters'|'bits'|'window'|'graph'|'grid'|'nonempty'|'target-size'|'digit'|'small-target'|'factorial'|'one-based'|'odd-pairs'|'no-negative-target'|'positive-target'|'binary-tree-index'|'pair-budget'|'paren';
export type Config = { shape:Shape; rules:Rule[]; pointers:string[] };
export type Step = (event:string, explanation:string, lines:[number,number,number], variables:Record<string,JsonValue>, board:number[], width?:number)=>void;
export interface Runtime {
  step:Step; read:(a:number[],i:number)=>number; write:(a:number[],i:number,v:number)=>void;
  swap:(a:number[],i:number,j:number)=>void; cmp:(result:boolean)=>boolean;
  enter:(name:string,n:number)=>void; leave:(value:number)=>number;
}
export type Runner=(values:number[],target:number,rt:Runtime)=>JsonValue;


