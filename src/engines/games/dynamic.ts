import { level, numbers, randomFrom, wrong, type Level } from './core'

export function dynamic(n: number): Level {
  const mode = (n - 1) % 5
  if (mode === 2) return coins(n)
  if (mode === 3) return pack(n)
  const size = 3 + Math.floor((n - 1) / 6),
    goal = size * size - 1,
    random = randomFrom(n * 13195),
    min = mode === 0
  const cells = numbers(size * size).map(() => (mode === 4 ? 0 : 1 + random(8)))
  if (mode === 4) {
    // A clear top row and right column guarantee a route to the exit.
    for (const i of numbers(cells.length))
      cells[i] = i < size || i % size === size - 1 || random(4) !== 0 ? 1 : 0
  }
  const dest = (i: number) => [
    ...(i % size < size - 1 ? [i + 1] : []),
    ...(i < size * (size - 1) ? [i + size] : []),
  ]
  const dp = Array<number>(cells.length).fill(0)
  for (let i = goal; i >= 0; i--) {
    if (mode === 4)
      dp[i] = !cells[i]
        ? 0
        : i === goal
          ? 1
          : dest(i).reduce((a, j) => a + dp[j], 0)
    else
      dp[i] =
        cells[i] +
        (i === goal
          ? 0
          : (min ? Math.min : Math.max)(...dest(i).map((j) => dp[j])))
  }
  const title =
    mode === 4 ? 'Route census' : min ? 'Low-cost crossing' : 'Reward trail'
  type State = { path: number[]; reveal: number }
  return level<State>(
    {
      title,
      goal:
        mode === 4
          ? 'Reach the exit along open cells. Explore the DP table to see how many right/down routes exist.'
          : 'Reach the exit with the ' +
            (min ? 'smallest cost' : 'largest reward') +
            ' including both endpoints.',
      instruction:
        'Select the next cell to the right or below. Reveal table rows from the exit backwards to see which choices can complete the objective.',
      lesson:
        mode === 4
          ? 'A blocked cell has zero routes. Each open cell takes the sum of the route counts to its right and below. The exit contributes one route.'
          : 'The optimal suffix from a cell consists of its own value plus the ' +
            (min ? 'minimum' : 'maximum') +
            ' of its reachable neighbors’ suffix values.',
    },
    { path: [0], reveal: 0 },
    {
      solved: (s) => s.path.at(-1) === goal,
      guide(s) {
        const i = s.path.at(-1)!
        return String(
          dest(i).find((j) =>
            mode === 4 ? dp[j] > 0 : dp[i] === cells[i] + dp[j],
          ),
        )
      },
      scene(s) {
        const at = s.path.at(-1)!
        return {
          layout: 'grid',
          columns: size,
          tiles: cells.map((v, i) => ({
            id: String(i),
            value: mode === 4 ? (v ? '·' : '▧') : String(v),
            label:
              'Cell ' +
              (Math.floor(i / size) + 1) +
              ', ' +
              ((i % size) + 1) +
              (mode === 4 ? (v ? ' open' : ' blocked') : ': ' + v),
            disabled: mode === 4 && !v,
            mark:
              at === i
                ? 'active'
                : i === goal
                  ? 'goal'
                  : s.path.includes(i)
                    ? 'done'
                    : mode === 4 && !v
                      ? 'blocked'
                      : 'plain',
            caption: at === i ? 'You' : i === goal ? 'Exit' : undefined,
          })),
          stats: [
            ['Steps', s.path.length - 1],
            [
              mode === 4 ? 'Routes from start' : 'Collected',
              mode === 4
                ? s.reveal === size || at === goal
                  ? dp[0]
                  : 'Reveal table'
                : s.path.reduce((a, i) => a + cells[i], 0),
            ],
          ],
          controls:
            s.reveal < size
              ? [{ id: 'reveal', label: 'Reveal next DP row' }]
              : [],
          table: s.reveal
            ? {
                label: 'Suffix table · rows calculated from the exit',
                cells: numbers(size).map((r) =>
                  numbers(size).map((c) =>
                    r >= size - s.reveal ? dp[r * size + c] : '·',
                  ),
                ),
              }
            : undefined,
        }
      },
      move(s, key) {
        if (key === 'reveal')
          return {
            state: { ...s, reveal: s.reveal + 1 },
            feedback: 'Computed the next suffix row from known neighbors.',
            cost: 0,
          }
        const i = s.path.at(-1)!,
          j = Number(key)
        if (!dest(i).includes(j))
          return wrong(s, 'Move exactly one cell right or down.')
        if (mode === 4 ? dp[j] === 0 : dp[i] !== cells[i] + dp[j])
          return wrong(
            s,
            mode === 4
              ? 'This cell has no open route to the exit. Inspect the suffix table.'
              : 'That branch gives a weaker total. Reveal suffix values to compare the two directions.',
          )
        return {
          state: { ...s, path: [...s.path, j] },
          feedback:
            'Moved to row ' +
            (Math.floor(j / size) + 1) +
            ', column ' +
            ((j % size) + 1) +
            '.',
        }
      },
    },
  )
}

function coins(n: number): Level {
  const values = [1, 3 + (n % 3), 5 + Math.floor(n / 4)],
    amount = 9 + n
  const dp = [0]
  for (let i = 1; i <= amount; i++)
    dp[i] = 1 + Math.min(...values.filter((v) => v <= i).map((v) => dp[i - v]))
  type State = { remaining: number; chosen: number[]; reveal: number }
  return level<State>(
    {
      title: 'Exact-change vault',
      goal: 'Pay exactly ' + amount + ' using the fewest coins.',
      instruction:
        'Choose a denomination to add one coin. Coins are reusable. Reveal the minimum coin counts for smaller amounts to compare possible moves.',
      lesson:
        'For each amount try every affordable last coin, then add one to the smallest remainder count. A denomination of one makes every remainder reachable.',
    },
    { remaining: amount, chosen: [], reveal: 0 },
    {
      solved: (s) => s.remaining === 0,
      guide: (s) =>
        String(
          values.find(
            (v) =>
              v <= s.remaining && dp[s.remaining] === dp[s.remaining - v] + 1,
          ),
        ),
      scene: (s) => ({
        layout: 'strip',
        tiles: values.map((v) => ({
          id: String(v),
          label: 'Use coin ' + v,
          value: String(v),
          caption: 'Coin',
          disabled: v > s.remaining,
        })),
        controls:
          s.reveal < amount
            ? [{ id: 'reveal', label: 'Reveal next four amounts' }]
            : [],
        stats: [
          ['Remaining', s.remaining],
          ['Coins used', s.chosen.length],
          ['Purse', s.chosen.join(' + ') || 'Empty'],
        ],
        table: {
          label: 'Amount and fewest coins',
          cells: [numbers(s.reveal + 1), dp.slice(0, s.reveal + 1)],
        },
      }),
      move(s, key) {
        if (key === 'reveal')
          return {
            state: { ...s, reveal: Math.min(amount, s.reveal + 4) },
            feedback: 'Each new count reuses an earlier remainder.',
            cost: 0,
          }
        const v = Number(key)
        if (dp[s.remaining - v] + 1 !== dp[s.remaining])
          return wrong(
            s,
            'This denomination needs more coins overall. Compare the minimum counts for each possible remainder.',
          )
        return {
          state: { ...s, remaining: s.remaining - v, chosen: [...s.chosen, v] },
          feedback:
            'Added coin ' +
            v +
            '. Remaining amount is ' +
            (s.remaining - v) +
            '.',
        }
      },
    },
  )
}

function pack(n: number): Level {
  const random = randomFrom(n * 51495),
    capacity = 7 + Math.floor(n / 2)
  const goods = numbers(3 + Math.floor(n / 3)).map((i) => ({
    name: String.fromCharCode(65 + i),
    w: 2 + random(5),
    v: 2 + random(9),
  }))
  const rows = [Array<number>(capacity + 1).fill(0)]
  for (const item of goods) {
    const previous = rows.at(-1)!
    rows.push(
      numbers(capacity + 1).map((c) =>
        c < item.w
          ? previous[c]
          : Math.max(previous[c], item.v + previous[c - item.w]),
      ),
    )
  }
  const best = rows.at(-1)![capacity],
    optimal: number[] = []
  let cap = capacity
  for (let i = goods.length; i > 0; i--)
    if (rows[i][cap] !== rows[i - 1][cap]) {
      optimal.push(i - 1)
      cap -= goods[i - 1].w
    }
  type State = { chosen: number[]; won: boolean; reveal: number }
  const total = (s: State, prop: 'w' | 'v') =>
    s.chosen.reduce((sum, i) => sum + goods[i][prop], 0)
  return level<State>(
    {
      title: 'Cargo manifest',
      goal:
        'Maximize cargo value within a capacity of ' +
        capacity +
        '. Each item can be packed once.',
      instruction:
        'Toggle cargo items, then seal the manifest. Reveal DP rows to compare the best value at every capacity for successive items.',
      lesson:
        'Each row compares omitting an item with taking it and looking up the remaining capacity in the previous row. This prevents reusing the same item.',
    },
    { chosen: [], won: false, reveal: 0 },
    {
      solved: (s) => s.won,
      guide(s) {
        if (total(s, 'w') <= capacity && total(s, 'v') === best) return 'seal'
        return String(
          s.chosen.find((i) => !optimal.includes(i)) ??
            optimal.find((i) => !s.chosen.includes(i)),
        )
      },
      scene: (s) => ({
        layout: 'strip',
        tiles: goods.map((v, i) => ({
          id: String(i),
          label: 'Toggle item ' + v.name + ', weight ' + v.w + ', value ' + v.v,
          value: v.name,
          caption: v.w + ' kg · ' + v.v + ' pts',
          mark: s.chosen.includes(i) ? 'active' : 'plain',
        })),
        controls: [
          { id: 'seal', label: 'Seal manifest' },
          ...(s.reveal < goods.length
            ? [{ id: 'reveal', label: 'Reveal next item row' }]
            : []),
        ],
        stats: [
          ['Weight', total(s, 'w') + ' / ' + capacity],
          ['Value', total(s, 'v')],
        ],
        table: s.reveal
          ? {
              label: 'Best value · columns are capacities 0 to ' + capacity,
              cells: rows.slice(0, s.reveal + 1),
            }
          : undefined,
      }),
      move(s, key) {
        if (key === 'reveal')
          return {
            state: { ...s, reveal: s.reveal + 1 },
            feedback:
              'Computed the best load with one additional candidate item.',
            cost: 0,
          }
        if (key === 'seal') {
          if (total(s, 'w') > capacity)
            return wrong(s, 'Capacity exceeded. Unpack at least one item.')
          if (total(s, 'v') !== best)
            return wrong(
              s,
              'A higher-value feasible load exists. Compare the choices in the DP table.',
            )
          return {
            state: { ...s, won: true },
            feedback: 'Manifest sealed with the optimal value of ' + best + '.',
          }
        }
        const i = Number(key),
          exists = s.chosen.includes(i)
        return {
          state: {
            ...s,
            chosen: exists ? s.chosen.filter((x) => x !== i) : [...s.chosen, i],
          },
          feedback: (exists ? 'Unpacked ' : 'Packed ') + goods[i].name + '.',
        }
      },
    },
  )
}
