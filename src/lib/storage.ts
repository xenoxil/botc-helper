import type {
  IGameState,
  IPlayer,
  LayoutModeT,
  PlayerMarkColorT,
} from '../types/game'
import {
  DEFAULT_SCRIPT_ID,
  isBuiltinScriptId,
  type ICustomScript,
  type ScriptIdT,
} from '../types/script'
import {
  DEFAULT_SETUP_PLAYERS,
  normalizeSetupPlayerCount,
} from './setupDistribution'

export const STORAGE_KEY = 'botc-helper:v1'

interface IStoredGame {
  players: IPlayer[]
  layoutMode?: LayoutModeT
  setupPlayerCount?: number
  sharedNotes?: string
  selectedScriptId?: string | null
  customScripts?: ICustomScript[]
}

export type PersistedGameT = Pick<
  IGameState,
  | 'players'
  | 'layoutMode'
  | 'setupPlayerCount'
  | 'sharedNotes'
  | 'selectedScriptId'
  | 'customScripts'
>

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

const normalizeCustomScript = (value: unknown): ICustomScript | null => {
  if (!value || typeof value !== 'object') return null
  const script = value as Record<string, unknown>
  if (
    typeof script.id !== 'string' ||
    typeof script.name !== 'string' ||
    typeof script.sourceFileName !== 'string' ||
    !Array.isArray(script.raw)
  ) {
    return null
  }

  return {
    id: script.id,
    name: script.name,
    author: typeof script.author === 'string' ? script.author : '',
    sourceFileName: script.sourceFileName,
    raw: script.raw,
  }
}

const emptyPersisted = (): PersistedGameT => ({
  players: [],
  layoutMode: 'circle',
  setupPlayerCount: DEFAULT_SETUP_PLAYERS,
  sharedNotes: '',
  selectedScriptId: DEFAULT_SCRIPT_ID,
  customScripts: [],
})

const normalizeSelectedScriptId = (
  value: unknown,
  customScripts: ICustomScript[],
): ScriptIdT => {
  if (typeof value !== 'string' || !value) return DEFAULT_SCRIPT_ID
  if (isBuiltinScriptId(value)) return value
  if (customScripts.some((script) => script.id === value)) return value
  return DEFAULT_SCRIPT_ID
}

export const loadGameState = (): PersistedGameT => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyPersisted()

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return emptyPersisted()

    const data = parsed as Partial<IStoredGame>
    const players = Array.isArray(data.players)
      ? data.players
          .map(normalizePlayer)
          .filter((player): player is IPlayer => player !== null)
      : []

    const customScripts = Array.isArray(data.customScripts)
      ? data.customScripts
          .map(normalizeCustomScript)
          .filter((script): script is ICustomScript => script !== null)
      : []

    return {
      players,
      layoutMode: isLayoutMode(data.layoutMode) ? data.layoutMode : 'circle',
      setupPlayerCount: normalizeSetupPlayerCount(data.setupPlayerCount),
      sharedNotes: typeof data.sharedNotes === 'string' ? data.sharedNotes : '',
      customScripts,
      selectedScriptId: normalizeSelectedScriptId(
        data.selectedScriptId,
        customScripts,
      ),
    }
  } catch {
    return emptyPersisted()
  }
}

export const saveGameState = (state: PersistedGameT): void => {
  const payload: IStoredGame = {
    players: state.players,
    layoutMode: state.layoutMode,
    setupPlayerCount: state.setupPlayerCount,
    sharedNotes: state.sharedNotes,
    selectedScriptId: state.selectedScriptId,
    customScripts: state.customScripts,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
