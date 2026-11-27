import { level, numbers, randomFrom, wrong, type Level } from './core'

export function pointers(n: number): Level {
  const mode = (n - 1) % 5,
    count = 4 + Math.floor(n / 4),
    random = randomFrom(n * 78163)
  const ids = numbers(count),
    values = ids.map((i) => 2 + i * 3 + random(3))
  const next = ids.map((i) => (i + 1 < count ? i + 1 : -1)),
    expected = [...next]
  const middle = 1 + random(count - 2),
    entry = random(count - 1)
  let head = 0,
    goal = '',
    instruction = ''
  if (mode === 0) {
    expected.forEach((_, i) => {
      expected[i] = i - 1
    })
    head = count - 1
    goal = 'Reverse every link. The new head is node ' + values[head] + '.'
    instruction =
      'Select a source node, then the node its next pointer should reference. Use End for a null pointer.'
  } else if (mode === 1) {
    expected[middle - 1] = next[middle]
    goal =
      'Bypass node ' +
      values[middle] +
      ' while preserving the rest of the chain.'
    instruction =
      'Find the predecessor, select it, then select the node after the one to remove. Leave detached node pointers unchanged.'
  } else if (mode === 2) {
    next[count - 1] = entry
    goal = 'Locate the entry to the cycle starting from the head.'
    instruction =
      'Trace the next references from the head. Select the first node visited twice.'
  } else if (mode === 3) {
    next.forEach((_, i) => {
      next[i] = i + 2 < count ? i + 2 : -1
    })
    goal =
      'Merge the two sorted chains into one increasing chain. Head nodes are ' +
      values[0] +
      ' and ' +
      values[1] +
      '.'
    instruction =
      'Compare exposed values and reconnect next pointers. Select the source and then its new successor. Use End for a tail.'
  } else {
    next[middle - 1] = -1
    goal =
      'Repair the broken route from ' +
      values[0] +
      ' to ' +
      values[count - 1] +
      ' so it visits every node in order.'
    instruction =
      'Trace the chain until it ends early. Select that node and reconnect its next pointer.'
  }
  const format = (i: number) => (i < 0 ? 'End' : String(values[i]))
  type State = { links: number[]; selected: number | null; won: boolean }
  return level<State>(
    {
      title: [
        'Reverse the route',
        'Detach one station',
        'Find the loop',
        'Merge two routes',
        'Bridge the gap',
      ][mode],
      goal,
      instruction,
      lesson:
        mode === 2
          ? 'Following one next reference at a time must either reach null or revisit a node. The first repeated node is the cycle entry.'
          : 'Changing next modifies a reference. Node values stay in place. Check the route from its new head to confirm every required node is reachable.',
    },
    { links: next, selected: null, won: false },
    {
      solved: (s) => s.won,
      guide(s) {
        if (mode === 2) return String(entry)
        const src = s.links.findIndex((v, i) => v !== expected[i])
        if (s.selected === null) return String(src)
        if (s.selected !== src) return 'cancel'
        return expected[src] === -1 ? 'end' : String(expected[src])
      },
      scene: (s) => ({
        layout: 'network',
        tiles: ids.map((i) => ({
          id: String(i),
          value: String(values[i]),
          label: 'Node ' + values[i] + ', next ' + format(s.links[i]),
          caption: 'next ' + format(s.links[i]),
          mark:
            s.selected === i
              ? 'active'
              : s.won && mode === 2 && i === entry
                ? 'goal'
                : 'plain',
          x: 50 + 38 * Math.cos(-Math.PI / 2 + (i * Math.PI * 2) / count),
          y: 50 + 34 * Math.sin(-Math.PI / 2 + (i * Math.PI * 2) / count),
        })),
        edges: ids.filter((i) => s.links[i] >= 0).map((i) => [i, s.links[i]]),
        controls:
          mode !== 2 && s.selected !== null
            ? [
                { id: 'end', label: 'Set next to End' },
                { id: 'cancel', label: 'Cancel selection' },
              ]
            : [],
        stats: [
          ['Head', format(head)],
          ['Editing', s.selected === null ? 'Choose node' : format(s.selected)],
        ],
      }),
      move(s, key) {
        if (mode === 2) {
          return Number(key) === entry
            ? {
                state: { ...s, won: true },
                feedback:
                  'The tail returns to ' +
                  format(entry) +
                  ', the first repeated node.',
              }
            : wrong(
                s,
                'Follow the links from the head. The first node that appears twice is the entry.',
              )
        }
        if (key === 'cancel')
          return {
            state: { ...s, selected: null },
            feedback: 'Selection cleared.',
            cost: 0,
          }
        if (s.selected === null)
          return {
            state: { ...s, selected: Number(key) },
            feedback:
              'Choose the new next reference for ' + format(Number(key)) + '.',
            cost: 0,
          }
        const dst = key === 'end' ? -1 : Number(key)
        if (dst === s.selected)
          return wrong(
            s,
            'This route needs no self-loop. Choose another node or End.',
          )
        const links = [...s.links]
        links[s.selected] = dst
        return {
          state: {
            links,
            selected: null,
            won: links.every((v, i) => v === expected[i]),
          },
          feedback:
            'Node ' +
            format(s.selected) +
            ' now points to ' +
            format(dst) +
            '.',
        }
      },
    },
  )
}
