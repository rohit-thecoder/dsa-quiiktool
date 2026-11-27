// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "factorial/optimal": (values, target, rt) => {
    let stack: number[] = [];
    let top = 0;
    let n = 0;
    let result = 0;
    stack = Array<number>(target).fill(0);
    top = 0;
    n = target;
    while (rt.cmp(n > 0)) {
      rt.step("Push a pending factorial argument", `Push a pending factorial argument.`, [14, 11, 6], {n, top, stack}, values);
      rt.write(stack, top, n);
      top = (top + 1);
      n = (n - 1);
    }
    result = 1;
    while (rt.cmp(top > 0)) {
      rt.step("Unwind one pending multiplication", `Unwind one pending multiplication.`, [20, 17, 11], {top, stack, result}, values);
      top = (top - 1);
      result = (result * rt.read(stack, top));
    }
    rt.step("Every deferred multiplication has returned", `Every deferred multiplication has returned.`, [23, 20, 13], {result, top, stack}, values);
    return result;
  },
};
