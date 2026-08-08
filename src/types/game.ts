export interface IPlayer {
  id: string
  name: string
  notes: string
}

export interface IGameState {
  players: IPlayer[]
  selectedPlayerId: string | null
}

export type GameStateT = IGameState

export const MAX_PLAYERS = 20
export const MIN_CIRCLE_PLAYERS = 3
