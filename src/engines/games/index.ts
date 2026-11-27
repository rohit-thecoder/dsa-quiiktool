import { dependency, hashVault, bitForge, networkMerge, intervalMission, primeLab } from './expansion'
import { dynamic } from './dynamic'
import { maze, traversal } from './maze-tree'
import { pointers } from './pointers'
import { sorting, windowGame } from './sort-window'
import { stacks, treasure } from './stack-search'
import type { Level } from './core'
export { scoreFor } from './core'
export type { Level, Scene, Tile, Turn } from './core'

export const games = [
  {
    slug: 'stack-tower-challenge',
    title: 'Stack Tower Challenge',
    topicId: 'stacks-and-queues',
    description:
      'Transfer towers and dispatch crates using the last-in, first-out rule.',
  },
  {
    slug: 'binary-search-treasure-hunt',
    title: 'Binary Search Treasure Hunt',
    topicId: 'binary-search',
    description:
      'Probe ordered stations and narrow a hidden beacon’s location.',
  },
  {
    slug: 'graph-maze-runner',
    title: 'Graph Maze Runner',
    topicId: 'graphs',
    description:
      'Navigate weighted terrain and compare your route with shortest-path algorithms.',
  },
  {
    slug: 'tree-traversal-explorer',
    title: 'Tree Traversal Explorer',
    topicId: 'trees',
    description:
      'Collect a branching tree in preorder, inorder, postorder or level order.',
  },
  {
    slug: 'sorting-factory',
    title: 'Sorting Factory',
    topicId: 'sorting',
    description:
      'Run a sorting belt with bubble, selection and insertion operations.',
  },
  {
    slug: 'sliding-window-collector',
    title: 'Sliding Window Collector',
    topicId: 'sliding-window',
    description:
      'Move a window over cargo to optimize its sum, length or variety.',
  },
  {
    slug: 'pointer-escape',
    title: 'Pointer Escape',
    topicId: 'linked-lists',
    description:
      'Reconnect references, merge routes and find the entry to a cycle.',
  },
  {
    slug: 'dynamic-programming-quest',
    title: 'Dynamic Programming Quest',
    topicId: 'dynamic-programming',
    description:
      'Explore optimal routes, pay exact change and pack a valuable inventory.',
  },
  {slug: 'dependency-dispatch', title: 'Dependency Dispatch', topicId: 'graphs', description: 'Launch modules in prerequisite order in a network of dependencies.'},
  {slug: 'hash-vault', title: 'Hash Vault', topicId: 'arrays-and-hashing', description: 'Route incoming keys through a collision-filled hash table.'},
  {slug: 'bit-forge', title: 'Bit Forge', topicId: 'bit-manipulation', description: 'Clear binary circuits one set bit at a time.'},
  {slug: 'network-merge', title: 'Network Merge', topicId: 'graphs', description: 'Connect stations using disjoint sets and union by size.'},
  {slug: 'interval-mission', title: 'Interval Mission', topicId: 'greedy-and-intervals', description: 'Schedule the maximum number of compatible missions.'},
  {slug: 'prime-reactor', title: 'Prime Reactor', topicId: 'fundamentals', description: 'Remove composite numbers from a prime-powered reactor.'},
] as const
export const levelsPerGame = 15
const builders: Record<string, (n: number) => Level> = {
  'stack-tower-challenge': stacks,
  'binary-search-treasure-hunt': treasure,
  'graph-maze-runner': maze,
  'tree-traversal-explorer': traversal,
  'sorting-factory': sorting,
  'sliding-window-collector': windowGame,
  'pointer-escape': pointers,
  'dynamic-programming-quest': dynamic,
  'dependency-dispatch': dependency,
  'hash-vault': hashVault,
  'bit-forge': bitForge,
  'network-merge': networkMerge,
  'interval-mission': intervalMission,
  'prime-reactor': primeLab,
}
export function makeLevel(slug: string, number: number): Level {
  if (!Object.hasOwn(builders, slug)) throw new RangeError('Unknown game.')
  if (!Number.isInteger(number) || number < 1 || number > levelsPerGame)
    throw new RangeError('Level must be between 1 and ' + levelsPerGame + '.')
  return builders[slug](number)
}
