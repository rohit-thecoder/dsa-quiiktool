import { z } from 'zod';
import type { Config, Input, Rule } from './model';

const integer = z.number().int().min(-1000).max(1000);
const inputSchema = z.object({values:z.array(integer).max(32),target:integer}).strict();

function pairedValues(values:number[]) {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  const sizes = [...counts.values()];
  return sizes.filter(count=>count === 1).length === 1 && sizes.every(count=>count === 1 || count === 2);
}

const checks: Record<Rule, (input:Input)=>boolean> = {
  sorted: ({values}) => values.every((v,i)=>i === 0 || values[i-1] <= v),
  positive: ({values}) => values.every(v=>v > 0),
  nonnegative: ({values}) => values.every(v=>v >= 0),
  letters: ({values}) => values.every(v=>v >= 0 && v < 26),
  bits: ({values}) => values.every(v=>v === 0 || v === 1),
  window: ({target,values}) => target >= 1 && target <= values.length,
  graph: ({values,target}) => { const n = Math.sqrt(values.length); return Number.isInteger(n) && target >= 0 && target < n && values.every(v=>v===0 || v===1); },
  grid: ({target,values}) => target >= 1 && values.length > 0 && values.length % target === 0,
  nonempty: ({values}) => values.length > 0,
  'target-size': ({values,target}) => target >= 0 && target < values.length,
  digit: ({values}) => values.every(v=>v >= 0 && v<=9),
  'small-target': ({target}) => target >= 0 && target <= 20,
  factorial: ({target})=>target >= 0 && target <= 10,
  'one-based': ({values}) => values.every(v=>v>=0 && v<=values.length) && new Set(values).size === values.length,
  'odd-pairs': ({values}) => pairedValues(values),
  'no-negative-target': ({target})=>target >= 0,
  'positive-target': ({target})=>target > 0,
  'pair-budget': ({target})=>target >= 0 && target <= 100,
  'binary-tree-index': ({values,target})=>target >= 0 && target < values.length,
  paren: ({values})=>values.every(v=>v === 1 || v === -1)
};

export function validateInput(input:unknown, config:Config, constraints:string[]) {
  const result = inputSchema.safeParse(input);
  if (!result.success) throw new Error('Enter a values array of up to 32 integers and an integer target. Each number must be between -1000 and 1000.');
  config.rules.forEach((rule,i) => {
    if (!checks[rule](result.data)) throw new Error(constraints[i]);
  });
  return result.data;
}

