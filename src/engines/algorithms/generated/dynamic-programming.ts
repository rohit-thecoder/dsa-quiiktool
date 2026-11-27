// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "climbing-stairs/optimal": (values, target, rt) => {
    let prev = 0;
    let curr = 0;
    let i = 0;
    let ways = 0;
    prev = 1;
    curr = 1;
    i = 2;
    while (rt.cmp(i <= target)) {
      rt.step("Combine the two predecessor route counts", `Combine the two predecessor route counts.`, [14, 11, 6], {i, prev, curr, target}, values);
      ways = (prev + curr);
      prev = curr;
      curr = ways;
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [19, 16, 10], {}, values);
    return curr;
  },

  "house-robber/optimal": (values, target, rt) => {
    let twoBack = 0;
    let best = 0;
    let i = 0;
    let nextBest = 0;
    twoBack = 0;
    best = 0;
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.step("Compare skipping this position with taking it", `Compare skipping this position with taking it.`, [14, 11, 6], {i, twoBack, best}, values);
      nextBest = Math.max(best, (twoBack + rt.read(values, i)));
      twoBack = best;
      best = nextBest;
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [19, 16, 10], {}, values);
    return best;
  },

  "coin-change/optimal": (values, target, rt) => {
    let dp: number[] = [];
    let amount = 0;
    let i = 0;
    let coin = 0;
    dp = Array<number>((target + 1)).fill(0);
    amount = 1;
    while (rt.cmp(amount <= target)) {
      rt.write(dp, amount, (target + 1));
      i = 0;
      while (rt.cmp(i < values.length)) {
        coin = rt.read(values, i);
        if (rt.cmp(coin <= amount)) {
          rt.step("Inspect the current state", `Try a final coin of ${coin} for amount ${amount}.`, [18, 15, 10], {amount, i, coin}, dp);
          rt.write(dp, amount, Math.min(rt.read(dp, amount), (rt.read(dp, (amount - coin)) + 1)));
        }
        i = (i + 1);
      }
      amount = (amount + 1);
    }
    if (rt.cmp(rt.read(dp, target) > target)) {
      rt.step("Return the computed result", `Return the computed result.`, [25, 22, 14], {}, dp);
      return -1;
    }
    rt.step("Return the computed result", `Return the computed result.`, [27, 24, 15], {}, dp);
    return rt.read(dp, target);
  },

  "unique-paths/optimal": (values, target, rt) => {
    let dp: number[] = [];
    let i = 0;
    dp = Array<number>(values.length).fill(0);
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.step("A blocked cell receives no routes", `A blocked cell receives no routes.`, [11, 8, 5], {i}, dp);
      if (rt.cmp(rt.read(values, i) == 0)) {
        if (rt.cmp(i == 0)) {
          rt.write(dp, i, 1);
        } else {
          if (rt.cmp(i >= target)) {
            rt.write(dp, i, rt.read(dp, (i - target)));
          }
          if (rt.cmp((i % target) > 0)) {
            rt.write(dp, i, (rt.read(dp, i) + rt.read(dp, (i - 1))));
          }
        }
      }
      rt.step("The route count for this cell is ready", `The route count for this cell is ready.`, [23, 20, 13], {i}, dp);
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [25, 22, 14], {}, dp);
    return rt.read(dp, (values.length - 1));
  },

  "minimum-path-sum/optimal": (values, target, rt) => {
    let dp: number[] = [];
    let i = 0;
    dp = values.slice();
    i = 1;
    while (rt.cmp(i < dp.length)) {
      if (rt.cmp(i < target)) {
        rt.step("The first row can only be reached from the left", `The first row can only be reached from the left.`, [12, 9, 6], {i}, dp);
        rt.write(dp, i, (rt.read(dp, i) + rt.read(dp, (i - 1))));
      } else {
        if (rt.cmp((i % target) == 0)) {
          rt.step("The first column can only be reached from above", `The first column can only be reached from above.`, [15, 12, 9], {i}, dp);
          rt.write(dp, i, (rt.read(dp, i) + rt.read(dp, (i - target))));
        } else {
          rt.step("Add the cheaper predecessor cost", `Add the cheaper predecessor cost.`, [17, 14, 11], {i}, dp);
          rt.write(dp, i, (rt.read(dp, i) + Math.min(rt.read(dp, (i - target)), rt.read(dp, (i - 1)))));
        }
      }
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [22, 19, 13], {}, dp);
    return rt.read(dp, (dp.length - 1));
  },
};
