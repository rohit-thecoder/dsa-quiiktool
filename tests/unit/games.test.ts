import { describe, expect, it } from 'vitest'
import {
  games,
  levelsPerGame,
  makeLevel,
  scoreFor,
  type Turn,
} from '../../src/engines/games'
import { shortestRoute } from '../../src/engines/games/maze-tree'

function solve(start: Turn) {
  let state = start
  for (let i = 0; i < 500 && !state.won; i++) {
    expect(state.guide).toBeTruthy()
    state = state.act(state.guide)
    expect(state.error, state.feedback).toBe(false)
  }
  expect(state.won).toBe(true)
  return state
}
describe.each(games)('$title', (game) => {
  it.each(Array.from({ length: levelsPerGame }, (_, i) => i + 1))(
    'level %i accepts legal moves and has a finite solution',
    (n) => {
      const puzzle = makeLevel(game.slug, n)
      expect(puzzle.start.won).toBe(false)
      expect(scoreFor(puzzle.start)).toBe(0)
      const invalid = puzzle.start.act('not-a-control')
      expect(invalid.error).toBe(true)
      expect(invalid.moves).toBe(0)
      expect(invalid.mistakes).toBe(1)
      expect(invalid.scene).toEqual(puzzle.start.scene)
      const win = solve(puzzle.start)
      expect(win.moves).toBeGreaterThan(0)
      expect(scoreFor(win)).toBeGreaterThanOrEqual(10)
      expect(scoreFor(win)).toBeLessThanOrEqual(1000)
      expect(win.act('anything')).toBe(win)
      expect(makeLevel(game.slug, n).start.scene).toEqual(puzzle.start.scene)
      if (game.slug === 'sorting-factory') {
        const values = win.scene.tiles.map((t) => Number(t.value))
        expect(values).toEqual([...values].sort((a, b) => a - b))
      }
      if (game.slug === 'binary-search-treasure-hunt') {
        expect(win.moves).toBeLessThanOrEqual(
          Math.ceil(Math.log2(puzzle.start.scene.tiles.length + 1)),
        )
      }
    },
  )
})
describe('mechanical constraints', () => {
  it('penalizes a wrong decision without advancing the sort trace', () => {
    const start = makeLevel('sorting-factory', 1).start
    const turn = start.act(start.guide === 'swap' ? 'keep' : 'swap')
    expect(turn.error).toBe(true)
    expect(turn.scene).toEqual(start.scene)
    expect(scoreFor(solve(turn))).toBeLessThan(scoreFor(solve(start)))
  })
  it('rejects a diagonal maze move', () => {
    const start = makeLevel('graph-maze-runner', 1).start
    const turn = start.act(String(start.scene.columns! + 1))
    expect(turn.error).toBe(true)
    expect(turn.moves).toBe(0)
  })
  it('keeps BFS and terrain cost distinct on unequal routes', () => {
    const w = [1, 9, 9, 1, 0, 9, 1, 1, 1]
    const a = shortestRoute(w, 3, 0, false),
      b = shortestRoute(w, 3, 0, true)
    expect(a.cost).toBe(4)
    expect(b.cost).toBe(4)
    expect(a.path.slice(1).reduce((sum, i) => sum + w[i], 0)).toBeGreaterThan(
      b.cost,
    )
    expect(b.path).toEqual([0, 3, 6, 7, 8])
  })
  it('exposes real DP table state when the next row is revealed', () => {
    const initial = makeLevel('dynamic-programming-quest', 1).start,
      turn = initial.act('reveal')
    expect(turn.moves).toBe(0)
    const lastRow = turn.scene.table!.cells.at(-1)!
    expect(lastRow.every((v) => typeof v === 'number')).toBe(true)
    expect(lastRow.at(-1)).toBe(Number(turn.scene.tiles.at(-1)!.value))
    expect(Number(lastRow.at(-2))).toBe(
      Number(lastRow.at(-1)) + Number(turn.scene.tiles.at(-2)!.value),
    )
  })
  it('rejects unknown games and invalid level selections', () => {
    expect(() => makeLevel('toString', 1)).toThrow()
    expect(() => makeLevel(games[0].slug, 16)).toThrow()
    expect(() => makeLevel(games[0].slug, 0)).toThrow()
  })
})
