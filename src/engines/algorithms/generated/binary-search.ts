// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "binary-search/optimal": (values, target, rt) => {
    let left = 0;
    let right = 0;
    let mid = 0;
    left = 0;
    right = (values.length - 1);
    while (rt.cmp(left <= right)) {
      mid = (left + Math.floor((right - left) / 2));
      rt.step("Inspect the current state", `Inspect midpoint ${mid} within the remaining bounds.`, [13, 10, 6], {left, mid, right, target}, values);
      if (rt.cmp(rt.read(values, mid) == target)) {
        rt.step("Return the computed result", `Return the computed result.`, [14, 11, 7], {}, values);
        return mid;
      }
      rt.step("Inspect the current state", `Determine which half can still contain ${target}.`, [16, 13, 8], {left, mid, right, target}, values);
      if (rt.cmp(rt.read(values, mid) < target)) {
        left = (mid + 1);
      } else {
        right = (mid - 1);
      }
    }
    rt.step("Return the computed result", `Return the computed result.`, [22, 19, 12], {}, values);
    return -1;
  },

  "search-insert-position/optimal": (values, target, rt) => {
    let left = 0;
    let right = 0;
    let mid = 0;
    left = 0;
    right = values.length;
    while (rt.cmp(left < right)) {
      mid = (left + Math.floor((right - left) / 2));
      rt.step("Inspect the current state", `Check which side of the boundary contains the midpoint.`, [13, 10, 6], {left, mid, right, target}, values);
      if (rt.cmp(rt.read(values, mid) < target)) {
        left = (mid + 1);
      } else {
        right = mid;
      }
    }
    rt.step("Return the computed result", `Return the computed result.`, [19, 16, 10], {}, values);
    return left;
  },

  "first-occurrence/optimal": (values, target, rt) => {
    let left = 0;
    let right = 0;
    let mid = 0;
    left = 0;
    right = values.length;
    while (rt.cmp(left < right)) {
      mid = (left + Math.floor((right - left) / 2));
      rt.step("Inspect the current state", `Check which side of the boundary contains the midpoint.`, [13, 10, 6], {left, mid, right, target}, values);
      if (rt.cmp(rt.read(values, mid) < target)) {
        left = (mid + 1);
      } else {
        right = mid;
      }
    }
    if ((rt.cmp(left < values.length) && rt.cmp(rt.read(values, left) == target))) {
      rt.step("Return the computed result", `Return the computed result.`, [20, 17, 11], {}, values);
      return left;
    }
    rt.step("Return the computed result", `Return the computed result.`, [22, 19, 12], {}, values);
    return -1;
  },

  "last-occurrence/optimal": (values, target, rt) => {
    let left = 0;
    let right = 0;
    let candidate = 0;
    let mid = 0;
    left = 0;
    right = values.length;
    while (rt.cmp(left < right)) {
      mid = (left + Math.floor((right - left) / 2));
      rt.step("Inspect the current state", `Check which side of the boundary contains the midpoint.`, [14, 11, 6], {left, mid, right, target}, values);
      if (rt.cmp(rt.read(values, mid) <= target)) {
        left = (mid + 1);
      } else {
        right = mid;
      }
    }
    candidate = (left - 1);
    if ((rt.cmp(candidate >= 0) && rt.cmp(rt.read(values, candidate) == target))) {
      rt.step("Return the computed result", `Return the computed result.`, [22, 19, 12], {}, values);
      return candidate;
    }
    rt.step("Return the computed result", `Return the computed result.`, [24, 21, 13], {}, values);
    return -1;
  },

  "integer-square-root/optimal": (values, target, rt) => {
    let low = 0;
    let high = 0;
    let best = 0;
    let mid = 0;
    low = 0;
    high = target;
    best = 0;
    while (rt.cmp(low <= high)) {
      mid = (low + Math.floor((high - low) / 2));
      rt.step("Inspect the current state", `Test candidate root ${mid} against the tile budget.`, [15, 12, 7], {low, mid, high, target, best}, values);
      if (rt.cmp((mid * mid) <= target)) {
        best = mid;
        low = (mid + 1);
      } else {
        high = (mid - 1);
      }
    }
    rt.step("Return the computed result", `Return the computed result.`, [22, 19, 12], {}, values);
    return best;
  },
};
