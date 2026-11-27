// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "reverse-linked-list/optimal": (values, target, rt) => {
    let links: number[] = [];
    let i = 0;
    let prev = 0;
    let cur = 0;
    let out: number[] = [];
    let nxt = 0;
    links = Array<number>(values.length).fill(0);
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.write(links, i, (i + 1));
      i = (i + 1);
    }
    if (rt.cmp(values.length > 0)) {
      rt.write(links, (values.length - 1), -1);
    }
    prev = -1;
    cur = 0;
    if (rt.cmp(values.length == 0)) {
      cur = -1;
    }
    while (rt.cmp(cur != -1)) {
      rt.step("Inspect the current state", `Save the original successor of node ${cur}.`, [27, 24, 14], {prev, cur, links}, values);
      nxt = rt.read(links, cur);
      rt.step("Inspect the current state", `Redirect node ${cur} toward its predecessor.`, [28, 25, 15], {prev, cur, nxt, links}, values);
      rt.write(links, cur, prev);
      prev = cur;
      cur = nxt;
    }
    out = Array<number>(values.length).fill(0);
    i = 0;
    while (rt.cmp(prev != -1)) {
      rt.step("Read from the reversed chain", `Read from the reversed chain.`, [35, 32, 21], {prev, links}, values);
      rt.write(out, i, rt.read(values, prev));
      prev = rt.read(links, prev);
      i = (i + 1);
    }
    rt.step("Return the reversed node values", `Return the reversed node values.`, [39, 36, 24], {links, out}, values);
    return out;
  },

  "middle-of-the-linked-list/optimal": (values, target, rt) => {
    let slow = 0;
    let fast = 0;
    if (rt.cmp(values.length == 0)) {
      rt.step("Return the computed result", `Return the computed result.`, [9, 6, 3], {}, values);
      return -1;
    }
    slow = 0;
    fast = 0;
    while (rt.cmp((fast + 1) < values.length)) {
      rt.step("Inspect the current state", `Move the slow cursor once for each two-node fast advance.`, [14, 11, 7], {slow, fast}, values);
      slow = (slow + 1);
      fast = (fast + 2);
    }
    rt.step("Inspect the current state", `The slow pointer identifies the second middle for even lengths.`, [17, 14, 9], {slow, fast}, values);
    return slow;
  },
};
