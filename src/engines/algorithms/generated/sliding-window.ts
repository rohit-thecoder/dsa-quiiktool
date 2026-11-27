// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "maximum-sum-subarray-of-size-k/optimal": (values, target, rt) => {
    let total = 0;
    let right = 0;
    let best = 0;
    let left = 0;
    total = 0;
    right = 0;
    while (rt.cmp(right < target)) {
      rt.step("Build the first window", `Build the first window.`, [13, 10, 5], {right, total, target}, values);
      total = (total + rt.read(values, right));
      right = (right + 1);
    }
    best = total;
    left = 0;
    while (rt.cmp(right < values.length)) {
      rt.step("Slide one place by replacing the outgoing value", `Slide one place by replacing the outgoing value.`, [19, 16, 10], {left, right, total}, values);
      total = ((total - rt.read(values, left)) + rt.read(values, right));
      best = Math.max(best, total);
      left = (left + 1);
      right = (right + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [24, 21, 14], {}, values);
    return best;
  },

  "minimum-size-subarray-sum/optimal": (values, target, rt) => {
    let left = 0;
    let right = 0;
    let total = 0;
    let best = 0;
    left = 0;
    right = 0;
    total = 0;
    best = (values.length + 1);
    while (rt.cmp(right < values.length)) {
      rt.step("Expand the window at the current value", `Expand the window at ${right}.`, [15, 12, 7], {left, right, total}, values);
      total = (total + rt.read(values, right));
      while (rt.cmp(total >= target)) {
        rt.step("A qualifying window can now shrink", `A qualifying window can now shrink.`, [17, 14, 9], {left, right, total, best}, values);
        best = Math.min(best, ((right - left) + 1));
        total = (total - rt.read(values, left));
        left = (left + 1);
      }
      right = (right + 1);
    }
    if (rt.cmp(best > values.length)) {
      rt.step("Return the computed result", `Return the computed result.`, [24, 21, 14], {}, values);
      return 0;
    }
    rt.step("Return the computed result", `Return the computed result.`, [26, 23, 15], {}, values);
    return best;
  },

  "longest-substring-without-repeating-characters/optimal": (values, target, rt) => {
    let last: number[] = [];
    let left = 0;
    let right = 0;
    let best = 0;
    let key = 0;
    last = Array<number>(26).fill(0);
    left = 0;
    right = 0;
    best = 0;
    while (rt.cmp(right < values.length)) {
      key = rt.read(values, right);
      rt.step("Inspect the current state", `Exclude the previous occurrence when it lies inside this window.`, [17, 14, 8], {left, right, key}, values);
      left = Math.max(left, rt.read(last, key));
      best = Math.max(best, ((right - left) + 1));
      rt.write(last, key, (right + 1));
      right = (right + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [22, 19, 12], {}, values);
    return best;
  },
};
