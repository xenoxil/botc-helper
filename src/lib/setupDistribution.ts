export interface ISetupDistribution {
  townsfolk: number
  outsiders: number
  minions: number
  demons: number
}

export const MIN_SETUP_PLAYERS = 5
export const MAX_SETUP_PLAYERS = 15
export const DEFAULT_SETUP_PLAYERS = 7

const SETUP_TABLE: Record<number, ISetupDistribution> = {
  5: { townsfolk: 3, outsiders: 0, minions: 1, demons: 1 },
  6: { townsfolk: 3, outsiders: 1, minions: 1, demons: 1 },
  7: { townsfolk: 5, outsiders: 0, minions: 1, demons: 1 },
  8: { townsfolk: 5, outsiders: 1, minions: 1, demons: 1 },
  9: { townsfolk: 5, outsiders: 2, minions: 1, demons: 1 },
  10: { townsfolk: 7, outsiders: 0, minions: 2, demons: 1 },
  11: { townsfolk: 7, outsiders: 1, minions: 2, demons: 1 },
  12: { townsfolk: 7, outsiders: 2, minions: 2, demons: 1 },
  13: { townsfolk: 9, outsiders: 0, minions: 3, demons: 1 },
  14: { townsfolk: 9, outsiders: 1, minions: 3, demons: 1 },
  15: { townsfolk: 9, outsiders: 2, minions: 3, demons: 1 },
}

export const SETUP_PLAYER_OPTIONS = Array.from(
  { length: MAX_SETUP_PLAYERS - MIN_SETUP_PLAYERS + 1 },
  (_, index) => MIN_SETUP_PLAYERS + index,
)

export const normalizeSetupPlayerCount = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return DEFAULT_SETUP_PLAYERS
  }
  if (value < MIN_SETUP_PLAYERS || value > MAX_SETUP_PLAYERS) {
    return DEFAULT_SETUP_PLAYERS
  }
  return value
}

export const getSetupDistribution = (
  setupPlayerCount: number,
): ISetupDistribution => {
  const count = normalizeSetupPlayerCount(setupPlayerCount)
  return SETUP_TABLE[count] ?? SETUP_TABLE[DEFAULT_SETUP_PLAYERS]!
}

export const getTravelerCount = (
  playerCount: number,
  setupPlayerCount: number,
): number => Math.max(0, playerCount - setupPlayerCount)
