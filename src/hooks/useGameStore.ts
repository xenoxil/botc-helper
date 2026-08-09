import { useCallback, useEffect, useRef, useState } from 'react'
import { loadGameState, saveGameState } from '../lib/storage'
import { normalizeSetupPlayerCount } from '../lib/setupDistribution'
import {
  MAX_PLAYERS,
  type IGameState,
  type IPlayer,
  type LayoutModeT,
  type PlayerMarkColorT,
} from '../types/game'

type PersistSnapshotT = Pick<
  IGameState,
  'players' | 'layoutMode' | 'setupPlayerCount' | 'sharedNotes'
>

const createPlayer = (index: number): IPlayer => ({
  id: crypto.randomUUID(),
  name: `Игрок ${index}`,
  notes: '',
  markColor: null,
})

const toSnapshot = (state: IGameState): PersistSnapshotT => ({
  players: state.players,
  layoutMode: state.layoutMode,
  setupPlayerCount: state.setupPlayerCount,
  sharedNotes: state.sharedNotes,
})

export const useGameStore = () => {
  const [state, setState] = useState<IGameState>(() => {
    const stored = loadGameState()
    return {
      players: stored.players,
      layoutMode: stored.layoutMode,
      setupPlayerCount: stored.setupPlayerCount,
      sharedNotes: stored.sharedNotes,
      selectedPlayerId: null,
    }
  })

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const persistSnapshotRef = useRef<PersistSnapshotT>(toSnapshot(state))

  useEffect(() => {
    persistSnapshotRef.current = toSnapshot(state)
  }, [state])

  const persistState = useCallback((next: PersistSnapshotT, debounceMs = 0) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }

    const write = () => {
      saveGameState(next)
    }

    if (debounceMs > 0) {
      saveTimerRef.current = setTimeout(write, debounceMs)
      return
    }

    write()
  }, [])

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        saveGameState(persistSnapshotRef.current)
      }
    }
  }, [])

  const selectedPlayer =
    state.players.find((player) => player.id === state.selectedPlayerId) ??
    null

  const persistPatch = useCallback(
    (prev: IGameState, patch: Partial<PersistSnapshotT>, debounceMs = 0) => {
      persistState({ ...toSnapshot(prev), ...patch }, debounceMs)
    },
    [persistState],
  )

  const addPlayer = useCallback(() => {
    setState((prev) => {
      if (prev.players.length >= MAX_PLAYERS) return prev

      const player = createPlayer(prev.players.length + 1)
      const players = [...prev.players, player]
      persistPatch(prev, { players })

      return {
        ...prev,
        players,
        selectedPlayerId: player.id,
      }
    })
  }, [persistPatch])

  const selectPlayer = useCallback((playerId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedPlayerId: playerId,
    }))
  }, [])

  const updatePlayerName = useCallback(
    (playerId: string, name: string) => {
      setState((prev) => {
        const players = prev.players.map((player) =>
          player.id === playerId ? { ...player, name } : player,
        )
        persistPatch(prev, { players })
        return { ...prev, players }
      })
    },
    [persistPatch],
  )

  const updatePlayerNotes = useCallback(
    (playerId: string, notes: string) => {
      setState((prev) => {
        const players = prev.players.map((player) =>
          player.id === playerId ? { ...player, notes } : player,
        )
        persistPatch(prev, { players }, 200)
        return { ...prev, players }
      })
    },
    [persistPatch],
  )

  const removePlayer = useCallback(
    (playerId: string) => {
      setState((prev) => {
        const players = prev.players.filter((player) => player.id !== playerId)
        persistPatch(prev, { players })
        return {
          ...prev,
          players,
          selectedPlayerId:
            prev.selectedPlayerId === playerId ? null : prev.selectedPlayerId,
        }
      })
    },
    [persistPatch],
  )

  const togglePlayerMarkColor = useCallback(
    (playerId: string, color: PlayerMarkColorT) => {
      setState((prev) => {
        const players = prev.players.map((player) => {
          if (player.id !== playerId) return player
          const markColor = player.markColor === color ? null : color
          return { ...player, markColor }
        })
        persistPatch(prev, { players })
        return { ...prev, players }
      })
    },
    [persistPatch],
  )

  const swapPlayers = useCallback(
    (playerIdA: string, playerIdB: string) => {
      if (playerIdA === playerIdB) return

      setState((prev) => {
        const indexA = prev.players.findIndex((player) => player.id === playerIdA)
        const indexB = prev.players.findIndex((player) => player.id === playerIdB)
        if (indexA < 0 || indexB < 0) return prev

        const players = [...prev.players]
        const playerA = players[indexA]
        const playerB = players[indexB]
        if (!playerA || !playerB) return prev

        players[indexA] = playerB
        players[indexB] = playerA
        persistPatch(prev, { players })
        return { ...prev, players }
      })
    },
    [persistPatch],
  )

  const setLayoutMode = useCallback(
    (layoutMode: LayoutModeT) => {
      setState((prev) => {
        if (prev.layoutMode === layoutMode) return prev
        persistPatch(prev, { layoutMode })
        return { ...prev, layoutMode }
      })
    },
    [persistPatch],
  )

  const setSetupPlayerCount = useCallback(
    (setupPlayerCount: number) => {
      const nextCount = normalizeSetupPlayerCount(setupPlayerCount)
      setState((prev) => {
        if (prev.setupPlayerCount === nextCount) return prev
        persistPatch(prev, { setupPlayerCount: nextCount })
        return { ...prev, setupPlayerCount: nextCount }
      })
    },
    [persistPatch],
  )

  const updateSharedNotes = useCallback(
    (sharedNotes: string) => {
      setState((prev) => {
        persistPatch(prev, { sharedNotes }, 200)
        return { ...prev, sharedNotes }
      })
    },
    [persistPatch],
  )

  const clearTable = useCallback(() => {
    setState((prev) => {
      persistPatch(prev, { players: [], sharedNotes: '' })
      return {
        ...prev,
        players: [],
        sharedNotes: '',
        selectedPlayerId: null,
      }
    })
  }, [persistPatch])

  const clearPlayerData = useCallback(() => {
    setState((prev) => {
      const players = prev.players.map((player) => ({
        ...player,
        notes: '',
        markColor: null,
      }))
      persistPatch(prev, { players })
      return { ...prev, players }
    })
  }, [persistPatch])

  return {
    players: state.players,
    selectedPlayerId: state.selectedPlayerId,
    selectedPlayer,
    layoutMode: state.layoutMode,
    setupPlayerCount: state.setupPlayerCount,
    sharedNotes: state.sharedNotes,
    canAddPlayer: state.players.length < MAX_PLAYERS,
    addPlayer,
    selectPlayer,
    updatePlayerName,
    updatePlayerNotes,
    togglePlayerMarkColor,
    swapPlayers,
    setLayoutMode,
    setSetupPlayerCount,
    updateSharedNotes,
    removePlayer,
    clearTable,
    clearPlayerData,
  }
}
