import type {
  IGameState,
  IPlayer,
  LayoutModeT,
  PlayerMarkColorT,
} from '../types/game'

export const STORAGE_KEY = 'botc-helper:v1'

interface IStoredGame {
  players: IPlayer[]
  layoutMode?: LayoutModeT
}

export type PersistedGameT = Pick<IGameState, 'players' | 'layoutMode'>

const isMarkColor = (value: unknown): value is PlayerMarkColorT =>
  value === 'blue' || value === 'red'

const isLayoutMode = (value: unknown): value is LayoutModeT =>
  value === 'circle' || value === 'square'

const normalizePlayer = (value: unknown): IPlayer | null => {
  if (!value || typeof value !== 'object') return null
  const player = value as Record<string, unknown>
  if (
    typeof player.id !== 'string' ||
    typeof player.name !== 'string' ||
    typeof player.notes !== 'string'
  ) {
    return null
  }

  return {
    id: player.id,
    name: player.name,
    notes: player.notes,
    markColor: isMarkColor(player.markColor) ? player.markColor : null,
  }
}

export const loadGameState = (): PersistedGameT => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { players: [], layoutMode: 'circle' }

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return { players: [], layoutMode: 'circle' }
    }

    const data = parsed as Partial<IStoredGame>
    const players = Array.isArray(data.players)
      ? data.players
          .map(normalizePlayer)
          .filter((player): player is IPlayer => player !== null)
      : []

    return {
      players,
      layoutMode: isLayoutMode(data.layoutMode) ? data.layoutMode : 'circle',
    }
  } catch {
    return { players: [], layoutMode: 'circle' }
  }
}

export const saveGameState = (state: PersistedGameT): void => {
  const payload: IStoredGame = {
    players: state.players,
    layoutMode: state.layoutMode,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
