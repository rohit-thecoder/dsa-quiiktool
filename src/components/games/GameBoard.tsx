'use client'

import { useId, useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { useProgress, updateProgress } from '@/hooks/useProgress'
import {
  games,
  levelsPerGame,
  makeLevel,
  scoreFor,
  type Scene,
  type Tile,
  type Turn,
} from '../../engines/games'
import './games.css'

interface GameBoardProps {
  slug: string
  onWin?: (level: number, score: number) => void
}
function playChime(won: boolean, valid: boolean) {
  try {
    const audio = new AudioContext()
    const osc = audio.createOscillator(),
      gain = audio.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(valid ? 440 : 196, audio.currentTime)
    osc.frequency.exponentialRampToValueAtTime(
      won ? 880 : valid ? 554 : 147,
      audio.currentTime + 0.1,
    )
    gain.gain.setValueAtTime(0.045, audio.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.15)
    osc.connect(gain)
    gain.connect(audio.destination)
    osc.onended = () => {
      void audio.close().catch(() => {})
    }
    osc.start()
    osc.stop(audio.currentTime + 0.16)
  } catch {
    /* Sound is optional on devices without Web Audio. */
  }
}
function TileContents({ tile }: { tile: Tile }) {
  return (
    <>
      {tile.pieces && (
        <span className="arc-disc-stack" aria-hidden="true">
          {tile.pieces.map((d) => (
            <span
              key={d}
              className="arc-disc"
              style={{ '--disc': d } as CSSProperties}
            >
              {d}
            </span>
          ))}
        </span>
      )}
      <span className="arc-tile-value">{tile.value}</span>
      {tile.caption && <span className="arc-tile-caption">{tile.caption}</span>}
      {tile.mark === 'done' && (
        <span className="arc-tick" aria-hidden="true">
          ✓
        </span>
      )}
    </>
  )
}
function Playfield({
  scene,
  act,
  locked,
}: {
  scene: Scene
  act: (key: string) => void
  locked: boolean
}) {
  const arrow = useId().replace(/:/g, '')
  const diagram = scene.layout === 'tree' || scene.layout === 'network'
  return (
    <div
      className={'arc-field arc-' + scene.layout}
      style={{ '--cols': scene.columns ?? 1 } as CSSProperties}
    >
      {diagram && (
        <svg
          aria-hidden="true"
          className="arc-edges"
          viewBox="0 0 600 300"
          preserveAspectRatio="none"
        >
          <defs>
            <marker
              id={arrow}
              markerWidth="7"
              markerHeight="6"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0 0L7 3L0 6Z" fill="currentColor" />
            </marker>
          </defs>
          {scene.edges?.map(([a, b]) => {
            const u = scene.tiles[a],
              v = scene.tiles[b]
            const x1 = u.x! * 6,
              y1 = u.y! * 3,
              x2 = v.x! * 6,
              y2 = v.y! * 3
            const length = Math.hypot(x2 - x1, y2 - y1) || 1,
              offset = scene.layout === 'network' ? 28 : 0
            return (
              <line
                key={a + '-' + b}
                x1={x1}
                y1={y1}
                x2={x2 - ((x2 - x1) * offset) / length}
                y2={y2 - ((y2 - y1) * offset) / length}
                markerEnd={
                  scene.layout === 'network' ? 'url(#' + arrow + ')' : undefined
                }
              />
            )
          })}
        </svg>
      )}
      {scene.tiles.map((tile) => (
        <button
          type="button"
          key={tile.id}
          aria-label={
            tile.label +
            (tile.mark === 'active'
              ? ', active'
              : tile.mark === 'done'
                ? ', visited'
                : '')
          }
          disabled={tile.disabled || locked}
          className={'arc-tile arc-mark-' + (tile.mark ?? 'plain')}
          onClick={() => act(tile.id)}
          style={
            diagram ? { left: tile.x + '%', top: tile.y + '%' } : undefined
          }
        >
          <TileContents tile={tile} />
        </button>
      ))}
    </div>
  )
}
function BoardSession({ slug, onWin }: GameBoardProps) {
  const game = games.find((g) => g.slug === slug)!
  const [level, setLevel] = useState(1)
  const puzzle = useMemo(() => makeLevel(slug, level), [slug, level])
  const [current, setCurrent] = useState<Turn>(puzzle.start)
  const [paused, setPaused] = useState(false),
    [sound, setSound] = useState(false)
  const { gameScores } = useProgress()
  const [hint, setHint] = useState('')
  const scoreKey = (n: number) => slug + '/' + n
  function changeLevel(n: number) {
    setLevel(n)
    setCurrent(makeLevel(slug, n).start)
    setPaused(false)
    setHint('')
  }
  function act(key: string) {
    if (paused || current.won) return
    const next = current.act(key)
    setCurrent(next)
    setHint('')
    if (sound) playChime(next.won, !next.error)
    if (next.won) {
      const score = scoreFor(next)
      updateProgress((p) => {
        const key = scoreKey(level)
        return score > (p.gameScores[key] ?? 0)
          ? { ...p, gameScores: { ...p.gameScores, [key]: score } }
          : p
      })
      onWin?.(level, score)
    }
  }
  function showHint() {
    const control = current.scene.controls?.find((a) => a.id === current.guide),
      tile = current.scene.tiles.find((t) => t.id === current.guide)
    setHint(
      control
        ? 'Try “' + control.label + '”.'
        : tile
          ? 'Next move: ' + tile.label + '.'
          : 'Inspect the current goal.',
    )
  }
  return (
    <section
      className={'arc-board arc-theme-' + slug}
      aria-label={game.title + ' playable board'}
    >
      <header className="arc-header">
        <div>
          <div className="arc-level-tag">
            Level {String(level).padStart(2, '0')} / {levelsPerGame}
          </div>
          <h2>{puzzle.title}</h2>
        </div>
        <label className="arc-picker">
          Level
          <select
            value={level}
            onChange={(e) => changeLevel(Number(e.target.value))}
          >
            {Array.from({ length: levelsPerGame }, (_, i) => (
              <option value={i + 1} key={i}>
                {i + 1}
                {gameScores[scoreKey(i + 1)] ? ' ✓' : ''}
              </option>
            ))}
          </select>
        </label>
      </header>
      <p className="arc-goal">{puzzle.goal}</p>
      <details className="arc-tutorial" open={level === 1 ? true : undefined}>
        <summary>How to play</summary>
        <p>{puzzle.instruction}</p>
      </details>
      <div className="arc-game-area">
        <div className="arc-stage">
          <div className="arc-stage-head">
            <span>{game.title}</span>
            <span>
              {paused ? 'Paused' : current.won ? 'Complete' : 'Playing'}
            </span>
          </div>
          <Playfield
            scene={current.scene}
            act={act}
            locked={paused || current.won}
          />
          {paused && (
            <div className="arc-overlay">
              <strong>Game paused</strong>
              <button type="button" onClick={() => setPaused(false)}>
                Resume level
              </button>
            </div>
          )}
        </div>
        <div className="arc-action-row">
          {current.scene.controls?.map((a) => (
            <button
              type="button"
              key={a.id}
              disabled={paused || current.won}
              onClick={() => act(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>
        <dl className="arc-metrics">
          {current.scene.stats?.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {current.scene.table && (
          <div className="arc-table-wrap">
            <table>
              <caption>{current.scene.table.label}</caption>
              <tbody>
                {current.scene.table.cells.map((row, i) => (
                  <tr key={i}>
                    {row.map((v, j) => (
                      <td key={j}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div
        role="status"
        aria-live="polite"
        className={
          'arc-feedback' + (current.error ? ' arc-feedback-error' : '')
        }
      >
        {(current.error ? 'Try again. ' : '') + current.feedback}
        {hint && <p>{hint}</p>}
      </div>
      {current.won && (
        <div className="arc-result">
          <h3>Level complete · {scoreFor(current)} points</h3>
          <p>{puzzle.lesson}</p>
          <p>
            {current.moves} moves · {current.mistakes} corrections · Personal
            best {gameScores[scoreKey(level)] ?? scoreFor(current)}
          </p>
          {level < levelsPerGame && (
            <button type="button" onClick={() => changeLevel(level + 1)}>
              Play next level
            </button>
          )}
          <Link href={'/topics/' + game.topicId}>Explore the lesson</Link>
        </div>
      )}
      <div className="arc-toolbar">
        <button type="button" onClick={() => changeLevel(level)}>
          Restart
        </button>
        <button
          type="button"
          disabled={current.won}
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button
          type="button"
          disabled={paused || current.won}
          onClick={showHint}
        >
          Hint
        </button>
        <button
          type="button"
          aria-pressed={sound}
          onClick={() => setSound(!sound)}
        >
          Sound {sound ? 'on' : 'off'}
        </button>
      </div>
    </section>
  )
}
export function GameBoard(props: GameBoardProps) {
  if (!games.some((g) => g.slug === props.slug)) return null
  return <BoardSession key={props.slug} {...props} />
}
export default GameBoard
