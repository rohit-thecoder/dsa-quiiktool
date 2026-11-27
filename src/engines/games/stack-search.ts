import { level, numbers, randomFrom, wrong, type Level } from './core'

export function stacks(n: number): Level {
  if (n % 2 === 0) return siding(n)
  const size = 2 + Math.floor((n - 1) / 4)
  const from = n % 3
  const target = (from + (n % 4 === 1 ? 1 : 2)) % 3
  const name = (peg: number) => String.fromCharCode(65 + peg)
  type State = { pegs: number[][]; selected: number | null }
  const pegs = [[], [], []] as number[][]
  pegs[from] = numbers(size).map((i) => size - i)
  function firstMove(state: State): [number, number] {
    function next(disk: number, destination: number): [number, number] | null {
      if (!disk) return null
      const source = state.pegs.findIndex((p) => p.includes(disk))
      if (source === destination) return next(disk - 1, destination)
      return next(disk - 1, 3 - source - destination) ?? [source, destination]
    }
    return next(size, target)!
  }
  return level<State>(
    {
      title: 'Hanoi transfer',
      goal: 'Rebuild the whole tower on peg ' + name(target) + '.',
      instruction:
        'Choose a source peg, then a destination. Only the top disk moves, and a larger disk must stay below a smaller one.',
      lesson:
        'To move the largest disk, move the smaller tower aside first. The same rule solves the smaller tower, which gives T(n) = 2T(n−1) + 1.',
    },
    { pegs, selected: null },
    {
      solved: (s) => s.pegs[target].length === size,
      guide(s) {
        const [a, b] = firstMove(s)
        return String(s.selected === a ? b : (s.selected ?? a))
      },
      scene: (s) => ({
        layout: 'pegs',
        tiles: s.pegs.map((p, i) => ({
          id: String(i),
          label:
            'Peg ' + name(i) + ', bottom to top: ' + (p.join(', ') || 'empty'),
          value: name(i),
          caption: i === target ? 'Destination' : 'Peg',
          pieces: p,
          mark: s.selected === i ? 'active' : i === target ? 'goal' : 'plain',
        })),
        stats: [
          ['Disks', size],
          ['Shortest transfer', 2 ** size - 1],
        ],
      }),
      move(s, key) {
        const i = Number(key)
        if (s.selected === null) {
          if (!s.pegs[i].length)
            return wrong(s, 'This peg is empty. Choose a top disk to lift.')
          return {
            state: { ...s, selected: i },
            cost: 0,
            feedback:
              'Lift the top disk of ' + name(i) + '. Choose its destination.',
          }
        }
        if (s.selected === i)
          return {
            state: { ...s, selected: null },
            cost: 0,
            feedback: 'Disk returned to its peg.',
          }
        const disk = s.pegs[s.selected].at(-1)!
        if ((s.pegs[i].at(-1) ?? Infinity) < disk)
          return wrong(
            s,
            'That disk would cover a smaller disk. Choose a different peg.',
          )
        const copy = s.pegs.map((p) => [...p])
        copy[s.selected].pop()
        copy[i].push(disk)
        return {
          state: { pegs: copy, selected: null },
          feedback:
            'Pop disk ' +
            disk +
            ' from ' +
            name(s.selected) +
            ' and push it onto ' +
            name(i) +
            '.',
        }
      },
    },
  )
}

function siding(n: number): Level {
  const size = 4 + Math.floor(n / 3)
  const rand = randomFrom(n * 211)
  const target: number[] = [],
    work: number[] = []
  for (let i = 1; i <= size; i++) {
    work.push(i)
    while (work.length > 0 && rand(3) === 0) target.push(work.pop()!)
  }
  while (work.length) target.push(work.pop()!)
  type State = { next: number; stack: number[]; out: number[] }
  return level<State>(
    {
      title: 'Dispatch siding',
      goal: 'Dispatch crates in order ' + target.join(' · ') + '.',
      instruction:
        'Push incoming crates onto the siding or pop the top crate to dispatch it. Once the next required crate is on top, dispatch it before loading another.',
      lesson:
        'A stack exposes only its newest item. A forced pop at the right moment preserves access to every remaining order.',
    },
    { next: 1, stack: [], out: [] },
    {
      solved: (s) => s.out.length === size,
      guide: (s) => (s.stack.at(-1) === target[s.out.length] ? 'pop' : 'push'),
      scene: (s) => ({
        layout: 'pegs',
        tiles: [
          {
            id: 'in',
            label: 'Next incoming crate',
            value: String(s.next <= size ? s.next : '—'),
            caption: 'Incoming',
            disabled: true,
          },
          {
            id: 'stack',
            label: 'Siding bottom to top: ' + s.stack.join(', '),
            value: 'Siding',
            pieces: s.stack,
            disabled: true,
          },
          {
            id: 'out',
            label: 'Dispatched crates',
            value: s.out.join(' · ') || '—',
            caption: 'Dispatched',
            disabled: true,
          },
        ],
        controls: [
          { id: 'push', label: 'Push next crate' },
          { id: 'pop', label: 'Pop and dispatch' },
        ],
        stats: [
          ['Next required', target[s.out.length] ?? 'Complete'],
          ['Remaining arrivals', size - s.next + 1],
        ],
      }),
      move(s, key) {
        const needed = target[s.out.length]
        if (key === 'pop') {
          if (s.stack.at(-1) !== needed)
            return wrong(
              s,
              'Crate ' +
                needed +
                ' must leave next. Inspect the top of the siding.',
            )
          return {
            state: {
              ...s,
              stack: s.stack.slice(0, -1),
              out: [...s.out, needed],
            },
            feedback: 'Dispatched crate ' + needed + ' from the top.',
          }
        }
        if (s.next > size || s.stack.at(-1) === needed)
          return wrong(
            s,
            'The required crate is ready on top. Dispatch it first.',
          )
        return {
          state: { ...s, stack: [...s.stack, s.next], next: s.next + 1 },
          feedback: 'Pushed crate ' + s.next + ' onto the siding.',
        }
      },
    },
  )
}

export function treasure(n: number): Level {
  const total = 7 + 2 * n,
    rand = randomFrom(194771 * n)
  const target = rand(total)
  const locations: number[] = []
  let coordinate = n
  for (const _ of numbers(total)) {
    void _
    coordinate += 1 + rand(7)
    locations.push(coordinate)
  }
  type State = { lo: number; hi: number; probes: number[]; found: boolean }
  return level<State>(
    {
      title: 'Hidden coordinate',
      goal: 'Find the buried beacon on this ordered trail.',
      instruction:
        'Probe any remaining station. The signal reports which direction contains the beacon. Probe the middle to eliminate the most stations in the worst case.',
      lesson:
        'One midpoint comparison keeps at most half the candidates. The worst-case probe count grows logarithmically with the trail length.',
    },
    { lo: 0, hi: total - 1, probes: [], found: false },
    {
      solved: (s) => s.found,
      guide: (s) => String((s.lo + s.hi) >> 1),
      scene: (s) => ({
        layout: 'strip',
        tiles: locations.map((v, i) => ({
          id: String(i),
          value: String(v),
          label: 'Probe coordinate ' + v,
          disabled: i < s.lo || i > s.hi || s.found,
          mark:
            s.found && i === target
              ? 'goal'
              : i < s.lo || i > s.hi
                ? 'blocked'
                : 'plain',
          caption:
            s.found && i === target
              ? 'Found'
              : s.probes.includes(i)
                ? 'Probed'
                : undefined,
        })),
        stats: [
          ['Probes', s.probes.length],
          ['Candidates', s.hi - s.lo + 1],
          ['Midpoint worst case', Math.ceil(Math.log2(total + 1))],
        ],
      }),
      move(s, key) {
        const i = Number(key),
          found = i === target
        return {
          state: {
            lo: i <= target ? (found ? i : i + 1) : s.lo,
            hi: i >= target ? (found ? i : i - 1) : s.hi,
            probes: [...s.probes, i],
            found,
          },
          feedback: found
            ? 'Beacon recovered at ' + locations[i] + '.'
            : 'The beacon lies ' +
              (i < target ? 'right of ' : 'left of ') +
              locations[i] +
              '. Those stations can be ruled out.',
        }
      },
    },
  )
}
