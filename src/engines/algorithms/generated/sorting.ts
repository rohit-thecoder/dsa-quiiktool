// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "selection-sort/optimal": (values, target, rt) => {
    let a: number[] = [];
    let i = 0;
    let smallest = 0;
    let j = 0;
    a = values.slice();
    i = 0;
    while (rt.cmp((i + 1) < a.length)) {
      smallest = i;
      j = (i + 1);
      while (rt.cmp(j < a.length)) {
        rt.step("Inspect the current state", `Compare candidate ${j} with minimum position ${smallest}.`, [16, 13, 8], {i, j, smallest}, a);
        if (rt.cmp(rt.read(a, j) < rt.read(a, smallest))) {
          smallest = j;
        }
        j = (j + 1);
      }
      if (rt.cmp(smallest != i)) {
        rt.step("Place the selected minimum at the current value", `Place the selected minimum at ${i}.`, [22, 19, 12], {i, smallest}, a);
        rt.swap(a, i, smallest);
      }
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [26, 23, 14], {}, a);
    return a;
  },

  "bubble-sort/optimal": (values, target, rt) => {
    let a: number[] = [];
    let end = 0;
    let changed = 0;
    let i = 0;
    let j = 0;
    a = values.slice();
    end = (a.length - 1);
    while (rt.cmp(end > 0)) {
      changed = 0;
      i = 0;
      while (rt.cmp(i < end)) {
        j = (i + 1);
        rt.step("Inspect the current state", `Compare neighbouring positions ${i} and ${j}.`, [18, 15, 9], {i, j, end}, a);
        if (rt.cmp(rt.read(a, i) > rt.read(a, j))) {
          rt.step("Exchange the inverted neighbours", `Exchange the inverted neighbours.`, [19, 16, 10], {i, j}, a);
          rt.swap(a, i, j);
          changed = 1;
        }
        i = (i + 1);
      }
      if (rt.cmp(changed == 0)) {
        break;
      }
      end = (end - 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [29, 26, 16], {}, a);
    return a;
  },

  "insertion-sort/optimal": (values, target, rt) => {
    let a: number[] = [];
    let i = 0;
    let key = 0;
    let j = 0;
    a = values.slice();
    i = 1;
    while (rt.cmp(i < a.length)) {
      key = rt.read(a, i);
      j = (i - 1);
      while ((rt.cmp(j >= 0) && rt.cmp(rt.read(a, j) > key))) {
        rt.step("Inspect the current state", `Shift a larger item right to make room for ${key}.`, [16, 13, 8], {i, j, key}, a);
        rt.write(a, (j + 1), rt.read(a, j));
        j = (j - 1);
      }
      rt.step("Insert the saved key in the gap", `Insert the saved key in the gap.`, [19, 16, 10], {i, j, key}, a);
      rt.write(a, (j + 1), key);
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [22, 19, 12], {}, a);
    return a;
  },

  "merge-sort/optimal": (values, target, rt) => {
    let a: number[] = [];
    let buf: number[] = [];
    let width = 0;
    let start = 0;
    let mid = 0;
    let end = 0;
    let left = 0;
    let right = 0;
    let out = 0;
    a = values.slice();
    buf = Array<number>(a.length).fill(0);
    width = 1;
    while (rt.cmp(width < a.length)) {
      start = 0;
      while (rt.cmp(start < a.length)) {
        mid = Math.min((start + width), a.length);
        end = Math.min(((start + width) + width), a.length);
        left = start;
        right = mid;
        out = start;
        while (rt.cmp(out < end)) {
          rt.step("Inspect the current state", `Select the smaller head from the two runs of width ${width}.`, [27, 24, 14], {left, right, out, width, buf}, a);
          if ((rt.cmp(left < mid) && (rt.cmp(right >= end) || rt.cmp(rt.read(a, left) <= rt.read(a, right))))) {
            rt.write(buf, out, rt.read(a, left));
            left = (left + 1);
          } else {
            rt.write(buf, out, rt.read(a, right));
            right = (right + 1);
          }
          out = (out + 1);
        }
        start = end;
      }
      rt.step("The merged buffer becomes the next pass", `The merged buffer becomes the next pass.`, [38, 35, 22], {width, buf}, a);
      a = buf.slice();
      width = (width * 2);
    }
    rt.step("Return the computed result", `Return the computed result.`, [41, 38, 24], {}, a);
    return a;
  },
};
