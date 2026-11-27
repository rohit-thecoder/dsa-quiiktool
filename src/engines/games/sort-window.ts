import {
  level,
  numbers,
  randomFrom,
  shuffled,
  wrong,
  type Level,
  type Mark,
} from './core'

interface SortStep {
  a: number[]
  pair: number[]
  action: string
  message: string
  comparisons: number
  swaps: number
  boundary: number
}
export function sorting(n: number): Level {
  const count = 4 + Math.floor((n - 1) / 4),
    mode = ['Bubble', 'Selection', 'Insertion'][(n - 1) % 3]
  const a = shuffled(
    numbers(count).map((i) => 2 + i * 3),
    n * 493,
  )
  if (a.every((v, i) => !i || a[i - 1] < v)) a.reverse()
  const steps: SortStep[] = []
  let comparisons = 0,
    swaps = 0
  function add(
    pair: number[],
    action: string,
    message: string,
    boundary: number,
  ) {
    steps.push({
      a: [...a],
      pair,
      action,
      message,
      comparisons,
      swaps,
      boundary,
    })
  }
  function exchange(i: number, j: number) {
    if (i === j) return
    ;[a[i], a[j]] = [a[j], a[i]]
    swaps++
  }
  if (mode === 'Bubble') {
    for (let end = count - 1; end > 0; end--) {
      let changed = false
      for (let i = 0; i < end; i++) {
        const inverted = a[i] > a[i + 1]
        add(
          [i, i + 1],
          inverted ? 'swap' : 'keep',
          inverted
            ? 'The larger value moves one place right.'
            : 'The pair is already in ascending order.',
          end,
        )
        comparisons++
        if (inverted) {
          exchange(i, i + 1)
          changed = true
        }
      }
      if (!changed) break
    }
  } else if (mode === 'Insertion') {
    for (let i = 1; i < count; i++) {
      for (let j = i; j > 0; j--) {
        const inverted = a[j - 1] > a[j]
        add(
          [j - 1, j],
          inverted ? 'swap' : 'keep',
          inverted
            ? 'Shift the smaller item left through the sorted prefix.'
            : 'The inserted item has reached its place.',
          i,
        )
        comparisons++
        if (inverted) exchange(j - 1, j)
        else break
      }
    }
  } else {
    for (let i = 0; i < count - 1; i++) {
      let min = i
      for (let j = i + 1; j < count; j++) if (a[j] < a[min]) min = j
      add(
        [i],
        String(min),
        'The smallest remaining item belongs in position ' + (i + 1) + '.',
        i,
      )
      comparisons += count - i - 1
      exchange(i, min)
    }
  }
  const snapshot = (i: number): SortStep =>
    steps[i] ?? {
      a,
      pair: [],
      action: '',
      message: 'Sorted.',
      comparisons,
      swaps,
      boundary: count,
    }
  return level<number>(
    {
      title: mode + ' production line',
      goal:
        'Sort the belt in ascending order using ' +
        mode.toLowerCase() +
        ' sort.',
      instruction:
        mode === 'Selection'
          ? 'Choose the smallest item in the unfinished suffix. It swaps into the marked destination.'
          : 'Inspect the two marked items. Choose Swap when the left value exceeds the right value, or Keep to leave the pair in place.',
      lesson:
        mode === 'Bubble'
          ? 'Each pass places its largest unfinished item at the right boundary. A pass with no swaps proves the belt is sorted.'
          : mode === 'Insertion'
            ? 'Insertion sort grows a sorted prefix. The incoming item travels left until its predecessor is no larger.'
            : 'Selection sort finds the smallest remaining value before committing a single exchange for that position.',
    },
    0,
    {
      solved: (s) => s === steps.length,
      guide: (s) => steps[s].action,
      scene(s) {
        const frame = snapshot(s)
        return {
          layout: 'strip',
          tiles: frame.a.map((v, i) => ({
            id: String(i),
            value: String(v),
            label: 'Position ' + (i + 1) + ', value ' + v,
            caption: frame.pair.includes(i)
              ? mode === 'Selection'
                ? 'Place here'
                : 'Compare'
              : String(i + 1),
            disabled: mode !== 'Selection' || i < frame.boundary,
            mark: frame.pair.includes(i)
              ? 'active'
              : s === steps.length ||
                  (mode === 'Bubble'
                    ? i > frame.boundary
                    : i < frame.boundary && mode === 'Selection')
                ? 'done'
                : 'plain',
          })),
          controls:
            s < steps.length && mode !== 'Selection'
              ? [
                  { id: 'swap', label: 'Swap pair' },
                  { id: 'keep', label: 'Keep order' },
                ]
              : [],
          stats: [
            ['Comparisons', frame.comparisons],
            ['Swaps', frame.swaps],
            ['Array writes', 2 * frame.swaps],
          ],
        }
      },
      move(s, key) {
        if (key !== steps[s].action)
          return wrong(
            s,
            mode === 'Selection'
              ? 'Inspect the entire unfinished suffix for its minimum.'
              : 'Look at the left and right values. An ascending pair can stay in place.',
          )
        return { state: s + 1, feedback: steps[s].message }
      },
    },
  )
}

export function windowGame(n: number): Level {
  const size = 6 + Math.floor(n / 2),
    random = randomFrom(n * 12967)
  const mode = (n - 1) % 3,
    values = numbers(size).map(() =>
      mode === 1 ? 1 + random(5) : 1 + random(9),
    ),
    k = 2 + Math.floor(n / 6)
  const threshold = 6 + Math.floor(n * 1.3)
  if (mode === 2 && values.reduce((a, b) => a + b, 0) < threshold)
    values[0] += threshold
  type State = { left: number; right: number; won: boolean }
  const sum = (a: number[]) => a.reduce((p, q) => p + q, 0)
  let bestStart = 0,
    bestEnd = 0,
    best = mode === 2 ? Infinity : -1
  for (let l = 0; l < size; l++)
    for (let r = l; r < size; r++) {
      const arr = values.slice(l, r + 1),
        total = sum(arr)
      if (
        (mode === 0 && arr.length === k && total > best) ||
        (mode === 1 && new Set(arr).size === arr.length && arr.length > best) ||
        (mode === 2 && total >= threshold && arr.length < best)
      ) {
        best = mode === 0 ? total : arr.length
        bestStart = l
        bestEnd = r
      }
    }
  const usable = (s: State) => {
    const v = values.slice(s.left, s.right + 1)
    return mode === 0
      ? sum(v) === best
      : mode === 1
        ? v.length === best && new Set(v).size === v.length
        : v.length === best && sum(v) >= threshold
  }
  function guidance(s: State) {
    if (usable(s)) return 'collect'
    if (mode === 0) return s.left < bestStart ? 'next' : 'prev'
    if (s.left > bestStart) return 'grow-left'
    if (s.right < bestEnd) return 'grow-right'
    if (s.left < bestStart) return 'trim-left'
    return 'trim-right'
  }
  const labels: Record<string, string> = {
    prev: 'Slide left',
    next: 'Slide right',
    'grow-left': 'Expand left',
    'grow-right': 'Expand right',
    'trim-left': 'Shrink left',
    'trim-right': 'Shrink right',
    collect: 'Collect window',
  }
  return level<State>(
    {
      title: ['Peak cargo', 'Unique specimen run', 'Minimum shipment'][mode],
      goal:
        mode === 0
          ? 'Find the highest sum across exactly ' + k + ' adjacent crates.'
          : mode === 1
            ? 'Collect the longest consecutive run containing no repeated value.'
            : 'Find the shortest consecutive run whose sum is at least ' +
              threshold +
              '.',
      instruction:
        'Move the window boundaries and inspect the current cargo. Collect the window when it meets the objective.',
      lesson:
        mode === 0
          ? 'Sliding a fixed window drops one old value and adds one new value. Updating the sum costs constant time per slide.'
          : mode === 1
            ? 'When a value repeats, advance the left edge past the earlier copy. Every position enters and leaves the window at most once.'
            : 'Positive weights make the sum monotone as a boundary expands. After reaching the threshold, shrink the left edge to find a shorter valid window.',
    },
    { left: 0, right: mode === 0 ? k - 1 : 0, won: false },
    {
      solved: (s) => s.won,
      guide: guidance,
      scene(s) {
        const span = values.slice(s.left, s.right + 1),
          options: string[] = []
        if (mode === 0) {
          if (s.left > 0) options.push('prev')
          if (s.right < size - 1) options.push('next')
        } else {
          if (s.left > 0) options.push('grow-left')
          if (s.right < size - 1) options.push('grow-right')
          if (s.left < s.right) options.push('trim-left', 'trim-right')
        }
        options.push('collect')
        return {
          layout: 'strip',
          tiles: values.map((v, i) => ({
            id: String(i),
            label: 'Position ' + (i + 1) + ' value ' + v,
            value: String(v),
            disabled: true,
            mark: (i >= s.left && i <= s.right ? 'active' : 'plain') as Mark,
            caption:
              i === s.left && i === s.right
                ? 'L · R'
                : i === s.left
                  ? 'L'
                  : i === s.right
                    ? 'R'
                    : undefined,
          })),
          controls: options.map((id) => ({ id, label: labels[id] })),
          stats: [
            ['Sum', sum(span)],
            ['Length', span.length],
            ['Distinct', new Set(span).size],
          ],
        }
      },
      move(s, key) {
        if (key === 'collect')
          return usable(s)
            ? {
                state: { ...s, won: true },
                feedback:
                  'Optimal window collected. Positions ' +
                  (s.left + 1) +
                  ' through ' +
                  (s.right + 1) +
                  ' satisfy the goal.',
              }
            : wrong(
                s,
                'Another window improves this result. Compare adjacent runs and check the size or uniqueness condition.',
              )
        const l =
          s.left +
          Number(key === 'next' || key === 'trim-left') -
          Number(key === 'prev' || key === 'grow-left')
        const r =
          s.right +
          Number(key === 'next' || key === 'grow-right') -
          Number(key === 'prev' || key === 'trim-right')
        return {
          state: { left: l, right: r, won: false },
          feedback:
            'Window now covers positions ' +
            (l + 1) +
            ' through ' +
            (r + 1) +
            '.',
        }
      },
    },
  )
}
