import { level, numbers, randomFrom, shuffled, wrong, type Level } from './core'

function neighbors(i: number, side: number) {
  const next: number[] = []
  if (i % side > 0) next.push(i - 1)
  if (i % side < side - 1) next.push(i + 1)
  if (i >= side) next.push(i - side)
  if (i < side * (side - 1)) next.push(i + side)
  return next
}

/** Unweighted mode expands a FIFO frontier; weighted mode settles the minimum-distance vertex. */
export function shortestRoute(
  weights: number[],
  side: number,
  start: number,
  weighted: boolean,
) {
  const goal = weights.length - 1,
    frontier = [start],
    parent = new Map<number, number>()
  const distance = Array<number>(weights.length).fill(Infinity),
    settled = new Set<number>()
  distance[start] = 0
  while (frontier.length) {
    if (weighted) frontier.sort((a, b) => distance[a] - distance[b])
    const u = frontier.shift()!
    if (settled.has(u)) continue
    settled.add(u)
    if (u === goal) break
    for (const v of neighbors(u, side)) {
      if (!weights[v]) continue
      const cost = distance[u] + (weighted ? weights[v] : 1)
      if (cost >= distance[v]) continue
      distance[v] = cost
      parent.set(v, u)
      frontier.push(v)
    }
  }
  const path = [goal]
  if (!Number.isFinite(distance[goal])) return { path: [], cost: Infinity }
  while (path[0] !== start) path.unshift(parent.get(path[0])!)
  return { path, cost: distance[goal] }
}

export function maze(n: number): Level {
  const side = 4 + Math.floor((n - 1) / 5),
    goal = side * side - 1
  const random = randomFrom(n * 71933),
    weighted = n >= 5
  const weights = numbers(side * side).map((i) => {
    const rim =
      i % side === 0 || i % side === side - 1 || i < side || i > goal - side
    if (!rim && random(4) === 0) return 0
    return weighted ? 1 + random(4) : 1
  })
  const bfs = shortestRoute(weights, side, 0, false),
    best = shortestRoute(weights, side, 0, true)
  type State = { path: number[]; cost: number }
  return level<State>(
    {
      title: weighted ? 'Terrain tolls' : 'Grid expedition',
      goal: 'Reach the exit in the lower-right corner.',
      instruction:
        'Tap an open square beside the explorer to move up, down, left or right. The number on a square is its entry cost. Walls block movement.',
      lesson: weighted
        ? 'BFS minimizes steps. Dijkstra minimizes the sum of nonnegative entry costs, so a longer path can be cheaper.'
        : 'BFS visits positions in layers of equal step count. The first route to the exit is shortest when every move costs one.',
    },
    { path: [0], cost: 0 },
    {
      solved: (s) => s.path.at(-1) === goal,
      guide: (s) =>
        String(shortestRoute(weights, side, s.path.at(-1)!, true).path[1]),
      scene: (s) => ({
        layout: 'grid',
        columns: side,
        tiles: weights.map((v, i) => {
          const here = i === s.path.at(-1),
            visited = s.path.includes(i)
          return {
            id: String(i),
            value: here ? '●' : !v ? '▧' : String(v),
            disabled: !v,
            label:
              'Row ' +
              (1 + Math.floor(i / side)) +
              ', column ' +
              ((i % side) + 1) +
              (here ? ', explorer' : !v ? ', wall' : ', entry cost ' + v),
            caption: here ? 'You' : i === goal ? 'Exit' : undefined,
            mark: here
              ? 'active'
              : i === goal
                ? 'goal'
                : !v
                  ? 'blocked'
                  : visited
                    ? 'done'
                    : 'plain',
          }
        }),
        stats: [
          ['Steps', s.path.length - 1],
          ['Path cost', s.cost],
          ...(s.path.at(-1) === goal
            ? ([
                ['BFS steps', bfs.path.length - 1],
                [
                  'BFS path cost',
                  bfs.path.slice(1).reduce((a, i) => a + weights[i], 0),
                ],
                ['Dijkstra cost', best.cost],
              ] as [string, number][])
            : []),
        ],
      }),
      move(s, key) {
        const i = Number(key)
        if (!neighbors(s.path.at(-1)!, side).includes(i))
          return wrong(
            s,
            'Choose a neighboring open square. Diagonal moves skip graph edges.',
          )
        return {
          state: { path: [...s.path, i], cost: s.cost + weights[i] },
          feedback:
            'Crossed one edge and added ' + weights[i] + ' to the path cost.',
        }
      },
    },
  )
}

export function traversal(n: number): Level {
  const size = 4 + Math.floor(n * 0.72)
  const selected = new Set([0]),
    random = randomFrom(n * 98411)
  while (selected.size < size) {
    const options = numbers(15).filter(
      (i) => i > 0 && !selected.has(i) && selected.has((i - 1) >> 1),
    )
    selected.add(options[random(options.length)])
  }
  const ids = [...selected].sort((a, b) => a - b),
    order: number[] = []
  const letters = shuffled('ABCDEFGHJKLMNPQ'.split(''), n * 177)
  const mode = ['Preorder', 'Inorder', 'Postorder', 'Level order'][(n - 1) % 4]
  function visit(i: number) {
    if (!selected.has(i)) return
    if (mode === 'Preorder') order.push(i)
    visit(i * 2 + 1)
    if (mode === 'Inorder') order.push(i)
    visit(i * 2 + 2)
    if (mode === 'Postorder') order.push(i)
  }
  if (mode === 'Level order') order.push(...ids)
  else visit(0)
  const rule: Record<string, string> = {
    Preorder: 'Root, then left subtree, then right subtree.',
    Inorder: 'Left subtree, then root, then right subtree.',
    Postorder: 'Left subtree, then right subtree, then root.',
    'Level order': 'Read each depth from left to right, starting at the root.',
  }
  return level<number>(
    {
      title: mode + ' expedition',
      goal: 'Collect every node in ' + mode.toLowerCase() + '.',
      instruction: 'Select nodes in traversal order. ' + rule[mode],
      lesson:
        rule[mode] + ' Applying that rule consistently visits each node once.',
    },
    0,
    {
      solved: (s) => s === order.length,
      guide: (s) => String(order[s]),
      scene: (s) => ({
        layout: 'tree',
        tiles: ids.map((i) => {
          const depth = Math.floor(Math.log2(i + 1)),
            offset = i - 2 ** depth + 1
          return {
            id: String(i),
            value: letters[i],
            label: 'Collect node ' + letters[i],
            x: ((offset + 0.5) / 2 ** depth) * 100,
            y: 9 + depth * 27,
            disabled: order.slice(0, s).includes(i),
            mark: order.slice(0, s).includes(i) ? 'done' : 'plain',
          }
        }),
        edges: ids
          .filter((i) => i > 0)
          .map((i) => [ids.indexOf((i - 1) >> 1), ids.indexOf(i)]),
        stats: [
          ['Collected', s + ' / ' + size],
          [
            'Trail',
            order
              .slice(0, s)
              .map((i) => letters[i])
              .join(' · ') || '—',
          ],
        ],
      }),
      move(s, key) {
        if (Number(key) !== order[s])
          return wrong(
            s,
            rule[mode] + ' Reconsider the nearest unfinished subtree or level.',
          )
        return {
          state: s + 1,
          feedback:
            'Collected ' +
            letters[Number(key)] +
            ' at position ' +
            (s + 1) +
            '.',
        }
      },
    },
  )
}
