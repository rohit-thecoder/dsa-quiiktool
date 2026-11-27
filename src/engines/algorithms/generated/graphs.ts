// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "breadth-first-search/optimal": (values, target, rt) => {
    let n = 0;
    let seen: number[] = [];
    let queue: number[] = [];
    let head = 0;
    let tail = 0;
    let out: number[] = [];
    let i = 0;
    let node = 0;
    let neighbor = 0;
    n = 1;
    while (rt.cmp((n * n) < values.length)) {
      n = (n + 1);
    }
    seen = Array<number>(n).fill(0);
    queue = Array<number>(n).fill(0);
    rt.write(queue, 0, target);
    rt.write(seen, target, 1);
    head = 0;
    tail = 1;
    while (rt.cmp(head < tail)) {
      rt.step("Dequeue the next frontier vertex", `Dequeue the next frontier vertex.`, [26, 23, 12], {head, tail, seen, queue}, values);
      node = rt.read(queue, head);
      head = (head + 1);
      neighbor = 0;
      while (rt.cmp(neighbor < n)) {
        rt.step("Examine a possible outgoing edge", `Examine a possible outgoing edge.`, [30, 27, 16], {node, neighbor, seen}, values);
        if ((rt.cmp(rt.read(values, ((node * n) + neighbor)) == 1) && rt.cmp(rt.read(seen, neighbor) == 0))) {
          rt.write(seen, neighbor, 1);
          rt.write(queue, tail, neighbor);
          tail = (tail + 1);
        }
        neighbor = (neighbor + 1);
      }
    }
    out = Array<number>(tail).fill(0);
    i = 0;
    while (rt.cmp(i < tail)) {
      rt.write(out, i, rt.read(queue, i));
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [44, 41, 26], {}, values);
    return out;
  },

  "count-reachable-nodes/optimal": (values, target, rt) => {
    let n = 0;
    let seen: number[] = [];
    let queue: number[] = [];
    let head = 0;
    let tail = 0;
    let node = 0;
    let neighbor = 0;
    n = 1;
    while (rt.cmp((n * n) < values.length)) {
      n = (n + 1);
    }
    seen = Array<number>(n).fill(0);
    queue = Array<number>(n).fill(0);
    rt.write(queue, 0, target);
    rt.write(seen, target, 1);
    head = 0;
    tail = 1;
    while (rt.cmp(head < tail)) {
      rt.step("Dequeue the next frontier vertex", `Dequeue the next frontier vertex.`, [24, 21, 12], {head, tail, seen, queue}, values);
      node = rt.read(queue, head);
      head = (head + 1);
      neighbor = 0;
      while (rt.cmp(neighbor < n)) {
        rt.step("Examine a possible outgoing edge", `Examine a possible outgoing edge.`, [28, 25, 16], {node, neighbor, seen}, values);
        if ((rt.cmp(rt.read(values, ((node * n) + neighbor)) == 1) && rt.cmp(rt.read(seen, neighbor) == 0))) {
          rt.write(seen, neighbor, 1);
          rt.write(queue, tail, neighbor);
          tail = (tail + 1);
        }
        neighbor = (neighbor + 1);
      }
    }
    rt.step("Return the computed result", `Return the computed result.`, [36, 33, 21], {}, values);
    return tail;
  },
};
