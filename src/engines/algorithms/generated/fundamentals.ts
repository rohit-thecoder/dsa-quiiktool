// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "linear-search/optimal": (values, target, rt) => {
    let i = 0;
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.step("Inspect the current state", `Inspect position ${i} for the target ${target}.`, [9, 6, 4], {i, target}, values);
      if (rt.cmp(rt.read(values, i) == target)) {
        rt.step("Return the computed result", `Return the computed result.`, [10, 7, 5], {}, values);
        return i;
      }
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [14, 11, 7], {}, values);
    return -1;
  },

  "count-occurrences/optimal": (values, target, rt) => {
    let i = 0;
    let count = 0;
    i = 0;
    count = 0;
    while (rt.cmp(i < values.length)) {
      rt.step("Test the next value against the current value", `Test the next value against ${target}. The count so far is ${count}.`, [11, 8, 5], {i, count, target}, values);
      if (rt.cmp(rt.read(values, i) == target)) {
        count = (count + 1);
      }
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [16, 13, 8], {}, values);
    return count;
  },
};
