// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "two-sum/optimal": (values, target, rt) => {
    let seen: number[] = [];
    let i = 0;
    let need = 0;
    seen = Array<number>(2001).fill(0);
    i = 0;
    while (rt.cmp(i < values.length)) {
      need = (target - rt.read(values, i));
      rt.step("Look for the earlier complement the current value", `Look for the earlier complement ${need}.`, [13, 10, 6], {i, need, target}, values);
      if ((rt.cmp(need >= -1000) && rt.cmp(need <= 1000))) {
        if (rt.cmp(rt.read(seen, (need + 1000)) > 0)) {
          rt.step("Return the computed result", `Return the computed result.`, [15, 12, 8], {}, values);
          return [(rt.read(seen, (need + 1000)) - 1), i];
        }
      }
      if (rt.cmp(rt.read(seen, (rt.read(values, i) + 1000)) == 0)) {
        rt.write(seen, (rt.read(values, i) + 1000), (i + 1));
      }
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [23, 20, 12], {}, values);
    return [];
  },

  "two-sum/brute": (values, target, rt) => {
    let j = 0;
    let i = 0;
    j = 1;
    while (rt.cmp(j < values.length)) {
      i = 0;
      while (rt.cmp(i < j)) {
        rt.step("Inspect the current state", `Compare positions ${i} and ${j}.`, [12, 9, 6], {i, j, target}, values);
        if (rt.cmp((rt.read(values, i) + rt.read(values, j)) == target)) {
          rt.step("Return the computed result", `Return the computed result.`, [13, 10, 7], {}, values);
          return [i, j];
        }
        i = (i + 1);
      }
      j = (j + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [19, 16, 10], {}, values);
    return [];
  },

  "contains-duplicate/optimal": (values, target, rt) => {
    let seen: number[] = [];
    let i = 0;
    let key = 0;
    seen = Array<number>(2001).fill(0);
    i = 0;
    while (rt.cmp(i < values.length)) {
      key = (rt.read(values, i) + 1000);
      rt.step("Inspect the current state", `Check whether this value already owns a marked entry.`, [13, 10, 6], {i, key}, values);
      if (rt.cmp(rt.read(seen, key) == 1)) {
        rt.step("Return the computed result", `Return the computed result.`, [14, 11, 7], {}, values);
        return 1;
      }
      rt.write(seen, key, 1);
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [19, 16, 10], {}, values);
    return 0;
  },

  "maximum-subarray/optimal": (values, target, rt) => {
    let ending = 0;
    let best = 0;
    let i = 0;
    ending = rt.read(values, 0);
    best = ending;
    i = 1;
    while (rt.cmp(i < values.length)) {
      rt.step("Inspect the current state", `Choose between a fresh start and extending the segment.`, [13, 10, 6], {i, ending, best}, values);
      ending = Math.max(rt.read(values, i), (ending + rt.read(values, i)));
      best = Math.max(best, ending);
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [17, 14, 9], {}, values);
    return best;
  },

  "best-time-to-buy-and-sell-stock/optimal": (values, target, rt) => {
    let best = 0;
    let low = 0;
    let i = 0;
    best = 0;
    low = 1001;
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.step("Inspect the current state", `Test today's sale using the lowest earlier price ${low}.`, [13, 10, 6], {i, best, low}, values);
      best = Math.max(best, (rt.read(values, i) - low));
      low = Math.min(low, rt.read(values, i));
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [17, 14, 9], {}, values);
    return best;
  },

  "running-sum/optimal": (values, target, rt) => {
    let a: number[] = [];
    let total = 0;
    let i = 0;
    a = values.slice();
    total = 0;
    i = 0;
    while (rt.cmp(i < a.length)) {
      rt.step("Extend the prefix ending at the current value", `Extend the prefix ending at ${i}.`, [13, 10, 6], {i, total}, a);
      total = (total + rt.read(a, i));
      rt.write(a, i, total);
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [17, 14, 9], {}, a);
    return a;
  },

  "move-zeroes/optimal": (values, target, rt) => {
    let a: number[] = [];
    let write = 0;
    let i = 0;
    a = values.slice();
    write = 0;
    i = 0;
    while (rt.cmp(i < a.length)) {
      rt.step("Inspect the current state", `Decide whether the value at ${i} belongs at the write pointer ${write}.`, [13, 10, 6], {i, write}, a);
      if (rt.cmp(rt.read(a, i) != 0)) {
        rt.write(a, write, rt.read(a, i));
        write = (write + 1);
      }
      i = (i + 1);
    }
    while (rt.cmp(write < a.length)) {
      rt.step("Fill the remaining suffix with zeros", `Fill the remaining suffix with zeros.`, [20, 17, 11], {write}, a);
      rt.write(a, write, 0);
      write = (write + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [23, 20, 13], {}, a);
    return a;
  },
};
