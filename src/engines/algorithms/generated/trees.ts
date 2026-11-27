// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "preorder-traversal/optimal": (values, target, rt) => {
    let stack: number[] = [];
    let out: number[] = [];
    let top = 0;
    let count = 0;
    let node = 0;
    let right = 0;
    let left = 0;
    stack = Array<number>(values.length).fill(0);
    out = Array<number>(values.length).fill(0);
    if (rt.cmp(values.length == 0)) {
      rt.step("Return the computed result", `Return the computed result.`, [16, 13, 5], {}, values);
      return out;
    }
    top = 1;
    rt.write(stack, 0, 0);
    count = 0;
    while (rt.cmp(top > 0)) {
      top = (top - 1);
      node = rt.read(stack, top);
      rt.step("Visit the root of the pending subtree", `Visit the root of the pending subtree.`, [24, 21, 12], {node, count}, values);
      rt.write(out, count, rt.read(values, node));
      count = (count + 1);
      right = ((node * 2) + 2);
      left = ((node * 2) + 1);
      if (rt.cmp(right < values.length)) {
        rt.write(stack, top, right);
        top = (top + 1);
      }
      if (rt.cmp(left < values.length)) {
        rt.write(stack, top, left);
        top = (top + 1);
      }
    }
    rt.step("Return the computed result", `Return the computed result.`, [37, 34, 22], {}, values);
    return out;
  },

  "maximum-depth-of-binary-tree/optimal": (values, target, rt) => {
    let node = 0;
    let depth = 0;
    node = 0;
    depth = 0;
    while (rt.cmp(node < values.length)) {
      rt.step("Count the level at node the current value", `Count the level at node ${node}.`, [11, 8, 5], {node, depth}, values);
      depth = (depth + 1);
      node = ((node * 2) + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [14, 11, 7], {}, values);
    return depth;
  },
};
