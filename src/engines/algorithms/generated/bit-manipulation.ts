// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "single-number/optimal": (values, target, rt) => {
    let result = 0;
    let i = 0;
    result = 0;
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.step("Inspect the current state", `Toggle the value at position ${i} into the running XOR.`, [11, 8, 5], {i, result}, values);
      result = (result ^ rt.read(values, i));
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [14, 11, 7], {}, values);
    return result;
  },

  "missing-number/optimal": (values, target, rt) => {
    let result = 0;
    let i = 0;
    result = values.length;
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.step("Inspect the current state", `Cancel the expected index and supplied value together.`, [11, 8, 5], {i, result}, values);
      result = ((result ^ i) ^ rt.read(values, i));
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [14, 11, 7], {}, values);
    return result;
  },

  "number-of-1-bits/optimal": (values, target, rt) => {
    let bits = 0;
    let count = 0;
    bits = target;
    count = 0;
    while (rt.cmp(bits > 0)) {
      rt.step("Clear the lowest set bit in the current value", `Clear the lowest set bit in ${bits}.`, [11, 8, 5], {bits, count}, values);
      bits = (bits & (bits - 1));
      count = (count + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [14, 11, 7], {}, values);
    return count;
  },

  "power-of-two/optimal": (values, target, rt) => {
    let remaining = 0;
    rt.step("Reject a nonpositive target before inspecting bits", `Reject a nonpositive target before inspecting bits.`, [7, 4, 2], {target}, values);
    if (rt.cmp(target <= 0)) {
      rt.step("Return the computed result", `Return the computed result.`, [8, 5, 3], {}, values);
      return 0;
    }
    remaining = (target & (target - 1));
    rt.step("Inspect the current state", `Inspect the bits left after clearing the lowest one.`, [11, 8, 5], {target, remaining}, values);
    if (rt.cmp(remaining == 0)) {
      rt.step("Return the computed result", `Return the computed result.`, [12, 9, 6], {}, values);
      return 1;
    }
    rt.step("Return the computed result", `Return the computed result.`, [14, 11, 7], {}, values);
    return 0;
  },

  "counting-bits/optimal": (values, target, rt) => {
    let dp: number[] = [];
    let i = 0;
    dp = Array<number>((target + 1)).fill(0);
    i = 1;
    while (rt.cmp(i <= target)) {
      rt.step("Reuse the shorter prefix and add its final bit", `Reuse the shorter prefix and add its final bit.`, [11, 8, 5], {i}, dp);
      rt.write(dp, i, (rt.read(dp, Math.floor(i / 2)) + (i & 1)));
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [14, 11, 7], {}, dp);
    return dp;
  },
};
