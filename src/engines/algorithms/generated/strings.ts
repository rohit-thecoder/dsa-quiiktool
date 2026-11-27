// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "valid-palindrome/optimal": (values, target, rt) => {
    let left = 0;
    let right = 0;
    left = 0;
    right = (values.length - 1);
    while (rt.cmp(left < right)) {
      rt.step("Inspect the current state", `Compare the letters at ${left} and ${right}.`, [11, 8, 5], {left, right}, values);
      if (rt.cmp(rt.read(values, left) != rt.read(values, right))) {
        rt.step("Return the computed result", `Return the computed result.`, [12, 9, 6], {}, values);
        return 0;
      }
      left = (left + 1);
      right = (right - 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [17, 14, 9], {}, values);
    return 1;
  },

  "first-unique-character/optimal": (values, target, rt) => {
    let counts: number[] = [];
    let i = 0;
    let letter = 0;
    counts = Array<number>(26).fill(0);
    i = 0;
    while (rt.cmp(i < values.length)) {
      letter = rt.read(values, i);
      rt.step("Increase this letter's frequency", `Increase this letter's frequency.`, [13, 10, 6], {i, letter}, values);
      rt.write(counts, letter, (rt.read(counts, letter) + 1));
      i = (i + 1);
    }
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.step("Test uniqueness in original input order", `Test uniqueness in original input order.`, [18, 15, 10], {i}, values);
      if (rt.cmp(rt.read(counts, rt.read(values, i)) == 1)) {
        rt.step("Return the computed result", `Return the computed result.`, [19, 16, 11], {}, values);
        return i;
      }
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [23, 20, 13], {}, values);
    return -1;
  },

  "longest-run/optimal": (values, target, rt) => {
    let run = 0;
    let best = 0;
    let i = 0;
    run = 0;
    best = 0;
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.step("Inspect the current state", `Check whether the character continues the current run of ${run}.`, [13, 10, 6], {i, run, best}, values);
      if ((rt.cmp(i > 0) && rt.cmp(rt.read(values, i) == rt.read(values, (i - 1))))) {
        run = (run + 1);
      } else {
        run = 1;
      }
      best = Math.max(run, best);
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [21, 18, 12], {}, values);
    return best;
  },
};
