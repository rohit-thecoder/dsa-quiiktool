import {describe,it,expect} from 'vitest';import {problems,runProblem} from '../../src/engines/algorithms';
describe.each(problems)('$title',p=>{for(const a of p.approaches)for(const c of p.cases)it(a.title+' '+c.label,()=>{const frames=runProblem(p.slug,c.input,a.id);expect(frames.at(-1)?.output).toEqual(c.expected);expect(frames.at(-1)?.completed).toBe(true);for(const f of frames)for(const l of ['cpp','java','python'] as const)for(const n of f.activeLines[l]){expect(n).toBeGreaterThanOrEqual(1);expect(n).toBeLessThanOrEqual(a.code[l].split('\n').length);}});});

