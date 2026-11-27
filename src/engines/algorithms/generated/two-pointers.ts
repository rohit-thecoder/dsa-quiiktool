// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "two-sum-ii/optimal": (values, target, rt) => {
    let left = 0;
    let right = 0;
    let total = 0;
    left = 0;
    right = (values.length - 1);
    while (rt.cmp(left < right)) {
      total = (rt.read(values, left) + rt.read(values, right));
      rt.step("Inspect the current state", `Compare pair sum ${total} with ${target}.`, [13, 10, 6], {left, right, total, target}, values);
      if (rt.cmp(total == target)) {
        rt.step("Return the computed result", `Return the computed result.`, [14, 11, 7], {}, values);
        return [left, right];
      }
      if (rt.cmp(total < target)) {
        left = (left + 1);
      } else {
        right = (right - 1);
      }
    }
    rt.step("Return the computed result", `Return the computed result.`, [22, 19, 12], {}, values);
    return [];
  },

  "remove-duplicates-from-sorted-array/optimal": (values, target, rt) => {
    let count = 0;
    let i = 0;
    let out: number[] = [];
    let write = 0;
    count = 0;
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.step("Identify a run start at position the current value", `Identify a run start at position ${i}.`, [13, 10, 5], {i, count}, values);
      if ((rt.cmp(i == 0) || rt.cmp(rt.read(values, i) != rt.read(values, (i - 1))))) {
        count = (count + 1);
      }
      i = (i + 1);
    }
    out = Array<number>(count).fill(0);
    i = 0;
    write = 0;
    while (rt.cmp(i < values.length)) {
      if ((rt.cmp(i == 0) || rt.cmp(rt.read(values, i) != rt.read(values, (i - 1))))) {
        rt.step("Copy the first value from this run", `Copy the first value from this run.`, [23, 20, 13], {i, write, out}, values);
        rt.write(out, write, rt.read(values, i));
        write = (write + 1);
      }
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [28, 25, 16], {}, values);
    return out;
  },

  "container-with-most-water/optimal": (values, target, rt) => {
    let left = 0;
    let right = 0;
    let best = 0;
    let area = 0;
    left = 0;
    right = (values.length - 1);
    best = 0;
    while (rt.cmp(left < right)) {
      area = (Math.min(rt.read(values, left), rt.read(values, right)) * (right - left));
      rt.step("Inspect the current state", `Compare this container area ${area} with the current best.`, [15, 12, 7], {left, right, area, best}, values);
      best = Math.max(area, best);
      if (rt.cmp(rt.read(values, left) <= rt.read(values, right))) {
        left = (left + 1);
      } else {
        right = (right - 1);
      }
    }
    rt.step("Return the computed result", `Return the computed result.`, [22, 19, 12], {}, values);
    return best;
  },

  "reverse-array/optimal": (values, target, rt) => {
    let a: number[] = [];
    let left = 0;
    let right = 0;
    a = values.slice();
    left = 0;
    right = (a.length - 1);
    while (rt.cmp(left < right)) {
      rt.step("Inspect the current state", `Exchange symmetric positions ${left} and ${right}.`, [13, 10, 6], {left, right}, a);
      rt.swap(a, left, right);
      left = (left + 1);
      right = (right - 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [17, 14, 9], {}, a);
    return a;
  },
};
