// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "valid-parentheses/optimal": (values, target, rt) => {
    let stack: number[] = [];
    let top = 0;
    let i = 0;
    stack = Array<number>(values.length).fill(0);
    top = 0;
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.step("Inspect the current state", `Read the next bracket with ${top} unmatched openings.`, [13, 10, 6], {i, top, stack}, values);
      if (rt.cmp(rt.read(values, i) == 1)) {
        rt.write(stack, top, i);
        top = (top + 1);
      } else {
        if (rt.cmp(top == 0)) {
          rt.step("This closing symbol has no opening partner", `This closing symbol has no opening partner.`, [18, 15, 11], {i, top, stack}, values);
          return 0;
        }
        top = (top - 1);
      }
      i = (i + 1);
    }
    if (rt.cmp(top == 0)) {
      rt.step("All opening symbols have partners", `All opening symbols have partners.`, [25, 22, 15], {top, stack}, values);
      return 1;
    }
    rt.step("Unmatched opening symbols remain", `Unmatched opening symbols remain.`, [27, 24, 16], {top, stack}, values);
    return 0;
  },

  "next-greater-element/optimal": (values, target, rt) => {
    let out: number[] = [];
    let stack: number[] = [];
    let top = 0;
    let i = 0;
    let old = 0;
    out = Array<number>(values.length).fill(0);
    stack = Array<number>(values.length).fill(0);
    top = 0;
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.write(out, i, -1);
      while ((rt.cmp(top > 0) && rt.cmp(rt.read(values, rt.read(stack, (top - 1))) < rt.read(values, i)))) {
        rt.step("Pop a smaller unresolved position", `Pop a smaller unresolved position.`, [18, 15, 9], {i, top, stack, out}, values);
        top = (top - 1);
        old = rt.read(stack, top);
        rt.write(out, old, rt.read(values, i));
      }
      rt.step("Push this position until a larger value arrives", `Push this position until a larger value arrives.`, [22, 19, 12], {i, top, stack, out}, values);
      rt.write(stack, top, i);
      top = (top + 1);
      i = (i + 1);
    }
    rt.step("Read the resolved answers in input order", `Read the resolved answers in input order.`, [26, 23, 15], {top, stack, out}, values);
    return out;
  },

  "daily-temperatures/optimal": (values, target, rt) => {
    let out: number[] = [];
    let stack: number[] = [];
    let top = 0;
    let i = 0;
    let old = 0;
    out = Array<number>(values.length).fill(0);
    stack = Array<number>(values.length).fill(0);
    top = 0;
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.write(out, i, 0);
      while ((rt.cmp(top > 0) && rt.cmp(rt.read(values, rt.read(stack, (top - 1))) < rt.read(values, i)))) {
        rt.step("Pop a smaller unresolved position", `Pop a smaller unresolved position.`, [18, 15, 9], {i, top, stack, out}, values);
        top = (top - 1);
        old = rt.read(stack, top);
        rt.write(out, old, (i - old));
      }
      rt.step("Push this position until a larger value arrives", `Push this position until a larger value arrives.`, [22, 19, 12], {i, top, stack, out}, values);
      rt.write(stack, top, i);
      top = (top + 1);
      i = (i + 1);
    }
    rt.step("Read the resolved answers in input order", `Read the resolved answers in input order.`, [26, 23, 15], {top, stack, out}, values);
    return out;
  },
};
