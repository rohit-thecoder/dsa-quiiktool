// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "is-max-heap/optimal": (values, target, rt) => {
    let child = 0;
    let parent = 0;
    child = 1;
    while (rt.cmp(child < values.length)) {
      parent = Math.floor((child - 1) / 2);
      rt.step("Inspect the current state", `Compare parent ${parent} with child ${child}.`, [11, 8, 5], {parent, child}, values);
      if (rt.cmp(rt.read(values, parent) < rt.read(values, child))) {
        rt.step("Return the computed result", `Return the computed result.`, [12, 9, 6], {}, values);
        return 0;
      }
      child = (child + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [16, 13, 8], {}, values);
    return 1;
  },

  "heap-sort/optimal": (values, target, rt) => {
    let a: number[] = [];
    let size = 0;
    let start = 0;
    let root = 0;
    let child = 0;
    a = values.slice();
    size = a.length;
    start = Math.floor(size / 2);
    while ((rt.cmp(start > 0) || rt.cmp(size > 1))) {
      if (rt.cmp(start > 0)) {
        start = (start - 1);
        root = start;
      } else {
        size = (size - 1);
        rt.step("Place the maximum into the sorted suffix", `Place the maximum into the sorted suffix.`, [20, 17, 11], {size}, a);
        rt.swap(a, 0, size);
        root = 0;
      }
      while (rt.cmp(((root * 2) + 1) < size)) {
        child = ((root * 2) + 1);
        if ((rt.cmp((child + 1) < size) && rt.cmp(rt.read(a, child) < rt.read(a, (child + 1))))) {
          child = (child + 1);
        }
        rt.step("Inspect the current state", `Check whether the parent dominates its larger child.`, [28, 25, 17], {root, child, size}, a);
        if (rt.cmp(rt.read(a, root) >= rt.read(a, child))) {
          break;
        }
        rt.swap(a, root, child);
        root = child;
      }
    }
    rt.step("Return the computed result", `Return the computed result.`, [35, 32, 21], {}, a);
    return a;
  },
};
