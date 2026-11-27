// Generated from the reviewed Python kernels in ../authoring.
import type { Runner } from "../model";
export const runners: Record<string, Runner> = {
  "jump-game/optimal": (values, target, rt) => {
    let reach = 0;
    let i = 0;
    reach = 0;
    i = 0;
    while (rt.cmp(i < values.length)) {
      rt.step("Inspect the current state", `Verify that position ${i} lies within the frontier ${reach}.`, [11, 8, 5], {i, reach}, values);
      if (rt.cmp(i > reach)) {
        rt.step("Return the computed result", `Return the computed result.`, [12, 9, 6], {}, values);
        return 0;
      }
      reach = Math.max(reach, (i + rt.read(values, i)));
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [17, 14, 9], {}, values);
    return 1;
  },

  "minimum-jumps/optimal": (values, target, rt) => {
    let reach = 0;
    let end = 0;
    let jumps = 0;
    let i = 0;
    reach = 0;
    end = 0;
    jumps = 0;
    i = 0;
    while (rt.cmp(i < (values.length - 1))) {
      reach = Math.max(reach, (i + rt.read(values, i)));
      rt.step("Inspect the current state", `Finish the current jump frontier at ${end}.`, [16, 13, 8], {i, end, reach, jumps}, values);
      if (rt.cmp(i == end)) {
        if (rt.cmp(reach == end)) {
          rt.step("Return the computed result", `Return the computed result.`, [18, 15, 10], {}, values);
          return -1;
        }
        end = reach;
        jumps = (jumps + 1);
      }
      i = (i + 1);
    }
    rt.step("Return the computed result", `Return the computed result.`, [25, 22, 14], {}, values);
    return jumps;
  },
};
