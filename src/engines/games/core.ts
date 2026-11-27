export type Mark = 'plain' | 'active' | 'done' | 'blocked' | 'goal'
export interface Tile {
  id: string
  label: string
  value: string
  caption?: string
  mark?: Mark
  x?: number
  y?: number
  pieces?: number[]
  disabled?: boolean
}
export interface Scene {
  layout: 'strip' | 'grid' | 'tree' | 'pegs' | 'network'
  tiles: Tile[]
  columns?: number
  edges?: [number, number][]
  controls?: { id: string; label: string }[]
  stats?: [string, string | number][]
  table?: { label: string; cells: (number | string)[][] }
}
export interface Turn {
  scene: Scene
  won: boolean
  feedback: string
  error: boolean
  moves: number
  mistakes: number
  guide: string
  act(key: string): Turn
}
export interface Level {
  title: string
  instruction: string
  lesson: string
  goal: string
  start: Turn
}
export interface Change<S> {
  state: S
  feedback: string
  error?: boolean
  cost?: number
}
interface Rules<S> {
  scene(s: S): Scene
  solved(s: S): boolean
  guide(s: S): string
  move(s: S, key: string): Change<S>
}
export function level<S>(
  info: Omit<Level, 'start'>,
  initial: S,
  rules: Rules<S>,
): Level {
  function turn(
    state: S,
    feedback: string,
    error: boolean,
    moves: number,
    mistakes: number,
  ): Turn {
    const scene = rules.scene(state)
    const won = rules.solved(state)
    const current: Turn = {
      scene,
      won,
      feedback,
      error,
      moves,
      mistakes,
      guide: won ? '' : rules.guide(state),
      act(key) {
        if (won) return current
        const legal =
          scene.tiles.some((t) => !t.disabled && t.id === key) ||
          scene.controls?.some((c) => c.id === key)
        if (!legal)
          return turn(
            state,
            'Choose one of the available controls.',
            true,
            moves,
            mistakes + 1,
          )
        const next = rules.move(state, key)
        return turn(
          next.state,
          next.feedback,
          !!next.error,
          moves + (next.cost ?? (next.error ? 0 : 1)),
          mistakes + Number(!!next.error),
        )
      },
    }
    return current
  }
  return { ...info, start: turn(initial, info.goal, false, 0, 0) }
}
export function wrong<S>(state: S, feedback: string): Change<S> {
  return { state, feedback, error: true }
}
export function randomFrom(seed: number) {
  let value = seed >>> 0
  return (max: number) => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0
    return Math.floor((value / 4294967296) * max)
  }
}
export function shuffled<T>(values: T[], seed: number): T[] {
  const random = randomFrom(seed)
  const result = [...values]
  for (let i = result.length - 1; i > 0; i--) {
    const j = random(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
export function numbers(n: number) {
  return Array.from({ length: n }, (_, i) => i)
}
export function scoreFor(turn: Turn) {
  return turn.won ? Math.max(10, 1000 - 3 * turn.moves - 25 * turn.mistakes) : 0
}
