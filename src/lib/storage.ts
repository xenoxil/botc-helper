import type { IGameState, IPlayer, PlayerMarkColorT } from '../types/game'

export const STORAGE_KEY = 'botc-helper:v1'

interface IStoredGame {
  players: IPlayer[]
}

const isMarkColor = (value: unknown): value is PlayerMarkColorT =>
  value === 'blue' || value === 'red'

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

export const loadGameState = (): Pick<IGameState, 'players'> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { players: [] }

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { players: [] }

    const data = parsed as Partial<IStoredGame>
    if (!Array.isArray(data.players)) return { players: [] }

    return {
      players: data.players
        .map(normalizePlayer)
        .filter((player): player is IPlayer => player !== null),
    }
  } catch {
    return { players: [] }
  }
}

export const saveGameState = (state: Pick<IGameState, 'players'>): void => {
  const payload: IStoredGame = {
    players: state.players,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
