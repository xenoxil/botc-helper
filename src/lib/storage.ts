import type { IGameState, IPlayer } from '../types/game'

export const STORAGE_KEY = 'botc-helper:v1'

interface IStoredGame {
  players: IPlayer[]
}

const isPlayer = (value: unknown): value is IPlayer => {
  if (!value || typeof value !== 'object') return false
  const player = value as Record<string, unknown>
  return (
    typeof player.id === 'string' &&
    typeof player.name === 'string' &&
    typeof player.notes === 'string'
  )
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
      players: data.players.filter(isPlayer),
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
