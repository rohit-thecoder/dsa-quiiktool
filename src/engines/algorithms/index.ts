import data from './generated/problems.json';
import configurations from './generated/config.json';
import { runners } from './generated/runners';
import { displayState } from './state';
import { validateInput } from './validation';
import type { ApproachId, Config, Counters, Frame, Input, Problem, Runtime } from './model';

export type * from './model';
export const problems = data as Problem[];
export const problemBySlug:Record<string,Problem> = Object.fromEntries(problems.map(problem=>[problem.slug,problem]));
const configs = configurations as Record<string,Config>;

export function runProblem(slug:string,input:Input,approachId:ApproachId|string='optimal'):Frame[] {
  if (!Object.hasOwn(problemBySlug,slug)) throw new Error('Unknown problem.');
  const problem = problemBySlug[slug];
  const runner = runners[slug+'/'+approachId];
  if (!runner) throw new Error('Unknown approach.');
  const config = configs[slug];
  const valid = validateInput(input,config,problem.constraints);
  const frames:Frame[]=[];
  const counters:Counters = {comparisons:0,reads:0,writes:0,swaps:0,recursiveCalls:0};
  const runtime:Runtime = {
    cmp(value) { counters.comparisons++; return value; },
    read(items,index) { counters.reads++; return items[index]; },
    write(items,index,value) { counters.writes++; items[index]=value; },
    swap(items,i,j) { counters.swaps++; counters.reads+=2; counters.writes+=2; [items[i],items[j]]=[items[j],items[i]]; },
    enter() { counters.recursiveCalls++; },
    leave(value) { return value; },
    step(title,explanation,lines,variables,board) {
      if(frames.length>=4096) throw new Error('This input exceeds the 4096-step limit. Try fewer values.');
      const variablesCopy = structuredClone(variables);
      const state = displayState(config,valid,board,variablesCopy);
      const callStack = slug === 'factorial' && Array.isArray(variablesCopy.stack) && typeof variablesCopy.top === 'number'
        ? variablesCopy.stack.slice(0,variablesCopy.top).map((n,i)=>({id:String(i),functionName:'factorial',arguments:{n},locals:{}})) : [];
      frames.push({id:frames.length,event:'line-'+lines[2],title,explanation,
        activeLines:{cpp:[lines[0]],java:[lines[1]],python:[lines[2]]},variables:variablesCopy,
        state,callStack,counters:{...counters}});
    }
  };
  const output = runner(valid.values,valid.target,runtime);
  const last = frames[frames.length-1];
  last.output=output;
  last.completed=true;
  last.counters={...counters};
  return frames;
}

