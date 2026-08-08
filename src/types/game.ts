export type PlayerMarkColorT = 'blue' | 'red'

export type LayoutModeT = 'circle' | 'square'

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
  layoutMode: LayoutModeT
  /** Script setup size for T/O/M/D (5–15), independent of seat count. */
  setupPlayerCount: number
  sharedNotes: string
}

export type GameStateT = IGameState

export const MAX_PLAYERS = 20
export const MIN_CIRCLE_PLAYERS = 3
