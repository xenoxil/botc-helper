export type PlayerMarkColorT = 'blue' | 'red'

export interface IPlayer {
  id: string
  name: string
  notes: string
  /** Seat border mark; null = default gray. */
  markColor: PlayerMarkColorT | null
}

export interface IGameState {
  players: IPlayer[]
  selectedPlayerId: string | null
}

export type GameStateT = IGameState

export const MAX_PLAYERS = 20
export const MIN_CIRCLE_PLAYERS = 3
